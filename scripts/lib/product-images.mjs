import zlib from 'node:zlib';

export function readOptions(args) {
  const value = name => args.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
  const score = value('min-score');
  const minScore = score === undefined ? 0.68 : Number(score);
  if (score === '' || !Number.isFinite(minScore) || minScore < 0 || minScore > 1) throw Error('Seuil --min-score invalide (0 à 1).');
  const limit = value('limit');
  if (limit !== undefined && (!/^\d+$/.test(limit) || Number(limit) < 1)) throw Error('--limit doit être un entier positif.');
  return { minScore, limit: limit ? Number(limit) : null, dryRun: args.includes('--dry-run'), force: args.includes('--force'), useCache: args.includes('--use-cache'), ids: value('ids')?.split(',') ?? null };
}

export function normalize(value) {
  return String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ß/g, 'ss').replace(/&amp;/g, '&').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

export function filename(url) {
  try { return decodeURIComponent(new URL(url).pathname.split('/').pop()); }
  catch { return String(url).split('/').pop(); }
}

export function fileKey(value) {
  return normalize(filename(value).replace(/\.[a-z0-9]{2,5}$/i, '').replace(/-scaled$/i, '').replace(/-\d{2,4}x\d{2,4}$/i, '').replace(/(anzeigebild)(?:-\d+)+$/i, '$1'));
}

const colors = {
  black: ['noir', 'noire', 'schwarz', 'black', 'nero'], white: ['blanc', 'blanche', 'weiss', 'white', 'bianco'],
  mint: ['mint', 'menthe'], blue: ['bleu', 'bleue', 'blau', 'blue', 'blu'], red: ['rouge', 'rot', 'red', 'rosso'],
  green: ['vert', 'verte', 'grun', 'gruen', 'green', 'verde'], grey: ['gris', 'grau', 'grey', 'gray', 'grigio'],
  pink: ['rose', 'rosa', 'pink'], orange: ['orange', 'arancione'], yellow: ['jaune', 'gelb', 'yellow', 'giallo'],
  purple: ['violet', 'violette', 'lila', 'purple', 'viola'], silver: ['argent', 'silber', 'silver'],
  anthracite: ['anthracite', 'anthrazit'], turquoise: ['turquoise', 'turkis', 'tuerkis'],
  lightblue: ['hellblau', 'lightblue'], lightgrey: ['hellgrau', 'lightgrey'], bordeaux: ['bordeaux', 'burgundy'],
};
const colorTokens = new Set(Object.values(colors).flat());
const generic = new Set(('e bike ebike velo velos vtt fahrrad elektrovelo electrique electriques electric elektrisch mountainbike mountain mtb fully full vollgefedert city citybike bike klappvelo klappbike folding pliant pliable tout terrain integral pour enfant enfants homme herren damen femme zoll inch pouces cm mm kg wh ah watt watts anzeigebild anzeige bild image images scaled photo produkt product artikel seitenansicht schraeg hinten vorne detail ansicht en fr de it und with avec le la les du des a of n copy jpg jpeg png webp avif gif').split(' '));
const coreTokens = value => [...new Set(normalize(value).split(' ').filter(token => token.length >= 2 && !generic.has(token) && !colorTokens.has(token) && !/^\d+$/.test(token)))];
const setEqual = (a, b) => a.length === b.length && a.every(value => b.includes(value));
const colorSet = text => {
  const tokens = new Set(normalize(text).split(' '));
  return Object.entries(colors).filter(([, aliases]) => aliases.some(alias => tokens.has(alias))).map(([name]) => name);
};

