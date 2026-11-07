
import "server-only";

import { headers } from "next/headers";

/**
 * ============================================================
 * CYCLORIVA — GÉOLOCALISATION DU CHECKOUT
 * ============================================================
 *
 * Fichier : lib/checkout-geo.ts
 *
 * Next.js 16 — TypeScript — App Router
 *
 * OBJECTIFS :
 *
 * - Détecter approximativement le pays du visiteur.
 * - Proposer automatiquement le pays de livraison.
 * - Proposer l'indicatif téléphonique correspondant.
 * - Afficher le drapeau et le nom du pays.
 * - Limiter les pays de livraison aux 8 pays autorisés.
 * - Permettre la modification manuelle.
 * - Ne pas enregistrer inutilement l'IP du visiteur.
 * - Ne pas inventer de localisation.
 *
 * SOURCES :
 *
 * Vercel :
 *   x-vercel-ip-country
 *
 * Cloudflare :
 *   cf-ipcountry
 *
 * SÉCURITÉ :
 *
 * - Les en-têtes sont lus uniquement côté serveur.
 * - On n'accepte pas un pays fourni par le navigateur
 *   comme résultat de géolocalisation fiable.
 * - Les en-têtes de géolocalisation ne sont fiables
 *   que si l'infrastructure les contrôle.
 * - Le pays détecté reste une simple suggestion.
 * - Aucun contrôle d'accès ne repose sur ce résultat.
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

export type CheckoutGeoCountry =
  | "DE"
  | "FR"
  | "ES"
  | "IT"
  | "CH"
  | "AT"
  | "NL"
  | "BE";

export type CheckoutGeoLocale =
  | "fr"
  | "en"
  | "de"
  | "it"
  | "es";

export type CheckoutGeoProvider =
  | "vercel"
  | "cloudflare"
  | "none";

export type CheckoutGeoSource =
  | "vercel"
  | "cloudflare"
  | "unavailable";

export type CheckoutGeoStatus =
  | "detected"
  | "unsupported_country"
  | "unavailable";

export type CheckoutGeoResult = {
  /**
   * Pays détecté parmi les pays autorisés.
   * Null si absent ou non autorisé.
   */
  detectedCountry: CheckoutGeoCountry | null;

  /**
   * Code ISO fourni par le prestataire.
   * Peut correspondre à un pays non autorisé.
   *
   * Ne pas le confondre avec un pays de livraison.
   */
  detectedCountryCode: string | null;

  /**
   * Proposition de pays de livraison.
   * Jamais imposée au client.
   */
  suggestedCountry: CheckoutGeoCountry | null;

  /**
   * Préfixe international proposé.
   */
  suggestedDialCode: string | null;

  /**
   * Drapeau associé au pays proposé.
   */
  suggestedFlag: string | null;

  /**
   * Nom du pays dans la langue demandée.
   */
  suggestedCountryName: string | null;

  /**
   * Indique si un des huit pays a été détecté.
   */
  isDetected: boolean;

  /**
   * État de la détection.
   */
  status: CheckoutGeoStatus;

  /**
   * Origine du résultat.
   */
  source: CheckoutGeoSource;

  /**
   * Le client doit toujours pouvoir modifier
   * le pays et l'indicatif proposés.
   */
  canChangeCountry: true;

  canChangeDialCode: true;
};

export type CheckoutGeoCountryOption = {
  code: CheckoutGeoCountry;
  name: string;
  dialCode: string;
  flag: string;
};

type CountryConfig = {
  dialCode: string;
  flag: string;
  names: Record<CheckoutGeoLocale, string>;
};

// ============================================================
// 2. LES HUIT PAYS CYCLORIVA
// ============================================================

export const CHECKOUT_GEO_COUNTRIES = [
  "DE",
  "FR",
  "ES",
  "IT",
  "CH",
  "AT",
  "NL",
  "BE",
] as const;

const COUNTRY_CONFIG: Record<
  CheckoutGeoCountry,
  CountryConfig
