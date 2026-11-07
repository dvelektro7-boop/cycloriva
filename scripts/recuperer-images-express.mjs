import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const productsPath = path.join(root, "data", "products.json");
const manifestPath = path.join(root, "data", "migration", "images.json");
const imageRoot = path.join(root, "public", "images", "produits");

const reportPath = path.join(
  root,
  "data",
  "rapport-images-express.json",
);

const API =
  "https://express-online.ch/wp-json/wc/store/v1/products";

const MAX_IMAGES = 5;
const MIN_SCORE = 0.72;
const DELAY = 400;

const mimeExtensions = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

const generic = new Set([
  "velo",
  "velos",
  "bike",
  "ebike",
  "e-bike",
  "electrique",
  "electric",
  "mountainbike",
  "mountain",
  "city",
  "citybike",
  "fully",
  "full",
  "terrain",
  "tout",
  "hybrid",
  "homme",
  "femme",
  "zoll",
]);

const colorGroups = [
  ["noir", "black", "schwarz"],
  ["blanc", "white", "weiss"],
  ["gris", "grey", "gray", "grau"],
  ["bleu", "blue", "blau"],
  ["rouge", "red", "rot"],
  ["vert", "green", "grun"],
  ["jaune", "yellow", "gelb"],
  ["orange"],
  ["rose", "pink", "rosa"],
  ["menthe", "mint"],
  ["peche", "peach"],
  ["violet", "purple"],
  ["turquoise", "tuerkis"],
  ["argent", "silver", "silber"],
  ["anthracite", "anthrazit"],
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function repair(value) {
  if (!value) return "";

  return String(value)
    .replaceAll("VÃ©lo", "Vélo")
    .replaceAll("vÃ©lo", "vélo")
    .replaceAll("Ã©", "é")
    .replaceAll("Ã¨", "è")
    .replaceAll("Ãª", "ê")
    .replaceAll("Ã ", "à")
    .replaceAll("Ã€", "À")
    .replaceAll("Ã‰", "É")
    .replaceAll("Ã´", "ô")
    .replaceAll("Ã»", "û")
    .replaceAll("Ã®", "î")
    .replaceAll("Ã§", "ç")
    .replaceAll("Â", "");
}

function normalize(value) {
  return repair(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.+-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value) {
  return normalize(value)
    .split(" ")
    .filter(Boolean);
}

function importantTokens(value) {
  return [...new Set(
    tokens(value).filter(token => {
      if (generic.has(token)) return false;
      return token.length >= 2;
    }),
  )];
}

function extractSizes(value) {
  const found = new Set();

  for (const match of normalize(value).matchAll(
    /\b(20|24|26|27[.,]5|28|29)\b/g,
  )) {
    found.add(match[1].replace(",", "."));
  }

  return [...found];
}

function detectColor(value) {
  const text = ` ${normalize(value)} `;

  for (const group of colorGroups) {
    for (const variant of group) {
      if (text.includes(` ${normalize(variant)} `)) {
        return group[0];
      }
    }
  }

  return null;
}

function hasLocalImage(product) {
  return Array.isArray(product.images) &&
    product.images.some(
      image =>
        typeof image === "string" &&
        image.startsWith("/images/produits/"),
    );
}

function safeId(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "_");
}

function cleanOldFilename(value) {
  return String(value || "")
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/anzeigebild.*$/i, "")
    .replace(/scaled.*$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function productSignature(product, entries) {
  const name = repair(product.name || "");

  const oldNames = entries
    .map(entry => cleanOldFilename(entry.originalFilename))
    .filter(Boolean);

  const combined = [
    name,
    ...oldNames.slice(0, 4),
  ].join(" ");

  return {
    name,
    oldNames,
    tokens: importantTokens(combined),
    sizes: extractSizes(combined),
    color: detectColor(combined),
  };
}

function searchQueries(signature) {
  const queries = [];

  if (signature.name) {
    queries.push(signature.name);
  }

  const strong = signature.tokens
    .filter(token =>
      token.length >= 4 ||
      token.includes("-") ||
      /\d/.test(token),
    )
    .slice(0, 5)
    .join(" ");

  if (strong) {
    queries.push(strong);
  }

  if (signature.oldNames[0]) {
    queries.push(signature.oldNames[0]);
  }

  return [...new Set(queries)].slice(0, 3);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    redirect: "follow",

    signal: AbortSignal.timeout(30000),

    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",

      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const type =
    response.headers.get("content-type") || "";

  if (!type.includes("json")) {
    throw new Error(
      `Réponse API non JSON : ${type}`,
    );
  }

  return response.json();
}

async function searchProducts(query) {
  const url =
    `${API}?search=${encodeURIComponent(query)}` +
    "&per_page=100";

  await sleep(DELAY);

  const data = await fetchJson(url);

  return Array.isArray(data) ? data : [];
}

function tokenWeight(token) {
  if (token.includes("-")) return 2.8;
  if (/\d/.test(token)) return 2.4;
  if (token.length >= 8) return 2;
  if (token.length >= 5) return 1.5;
  return 1;
}

function candidateScore(signature, candidate) {
  const candidateText = normalize([
    candidate.name,
    candidate.slug,
    candidate.sku,
  ].filter(Boolean).join(" "));

  const haystack = new Set(tokens(candidateText));

  let total = 0;
  let matched = 0;

  for (const token of signature.tokens) {
    const weight = tokenWeight(token);

    total += weight;

    if (haystack.has(token)) {
      matched += weight;
    }
  }

  let score =
    total > 0
      ? matched / total
      : 0;

  const candidateSizes =
    extractSizes(candidateText);

  if (
    signature.sizes.length &&
    candidateSizes.length
  ) {
    const sizeMatch =
      candidateSizes.some(size =>
        signature.sizes.includes(size),
      );

    if (sizeMatch) {
      score += 0.12;
    } else {
      score -= 0.30;
    }
  }

  const candidateColor =
    detectColor(candidateText);

  if (
    signature.color &&
    candidateColor
  ) {
    if (
      signature.color === candidateColor
    ) {
      score += 0.10;
    } else {
      score -= 0.25;
    }
  }

  return Math.max(
    0,
    Math.min(1, score),
  );
}

async function downloadImage(
  url,
  destinationBase,
) {
  const response = await fetch(url, {
    redirect: "follow",

    signal: AbortSignal.timeout(30000),

    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",

      Referer:
        "https://express-online.ch/",

      Accept:
        "image/avif,image/webp,image/png,image/jpeg,image/*,*/*",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Image HTTP ${response.status}`,
    );
  }

  const mime =
    (
      response.headers.get("content-type") ||
      ""
    )
      .split(";")[0]
      .trim()
      .toLowerCase();

  const extension =
    mimeExtensions[mime];

  if (!extension) {
    throw new Error(
      `Type image inconnu : ${mime}`,
    );
  }

  const buffer =
    Buffer.from(
      await response.arrayBuffer(),
    );

  if (buffer.length < 8000) {
    throw new Error(
      "Image trop petite",
    );
  }

  if (buffer.length > 20_000_000) {
    throw new Error(
      "Image trop volumineuse",
    );
  }

  const filename =
    `${destinationBase}.${extension}`;

  await fs.writeFile(
    filename,
    buffer,
  );

  return {
    extension,
    size: buffer.length,
  };
}

async function backupProducts() {
  const timestamp =
    new Date()
      .toISOString()
      .replace(/[:.]/g, "-");

  const backup =
    `${productsPath}.backup-express-${timestamp}`;

  await fs.copyFile(
    productsPath,
    backup,
  );

  return backup;
}

async function main() {
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

  const manifestByProduct =
    new Map();

  for (const entry of manifest) {
    const id =
      String(entry.productId || "");

    if (!manifestByProduct.has(id)) {
      manifestByProduct.set(id, []);
    }

    manifestByProduct
      .get(id)
      .push(entry);
  }

  await fs.mkdir(
    imageRoot,
    {
      recursive: true,
    },
  );

  const missing =
    products.filter(
      product =>
        !hasLocalImage(product),
    );

  const report = {
    date:
      new Date().toISOString(),

    initialWithImages:
      products.length -
      missing.length,

    initiallyMissing:
      missing.length,

    processed: 0,

    recoveredProducts: 0,

    recoveredImages: 0,

    unresolved: 0,

    errors: 0,

    results: [],
  };

  let backupCreated = false;

  console.log("");
  console.log(
    "==============================================",
  );

  console.log(
    " CYCLORIVA — EXPRESS ONLINE IMAGE IMPORT",
  );

  console.log(
    "==============================================",
  );

  console.log(
    `Produits : ${products.length}`,
  );

  console.log(
    `Déjà avec images : ${
      products.length -
      missing.length
    }`,
  );

  console.log(
    `À récupérer : ${missing.length}`,
  );

  console.log("");

  for (
    let index = 0;
    index < missing.length;
    index += 1
  ) {
    const product =
      missing[index];

    const id =
      String(product.id);

    const entries =
      manifestByProduct.get(id) ||
      [];

    const signature =
      productSignature(
        product,
        entries,
      );

    console.log(
      `[${index + 1}/${missing.length}] ${id} — ${
        signature.name ||
        "Produit sans nom"
      }`,
    );

    const queries =
      searchQueries(
        signature,
      );

    const found =
      [];

    try {
      for (const query of queries) {
        const results =
          await searchProducts(query);

        found.push(
          ...results,
        );
      }
    } catch (error) {
      console.log(
        `  ↳ API indisponible : ${
          error.message
        }`,
      );

      report.errors += 1;

      report.results.push({
        id,
        name:
          signature.name,
        status:
          "api-error",
        error:
          String(error.message),
      });

      continue;
    }

    const uniqueCandidates =
      [];

    const seen =
      new Set();

    for (const candidate of found) {
      if (
        seen.has(
          candidate.id,
        )
      ) {
        continue;
      }

      seen.add(
        candidate.id,
      );

      uniqueCandidates.push(
        candidate,
      );
    }

    const ranked =
      uniqueCandidates
        .map(candidate => ({
          candidate,

          score:
            candidateScore(
              signature,
              candidate,
            ),
        }))
        .sort(
          (a, b) =>
            b.score -
            a.score,
        );

    const best =
      ranked[0];

    if (
      !best ||
      best.score <
        MIN_SCORE
    ) {
      console.log(
        `  ↳ aucune correspondance fiable${
          best
            ? ` (${best.score.toFixed(3)})`
            : ""
        }`,
      );

      report.unresolved += 1;

      report.results.push({
        id,
        name:
          signature.name,
        status:
          "unresolved",
        bestScore:
          best
            ?.score ??
          null,
        bestName:
          best
            ?.candidate
            ?.name ??
          null,
      });

      continue;
    }

    const remoteImages =
      Array.isArray(
        best.candidate.images,
      )
        ? best.candidate.images
            .map(image =>
              image?.src ||
              image?.thumbnail,
            )
            .filter(Boolean)
        : [];

    if (!remoteImages.length) {
      console.log(
        "  ↳ produit trouvé mais aucune image",
      );

      report.unresolved += 1;

      continue;
    }

    const folder =
      safeId(id);

    const folderPath =
      path.join(
        imageRoot,
        folder,
      );

    await fs.mkdir(
      folderPath,
      {
        recursive: true,
      },
    );

    const localImages =
      [];

    for (
      const remote of
        remoteImages.slice(
          0,
          MAX_IMAGES,
        )
    ) {
      const number =
        String(
          localImages.length +
          1,
        ).padStart(
          2,
          "0",
        );

      try {
        const downloaded =
          await downloadImage(
            remote,
            path.join(
              folderPath,
              number,
            ),
          );

        localImages.push(
          `/images/produits/${folder}/${number}.${downloaded.extension}`,
        );
      } catch {
        // On continue avec les autres images.
      }
    }

    if (!localImages.length) {
      console.log(
        "  ↳ images non téléchargeables",
      );

      report.unresolved += 1;

      continue;
    }

    if (!backupCreated) {
      const backup =
        await backupProducts();

      backupCreated =
        true;

      console.log(
        `  ↳ sauvegarde : ${path.relative(
          root,
          backup,
        )}`,
      );
    }

    product.images =
      localImages;

    await fs.writeFile(
      productsPath,
      `${JSON.stringify(
        products,
        null,
        2,
      )}\n`,
      "utf8",
    );

    report.recoveredProducts +=
      1;

    report.recoveredImages +=
      localImages.length;

    report.results.push({
      id,
      name:
        signature.name,

      status:
        "recovered",

      sourceProduct:
        best.candidate.name,

      sourceId:
        best.candidate.id,

      sourceSku:
        best.candidate.sku,

      score:
        best.score,

      images:
        localImages,
    });

    console.log(
      `  ↳ OK : ${localImages.length} image(s) — ${best.candidate.name}`,
    );

    await fs.writeFile(
      reportPath,
      JSON.stringify(
        report,
        null,
        2,
      ),
      "utf8",
    );

    report.processed =
      index +
      1;
  }

  const finalWithImages =
    products.filter(
      hasLocalImage,
    ).length;

  report.finalWithImages =
    finalWithImages;

  report.finalWithoutImages =
    products.length -
    finalWithImages;

  await fs.writeFile(
    reportPath,
    JSON.stringify(
      report,
      null,
      2,
    ),
    "utf8",
  );

  console.log("");
  console.log(
    "==============================================",
  );

  console.log(
    " RÉSULTAT",
  );

  console.log(
    "==============================================",
  );

  console.log(
    `Produits avec images : ${finalWithImages}/${products.length}`,
  );

  console.log(
    `Produits encore sans images : ${
      products.length -
      finalWithImages
    }`,
  );

  console.log(
    `Nouveaux produits récupérés : ${report.recoveredProducts}`,
  );

  console.log(
    `Nouvelles images : ${report.recoveredImages}`,
  );

  console.log(
    "Rapport : data/rapport-images-express.json",
  );
}

main().catch(error => {
  console.error(
    "ERREUR FATALE :",
    error,
  );

  process.exitCode = 1;
});