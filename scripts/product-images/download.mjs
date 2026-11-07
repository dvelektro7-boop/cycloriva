import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { CONFIG, PATHS } from "./config.mjs";
import {
  backupFile,
  formatDuration,
  hostname,
  numberArg,
  productFolder,
  readJson,
  sha256,
  sleep,
  writeCsv,
  writeJsonAtomic,
} from "./utils.mjs";

const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

function normalizeUrlKey(url) {
  try { const u = new URL(url); u.hash = ""; return u.toString(); } catch { return String(url); }
}

async function fetchImageBuffer(url) {
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; CYCLORIVAImageMigration/2.0)",
          Accept: "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8,*/*;q=0.5",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(CONFIG.downloadTimeoutMs),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentLength = Number(response.headers.get("content-length") ?? 0);
      if (contentLength > CONFIG.maxDownloadBytes) throw new Error("image trop volumineuse");
      const type = String(response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
      if (type && !ALLOWED_CONTENT_TYPES.has(type)) throw new Error(`type non-image: ${type}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length > CONFIG.maxDownloadBytes) throw new Error("image trop volumineuse");
      if (buffer.length < 2048) throw new Error("fichier image trop petit");
      return buffer;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await sleep(450 * attempt);
    }
  }
  throw lastError ?? new Error("tÃ©lÃ©chargement impossible");
}

async function validateAndConvert(buffer) {
  const source = sharp(buffer, { failOn: "warning" }).rotate();
  const meta = await source.metadata();
  const width = Number(meta.width ?? 0), height = Number(meta.height ?? 0);
  if (!width || !height) throw new Error("dimensions inconnues");
  if (width < CONFIG.minWidth || height < CONFIG.minHeight) throw new Error(`dimensions trop faibles (${width}x${height})`);
  const ratio = width / height;
  if (ratio < 0.18 || ratio > 5.5) throw new Error(`ratio inhabituel (${ratio.toFixed(2)})`);
  const converted = await source.resize({ width: CONFIG.maxDimension, height: CONFIG.maxDimension, fit: "inside", withoutEnlargement: true }).webp({ quality: CONFIG.webpQuality, effort: 5, smartSubsample: true }).toBuffer();
  const outMeta = await sharp(converted).metadata();
  return { buffer: converted, sourceWidth: width, sourceHeight: height, width: outMeta.width ?? width, height: outMeta.height ?? height };
}

function acceptedCandidates(entry) {
  const explicit = new Set((entry.approvedUrls ?? []).map(normalizeUrlKey));
  const candidates = Array.isArray(entry.candidates) ? entry.candidates : [];
  return candidates.filter((candidate) => {
    if (explicit.has(normalizeUrlKey(candidate.imageUrl))) return true;
    return Boolean(candidate.autoEligible) && Number(candidate.identityScore ?? candidate.score ?? 0) >= CONFIG.autoAcceptScore;
  }).sort((a, b) => {
    if (b.primaryEligible !== a.primaryEligible) return Number(b.primaryEligible) - Number(a.primaryEligible);
    if ((b.primaryScore ?? 0) !== (a.primaryScore ?? 0)) return (b.primaryScore ?? 0) - (a.primaryScore ?? 0);
    return (b.score ?? 0) - (a.score ?? 0);
  });
}

export async function runDownload(cli = {}) {
  if (!fs.existsSync(CONFIG.catalogPath)) throw new Error(`Catalogue introuvable: ${CONFIG.catalogPath}`);
  if (!fs.existsSync(PATHS.candidates)) throw new Error(`Candidats introuvables: ${PATHS.candidates}. Lancez d'abord npm run images:search.`);

  const catalog = readJson(CONFIG.catalogPath, []);
  const candidateDoc = readJson(PATHS.candidates, { products: {} });
  const approvals = readJson(path.join(CONFIG.workDir, "approved.json"), {}) || {};
  const manifest = readJson(PATHS.manifest, { version: 1, products: {} }) || { version: 1, products: {} };
  if (!Array.isArray(catalog)) throw new Error("Catalogue invalide.");

  fs.mkdirSync(CONFIG.publicProductsDir, { recursive: true });
  fs.mkdirSync(CONFIG.workDir, { recursive: true });
  if (!cli["no-backup"]) {
    const backup = backupFile(CONFIG.catalogPath, PATHS.backups);
    if (backup) console.log(`Sauvegarde catalogue: ${path.relative(CONFIG.root, backup)}`);
  }

  const start = Math.max(0, numberArg(cli.start, 0));
  const limit = Math.max(1, numberArg(cli.limit, catalog.length));
  const idFilter = cli.id ? String(cli.id) : null;
  const force = Boolean(cli.force);
  const refresh = Boolean(cli.refresh || cli["refresh-primary"]);
  const refreshExtra = refresh ? 3 : 0;

  const selected = catalog.filter((product) => {
    if (!product?.published || !String(product?.name ?? "").trim()) return false;
    if (idFilter && String(product.legacyId ?? product.slug) !== idFilter && String(product.slug) !== idFilter) return false;
    if (!force && !refresh && (product.newImages ?? []).length >= CONFIG.maxImagesPerProduct) return false;
    return true;
  }).slice(start, start + limit);

  console.log("\nCYCLORIVA â€” tÃ©lÃ©chargement V2");
  console.log(`Produits Ã  traiter: ${selected.length}`);
  console.log(`Maximum catalogue: ${CONFIG.maxImagesPerProduct}`);
  console.log(`Mode refresh: ${refresh ? "oui (+3 candidats temporaires avant classement)" : "non"}\n`);

  const report = [], failures = [];
  const startedAt = Date.now();
  let index = 0;

  for (const product of selected) {
    index += 1;
    const baseEntry = candidateDoc.products?.[product.slug];
    const entry = baseEntry ? { ...baseEntry, approvedUrls: Array.isArray(approvals[product.slug]) ? approvals[product.slug] : [] } : null;
    const currentImages = Array.isArray(product.newImages) ? [...product.newImages] : [];
    const targetLimit = CONFIG.maxImagesPerProduct + refreshExtra;
    const remaining = Math.max(0, targetLimit - currentImages.length);

    if (!entry || remaining === 0) {
      report.push({ legacyId: product.legacyId, slug: product.slug, name: product.name, downloaded: 0, totalImages: currentImages.length, status: remaining === 0 ? "complete" : "no-candidates" });
      console.log(`[${index}/${selected.length}] SKIP â€” ${product.name}`);
      continue;
    }

    const candidates = acceptedCandidates(entry);
    const productDir = path.join(CONFIG.publicProductsDir, productFolder(product));
    fs.mkdirSync(productDir, { recursive: true });
    const productManifest = manifest.products[product.slug] ?? { legacyId: product.legacyId ?? null, slug: product.slug, name: product.name, images: [] };
    const knownUrls = new Set(productManifest.images.map((item) => normalizeUrlKey(item.sourceUrl)));
    const knownHashes = new Set(productManifest.images.map((item) => item.sha256).filter(Boolean));
    let downloaded = 0;

    for (const candidate of candidates) {
      if (currentImages.length >= targetLimit) break;
      const urlKey = normalizeUrlKey(candidate.imageUrl);
      if (knownUrls.has(urlKey)) continue;
      try {
        const original = await fetchImageBuffer(candidate.imageUrl);
        const converted = await validateAndConvert(original);
        const hash = sha256(converted.buffer);
        if (knownHashes.has(hash)) continue;
        const fileNumber = Math.max(currentImages.length, productManifest.images.length) + 1;
        const fileName = `${String(fileNumber).padStart(2, "0")}.webp`;
        const target = path.join(productDir, fileName);
        fs.writeFileSync(target, converted.buffer);
        const publicPath = `/products/${productFolder(product)}/${fileName}`;
        currentImages.push(publicPath);
        knownUrls.add(urlKey); knownHashes.add(hash); downloaded += 1;
        productManifest.images.push({
          publicPath,
          sourceUrl: candidate.imageUrl,
          sourcePage: candidate.link || null,
          sourceDomain: candidate.domain || hostname(candidate.imageUrl),
          searchQuery: candidate.query || null,
          score: candidate.score ?? null,
          identityScore: candidate.identityScore ?? null,
          primaryScore: candidate.primaryScore ?? null,
          primaryEligible: Boolean(candidate.primaryEligible),
          sha256: hash,
          sourceWidth: converted.sourceWidth,
          sourceHeight: converted.sourceHeight,
          width: converted.width,
          height: converted.height,
          downloadedAt: new Date().toISOString(),
        });
        await sleep(CONFIG.downloadDelayMs);
      } catch (error) {
        failures.push({ legacyId: product.legacyId, slug: product.slug, name: product.name, score: candidate.score ?? "", domain: candidate.domain || hostname(candidate.imageUrl), imageUrl: candidate.imageUrl, error: error instanceof Error ? error.message : String(error) });
      }
    }

    product.newImages = currentImages;
    manifest.products[product.slug] = productManifest;
    writeJsonAtomic(CONFIG.catalogPath, catalog);
    writeJsonAtomic(PATHS.manifest, { version: 2, updatedAt: new Date().toISOString(), products: manifest.products });

    const status = currentImages.length > 0 ? "ok" : "missing";
    report.push({ legacyId: product.legacyId, slug: product.slug, name: product.name, downloaded, totalImages: currentImages.length, status });
    console.log(`[${index}/${selected.length}] ${status.toUpperCase()} +${downloaded} (${currentImages.length}) â€” ${product.name}`);
  }

  writeCsv(PATHS.downloadReport, report, ["legacyId", "slug", "name", "downloaded", "totalImages", "status"]);
  writeCsv(PATHS.failures, failures, ["legacyId", "slug", "name", "score", "domain", "imageUrl", "error"]);
  const withImages = catalog.filter((p) => (p.newImages ?? []).length > 0).length;
  const totalImages = catalog.reduce((sum, p) => sum + (p.newImages ?? []).length, 0);
  console.log(`\nTÃ©lÃ©chargement V2 terminÃ© en ${formatDuration(Date.now() - startedAt)}.`);
  console.log(`Produits avec image: ${withImages}/${catalog.filter((p) => p.published && String(p.name || "").trim()).length}`);
  console.log(`Images temporairement liÃ©es: ${totalImages}`);
  console.log("Le classement automatique va conserver au maximum les meilleures images du catalogue.\n");
  return { withImages, totalImages, failures: failures.length };
}