> = {
  DE: {
    dialCode: "+49",
    flag: "🇩🇪",
    names: {
      fr: "Allemagne",
      en: "Germany",
      de: "Deutschland",
      it: "Germania",
      es: "Alemania",
    },
  },

  FR: {
    dialCode: "+33",
    flag: "🇫🇷",
    names: {
      fr: "France",
      en: "France",
      de: "Frankreich",
      it: "Francia",
      es: "Francia",
    },
  },

  ES: {
    dialCode: "+34",
    flag: "🇪🇸",
    names: {
      fr: "Espagne",
      en: "Spain",
      de: "Spanien",
      it: "Spagna",
      es: "España",
    },
  },

  IT: {
    dialCode: "+39",
    flag: "🇮🇹",
    names: {
      fr: "Italie",
      en: "Italy",
      de: "Italien",
      it: "Italia",
      es: "Italia",
    },
  },

  CH: {
    dialCode: "+41",
    flag: "🇨🇭",
    names: {
      fr: "Suisse",
      en: "Switzerland",
      de: "Schweiz",
      it: "Svizzera",
      es: "Suiza",
    },
  },

  AT: {
    dialCode: "+43",
    flag: "🇦🇹",
    names: {
      fr: "Autriche",
      en: "Austria",
      de: "Österreich",
      it: "Austria",
      es: "Austria",
    },
  },

  NL: {
    dialCode: "+31",
    flag: "🇳🇱",
    names: {
      fr: "Pays-Bas",
      en: "Netherlands",
      de: "Niederlande",
      it: "Paesi Bassi",
      es: "Países Bajos",
    },
  },

  BE: {
    dialCode: "+32",
    flag: "🇧🇪",
    names: {
      fr: "Belgique",
      en: "Belgium",
      de: "Belgien",
      it: "Belgio",
      es: "Bélgica",
    },
  },
};

// ============================================================
// 3. VÉRIFICATION DES CODES
// ============================================================

export function isCheckoutGeoCountry(
  value: unknown
): value is CheckoutGeoCountry {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(
      COUNTRY_CONFIG,
      value
    )
  );
}

export function normalizeCheckoutGeoLocale(
  value: unknown
): CheckoutGeoLocale {
  switch (value) {
    case "fr":
    case "en":
    case "de":
    case "it":
    case "es":
      return value;

    default:
      return "fr";
  }
}

/**
 * Ne conserve que les codes ISO à deux lettres.
 *
 * Les valeurs particulières comme XX ou T1
 * ne doivent pas devenir des pays autorisés.
 */
export function normalizeGeoCountryCode(
  value: unknown
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const code = value.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(code)) {
    return null;
  }

  if (
    code === "XX" ||
    code === "T1"
  ) {
    return null;
  }

  return code;
}

// ============================================================
// 4. INFORMATION D'UN PAYS
// ============================================================

export function getCheckoutGeoCountryOption(
  country: CheckoutGeoCountry,
  locale: CheckoutGeoLocale = "fr"
): CheckoutGeoCountryOption {
  const config = COUNTRY_CONFIG[country];

  return {
    code: country,
    name: config.names[locale],
    dialCode: config.dialCode,
    flag: config.flag,
  };
}

/**
 * Liste de sélection pour le formulaire.
 *
 * Peut être transmise à un composant client.
 */
export function getCheckoutGeoCountryOptions(
  locale: CheckoutGeoLocale = "fr"
): CheckoutGeoCountryOption[] {
  return CHECKOUT_GEO_COUNTRIES.map(
    (country) =>
      getCheckoutGeoCountryOption(
        country,
        locale
      )
  );
}

/**
 * Indicatif téléphonique d'un pays autorisé.
 */
export function getCheckoutGeoDialCode(
  country: CheckoutGeoCountry
): string {
  return COUNTRY_CONFIG[country].dialCode;
}

/**
 * Drapeau d'un pays autorisé.
 */
export function getCheckoutGeoFlag(
  country: CheckoutGeoCountry
): string {
  return COUNTRY_CONFIG[country].flag;
}

/**
 * Nom du pays dans la langue du site.
 */
