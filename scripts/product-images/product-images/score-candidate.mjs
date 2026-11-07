import {
  candidateText,
  hostname,
  inferBrand,
  legacyImageStems,
  meaningfulTokens,
  modelTokens,
  normalizeText,
} from "./utils.mjs";

const HARD_BAD_TERMS = [
  "energielabel", "energy label", "energie label", "manual", "bedienungsanleitung",
  "datasheet", "datenblatt", "diagram", "zeichnung", "dimension", "masszeichnung",
  "schema", "pdf", "favicon", "logo", "icon", "placeholder", "sprite",
];

const PRIMARY_BAD_TERMS = [
  "lifestyle", "living room", "wohnzimmer", "room scene", "ambiente", "in use",
  "rear", "ruckseite", "rueckseite", "back view", "anschluss", "connector", "ports",
  "interior", "inside", "innenraum", "detail", "closeup", "close up", "macro",
  "remote", "fernbedienung", "accessory", "zubehor", "zubehör", "installation",
];

const PRIMARY_GOOD_TERMS = [
  "produktbild", "product image", "packshot", "freigestellt", "freisteller",
  "white background", "weisser hintergrund", "weißer hintergrund", "studio",
  "front", "frontal", "main image", "hero image", "product photo", "produktfoto",
];

function overlapRatio(needles, text) {
  if (needles.length === 0) return 0;
  let matches = 0;
  for (const token of needles) {
    if (text.includes(token)) matches += 1;
  }
  return matches / needles.length;
}

function countTerms(text, terms) {
  let hits = 0;
  for (const term of terms) {
    if (text.includes(normalizeText(term))) hits += 1;
  }
  return hits;
}

export function scoreCandidate(product, candidate, config) {
  const text = candidateText(candidate);
  const name = normalizeText(product.name ?? "");
  const words = meaningfulTokens(product.name ?? "");
  const models = modelTokens(product.name ?? "");
  const brand = inferBrand(product);
  const stems = legacyImageStems(product);
  const domain = String(candidate.domain || hostname(candidate.link) || hostname(candidate.imageUrl)).toLowerCase();

  let identityScore = 0;
  const reasons = [];

  if (name && text.includes(name)) {
    identityScore += 36;
    reasons.push("nom exact");
  }

  const coverage = overlapRatio(words, text);
  identityScore += Math.round(coverage * 31);
  if (coverage >= 0.7) reasons.push("forte correspondance produit");

  const modelCoverage = overlapRatio(models, text);
  if (models.length > 0) {
    identityScore += Math.round(modelCoverage * 32);
    if (modelCoverage >= 0.5) reasons.push("référence/modèle correspondant");
    if (modelCoverage === 0) identityScore -= 30;
  }

  if (brand && text.includes(brand)) {
    identityScore += 8;
    reasons.push("marque correspondante");
  }

  if (brand && domain.includes(brand)) {
    identityScore += 7;
    reasons.push("domaine de marque probable");
  }

  const stemCoverage = Math.max(0, ...stems.map((stem) => {
    const stemWords = meaningfulTokens(stem);
    return overlapRatio(stemWords, text);
  }));
  if (stemCoverage >= 0.55) {
    identityScore += 10;
    reasons.push("ancien nom de fichier correspondant");
  }

  const width = Number(candidate.imageWidth ?? candidate.width ?? 0);
  const height = Number(candidate.imageHeight ?? candidate.height ?? 0);
  if (width >= 1200 && height >= 800) identityScore += 7;
  else if (width >= 800 && height >= 600) identityScore += 5;
  else if (width >= 500 && height >= 400) identityScore += 2;
  else if (width > 0 && height > 0 && (width < 280 || height < 280)) identityScore -= 18;

  const hardBadHits = countTerms(text, HARD_BAD_TERMS);
  identityScore -= hardBadHits * 22;

  if (config.blockedDomains.some((blocked) => domain === blocked || domain.endsWith(`.${blocked}`))) {
    identityScore = 0;
    reasons.push("ancien domaine bloqué");
  }

  if (config.allowedDomains.length > 0) {
    const allowed = config.allowedDomains.some((item) => domain === item || domain.endsWith(`.${item}`));
    if (!allowed) identityScore = 0;
  }

  identityScore = Math.max(0, Math.min(100, Math.round(identityScore)));

  const positivePrimaryHits = countTerms(text, PRIMARY_GOOD_TERMS);
  const negativePrimaryHits = countTerms(text, PRIMARY_BAD_TERMS);
  const queryText = normalizeText(candidate.query ?? "");

  let primaryScore = 48;
  primaryScore += Math.min(positivePrimaryHits * 11, 33);
  primaryScore -= Math.min(negativePrimaryHits * 14, 56);
  primaryScore -= Math.min(hardBadHits * 25, 75);

  if (/produktbild|freigestellt|packshot|white background|product image|produktfoto/.test(queryText)) {
    primaryScore += 16;
  }
  if (/front|frontal/.test(queryText)) primaryScore += 8;
  if (brand && domain.includes(brand)) primaryScore += 6;
  if (width >= 900 && height >= 700) primaryScore += 5;

  primaryScore = Math.max(0, Math.min(100, Math.round(primaryScore)));

  const strongMatch = models.length > 0
    ? modelCoverage >= 0.5 && coverage >= 0.3
    : coverage >= 0.68;

  const autoEligible = identityScore >= config.autoAcceptScore && strongMatch && hardBadHits === 0;
  const reviewEligible = identityScore >= config.reviewScore;
  const primaryEligible =
    autoEligible &&
    primaryScore >= config.primaryAcceptScore &&
    negativePrimaryHits === 0 &&
    hardBadHits === 0;

  const score = Math.max(0, Math.min(100, Math.round(identityScore * 0.72 + primaryScore * 0.28)));

  return {
    score,
    identityScore,
    primaryScore,
    autoEligible,
    reviewEligible,
    primaryEligible,
    coverage: Number(coverage.toFixed(3)),
    modelCoverage: Number(modelCoverage.toFixed(3)),
    primaryPositiveHits: positivePrimaryHits,
    primaryNegativeHits: negativePrimaryHits,
    hardBadHits,
    reasons,
  };
}
