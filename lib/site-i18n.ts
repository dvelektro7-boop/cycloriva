
/**
 * =========================================================
 * CYCLORIVA — INTERNATIONALISATION DU SITE PUBLIC
 * =========================================================
 *
 * Langues officielles :
 * - Français  (fr)
 * - Anglais   (en)
 * - Allemand  (de)
 * - Italien   (it)
 * - Espagnol  (es)
 *
 * Fonctions principales :
 * - Validation des langues
 * - Résolution de la langue active
 * - Traduction des éléments communs
 * - Navigation multilingue
 * - Conservation des URLs
 *
 * Compatible avec :
 * - SiteHeader.tsx
 * - SiteFooter.tsx
 * - SiteChrome.tsx
 * - Next.js 16
 * - TypeScript
 *
 * Ce module ne dépend pas du navigateur.
 * Il fonctionne côté serveur et côté client.
 *
 * =========================================================
 */

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

export type SiteLocale =
  (typeof siteLocales)[number];

export const defaultSiteLocale: SiteLocale = "fr";

// =========================================================
// 2. NOMS DES LANGUES
// =========================================================

export const siteLocaleNames: Record<
  SiteLocale,
  string
> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  it: "Italiano",
  es: "Español",
};

// Codes régionaux utiles pour Intl.
export const siteIntlLocales: Record<
  SiteLocale,
  string
> = {
  fr: "fr-FR",
  en: "en-IE",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
};

// =========================================================
// 3. VALIDATION DES LANGUES
// =========================================================

export function isSiteLocale(
  value: unknown
): value is SiteLocale {
  return (
    typeof value === "string" &&
    siteLocales.some(
      (locale) => locale === value
    )
  );
}

// =========================================================
// 4. RÉSOLUTION DE LA LANGUE
// =========================================================

