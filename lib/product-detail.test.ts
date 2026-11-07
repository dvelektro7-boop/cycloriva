import test from "node:test";
import assert from "node:assert/strict";
import { allProducts, localizedProduct, type Product } from "./catalog";
import { descriptionSpecifications, productParagraphs } from "./product-content";
import { createProductCartDraft, createProductWhatsAppOrder, PRODUCT_ORDER_CONFIG } from "./product-order";
import { parseCart } from "./product-cart";
import { getRelatedProducts } from "../components/product/ProductRelatedProducts";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProductSummary } from "../components/product/ProductSummary";
import { ProductGallery } from "../components/product/ProductGallery";

const product = allProducts.find((item) => item.id === "826")!;
test("real 826 order uses official phone, quantity, catalogue price, totals and canonical link in all languages", () => {
  for (const locale of ["fr", "en", "de", "it", "es"] as const) {
    const result = createProductWhatsAppOrder({ product, locale, whatsappNumber: PRODUCT_ORDER_CONFIG.whatsappNumber, quantity: 3, productUrl: `https://cycloriva.example/${locale}/produits/826` });
    assert.ok(result.success);
    assert.equal(result.phone, "4915730394552");
    assert.match(result.message, /826/);
    assert.match(result.message, /3/);
    const currency = new Intl.NumberFormat({ fr: "fr-FR", en: "en-GB", de: "de-DE", it: "it-IT", es: "es-ES" }[locale], { style: "currency", currency: "EUR" });
    assert.ok(result.message.includes(currency.format(721.65)));
    assert.ok(result.message.includes(currency.format(2164.95)));
    assert.equal(new URL(result.url).searchParams.get("text"), result.message);
    assert.ok(result.message.includes(`/${locale}/produits/826`));
  }
});
test("a draft permits unconfirmed stock without confirming it; invalid quantities and confirmed zero stock are rejected", () => {
  assert.ok(createProductCartDraft(product, 2).success);
  assert.equal(product.stockConfirmed, false);
  for (const quantity of [0, -1, 1.5, 100, NaN]) assert.equal(createProductCartDraft(product, quantity).success, false);
  assert.equal(createProductCartDraft({ ...product, stockConfirmed: true, stockQuantityAtExport: 0 }, 1).success, false);
});
test("imported description yields real technical pairs and preserves all block text safely", () => {
  const specs = descriptionSpecifications(product, "es");
  assert.ok(specs.some((row) => row.label === "Batterie" && row.value === "Phylion 36V / 11.6Ah"));
  assert.deepEqual(productParagraphs("<p>A</p><script>alert(1)</script><p>B &amp; C</p>"), ["A", "B & C"]);
  const table = { ...product, description: "<table><tr><th>Moteur</th><td>Bafang</td></tr></table>" };
  assert.ok(descriptionSpecifications(table, "fr").some((row) => row.label === "Moteur" && row.value === "Bafang"));
});
test("catalogue translation is used when supplied, source fallback remains explicit", () => {
  assert.equal(localizedProduct(product, "es").translated, false);
  const translated: Product = { ...product, translations: { es: { name: "Bicicleta SIGNAL-S", description: "Descripción", shortDescription: "Resumen" } } };
  assert.equal(localizedProduct(translated, "es").name, "Bicicleta SIGNAL-S");
  assert.equal(localizedProduct(translated, "es").translated, true);
});
test("similar products never rely on the cycling umbrella alone or recommend a city bike for an MTB", () => {
  const city = { ...product, id: "999", name: "Vélo de ville", categories: [...product.categories] };
  const umbrella = { ...product, id: "998", categories: ["Vélos / Cyclisme"] };
  const comparable = { ...product, id: "997" };
  assert.deepEqual(getRelatedProducts(product, [product, city, umbrella, comparable]).map((item) => item.id), ["997"]);
});
test("persisted cart rejects malformed entries and never trusts supplied prices", () => {
  assert.deepEqual(parseCart("broken"), []);
  assert.deepEqual(parseCart(JSON.stringify([{ productId: "826", quantity: 2, price: 0 }, { productId: "826", quantity: 3 }, { productId: "x", quantity: 1 }, { productId: "818", quantity: 100 }])), [{ productId: "826", quantity: 5 }]);
});
test("summary keeps real price near the title without rendering the imported technical inventory", () => {
  const html = renderToStaticMarkup(createElement(ProductSummary, { product, locale: "fr" }));
  assert.ok(html.includes("SIGNAL-S"));
  assert.ok(html.includes("721,65"));
  assert.ok(html.includes("En stock"));
  assert.ok(!html.includes("Temps de charge"));
  assert.ok(!html.includes("Best-seller"));
  assert.ok(!html.includes("4,8"));
});
test("gallery renders four real thumbnails and accurate remainder, but no invented thumbnails for one image", () => {
  const html = renderToStaticMarkup(createElement(ProductGallery, { product, locale: "fr" }));
  assert.ok(html.includes("+5"));
  assert.ok(html.includes('aria-label="Image 4 sur 9"'));
  assert.ok(!html.includes('aria-label="Image 5 sur 9"'));
  const single = renderToStaticMarkup(createElement(ProductGallery, { product: { ...product, images: [product.images[0]] }, locale: "fr" }));
  assert.ok(!single.includes('aria-label="Image 1 sur 1"'));
  assert.ok(!single.includes('aria-label="Image suivante"'));
  assert.ok(!single.includes("+1"));
});
