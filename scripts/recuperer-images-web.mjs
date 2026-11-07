import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const productsPath = path.join(root, "data", "products.json");
const manifestPath = path.join(
  root,
  "data",
  "migration",
  "images.json",
);

const imageRoot = path.join(
  root,
  "public",
  "images",
  "produits",
);

const workDir = path.join(
  root,
  ".image-work",
);

const cachePath = path.join(
  workDir,
  "recherche-web-cache.json",
);

const reportPath = path.join(
  root,
  "data",
  "rapport-images-web.json",
);

/* =========================================================
   OPTIONS
========================================================= */

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

const limitValue =
  Number(getArg("limit"));

const limit =
  Number.isFinite(limitValue) &&
  limitValue > 0
    ? Math.floor(limitValue)
    : null;

const minScoreValue =
  Number(getArg("min-score"));

const minScore =
  Number.isFinite(minScoreValue) &&
  minScoreValue > 0
    ? minScoreValue
    : 0.78;

const maxImagesValue =
  Number(getArg("max-images"));

const maxImages =
  Number.isFinite(maxImagesValue) &&
  maxImagesValue > 0
    ? Math.min(
        8,
        Math.floor(maxImagesValue),
      )
    : 5;

const force =
  args.includes("--force");

/* =========================================================
   CONFIG
========================================================= */

const SEARCH_DELAY =
  800;

const PAGE_DELAY =
  350;

const REQUEST_TIMEOUT =
  30000;

const MAX_CANDIDATES =
  6;

const MAX_IMAGE_BYTES =
  20_000_000;

const MIN_IMAGE_BYTES =
  12_000;

const mimeExtensions = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

const genericWords =
  new Set([
    "velo",
    "velos",
    "bike",
    "bikes",
    "ebike",
    "e-bike",
    "electrique",
    "electric",
    "elektrisch",
    "mountainbike",
    "mountain",
    "mtb",
    "city",
    "citybike",
    "fully",
    "full",
    "hybrid",
    "product",
    "produit",
    "terrain",
    "tout",
    "zoll",
    "fahrrad",
    "homme",
    "femme",
  ]);

const colors = [
  ["noir", "black", "schwarz"],
  ["blanc", "white", "weiss", "weiß"],
  ["gris", "grey", "gray", "grau"],
  ["bleu", "blue", "blau"],
  ["rouge", "red", "rot"],
  ["vert", "green", "gruen", "grün"],
  ["jaune", "yellow", "gelb"],
  ["orange"],
  ["rose", "pink", "rosa"],
  ["menthe", "mint"],
  ["peche", "pêche", "peach"],
  ["violet", "purple", "lila"],
  ["turquoise", "tuerkis", "türkis"],
  ["bronze"],
  ["argent", "silver", "silber"],
  ["anthracite", "anthrazit"],
];

const blockedHosts = [
  "facebook.com",
  "instagram.com",
  "pinterest.com",
  "youtube.com",
  "tiktok.com",
  "twitter.com",
  "x.com",
];

const blockedImageWords = [
  "logo",
  "favicon",
  "icon",
  "sprite",
  "avatar",
  "banner",
  "cookie",
  "payment",
  "paypal",
  "visa",
  "mastercard",
  "placeholder",
  "loading",
  "spinner",
  "tracking",
  "pixel",
];

/* =========================================================
   UTILS
========================================================= */

function sleep(ms) {
  return new Promise(
    (resolve) =>
      setTimeout(resolve, ms),
  );
}

function repairText(value) {
  const input =
    String(value ?? "");

  if (
    !/[ÃÂ]/.test(input)
  ) {
    return input;
  }

  try {
    const repaired =
      Buffer.from(
        input,
        "latin1",
      ).toString(
        "utf8",
      );

    return repaired;
  } catch {
    return input;
  }
}

