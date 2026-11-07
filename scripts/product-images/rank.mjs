import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { CONFIG, PATHS } from "./config.mjs";
import {
  backupFile,
  formatDuration,
  numberArg,
  readJson,
  writeCsv,
  writeJsonAtomic,
} from "./utils.mjs";

const POSITIVE_SOURCE_TERMS = [
  "front", "frontal", "main", "hero", "primary", "product image", "produktbild",
  "freisteller", "freigestellt", "studio", "packshot", "product photo", "produktfoto",
  "white background", "gesamtansicht", "overview",
];

const NEGATIVE_SOURCE_TERMS = [
  "lifestyle", "living", "wohnzimmer", "room", "ambiente", "scene", "in use",
  "detail", "closeup", "close-up", "zoom", "macro", "rear", "ruckseite", "rueckseite",
  "back", "side", "seite", "interior", "innen", "inside", "anschluss", "connector",
  "port", "ports", "label", "energie", "energy", "manual", "schema", "diagram",
  "dimension", "dimensions", "installation", "zubehor", "zubehÃ¶r", "accessory",
  "remote", "fernbedienung",
];

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function scale(value, min, max) {
  if (max <= min) return 0;
  return clamp((value - min) / (max - min));
}

function idealRangeScore(value, idealMin, idealMax, hardMin, hardMax) {
  if (value >= idealMin && value <= idealMax) return 1;
  if (value < hardMin || value > hardMax) return 0;
  if (value < idealMin) return scale(value, hardMin, idealMin);
  return 1 - scale(value, idealMax, hardMax);
}

function sourceSemanticScore(imageMeta = {}) {
  const haystack = [imageMeta.sourceUrl, imageMeta.sourcePage, imageMeta.searchQuery]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let score = 0;
  let positiveHits = 0;
  let negativeHits = 0;

  for (const term of POSITIVE_SOURCE_TERMS) {
    if (haystack.includes(term)) positiveHits += 1;
  }
  for (const term of NEGATIVE_SOURCE_TERMS) {
    if (haystack.includes(term)) negativeHits += 1;
  }

  score += Math.min(positiveHits * 6, 24);
  score -= Math.min(negativeHits * 8, 48);

  return { score, positiveHits, negativeHits };
}

function inferRole(imageMeta = {}) {
  const text = [imageMeta.sourceUrl, imageMeta.sourcePage, imageMeta.searchQuery]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/energy|energie|label|energielabel|datenblatt|datasheet|manual|schema|diagram/.test(text)) return "label";
  if (/interior|inside|innen|innenraum/.test(text)) return "interior";
  if (/rear|back|ruckseite|rueckseite|anschluss|connector|ports?/.test(text)) return "rear";
  if (/detail|closeup|close-up|zoom|macro/.test(text)) return "detail";
  if (/lifestyle|living|wohnzimmer|room|ambiente|scene|in use/.test(text)) return "lifestyle";
  if (/side|seite|seitenansicht/.test(text)) return "side";
  if (/front|frontal|main|hero|primary|freigestellt|freisteller|packshot|studio|produktbild|product image/.test(text)) return "front";
  return "unknown";
}

function roleAdjustment(role) {
  switch (role) {
    case "front": return 20;
    case "unknown": return 0;
    case "side": return -8;
    case "lifestyle": return -22;
    case "rear": return -30;
    case "interior": return -34;
    case "detail": return -38;
    case "label": return -70;
    default: return 0;
  }
}

function buildDHash(gray, width, height) {
  if (width !== 9 || height !== 8) return "";
  let bits = "";
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      bits += gray[y * width + x] > gray[y * width + x + 1] ? "1" : "0";
    }
  }
  return bits;
}

function hammingDistance(a = "", b = "") {
  if (!a || !b || a.length !== b.length) return 64;
  let distance = 0;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) distance += 1;
  return distance;
}

