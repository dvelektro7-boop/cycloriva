import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline, env } from "@huggingface/transformers";
import { collectCatalogTexts } from "../catalog-translation-source.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const cache = path.join(root, ".translation-cache");
await fs.mkdir(cache, { recursive: true });
env.cacheDir = path.join(cache, "models");
env.localModelPath = path.join(cache, "models") + path.sep;
env.allowRemoteModels = false;
const products = JSON.parse(await fs.readFile(path.join(root, "data/products.json"), "utf8"));
const outputFile = path.join(root, "data/catalog-translations.json");
const dictionaries = JSON.parse(await fs.readFile(outputFile, "utf8"));
const overrides = JSON.parse(await fs.readFile(path.join(root, "data/catalog-translation-overrides.json"), "utf8"));
const languages = ["en", "de", "es", "it"];
const requested = process.argv.find(argument => argument.startsWith("--locale="))?.split("=")[1];
if (requested && !languages.includes(requested)) throw new Error("Unsupported target language");
const selectedLanguages = requested ? [requested] : languages;
const segmenter = new Intl.Segmenter("fr", { granularity: "sentence" });
const numeric = /\d+(?:[.,'’]\d+)*/g;
const numbers = value => value.match(numeric) ?? [];
const isTechnicalCode = text => /\d/.test(text) && /^[A-Z][A-Z0-9]*(?:[-/][A-Z0-9]+)*$/.test(text);
const isMeasurement = text => /\d/.test(text) && /^(?:(?:\d+(?:[.,'’]\d+)*|mm|cm|km|kg|Wh|Ah|Nm|rpm|Hz|m|g|W|V|A|h|s)|[\s×x/°%"'().+\-])+$/i.test(text);
const genericWords = new Set(["VTT", "VTC", "VAE", "MTB", "BMX", "BIKE", "CITY", "VELO", "VÉLO", "ÉLECTRIQUE", "ELECTRIQUE", "NOIR", "BLANC", "BLEU", "ROUGE", "VERT", "ENFANT", "HOMME", "FEMME"]);
const protectedTerms = new Set([
  "CYCLORIVA", "TOTEM", "Shimano", "SHIMANO", "Suntour", "Bafang", "Bosch", "BOSCH", "Phylion", "Schwalbe", "Tektro", "Samsung", "Simplon", "Cube", "Cilo", "EGO Movement", "Riese & Müller", "Brompton", "Giant", "Creme", "Specialized", "Thule", "Naish", "Haibike", "KTM", "Flyer", "Scott", "Kalkhoff", "Winora", "Gazelle", "Babboe", "Carqon", "Urban Arrow", "Tern", "Dahon", "Moustache", "E-TWOW", "Xiaomi", "Segway", "Ninebot",
  ...products.flatMap(product => [...(product.description ?? "").matchAll(/^(?:Marque|Marque du moteur|Fabricant|Brand)\s*:\s*([^\n]+)$/gmi)].map(match => match[1].trim())),
  ...products.flatMap(product => product.name.match(/\b[A-Z][A-Z0-9]{1,}(?:-[A-Z0-9]+)*\b/g) ?? []).filter(term => !genericWords.has(term)),
]);
const escapedTerms = [...protectedTerms].sort((a, b) => b.length - a.length).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
const protectedLower = new Set([...protectedTerms].map(term => term.toLocaleLowerCase("fr")));
const isProtected = term => protectedLower.has(term.toLocaleLowerCase("fr"));
const protectedExpression = new RegExp(`(?<![\\p{L}\\p{N}])(${escapedTerms.join("|")})(?![\\p{L}\\p{N}])`, "giu");

function split(text) {
  const chunks = [];
  for (const paragraph of text.split(/(\n+)/)) {
    if (!paragraph.trim()) { chunks.push(paragraph); continue; }
    const pair = paragraph.match(/^([^:：]{2,55})\s*[:：]\s*(.{1,500})$/);
    const fragments = pair ? [pair[1].trim(), ":", pair[2].trim()] : [paragraph];
    for (const part of fragments) {
    for (const fragment of part.split(protectedExpression)) {
    if (isProtected(fragment)) { chunks.push(fragment); continue; }
    for (const { segment } of segmenter.segment(fragment)) {
      let remaining = segment.trim();
      while (remaining.length > 400) {
        let end = remaining.lastIndexOf(" ", 400);
        if (end < 100) end = 400;
        chunks.push(remaining.slice(0, end));
        remaining = remaining.slice(end).trim();
      }
      if (remaining) chunks.push(remaining);
    }
    }
    }
  }
  return chunks;
}

const texts = collectCatalogTexts(products);
const parts = [...new Set(texts.flatMap(split).filter(text => text.trim()))];
const caches = {};
for (const locale of languages) {
  try { caches[locale] = JSON.parse(await fs.readFile(path.join(cache, `${locale}.json`), "utf8")); }
  catch { caches[locale] = {}; }
  for (const part of parts) if (isProtected(part) || isTechnicalCode(part) || isMeasurement(part) || !/\p{L}{2}/u.test(part)) caches[locale][part] = part;
  for (const part of parts) {
    const reviewed = overrides[locale]?.[part.trim().toLocaleLowerCase("fr")];
    if (reviewed) caches[locale][part] = reviewed;
  }
}
const save = async locale => {
  const file = path.join(cache, `${locale}.json`);
  await fs.writeFile(`${file}.tmp`, JSON.stringify(caches[locale]));
  await fs.rename(`${file}.tmp`, file);
};

async function load(locale) {
  const model = locale === "en" ? "Xenova/opus-mt-fr-en" : locale === "de" ? "Xenova/opus-mt-en-de" : "Xenova/opus-mt-en-ROMANCE";
  console.log(`[translations] Loading local model ${model}`);
  const engine = await pipeline("translation", model, {
    dtype: "q8",
    session_options: { intraOpNumThreads: 4, interOpNumThreads: 1 },
    progress_callback: progress => {
      if (progress.status === "done") console.log(`[translations] Downloaded ${progress.file}`);
    },
  });
  const prefix = locale === "es" ? ">>es_ES<< " : locale === "it" ? ">>it_IT<< " : "";
  const translator = (inputs, options) => engine(Array.isArray(inputs) ? inputs.map(input => prefix + input) : prefix + inputs, options);
  translator.dispose = () => engine.dispose();
  return translator;
}

if (process.argv.includes("--sample")) {
  const translator = await load("en");
  const examples = ["Le vélo électrique est équipé de freins à disque.", "La batterie offre une autonomie de 80 km et se recharge en 5 heures."];
  const results = await translator(examples, { max_new_tokens: 140, num_beams: 4 });
  for (let i = 0; i < examples.length; i++) {
    if (!results[i]?.translation_text?.trim() || JSON.stringify(numbers(examples[i])) !== JSON.stringify(numbers(results[i].translation_text))) throw new Error("Local translation engine sample failed");
  }
  console.log(results);
  await translator.dispose();
  process.exit(0);
}

console.log(`[translations] ${texts.length} distinct texts, ${parts.length} reusable segments; all inference runs locally`);
for (const locale of selectedLanguages) {
  const missing = parts.filter(text => !Object.hasOwn(caches[locale], text));
  if (!missing.length) continue;
  const translator = await load(locale);
  let completed = 0;
  const issues = [];
  // Group similar lengths to reduce padding during batched CPU inference.
  missing.sort((a, b) => a.length - b.length);
  try {
    for (let start = 0; start < missing.length; start += 8) {
      const batch = missing.slice(start, start + 8);
      const inputs = batch.map(text => locale === "en" ? text : caches.en[text]);
      const results = await translator(inputs, { max_new_tokens: 220, num_beams: 1 });
      for (let i = 0; i < batch.length; i++) {
        const source = batch[i];
        let translated = results[i]?.translation_text?.trim() ?? "";
        const originalNumbers = numbers(source);
        if (originalNumbers.length === numbers(translated).length) {
          let index = 0;
          translated = translated.replace(numeric, () => originalNumbers[index++]);
        } else {
          // Translate prose separately if the model added/dropped technical numbers.
          const fragments = (locale === "en" ? source : caches.en[source]).split(/(\d+(?:[.,'’]\d+)*)/g);
          const repaired = [];
          for (let j = 0; j < fragments.length; j++) {
            const fragment = fragments[j];
            if (j % 2 || !/[\p{L}]{2}/u.test(fragment)) { repaired.push(fragment); continue; }
            const input = fragment;
            const result = await translator(input, { max_new_tokens: 220, num_beams: 4 });
            repaired.push(` ${result[0].translation_text} `);
          }
          translated = repaired.join("").replace(/[ \t]+/g, " ").trim();
        }
        if (!translated || JSON.stringify(numbers(source)) !== JSON.stringify(numbers(translated))) {
          issues.push({ source, proposed: translated, reason: "Empty translation or changed technical numbers" });
          continue;
        }
        caches[locale][source] = translated;
      }
      completed += batch.length;
      if (completed % 40 === 0 || start + 8 >= missing.length) {
        await save(locale);
        console.log(`[translations] ${locale}: ${parts.length - missing.length + completed}/${parts.length}`);
      }
    }
  } finally { await save(locale); await translator.dispose(); }
  await fs.writeFile(path.join(cache, `review-${locale}.json`), JSON.stringify(issues, null, 2));
  if (issues.length) throw new Error(`${locale}: ${issues.length} segments require review; see .translation-cache/review-${locale}.json`);
}

for (const locale of selectedLanguages) {
  dictionaries[locale] = Object.fromEntries(texts.map(text => [text, overrides[locale]?.[text] || overrides[locale]?.[text.trim().toLocaleLowerCase("fr")] || split(text).map(part => part.trim() ? caches[locale][part] : part).join(" ").replace(/ *\n */g, "\n")]));
}
const temporary = `${outputFile}.tmp`;
await fs.writeFile(temporary, JSON.stringify(dictionaries, null, 2) + "\n");
await fs.rename(temporary, outputFile);
console.log("[translations] Static dictionaries saved. No model is required by the website or deployment.");
