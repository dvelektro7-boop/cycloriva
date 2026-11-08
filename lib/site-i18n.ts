
/**
 * =========================================================
 * CYCLORIVA — INTERNATIONALISATION DU SITE PUBLIC
 * =========================================================
 *
 * Source officielle : messages/*.json
 *
 * Langues : fr, en, de, it, es
 *
 * Compatibilité conservée avec les composants existants.
 * Aucun accès au navigateur.
 * Compatible serveur/client, Next.js 16 et TypeScript.
 * =========================================================
 */

import frMessages from "../messages/fr.json";
import enMessages from "../messages/en.json";
import deMessages from "../messages/de.json";
import itMessages from "../messages/it.json";
import esMessages from "../messages/es.json";

// =========================================================
// 1. LANGUES OFFICIELLES
// =========================================================

export const siteLocales = [
  "fr",
  "en",
  "de",
  "it",
  "es",
] as const;

export type SiteLocale = (typeof siteLocales)[number];

export const defaultSiteLocale: SiteLocale = "fr";

export const siteLocaleNames: Record<SiteLocale, string> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  it: "Italiano",
  es: "Español",
};

export const siteIntlLocales: Record<SiteLocale, string> = {
  fr: "fr-FR",
  en: "en-IE",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
};

// =========================================================
// 2. DICTIONNAIRES OFFICIELS
// =========================================================

export const siteMessages = {
  fr: frMessages,
  en: enMessages,
  de: deMessages,
  it: itMessages,
  es: esMessages,
} as const;

type TranslationDictionary = typeof frMessages;

export type SiteMessageKey = keyof TranslationDictionary;

// =========================================================
// 3. VALIDATION ET RÉSOLUTION DES LANGUES
// =========================================================

export function isSiteLocale(
  value: unknown
): value is SiteLocale {
  return (
    typeof value === "string" &&
    siteLocales.some((locale) => locale === value)
  );
}

export function resolveLocale(
  value?: string | null
): SiteLocale {
  if (!value) return defaultSiteLocale;

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .split("-")[0];

  return isSiteLocale(normalized)
    ? normalized
    : defaultSiteLocale;
}

// =========================================================
// 4. CORRESPONDANCE DES ANCIENNES CLÉS
// =========================================================
//
// Les composants existants continuent à utiliser
// siteText(locale, "home"), etc.
//
// Ces clés sont maintenant reliées aux fichiers JSON.
// =========================================================

const legacyKeyPaths = {
  search: "search.placeholder",
  searchButton: "search.button",

  home: "navigation.home",
  electric: "navigation.electricBikes",
  mtb: "navigation.mountainBikes",
  cargo: "navigation.cargoBikes",
  city: "navigation.cityBikes",
  accessories: "navigation.accessories",
  brands: "navigation.brands",
  promotions: "navigation.promotions",
  contact: "navigation.contact",

  account: "navigation.account",
  favorites: "navigation.favorites",
  cart: "navigation.cart",
  languages: "navigation.language",
  soon: "common.comingSoon",
  close: "common.close",

  tagline: "site.tagline",

  store: "footer.store",
  information: "footer.information",
  help: "footer.help",
  networks: "footer.socialMedia",

  newsletter: "newsletter.eyebrow",
  newsletterTitle: "newsletter.title",
  newsletterDescription: "newsletter.description",
  email: "newsletter.emailPlaceholder",
  subscribe: "newsletter.subscribe",
  newsletterPending: "newsletter.pending",
  newsletterConsent: "newsletter.consent",
  newsletterNeedConsent: "newsletter.needConsent",

  payment: "services.securePayment",
  payments: "services.securePayment",

  about: "footer.about",
  guides: "footer.guides",
  customers: "footer.customerService",
  delivery: "footer.delivery",
  returns: "footer.returns",
  faq: "footer.faq",
  warranty: "footer.warranty",
  track: "footer.trackOrder",

  legal: "footer.legalNotice",
  privacy: "footer.privacyPolicy",
  terms: "footer.terms",
  cookies: "footer.cookieSettings",

  rights: "footer.rights",
} as const;

type LegacyMappedKey = keyof typeof legacyKeyPaths;

// =========================================================
// 5. CLÉS HISTORIQUES NON ENCORE PRÉSENTES DANS LES JSON
// =========================================================
//
// Ces quelques textes restent temporairement ici.
// Ils pourront être déplacés vers les cinq JSON
// sans changer les composants existants.
// =========================================================