async function analyzeImage(filePath) {
  const original = sharp(filePath, { failOn: "none" }).rotate();
  const metadata = await original.metadata();
  const sourceWidth = Number(metadata.width ?? 0);
  const sourceHeight = Number(metadata.height ?? 0);
  if (!sourceWidth || !sourceHeight) throw new Error("dimensions inconnues");

  const sampleSize = CONFIG.rankAnalysisSize;
  const { data, info } = await original
    .clone()
    .resize(sampleSize, sampleSize, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      withoutEnlargement: false,
    })
    .flatten({ background: "#ffffff" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;
  const border = Math.max(4, Math.round(Math.min(width, height) * 0.06));
  const isBorder = (x, y) => x < border || y < border || x >= width - border || y >= height - border;

  let borderR = 0, borderG = 0, borderB = 0, borderCount = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!isBorder(x, y)) continue;
      const o = (y * width + x) * channels;
      borderR += data[o]; borderG += data[o + 1]; borderB += data[o + 2]; borderCount += 1;
    }
  }

  const bgR = borderR / Math.max(1, borderCount);
  const bgG = borderG / Math.max(1, borderCount);
  const bgB = borderB / Math.max(1, borderCount);
  const borderBrightness = clamp((0.2126 * bgR + 0.7152 * bgG + 0.0722 * bgB) / 255);
  const maxBg = Math.max(bgR, bgG, bgB);
  const minBg = Math.min(bgR, bgG, bgB);
  const borderNeutrality = clamp(1 - (maxBg - minBg) / Math.max(1, maxBg));

  let borderVariance = 0;
  let foregroundCount = 0;
  let foregroundBorderCount = 0;
  let centerX = 0;
  let centerY = 0;
  let edgeChanges = 0;
  let edgeComparisons = 0;
  const thresholdSquared = 46 * 46;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const o = (y * width + x) * channels;
      const r = data[o], g = data[o + 1], b = data[o + 2];
      const dr = r - bgR, dg = g - bgG, db = b - bgB;
      const distanceSquared = dr * dr + dg * dg + db * db;
      if (isBorder(x, y)) borderVariance += distanceSquared;
      if (distanceSquared > thresholdSquared) {
        foregroundCount += 1;
        centerX += x;
        centerY += y;
        if (isBorder(x, y)) foregroundBorderCount += 1;
      }

      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (x + 1 < width) {
        const ro = o + channels;
        const rLum = 0.2126 * data[ro] + 0.7152 * data[ro + 1] + 0.0722 * data[ro + 2];
        if (Math.abs(lum - rLum) > 42) edgeChanges += 1;
        edgeComparisons += 1;
      }
      if (y + 1 < height) {
        const d = o + width * channels;
        const dLum = 0.2126 * data[d] + 0.7152 * data[d + 1] + 0.0722 * data[d + 2];
        if (Math.abs(lum - dLum) > 42) edgeChanges += 1;
        edgeComparisons += 1;
      }
    }
  }

  const pixelCount = width * height;
  const occupancy = foregroundCount / Math.max(1, pixelCount);
  const edgeTouch = foregroundBorderCount / Math.max(1, foregroundCount);
  const variance = borderVariance / Math.max(1, borderCount * 3 * 255 * 255);
  const borderUniformity = clamp(1 - variance * 20);
  const edgeDensity = edgeChanges / Math.max(1, edgeComparisons);

  let centering = 0.5;
  if (foregroundCount > 0) {
    const cx = centerX / foregroundCount;
    const cy = centerY / foregroundCount;
    const dx = (cx - (width - 1) / 2) / (width / 2);
    const dy = (cy - (height - 1) / 2) / (height / 2);
    centering = clamp(1 - Math.sqrt(dx * dx + dy * dy) / 0.72);
  }

  const whiteBackground = borderUniformity * clamp((borderBrightness - 0.62) / 0.38) * borderNeutrality;
  const catalogBackground = clamp(borderUniformity * 0.45 + whiteBackground * 0.4 + borderNeutrality * 0.15);

  const gray = await original.clone().resize(9, 8, { fit: "fill" }).greyscale().raw().toBuffer();
  const dHash = buildDHash(gray, 9, 8);

  return {
    sourceWidth,
    sourceHeight,
    aspectRatio: sourceWidth / sourceHeight,
    occupancy,
    edgeTouch,
    borderUniformity,
    borderBrightness,
    borderNeutrality,
    whiteBackground,
    catalogBackground,
    centering,
    edgeDensity,
    dHash,
  };
}

