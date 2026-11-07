// Recovery changes product.images only. Existing usable images are preserved.
// node scripts/telecharger-images.mjs --ids=840,860,894 --dry-run
// --limit=N --min-score=0.68 --use-cache --force
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { readOptions, collectIndex, prepareCandidate, productSignature, findMatch, fileKey, filename, fetchBuffer, validImageUrl } from './lib/product-images.mjs';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitemapUrl = 'https://www.gonser.ch/sitemap.xml';
const mimeExt = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const withoutImages = products => products.map(product => Object.fromEntries(Object.entries(product).filter(([key]) => key !== 'images')));

export async function usableLocalImages(root, images) {
  const valid = [];
  for (const image of images ?? []) {
    if (typeof image !== 'string' || !image.startsWith('/images/produits/')) continue;
    const full = path.resolve(root, 'public', `.${image}`);
    const allowed = path.resolve(root, 'public/images/produits') + path.sep;
    if (!full.startsWith(allowed)) continue;
    try {
      const metadata = await sharp(full).metadata();
      if (metadata.width > 0 && metadata.height > 0) valid.push(image);
    } catch { /* Missing/corrupt files must not count as already recovered. */ }
  }
  return valid;
}

async function atomicJson(file, value) {
  const temporary = `${file}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(value, null, 2) + '\n');
  await fs.rename(temporary, file);
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  }));
  return results;
}

export async function recoverImages({ root = projectRoot, options = readOptions(process.argv.slice(2)), indexLoader = collectIndex, imageLoader = fetchBuffer } = {}) {
  const productsPath = path.join(root, 'data/products.json');
  const manifestPath = path.join(root, 'data/migration/images.json');
  const reportPath = path.join(root, 'data/rapport-recuperation-images.json');
  const cachePath = path.join(root, '.next/cache/cycloriva-images/source-index.json');
  const productsRaw = await fs.readFile(productsPath, 'utf8');
  const manifestRaw = await fs.readFile(manifestPath, 'utf8');
  const products = JSON.parse(productsRaw), manifest = JSON.parse(manifestRaw);
  const originalData = JSON.stringify(withoutImages(products));
  const report = { date: new Date().toISOString(), source: 'https://www.gonser.ch/', productCount: products.length, minScore: options.minScore, dryRun: options.dryRun, sourceIndex: null, processed: 0, skippedAlreadyLocal: 0, productsWithDownloadedImages: 0, imagesDownloaded: 0, needsManualReview: 0, imageFailures: 0, matches: [] };
  console.log(`CYCLORIVA : ${products.length} produits — seuil ${options.minScore} — ${options.dryRun ? 'simulation' : 'récupération'}`);
  let index;
  try {
    if (options.useCache) {
      index = JSON.parse(await fs.readFile(cachePath, 'utf8'));
      const age = Date.now() - Date.parse(index.fetchedAt);
      if (!index.complete || index.sitemapUrl !== sitemapUrl || !Array.isArray(index.candidates) || !index.candidates.length || !Number.isFinite(age) || age < 0 || age > 24 * 3600_000) throw Error('Cache absent, incomplet ou expiré : relancer sans --use-cache.');
    } else {
      index = await indexLoader(sitemapUrl, { onProgress: progress => console.log(`Source : ${progress.products} articles indexés — ${progress.url}`) });
      if (!index.complete) throw Error('Index source incomplet.');
      await fs.mkdir(path.dirname(cachePath), { recursive: true });
      await atomicJson(cachePath, index);
    }
    report.sourceIndex = { complete: true, fetchedAt: index.fetchedAt, sitemapCount: index.sitemapCount, candidateCount: index.candidates.length, cache: options.useCache };
  } catch (error) {
    report.sourceIndex = error.index ?? { complete: false, error: String(error.message ?? error) };
    report.aborted = true;
    await atomicJson(reportPath, report);
    throw error;
  }
  const candidates = index.candidates.map(prepareCandidate);
  const byProduct = new Map();
  for (const row of manifest) {
    const rows = byProduct.get(String(row.productId)) ?? [];
    rows.push(row); byProduct.set(String(row.productId), rows);
  }
  let selection = products.filter(product => !options.ids || options.ids.includes(String(product.id)));
  if (options.ids?.some(id => !products.some(product => String(product.id) === id))) throw Error('Identifiant --ids inconnu.');
  if (options.limit) selection = selection.slice(0, options.limit);
  let changed = false;
  for (const product of selection) {
    const valid = await usableLocalImages(root, product.images);
    if (!options.force && valid.length > 0 && valid.length === product.images.length) {
      report.skippedAlreadyLocal++;
      report.matches.push({ productId: product.id, classification: 'already-local', localImages: valid });
      continue;
    }
    report.processed++;
    const rows = byProduct.get(String(product.id)) ?? [];
    // Recovered CDN rows are provenance, not independent historical identity evidence.
    const historical = rows.filter(row => row.origin !== 'gonser');
    const signature = productSignature(product, historical);
    const result = findMatch(signature, candidates, options.minScore);
    const best = result.best;
    const entry = {
      productId: product.id, productName: product.name, classification: result.classification,
      confidence: best?.score ?? 0, gap: result.gap,
      sourceItemId: best?.candidate.itemId ?? null, sourceUrl: best?.candidate.urls[0] ?? null,
      evidence: best?.exactFiles ?? [],
      reasons: [...(best?.reasons ?? ['no-source-candidate']), ...result.reasons],
      topCandidates: result.top.map(match => ({ itemId: match.candidate.itemId, score: match.score, reasons: match.reasons, url: match.candidate.urls[0] })),
      localImages: valid, failures: [],
    };
    report.matches.push(entry);
    console.log(`${product.id} ${result.classification} ${entry.confidence.toFixed(3)} — ${product.name || '(nom absent)'}`);
    if (result.classification === 'manual') { report.needsManualReview++; continue; }
    if (options.dryRun) continue;
    if (!/^[a-zA-Z0-9_-]+$/.test(String(product.id))) throw Error('Identifiant produit non sûr.');
    const folder = path.join(root, 'public/images/produits', String(product.id));
    await fs.mkdir(folder, { recursive: true });
    const existingNames = new Set(await fs.readdir(folder));
    const knownHashes = new Set(await Promise.all(valid.map(async image => hash(await fs.readFile(path.join(root, 'public', image))))));
    // Prefer the CDN's original full-size images; one file per photo, no AVIF duplicates.
    const images = best.candidate.images.filter(url => validImageUrl(url, best.candidate.itemId));
    const plan = [...new Map(images.map(url => [fileKey(filename(url)), url])).values()].slice(0, 16).map(imageUrl => {
      let number = 1;
      while ([...existingNames].some(name => name.startsWith(`${String(number).padStart(2, '0')}.`))) number++;
      const stem = String(number).padStart(2, '0');
      existingNames.add(`${stem}.reserved`);
      return { imageUrl, stem };
    });
    const downloaded = await mapPool(plan, 4, async ({ imageUrl, stem }) => {
      let pendingDigest;
      try {
        const { buffer, contentType } = await imageLoader(imageUrl, { maxBytes: 15_000_000, timeoutMs: 30000 });
        const ext = mimeExt[contentType];
        if (!ext || !buffer.length) throw Error(`Réponse non image : ${contentType}`);
        const metadata = await sharp(buffer).metadata();
        if (!metadata.width || !metadata.height) throw Error('Image illisible.');
        const digest = hash(buffer);
        if (knownHashes.has(digest)) return null;
        knownHashes.add(digest); pendingDigest = digest;
        const name = `${stem}.${ext}`;
        // Exclusive creation also protects valid files during --force or concurrent runs.
        await fs.writeFile(path.join(folder, name), buffer, { flag: 'wx' });
        const local = `/images/produits/${product.id}/${name}`;
        return { local, sourceUrl: imageUrl };
      } catch (error) {
        if (pendingDigest) knownHashes.delete(pendingDigest);
        report.imageFailures++;
        entry.failures.push({ url: imageUrl, error: String(error.message ?? error) });
        return null;
      }
    });
    const accepted = downloaded.filter(Boolean).map(image => image.local);
    for (const image of downloaded.filter(Boolean)) {
      manifest.push({ productId: String(product.id), sourceUrl: image.sourceUrl, originalFilename: filename(image.sourceUrl), local: image.local, status: 'imported', origin: 'gonser', sourceItemId: best.candidate.itemId, confidence: best.score });
      report.imagesDownloaded++;
    }
    if (accepted.length) {
      product.images = [...valid, ...accepted];
      entry.localImages = product.images;
      report.productsWithDownloadedImages++;
      changed = true;
    }
  }
  if (JSON.stringify(withoutImages(products)) !== originalData) throw Error('Une donnée hors images a changé : sauvegarde annulée.');
  if (changed) {
    if (await fs.readFile(productsPath, 'utf8') !== productsRaw || await fs.readFile(manifestPath, 'utf8') !== manifestRaw) throw Error('Les données ont été modifiées pendant la récupération : sauvegarde annulée.');
    const suffix = new Date().toISOString().replace(/[:.]/g, '-');
    await fs.copyFile(productsPath, `${productsPath}.backup-images-${suffix}`);
    await fs.copyFile(manifestPath, `${manifestPath}.backup-images-${suffix}`);
    await atomicJson(manifestPath, manifest);
    await atomicJson(productsPath, products);
  }
  await atomicJson(reportPath, report);
  console.log(`Terminé : ${report.skippedAlreadyLocal} déjà locaux conservés, ${report.productsWithDownloadedImages} produits récupérés, ${report.imagesDownloaded} photos, ${report.needsManualReview} à vérifier, ${report.imageFailures} erreurs image.`);
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  recoverImages().catch(error => { console.error(error.message ?? error); process.exitCode = 1; });
}
