import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readOptions, productSignature, prepareCandidate, findMatch, collectIndex, fetchBuffer, parseSitemap, fileKey } from './lib/product-images.mjs';
import { recoverImages, usableLocalImages } from './telecharger-images.mjs';

const imageUrl = (id, name) => `https://cdn02.plentymarkets.com/mrt54q44tptl/item/images/${id}/full/${name}.jpg`;
const candidate = (id, slug, files) => prepareCandidate({ itemId: id, urls: [`https://www.gonser.ch/${slug}/a-${id}/`], images: files.map(name => imageUrl(id, name)) });
const signature = (name, files = []) => productSignature({ name, attributes: {} }, files.map(originalFilename => ({ originalFilename })));
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==', 'base64');

test('default threshold is 0.68, explicit zero is preserved and invalid options fail', () => {
  assert.equal(readOptions([]).minScore, 0.68);
  assert.equal(readOptions(['--min-score=0']).minScore, 0);
  assert.equal(readOptions(['--min-score=0.8']).minScore, 0.8);
  for (const value of ['', '-1', '1.1', 'abc']) assert.throws(() => readOptions([`--min-score=${value}`]));
});

test('PANTHER-X 27.5 and 29 remain distinct despite identical model words', () => {
  const a = candidate('10273', 'e-bike-fully-27-5-panther-l-xl', ['E-Bike-Fully-Mountainbike-27-5-Zoll-PANTHER-X-Anzeigebild']);
  const b = candidate('10274', 'e-bike-fully-29-panther', ['E-Bike-Fully-Mountainbike-29-Zoll-PANTHER-X-Anzeigebild']);
  for (const [wheel, expected] of [['27.5', '10273'], ['29', '10274']]) {
    const result = findMatch(signature(`Vélo électrique ${wheel}" PANTHER-X`, [`E-Bike-Fully-Mountainbike-${wheel.replace('.', '-')}-Zoll-PANTHER-X-Anzeigebild-scaled.jpg`]), [b, a]);
    assert.equal(result.classification, 'exact');
    assert.equal(result.best.candidate.itemId, expected);
  }
});

test('PANTHER-S cannot receive PANTHER-X, even at threshold zero', () => {
  const other = candidate('10273', 'e-bike-fully-27-5-panther-x', ['E-Bike-Fully-Mountainbike-27-5-Zoll-PANTHER-X-Anzeigebild']);
  assert.equal(findMatch(signature('Vélo 27.5" PANTHER-S'), [other], 0).classification, 'manual');
});

test('RILEY mint/menthe and black/noir match their own historical image files', () => {
  const mint = candidate('100', 'e-bike-city-riley-mint', ['E-Bike-City-Bike-28-Zoll-mint-3']);
  const black = candidate('101', 'e-bike-city-riley-schwarz', ['E-Bike-City-Bike-28-Zoll-schwarz-1']);
  for (const [color, file, expected] of [['mint', 'mint-3', '100'], ['noir', 'schwarz-1', '101']]) {
    const result = findMatch(signature(`E-Bike City RILEY ${color}`, [`E-Bike-City-Bike-28-Zoll-${file}--scaled.jpg`]), [black, mint]);
    assert.equal(result.classification, 'exact'); assert.equal(result.best.candidate.itemId, expected);
  }
  assert.equal(findMatch(signature('E-Bike City RILEY menthe'), [black], 0).classification, 'manual');
});

test('missing color, accessory, conflicting frame size and mixed gallery require review', () => {
  for (const other of [
    candidate('1', 'e-bike-riley', ['E-Bike-RILEY']),
    candidate('2', 'ersatzakku-fuer-city-e-bike-riley-mint', ['Ersatzakku-RILEY-mint']),
    candidate('3', 'e-bike-riley-mint-54-cm', ['E-Bike-RILEY-mint']),
    candidate('4', 'e-bike-riley-mint', ['E-Bike-RILEY-mint', 'E-Bike-RILEY-schwarz']),
  ]) assert.equal(findMatch(signature('E-Bike City RILEY mint 49 cm'), [other], 0).classification, 'manual');
});

