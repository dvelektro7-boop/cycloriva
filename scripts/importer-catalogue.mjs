// node scripts/importer-catalogue.mjs <export.csv> [dossier-images]
// Local import only: no request to former domains, no invented product photos.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parseCsv, plainText, numberOrNull } from './lib/woocommerce.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2];
if (!source) throw new Error('Utilisation : node scripts/importer-catalogue.mjs <export.csv> [dossier-images]');
const csv = await fs.readFile(source, 'utf8');
const rows = parseCsv(csv);
const dataPath = path.join(root, 'data/products.json');
const previous = JSON.parse(await fs.readFile(dataPath, 'utf8'));
const previousById = new Map(previous.map(product => [product.id, product]));
const imageDir = path.join(root, 'public/images/produits');
const migrationDir = path.join(root, 'data/migration');
await fs.mkdir(imageDir, { recursive: true });
await fs.mkdir(migrationDir, { recursive: true });
const previousManifest = await fs.readFile(path.join(migrationDir, 'images.json'), 'utf8').then(JSON.parse).catch(error => {
  if (error.code === 'ENOENT') return [];
  throw error;
});
async function localImageExists(image) {
  if (typeof image !== 'string' || !image.startsWith('/images/produits/')) return false;
  const full = path.resolve(root, 'public', `.${image}`);
  if (!full.startsWith(imageDir + path.sep)) return false;
  try { const stat = await fs.stat(full); return stat.isFile() && stat.size > 0; }
  catch { return false; }
}

// Index only the image backup explicitly supplied by the user.
const imageFiles = new Map();
async function indexImages(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await indexImages(full);
    else if (/\.(jpe?g|png|webp|gif|avif)$/i.test(entry.name)) {
      const key = entry.name.toLowerCase();
      const matches = imageFiles.get(key) ?? [];
      matches.push(full); imageFiles.set(key, matches);
    }
  }
}
if (process.argv[3]) await indexImages(path.resolve(process.argv[3]));
const localFiles = new Set(await fs.readdir(imageDir));
const manifest = [];
const products = [];
const ids = new Set();
for (const row of rows) {
  const id = row.ID.trim();
  if (!id || ids.has(id)) throw new Error(`Identifiant manquant ou dupliqué : ${id}`);
  ids.add(id);
  const old = previousById.get(id);
  const images = [];
  // A CSV reimport must not erase galleries already recovered in product-ID folders.
  for (const image of old?.images ?? []) if (await localImageExists(image)) images.push(image);
  for (const sourceUrl of row.Images.split(/,\s*/).filter(Boolean)) {
    const basename = decodeURIComponent(new URL(sourceUrl).pathname.split('/').pop());
    const hash = crypto.createHash('sha256').update(sourceUrl).digest('hex').slice(0, 20);
    const candidates = imageFiles.get(basename.toLowerCase()) ?? [];
    const existing = [...localFiles].find(file => file.startsWith(`${hash}.`));
    let filename = existing;
    if (!filename && candidates.length === 1) {
      filename = `${hash}${path.extname(basename).toLowerCase()}`;
      await fs.copyFile(candidates[0], path.join(imageDir, filename));
      localFiles.add(filename);
    }
    const local = filename ? `/images/produits/${filename}` : null;
    manifest.push({ productId: id, sourceUrl, originalFilename: basename, local, status: local ? 'imported' : candidates.length > 1 ? 'ambiguous' : 'missing' });
    if (local) images.push(local);
  }
  const attributes = {};
  for (let index = 1; index <= 2; index++) {
    const name = plainText(row[`Nom de l’attribut ${index}`]);
    const value = plainText(row[`Valeur(s) de l’attribut ${index}`]);
    if (name && value) attributes[name] = value;
  }
  const regularPrice = numberOrNull(row['Tarif régulier']);
  const salePrice = numberOrNull(row['Tarif promo']);
  products.push({
    ...old,
    id,
    name: plainText(row.Nom),
    // Preserve the imported selling price; historical promotions are kept separately.
    price: old?.price ?? regularPrice ?? salePrice,
    regularPrice,
    salePrice,
    sku: row.UGS.trim(),
    categories: row['Catégories'].split(/,\s*/).filter(Boolean),
    images: [...new Set(images)],
    shortDescription: plainText(row['Description courte']),
    description: plainText(row.Description),
    attributes,
    weightKg: numberOrNull(row['Poids (kg)']),
    dimensionsCm: { length: numberOrNull(row['Longueur (cm)']), width: numberOrNull(row['Largeur (cm)']), height: numberOrNull(row['Hauteur (cm)']) },
    stockAtExport: row['En stock ?'] === '1',
    stockQuantityAtExport: numberOrNull(row.Stock),
    stockConfirmed: old?.stockConfirmed ?? false,
    translations: old?.translations ?? {},
  });
}
for (const row of previousManifest) {
  if (row.origin === 'gonser' && products.some(product => product.id === row.productId && product.images.includes(row.local))) manifest.push(row);
}
// Keep every original CSV field, including migration URLs, outside storefront data.
await fs.writeFile(path.join(migrationDir, 'woocommerce-source.csv'), csv, 'utf8');
await fs.writeFile(path.join(migrationDir, 'images.json'), JSON.stringify(manifest, null, 2) + '\n');
const report = {
  products: products.length,
  productsWithImages: products.filter(product => product.images.length).length,
  importedImages: manifest.filter(image => image.local).length,
  missingImages: manifest.filter(image => !image.local).length,
  missingNames: products.filter(product => !product.name).map(product => product.id),
  missingPrices: products.filter(product => product.price === null).map(product => product.id),
  missingDescriptions: products.filter(product => !product.description).map(product => product.id),
  pricesDifferentFromRegularExport: products.filter(product => product.regularPrice !== null && product.price !== product.regularPrice).map(product => ({ id: product.id, price: product.price, regularPrice: product.regularPrice })),
};
await fs.writeFile(path.join(migrationDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
await fs.writeFile(dataPath, JSON.stringify(products, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