function normalize(value) {
  return repairText(
    value,
  )
    .normalize("NFKD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /ß/g,
      "ss",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9.+-]+/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function tokens(value) {
  return normalize(
    value,
  )
    .split(" ")
    .filter(Boolean);
}

function unique(array) {
  return [
    ...new Set(array),
  ];
}

function importantTokens(
  value,
) {
  return unique(
    tokens(value).filter(
      (token) => {
        if (
          genericWords.has(
            token,
          )
        ) {
          return false;
        }

        return (
          token.length >=
          2
        );
      },
    ),
  );
}

function hasLocalImages(
  product,
) {
  return (
    Array.isArray(
      product?.images,
    ) &&
    product.images.some(
      (image) =>
        typeof image ===
          "string" &&
        image.startsWith(
          "/images/produits/",
        ),
    )
  );
}

function safeId(value) {
  return String(
    value,
  ).replace(
    /[^a-zA-Z0-9_-]/g,
    "_",
  );
}

function decodeHtml(value) {
  return String(
    value ?? "",
  )
    .replace(
      /&amp;/g,
      "&",
    )
    .replace(
      /&quot;/g,
      '"',
    )
    .replace(
      /&#39;/g,
      "'",
    )
    .replace(
      /&apos;/g,
      "'",
    )
    .replace(
      /&lt;/g,
      "<",
    )
    .replace(
      /&gt;/g,
      ">",
    );
}

function stripHtml(value) {
  return decodeHtml(
    String(
      value ?? "",
    ).replace(
      /<[^>]+>/g,
      " ",
    ),
  )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

/* =========================================================
   TAILLES / COULEURS
========================================================= */

function extractSizes(
  value,
) {
  const text =
    normalize(value);

  const found =
    new Set();

  const regex =
    /\b(20|24|26|27[.,]5|28|29)\b/g;

  for (
    const match of
      text.matchAll(regex)
  ) {
    found.add(
      match[1].replace(
        ",",
        ".",
      ),
    );
  }

  return [
    ...found,
  ];
}

function detectColor(
  value,
) {
  const text =
    ` ${normalize(value)} `;

  for (
    const group of
      colors
  ) {
    for (
      const variant of
        group
    ) {
      if (
        text.includes(
          ` ${normalize(
            variant,
          )} `,
        )
      ) {
        return group[0];
      }
    }
  }

  return null;
}

/* =========================================================
   MANIFEST
========================================================= */

function buildSignature(
  product,
  manifestEntries,
) {
  const name =
    repairText(
      product?.name ??
        product?.title ??
        "",
    );

  const oldNames =
    manifestEntries
      .map(
        (entry) =>
          entry?.originalFilename,
      )
      .filter(Boolean)
      .map(
        (filename) =>
          String(filename)
            .replace(
              /\.[a-z0-9]+$/i,
              "",
            )
            .replace(
              /anzeigebild.*$/i,
              "",
            )
            .replace(
              /scaled.*$/i,
              "",
            ),
      );

  const allText =
    [
      name,
      ...oldNames.slice(
        0,
        4,
      ),
    ].join(
      " ",
    );

  const strongTokens =
    importantTokens(
      allText,
    )
      .filter(
        (token) =>
          token.length >=
            4 ||
          /\d/.test(
            token,
          ) ||
          token.includes(
            "-",
          ),
      )
      .slice(
        0,
        15,
      );

  return {
    id:
      String(
        product.id,
      ),

    name,

    oldNames,

    sizes:
      extractSizes(
        allText,
      ),

    color:
      detectColor(
        allText,
      ),

    strongTokens,
  };
}

/* =========================================================
   SEARCH QUERIES
========================================================= */

function buildQueries(
  signature,
) {
  const queries =
    [];

  if (
    signature.name
  ) {
    queries.push(
      `"${signature.name}"`,
    );
  }

  const modelTokens =
    signature.strongTokens
      .slice(
        0,
        5,
      )
      .join(
        " ",
      );

  if (
    modelTokens
  ) {
    queries.push(
      `"${modelTokens}" ${
        signature.sizes.join(
          " ",
        )
      } ${
        signature.color ??
        ""
      }`,
    );
  }

  if (
    signature.oldNames[
      0
    ]
  ) {
    const cleaned =
      signature.oldNames[
        0
      ]
        .replace(
          /[-_]+/g,
          " ",
        )
        .replace(
          /\s+/g,
          " ",
        )
        .trim();

    queries.push(
      `"${cleaned}"`,
    );
  }

  return unique(
    queries,
  ).slice(
    0,
    3,
  );
}

/* =========================================================
   HTTP
========================================================= */

async function fetchRetry(
  url,
  {
    headers = {},
    attempts = 3,
  } = {},
) {
  let lastError;

  for (
    let attempt =
      1;
    attempt <=
    attempts;
    attempt +=
      1
  ) {
    try {
      const response =
        await fetch(
          url,
          {
            redirect:
              "follow",

            signal:
              AbortSignal.timeout(
                REQUEST_TIMEOUT,
              ),

            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",

              Accept:
                "text/html,application/xhtml+xml,application/xml,image/avif,image/webp,image/png,image/jpeg,*/*",

              "Accept-Language":
                "fr-FR,fr;q=0.9,en;q=0.8,de;q=0.7",

              ...headers,
            },
          },
        );

      if (
        response.status ===
          429 ||
        response.status >=
          500
      ) {
        throw new Error(
          `HTTP ${response.status}`,
        );
      }

      return response;
    } catch (
      error
    ) {
      lastError =
        error;

      if (
        attempt <
        attempts
      ) {
        await sleep(
          1200 *
          attempt,
        );
      }
    }
  }

  throw lastError;
}

/* =========================================================
   BING RSS SEARCH
========================================================= */

function parseRss(
  xml,
) {
  const results =
    [];

  const items =
    String(xml).match(
      /<item\b[\s\S]*?<\/item>/gi,
    ) ?? [];

  for (
    const item of
      items
  ) {
    function getTag(
      tag,
    ) {
      const match =
        item.match(
          new RegExp(
            `<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`,
            "i",
          ),
        );

      return match
        ? decodeHtml(
            match[1],
          )
        : "";
    }

    const title =
      stripHtml(
        getTag(
          "title",
        ),
      );

    const description =
      stripHtml(
        getTag(
          "description",
        ),
      );

    const url =
      stripHtml(
        getTag(
          "link",
        ),
      );

    if (
      !url.startsWith(
        "http",
      )
    ) {
      continue;
    }

    results.push({
      title,
      description,
      url,
    });
  }

  return results;
}

function blockedHost(
  url,
) {
  try {
    const hostname =
      new URL(
        url,
      ).hostname.toLowerCase();

    return blockedHosts.some(
      (blocked) =>
        hostname ===
          blocked ||
        hostname.endsWith(
          `.${blocked}`,
        ),
    );
  } catch {
    return true;
  }
}

async function searchWeb(
  query,
  cache,
) {
  const key =
    normalize(query);

  if (
    Array.isArray(
      cache[key],
    )
  ) {
    return cache[
      key
    ];
  }

  await sleep(
    SEARCH_DELAY,
  );

  const url =
    "https://www.bing.com/search" +
    `?q=${encodeURIComponent(
      query,
    )}` +
    "&format=rss";

  const response =
    await fetchRetry(
      url,
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `Recherche HTTP ${response.status}`,
    );
  }

  const xml =
    await response.text();

  const results =
    parseRss(
      xml,
    )
      .filter(
        (result) =>
          !blockedHost(
            result.url,
          ),
      )
      .slice(
        0,
        10,
      );

  cache[
    key
  ] =
    results;

  await fs.writeFile(
    cachePath,
    JSON.stringify(
      cache,
      null,
      2,
    ),
    "utf8",
  );

  return results;
}

