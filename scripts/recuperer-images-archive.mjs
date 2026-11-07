import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const productsPath = path.join(
  root,
  "data",
  "products.json",
);

const manifestPath = path.join(
  root,
  "data",
  "migration",
  "images.json",
);

const outputRoot = path.join(
  root,
  "public",
  "images",
  "produits",
);

const reportPath = path.join(
  root,
  "data",
  "rapport-images-archive.json",
);

const args = process.argv.slice(2);


function getArg(name) {
  const prefix = `--${name}=`;

  const value = args.find(
    (arg) => arg.startsWith(prefix),
  );

  return value
    ? value.slice(prefix.length)
    : null;
}

const limitValue = Number(
  getArg("limit"),
);

const limit =
  Number.isFinite(limitValue) &&
  limitValue > 0
    ? Math.floor(limitValue)
    : null;

const MAX_IMAGES_PER_PRODUCT = 12;

const REQUEST_TIMEOUT = 45000;

const ARCHIVE_DELAY = 450;

const imageExtensions = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

function sleep(ms) {
  return new Promise(
    (resolve) => setTimeout(resolve, ms),
  );
}

function hasLocalImages(product) {
  return (
    Array.isArray(product?.images) &&
    product.images.some(
      (image) =>
        typeof image === "string" &&
        image.startsWith(
          "/images/produits/",
        ),
    )
  );
}

function safeId(value) {
  return String(value).replace(
    /[^a-zA-Z0-9_-]/g,
    "_",
  );
}

async function fetchWithRetry(
  url,
  options = {},
  retries = 3,
) {
  let lastError;

  for (
    let attempt = 1;
    attempt <= retries;
    attempt += 1
  ) {
    try {
      const response = await fetch(url, {
        redirect: "follow",

        signal: AbortSignal.timeout(
          REQUEST_TIMEOUT,
        ),

        headers: {
          "User-Agent":
            "Mozilla/5.0 CYCLORIVA Image Recovery",

          Accept:
            "*/*",

          ...options.headers,
        },

        ...options,
      });

      if (
        response.status === 429 ||
        response.status >= 500
      ) {
        throw new Error(
          `HTTP ${response.status}`,
        );
      }

      return response;
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await sleep(
          1500 * attempt,
        );
      }
    }
  }

  throw lastError;
}

