import { sleep } from "./utils.mjs";

export async function searchImagesSerper(query, config) {
  if (!config.serperApiKey) {
    throw new Error(
      "SERPER_API_KEY manquant. Ajoutez SERPER_API_KEY=... dans .env.local avant la recherche d'images.",
    );
  }

  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch("https://google.serper.dev/images", {
        method: "POST",
        headers: {
          "X-API-KEY": config.serperApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: query,
          gl: config.country,
          hl: config.locale,
        }),
        signal: AbortSignal.timeout(25000),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`Serper HTTP ${response.status}: ${body.slice(0, 250)}`);
      }

      const json = await response.json();
      const results = Array.isArray(json.images) ? json.images : [];

      return results.slice(0, config.searchResultsPerQuery).map((item, index) => ({
        title: String(item.title ?? ""),
        imageUrl: String(item.imageUrl ?? ""),
        thumbnailUrl: String(item.thumbnailUrl ?? ""),
        imageWidth: Number(item.imageWidth ?? 0) || null,
        imageHeight: Number(item.imageHeight ?? 0) || null,
        source: String(item.source ?? ""),
        domain: String(item.domain ?? ""),
        link: String(item.link ?? ""),
        position: Number(item.position ?? index + 1),
        query,
      })).filter((item) => /^https?:\/\//i.test(item.imageUrl));
    } catch (error) {
      lastError = error;
      if (attempt < 3) await sleep(700 * attempt);
    }
  }

  throw lastError ?? new Error("Échec de recherche Serper.");
}