/* =========================================================
   MATCHING
========================================================= */

function weight(
  token,
) {
  if (
    /\d/.test(
      token,
    )
  ) {
    return 2.3;
  }

  if (
    token.includes(
      "-",
    )
  ) {
    return 2.5;
  }

  if (
    token.length >=
    8
  ) {
    return 2;
  }

  if (
    token.length >=
    5
  ) {
    return 1.5;
  }

  return 1;
}

function tokenScore(
  signature,
  value,
) {
  const haystack =
    new Set(
      tokens(
        value,
      ),
    );

  let total =
    0;

  let matched =
    0;

  for (
    const token of
      signature.strongTokens
  ) {
    const w =
      weight(
        token,
      );

    total +=
      w;

    if (
      haystack.has(
        token,
      )
    ) {
      matched +=
        w;
    }
  }

  return total
    ? matched /
      total
    : 0;
}

function pageHasWrongSize(
  signature,
  text,
) {
  if (
    !signature.sizes.length
  ) {
    return false;
  }

  const pageSizes =
    extractSizes(
      text,
    );

  if (
    !pageSizes.length
  ) {
    return false;
  }

  const wanted =
    new Set(
      signature.sizes,
    );

  return (
    !pageSizes.some(
      (size) =>
        wanted.has(
          size,
        ),
    )
  );
}

