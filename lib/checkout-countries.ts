
/**
 * ============================================================
 * CYCLORIVA — PAYS ET INDICATIFS DU CHECKOUT
 * ============================================================
 *
 * Fichier : lib/checkout-countries.ts
 *
 * Next.js 16 — TypeScript — React 19
 *
 * Compatible serveur et navigateur.
 *
 * RESPONSABILITÉS
 * ------------------------------------------------------------
 * - Les 8 pays autorisés pour la livraison
 * - Les noms des pays en 5 langues
 * - Les drapeaux
 * - Les codes ISO 3166-1 alpha-2
 * - Les indicatifs téléphoniques
 * - Les options des menus déroulants
 * - La normalisation des codes pays
 * - La vérification des codes postaux
 * - Les formats d'exemples de codes postaux
 * - La validation préliminaire des téléphones
 * - La préparation du formulaire de livraison
 *
 * RÈGLES IMPORTANTES
 * ------------------------------------------------------------
 * - Aucun pays en dehors des 8 n'est autorisé.
 * - Le pays de livraison est modifiable.
 * - L'indicatif téléphonique est modifiable.
 * - Le pays du téléphone peut être différent
 *   du pays de livraison.
 * - La géolocalisation IP est une suggestion.
 * - Ce fichier n'effectue aucun appel réseau.
 * - Il n'enregistre aucune adresse IP.
 * - Il ne détermine pas les frais de livraison.
 * - Il ne valide pas le stock ou les paiements.
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

export type CheckoutCountryCode =
  | "DE"
  | "FR"
  | "ES"
  | "IT"
  | "CH"
  | "AT"
  | "NL"
  | "BE";

export type CheckoutCountryLocale =
  | "fr"
  | "en"
  | "de"
  | "it"
  | "es";

export type CheckoutCountryNames = Record<
  CheckoutCountryLocale,
  string
>;

export type CheckoutCountryInfo = {
  code: CheckoutCountryCode;
  flag: string;
  dialCode: string;
  names: CheckoutCountryNames;
  postalCodeExample: string;
};

export type CheckoutCountryOption = {
  value: CheckoutCountryCode;
  label: string;
  code: CheckoutCountryCode;
  name: string;
  flag: string;
  dialCode: string;
};

export type CheckoutPhoneCountryOption = {
  value: CheckoutCountryCode;
  label: string;
  country: CheckoutCountryCode;
  countryName: string;
  dialCode: string;
  flag: string;
};

export type CheckoutCountryFormDefaults = {
  country: CheckoutCountryCode | "";
  phoneCountry: CheckoutCountryCode | "";
  phoneDialCode: string;
};

export type CheckoutPostalCodeValidation = {
  valid: boolean;
  normalized: string;
  error: "REQUIRED" | "INVALID_FORMAT" | null;
};

// ============================================================
// 2. CONSTANTES
// ============================================================

export const CHECKOUT_COUNTRIES = [
  "DE",
  "FR",
  "ES",
  "IT",
  "CH",
  "AT",
  "NL",
  "BE",
] as const satisfies readonly CheckoutCountryCode[];

export const CHECKOUT_DEFAULT_LOCALE:
  CheckoutCountryLocale = "fr";

export const CHECKOUT_COUNTRY_COUNT =
  CHECKOUT_COUNTRIES.length;

export const CHECKOUT_SUPPORTED_LOCALES = [
  "fr",
  "en",
  "de",
  "it",
  "es",
] as const satisfies readonly CheckoutCountryLocale[];

// ============================================================
// 3. INFORMATIONS OFFICIELLES DES PAYS
// ============================================================

export const CHECKOUT_COUNTRY_DATA: Record<
  CheckoutCountryCode,
  CheckoutCountryInfo
> = {
  DE: {
    code: "DE",
    flag: "🇩🇪",
    dialCode: "+49",

    names: {
      fr: "Allemagne",
      en: "Germany",
      de: "Deutschland",
      it: "Germania",
      es: "Alemania",
    },

    postalCodeExample: "10115",
  },

  FR: {
    code: "FR",
    flag: "🇫🇷",
    dialCode: "+33",

    names: {
      fr: "France",
      en: "France",
      de: "Frankreich",
      it: "Francia",
      es: "Francia",
    },

    postalCodeExample: "75001",
  },

  ES: {
    code: "ES",
    flag: "🇪🇸",
    dialCode: "+34",

    names: {
      fr: "Espagne",
      en: "Spain",
      de: "Spanien",
      it: "Spagna",
      es: "España",
    },

    postalCodeExample: "28001",
  },

  IT: {
    code: "IT",
    flag: "🇮🇹",
    dialCode: "+39",

    names: {
      fr: "Italie",
      en: "Italy",
      de: "Italien",
      it: "Italia",
      es: "Italia",
    },

    postalCodeExample: "00100",
  },

  CH: {
    code: "CH",
    flag: "🇨🇭",
    dialCode: "+41",

    names: {
      fr: "Suisse",
      en: "Switzerland",
      de: "Schweiz",
      it: "Svizzera",
      es: "Suiza",
    },

    postalCodeExample: "8001",
  },

  AT: {
    code: "AT",
    flag: "🇦🇹",
    dialCode: "+43",

    names: {
      fr: "Autriche",
      en: "Austria",
      de: "Österreich",
      it: "Austria",
      es: "Austria",
    },

    postalCodeExample: "1010",
  },

  NL: {
    code: "NL",
    flag: "🇳🇱",
    dialCode: "+31",

    names: {
      fr: "Pays-Bas",
      en: "Netherlands",
      de: "Niederlande",
      it: "Paesi Bassi",
      es: "Países Bajos",
    },

    postalCodeExample: "1012 AB",
  },

  BE: {
    code: "BE",
    flag: "🇧🇪",
    dialCode: "+32",

    names: {
      fr: "Belgique",
      en: "Belgium",
      de: "Belgien",
      it: "Belgio",
      es: "Bélgica",
    },

    postalCodeExample: "1000",
  },
};

// ============================================================
// 4. ENSEMBLES DE VALIDATION
// ============================================================

const COUNTRY_SET: ReadonlySet<string> =
  new Set(CHECKOUT_COUNTRIES);

const LOCALE_SET: ReadonlySet<string> =
  new Set(CHECKOUT_SUPPORTED_LOCALES);

// ============================================================
// 5. VÉRIFICATION DU CODE PAYS
// ============================================================

export function isCheckoutCountry(
  value: unknown
): value is CheckoutCountryCode {
  return (
    typeof value === "string" &&
    COUNTRY_SET.has(value)
  );
}

/**
 * Accepte par exemple :
 *
 * "fr"   -> "FR"
 * " FR " -> "FR"
 *
 * Renvoie null si le pays n'est pas autorisé.
 */
