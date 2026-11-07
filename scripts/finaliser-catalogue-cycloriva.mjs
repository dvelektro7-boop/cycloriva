import fs from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = process.cwd();

const productsPath = path.join(
  root,
  "data",
  "products.json",
);

const imageFolder1900 = path.join(
  root,
  "public",
  "images",
  "produits",
  "1900",
);

for (const envFile of [".env.local", ".env"]) {
  const envPath = path.join(root, envFile);

  if (fs.existsSync(envPath)) {
    try {
      loadEnvFile(envPath);
    } catch {}
  }
}

const apiKey =
  String(
    process.env.SERPER_API_KEY ?? "",
  ).trim();

if (!apiKey) {
  throw new Error(
    "SERPER_API_KEY absente dans .env.local.",
  );
}

const products =
  JSON.parse(
    fs.readFileSync(
      productsPath,
      "utf8",
    ),
  );

const timestamp =
  new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

fs.copyFileSync(
  productsPath,
  `${productsPath}.backup-final-${timestamp}`,
);


/* =========================================================
   1. CORRECTION DES 4 NOMS
========================================================= */

const names = {
  "886":
    'Vélo électrique tout terrain Fully 27.5" BEAST-X',

  "1714":
    "Allegro City Be Easy",

  "2719":
    "Tondeuse à gazon sans fil Einhell GE-CM 36/48 Li M",

  "2833":
    "Triporteur électrique Butchers & Bicycles MK1-E SRAM",
};

for (const product of products) {
  const name =
    names[String(product.id)];

  if (name) {
    product.name = name;
  }
}

console.log(
  "OK : 4 noms produits corrigés.",
);


/* =========================================================
   2. PRODUIT 1900
========================================================= */

const product1900 =
  products.find(
    product =>
      String(product.id) === "1900",
  );

if (!product1900) {
  throw new Error(
    "Produit 1900 introuvable.",
  );
}

fs.mkdirSync(
  imageFolder1900,
  {
    recursive: true,
  },
);

const allowed =
  /\.(jpg|jpeg|png|webp|avif|gif)$/i;

function localImages1900() {
  return fs
    .readdirSync(
      imageFolder1900,
      {
        withFileTypes: true,
      },
    )
    .filter(
      entry =>
        entry.isFile() &&
        allowed.test(entry.name),
    )
    .map(
      entry =>
        entry.name,
    )
    .sort(
      (a, b) =>
        a.localeCompare(
          b,
          undefined,
          {
            numeric: true,
          },
        ),
    );
}

let files1900 =
  localImages1900();


/* =========================================================
   3. RECHERCHE SERPER UNIQUEMENT SI 1900 EST VIDE
========================================================= */

