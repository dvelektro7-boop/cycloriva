import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export function normalizeText(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP_WORDS = new Set([
  "und", "oder", "mit", "ohne", "fur", "fÃ¼r", "der", "die", "das", "den", "dem",
  "ein", "eine", "einer", "einem", "einen", "von", "im", "in", "am", "an", "auf",
  "zu", "zum", "zur", "bei", "aus", "pro", "neu", "schwarz", "weiss", "weiÃŸ", "grau",
  "silber", "rot", "blau", "grun", "grÃ¼n", "cm", "mm", "kg", "kw", "w", "l", "liter",
  "set", "stÃ¼ck", "stuck", "pack", "online", "kaufen", "shop", "produkt", "artikel",
]);

export function tokens(value = "") {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));
}

export function meaningfulTokens(value = "") {
  return tokens(value).filter((token) => token.length >= 3);
}

export function modelTokens(value = "") {
  return [...new Set(tokens(value).filter((token) => {
    if (token.length < 4) return false;
    return /[a-z]/.test(token) && /\d/.test(token);
  }))];
}

export function legacyImageStems(product) {
  const stems = [];

  for (const raw of product.legacyImages ?? []) {
    try {
      const url = new URL(raw);
      const base = decodeURIComponent(path.basename(url.pathname));
      const stem = base.replace(/\.(?:jpe?g|png|webp|avif|gif)$/i, "");
      const cleaned = normalizeText(stem.replace(/[-_]+/g, " "));
      if (cleaned.length >= 5) stems.push(cleaned);
    } catch {
      const base = path.basename(String(raw));
      const stem = base.replace(/\.(?:jpe?g|png|webp|avif|gif)$/i, "");
      const cleaned = normalizeText(stem.replace(/[-_]+/g, " "));
      if (cleaned.length >= 5) stems.push(cleaned);
    }
  }

  return [...new Set(stems)].slice(0, 8);
}

const GENERIC_FIRST_WORDS = new Set([
  "kochen", "kaminofen", "holzofen", "ofen", "heizung", "gasheizofen", "pellets",
  "palette", "effizienz", "glut", "schuhe", "tasche", "rucksack", "fitness", "garten",
  "set", "akku", "batterie", "fernseher", "tv", "computer", "laptop", "smartphone",
  "kaffeemaschine", "kaffeevollautomat", "kuhlschrank", "kÃ¼hlschrank", "waschmaschine",
]);

export function inferBrand(product) {
  const parts = meaningfulTokens(product.name ?? "");
  const first = parts[0];
  if (!first || GENERIC_FIRST_WORDS.has(first) || /\d/.test(first)) return null;
  if (first.length < 3) return null;
  return first;
}

export function topCategory(product) {
  const value = (product.categories ?? []).find((item) => item && item !== "Unkategorisiert");
  return value?.split(">")[0]?.trim() || "";
}

function cleanLegacyStem(stem = "") {
  return stem
    .replace(/\b(?:front|frontal|back|rear|side|detail|ansicht|image|img|bild|foto|photo|main|gallery|galerie|default|eu|label|energy|energie|2021|2022|2023|2024|2025|1|2|3|4|5)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildCatalogSearchQueries(product) {
  const name = String(product.name ?? "").replace(/\s+/g, " ").trim();
  const brand = inferBrand(product);
  const models = modelTokens(product.name ?? "");
  const stems = legacyImageStems(product).map(cleanLegacyStem).filter(Boolean);
  const identity = [brand, ...models].filter(Boolean).join(" ") || name;

  const queries = [
    `"${name}" Produktbild freigestellt`,
    `"${name}" front product image`,
  ];

  if (identity && normalizeText(identity) !== normalizeText(name)) {
    queries.push(`"${identity}" Produktbild`);
  }

  if (stems[0] && normalizeText(stems[0]) !== normalizeText(name)) {
    queries.push(`"${stems[0]}" freigestellt`);
  }

  return [...new Set(queries.map((q) => q.trim()).filter(Boolean))].slice(0, 3);
}

export function buildRescueSearchQueries(product) {
  const name = String(product.name ?? "").replace(/\s+/g, " ").trim();
  const brand = inferBrand(product);
  const models = modelTokens(product.name ?? "");
  const identity = [brand, ...models].filter(Boolean).join(" ") || name;
  const category = topCategory(product);

  return [...new Set([
    `"${name}" white background`,
    `"${name}" packshot studio`,
    `"${identity}" front freigestellt`,
    category ? `"${name}" ${category} Produktfoto` : "",
  ].map((q) => q.trim()).filter(Boolean))].slice(0, 3);
}

// CompatibilitÃ© avec les anciens scripts.
export function buildSearchQueries(product) {
  return buildCatalogSearchQueries(product);
}

export function candidateText(candidate) {
  return normalizeText([
    candidate.title,
    candidate.source,
    candidate.domain,
    candidate.link,
    candidate.imageUrl,
    candidate.query,
  ].filter(Boolean).join(" "));
}

export function hostname(value) {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function safeSegment(value) {
  return normalizeText(value).replace(/\s+/g, "-").replace(/^-+|-+$/g, "") || "product";
}

export function productFolder(product) {
  return String(product.legacyId ?? product.slug ?? safeSegment(product.name));
}

export function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

export function writeJsonAtomic(filePath, value) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(value, null, 2) + "\n",
    "utf8",
  );
}

export function backupFile(filePath, backupDir) {
  if (!fs.existsSync(filePath)) return null;
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const target = path.join(backupDir, `${path.basename(filePath, path.extname(filePath))}-${stamp}${path.extname(filePath)}`);
  fs.copyFileSync(filePath, target);
  return target;
}

export function csvEscape(value) {
  const text = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r;]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function writeCsv(filePath, rows, headers) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const lines = [headers.map(csvEscape).join(";")];
  for (const row of rows) {
    lines.push(headers.map((key) => csvEscape(row[key])).join(";"));
  }
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

export function parseCliArgs(argv) {
  const result = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      result._.push(arg);
      continue;
    }
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      result[key] = next;
      i += 1;
    } else {
      result[key] = true;
    }
  }
  return result;
}

export function numberArg(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatDuration(ms) {
  const total = Math.max(0, Math.round(ms / 1000));
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
}

