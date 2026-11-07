import fs from "node:fs/promises";
import path from "node:path";

import {
  createClient,
} from "@supabase/supabase-js";

/* =========================================================
   CONFIG
========================================================= */

const SUPABASE_URL =
  process.env.SUPABASE_URL?.trim();

const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY?.trim();

const BUCKET =
  process.env.PRODUCT_IMAGE_BUCKET?.trim() ||
  "develektro-products";

const ROOT_DIR =
  path.resolve(
    process.cwd(),
    "public",
    "products",
  );

const CONCURRENCY = 5;

const MAX_RETRIES = 3;

const CACHE_CONTROL =
  "31536000";

/* =========================================================
   ENV VALIDATION
========================================================= */

if (!SUPABASE_URL) {
  throw new Error(
    "[CYCLORIVA] SUPABASE_URL fehlt.",
  );
}

if (!SUPABASE_SECRET_KEY) {
  throw new Error(
    "[CYCLORIVA] SUPABASE_SECRET_KEY fehlt.",
  );
}

/* =========================================================
   SUPABASE ADMIN CLIENT
========================================================= */

const supabase =
  createClient(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

/* =========================================================
   MIME TYPES
========================================================= */

function getContentType(
  filePath,
) {
  const extension =
    path
      .extname(filePath)
      .toLowerCase();

  switch (extension) {
    case ".webp":
      return "image/webp";

    case ".jpg":
    case ".jpeg":
      return "image/jpeg";

    case ".png":
      return "image/png";

    default:
      return null;
  }
}

/* =========================================================
   WALK DIRECTORY
========================================================= */

async function walk(
  directory,
) {
  const entries =
    await fs.readdir(
      directory,
      {
        withFileTypes: true,
      },
    );

  const files = [];

  for (const entry of entries) {
    const absolutePath =
      path.join(
        directory,
        entry.name,
      );

    if (entry.isDirectory()) {
      files.push(
        ...(await walk(
          absolutePath,
        )),
      );

      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const contentType =
      getContentType(
        absolutePath,
      );

    if (!contentType) {
      continue;
    }

    files.push({
      absolutePath,
      contentType,
    });
  }

  return files;
}

/* =========================================================
   STORAGE PATH

   public/products/84/01.webp
   devient :
   84/01.webp
========================================================= */

function getStoragePath(
  absolutePath,
) {
  return path
    .relative(
      ROOT_DIR,
      absolutePath,
    )
    .split(path.sep)
    .join("/");
}

/* =========================================================
   SLEEP
========================================================= */

function sleep(
  milliseconds,
) {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds,
      );
    },
  );
}

/* =========================================================
   UPLOAD ONE FILE
========================================================= */

async function uploadFile(
  file,
) {
  const storagePath =
    getStoragePath(
      file.absolutePath,
    );

  const buffer =
    await fs.readFile(
      file.absolutePath,
    );

  let lastError =
    null;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt += 1
  ) {
    const {
      error,
    } =
      await supabase.storage
        .from(BUCKET)
        .upload(
          storagePath,
          buffer,
          {
            contentType:
              file.contentType,

            cacheControl:
              CACHE_CONTROL,

            /*
             * Permet de relancer le script
             * sans crÃ©er de doublons.
             */
            upsert: true,
          },
        );

    if (!error) {
      return {
        ok: true,
        storagePath,
        size: buffer.byteLength,
      };
    }

    lastError =
      error;

    if (
      attempt <
      MAX_RETRIES
    ) {
      await sleep(
        attempt * 1000,
      );
    }
  }

  return {
    ok: false,
    storagePath,
    size: buffer.byteLength,
    error:
      lastError?.message ||
      "Unknown upload error",
  };
}

/* =========================================================
   WORKER
========================================================= */

async function runWorkers(
  files,
) {
  let cursor = 0;

  let success = 0;
  let failed = 0;

  let uploadedBytes = 0;

  const failures = [];

  async function worker() {
    while (true) {
      const index =
        cursor++;

      if (
        index >=
        files.length
      ) {
        return;
      }

      const file =
        files[index];

      const relativePath =
        getStoragePath(
          file.absolutePath,
        );

      process.stdout.write(
        `[${index + 1}/${files.length}] ${relativePath} ... `,
      );

      const result =
        await uploadFile(
          file,
        );

      if (result.ok) {
        success += 1;

        uploadedBytes +=
          result.size;

        console.log(
          "OK",
        );
      } else {
        failed += 1;

        failures.push(
          result,
        );

        console.log(
          `ERROR: ${result.error}`,
        );
      }
    }
  }

  await Promise.all(
    Array.from(
      {
        length:
          Math.min(
            CONCURRENCY,
            files.length,
          ),
      },
      () => worker(),
    ),
  );

  return {
    success,
    failed,
    uploadedBytes,
    failures,
  };
}

/* =========================================================
   MAIN
========================================================= */

async function main() {
  console.log("");
  console.log(
    "==============================================",
  );
  console.log(
    " CYCLORIVA â†’ Supabase Product Images",
  );
  console.log(
    "==============================================",
  );
  console.log("");

  console.log(
    `Source : ${ROOT_DIR}`,
  );

  console.log(
    `Bucket : ${BUCKET}`,
  );

  console.log("");

  let files;

  try {
    files =
      await walk(
        ROOT_DIR,
      );
  } catch (error) {
    throw new Error(
      `Der Ordner public/products konnte nicht gelesen werden: ${
        error instanceof Error
          ? error.message
          : "Unknown error"
      }`,
    );
  }

  if (
    files.length === 0
  ) {
    console.log(
      "Aucune image trouvÃ©e.",
    );

    return;
  }

  console.log(
    `${files.length} image(s) trouvÃ©e(s).`,
  );

  console.log("");

  const result =
    await runWorkers(
      files,
    );

  console.log("");
  console.log(
    "==============================================",
  );
  console.log(
    " RÃ‰SULTAT",
  );
  console.log(
    "==============================================",
  );

  console.log(
    `RÃ©ussies : ${result.success}`,
  );

  console.log(
    `Ã‰checs   : ${result.failed}`,
  );

  console.log(
    `EnvoyÃ©   : ${(result.uploadedBytes / 1024 / 1024).toFixed(2)} MB`,
  );

  if (
    result.failures.length >
    0
  ) {
    const reportPath =
      path.resolve(
        process.cwd(),
        "data",
        "supabase-image-upload-errors.json",
      );

    await fs.writeFile(
      reportPath,
      JSON.stringify(
        result.failures,
        null,
        2,
      ),
      "utf8",
    );

    console.log("");
    console.log(
      `Rapport erreurs : ${reportPath}`,
    );

    process.exitCode =
      1;
  } else {
    console.log("");
    console.log(
      "Toutes les images ont Ã©tÃ© envoyÃ©es avec succÃ¨s.",
    );
  }
}

main().catch(
  (error) => {
    console.error("");
    console.error(
      "[SUPABASE_PRODUCT_UPLOAD_ERROR]",
      error instanceof Error
        ? error.message
        : error,
    );

    process.exitCode =
      1;
  },
);
