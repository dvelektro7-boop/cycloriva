import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizePriceRange } from "./catalog-price-range";
import {
  getCatalogPriceBounds,
  getCatalogProductPrice,
  getFilteredCatalogProducts,
  parseCatalogQuery,
  serializeCatalogQuery,
} from "./catalog-filters";
import type { Product } from "./catalog";

const bounds = { min: 84.91, max: 12110 };

test("default range and decimal prices remain exact", () => {
  assert.deepEqual(normalizePriceRange(bounds, null, null), bounds);
  assert.deepEqual(normalizePriceRange(bounds, 3668.91, 9481.91), { min: 3668.91, max: 9481.91 });
  assert.deepEqual(normalizePriceRange(bounds, 100.125, 500.987), { min: 100.13, max: 500.99 });
});

test("both handles stop at the other handle and at the price bounds", () => {
  assert.deepEqual(normalizePriceRange(bounds, 900, 500, "min"), { min: 500, max: 500 });
  assert.deepEqual(normalizePriceRange(bounds, 900, 500, "max"), { min: 900, max: 900 });
  assert.deepEqual(normalizePriceRange(bounds, -100, 50000), bounds);
  assert.deepEqual(normalizePriceRange({ min: 100, max: 100 }, null, null), { min: 100, max: 100 });
  assert.deepEqual(normalizePriceRange(bounds, NaN, Infinity), bounds);
});

test("committed range preserves search, other filters, sorting and view in URL", () => {
  const current = parseCatalogQuery("q=électrique&min=3668.91&max=9481.91&sort=price-desc&view=list&page=3&disponibilite=unknown");
  const range = normalizePriceRange(bounds, 4000, 8000, "min");
  const updated = { ...current, page: 1, filters: { ...current.filters, minPrice: range.min, maxPrice: range.max } };
  assert.deepEqual(parseCatalogQuery(serializeCatalogQuery(updated)), updated);
  assert.equal(updated.search, "électrique");
  assert.equal(updated.sort, "price-desc");
  assert.equal(updated.view, "list");
  assert.deepEqual(updated.filters.availability, ["unknown"]);
});

test("real catalogue results respect both bounds; clearing prices restores results", () => {
  const products = JSON.parse(readFileSync(new URL("../data/products.json", import.meta.url), "utf8")) as Product[];
  const actualBounds = getCatalogPriceBounds(products);
  assert.ok(actualBounds.max >= actualBounds.min);
  const query = parseCatalogQuery("q=électrique&min=3668.91&max=9481.91");
  const result = getFilteredCatalogProducts(products, query, "de");
  assert.ok(result.length > 0);
  for (const product of result) {
    const price = getCatalogProductPrice(product);
    assert.ok(price !== null && price >= 3668.91 && price <= 9481.91);
  }
  const cleared = { ...query, filters: { ...query.filters, minPrice: null, maxPrice: null } };
  assert.ok(getFilteredCatalogProducts(products, cleared, "de").length >= result.length);
  const url = serializeCatalogQuery(cleared);
  assert.equal(url.has("min"), false);
  assert.equal(url.has("max"), false);
});
