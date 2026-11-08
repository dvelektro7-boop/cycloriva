import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { collectCatalogTexts } from "./catalog-translation-source.mjs";

const root = new URL("../", import.meta.url);
const read = file => JSON.parse(fs.readFileSync(new URL(file, root), "utf8"));
const products = read("data/products.json");
const dictionaries = read("data/catalog-translations.json");
const locales = ["fr", "en", "de", "es", "it"];
const flatten = (object, prefix = "", result = {}) => {
  for (const [key, value] of Object.entries(object)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) flatten(value, full, result);
    else result[full] = value;
  }
  return result;
};
const french = flatten(read("messages/fr.json"));
const errors = [];
for (const locale of locales) {
  const messages = flatten(read(`messages/${locale}.json`));
  for (const [key, value] of Object.entries(french)) {
    if (typeof messages[key] !== "string" || !messages[key].trim()) errors.push(`${locale}: missing UI key ${key}`);
    const variables = text => (String(text).match(/\{[^}]+\}/g) ?? []).sort().join("|");
    if (variables(value) !== variables(messages[key])) errors.push(`${locale}: changed placeholders in ${key}`);
  }
}
const numbers = text => (text.match(/\d+(?:[.,'’]\d+)*/g) ?? []).join("|");
for (const locale of locales.filter(value => value !== "fr")) {
  for (const text of collectCatalogTexts(products)) {
    if (!dictionaries[locale]?.[text]?.trim()) errors.push(`${locale}: missing catalogue text ${text.slice(0, 60)}`);
  }
  let complete = 0;
  for (const product of products) {
    let valid = true;
    for (const field of ["name", "shortDescription", "description"]) {
      const source = product[field];
      if (!source?.trim()) continue;
      const translated = product.translations?.[locale]?.[field] || dictionaries[locale]?.[source];
      if (!translated?.trim()) { errors.push(`${locale}/${product.id}: missing ${field}`); valid = false; }
      else if (numbers(source) !== numbers(translated)) errors.push(`${locale}/${product.id}: changed numbers in ${field}`);
    }
    if (valid) complete++;
  }
  console.log(`[translations] ${locale}: ${complete}/${products.length} complete product records`);
}
if (errors.length) {
  console.error(errors.slice(0, 30).join("\n"));
  console.error(`[translations] ${errors.length} issues; complete report not truncated internally.`);
  process.exitCode = 1;
} else console.log(`[translations] All checks passed in ${fileURLToPath(root)}`);