if (files1900.length === 0) {
  console.log(
    "Recherche des images du produit 1900...",
  );

  const queries = [
    "Cilo Rock CXK24 Candy",
    "Cilo Rock CXK24°07 Candy",
    "CiloRockCXK24 candy",
  ];

  const candidates = [];

  for (const q of queries) {
    const response =
      await fetch(
        "https://google.serper.dev/images",
        {
          method: "POST",

          headers: {
            "X-API-KEY":
              apiKey,

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              q,
              gl: "ch",
              hl: "de",
              num: 30,
            }),
        },
      );

    if (!response.ok) {
      throw new Error(
        `Serper HTTP ${response.status}`,
      );
    }

    const data =
      await response.json();

    if (
      Array.isArray(
        data.images,
      )
    ) {
      candidates.push(
        ...data.images,
      );
    }
  }


  /* =======================================================
     FILTRE STRICT : CILO + ROCK/CXK24 + CANDY
  ======================================================= */

  const seen =
    new Set();

  const filtered =
    candidates
      .filter(
        candidate => {
          const imageUrl =
            String(
              candidate?.imageUrl ??
              "",
            );

          if (
            !imageUrl ||
            seen.has(imageUrl)
          ) {
            return false;
          }

          seen.add(
            imageUrl,
          );

          const haystack =
            [
              candidate?.title,
              candidate?.source,
              candidate?.domain,
              candidate?.link,
              candidate?.imageUrl,
            ]
              .join(" ")
              .toLowerCase();

          const hasCilo =
            haystack.includes(
              "cilo",
            );

          const hasModel =
            haystack.includes(
              "cxk24",
            ) ||
            haystack.includes(
              "cilo rock",
            ) ||
            haystack.includes(
              "cilorock",
            );

          const hasCandy =
            haystack.includes(
              "candy",
            );

          return (
            hasCilo &&
            hasModel &&
            hasCandy
          );
        },
      );


  /* =======================================================
     TÉLÉCHARGEMENT
  ======================================================= */

  let downloaded = 0;

  for (
    const candidate of filtered
  ) {
    if (downloaded >= 12) {
      break;
    }

    const possibleUrls = [
      candidate.imageUrl,
      candidate.thumbnailUrl,
    ].filter(Boolean);

    let saved = false;

    for (
      const url of possibleUrls
    ) {
      try {
        const response =
          await fetch(
            url,
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0",

                Accept:
                  "image/avif,image/webp,image/*,*/*;q=0.8",
              },

              signal:
                AbortSignal.timeout(
                  25000,
                ),
            },
          );

        if (!response.ok) {
          continue;
        }

        const type =
          String(
            response.headers.get(
              "content-type",
            ) ?? "",
          ).toLowerCase();

        if (
          !type.startsWith(
            "image/",
          )
        ) {
          continue;
        }

        const buffer =
          Buffer.from(
            await response.arrayBuffer(),
          );

        if (
          buffer.length <
          5000
        ) {
          continue;
        }

        const metadata =
          await sharp(
            buffer,
          ).metadata();

        if (
          !metadata.width ||
          !metadata.height ||
          metadata.width < 200 ||
          metadata.height < 200
        ) {
          continue;
        }

        downloaded += 1;

        const number =
          String(
            downloaded,
          ).padStart(
            2,
            "0",
          );

        const destination =
          path.join(
            imageFolder1900,
            `${number}.webp`,
          );

        await sharp(
          buffer,
        )
          .rotate()
          .resize({
            width: 1600,
            height: 1600,
            fit: "inside",
            withoutEnlargement:
              true,
          })
          .webp({
            quality: 86,
          })
          .toFile(
            destination,
          );

        console.log(
          `1900 : image ${number} récupérée`,
        );

        saved = true;
        break;
      } catch {}
    }

    if (!saved) {
      continue;
    }
  }

  files1900 =
    localImages1900();
}


/* =========================================================
   4. LIEN DES IMAGES DU PRODUIT 1900
========================================================= */

if (files1900.length > 0) {
  product1900.images =
    files1900.map(
      file =>
        `/images/produits/1900/${file}`,
    );

  console.log(
    `OK : produit 1900 possède maintenant ${files1900.length} image(s).`,
  );
} else {
  console.log(
    "ATTENTION : aucune image exploitable trouvée pour le produit 1900.",
  );
}


/* =========================================================
   5. SAUVEGARDE DU CATALOGUE
========================================================= */

fs.writeFileSync(
  productsPath,
  JSON.stringify(
    products,
    null,
    2,
  ) + "\n",
  "utf8",
);

console.log(
  "OK : products.json mis à jour.",
);


/* =========================================================
   6. CONTRÔLE FINAL AUTOMATIQUE
========================================================= */

console.log("");
console.log(
  "===== CONTROLE FINAL CYCLORIVA =====",
);
console.log("");

const result =
  spawnSync(
    process.execPath,
    [
      path.join(
        root,
        "scripts",
        "verifier-catalogue-final.mjs",
      ),
    ],
    {
      cwd: root,
      stdio: "inherit",
    },
  );

process.exitCode =
  result.status ?? 0;