function scoreVisual(metrics) {
  const area = metrics.sourceWidth * metrics.sourceHeight;
  const resolutionScore = scale(Math.log10(Math.max(area, 1)), Math.log10(350 * 350), Math.log10(1800 * 1800));
  const occupancyScore = idealRangeScore(metrics.occupancy, 0.16, 0.66, 0.035, 0.90);
  const touchScore = clamp(1 - metrics.edgeTouch / 0.18);
  const aspectScore = idealRangeScore(metrics.aspectRatio, 0.46, 1.9, 0.22, 3.5);
  const edgeScore = idealRangeScore(metrics.edgeDensity, 0.012, 0.14, 0, 0.32);

  const score =
    resolutionScore * 15 +
    occupancyScore * 20 +
    touchScore * 17 +
    metrics.centering * 13 +
    metrics.catalogBackground * 23 +
    aspectScore * 7 +
    edgeScore * 5;

  return { score, resolutionScore, occupancyScore, touchScore, aspectScore, edgeScore };
}

function reviewImageSrc(publicPath = "") {
  return `../../public/${String(publicPath).replace(/^\/+/, "")}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function buildReviewHtml(products) {
  const cards = products.map((product) => {
    const items = product.images.map((image, index) => `
      <article class="image-card ${image.primaryEligible ? "eligible" : ""} ${index === 0 ? "primary" : ""}">
        <div class="image-wrap"><img src="${reviewImageSrc(image.publicPath)}" alt=""></div>
        <div class="image-meta">
          <strong>#${index + 1} ${index === 0 ? "â€” ORDRE PROPOSÃ‰" : ""}</strong>
          <span>Total ${image.totalScore.toFixed(1)}/100 Â· rÃ´le ${image.role}</span>
          <span>Fond catalogue ${(image.metrics.catalogBackground * 100).toFixed(0)}% Â· centrage ${(image.metrics.centering * 100).toFixed(0)}%</span>
          <span>${image.metrics.sourceWidth}Ã—${image.metrics.sourceHeight} Â· occupation ${(image.metrics.occupancy * 100).toFixed(0)}%</span>
          <span>${image.primaryEligible ? "âœ“ admissible comme principale" : "galerie / vÃ©rification"}</span>
        </div>
      </article>`).join("");

    return `<section class="product"><h2>${escapeHtml(product.name)}</h2><p>${escapeHtml(product.slug)} Â· ${product.decision}</p><div class="grid">${items}</div></section>`;
  }).join("");

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CYCLORIVA â€” classement V2</title><style>
body{margin:0;font-family:Inter,Arial,sans-serif;background:#f4f7fb;color:#0f172a}.wrap{max-width:1500px;margin:auto;padding:32px}.top{background:#071a3a;color:#fff;padding:24px 32px;border-radius:18px;margin-bottom:24px}.product{background:#fff;border:1px solid #e4eaf2;border-radius:18px;padding:24px;margin:18px 0}.product h2{margin:0 0 6px}.product p{margin:0 0 18px;color:#64748b}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px}.image-card{border:1px solid #e4eaf2;border-radius:14px;overflow:hidden;background:#fff}.image-card.eligible{border-color:#87dcb6}.image-card.primary{outline:3px solid #0070f3}.image-wrap{height:210px;display:flex;align-items:center;justify-content:center;background:#f8fafc}.image-wrap img{max-width:100%;max-height:100%;object-fit:contain}.image-meta{padding:12px;display:grid;gap:4px;font-size:11px}.image-meta strong{color:#0070f3}.image-meta span{color:#475569}@media(max-width:600px){.wrap{padding:12px}.product{padding:14px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.image-wrap{height:150px}}</style></head><body><main class="wrap"><div class="top"><h1>CYCLORIVA â€” classement automatique V2</h1><p>Une image n'est dÃ©placÃ©e en premiÃ¨re position que si elle dÃ©passe le seuil de qualitÃ© principale. Sinon le produit reste marquÃ© pour vÃ©rification.</p></div>${cards}</main></body></html>`;
}