test('ambiguous identical candidates are not automatically accepted', () => {
  const a = candidate('1', 'e-bike-riley-mint', ['E-Bike-City-Bike-28-Zoll-mint-Anzeigebild']);
  const b = candidate('2', 'e-bike-riley-mint', ['E-Bike-City-Bike-28-Zoll-mint-Anzeigebild']);
  assert.equal(findMatch(signature('E-Bike City RILEY mint', ['E-Bike-City-Bike-28-Zoll-mint-Anzeigebild-scaled.jpg']), [a, b]).classification, 'manual');
  assert.notEqual(fileKey('Bike-27-5.jpg'), fileKey('Bike-29.jpg'));
});

test('battery capacity, power and board length distinguish otherwise identical variants', () => {
  const differentCapacity = candidate('1', 'city-bike-example-500wh-noir', ['E-Bike-Example-500Wh-black']);
  assert.equal(findMatch(signature('City bike EXAMPLE 1000Wh noir'), [differentCapacity], 0).classification, 'manual');
  const differentPower = candidate('2', 'scooter-example-350-watt', ['Scooter-Example-350-Watt']);
  assert.equal(findMatch(signature('Scooter EXAMPLE 500 Watt'), [differentPower], 0).classification, 'manual');
  const board = candidate('3', 'aqua-marina-magma-340-cm', ['Aqua-Marina-Magma-340-cm']);
  assert.equal(findMatch(signature('Aqua marina Magma 12`6'), [board], 0).classification, 'manual');
});

test('source parser uses image locs and deduplicates multilingual product IDs', async () => {
  const block = slug => `<url><loc>https://www.gonser.ch/${slug}/a-1/</loc><image:image><image:loc>${imageUrl('1', 'RILEY-mint')}</image:loc></image:image></url>`;
  const xml = `<urlset>${block('riley-mint')}${block('fr/riley-menthe')}</urlset>`;
  const index = await collectIndex('https://www.gonser.ch/sitemap.xml', { load: async () => xml });
  assert.equal(index.complete, true); assert.equal(index.candidates.length, 1);
  assert.equal(index.candidates[0].urls.length, 2); assert.equal(index.candidates[0].images.length, 1);
  assert.throws(() => parseSitemap(xml.slice(0, -10)), /incomplet/);
});

test('timeout of one sitemap aborts instead of using the other partial source', async () => {
  await assert.rejects(collectIndex('https://www.gonser.ch/sitemap.xml', { load: async url => {
    if (url.endsWith('/sitemap.xml')) return '<sitemapindex><sitemap><loc>https://www.gonser.ch/a.xml</loc></sitemap><sitemap><loc>https://www.gonser.ch/b.xml</loc></sitemap></sitemapindex>';
    if (url.endsWith('/b.xml')) throw Error('Timeout');
    return '<urlset><url><loc>https://www.gonser.ch/riley/a-1/</loc></url></urlset>';
  } }), error => error.index.complete === false && error.index.failures.length === 1 && error.index.candidateCount === 1);
});

test('HTTP retries timeouts including failures while reading the body', async () => {
  let attempts = 0;
  const { buffer } = await fetchBuffer('https://www.gonser.ch/test', { delay: async () => {}, fetchImpl: async () => {
    attempts++;
    if (attempts === 1) throw Error('Timeout');
    if (attempts === 2) return new Response(new ReadableStream({ start(controller) { controller.error(Error('Body timeout')); } }));
    return new Response('complete');
  } });
  assert.equal(attempts, 3); assert.equal(buffer.toString(), 'complete');
});

