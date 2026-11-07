import fs from "node:fs";
import path from "node:path";

/**
 * ============================================================================
 * CYCLORIVA — SYNCHRONISATION COMPLÈTE DES IMAGES PRODUITS
 * ============================================================================
 *
 * Objectif :
 *
 * - lire data/products.json ;
 * - parcourir public/images/produits/<ID>/ ;
 * - récupérer TOUTES les images réellement présentes dans chaque dossier ;
 * - rattacher toutes ces images au produit correspondant ;
 * - ne plus ignorer les produits qui possèdent déjà une image ;
 * - supprimer les doublons ;
 * - conserver un ordre naturel : 01, 02, 03, 10, 11... ;
 * - sauvegarder products.json avant modification ;
 * - ne jamais supprimer les images existantes d'un produit si son dossier
 *   local est absent ou vide ;
 * - écrire directement le JSON pour éviter les problèmes Windows avec rename.
 *
 * ============================================================================
 */


/* ============================================================================
 * CHEMINS
 * ============================================================================
 */

const root =
  process.cwd();

const productsPath =
  path.join(
    root,
    "data",
    "products.json",
  );

const imageRoot =
  path.join(
    root,
    "public",
    "images",
    "produits",
  );


/* ============================================================================
 * EXTENSIONS AUTORISÉES
 * ============================================================================
 */

const allowedImageExtension =
  /\.(jpg|jpeg|png|webp|avif|gif)$/i;


/* ============================================================================
 * HELPERS
 * ============================================================================
 */

/**
 * Retourne uniquement les chemins d'images locales CYCLORIVA valides.
 */
function getCurrentLocalImages(product) {
  if (!Array.isArray(product?.images)) {
    return [];
  }

  return product.images.filter(
    image =>
      typeof image === "string" &&
      image.startsWith(
        "/images/produits/",
      ),
  );
}


/**
 * Compare deux tableaux d'images.
 */
function arraysEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every(
    (value, index) =>
      value === b[index],
  );
}


/**
 * Retourne toutes les images présentes physiquement
 * dans le dossier d'un produit.
 */
function getImagesFromProductFolder(productId) {
  const folder =
    path.join(
      imageRoot,
      productId,
    );

  if (!fs.existsSync(folder)) {
    return [];
  }

  const entries =
    fs.readdirSync(
      folder,
      {
        withFileTypes: true,
      },
    );

  const files =
    entries
      .filter(
        entry =>
          entry.isFile() &&
          allowedImageExtension.test(
            entry.name,
          ),
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
              sensitivity: "base",
            },
          ),
      );

  return [
    ...new Set(
      files.map(
        file =>
          `/images/produits/${productId}/${file}`,
      ),
    ),
  ];
}


/* ============================================================================
 * VÉRIFICATIONS
 * ============================================================================
 */

if (!fs.existsSync(productsPath)) {
  throw new Error(
    `Catalogue introuvable : ${productsPath}`,
  );
}

if (!fs.existsSync(imageRoot)) {
  throw new Error(
    `Dossier images introuvable : ${imageRoot}`,
  );
}


/* ============================================================================
 * CHARGEMENT DU CATALOGUE
 * ============================================================================
 */

const products =
  JSON.parse(
    fs.readFileSync(
      productsPath,
      "utf8",
    ),
  );

if (!Array.isArray(products)) {
  throw new Error(
    "data/products.json doit contenir un tableau de produits.",
  );
}


/* ============================================================================
 * SAUVEGARDE
 * ============================================================================
 */

const timestamp =
  new Date()
    .toISOString()
    .replace(
      /[:.]/g,
      "-",
    );

const backupPath =
  `${productsPath}.backup-images-${timestamp}`;

fs.copyFileSync(
  productsPath,
  backupPath,
);


/* ============================================================================
 * SYNCHRONISATION
 * ============================================================================
 */

let updatedProducts = 0;

let newlyIllustratedProducts = 0;

let unchangedProducts = 0;

let productsWithoutFolder = 0;

let productsWithEmptyFolder = 0;

let newlyLinkedImages = 0;


const productsStillWithoutImages =
  [];