export function getCheckoutGeoCountryName(
  country: CheckoutGeoCountry,
  locale: CheckoutGeoLocale = "fr"
): string {
  return COUNTRY_CONFIG[country].names[locale];
}

// ============================================================
// 5. CHOIX DU PRESTATAIRE
// ============================================================
//
// Vercel est automatiquement reconnu lorsque
// l'application fonctionne sur Vercel.
//
// Cloudflare doit être explicitement configuré :
//
// CYCLORIVA_GEO_PROVIDER=cloudflare
//
// IMPORTANT :
// Pour Cloudflare, le serveur d'origine doit
// être protégé afin que des requêtes directes
// ne puissent pas injecter cf-ipcountry.
//
// Ne pas choisir le prestataire d'après un
// en-tête envoyé arbitrairement par un client.
//
// ============================================================

export function getConfiguredCheckoutGeoProvider():
  CheckoutGeoProvider {
  const configured = (
    process.env.CYCLORIVA_GEO_PROVIDER ??
    ""
  )
    .trim()
    .toLowerCase();

  if (configured === "vercel") {
    return "vercel";
  }

  if (configured === "cloudflare") {
    return "cloudflare";
  }

  if (configured === "none") {
    return "none";
  }

  if (process.env.VERCEL === "1") {
    return "vercel";
  }

  return "none";
}

// ============================================================
// 6. RÉSULTAT SANS GÉOLOCALISATION
// ============================================================

function unavailableResult():
  CheckoutGeoResult {
  return {
    detectedCountry: null,
    detectedCountryCode: null,
    suggestedCountry: null,
    suggestedDialCode: null,
    suggestedFlag: null,
    suggestedCountryName: null,
    isDetected: false,
    status: "unavailable",
    source: "unavailable",
    canChangeCountry: true,
    canChangeDialCode: true,
  };
}

// ============================================================
// 7. CONSTRUCTION DU RÉSULTAT
// ============================================================

function buildGeoResult(
  code: string | null,
  source: CheckoutGeoSource,
  locale: CheckoutGeoLocale
): CheckoutGeoResult {
  if (!code) {
    return unavailableResult();
  }

  if (!isCheckoutGeoCountry(code)) {
    return {
      detectedCountry: null,
      detectedCountryCode: code,
      suggestedCountry: null,
      suggestedDialCode: null,
      suggestedFlag: null,
      suggestedCountryName: null,
      isDetected: false,
      status: "unsupported_country",
      source,
      canChangeCountry: true,
      canChangeDialCode: true,
    };
  }

  const country =
    getCheckoutGeoCountryOption(
      code,
      locale
    );

  return {
    detectedCountry: country.code,
    detectedCountryCode: country.code,
    suggestedCountry: country.code,
    suggestedDialCode: country.dialCode,
    suggestedFlag: country.flag,
    suggestedCountryName: country.name,
    isDetected: true,
    status: "detected",
    source,
    canChangeCountry: true,
    canChangeDialCode: true,
  };
}

// ============================================================
// 8. LECTURE SÉCURISÉE DES EN-TÊTES
// ============================================================
//
// Cette fonction ne déduit PAS le pays depuis
// un User-Agent, une langue ou un navigateur.
//
// La langue du visiteur ne prouve pas
// son pays de résidence.
//
// ============================================================

export function detectCheckoutGeoFromHeaders(
  requestHeaders: Headers,
  locale: CheckoutGeoLocale = "fr",
  provider: CheckoutGeoProvider =
    getConfiguredCheckoutGeoProvider()
): CheckoutGeoResult {
  if (provider === "none") {
    return unavailableResult();
  }

  let rawCountry: string | null = null;

  if (provider === "vercel") {
    rawCountry = requestHeaders.get(
      "x-vercel-ip-country"
    );
  }

  if (provider === "cloudflare") {
    rawCountry = requestHeaders.get(
      "cf-ipcountry"
    );
  }

  const code = normalizeGeoCountryCode(
    rawCountry
  );

  return buildGeoResult(
    code,
    provider,
    locale
  );
}

