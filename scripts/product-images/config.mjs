import fs from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";

const ROOT = process.cwd();

for (const envName of [".env.local", ".env"]) {
  const envPath = path.join(ROOT, envName);
  if (fs.existsSync(envPath)) {
    try { loadEnvFile(envPath); } catch { /* fichier env optionnel */ }
  }
}

const numberEnv = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
};

const boolEnv = (name, fallback) => {
  const raw = String(process.env[name] ?? "").trim().toLowerCase();
  if (!raw) return fallback;
  return ["1", "true", "yes", "oui", "on"].includes(raw);
};

const listEnv = (name) => String(process.env[name] ?? "")
  .split(",")
  .map((v) => v.trim().toLowerCase())
  .filter(Boolean);

export const CONFIG = {
  root: ROOT,
  catalogPath: path.resolve(ROOT, process.env.IMAGE_CATALOG_PATH || "data/catalog.normalized.json"),
  workDir: path.resolve(ROOT, process.env.IMAGE_WORK_DIR || "data/image-recovery"),
  publicProductsDir: path.resolve(ROOT, process.env.IMAGE_PUBLIC_DIR || "public/products"),

  serperApiKey: String(process.env.SERPER_API_KEY ?? "").trim(),
  locale: String(process.env.IMAGE_SEARCH_LOCALE || "de").trim(),
  country: String(process.env.IMAGE_SEARCH_COUNTRY || "de").trim(),

  maxImagesPerProduct: Math.max(numberEnv("IMAGE_MAX_PER_PRODUCT", 100), 1),
  searchResultsPerQuery: Math.max(numberEnv("IMAGE_RESULTS_PER_QUERY", 30), 5),
  maxPrimaryQueries: Math.min(Math.max(numberEnv("IMAGE_PRIMARY_QUERIES", 2), 1), 3),
  maxRescueQueries: Math.min(Math.max(numberEnv("IMAGE_RESCUE_QUERIES", 2), 0), 3),
  rescueSearchEnabled: boolEnv("IMAGE_RESCUE_SEARCH", true),

  autoAcceptScore: Math.min(Math.max(numberEnv("IMAGE_AUTO_ACCEPT_SCORE", 82), 0), 100),
  reviewScore: Math.min(Math.max(numberEnv("IMAGE_REVIEW_SCORE", 62), 0), 100),
  primaryAcceptScore: Math.min(Math.max(numberEnv("IMAGE_PRIMARY_ACCEPT_SCORE", 78), 0), 100),
  rankPrimaryMinScore: Math.min(Math.max(numberEnv("IMAGE_RANK_PRIMARY_MIN_SCORE", 72), 0), 100),

  searchDelayMs: Math.max(numberEnv("IMAGE_SEARCH_DELAY_MS", 250), 0),
  downloadDelayMs: Math.max(numberEnv("IMAGE_DOWNLOAD_DELAY_MS", 80), 0),
  downloadTimeoutMs: Math.max(numberEnv("IMAGE_DOWNLOAD_TIMEOUT_MS", 25000), 5000),
  maxDownloadBytes: Math.max(numberEnv("IMAGE_MAX_BYTES", 18 * 1024 * 1024), 1024 * 1024),
  minWidth: Math.max(numberEnv("IMAGE_MIN_WIDTH", 280), 100),
  minHeight: Math.max(numberEnv("IMAGE_MIN_HEIGHT", 280), 100),
  maxDimension: Math.max(numberEnv("IMAGE_MAX_DIMENSION", 1600), 600),
  webpQuality: Math.min(Math.max(numberEnv("IMAGE_WEBP_QUALITY", 86), 60), 100),
  rankAnalysisSize: Math.min(Math.max(numberEnv("IMAGE_RANK_ANALYSIS_SIZE", 220), 120), 420),

  allowedDomains: listEnv("IMAGE_ALLOWED_DOMAINS"),
  blockedDomains: [
    "atvelektro.com",
    "www.atvelektro.com",
    ...listEnv("IMAGE_BLOCKED_DOMAINS"),
  ],
};

export const PATHS = {
  candidates: path.join(CONFIG.workDir, "candidates.json"),
  manifest: path.join(CONFIG.workDir, "manifest.json"),
  searchReport: path.join(CONFIG.workDir, "search-report.csv"),
  downloadReport: path.join(CONFIG.workDir, "download-report.csv"),
  failures: path.join(CONFIG.workDir, "failures.csv"),
  reviewHtml: path.join(CONFIG.workDir, "review.html"),
  rankingReport: path.join(CONFIG.workDir, "ranking-report.csv"),
  rankingReviewHtml: path.join(CONFIG.workDir, "ranking-review.html"),
  rankOverrides: path.join(CONFIG.workDir, "image-order-overrides.json"),
  backups: path.join(CONFIG.workDir, "backups"),
};