export function resolveLocale(
  value?: string | null
): SiteLocale {
  if (!value) {
    return defaultSiteLocale;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .split("-")[0];

  if (isSiteLocale(normalized)) {
    return normalized;
  }

  return defaultSiteLocale;
}

// =========================================================
// 5. DICTIONNAIRE PRINCIPAL
// =========================================================

const translations = {
  // =======================================================
  // FRANÇAIS
  // =======================================================

  fr: {
    search:
      "Rechercher un produit, une marque, un accessoire...",
    searchButton: "Rechercher",

    home: "Accueil",
    electric: "Vélos électriques",
    mtb: "VTT",
    cargo: "Vélos cargo",
    city: "Vélos de ville",
    accessories: "Accessoires",
    brands: "Marques",
    promotions: "Promotions",
    contact: "Contact",

    menu: "Menu",
    close: "Fermer le menu",
    account: "Compte",
    favorites: "Favoris",
    cart: "Panier",
    languages: "Langue du site",
    soon: "Bientôt disponible",

    tagline:
      "Votre spécialiste vélo et e-mobilité en Europe.",

    store: "Boutique",
    information: "Informations",
    help: "Aide",
    networks: "Réseaux sociaux",

    newsletter:
      "Inscrivez-vous à la newsletter",
    newsletterTitle: "Restez informé !",
    newsletterDescription:
      "Recevez nos nouveautés, offres exclusives et conseils vélo directement par e-mail.",
    email: "Votre adresse e-mail",
    subscribe: "S'inscrire",
    newsletterPending:
      "L'inscription sera disponible après la connexion du service e-mail.",
    newsletterConsent:
      "J'accepte de recevoir les offres et actualités CYCLORIVA (je peux me désinscrire à tout moment).",
    newsletterNeedConsent:
      "Veuillez accepter l'inscription à la newsletter.",

    payment: "Paiement sécurisé",
    payments: "Paiements sécurisés",
    paymentPreview:
      "Modes de paiement présentés à titre indicatif.",

    about: "À propos de CYCLORIVA",
    guides: "Conseils & guides",
    customers: "Service client",
    delivery: "Livraison",
    returns: "Retours & remboursements",
    faq: "FAQ",
    warranty: "Garantie",
    track: "Suivi de commande",

    legal: "Mentions légales",
    privacy: "Politique de confidentialité",
    terms: "Conditions générales de vente",
    cookies: "Gestion des cookies",

    rights: "Tous droits réservés.",
    planned: "Page en préparation",
  },

  // =======================================================
  // ANGLAIS
  // =======================================================

  en: {
    search:
      "Search for a product, brand or accessory...",
    searchButton: "Search",

    home: "Home",
    electric: "Electric bikes",
    mtb: "Mountain bikes",
    cargo: "Cargo bikes",
    city: "City bikes",
    accessories: "Accessories",
    brands: "Brands",
    promotions: "Offers",
    contact: "Contact",

    menu: "Menu",
    close: "Close menu",
    account: "Account",
    favorites: "Wishlist",
    cart: "Cart",
    languages: "Site language",
    soon: "Coming soon",

    tagline:
      "Your cycling and e-mobility specialist in Europe.",

    store: "Shop",
    information: "Information",
    help: "Help",
    networks: "Social media",

    newsletter:
      "Subscribe to our newsletter",
    newsletterTitle: "Stay informed!",
    newsletterDescription:
      "Get product news, exclusive offers and cycling tips by email.",
    email: "Your email address",
    subscribe: "Subscribe",
    newsletterPending:
      "Subscription will be available once the email service is connected.",
    newsletterConsent:
      "I agree to receive CYCLORIVA news and offers (I can unsubscribe at any time).",
    newsletterNeedConsent:
      "Please agree to receive the newsletter.",

    payment: "Secure payment",
    payments: "Secure payments",
    paymentPreview:
      "Payment methods shown for illustration only.",

    about: "About CYCLORIVA",
    guides: "Tips & guides",
    customers: "Customer service",
    delivery: "Delivery",
    returns: "Returns & refunds",
    faq: "FAQ",
    warranty: "Warranty",
    track: "Track order",

    legal: "Legal notice",
    privacy: "Privacy policy",
    terms: "Terms and conditions",
    cookies: "Cookie settings",

    rights: "All rights reserved.",
    planned: "Page coming soon",
  },

  // =======================================================
  // ALLEMAND
  // =======================================================

  de: {
    search:
      "Produkt, Marke oder Zubehör suchen...",
    searchButton: "Suchen",

    home: "Startseite",
    electric: "E-Bikes",
    mtb: "Mountainbikes",
    cargo: "Lastenräder",
    city: "Citybikes",
    accessories: "Zubehör",
    brands: "Marken",
    promotions: "Angebote",
    contact: "Kontakt",

    menu: "Menü",
    close: "Menü schließen",
    account: "Konto",
    favorites: "Merkliste",
    cart: "Warenkorb",
    languages: "Sprache der Website",
    soon: "Demnächst verfügbar",

    tagline:
      "Ihr Spezialist für Fahrräder und E-Mobilität in Europa.",

    store: "Shop",
    information: "Informationen",
    help: "Hilfe",
    networks: "Soziale Medien",

    newsletter: "Newsletter abonnieren",
    newsletterTitle:
      "Bleiben Sie informiert!",
    newsletterDescription:
      "Neuheiten, exklusive Angebote und Fahrradtipps per E-Mail.",
    email: "Ihre E-Mail-Adresse",
    subscribe: "Abonnieren",
    newsletterPending:
      "Die Anmeldung ist verfügbar, sobald der E-Mail-Dienst eingerichtet ist.",
    newsletterConsent:
      "Ich möchte Neuigkeiten und Angebote von CYCLORIVA erhalten (jederzeit abbestellbar).",
    newsletterNeedConsent:
      "Bitte stimmen Sie dem Newsletter zu.",

    payment: "Sicher bezahlen",
    payments: "Sichere Zahlungen",
    paymentPreview:
      "Zahlungsarten nur zur Veranschaulichung.",

    about: "Über CYCLORIVA",
    guides: "Tipps & Ratgeber",
    customers: "Kundenservice",
    delivery: "Lieferung",
    returns: "Rückgabe & Erstattung",
    faq: "FAQ",
    warranty: "Garantie",
    track: "Bestellung verfolgen",

    legal: "Impressum",
    privacy: "Datenschutz",
    terms: "AGB",
    cookies: "Cookie-Einstellungen",

    rights: "Alle Rechte vorbehalten.",
    planned: "Seite in Vorbereitung",
  },

  // =======================================================
  // ITALIEN
  // =======================================================

  it: {
    search:
      "Cerca un prodotto, una marca o un accessorio...",
    searchButton: "Cerca",

    home: "Home",
    electric: "Bici elettriche",
    mtb: "Mountain bike",
    cargo: "Bici cargo",
    city: "Bici da città",
    accessories: "Accessori",
    brands: "Marche",
    promotions: "Promozioni",
    contact: "Contatti",

    menu: "Menu",
    close: "Chiudi menu",
    account: "Account",
    favorites: "Preferiti",
    cart: "Carrello",
    languages: "Lingua del sito",
    soon: "Prossimamente",

    tagline:
      "Il tuo specialista di biciclette e mobilità elettrica in Europa.",

    store: "Negozio",
    information: "Informazioni",
    help: "Assistenza",
    networks: "Social network",

    newsletter:
      "Iscriviti alla newsletter",
    newsletterTitle: "Resta aggiornato!",
    newsletterDescription:
      "Ricevi novità, offerte esclusive e consigli sulle bici via e-mail.",
    email: "Il tuo indirizzo e-mail",
    subscribe: "Iscriviti",
    newsletterPending:
      "L'iscrizione sarà disponibile dopo l'attivazione del servizio e-mail.",
    newsletterConsent:
      "Accetto di ricevere notizie e offerte CYCLORIVA (posso annullare l'iscrizione in qualsiasi momento).",
    newsletterNeedConsent:
      "Accetta l'iscrizione alla newsletter.",

    payment: "Pagamento sicuro",
    payments: "Pagamenti sicuri",
    paymentPreview:
      "Metodi di pagamento mostrati a titolo indicativo.",

    about: "Chi è CYCLORIVA",
    guides: "Consigli e guide",
    customers: "Servizio clienti",
    delivery: "Consegna",
    returns: "Resi e rimborsi",
    faq: "FAQ",
    warranty: "Garanzia",
    track: "Traccia ordine",

    legal: "Note legali",
    privacy: "Informativa privacy",
    terms: "Condizioni di vendita",
    cookies: "Gestione cookie",

    rights: "Tutti i diritti riservati.",
    planned: "Pagina in preparazione",
  },

  // =======================================================
  // ESPAGNOL
  // =======================================================

  es: {
    search:
      "Buscar un producto, una marca o un accesorio...",
    searchButton: "Buscar",

    home: "Inicio",
    electric: "Bicicletas eléctricas",
    mtb: "Bicicletas de montaña",
    cargo: "Bicicletas de carga",
    city: "Bicicletas urbanas",
    accessories: "Accesorios",
    brands: "Marcas",
    promotions: "Ofertas",
    contact: "Contacto",

    menu: "Menú",
    close: "Cerrar menú",
    account: "Cuenta",
    favorites: "Favoritos",
    cart: "Carrito",
    languages: "Idioma del sitio",
    soon: "Próximamente",

    tagline:
      "Tu especialista en bicicletas y movilidad eléctrica en Europa.",

    store: "Tienda",
    information: "Información",
    help: "Ayuda",
    networks: "Redes sociales",

    newsletter:
      "Suscríbete al boletín",
    newsletterTitle:
      "¡Mantente informado!",
    newsletterDescription:
      "Recibe novedades, ofertas exclusivas y consejos de ciclismo por correo.",
    email: "Tu dirección de correo",
    subscribe: "Suscribirse",
    newsletterPending:
      "La suscripción estará disponible cuando se conecte el servicio de correo.",
    newsletterConsent:
      "Acepto recibir novedades y ofertas de CYCLORIVA (puedo darme de baja cuando quiera).",
    newsletterNeedConsent:
      "Acepta recibir el boletín.",

    payment: "Pago seguro",
    payments: "Pagos seguros",
    paymentPreview:
      "Métodos de pago mostrados a título informativo.",

    about: "Sobre CYCLORIVA",
    guides: "Consejos y guías",
    customers: "Atención al cliente",
    delivery: "Entrega",
    returns: "Devoluciones y reembolsos",
    faq: "Preguntas frecuentes",
    warranty: "Garantía",
    track: "Seguimiento de pedidos",

    legal: "Aviso legal",
    privacy: "Política de privacidad",
    terms: "Condiciones de venta",
    cookies: "Configuración de cookies",

    rights: "Todos los derechos reservados.",
    planned: "Página en preparación",
  },
} as const;

// =========================================================
// 6. TYPES ET VÉRIFICATION DES TRADUCTIONS
// =========================================================

export type SiteTextKey =
  keyof typeof translations.fr;

/**
 * TypeScript vérifie que toutes les langues
 * contiennent les mêmes clés que le français.
 */
const validatedTranslations: Record<
  SiteLocale,
  Record<SiteTextKey, string>
> = translations;

// =========================================================
// 7. FONCTION DE TRADUCTION
// =========================================================

export function siteText(
  locale: SiteLocale,
  key: SiteTextKey
): string {
  return validatedTranslations[locale][key];
}

// =========================================================
// 8. FONCTION DE TRADUCTION SÉCURISÉE
// =========================================================

/**
 * Accepte une langue provenant d'une URL ou
 * d'une entrée externe.
 */
export function getSiteText(
  locale: string | null | undefined,
  key: SiteTextKey
): string {
  const validLocale = resolveLocale(locale);

  return siteText(validLocale, key);
}

// =========================================================
// 9. NOM LISIBLE D'UNE LANGUE
// =========================================================

export function getSiteLocaleName(
  locale: SiteLocale
): string {
  return siteLocaleNames[locale];
}

// =========================================================
// 10. FORMAT LOCAL
// =========================================================

export function getSiteIntlLocale(
  locale: SiteLocale
): string {
  return siteIntlLocales[locale];
}

// =========================================================
// 11. LECTURE DE LA LANGUE DANS L'URL
// =========================================================

/**
 * Exemples :
 * /fr/produits -> fr
 * /de/contact  -> de
 * /es          -> es
 */
export function getLocaleFromPathname(
  pathname: string
): SiteLocale {
  const path = pathname.split("?")[0].split("#")[0];
  const locale = path.split("/")[1];

  return resolveLocale(locale);
}

// =========================================================
// 12. CHANGEMENT DE LANGUE D'UNE URL
// =========================================================

/**
 * Exemples :
 *
 * /fr/produits
 * -> /de/produits
 *
 * /fr/produits/123?q=velo
 * -> /es/produits/123?q=velo
 *
 * /contact
 * -> /it/contact
 *
 * Les paramètres de recherche et ancres
 * sont conservés.
 */
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

  const nextPath = segments.join("/");

  return `${nextPath}${query}${hash}`;
}

// =========================================================
// 13. CRÉATION DE LIENS MULTILINGUES
// =========================================================

/**
 * Permet aux futures pages de générer
 * facilement des liens localisés.
 *
 * Exemple :
 *
 * sitePath("fr", "/produits")
 * -> /fr/produits
 *
 * sitePath("de", "/contact")
 * -> /de/contact
 */
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
