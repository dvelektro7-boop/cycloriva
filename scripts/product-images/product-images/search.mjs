import fs from "node:fs";
import path from "node:path";

import { CONFIG, PATHS } from "./config.mjs";
import { scoreCandidate } from "./score-candidate.mjs";
import { searchImagesSerper } from "./search-provider-serper.mjs";
import {
  buildCatalogSearchQueries,
  buildRescueSearchQueries,
  formatDuration,
  hostname,
  numberArg,
  readJson,
  sleep,
  writeCsv,
  writeJsonAtomic,
} from "./utils.mjs";

function dedupeCandidates(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = String(item.imageUrl || "").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function scoreAll(product, rawCandidates) {
  return dedupeCandidates(rawCandidates)
    .map((candidate) => ({ ...candidate, ...scoreCandidate(product, candidate, CONFIG) }))
    .sort((a, b) => {
      if (b.primaryEligible !== a.primaryEligible) return Number(b.primaryEligible) - Number(a.primaryEligible);
      if (b.primaryScore !== a.primaryScore) return b.primaryScore - a.primaryScore;
      return b.score - a.score;
    });
}

function buildReviewHtml(entries) {
  const esc = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const list = Object.values(entries)
    .filter((entry) => entry.status !== "high" || entry.rescueUsed)
    .sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));

  const cards = list.map((entry) => {
    const candidates = (entry.candidates ?? []).slice(0, 8).map((candidate) => `
      <article class="candidate ${candidate.primaryEligible ? "primary" : ""}">
        <div class="img"><img loading="lazy" src="${esc(candidate.thumbnailUrl || candidate.imageUrl)}" alt=""></div>
        <div class="meta"><b>${candidate.score}/100</b> · identité ${candidate.identityScore}/100 · principal ${candidate.primaryScore}/100</div>
        <div class="meta">${candidate.primaryEligible ? "✓ candidat principal" : "galerie / contrôle"} · ${esc(candidate.domain || hostname(candidate.imageUrl))}</div>
        <div class="title">${esc(candidate.title)}</div>
        <div class="query">${esc(candidate.query)}</div>
      </article>`).join("");

    return `
      <section class="product">
        <h2>${esc(entry.name)}</h2>
        <p>ID ${esc(entry.legacyId)} · statut ${esc(entry.status)} · principal ${esc(entry.primaryCount ?? 0)} · rescue ${entry.rescueUsed ? "oui" : "non"}</p>
        <div class="grid">${candidates || "<em>Aucun candidat</em>"}</div>
      </section>`;
  }).join("\n");

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DevElektro - Image Recovery V2</title><style>
    body{font-family:Inter,Arial,sans-serif;background:#f5f7fb;color:#0f172a;margin:0;padding:28px}.top{max-width:1500px;margin:0 auto 20px;background:#071a3a;color:white;padding:22px;border-radius:16px}.product{max-width:1500px;margin:0 auto 18px;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px}.product h2{margin:0 0 6px;font-size:18px}.product p{margin:0 0 14px;color:#64748b}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}.candidate{border:1px solid #e2e8f0;border-radius:10px;padding:10px}.candidate.primary{border:2px solid #0ea765;box-shadow:0 0 0 3px #d9f8e9}.img{height:170px;display:flex;align-items:center;justify-content:center;background:#f8fafc;border-radius:8px;overflow:hidden}.img img{width:100%;height:100%;object-fit:contain}.meta{font-size:11px;margin-top:7px;color:#0369a1}.title{font-size:12px;margin-top:5px;line-height:1.35}.query{font-size:10px;color:#64748b;margin-top:5px}</style></head><body><div class="top"><h1>DevElektro — Image Recovery V2</h1><p>Vert = candidat assez propre pour devenir une image principale. Le moteur relance automatiquement une recherche spécialisée lorsqu'aucun candidat principal fiable n'est trouvé.</p></div>${cards || "<p>Tout est en haute confiance.</p>"}</body></html>`;
}

