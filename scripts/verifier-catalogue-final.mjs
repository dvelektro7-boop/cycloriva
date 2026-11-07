import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const productsPath =
  path.join(root, "data", "products.json");

const imagesRoot =
  path.join(
    root,
    "public",
    "images",
    "produits",
  );

const reportPath =
  path.join(
    root,
    "data",
    "rapport-controle-final.json",
  );

const allowedImageExtension =
  /\.(jpg|jpeg|png|webp|avif|gif)$/i;


/* ============================================================
 * CHARGEMENT
 * ============================================================
 */

if (!fs.existsSync(productsPath)) {
  throw new Error(
    `products.json introuvable : ${productsPath}`,
  );
}

const products =
  JSON.parse(
    fs.readFileSync(
      productsPath,
      "utf8",
    ),
  );

if (!Array.isArray(products)) {
  throw new Error(
    "products.json n'est pas un tableau JSON valide.",
  );
}


/* ============================================================
 * COMPTEURS
 * ============================================================
 */

let totalImagesLinked = 0;
let totalPhysicalImages = 0;

const duplicateIds = [];
const productsWithoutId = [];
const productsWithoutName = [];
const productsWithoutImage = [];
const productsWithOneImage = [];
const invalidImagePaths = [];
const missingImageFiles = [];
const duplicateImagesInsideProduct = [];
const wrongProductFolder = [];
const unsupportedFiles = [];
const unreferencedFiles = [];

const seenIds =
  new Set();

const referencedPhysicalPaths =
  new Set();


/* ============================================================
 * PRODUITS
 * ============================================================
 */

for (const product of products) {
  const id =
    String(
      product?.id ?? "",
    ).trim();

  const name =
    String(
      product?.name ?? "",
    ).trim();

  if (!id) {
    productsWithoutId.push({
      name,
    });

    continue;
  }

  if (seenIds.has(id)) {
    duplicateIds.push({
      id,
      name,
    });
  }

  seenIds.add(id);

  if (!name) {
    productsWithoutName.push({
      id,
    });
  }

  const images =
    Array.isArray(product?.images)
      ? product.images
      : [];

  if (images.length === 0) {
    productsWithoutImage.push({
      id,
      name,
    });
  }

  if (images.length === 1) {
    productsWithOneImage.push({
      id,
      name,
      image:
        images[0],
    });
  }

  totalImagesLinked +=
    images.length;

  const seenProductImages =
    new Set();

  for (const image of images) {
    if (
      typeof image !== "string" ||
      !image.startsWith(
        "/images/produits/",
      )
    ) {
      invalidImagePaths.push({
        id,
        name,
        image,
      });

      continue;
    }

    if (
      seenProductImages.has(
        image,
      )
    ) {
      duplicateImagesInsideProduct.push({
        id,
        name,
        image,
      });
    }

    seenProductImages.add(
      image,
    );

    const normalized =
      image
        .replace(
          /^\/+/,
          "",
        )
        .replace(
          /\//g,
          path.sep,
        );

    const physicalPath =
      path.join(
        root,
        "public",
        normalized.replace(
          /^images[\\/]/,
          `images${path.sep}`,
        ),
      );

    referencedPhysicalPaths.add(
      path.normalize(
        physicalPath,
      ),
    );

    if (
      !fs.existsSync(
        physicalPath,
      )
    ) {
      missingImageFiles.push({
        id,
        name,
        image,
      });
    }

    const expectedPrefix =
      `/images/produits/${id}/`;

    if (
      !image.startsWith(
        expectedPrefix,
      )
    ) {
      wrongProductFolder.push({
        id,
        name,
        image,
      });
    }
  }
}


/* ============================================================
 * FICHIERS PHYSIQUES
 * ============================================================
 */