test('local recovery preserves existing image bytes and every non-image product field', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'cycloriva-images-'));
  t.after(async () => {
    assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith('cycloriva-images-'));
    await fs.rm(root, { recursive: true, force: true });
  });
  await fs.mkdir(path.join(root, 'data/migration'), { recursive: true });
  await fs.mkdir(path.join(root, 'public/images/produits/818'), { recursive: true });
  await fs.writeFile(path.join(root, 'public/images/produits/818/01.png'), png);
  const products = [
    { id: '818', name: 'Existing product', images: ['/images/produits/818/01.png'], price: 934.15, description: 'unchanged', categories: ['test'], translations: { it: { name: 'test' } } },
    { id: '840', name: 'Vélo 29" PANTHER-X', images: [], price: 849.15, description: 'unchanged', categories: ['test'], translations: {} },
  ];
  const manifest = [{ productId: '840', originalFilename: 'E-Bike-Fully-Mountainbike-29-Zoll-PANTHER-X-Anzeigebild-scaled.jpg' }];
  const raw = JSON.stringify(products);
  await fs.writeFile(path.join(root, 'data/products.json'), raw);
  await fs.writeFile(path.join(root, 'data/migration/images.json'), JSON.stringify(manifest));
  const indexLoader = async () => ({ complete: true, fetchedAt: new Date().toISOString(), candidates: [{ itemId: '10274', urls: ['https://www.gonser.ch/e-bike-29-panther-x/a-10274/'], images: [imageUrl('10274', 'E-Bike-Fully-Mountainbike-29-Zoll-PANTHER-X-Anzeigebild')] }] });
  const imageLoader = async () => ({ buffer: png, contentType: 'image/png' });
  const options = readOptions([]);
  await recoverImages({ root, options: { ...options, dryRun: true }, indexLoader, imageLoader });
  assert.equal(await fs.readFile(path.join(root, 'data/products.json'), 'utf8'), raw);
  const report = await recoverImages({ root, options, indexLoader, imageLoader });
  assert.equal(report.skippedAlreadyLocal, 1); assert.equal(report.productsWithDownloadedImages, 1);
  const result = JSON.parse(await fs.readFile(path.join(root, 'data/products.json'), 'utf8'));
  const withoutImages = list => list.map(product => Object.fromEntries(Object.entries(product).filter(([key]) => key !== 'images')));
  assert.deepEqual(withoutImages(result), withoutImages(products));
  assert.deepEqual(result[0], products[0]);
  assert.deepEqual(await fs.readFile(path.join(root, 'public/images/produits/818/01.png')), png);
  assert.deepEqual(result[1].images, ['/images/produits/840/01.png']);
  assert.equal((await usableLocalImages(root, result[1].images)).length, 1);
  const second = await recoverImages({ root, options, indexLoader, imageLoader });
  assert.equal(second.skippedAlreadyLocal, 2); assert.equal(second.imagesDownloaded, 0);
  const beforeFailure = await fs.readFile(path.join(root, 'data/products.json'), 'utf8');
  await assert.rejects(recoverImages({ root, options, indexLoader: async () => { throw Error('Timeout'); }, imageLoader }));
  assert.equal(await fs.readFile(path.join(root, 'data/products.json'), 'utf8'), beforeFailure);

  // Exercise the real CSV importer in an isolated fixture, never on the live catalogue.
  await fs.mkdir(path.join(root, 'scripts/lib'), { recursive: true });
  await fs.copyFile(new URL('./importer-catalogue.mjs', import.meta.url), path.join(root, 'scripts/importer-catalogue.mjs'));
  await fs.copyFile(new URL('./lib/woocommerce.mjs', import.meta.url), path.join(root, 'scripts/lib/woocommerce.mjs'));
  const source = 'ID,Nom,Description,Description courte,Images,UGS,Catégories,Tarif régulier,Tarif promo,Stock,Poids (kg),Longueur (cm),Largeur (cm),Hauteur (cm)\n818,Existing product,unchanged,,,SKU,test,934.15,,,,,,\n840,Vélo 29 PANTHER-X,unchanged,,,SKU,test,849.15,,,,,,\n';
  await fs.writeFile(path.join(root, 'export.csv'), source);
  await promisify(execFile)(process.execPath, [path.join(root, 'scripts/importer-catalogue.mjs'), path.join(root, 'export.csv')]);
  const reimported = JSON.parse(await fs.readFile(path.join(root, 'data/products.json'), 'utf8'));
  assert.deepEqual(reimported.map(product => product.images), result.map(product => product.images));
  const provenance = JSON.parse(await fs.readFile(path.join(root, 'data/migration/images.json'), 'utf8'));
  assert.equal(provenance.filter(row => row.origin === 'gonser').length, 1);
});