const compatibilityTexts = {
  fr: {
    menu: "Menu",
    close: "Fermer le menu",
    languages: "Langue du site",
    newsletter: "Inscrivez-vous à la newsletter",
    payments: "Paiements sécurisés",
    paymentPreview:
      "Modes de paiement présentés à titre indicatif.",
    planned: "Page en préparation",
  },
  en: {
    menu: "Menu",
    close: "Close menu",
    languages: "Site language",
    newsletter: "Subscribe to our newsletter",
    payments: "Secure payments",
    paymentPreview:
      "Payment methods shown for illustration only.",
    planned: "Page coming soon",
  },
  de: {
    menu: "Menü",
    close: "Menü schließen",
    languages: "Sprache der Website",
    newsletter: "Newsletter abonnieren",
    payments: "Sichere Zahlungen",
    paymentPreview:
      "Zahlungsarten nur zur Veranschaulichung.",
    planned: "Seite in Vorbereitung",
  },
  it: {
    menu: "Menu",
    close: "Chiudi menu",
    languages: "Lingua del sito",
    newsletter: "Iscriviti alla newsletter",
    payments: "Pagamenti sicuri",
    paymentPreview:
      "Metodi di pagamento mostrati a titolo indicativo.",
    planned: "Pagina in preparazione",
  },
  es: {
    menu: "Menú",
    close: "Cerrar menú",
    languages: "Idioma del sitio",
    newsletter: "Suscríbete al boletín",
    payments: "Pagos seguros",
    paymentPreview:
      "Métodos de pago mostrados a título informativo.",
    planned: "Página en preparación",
  },
} as const;

type CompatibilityKey =
  keyof typeof compatibilityTexts.fr;

export type SiteTextKey =
  | LegacyMappedKey
  | CompatibilityKey;

// =========================================================
// 6. LECTURE D'UNE TRADUCTION JSON
// =========================================================

function readMessage(
  locale: SiteLocale,
  path: string
): string | undefined {
  const dictionary: unknown = siteMessages[locale];

  const result = path
    .split(".")
    .reduce<unknown>((current, segment) => {
      if (
        current === null ||
        typeof current !== "object" ||
        !(segment in current)
      ) {
        return undefined;
      }

      return (current as Record<string, unknown>)[segment];
    }, dictionary);

  return typeof result === "string"
    ? result
    : undefined;
}

// =========================================================
// 7. TRADUCTION DES ANCIENNES CLÉS
// =========================================================

export function siteText(
  locale: SiteLocale,
  key: SiteTextKey
): string {
  const compatible =
    compatibilityTexts[locale] as Record<string, string>;

  // Priorité aux textes historiques spécifiques.
  if (Object.prototype.hasOwnProperty.call(compatible, key)) {
    return compatible[key];
  }

  const path = legacyKeyPaths[key as LegacyMappedKey];

  if (!path) return key;

  return (
    readMessage(locale, path) ??
    readMessage(defaultSiteLocale, path) ??
    key
  );
}

export function getSiteText(
  locale: string | null | undefined,
  key: SiteTextKey
): string {
  return siteText(resolveLocale(locale), key);
}

// =========================================================
// 8. TRADUCTION DIRECTE DES FICHIERS JSON
// =========================================================
//
// Exemple :
// siteMessage("de", "product.addToCart")
// siteMessage("es", "checkout.placeOrder")
// siteMessage("it", "footer.privacyPolicy")
//
// Cette fonction sera utilisée pour migrer
// les autres composants progressivement.
// =========================================================

export function siteMessage(
  locale: SiteLocale,
  path: string
): string {
  return (
    readMessage(locale, path) ??
    readMessage(defaultSiteLocale, path) ??
    path
  );
}

export function getSiteMessage(
  locale: string | null | undefined,
  path: string
): string {
  return siteMessage(resolveLocale(locale), path);
}

// =========================================================
// 9. INFORMATIONS DE LANGUE
// =========================================================

export function getSiteLocaleName(
  locale: SiteLocale
): string {
  return siteLocaleNames[locale];
}

export function getSiteIntlLocale(
  locale: SiteLocale
): string {
  return siteIntlLocales[locale];
}

// =========================================================
// 10. LANGUE DE L'URL
// =========================================================

export function getLocaleFromPathname(
  pathname: string
): SiteLocale {
  const path = pathname.split("?")[0].split("#")[0];
  const locale = path.split("/")[1];

  return resolveLocale(locale);
}

// =========================================================
// 11. CHANGEMENT DE LANGUE D'UNE URL
// =========================================================

export function switchSiteLocale(
  pathname: string,
  nextLocale: SiteLocale
): string {
  const hashIndex = pathname.indexOf("#");

  const hash =
    hashIndex >= 0
      ? pathname.slice(hashIndex)
      : "";

  const withoutHash =
    hashIndex >= 0
      ? pathname.slice(0, hashIndex)
      : pathname;

  const queryIndex = withoutHash.indexOf("?");

  const query =
    queryIndex >= 0
      ? withoutHash.slice(queryIndex)
      : "";

  const path =
    queryIndex >= 0
      ? withoutHash.slice(0, queryIndex)
      : withoutHash;

  if (!path || path === "/") {
    return `/${nextLocale}${query}${hash}`;
  }

  const segments = path.startsWith("/")
    ? path.split("/")
    : `/${path}`.split("/");

  if (isSiteLocale(segments[1])) {
    segments[1] = nextLocale;
  } else {
    segments.splice(1, 0, nextLocale);
  }

  return `${segments.join("/")}${query}${hash}`;
}

// =========================================================
// 12. LIENS MULTILINGUES
// =========================================================

export function sitePath(
  locale: SiteLocale,
  path = ""
): string {
  const normalizedPath = path.startsWith("/")
    ? path
    : path
      ? `/${path}`
      : "";

  return `/${locale}${normalizedPath}`;
}
