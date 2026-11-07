export type AddressSuggestion = {
  label: string;
  addressLine1: string;
  city: string;
  postalCode: string;
};
export const ADDRESS_SUGGESTION_TEXT = {
  fr: {
    loading: "Recherche d’adresses…",
    empty: "Aucune suggestion. Vous pouvez saisir votre adresse librement.",
    unavailable: "Suggestions indisponibles. Continuez la saisie manuelle.",
    manual: "Continuer la saisie manuelle",
    label: "Adresses proposées",
  },
  en: {
    loading: "Searching addresses…",
    empty: "No suggestions. You can enter your address manually.",
    unavailable:
      "Suggestions unavailable. Continue entering your address manually.",
    manual: "Continue entering manually",
    label: "Suggested addresses",
  },
  de: {
    loading: "Adressen werden gesucht…",
    empty: "Keine Vorschläge. Sie können die Adresse selbst eingeben.",
    unavailable:
      "Vorschläge nicht verfügbar. Bitte die Adresse selbst eingeben.",
    manual: "Adresse selbst eingeben",
    label: "Adressvorschläge",
  },
  it: {
    loading: "Ricerca indirizzi…",
    empty: "Nessun suggerimento. Puoi inserire l’indirizzo manualmente.",
    unavailable: "Suggerimenti non disponibili. Continua manualmente.",
    manual: "Continua manualmente",
    label: "Indirizzi suggeriti",
  },
  es: {
    loading: "Buscando direcciones…",
    empty: "Sin sugerencias. Puedes escribir tu dirección manualmente.",
    unavailable: "Sugerencias no disponibles. Continúa manualmente.",
    manual: "Continuar manualmente",
    label: "Direcciones sugeridas",
  },
} as const;

/** Keep structured address fields only; never guess missing house numbers or postcodes. */
export function parsePhotonSuggestions(
  data: unknown,
  country: string,
  postalQuery = "",
): AddressSuggestion[] {
  if (
    !data ||
    typeof data !== "object" ||
    !("features" in data) ||
    !Array.isArray(data.features)
  )
    return [];
  const text = (value: unknown) =>
    typeof value === "string" ? value.trim().slice(0, 255) : "";
  const seen = new Set<string>();
  const result: AddressSuggestion[] = [];
  for (const feature of data.features.slice(0, 30)) {
    const p = feature?.properties;
    if (!p || text(p.countrycode).toUpperCase() !== country) continue;
    const street =
      text(p.street) || (p.osm_key === "highway" ? text(p.name) : "");
    const addressLine1 = street
      ? [text(p.housenumber), street].filter(Boolean).join(" ")
      : "";
    const city =
      text(p.city) || text(p.town) || text(p.village) || text(p.locality);
    const postalCode =
      text(p.postcode) || (p.osm_value === "postcode" ? text(p.name) : "");
    if (
      postalQuery &&
      !postalCode
        .replace(/\s/g, "")
        .toUpperCase()
        .startsWith(postalQuery.replace(/\s/g, "").toUpperCase())
    )
      continue;
    if (!city && !addressLine1) continue;
    const label = [addressLine1, [postalCode, city].filter(Boolean).join(" ")]
      .filter(Boolean)
      .join(", ");
    if (seen.has(label)) continue;
    seen.add(label);
    result.push({ label, addressLine1, city, postalCode });
    if (result.length === 5) break;
  }
  return result;
}