export async function runSearch(cli = {}) {
  if (!fs.existsSync(CONFIG.catalogPath)) throw new Error(`Catalogue introuvable: ${CONFIG.catalogPath}`);
  const catalog = readJson(CONFIG.catalogPath, []);
  if (!Array.isArray(catalog)) throw new Error("catalog.normalized.json n'est pas un tableau valide.");

  fs.mkdirSync(CONFIG.workDir, { recursive: true });
  const existing = readJson(PATHS.candidates, { version: 2, products: {} }) || { version: 2, products: {} };
  const entries = existing.products || {};

  const start = Math.max(0, numberArg(cli.start, 0));
  const limit = Math.max(1, numberArg(cli.limit, catalog.length));
  const idFilter = cli.id ? String(cli.id) : null;
  const force = Boolean(cli.force);

  const eligibleProducts = catalog.filter((product) => {
    if (!product?.published || !String(product?.name ?? "").trim()) return false;
    if (idFilter && String(product.legacyId ?? product.slug) !== idFilter && String(product.slug) !== idFilter) return false;
    if ((product.newImages ?? []).length >= CONFIG.maxImagesPerProduct && !force) return false;
    return true;
  }).slice(start, start + limit);

  console.log("\nDevElektro — Image Recovery V2");
  console.log(`Produits à traiter: ${eligibleProducts.length}`);
  console.log(`Seuil identité: ${CONFIG.autoAcceptScore}/100`);
  console.log(`Seuil photo principale: ${CONFIG.primaryAcceptScore}/100`);
  console.log(`Recherche secours: ${CONFIG.rescueSearchEnabled ? "active" : "inactive"}\n`);

  if (!CONFIG.serperApiKey) {
    throw new Error("SERPER_API_KEY manquant dans .env ou .env.local.");
  }

  const startedAt = Date.now();
  let processed = 0;

  for (const product of eligibleProducts) {
    const key = String(product.slug);
    const previousEntry = entries[key];
    const previousSucceeded = previousEntry?.searchedAt && previousEntry?.status !== "error";

    if (!force && previousSucceeded && previousEntry?.version === 2) {
      processed += 1;
      console.log(`[${processed}/${eligibleProducts.length}] déjà recherché V2: ${product.name}`);
      continue;
    }

    let rawCandidates = [];
    const searchedQueries = [];
    let rescueUsed = false;

    try {
      const primaryQueries = buildCatalogSearchQueries(product).slice(0, CONFIG.maxPrimaryQueries);

      for (const query of primaryQueries) {
        const results = await searchImagesSerper(query, CONFIG);
        searchedQueries.push(query);
        rawCandidates.push(...results);

        const quick = scoreAll(product, rawCandidates);
        if (quick.filter((c) => c.primaryEligible).length >= 2) break;
        await sleep(CONFIG.searchDelayMs);
      }

      let scored = scoreAll(product, rawCandidates);
      let primaryCount = scored.filter((c) => c.primaryEligible).length;

      if (CONFIG.rescueSearchEnabled && primaryCount === 0) {
        rescueUsed = true;
        const rescueQueries = buildRescueSearchQueries(product).slice(0, CONFIG.maxRescueQueries);
        for (const query of rescueQueries) {
          const results = await searchImagesSerper(query, CONFIG);
          searchedQueries.push(query);
          rawCandidates.push(...results);
          scored = scoreAll(product, rawCandidates);
          primaryCount = scored.filter((c) => c.primaryEligible).length;
          if (primaryCount >= 1) break;
          await sleep(CONFIG.searchDelayMs);
        }
      }

      const candidates = scoreAll(product, rawCandidates).slice(0, Math.max(CONFIG.searchResultsPerQuery * 2, 18));
      primaryCount = candidates.filter((c) => c.primaryEligible).length;
      const highCount = candidates.filter((c) => c.autoEligible).length;
      const bestScore = candidates[0]?.score ?? 0;
      const bestPrimaryScore = Math.max(0, ...candidates.map((c) => c.primaryScore ?? 0));
      const status = primaryCount > 0 ? "high" : highCount > 0 || bestScore >= CONFIG.reviewScore ? "review" : "missing";

      entries[key] = {
        version: 2,
        legacyId: product.legacyId ?? null,
        slug: product.slug,
        name: product.name,
        queries: searchedQueries,
        rescueUsed,
        bestScore,
        bestPrimaryScore,
        highCount,
        primaryCount,
        status,
        searchedAt: new Date().toISOString(),
        error: null,
        candidates,
      };

      processed += 1;
      console.log(`[${processed}/${eligibleProducts.length}] ${status.toUpperCase().padEnd(7)} match ${String(bestScore).padStart(3)}/100 · principal ${String(bestPrimaryScore).padStart(3)}/100 · ${product.name}${rescueUsed ? " · rescue" : ""}`);
    } catch (error) {
      entries[key] = {
        version: 2,
        legacyId: product.legacyId ?? null,
        slug: product.slug,
        name: product.name,
        queries: searchedQueries,
        rescueUsed,
        bestScore: 0,
        bestPrimaryScore: 0,
        highCount: 0,
        primaryCount: 0,
        status: "error",
        searchedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
        candidates: [],
      };
      processed += 1;
      console.error(`[${processed}/${eligibleProducts.length}] ERROR — ${product.name}: ${entries[key].error}`);
    }

    writeJsonAtomic(PATHS.candidates, {
      version: 2,
      generatedAt: new Date().toISOString(),
      config: {
        autoAcceptScore: CONFIG.autoAcceptScore,
        reviewScore: CONFIG.reviewScore,
        primaryAcceptScore: CONFIG.primaryAcceptScore,
        maxImagesPerProduct: CONFIG.maxImagesPerProduct,
      },
      products: entries,
    });

    await sleep(CONFIG.searchDelayMs);
  }

  const rows = Object.values(entries).map((entry) => ({
    legacyId: entry.legacyId,
    slug: entry.slug,
    name: entry.name,
    status: entry.status,
    bestScore: entry.bestScore,
    bestPrimaryScore: entry.bestPrimaryScore ?? 0,
    primaryCount: entry.primaryCount ?? 0,
    highCount: entry.highCount,
    rescueUsed: entry.rescueUsed ? "yes" : "no",
    queryCount: entry.queries?.length ?? 0,
    candidateCount: entry.candidates?.length ?? 0,
    bestDomain: entry.candidates?.[0]?.domain || hostname(entry.candidates?.[0]?.imageUrl || ""),
    error: entry.error ?? "",
  }));

  writeCsv(PATHS.searchReport, rows, [
    "legacyId", "slug", "name", "status", "bestScore", "bestPrimaryScore",
    "primaryCount", "highCount", "rescueUsed", "queryCount", "candidateCount", "bestDomain", "error",
  ]);

  fs.writeFileSync(PATHS.reviewHtml, buildReviewHtml(entries), "utf8");

  const high = rows.filter((row) => row.status === "high").length;
  const review = rows.filter((row) => row.status === "review").length;
  const missing = rows.filter((row) => row.status === "missing").length;
  const errors = rows.filter((row) => row.status === "error").length;

  console.log(`\nRecherche V2 terminée en ${formatDuration(Date.now() - startedAt)}.`);
  console.log(`Haute confiance: ${high} | À vérifier: ${review} | Introuvables: ${missing} | Erreurs: ${errors}`);
  console.log(`Rapport: ${path.relative(CONFIG.root, PATHS.searchReport)}`);
  console.log(`Aperçu: ${path.relative(CONFIG.root, PATHS.reviewHtml)}\n`);

  return { high, review, missing, errors };
}
