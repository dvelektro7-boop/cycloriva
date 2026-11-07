import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const productsPath = path.join(root, "data", "products.json");
const manifestPath = path.join(root, "data", "migration", "images.json");
const outputPath = path.join(root, "data", "cycloriva-image-catalog.json");

function repairText(value) {
  if (!value) return "";

  return String(value)
    .replaceAll("Ã©", "é")
    .replaceAll("Ã¨", "è")
    .replaceAll("Ãª", "ê")
    .replaceAll("Ã«", "ë")
    .replaceAll("Ã ", "à")
    .replaceAll("Ã¢", "â")
    .replaceAll("Ã§", "ç")
    .replaceAll("Ã´", "ô")
    .replaceAll("Ã¹", "ù")
    .replaceAll("Ã»", "û")
    .replaceAll("Ã®", "î")
    .replaceAll("Ã‰", "É")
    .replaceAll("Ã", "À")
    .replaceAll("â™", "’")
    .replaceAll("â“", "–")
    .replaceAll("â”", "—")
    .replaceAll("Â", "");
}

function hasLocalImages(product) {
  return Array.isArray(product.images) &&
    product.images.some(
      image =>
        typeof image === "string" &&
        image.startsWith("/images/produits/")
    );
}

function filenameToLabel(filename) {
  return String(filename || "")
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\bscaled\b/gi, "")
    .replace(/\banzeigebild\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

const products =
  JSON.parse(fs.readFileSync(productsPath, "utf8"));

const manifest =
  JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const manifestByProduct = new Map();

for (const row of manifest) {
  const id = String(row.productId ?? "");

  if (!manifestByProduct.has(id)) {
    manifestByProduct.set(id, []);
  }

  manifestByProduct.get(id).push(row);
}

const missingProducts =
  products.filter(product => !hasLocalImages(product));

const catalog =
  missingProducts.map(product => {
    const id = String(product.id);

    const rows =
      manifestByProduct.get(id) ?? [];

    const historicalImages =
      rows
        .map(row => row.sourceUrl)
        .filter(Boolean);

    const fallbackName =
      filenameToLabel(
        rows[0]?.originalFilename
      );

    return {
      legacyId: Number.isFinite(Number(id))
        ? Number(id)
        : null,

      slug: id,

      name:
        repairText(product.name) ||
        fallbackName ||
        `Produit ${id}`,

      type: "simple",

      sku:
        repairText(product.sku) ||
        null,

      gtin: null,

      published: true,

      featured: false,

      shortDescription:
        repairText(product.shortDescription) ||
        null,

      description:
        repairText(product.description) ||
        null,

      regularPrice:
        product.regularPrice ??
        product.price ??
        null,

      salePrice:
        product.salePrice ??
        null,

      inStock:
        Boolean(product.stockAtExport),

      stock:
        product.stockQuantityAtExport ??
        null,

      weightKg:
        product.weightKg ??
        null,

      dimensionsCm:
        product.dimensionsCm ?? {
          length: null,
          width: null,
          height: null,
        },

      categories:
        Array.isArray(product.categories)
          ? product.categories.map(repairText)
          : [],

      legacyImages:
        historicalImages,

      newImages: [],
    };
  });

fs.writeFileSync(
  outputPath,
  JSON.stringify(catalog, null, 2) + "\n",
  "utf8"
);

console.log("");
console.log("CYCLORIVA — catalogue images préparé");
console.log(`Total produits : ${products.length}`);
console.log(
  `Déjà avec images : ${
    products.length - missingProducts.length
  }`
);
console.log(
  `À rechercher avec Serper : ${catalog.length}`
);
console.log(
  "Fichier : data/cycloriva-image-catalog.json"
);