for (const product of products) {
  const productId =
    String(
      product?.id ?? "",
    ).trim();

  if (!productId) {
    continue;
  }

  const previousImages =
    getCurrentLocalImages(
      product,
    );

  const folder =
    path.join(
      imageRoot,
      productId,
    );

  /*
   * Aucun dossier local :
   * on ne détruit surtout pas les images existantes.
   */
  if (!fs.existsSync(folder)) {
    productsWithoutFolder += 1;

    if (previousImages.length === 0) {
      productsStillWithoutImages.push({
        id:
          productId,

        name:
          String(
            product?.name ?? "",
          ),
      });
    }

    continue;
  }


  /*
   * Lecture de TOUTES les images physiques du produit.
   */
  const folderImages =
    getImagesFromProductFolder(
      productId,
    );


  /*
   * Dossier présent mais vide :
   * on conserve les images déjà déclarées.
   */
  if (folderImages.length === 0) {
    productsWithEmptyFolder += 1;

    if (previousImages.length === 0) {
      productsStillWithoutImages.push({
        id:
          productId,

        name:
          String(
            product?.name ?? "",
          ),
      });
    }

    continue;
  }


  /*
   * Compte uniquement les nouvelles URLs qui
   * n'étaient pas encore dans products.json.
   */
  const previousSet =
    new Set(
      previousImages,
    );

  const addedImages =
    folderImages.filter(
      image =>
        !previousSet.has(
          image,
        ),
    );

  newlyLinkedImages +=
    addedImages.length;


  /*
   * Produit auparavant sans image.
   */
  if (
    previousImages.length === 0 &&
    folderImages.length > 0
  ) {
    newlyIllustratedProducts += 1;
  }


  /*
   * On remplace la liste par la vérité du dossier physique :
   * toutes les images réellement disponibles.
   */
  if (
    !arraysEqual(
      previousImages,
      folderImages,
    )
  ) {
    product.images =
      folderImages;

    updatedProducts += 1;
  } else {
    unchangedProducts += 1;
  }

}


/* ============================================================================
 * ÉCRITURE
 * ============================================================================
 */

fs.writeFileSync(
  productsPath,
  `${JSON.stringify(
    products,
    null,
    2,
  )}\n`,
  "utf8",
);


/* ============================================================================
 * STATISTIQUES FINALES
 * ============================================================================
 */

const productsWithImages =
  products.filter(
    product =>
      Array.isArray(
        product?.images,
      ) &&
      product.images.some(
        image =>
          typeof image === "string" &&
          image.startsWith(
            "/images/produits/",
          ),
      ),
  ).length;

const productsWithoutImages =
  products.length -
  productsWithImages;

const imagesInProductsJson =
  products.reduce(
    (total, product) => {
      if (
        !Array.isArray(
          product?.images,
        )
      ) {
        return total;
      }

      return (
        total +
        product.images.filter(
          image =>
            typeof image === "string" &&
            image.startsWith(
              "/images/produits/",
            ),
        ).length
      );
    },
    0,
  );


/* ============================================================================
 * RAPPORT TERMINAL
 * ============================================================================
 */

console.log("");
console.log(
  "==============================================",
);
console.log(
  " CYCLORIVA — SYNCHRONISATION COMPLÈTE",
);
console.log(
  "==============================================",
);
console.log("");

console.log(
  `Produits catalogue : ${products.length}`,
);

console.log(
  `Produits mis à jour : ${updatedProducts}`,
);

console.log(
  `Nouveaux produits illustrés : ${newlyIllustratedProducts}`,
);

console.log(
  `Produits déjà synchronisés : ${unchangedProducts}`,
);

console.log(
  `Nouvelles images liées : ${newlyLinkedImages}`,
);

console.log(
  `Images locales liées au catalogue : ${imagesInProductsJson}`,
);

console.log(
  `Produits avec images : ${productsWithImages}/${products.length}`,
);

console.log(
  `Produits sans image : ${productsWithoutImages}`,
);

console.log(
  `Dossiers produits absents : ${productsWithoutFolder}`,
);

console.log(
  `Dossiers produits vides : ${productsWithEmptyFolder}`,
);

console.log("");

console.log(
  `Sauvegarde : ${path.relative(
    root,
    backupPath,
  )}`,
);


/* ============================================================================
 * PRODUITS ENCORE SANS IMAGE
 * ============================================================================
 */

if (
  productsStillWithoutImages.length >
  0
) {
  console.log("");
  console.log(
    "Produits encore sans image :",
  );

  for (
    const product of
    productsStillWithoutImages
  ) {
    console.log(
      `- ID ${product.id} | ${product.name}`,
    );
  }
} else {
  console.log("");
  console.log(
    "Tous les produits disposent d'au moins une image.",
  );
}

console.log("");