export function normalizeCheckoutCountry(
  value: unknown
): CheckoutCountryCode | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized =
    value.trim().toUpperCase();

  return isCheckoutCountry(normalized)
    ? normalized
    : null;
}

// ============================================================
// 6. VÉRIFICATION DE LA LANGUE
// ============================================================

export function isCheckoutCountryLocale(
  value: unknown
): value is CheckoutCountryLocale {
  return (
    typeof value === "string" &&
    LOCALE_SET.has(value)
  );
}

export function normalizeCheckoutCountryLocale(
  value: unknown
): CheckoutCountryLocale {
  if (typeof value !== "string") {
    return CHECKOUT_DEFAULT_LOCALE;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .split("-")[0];

  return isCheckoutCountryLocale(normalized)
    ? normalized
    : CHECKOUT_DEFAULT_LOCALE;
}

// ============================================================
// 7. OBTENIR LES INFORMATIONS D'UN PAYS
// ============================================================

export function getCheckoutCountry(
  code: unknown
): CheckoutCountryInfo | null {
  const country =
    normalizeCheckoutCountry(code);

  if (!country) {
    return null;
  }

  return CHECKOUT_COUNTRY_DATA[country];
}

// ============================================================
// 8. NOM DU PAYS
// ============================================================

export function getCheckoutCountryName(
  code: CheckoutCountryCode,
  locale: CheckoutCountryLocale = "fr"
): string {
  return CHECKOUT_COUNTRY_DATA[code]
    .names[locale];
}

// ============================================================
// 9. DRAPEAU DU PAYS
// ============================================================

export function getCheckoutCountryFlag(
  code: CheckoutCountryCode
): string {
  return CHECKOUT_COUNTRY_DATA[code].flag;
}

// ============================================================
// 10. INDICATIF TÉLÉPHONIQUE
// ============================================================

export function getCheckoutDialCode(
  code: CheckoutCountryCode
): string {
  return CHECKOUT_COUNTRY_DATA[code].dialCode;
}

/**
 * Permet de retrouver un pays à partir
 * d'un indicatif parmi les huit pays.
 *
 * Exemple :
 *
 * "+33" -> "FR"
 * "+49" -> "DE"
 */
export function getCheckoutCountryFromDialCode(
  dialCode: unknown
): CheckoutCountryCode | null {
  if (typeof dialCode !== "string") {
    return null;
  }

  const normalized = dialCode.trim();

  for (const code of CHECKOUT_COUNTRIES) {
    if (
      CHECKOUT_COUNTRY_DATA[code].dialCode ===
      normalized
    ) {
      return code;
    }
  }

  return null;
}

/**
 * Vérifie que l'indicatif correspond
 * à l'un des pays proposés.
 */
export function isCheckoutDialCode(
  value: unknown
): boolean {
  return (
    getCheckoutCountryFromDialCode(value) !==
    null
  );
}

// ============================================================
// 11. LISTE COMPLÈTE DES PAYS
// ============================================================

export function getCheckoutCountryList(
  locale: CheckoutCountryLocale = "fr"
): CheckoutCountryOption[] {
  return CHECKOUT_COUNTRIES.map((code) => {
    const country =
      CHECKOUT_COUNTRY_DATA[code];

    const name = country.names[locale];

    return {
      value: code,
      code,
      name,
      flag: country.flag,
      dialCode: country.dialCode,
      label: `${country.flag} ${name}`,
    };
  });
}

// ============================================================
// 12. OPTIONS POUR LE SELECT DE LIVRAISON
// ============================================================

export function getCheckoutCountryOptions(
  locale: CheckoutCountryLocale = "fr"
): Array<{
  value: CheckoutCountryCode;
  label: string;
}> {
  return getCheckoutCountryList(locale).map(
    (country) => ({
      value: country.code,
      label: country.label,
    })
  );
}

// ============================================================
// 13. OPTIONS POUR LE SELECT TÉLÉPHONIQUE
// ============================================================

export function getCheckoutPhoneCountryOptions(
  locale: CheckoutCountryLocale = "fr"
): CheckoutPhoneCountryOption[] {
  return CHECKOUT_COUNTRIES.map((code) => {
    const country =
      CHECKOUT_COUNTRY_DATA[code];

    const countryName =
      country.names[locale];

    return {
      value: code,
      country: code,
      countryName,
      dialCode: country.dialCode,
      flag: country.flag,
      label:
        `${country.flag} ${country.dialCode} — ${countryName}`,
    };
  });
}

/**
 * Version compacte pour les petits écrans.
 *
 * Exemple :
 *
 * 🇫🇷 +33
 * 🇩🇪 +49
 */
export function getCheckoutPhoneCompactOptions():
  Array<{
    value: CheckoutCountryCode;
    label: string;
  }> {
  return CHECKOUT_COUNTRIES.map(
    (code) => ({
      value: code,
      label:
        `${CHECKOUT_COUNTRY_DATA[code].flag} ` +
        CHECKOUT_COUNTRY_DATA[code].dialCode,
    })
  );
}

// ============================================================
// 14. VALEURS INITIALES DU FORMULAIRE
// ============================================================
//
// Le pays proposé peut venir du serveur via
// lib/checkout-geo.ts.
//
// Si la détection est indisponible :
// - country = ""
// - phoneCountry = ""
// - phoneDialCode = ""
//
// Aucun pays n'est inventé.
//
// ============================================================

export function getCheckoutCountryFormDefaults(
  suggestedCountry: unknown
): CheckoutCountryFormDefaults {
  const country =
    normalizeCheckoutCountry(
      suggestedCountry
    );

  if (!country) {
    return {
      country: "",
      phoneCountry: "",
      phoneDialCode: "",
    };
  }

  return {
    country,
    phoneCountry: country,
    phoneDialCode:
      getCheckoutDialCode(country),
  };
}

// ============================================================
// 15. CHANGEMENT DU PAYS DE LIVRAISON
// ============================================================
//
// Le changement du pays de livraison ne doit
// pas écraser un indicatif téléphonique choisi
// manuellement par le client.
//
// ============================================================

export function getCheckoutSuggestedDialCode(
  deliveryCountry: unknown
): string {
  const country =
    normalizeCheckoutCountry(
      deliveryCountry
    );

  return country
    ? getCheckoutDialCode(country)
    : "";
}

// ============================================================
// 16. EXEMPLES DE CODES POSTAUX
// ============================================================

export function getCheckoutPostalCodeExample(
  country: CheckoutCountryCode
): string {
  return CHECKOUT_COUNTRY_DATA[country]
    .postalCodeExample;
}

// ============================================================
// 17. NORMALISATION DES CODES POSTAUX
// ============================================================
//
// Chaque pays possède ses habitudes d'écriture.
//
// Les zéros initiaux sont toujours conservés.
//
// Pour les Pays-Bas :
// "1012ab" -> "1012 AB"
//
// ============================================================

export function normalizeCheckoutPostalCode(
  value: unknown,
  country: CheckoutCountryCode
): string {
  if (typeof value !== "string") {
    return "";
  }

  let postal = value
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();

  if (country === "NL") {
    const compact = postal.replace(
      /\s/g,
      ""
    );

    if (/^[1-9]\d{3}[A-Z]{2}$/.test(compact)) {
      postal =
        `${compact.slice(0, 4)} ` +
        compact.slice(4);
    }
  }

  return postal;
}

// ============================================================
// 18. FORMATS DES CODES POSTAUX
// ============================================================
//
// Vérification syntaxique uniquement.
//
// Elle ne garantit pas que :
// - le code postal existe réellement
// - la ville correspond au code
// - une adresse peut être livrée
//
// Ces vérifications peuvent nécessiter
// un service d'adresses.
//
// ============================================================

const POSTAL_PATTERNS: Record<
  CheckoutCountryCode,
  RegExp
> = {
  // Allemagne : cinq chiffres
  DE: /^\d{5}$/,

  // France : cinq chiffres
  FR: /^\d{5}$/,

  // Espagne : cinq chiffres
  ES: /^\d{5}$/,

  // Italie : cinq chiffres
  IT: /^\d{5}$/,

  // Suisse : quatre chiffres
  CH: /^\d{4}$/,

  // Autriche : quatre chiffres
  AT: /^\d{4}$/,

  // Pays-Bas : quatre chiffres + deux lettres
  NL: /^[1-9]\d{3}\s[A-Z]{2}$/,

  // Belgique : quatre chiffres
  BE: /^\d{4}$/,
};

// ============================================================
// 19. VALIDATION DU CODE POSTAL
// ============================================================

export function validateCheckoutPostalCode(
  value: unknown,
  country: CheckoutCountryCode
): CheckoutPostalCodeValidation {
  const normalized =
    normalizeCheckoutPostalCode(
      value,
      country
    );

  if (!normalized) {
    return {
      valid: false,
      normalized: "",
      error: "REQUIRED",
    };
  }

  const valid =
    POSTAL_PATTERNS[country].test(
      normalized
    );

  return {
    valid,
    normalized,
    error: valid
      ? null
      : "INVALID_FORMAT",
  };
}

/**
 * Version booléenne pratique.
 */
export function isValidCheckoutPostalCode(
  value: unknown,
  country: CheckoutCountryCode
): boolean {
  return validateCheckoutPostalCode(
    value,
    country
  ).valid;
}

// ============================================================
// 20. NORMALISATION DU TÉLÉPHONE SAISI
// ============================================================
//
// Le client peut saisir son numéro avec :
// - des espaces
// - des tirets
// - des parenthèses
//
// Cette fonction retire uniquement ces
// séparateurs visuels.
//
// Elle ne supprime PAS automatiquement
// un zéro initial, car les règles
// téléphoniques dépendent du pays.
//
// ============================================================

export function normalizeCheckoutPhoneInput(
  value: unknown
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/[\s().-]/g, "");
}