// ============================================================
// 9. DÉTECTION DEPUIS UNE REQUÊTE HTTP
// ============================================================
//
// Utilisable depuis une route API :
//
// GET /api/checkout/geo
//
// Le client ne transmet pas lui-même
// un pays prétendument détecté.
//
// ============================================================

export function detectCheckoutGeoFromRequest(
  request: Request,
  locale: CheckoutGeoLocale = "fr"
): CheckoutGeoResult {
  return detectCheckoutGeoFromHeaders(
    request.headers,
    locale
  );
}

// ============================================================
// 10. DÉTECTION DEPUIS NEXT.JS APP ROUTER
// ============================================================
//
// Next.js 16 : headers() est asynchrone.
//
// À utiliser dans un Server Component
// ou une fonction serveur appropriée.
//
// ============================================================

export async function getCheckoutGeo(
  locale: CheckoutGeoLocale = "fr"
): Promise<CheckoutGeoResult> {
  const requestHeaders = await headers();

  return detectCheckoutGeoFromHeaders(
    requestHeaders,
    locale
  );
}

// ============================================================
// 11. VALEURS INITIALES DU FORMULAIRE
// ============================================================
//
// Les valeurs nulles sont volontaires.
//
// Sans détection fiable :
// - le champ pays reste à sélectionner
// - aucun indicatif n'est imposé
//
// Le client conserve la liberté de changer
// son pays de livraison et son indicatif.
//
// ============================================================

export type CheckoutGeoFormDefaults = {
  country: CheckoutGeoCountry | "";
  phoneCountry: CheckoutGeoCountry | "";
  phoneDialCode: string;
  detectedCountry: CheckoutGeoCountry | null;
};

export function getCheckoutGeoFormDefaults(
  result: CheckoutGeoResult
): CheckoutGeoFormDefaults {
  return {
    country: result.suggestedCountry ?? "",
    phoneCountry: result.suggestedCountry ?? "",
    phoneDialCode:
      result.suggestedDialCode ?? "",
    detectedCountry:
      result.detectedCountry,
  };
}

// ============================================================
// 12. INDICATIF APRÈS CHANGEMENT DE PAYS
// ============================================================
//
// Important :
//
// Le pays de livraison et le pays du téléphone
// sont deux informations indépendantes.
//
// Exemple :
// Livraison en Allemagne.
// Téléphone français +33.
//
// Le formulaire ne doit pas remplacer
// automatiquement un indicatif que le client
// a modifié manuellement.
//
// ============================================================

export function getSuggestedPhoneDialCode(
  country: CheckoutGeoCountry | null
): string {
  if (!country) {
    return "";
  }

  return getCheckoutGeoDialCode(country);
}

// ============================================================
// 13. LISTE SIMPLE DES INDICATIFS
// ============================================================

export type CheckoutGeoPhoneOption = {
  country: CheckoutGeoCountry;
  dialCode: string;
  flag: string;
  label: string;
};

export function getCheckoutGeoPhoneOptions(
  locale: CheckoutGeoLocale = "fr"
): CheckoutGeoPhoneOption[] {
  return CHECKOUT_GEO_COUNTRIES.map(
    (code) => {
      const option =
        getCheckoutGeoCountryOption(
          code,
          locale
        );

      return {
        country: code,
        dialCode: option.dialCode,
        flag: option.flag,
        label:
          `${option.flag} ${option.dialCode} — ${option.name}`,
      };
    }
  );
}

// ============================================================
// 14. VÉRIFICATION D'UN PAYS DE LIVRAISON
// ============================================================
//
// Cette fonction valide seulement l'appartenance
// à la liste des huit pays.
//
// Les règles de livraison et leurs tarifs
// sont vérifiés séparément par
// lib/checkout-pricing.ts.
//
// ============================================================

export function validateCheckoutDeliveryCountry(
  value: unknown
): CheckoutGeoCountry {
  if (!isCheckoutGeoCountry(value)) {
    throw new Error(
      "CHECKOUT_COUNTRY_NOT_SUPPORTED"
    );
  }

  return value;
}

// ============================================================
// FIN — CYCLORIVA CHECKOUT GEO
// ============================================================
