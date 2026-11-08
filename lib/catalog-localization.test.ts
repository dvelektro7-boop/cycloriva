import assert from "node:assert/strict";
import test from "node:test";
import { allProducts, localizedProduct, type Product } from "./catalog";
import { searchCatalogProducts, sortCatalogProducts } from "./catalog-filters";
import { calculateCheckoutPricing } from "./checkout-pricing";

const translatedProduct: Product = {
  ...allProducts[0],
  name: "Vélo de montagne bleu",
  shortDescription: "Un vélo électrique de 250 W.",
  description: "Moteur de 250 W, batterie de 36 V et roues de 27.5 pouces.",
  translations: {
    de: { name: "Blaues Mountainbike", shortDescription: "Ein Elektrofahrrad mit 250 W.", description: "250-W-Motor, 36-V-Akku und 27.5-Zoll-Räder." },
    en: { name: "Blue mountain bike", shortDescription: "A 250 W electric bike.", description: "250 W motor, 36 V battery and 27.5-inch wheels." },
    es: { name: "Bicicleta de montaña azul", shortDescription: "Una bicicleta eléctrica de 250 W.", description: "Motor de 250 W, batería de 36 V y ruedas de 27.5 pulgadas." },
    it: { name: "Mountain bike blu", shortDescription: "Una bicicletta elettrica da 250 W.", description: "Motore da 250 W, batteria da 36 V e ruote da 27.5 pollici." },
  },
};

test("language changes select complete product content and preserve technical numbers and source data", () => {
  const before = JSON.stringify(translatedProduct);
  for (const locale of ["fr", "en", "de", "es", "it"] as const) {
    const result = localizedProduct(translatedProduct, locale);
    assert.equal(result.translated, true);
    assert.deepEqual(result.description.match(/\d+(?:\.\d+)?/g), ["250", "36", "27.5"]);
    assert.equal(result.name, locale === "fr" ? translatedProduct.name : translatedProduct.translations[locale].name);
  }
  assert.equal(JSON.stringify(translatedProduct), before);
});

test("catalogue search and alphabetical sorting use the selected language", () => {
  assert.equal(searchCatalogProducts([translatedProduct], "Mountainbike", "de")[0]?.id, translatedProduct.id);
  assert.equal(searchCatalogProducts([translatedProduct], "batteria", "it")[0]?.id, translatedProduct.id);
  const other: Product = { ...translatedProduct, id: "other", name: "A", translations: { de: { name: "Zebra" } } };
  const sorted = sortCatalogProducts([other, translatedProduct], "name-asc", "de");
  assert.equal(sorted[0].id, translatedProduct.id);
});

test("verified checkout stores the selected product name while keeping server-calculated amounts", async () => {
  const product = allProducts[0];
  const previous = product.translations;
  product.translations = translatedProduct.translations;
  try {
    const request = { country: "DE" as const, items: [{ productId: product.id, quantity: 1 }] };
    const french = await calculateCheckoutPricing({ ...request, locale: "fr" });
    const german = await calculateCheckoutPricing({ ...request, locale: "de" });
    assert.equal(german.items[0].productName, "Blaues Mountainbike");
    assert.equal(german.totalCents, french.totalCents);
    assert.equal(german.items[0].productId, french.items[0].productId);
  } finally { product.translations = previous; }
});