export async function runRank(cli = {}) {
  if (!fs.existsSync(CONFIG.catalogPath)) throw new Error(`Catalogue introuvable: ${CONFIG.catalogPath}`);
  const catalog = readJson(CONFIG.catalogPath, []);
  const manifest = readJson(PATHS.manifest, { version: 1, products: {} }) || { version: 1, products: {} };
  if (!Array.isArray(catalog)) throw new Error("Catalogue invalide.");

  fs.mkdirSync(CONFIG.workDir, { recursive: true });
  const dryRun = Boolean(cli["dry-run"]);
  if (!dryRun && !cli["no-backup"]) {
    const backup = backupFile(CONFIG.catalogPath, PATHS.backups);
    if (backup) console.log(`Sauvegarde catalogue: ${path.relative(CONFIG.root, backup)}`);
  }

  const start = Math.max(0, numberArg(cli.start, 0));
  const limit = Math.max(1, numberArg(cli.limit, catalog.length));
  const idFilter = cli.id ? String(cli.id) : null;
  const selected = catalog.filter((product) => {
    if (!product?.published || !String(product?.name ?? "").trim()) return false;
    if (!Array.isArray(product.newImages) || product.newImages.length === 0) return false;
    if (idFilter && String(product.legacyId ?? product.slug) !== idFilter && String(product.slug) !== idFilter) return false;
    return true;
  }).slice(start, start + limit);

  console.log("\nCYCLORIVA â€” classement automatique V2");
  console.log(`Produits Ã  analyser: ${selected.length}`);
  console.log(`Seuil principale: ${CONFIG.rankPrimaryMinScore}/100`);
  console.log(`Mode: ${dryRun ? "simulation" : "Ã©criture"}\n`);

  const startedAt = Date.now();
  const reportRows = [];
  const reviewProducts = [];
  let reorderedProducts = 0;
  let needsReview = 0;
  let analysisErrors = 0;

  for (let productIndex = 0; productIndex < selected.length; productIndex += 1) {
    const product = selected[productIndex];
    const before = [...product.newImages];
    const manifestProduct = manifest.products?.[product.slug] ?? { images: [] };
    const manifestByPath = new Map((manifestProduct.images ?? []).map((item) => [item.publicPath, item]));
    const ranked = [];

    for (const publicPath of before) {
      const filePath = path.resolve(CONFIG.root, "public", publicPath.replace(/^\/+/, ""));
      const meta = manifestByPath.get(publicPath) ?? {};
      try {
        if (!fs.existsSync(filePath)) throw new Error("fichier local introuvable");
        const metrics = await analyzeImage(filePath);
        const visual = scoreVisual(metrics);
        const semantic = sourceSemanticScore(meta);
        const role = inferRole(meta);
        const totalScore = Math.max(0, Math.min(100, visual.score + semantic.score + roleAdjustment(role)));
        const primaryEligible =
          totalScore >= CONFIG.rankPrimaryMinScore &&
          metrics.catalogBackground >= 0.44 &&
          !["label", "detail", "interior", "rear", "lifestyle"].includes(role);

        ranked.push({ publicPath, meta, metrics, visual, semantic, role, totalScore, primaryEligible });
      } catch (error) {
        analysisErrors += 1;
        ranked.push({ publicPath, meta, role: "error", totalScore: -999, primaryEligible: false, metrics: { sourceWidth: 0, sourceHeight: 0, occupancy: 0, catalogBackground: 0, centering: 0, dHash: "" }, error: error instanceof Error ? error.message : String(error) });
      }
    }

    ranked.sort((a, b) => b.totalScore - a.totalScore);

    // Les doublons visuels proches restent en fin de galerie.
    const unique = [];
    const duplicates = [];
    for (const item of ranked) {
      const duplicate = unique.some((existing) => hammingDistance(existing.metrics?.dHash, item.metrics?.dHash) <= 5);
      (duplicate ? duplicates : unique).push(item);
    }
    const ordered = [...unique, ...duplicates];
    const bestPrimaryIndex = ordered.findIndex((item) => item.primaryEligible);
    const decision = bestPrimaryIndex >= 0 ? "principal fiable" : "Ã€ VÃ‰RIFIER â€” aucune photo principale assez propre";

    if (bestPrimaryIndex > 0) {
      const [primary] = ordered.splice(bestPrimaryIndex, 1);
      ordered.unshift(primary);
    }

    const proposed = ordered.slice(0, CONFIG.maxImagesPerProduct).map((item) => item.publicPath);
    const changed = proposed.join("|") !== before.slice(0, CONFIG.maxImagesPerProduct).join("|");

    if (bestPrimaryIndex >= 0) {
      if (changed) reorderedProducts += 1;
      if (!dryRun) product.newImages = proposed;
    } else {
      needsReview += 1;
      // Ne pas aggraver automatiquement un produit sans bonne principale.
      if (!dryRun) product.newImages = before.slice(0, CONFIG.maxImagesPerProduct);
    }

    reviewProducts.push({ name: product.name, slug: product.slug, images: ordered, decision });
    reportRows.push({
      legacyId: product.legacyId,
      slug: product.slug,
      name: product.name,
      decision,
      primary: bestPrimaryIndex >= 0 ? proposed[0] : "",
      primaryScore: bestPrimaryIndex >= 0 ? ordered[0]?.totalScore?.toFixed(1) : "",
      role: bestPrimaryIndex >= 0 ? ordered[0]?.role : "",
      reordered: changed && bestPrimaryIndex >= 0 ? "yes" : "no",
      imageCount: before.length,
    });

    console.log(`[${productIndex + 1}/${selected.length}] ${bestPrimaryIndex >= 0 ? "PRIMARY" : "REVIEW ".trim()} ${bestPrimaryIndex >= 0 ? String(Math.round(ordered[0].totalScore)).padStart(3) + "/100" : "---"} â€” ${product.name}${bestPrimaryIndex >= 0 ? ` â†’ ${proposed[0]}` : ""}`);
  }

  if (!dryRun) writeJsonAtomic(CONFIG.catalogPath, catalog);
  writeCsv(PATHS.rankingReport, reportRows, ["legacyId", "slug", "name", "decision", "primary", "primaryScore", "role", "reordered", "imageCount"]);
  fs.writeFileSync(PATHS.rankingReviewHtml, buildReviewHtml(reviewProducts), "utf8");

  console.log(`\nClassement V2 terminÃ© en ${formatDuration(Date.now() - startedAt)}.`);
  console.log(`Produits rÃ©ordonnÃ©s: ${reorderedProducts}`);
  console.log(`Produits Ã  vÃ©rifier: ${needsReview}`);
  console.log(`Erreurs d'analyse: ${analysisErrors}`);
  console.log(`Rapport: ${path.relative(CONFIG.root, PATHS.rankingReport)}`);
  console.log(`AperÃ§u: ${path.relative(CONFIG.root, PATHS.rankingReviewHtml)}`);
  if (dryRun) console.log("Aucune modification du catalogue (mode --dry-run).\n");
  else console.log("Le catalogue n'est rÃ©ordonnÃ© que lorsqu'une image principale dÃ©passe le seuil de qualitÃ©.\n");

  return { reorderedProducts, needsReview, analysisErrors };
}