export function features(text, { inferWheel = false } = {}) {
  const lower = String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const wheel = new Set();
  for (const match of lower.matchAll(/\b(12|14|16|18|20|24|26|27[.,-]5|28|29)[\s-]*(?:["″]|zoll\b|inch\b|pouces\b)/g)) wheel.add(match[1].replace(/[,-]/g, '.'));
  if (inferWheel) for (const match of lower.matchAll(/\b(12|14|16|18|20|24|26|27[.,-]5|28|29)\b/g)) wheel.add(match[1].replace(/[,-]/g, '.'));
  const frame = [...lower.matchAll(/\b(\d{2})[\s-]*cm\b/g)].map(match => match[1]);
  const specs = [...lower.matchAll(/\b(\d+(?:[.,]\d+)?)[\s-]*(wh|ah|watts?|w)\b/g)].map(match => `${Number(match[1].replace(',', '.'))}${match[2].startsWith('watt') ? 'w' : match[2]}`);
  const lengthsCm = [...lower.matchAll(/\b(\d{3})[\s-]*cm\b/g)].map(match => Number(match[1]));
  for (const match of lower.matchAll(/\b(\d{1,2})\s*['’`]\s*(\d{1,2})\b/g)) lengthsCm.push(Number(match[1]) * 30.48 + Number(match[2]) * 2.54);
  return { wheel: [...wheel], frame: [...new Set(frame)], colors: colorSet(text), specs: [...new Set(specs)], lengthsCm: [...new Set(lengthsCm)] };
}

const accessory = /\b(?:ersatzakku|ersatzteil|ersatzbatterie|replacement|spare|batterie|battery|akku|ladegerat|charger|chargeur|reifen|pneu)\b/;
const bicycle = /\b(?:bike|ebike|velo|fahrrad|mountainbike|citybike|klappvelo|vtt)\b/;

export function productSignature(product, rows) {
  const files = rows.map(row => row.originalFilename || filename(row.sourceUrl));
  const name = product.name ?? '';
  const nameFeatures = features(name);
  const history = features(files.join(' '));
  const models = [...name.matchAll(/\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*\b/g)].map(match => match[0]).filter(model => model.length >= 3 && !generic.has(normalize(model)) && !colorTokens.has(normalize(model)));
  const attrs = Object.entries(product.attributes ?? {});
  const attributeColors = attrs.filter(([key]) => /couleur|color|farbe/i.test(key)).map(([, value]) => value).join(' ');
  return {
    name, files, keys: [...new Set(files.map(fileKey).filter(key => key.length >= 18 && key.split(' ').length >= 4))],
    core: coreTokens(name), historicalCore: coreTokens(files.join(' ')), models: [...new Set(models.map(normalize))],
    wheel: nameFeatures.wheel.length ? nameFeatures.wheel : history.wheel,
    colors: nameFeatures.colors.length ? nameFeatures.colors : colorSet(attributeColors).length ? colorSet(attributeColors) : history.colors,
    frame: features(`${name} ${attrs.map(([, value]) => value).join(' ')}`).frame,
    specs: nameFeatures.specs,
    lengthsCm: nameFeatures.lengthsCm,
    isBike: bicycle.test(normalize(name)),
  };
}

export function prepareCandidate(candidate) {
  const titles = candidate.urls.map(url => decodeURIComponent(new URL(url).pathname.replace(/\/a-\d+\/?$/, '')));
  const files = candidate.images.map(filename);
  const text = [...titles, ...files].join(' ');
  const normalized = normalize(text);
  const isBike = bicycle.test(normalized);
  return { ...candidate, titles, files, segments: [...titles, ...files].map(normalize), normalized, core: coreTokens(text), keys: [...new Set(files.map(fileKey))], ...features(text, { inferWheel: isBike }), isAccessory: accessory.test(normalize(titles.join(' '))) };
}

export function scoreMatch(signature, candidate) {
  const reasons = [];
  const exactFiles = signature.keys.filter(key => candidate.keys.includes(key));
  if (signature.isBike && candidate.isAccessory) reasons.push('accessory-instead-of-bike');
  if (signature.wheel.length && candidate.wheel.length && !setEqual(signature.wheel, candidate.wheel)) reasons.push('wheel-size-conflict');
  if (signature.colors.length && candidate.colors.length && !setEqual(signature.colors, candidate.colors)) reasons.push('color-conflict');
  if (signature.frame.length && candidate.frame.length && !signature.frame.some(size => candidate.frame.includes(size))) reasons.push('frame-size-conflict');
  if (signature.specs.length && !signature.specs.every(spec => candidate.specs.includes(spec))) reasons.push('capacity-or-power-not-confirmed');
  if (signature.lengthsCm.length && !signature.lengthsCm.every(size => candidate.lengthsCm.some(other => Math.abs(other - size) <= 2))) reasons.push('length-not-confirmed');
  const modelsPresent = signature.models.filter(model => ` ${candidate.normalized} `.includes(` ${model} `));
  if (signature.models.length && modelsPresent.length !== signature.models.length && !exactFiles.length) reasons.push('model-not-confirmed');
  // A suffix identifies a different model even when the common model word matches.
  for (const model of signature.models.filter(model => / [a-z]$/.test(model))) {
    const base = model.slice(0, -2);
    const variants = candidate.segments.flatMap(segment => [...segment.replace(new RegExp(`\\b${base} (?:s m|l xl)\\b`, 'g'), base).matchAll(new RegExp(`\\b${base} ([a-z])\\b`, 'g'))].map(match => `${base} ${match[1]}`));
    if (variants.some(variant => variant !== model)) reasons.push('model-suffix-conflict');
  }
  if (signature.colors.length && !candidate.colors.length) reasons.push('color-not-confirmed');
  if (signature.wheel.length && !candidate.wheel.length) reasons.push('wheel-size-not-confirmed');
  const nameRecall = signature.core.length ? signature.core.filter(token => candidate.core.includes(token)).length / signature.core.length : 0;
  const historyRecall = signature.historicalCore.length ? signature.historicalCore.filter(token => candidate.core.includes(token)).length / signature.historicalCore.length : 0;
  let score = exactFiles.length ? Math.min(1, 0.96 + (exactFiles.length - 1) * 0.01) : 0.72 * nameRecall + 0.18 * historyRecall;
  if (!exactFiles.length && signature.wheel.length && signature.wheel.every(size => candidate.wheel.includes(size))) score += 0.05;
  if (!exactFiles.length && signature.colors.length && setEqual(signature.colors, candidate.colors)) score += 0.05;
  if (!exactFiles.length && (nameRecall < 0.8 || signature.core.length < 2)) reasons.push('insufficient-identity-evidence');
  return { candidate, score: Math.min(1, score), reasons: [...new Set(reasons)], exactFiles };
}

const candidateIndexes = new WeakMap();
export function findMatch(signature, candidates, minScore = 0.68) {
  let index = candidateIndexes.get(candidates);
  if (!index) {
    index = { core: new Map(), keys: new Map() };
    for (const candidate of candidates) {
      for (const [kind, values] of [['core', candidate.core], ['keys', candidate.keys]]) {
        for (const value of values) {
          const matches = index[kind].get(value) ?? [];
          matches.push(candidate); index[kind].set(value, matches);
        }
      }
    }
    candidateIndexes.set(candidates, index);
  }
  const relevant = new Set();
  for (const token of [...signature.core, ...signature.historicalCore]) for (const candidate of index.core.get(token) ?? []) relevant.add(candidate);
  for (const key of signature.keys) for (const candidate of index.keys.get(key) ?? []) relevant.add(candidate);
  const ranked = [...relevant].map(candidate => scoreMatch(signature, candidate)).filter(entry => entry.score > 0).sort((a, b) => b.score - a.score);
  const eligible = ranked.filter(entry => !entry.reasons.length);
  const best = eligible[0];
  const second = eligible[1];
  const gap = best ? best.score - (second?.score ?? 0) : 0;
  const accepted = best && best.score >= minScore && gap >= 0.05;
  const reasons = !best ? ['identity-or-variant-not-confirmed'] : best.score < minScore ? ['confidence-below-threshold'] : gap < 0.05 ? ['ambiguous-candidates'] : [];
  return { classification: accepted ? (best.exactFiles.length ? 'exact' : 'probable') : 'manual', best: best ?? ranked[0] ?? null, top: eligible.length ? eligible.slice(0, 3) : ranked.slice(0, 3), gap, reasons };
}

export function decodeXml(text) {
  return text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

export function isProductUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && /(^|\.)gonser\.ch$/i.test(url.hostname) && /\/a-\d+\/?$/.test(url.pathname); } catch { return false; }
}

export function validImageUrl(value, itemId) {
  try { const url = new URL(value); return url.protocol === 'https:' && /^cdn\d+\.plenty(?:one|markets)\.com$/.test(url.hostname) && url.pathname.startsWith(`/mrt54q44tptl/item/images/${itemId}/`); } catch { return false; }
}

export function parseSitemap(xml) {
  if (!/<\/(?:sitemapindex|urlset)\s*>\s*$/i.test(xml.trim())) throw Error('Sitemap XML incomplet ou invalide.');
  if (/<sitemapindex\b/i.test(xml)) return { children: [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(match => decodeXml(match[1].trim())), products: [] };
  const products = [];
  for (const match of xml.matchAll(/<url>\s*([\s\S]*?)<\/url>/g)) {
    const url = decodeXml(match[1].match(/<loc>\s*([^<]+)\s*<\/loc>/)?.[1]?.trim() ?? '');
    if (!isProductUrl(url)) continue;
    const itemId = url.match(/\/a-(\d+)\/?$/)[1];
    const urls = [url, ...[...match[1].matchAll(/<xhtml:link\b[^>]*href="([^"]+)"[^>]*>/g)].map(entry => decodeXml(entry[1])).filter(isProductUrl)];
    const images = [...match[1].matchAll(/<image:loc>\s*([^<]+)\s*<\/image:loc>/g)].map(entry => decodeXml(entry[1].trim())).filter(image => validImageUrl(image, itemId));
    products.push({ itemId, urls, images });
  }
  return { children: [], products };
}

export async function fetchBuffer(url, { fetchImpl = fetch, attempts = 3, timeoutMs = 60000, maxBytes = 64_000_000, delay = ms => new Promise(resolve => setTimeout(resolve, ms)) } = {}) {
  let error;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs), redirect: 'follow', headers: { 'User-Agent': 'CYCLORIVA-Catalogue-Images/2.0' } });
      if (!response.ok) { await response.body?.cancel(); throw Error(`HTTP ${response.status} : ${url}`); }
      if (Number(response.headers.get('content-length')) > maxBytes) { await response.body?.cancel(); throw Error('Réponse trop volumineuse.'); }
      const chunks = []; let size = 0;
      for await (const chunk of response.body) { size += chunk.length; if (size > maxBytes) throw Error('Réponse trop volumineuse.'); chunks.push(chunk); }
      const buffer = Buffer.concat(chunks);
      if (!buffer.length) throw Error('Réponse vide.');
      return { buffer, contentType: response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() };
    } catch (caught) { error = caught; if (attempt + 1 < attempts) await delay(1000 * (attempt + 1)); }
  }
  throw error;
}

export async function collectIndex(sitemapUrl, { load = async url => {
  let { buffer } = await fetchBuffer(url);
  if (buffer[0] === 0x1f && buffer[1] === 0x8b) buffer = zlib.gunzipSync(buffer);
  return buffer.toString('utf8');
}, onProgress = () => {} } = {}) {
  const queue = [sitemapUrl], visited = new Set(), items = new Map(), failures = [];
  while (queue.length) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    if (visited.size > 80) { failures.push({ url, error: 'Limite de 80 sitemaps dépassée.' }); break; }
    try {
      const parsed = parseSitemap(await load(url));
      for (const child of parsed.children) {
        const address = new URL(child);
        if (address.protocol !== 'https:' || address.hostname !== new URL(sitemapUrl).hostname) throw Error('Sitemap enfant hors domaine.');
        queue.push(child);
      }
      for (const product of parsed.products) {
        const existing = items.get(product.itemId) ?? { itemId: product.itemId, urls: [], images: [] };
        existing.urls = [...new Set([...existing.urls, ...product.urls])];
        existing.images = [...new Set([...existing.images, ...product.images])];
        items.set(product.itemId, existing);
      }
      onProgress({ url, products: items.size });
    } catch (error) { failures.push({ url, error: String(error.message ?? error) }); }
  }
  const index = { complete: failures.length === 0 && items.size > 0, fetchedAt: new Date().toISOString(), sitemapUrl, sitemapCount: visited.size, failures, candidates: [...items.values()] };
  if (!index.complete) { const error = Error('Index source incomplet : aucune image ni donnée produit ne sera modifiée.'); error.index = { ...index, candidates: undefined, candidateCount: items.size }; throw error; }
  return index;
}
