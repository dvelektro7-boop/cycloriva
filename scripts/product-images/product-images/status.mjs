import fs from "node:fs";
import path from "node:path";

import { CONFIG, PATHS } from "./config.mjs";
import { readJson } from "./utils.mjs";

export function runStatus() {
  const catalog = readJson(CONFIG.catalogPath, []);
  const candidates = readJson(PATHS.candidates, { products: {} });
  const manifest = readJson(PATHS.manifest, { products: {} });

  const published = Array.isArray(catalog) ? catalog.filter((p) => p?.published && String(p?.name ?? "").trim()) : [];
  const withImages = published.filter((p) => (p.newImages ?? []).length > 0);
  const complete = published.filter((p) => (p.newImages ?? []).length >= CONFIG.maxImagesPerProduct);
  const imageCount = published.reduce((sum, p) => sum + (p.newImages ?? []).length, 0);
  const candidateEntries = Object.values(candidates.products ?? {});
  const high = candidateEntries.filter((p) => p.status === "high").length;
  const review = candidateEntries.filter((p) => p.status === "review").length;
  const missing = candidateEntries.filter((p) => p.status === "missing").length;
  const errors = candidateEntries.filter((p) => p.status === "error").length;
  const manifestImages = Object.values(manifest.products ?? {}).reduce((sum, p) => sum + (p.images?.length ?? 0), 0);

  console.log("\nDevElektro — état des images");
  console.log(`Produits publiés:            ${published.length}`);
  console.log(`Produits avec image:         ${withImages.length}`);
  console.log(`Produits complets (${CONFIG.maxImagesPerProduct} images): ${complete.length}`);
  console.log(`Images liées au catalogue:   ${imageCount}`);
  console.log(`Images du manifeste:         ${manifestImages}`);
  console.log(`Recherches haute confiance:  ${high}`);
  console.log(`À vérifier:                  ${review}`);
  console.log(`Introuvables:                ${missing}`);
  console.log(`Erreurs de recherche:        ${errors}`);
  console.log(`\nDossier public: ${path.relative(CONFIG.root, CONFIG.publicProductsDir)}`);
  console.log(`Dossier rapports: ${path.relative(CONFIG.root, CONFIG.workDir)}\n`);

  if (!fs.existsSync(CONFIG.catalogPath)) {
    console.log(`ATTENTION: catalogue introuvable: ${CONFIG.catalogPath}`);
  }
}