async function findArchiveSnapshot(
  originalUrl,
) {
  /*
   * Première méthode :
   * Wayback Availability API.
   */

  const availabilityUrl =
    "https://archive.org/wayback/available" +
    `?url=${encodeURIComponent(originalUrl)}`;

  try {
    const response =
      await fetchWithRetry(
        availabilityUrl,
      );

    if (response.ok) {
      const json =
        await response.json();

      const closest =
        json?.archived_snapshots?.closest;

      if (
        closest?.available &&
        closest?.status === "200" &&
        closest?.timestamp
      ) {
        return {
          timestamp:
            String(closest.timestamp),

          originalUrl,

          method:
            "availability",
        };
      }
    }
  } catch {
    // On essaie ensuite CDX.
  }

  /*
   * Deuxième méthode :
   * CDX API.
   */

  const cdxUrl =
    "https://web.archive.org/cdx/search/cdx" +
    `?url=${encodeURIComponent(originalUrl)}` +
    "&output=json" +
    "&filter=statuscode:200" +
    "&fl=timestamp,original,statuscode,mimetype" +
    "&collapse=digest" +
    "&limit=5";

  try {
    const response =
      await fetchWithRetry(
        cdxUrl,
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    if (
      !Array.isArray(data) ||
      data.length < 2
    ) {
      return null;
    }

    /*
     * Première ligne = noms des colonnes.
     */

    for (
      const row of data.slice(1).reverse()
    ) {
      if (!Array.isArray(row)) {
        continue;
      }

      const [
        timestamp,
        archivedOriginal,
        status,
        mime,
      ] = row;

      if (
        status !== "200"
      ) {
        continue;
      }

      if (
        mime &&
        !String(mime).startsWith("image/")
      ) {
        continue;
      }

      return {
        timestamp:
          String(timestamp),

        originalUrl:
          archivedOriginal ||
          originalUrl,

        method:
          "cdx",
      };
    }
  } catch {
    return null;
  }

  return null;
}

function buildRawArchiveUrl(
  snapshot,
) {
  /*
   * id_ demande à Wayback de retourner le fichier
   * archivé sans réécriture HTML.
   */

  return (
    `https://web.archive.org/web/` +
    `${snapshot.timestamp}id_/` +
    `${snapshot.originalUrl}`
  );
}

async function downloadArchivedImage(
  snapshot,
) {
  const archiveUrl =
    buildRawArchiveUrl(
      snapshot,
    );

  const response =
    await fetchWithRetry(
      archiveUrl,
      {
        headers: {
          Accept:
            "image/avif,image/webp,image/png,image/jpeg,image/*,*/*",
        },
      },
    );

  if (!response.ok) {
    throw new Error(
      `Archive HTTP ${response.status}`,
    );
  }

  const mime =
    (
      response.headers.get(
        "content-type",
      ) || ""
    )
      .split(";")[0]
      .trim()
      .toLowerCase();

  const extension =
    imageExtensions[mime];

  if (!extension) {
    throw new Error(
      `Réponse non image : ${
        mime || "type inconnu"
      }`,
    );
  }

  const buffer =
    Buffer.from(
      await response.arrayBuffer(),
    );

  if (!buffer.length) {
    throw new Error(
      "Image archivée vide",
    );
  }

  if (
    buffer.length >
    20_000_000
  ) {
    throw new Error(
      "Image supérieure à 20 Mo",
    );
  }

  return {
    buffer,
    extension,
    mime,
    archiveUrl,
  };
}

function hashBuffer(buffer) {
  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");
}

async function backupProducts() {
  const timestamp =
    new Date()
      .toISOString()
      .replace(/[:.]/g, "-");

  const backupPath =
    `${productsPath}.backup-archive-${timestamp}`;

  await fs.copyFile(
    productsPath,
    backupPath,
  );

  return backupPath;
}

async function main() {
  console.log("");
  console.log(
    "==================================================",
  );
  console.log(
    " CYCLORIVA — RÉCUPÉRATION DES IMAGES ARCHIVÉES",
  );
  console.log(
    "==================================================",
  );
  console.log("");

  const products =
    JSON.parse(
      await fs.readFile(
        productsPath,
        "utf8",
      ),
    );

  const manifest =
    JSON.parse(
      await fs.readFile(
        manifestPath,
        "utf8",
      ),
    );

  if (
    !Array.isArray(products) ||
    !Array.isArray(manifest)
  ) {
    throw new Error(
      "products.json ou images.json invalide.",
    );
  }

  const manifestByProduct =
    new Map();

  for (const entry of manifest) {
    const id =
      String(
        entry?.productId ?? "",
      );

    if (!id) {
      continue;
    }

    if (
      !manifestByProduct.has(id)
    ) {
      manifestByProduct.set(
        id,
        [],
      );
    }

    manifestByProduct
      .get(id)
      .push(entry);
  }

  const missingProducts =
    products.filter(
      (product) =>
        !hasLocalImages(product),
    );

  const productsToProcess =
    limit
      ? missingProducts.slice(
          0,
          limit,
        )
      : missingProducts;

  console.log(
    `Produits totaux : ${products.length}`,
  );

  console.log(
    `Déjà illustrés : ${
      products.length -
      missingProducts.length
    }`,
  );

  console.log(
    `Sans image : ${missingProducts.length}`,
  );

  console.log(
    `Produits traités maintenant : ${productsToProcess.length}`,
  );

  console.log("");

  const report = {
    date:
      new Date().toISOString(),

    totalProducts:
      products.length,

    alreadyIllustrated:
      products.length -
      missingProducts.length,

    initiallyMissing:
      missingProducts.length,

    processed:
      0,

    productsRecovered:
      0,

    imagesRecovered:
      0,

    productsStillMissing:
      0,

    archiveUnavailable:
      0,

    downloadFailures:
      0,

    results:
      [],
  };

  let productsChanged =
    false;

  for (
    let productIndex = 0;
    productIndex <
    productsToProcess.length;
    productIndex += 1
  ) {
    const product =
      productsToProcess[
        productIndex
      ];

    const productId =
      String(product.id);

    const entries =
      manifestByProduct.get(
        productId,
      ) || [];

    console.log(
      `[${productIndex + 1}/${productsToProcess.length}] ${productId} — ${
        product.name ||
        "Produit sans nom"
      }`,
    );

    report.processed += 1;

    const productReport = {
      productId,

      productName:
        product.name || null,

      historicalImages:
        entries.length,

      recoveredImages:
        0,

      localImages:
        [],

      unavailable:
        [],

      failures:
        [],
    };

    if (!entries.length) {
      report.productsStillMissing +=
        1;

      report.results.push(
        productReport,
      );

      console.log(
        "  ↳ aucune référence historique",
      );

      continue;
    }

    const folderName =
      safeId(
        productId,
      );

    const productFolder =
      path.join(
        outputRoot,
        folderName,
      );

    await fs.mkdir(
      productFolder,
      {
        recursive: true,
      },
    );

    const localImages = [];

    const seenHashes =
      new Set();

    /*
     * On traite les anciennes images
     * dans leur ordre d'origine.
     */

    for (const entry of entries) {
      if (
        localImages.length >=
        MAX_IMAGES_PER_PRODUCT
      ) {
        break;
      }

      const originalUrl =
        String(
          entry?.sourceUrl ?? "",
        ).trim();

      if (
        !/^https?:\/\//i.test(
          originalUrl,
        )
      ) {
        continue;
      }

      await sleep(
        ARCHIVE_DELAY,
      );

      let snapshot;

      try {
        snapshot =
          await findArchiveSnapshot(
            originalUrl,
          );
      } catch (error) {
        productReport.failures.push({
          originalUrl,

          stage:
            "archive-search",

          error:
            String(
              error?.message ||
              error,
            ),
        });

        continue;
      }

      if (!snapshot) {
        report.archiveUnavailable +=
          1;

        productReport.unavailable.push(
          originalUrl,
        );

        continue;
      }

      try {
        const downloaded =
          await downloadArchivedImage(
            snapshot,
          );

        const hash =
          hashBuffer(
            downloaded.buffer,
          );

        /*
         * Certaines anciennes URLs peuvent
         * pointer vers la même image.
         */

        if (
          seenHashes.has(hash)
        ) {
          continue;
        }

        seenHashes.add(hash);

        const number =
          String(
            localImages.length +
            1,
          ).padStart(
            2,
            "0",
          );

        const filename =
          `${number}.${downloaded.extension}`;

        const destination =
          path.join(
            productFolder,
            filename,
          );

        await fs.writeFile(
          destination,
          downloaded.buffer,
        );

        const localPath =
          `/images/produits/${folderName}/${filename}`;

        localImages.push(
          localPath,
        );

        productReport.localImages.push({
          local:
            localPath,

          originalUrl,

          archiveUrl:
            downloaded.archiveUrl,

          archiveMethod:
            snapshot.method,

          bytes:
            downloaded.buffer.length,
        });

        console.log(
          `  ↳ image ${number} récupérée`,
        );
      } catch (error) {
        report.downloadFailures +=
          1;

        productReport.failures.push({
          originalUrl,

          stage:
            "download",

          error:
            String(
              error?.message ||
              error,
            ),
        });
      }
    }

    productReport.recoveredImages =
      localImages.length;

    if (
      localImages.length > 0
    ) {
      /*
       * Ce produit n'avait aucune image locale.
       * On ajoute uniquement les archives
       * réellement récupérées.
       */

      product.images =
        localImages;

      productsChanged =
        true;

      report.productsRecovered +=
        1;

      report.imagesRecovered +=
        localImages.length;

      console.log(
        `  ↳ TERMINÉ : ${localImages.length} image(s)`,
      );
    } else {
      report.productsStillMissing +=
        1;

      console.log(
        "  ↳ aucune archive retrouvée",
      );
    }

    report.results.push(
      productReport,
    );
  }

  if (productsChanged) {
    const backupPath =
      await backupProducts();

    await fs.writeFile(
      productsPath,
      `${JSON.stringify(
        products,
        null,
        2,
      )}\n`,
      "utf8",
    );

    console.log("");
    console.log(
      `Sauvegarde : ${path.relative(
        root,
        backupPath,
      )}`,
    );
  }

  /*
   * Recalcul réel après traitement.
   */

  const finalWithImages =
    products.filter(
      hasLocalImages,
    ).length;

  const finalWithoutImages =
    products.length -
    finalWithImages;

  report.finalProductsWithImages =
    finalWithImages;

  report.finalProductsWithoutImages =
    finalWithoutImages;

  await fs.writeFile(
    reportPath,
    `${JSON.stringify(
      report,
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log("");
  console.log(
    "==================================================",
  );
  console.log(
    " RÉSULTAT FINAL",
  );
  console.log(
    "==================================================",
  );

  console.log(
    `Produits avec images : ${finalWithImages}/${products.length}`,
  );

  console.log(
    `Produits encore sans image : ${finalWithoutImages}`,
  );

  console.log(
    `Nouveaux produits récupérés : ${report.productsRecovered}`,
  );

  console.log(
    `Nouvelles images récupérées : ${report.imagesRecovered}`,
  );

  console.log(
    `Archives introuvables : ${report.archiveUnavailable}`,
  );

  console.log(
    `Échecs téléchargement : ${report.downloadFailures}`,
  );

  console.log(
    "Rapport : data/rapport-images-archive.json",
  );

  console.log("");
}

main().catch(
  (error) => {
    console.error("");
    console.error(
      "ERREUR FATALE :",
      error,
    );

    process.exitCode =
      1;
  },
);