// ============================================================
// 21. VALIDATION PRÉLIMINAIRE DU TÉLÉPHONE
// ============================================================
//
// Cette validation contrôle seulement la forme.
//
// Pour une véritable validation internationale
// et la conversion en E.164, utiliser une
// bibliothèque spécialisée comme
// libphonenumber-js dans checkout-validation.ts.
//
// Éviter toute transformation naïve :
// certains numéros italiens commencent
// réellement par zéro en format international.
//
// ============================================================

export function isPlausibleCheckoutPhone(
  value: unknown
): boolean {
  const normalized =
    normalizeCheckoutPhoneInput(value);

  return /^\+?\d{4,15}$/.test(
    normalized
  );
}

// ============================================================
// 22. FORMAT INTERNATIONAL E.164
// ============================================================
//
// Cette fonction n'essaie pas de deviner
// un indicatif manquant.
//
// Elle vérifie uniquement une valeur
// déjà normalisée en E.164.
//
// ============================================================

export function isCheckoutPhoneE164(
  value: unknown
): boolean {
  return (
    typeof value === "string" &&
    /^\+[1-9]\d{1,14}$/.test(value)
  );
}

// ============================================================
// 23. PRÉPARER UN CHOIX MANUEL DE PAYS
// ============================================================
//
// Utiliser lorsqu'un client modifie le pays
// depuis le formulaire.
//
// Important : ne pas modifier automatiquement
// son indicatif déjà choisi.
//
// ============================================================

export function selectCheckoutDeliveryCountry(
  value: unknown
): CheckoutCountryCode | null {
  return normalizeCheckoutCountry(
    value
  );
}

// ============================================================
// 24. VÉRIFIER LA DESTINATION
// ============================================================

export function assertCheckoutCountry(
  value: unknown
): CheckoutCountryCode {
  const country =
    normalizeCheckoutCountry(
      value
    );

  if (!country) {
    throw new Error(
      "CHECKOUT_COUNTRY_NOT_SUPPORTED"
    );
  }

  return country;
}

// ============================================================
// 25. OBTENIR LE NOMBRE DE PAYS
// ============================================================

export function getCheckoutCountryCount():
  number {
  return CHECKOUT_COUNTRY_COUNT;
}

// ============================================================
// FIN — CYCLORIVA CHECKOUT COUNTRIES
// ============================================================
