import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
const base = "http://localhost:3000";
const products = JSON.parse(fs.readFileSync("data/products.json", "utf8"));
const cases = ["/fr/produits/826", "/en/produits/826", "/de/produits/826", "/it/produits/826", "/es/produits/826", "/fr/produits/818", "/fr/produits/1203", "/fr/produits/1459", "/fr/produits/3150"];
for (const path of cases) {
  const response = await fetch(base + path, { signal: AbortSignal.timeout(120000) });
  const html = await response.text();
  assert.equal(response.status, 200, path);
  assert.ok(html.includes('data-component="product-summary"'), path + " summary");
  assert.ok(html.includes('data-component="product-gallery"'), path + " gallery");
  assert.ok(html.includes('data-component="product-details-tabs"'), path + " tabs");
  assert.ok(html.includes('data-component="product-mobile-navigation"'), path + " navigation");
  assert.ok(html.includes('data-component="site-main-footer" class="hidden lg:block"'), path + " scoped footer");
  const locale = path.split("/")[1];
  assert.ok(html.includes(`href="/${locale}/panier"`), path + " cart");
  assert.ok(html.includes(`href="/${locale}/favoris"`), path + " favorites");
  assert.ok(!html.includes('body:has('), path + " no global footer hiding");
  assert.ok(!html.includes('NEXT_HTTP_ERROR_FALLBACK;500'), path + " no streaming server failure");
  console.log("PASS", path);
}
for (const path of ["/fr", "/fr/produits", "/es/panier", "/es/favoris"]) {
  const response = await fetch(base + path, { signal: AbortSignal.timeout(120000) });
  const html = await response.text();
  assert.equal(response.status, 200, path);
  assert.ok(html.includes('data-component="site-main-footer" class=""'), path + " normal footer");
  console.log("PASS", path, "footer retained");
}
for (const id of ["826", "818", "1203", "1459", "3150"]) {
  const product = products.find((product) => product.id === id);
  for (const image of product.images.filter((image) => image.startsWith("/images/"))) assert.ok(fs.existsSync("public" + image), image);
  if (product.images[0]) {
    const response = await fetch(base + product.images[0]);
    assert.equal(response.status, 200, id + " image response");
    assert.match(response.headers.get("content-type"), /^image\//);
  }
  console.log("PASS", id, product.images.length, "local image files checked");
}
assert.equal(crypto.createHash("sha256").update(fs.readFileSync("data/products.json")).digest("hex"), fs.readFileSync(".image-work/product-data-before.sha256", "utf8"));
console.log("PASS catalogue unchanged, 401 products preserved");