function pageHasWrongColor(
  signature,
  text,
) {
  if (
    !signature.color
  ) {
    return false;
  }

  const found =
    detectColor(
      text,
    );

  return (
    Boolean(found) &&
    found !==
      signature.color
  );
}

function scoreResult(
  signature,
  result,
) {
  const text =
    `${result.title} ${result.description} ${result.url}`;

  let score =
    tokenScore(
      signature,
      text,
    ) *
    0.82;

  if (
    signature.sizes.some(
      (size) =>
        normalize(
          text,
        ).includes(
          size,
        ),
    )
  ) {
    score +=
      0.10;
  }

  if (
    signature.color &&
    detectColor(
      text,
    ) ===
      signature.color
  ) {
    score +=
      0.08;
  }

  if (
    pageHasWrongSize(
      signature,
      text,
    )
  ) {
    score -=
      0.25;
  }

  if (
    pageHasWrongColor(
      signature,
      text,
    )
  ) {
    score -=
      0.18;
  }

  return Math.max(
    0,
    Math.min(
      1,
      score,
    ),
  );
}

/* =========================================================
   PAGE
========================================================= */

function getMeta(
  html,
  key,
  type =
    "property",
) {
  const escaped =
    key.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

  const patterns = [
    new RegExp(
      `<meta[^>]+${type}=["']${escaped}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),

    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+${type}=["']${escaped}["']`,
      "i",
    ),
  ];

  for (
    const pattern of
      patterns
  ) {
    const match =
      html.match(
        pattern,
      );

    if (
      match
    ) {
      return decodeHtml(
        match[1],
      );
    }
  }

  return "";
}

function getTitle(
  html,
) {
  const og =
    getMeta(
      html,
      "og:title",
    );

  if (
    og
  ) {
    return stripHtml(
      og,
    );
  }

  const match =
    html.match(
      /<title[^>]*>([\s\S]*?)<\/title>/i,
    );

  return match
    ? stripHtml(
        match[1],
      )
    : "";
}

function getDescription(
  html,
) {
  return (
    stripHtml(
      getMeta(
        html,
        "og:description",
      ),
    ) ||
    stripHtml(
      getMeta(
        html,
        "description",
        "name",
      ),
    )
  );
}

async function fetchPage(
  url,
) {
  await sleep(
    PAGE_DELAY,
  );

  const response =
    await fetchRetry(
      url,
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `Page HTTP ${response.status}`,
    );
  }

  const type =
    (
      response.headers.get(
        "content-type",
      ) ?? ""
    ).toLowerCase();

  if (
    !type.includes(
      "text/html",
    )
  ) {
    throw new Error(
      "Page non HTML",
    );
  }

  const html =
    await response.text();

  return {
    url:
      response.url ||
      url,

    html,

    title:
      getTitle(
        html,
      ),

    description:
      getDescription(
        html,
      ),
  };
}

/* =========================================================
   JSON-LD PRODUCT IMAGES
========================================================= */

function collectImagesFromJsonLd(
  value,
  output,
) {
  if (
    !value
  ) {
    return;
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    for (
      const item of
        value
    ) {
      collectImagesFromJsonLd(
        item,
        output,
      );
    }

    return;
  }

  if (
    typeof value !==
    "object"
  ) {
    return;
  }

  const type =
    value[
      "@type"
    ];

  const isProduct =
    type ===
      "Product" ||
    (
      Array.isArray(
        type,
      ) &&
      type.includes(
        "Product",
      )
    );

  if (
    isProduct
  ) {
    const images =
      value.image;

    if (
      typeof images ===
      "string"
    ) {
      output.push(
        images,
      );
    }

    if (
      Array.isArray(
        images,
      )
    ) {
      for (
        const image of
          images
      ) {
        if (
          typeof image ===
          "string"
        ) {
          output.push(
            image,
          );
        }

        if (
          image?.url
        ) {
          output.push(
            image.url,
          );
        }
      }
    }

    if (
      images?.url
    ) {
      output.push(
        images.url,
      );
    }
  }

  if (
    value[
      "@graph"
    ]
  ) {
    collectImagesFromJsonLd(
      value[
        "@graph"
      ],
      output,
    );
  }
}