if (
  fs.existsSync(
    imagesRoot,
  )
) {
  const folders =
    fs.readdirSync(
      imagesRoot,
      {
        withFileTypes: true,
      },
    );

  for (const folder of folders) {
    if (!folder.isDirectory()) {
      continue;
    }

    const folderPath =
      path.join(
        imagesRoot,
        folder.name,
      );

    const entries =
      fs.readdirSync(
        folderPath,
        {
          withFileTypes: true,
        },
      );

    for (const entry of entries) {
      if (!entry.isFile()) {
        continue;
      }

      const fullPath =
        path.normalize(
          path.join(
            folderPath,
            entry.name,
          ),
        );

      if (
        !allowedImageExtension.test(
          entry.name,
        )
      ) {
        unsupportedFiles.push({
          folder:
            folder.name,

          file:
            entry.name,
        });

        continue;
      }

      totalPhysicalImages +=
        1;

      if (
        !referencedPhysicalPaths.has(
          fullPath,
        )
      ) {
        unreferencedFiles.push({
          productId:
            folder.name,

          file:
            entry.name,

          path:
            `/images/produits/${folder.name}/${entry.name}`,
        });
      }
    }
  }
}


/* ============================================================
 * RAPPORT
 * ============================================================
 */

const report = {
  generatedAt:
    new Date()
      .toISOString(),

  expectedProductCount:
    401,

  productCount:
    products.length,

  productCountCorrect:
    products.length === 401,

  uniqueIds:
    seenIds.size,

  totalImagesLinked,

  totalPhysicalImages,

  productsWithoutImage,

  productsWithOneImage,

  productsWithoutId,

  productsWithoutName,

  duplicateIds,

  duplicateImagesInsideProduct,

  invalidImagePaths,

  missingImageFiles,

  wrongProductFolder,

  unsupportedFiles,

  unreferencedFiles,

  ok:
    products.length === 401 &&
    productsWithoutId.length === 0 &&
    productsWithoutName.length === 0 &&
    duplicateIds.length === 0 &&
    invalidImagePaths.length === 0 &&
    missingImageFiles.length === 0 &&
    wrongProductFolder.length === 0,
};

fs.writeFileSync(
  reportPath,
  JSON.stringify(
    report,
    null,
    2,
  ) + "\n",
  "utf8",
);


/* ============================================================
 * TERMINAL
 * ============================================================
 */

console.log("");
console.log(
  "==============================================",
);
console.log(
  " CYCLORIVA — CONTRÔLE FINAL DES 401 PRODUITS",
);
console.log(
  "==============================================",
);
console.log("");

console.log(
  `Produits : ${products.length}/401`,
);

console.log(
  `IDs uniques : ${seenIds.size}`,
);

console.log(
  `Images liées dans products.json : ${totalImagesLinked}`,
);

console.log(
  `Images physiques présentes : ${totalPhysicalImages}`,
);

console.log(
  `Produits sans image : ${productsWithoutImage.length}`,
);

console.log(
  `Produits avec 1 seule image : ${productsWithOneImage.length}`,
);

console.log(
  `Fichiers image manquants : ${missingImageFiles.length}`,
);

console.log(
  `Chemins image invalides : ${invalidImagePaths.length}`,
);

console.log(
  `Images dans mauvais dossier : ${wrongProductFolder.length}`,
);

console.log(
  `Images dupliquées dans un produit : ${duplicateImagesInsideProduct.length}`,
);

console.log(
  `IDs produits dupliqués : ${duplicateIds.length}`,
);

console.log(
  `Produits sans nom : ${productsWithoutName.length}`,
);

console.log(
  `Images présentes mais non liées : ${unreferencedFiles.length}`,
);

console.log("");

if (report.ok) {
  console.log(
    "RESULTAT : CATALOGUE TECHNIQUEMENT VALIDE",
  );
} else {
  console.log(
    "RESULTAT : CORRECTIONS ENCORE NECESSAIRES",
  );
}

console.log("");

if (
  productsWithoutImage.length >
  0
) {
  console.log(
    "PRODUITS SANS IMAGE :",
  );

  for (
    const product of
    productsWithoutImage
  ) {
    console.log(
      `- ${product.id} | ${product.name}`,
    );
  }

  console.log("");
}

console.log(
  "Rapport : data/rapport-controle-final.json",
);

console.log("");
