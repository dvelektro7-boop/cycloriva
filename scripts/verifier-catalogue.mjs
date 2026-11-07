import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { parseCsv, numberOrNull, plainText } from './lib/woocommerce.mjs';

// Exercise quoted commas, doubled quotes, multiline descriptions, BOM and trailing empty metadata.
const fixture = '\uFEFFID,Nom,Description,Images,Meta\r\n1,"Vélo ""City"", bleu","Ligne 1\nLigne 2",\r\n';
assert.deepEqual(parseCsv(fixture), [{ ID: '1', Nom: 'Vélo "City", bleu', Description: 'Ligne 1\nLigne 2', Images: '', Meta: '' }]);
assert.equal(numberOrNull(''), null);
assert.equal(numberOrNull('0'), 0);
assert.equal(numberOrNull('12,50'), 12.5);
assert.equal(plainText('<p>Vélo &amp; accessoires</p><script>bad()</script>'), 'Vélo & accessoires');

const products = JSON.parse(await fs.readFile(new URL('../data/products.json', import.meta.url), 'utf8'));
const rows = parseCsv(await fs.readFile(new URL('../data/migration/woocommerce-source.csv', import.meta.url), 'utf8'));
assert.equal(products.length, rows.length);
assert.equal(new Set(products.map(p => p.id)).size, products.length);
for (const row of rows) {
  const product = products.find(p => p.id === row.ID);
  assert.ok(product, `Produit absent : ${row.ID}`);
  assert.equal(product.name, plainText(row.Nom));
  assert.equal(product.description, plainText(row.Description));
  assert.equal(product.shortDescription, plainText(row['Description courte']));
  assert.equal(product.regularPrice, numberOrNull(row['Tarif régulier']));
  assert.equal(product.price, numberOrNull(row['Tarif régulier']) ?? numberOrNull(row['Tarif promo']));
  assert.equal(product.weightKg, numberOrNull(row['Poids (kg)']));
  for (const image of product.images) {
    assert.ok(image.startsWith('/images/produits/'), `Image externe : ${image}`);
    await fs.access(new URL(`../public${image}`, import.meta.url));
  }
}
assert.ok(!JSON.stringify(products).includes('velo-nauta.com'));
console.log(`${products.length} produits vérifiés contre le CSV : noms, descriptions, prix, poids et images locales.`);

if (process.argv.includes('--http')) {
  for (const locale of ['fr', 'en', 'de', 'it', 'es']) {
    const response = await fetch(`http://localhost:3000/${locale}/produits`, { signal: AbortSignal.timeout(30000) });
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.ok(html.includes('PANTHER-X'));
    assert.ok(!html.includes('velo-nauta.com'));
    assert.ok(!html.includes('data-dgst='), `Erreur de rendu : ${locale}`);
    const links = html.match(new RegExp(`href="/${locale}/produits/[0-9]+"`, 'g')) ?? [];
    assert.equal(links.length, products.length);
    console.log(`${locale} : catalogue HTTP 200, ${links.length} produits, aucun ancien domaine.`);
  }
  for (const route of ['/fr/produits/818', '/es/produits/818', '/fr/produits/1982', '/fr/produits/886', '/fr/produits?q=818', '/fr/produits?q=zzzz-no-product']) {
    const response = await fetch(`http://localhost:3000${route}`, { signal: AbortSignal.timeout(30000) });
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.ok(!html.includes('data-dgst='), `Erreur de rendu : ${route}`);
    assert.ok(!html.includes('velo-nauta.com'));
    if (route.endsWith('/818')) {
      assert.ok(html.includes('PANTHER-X'));
      assert.ok(html.includes('Shimano'));
      assert.ok(html.includes('934'));
    }
    if (route.includes('q=818')) assert.equal((html.match(/href="\/fr\/produits\/[0-9]+"/g) ?? []).length, 1);
    if (route.includes('q=zzzz')) assert.ok(html.includes('Aucun produit trouvé'));
    console.log(`${route} : HTTP 200, rendu sans erreur.`);
  }
}