function extractJsonLdImages(
  html,
) {
  const output =
    [];

  const regex =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  for (
    const match of
      html.matchAll(
        regex,
      )
  ) {
    try {
      const json =
        JSON.parse(
          match[1]
            .replace(
              /&quot;/g,
              '"',
            )
            .trim(),
        );

      collectImagesFromJsonLd(
        json,
        output,
      );
    } catch {
      // ignorer
    }
  }

  return output;
}

/* =========================================================
   IMAGE URLS
========================================================= */

function absoluteUrl(
  value,
  base,
) {
  if (
    !value
  ) {
    return null;
  }

  try {
    const decoded =
      decodeHtml(
        value,
      )
        .replace(
          /\\u002F/gi,
          "/",
        )
        .replace(
          /\\\//g,
          "/",
        );

    const url =
      new URL(
        decoded,
        base,
      );

    if (
      !/^https?:$/.test(
        url.protocol,
      )
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function blockedImage(
  url,
) {
  const lower =
    normalize(
      url,
    );

  return blockedImageWords.some(
    (word) =>
      lower.includes(
        normalize(
          word,
        ),
      ),
  );
}

function extractImages(
  page,
) {
  const images =
    [];

  images.push(
    ...extractJsonLdImages(
      page.html,
    ),
  );

  for (
    const metaName of
      [
        "og:image",
        "og:image:secure_url",
      ]
  ) {
    const value =
      getMeta(
        page.html,
        metaName,
      );

    if (
      value
    ) {
      images.push(
        value,
      );
    }
  }

  const twitter =
    getMeta(
      page.html,
      "twitter:image",
      "name",
    );

  if (
    twitter
  ) {
    images.push(
      twitter,
    );
  }

  return unique(
    images
      .map(
        (image) =>
          absoluteUrl(
            image,
            page.url,
          ),
      )
      .filter(Boolean)
      .filter(
        (image) =>
          !blockedImage(
            image,
          ),
      ),
  );
}

/* =========================================================
   IMAGE DOWNLOAD
========================================================= */

function hash(
  buffer,
) {
  return crypto
    .createHash(
      "sha256",
    )
    .update(
      buffer,
    )
    .digest(
      "hex",
    );
}

async function downloadImage(
  url,
  basePath,
  referer,
) {
  const response =
    await fetchRetry(
      url,
      {
        headers: {
          Referer:
            referer,

          Accept:
            "image/avif,image/webp,image/png,image/jpeg,image/*,*/*",
        },
      },
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `Image HTTP ${response.status}`,
    );
  }

  const mime =
    (
      response.headers.get(
        "content-type",
      ) ?? ""
    )
      .split(";")[0]
      .trim()
      .toLowerCase();

  const extension =
    mimeExtensions[
      mime
    ];

  if (
    !extension
  ) {
    throw new Error(
      `Pas une image : ${mime}`,
    );
  }

  const buffer =
    Buffer.from(
      await response.arrayBuffer(),
    );

  if (
    buffer.length <
    MIN_IMAGE_BYTES
  ) {
    throw new Error(
      "Image trop petite",
    );
  }

  if (
    buffer.length >
    MAX_IMAGE_BYTES
  ) {
    throw new Error(
      "Image trop lourde",
    );
  }

  const filename =
    `${basePath}.${extension}`;

  await fs.writeFile(
    filename,
    buffer,
  );

  return {
    buffer,
    extension,
    filename,
  };
}

/* =========================================================
   BACKUP
========================================================= */

async function backupProducts() {
  const timestamp =
    new Date()
      .toISOString()
      .replace(
        /[:.]/g,
        "-",
      );

  const destination =
    `${productsPath}.backup-web-${timestamp}`;

  await fs.copyFile(
    productsPath,
    destination,
  );

  return destination;
}

/* =========================================================
   MAIN
========================================================= */

async function main() {
  await fs.mkdir(
    imageRoot,
    {
      recursive:
        true,
    },
  );

  await fs.mkdir(
    workDir,
    {
      recursive:
        true,
    },
  );

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

  let cache =
    {};

  try {
    cache =
      JSON.parse(
        await fs.readFile(
          cachePath,
          "utf8",
        ),
      );
  } catch {
    cache =
      {};
  }

  const manifestByProduct =
    new Map();

  for (
    const entry of
      manifest
  ) {
    const id =
      String(
        entry?.productId ??
          "",
      );

    if (
      !id
    ) {
      continue;
    }

    if (
      !manifestByProduct.has(
        id,
      )
    ) {
      manifestByProduct.set(
        id,
        [],
      );
    }

    manifestByProduct
      .get(
        id,
      )
      .push(
        entry,
      );
  }

  const missing =
    products.filter(
      (product) =>
        force ||
        !hasLocalImages(
          product,
        ),
    );

  const queue =
    limit
      ? missing.slice(
          0,
          limit,
        )
      : missing;

  const initialWithImages =
    products.filter(
      hasLocalImages,
    ).length;

  console.log("");
  console.log(
    "===================================================",
  );
  console.log(
    " CYCLORIVA — RÉCUPÉRATION WEB DES IMAGES",
  );
  console.log(
    "===================================================",
  );
  console.log("");

  console.log(
    `Produits totaux : ${products.length}`,
  );

  console.log(
    `Déjà illustrés : ${initialWithImages}`,
  );

  console.log(
    `À traiter : ${queue.length}`,
  );

  console.log(
    `Seuil : ${minScore}`,
  );

  console.log(
    `Images max / produit : ${maxImages}`,
  );

  console.log("");

  const report = {
    date:
      new Date()
        .toISOString(),

    totalProducts:
      products.length,

    initialWithImages,

    initialWithoutImages:
      products.length -
      initialWithImages,

    processed:
      0,

    recoveredProducts:
      0,

    imagesDownloaded:
      0,

    rejected:
      0,

    errors:
      0,

    results:
      [],
  };

  let backupCreated =
    false;

  for (
    let index =
      0;
    index <
    queue.length;
    index +=
      1
  ) {
    const product =
      queue[
        index
      ];

    const id =
      String(
        product.id,
      );

    const entries =
      manifestByProduct.get(
        id,
      ) ??
      [];

    const signature =
      buildSignature(
        product,
        entries,
      );

    console.log(
      `[${index + 1}/${queue.length}] ${id} — ${
        signature.name ||
        "Produit sans nom"
      }`,
    );

    const result = {
      productId:
        id,

      productName:
        signature.name,

      selectedPage:
        null,

      score:
        null,

      images:
        [],

      status:
        "unresolved",

      errors:
        [],
    };

    try {
      const queries =
        buildQueries(
          signature,
        );

      const searchResults =
        [];

      for (
        const query of
          queries
      ) {
        try {
          const found =
            await searchWeb(
              query,
              cache,
            );

          searchResults.push(
            ...found,
          );
        } catch (
          error
        ) {
          result.errors.push({
            step:
              "search",

            query,

            error:
              String(
                error
                  ?.message ??
                  error,
              ),
          });
        }
      }

      const uniqueResults =
        [];

      const seen =
        new Set();

      for (
        const candidate of
          searchResults
      ) {
        if (
          seen.has(
            candidate.url,
          )
        ) {
          continue;
        }

        seen.add(
          candidate.url,
        );

        uniqueResults.push({
          ...candidate,

          score:
            scoreResult(
              signature,
              candidate,
            ),
        });
      }

      uniqueResults.sort(
        (
          a,
          b,
        ) =>
          b.score -
          a.score,
      );

      const candidates =
        uniqueResults.slice(
          0,
          MAX_CANDIDATES,
        );

      let best =
        null;

      for (
        const candidate of
          candidates
      ) {
        if (
          candidate.score <
          0.30
        ) {
          continue;
        }

        try {
          const page =
            await fetchPage(
              candidate.url,
            );

          const pageText =
            `${page.title} ${page.description} ${page.url}`;

          let pageScore =
            tokenScore(
              signature,
              pageText,
            ) *
            0.75;

          if (
            signature.sizes.some(
              (size) =>
                normalize(
                  pageText,
                ).includes(
                  size,
                ),
            )
          ) {
            pageScore +=
              0.12;
          }

          if (
            signature.color &&
            detectColor(
              pageText,
            ) ===
              signature.color
          ) {
            pageScore +=
              0.08;
          }

          if (
            pageHasWrongSize(
              signature,
              pageText,
            )
          ) {
            pageScore -=
              0.30;
          }

          if (
            pageHasWrongColor(
              signature,
              pageText,
            )
          ) {
            pageScore -=
              0.20;
          }

          pageScore =
            Math.max(
              0,
              Math.min(
                1,
                pageScore,
              ),
            );

          const images =
            extractImages(
              page,
            );

          if (
            !images.length
          ) {
            continue;
          }

          if (
            !best ||
            pageScore >
              best.score
          ) {
            best = {
              page,
              score:
                pageScore,
              images,
            };
          }
        } catch (
          error
        ) {
          result.errors.push({
            step:
              "page",

            url:
              candidate.url,

            error:
              String(
                error
                  ?.message ??
                  error,
              ),
          });
        }
      }

      if (
        !best ||
        best.score <
          minScore
      ) {
        result.status =
          "rejected";

        result.score =
          best
            ?.score ??
          null;

        report.rejected +=
          1;

        report.results.push(
          result,
        );

        console.log(
          `  ↳ aucune fiche fiable${
            best
              ? ` — score ${best.score.toFixed(
                  3,
                )}`
              : ""
          }`,
        );

        continue;
      }

      result.selectedPage =
        best.page.url;

      result.score =
        best.score;

      const folder =
        safeId(
          id,
        );

      const folderPath =
        path.join(
          imageRoot,
          folder,
        );

      await fs.mkdir(
        folderPath,
        {
          recursive:
            true,
        },
      );

      const localImages =
        [];

      const hashes =
        new Set();

      for (
        const imageUrl of
          best.images
      ) {
        if (
          localImages.length >=
          maxImages
        ) {
          break;
        }

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
              imageUrl,
              path.join(
                folderPath,
                number,
              ),
              best.page.url,
            );

          const imageHash =
            hash(
              downloaded.buffer,
            );

          if (
            hashes.has(
              imageHash,
            )
          ) {
            await fs.unlink(
              downloaded.filename,
            ).catch(
              () => {},
            );

            continue;
          }

          hashes.add(
            imageHash,
          );

          localImages.push(
            `/images/produits/${folder}/${number}.${downloaded.extension}`,
          );
        } catch (
          error
        ) {
          result.errors.push({
            step:
              "image",

            url:
              imageUrl,

            error:
              String(
                error
                  ?.message ??
                  error,
              ),
          });
        }
      }

      if (
        !localImages.length
      ) {
        result.status =
          "download-failed";

        report.errors +=
          1;

        report.results.push(
          result,
        );

        console.log(
          "  ↳ aucune image téléchargeable",
        );

        continue;
      }

      if (
        !backupCreated
      ) {
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

      result.images =
        localImages;

      result.status =
        "recovered";

      report.recoveredProducts +=
        1;

      report.imagesDownloaded +=
        localImages.length;

      report.results.push(
        result,
      );

      console.log(
        `  ↳ OK : ${localImages.length} image(s) — score ${best.score.toFixed(
          3,
        )}`,
      );
    } catch (
      error
    ) {
      result.status =
        "error";

      result.errors.push({
        step:
          "product",

        error:
          String(
            error
              ?.message ??
              error,
          ),
      });

      report.errors +=
        1;

      report.results.push(
        result,
      );

      console.log(
        `  ↳ ERREUR : ${String(
          error
            ?.message ??
            error,
        )}`,
      );
    }

    report.processed =
      index +
      1;

    await fs.writeFile(
      reportPath,
      `${JSON.stringify(
        report,
        null,
        2,
      )}\n`,
      "utf8",
    );
  }

  const finalWithImages =
    products.filter(
      hasLocalImages,
    ).length;

  report.finalWithImages =
    finalWithImages;

  report.finalWithoutImages =
    products.length -
    finalWithImages;

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
    "===================================================",
  );

  console.log(
    " RÉSULTAT FINAL",
  );

  console.log(
    "===================================================",
  );

  console.log(
    `Produits avec images : ${finalWithImages}/${products.length}`,
  );

  console.log(
    `Produits sans images : ${
      products.length -
      finalWithImages
    }`,
  );

  console.log(
    `Nouveaux produits récupérés : ${report.recoveredProducts}`,
  );

  console.log(
    `Nouvelles images : ${report.imagesDownloaded}`,
  );

  console.log(
    `Produits refusés car douteux : ${report.rejected}`,
  );

  console.log(
    `Erreurs : ${report.errors}`,
  );

  console.log(
    "Rapport : data/rapport-images-web.json",
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