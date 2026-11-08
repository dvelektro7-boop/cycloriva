import { promotionPrices } from "@/lib/promotions";

import productsData from "@/data/products.json";
import { productImageUrl } from "@/lib/product-images";
import { catalogText, catalogTranslation } from "@/lib/catalog-translations";
import {
  siteMessage,
  siteIntlLocales,
  isSiteLocale,
  type SiteLocale,
} from "@/lib/site-i18n";

// =====================================================
// CYCLORIVA — CATALOGUE CENTRAL
// =====================================================
//
// Produits, catégories, images, prix, descriptions,
// caractéristiques, traductions et accueil.
//
// Source produits : data/products.json
// Source interface : messages/*.json
//
// Compatible Next.js 16 / TypeScript.
// =====================================================

// =====================================================
// 1. LANGUES OFFICIELLES
// =====================================================

export const locales = [
  "fr",
  "en",
  "de",
  "it",
  "es",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export function isLocale(
  value: string
): value is Locale {
  return isSiteLocale(value);
}

// =====================================================
// 2. TYPES DES PRODUITS
// =====================================================

export type ProductTranslation = {
  name?: string;
  shortDescription?: string;
  description?: string;
};

export type Product = {
  id: string;
  name: string;

  price: number | null;
  regularPrice: number | null;
  salePrice: number | null;

  sku: string;

  categories: string[];
  images: string[];

  shortDescription: string;
  description: string;

  attributes: Record<string, string | undefined>;

  weightKg: number | null;

  dimensionsCm: {
    length: number | null;
    width: number | null;
    height: number | null;
  };

  stockAtExport: boolean;
  stockQuantityAtExport: number | null;
  stockConfirmed: boolean;

  translations: Record<string, ProductTranslation>;
};

export type CatalogCategory = {
  name: string;
  count: number;
  image: string | null;
};

export type LocalizedProduct = {
  name: string;
  shortDescription: string;
  description: string;
  translated: boolean;
};

// =====================================================
// 3. CORRECTION DES ENCODAGES
// =====================================================

const encodingReplacements: Array<[string, string]> = [
  ["Ã‰", "É"],
  ["Ãˆ", "È"],
  ["ÃŠ", "Ê"],
  ["Ã€", "À"],
  ["Ã‚", "Â"],
  ["Ãœ", "Ü"],
  ["Ã–", "Ö"],
  ["Ã„", "Ä"],

  ["Ã©", "é"],
  ["Ã¨", "è"],
  ["Ãª", "ê"],
  ["Ã«", "ë"],
  ["Ã ", "à"],
  ["Ã¢", "â"],
  ["Ã¤", "ä"],
  ["Ã§", "ç"],
  ["Ã´", "ô"],
  ["Ã¶", "ö"],
  ["Ã¹", "ù"],
  ["Ã»", "û"],
  ["Ã¼", "ü"],
  ["Ã®", "î"],
  ["Ã¯", "ï"],
  ["Ã±", "ñ"],

  ["Ã—", "×"],
  ["â€¦", "…"],
  ["â€™", "’"],
  ["â€œ", "“"],
  ["â€\u009d", "”"],
  ["â€“", "–"],
  ["â€”", "—"],
  ["â†\u0090", "←"],

  ["Â°", "°"],
  ["Â·", "·"],
  ["Â ", " "],
];

export function repairText(
  value: string | null | undefined
): string {
  if (!value) return "";

  let result = String(value);

  for (const [broken, correct] of encodingReplacements) {
    result = result.split(broken).join(correct);
  }

  return result;
}

// =====================================================
// 4. NORMALISATION DES DONNÉES
// =====================================================

function numberOrNull(value: unknown): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function stringValue(value: unknown): string {
  if (typeof value !== "string") return "";
  return repairText(value).trim();
}

function normalizeProduct(raw: Partial<Product>): Product {
  const attributes: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(
    raw.attributes ?? {}
  )) {
    const name = repairText(key).trim();

    if (!name) continue;

    attributes[name] =
      typeof value === "string"
        ? repairText(value)
        : undefined;
  }

  const translations: Record<
    string,
    ProductTranslation
  > = {};

  for (const [locale, translation] of Object.entries(
    raw.translations ?? {}
  )) {
    if (!translation) continue;

    translations[locale] = {
      name: stringValue(translation.name) || undefined,

      shortDescription:
        stringValue(translation.shortDescription) ||
        undefined,

      description:
        stringValue(translation.description) || undefined,
    };
  }

  const categories = Array.isArray(raw.categories)
    ? Array.from(
        new Set(
          raw.categories
            .filter(
              (value): value is string =>
                typeof value === "string"
            )
            .map((value) => repairText(value).trim())
            .filter(Boolean)
        )
      )
    : [];

  const images = Array.isArray(raw.images)
    ? Array.from(
        new Set(
          raw.images
            .filter(
              (value): value is string =>
                typeof value === "string"
            )
            .map((value) => productImageUrl(value.trim()))
            .filter(Boolean)
        )
      )
    : [];

  return {
    id: String(raw.id ?? ""),

    name: stringValue(raw.name),

    ...promotionPrices(numberOrNull(raw.price), numberOrNull(raw.regularPrice), numberOrNull(raw.salePrice)),

    sku: stringValue(raw.sku),

    categories,
    images,

    shortDescription: stringValue(
      raw.shortDescription
    ),

    description: stringValue(raw.description),

    attributes,

    weightKg: numberOrNull(raw.weightKg),

    dimensionsCm: {
      length: numberOrNull(raw.dimensionsCm?.length),
      width: numberOrNull(raw.dimensionsCm?.width),
      height: numberOrNull(raw.dimensionsCm?.height),
    },

    stockAtExport: raw.stockAtExport === true,

    stockQuantityAtExport: numberOrNull(
      raw.stockQuantityAtExport
    ),

    stockConfirmed: raw.stockConfirmed === true,

    translations,
  };
}

// =====================================================
// 5. LECTURE DU CATALOGUE
// =====================================================

export const allProducts: Product[] = (
  productsData as Partial<Product>[]
).map(normalizeProduct);

export const totalProducts = allProducts.length;

// =====================================================
// 6. RECHERCHE DE PRODUITS
// =====================================================

export function getProductById(
  id: string
): Product | undefined {
  return allProducts.find(
    (product) => product.id === String(id)
  );
}

export function getProductsByCategory(
  category: string
): Product[] {
  return allProducts.filter((product) =>
    product.categories.includes(category)
  );
}

export function searchProducts(
  query: string,
  locale: Locale = "fr"
): Product[] {
  const term = repairText(query)
    .trim()
    .toLocaleLowerCase();

  if (!term) return allProducts;

  return allProducts.filter((product) => {
    const localized = localizedProduct(product, locale);

    const searchable = [
      product.name,
      localized.name,
      stripHtml(product.shortDescription),
      stripHtml(product.description),
      stripHtml(localized.shortDescription),
      stripHtml(localized.description),
      product.sku,
      ...product.categories,
      ...Object.values(product.attributes),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();

    return searchable.includes(term);
  });
}

// =====================================================
// 7. CATÉGORIES DU CATALOGUE
// =====================================================

export function getCatalogCategories(): CatalogCategory[] {
  const categoryMap = new Map<
    string,
    {
      count: number;
      image: string | null;
    }
  >();

  for (const product of allProducts) {
    for (const category of product.categories) {
      const current = categoryMap.get(category);

      if (current) {
        current.count += 1;

        if (!current.image && product.images[0]) {
          current.image = product.images[0];
        }
      } else {
        categoryMap.set(category, {
          count: 1,
          image: product.images[0] ?? null,
        });
      }
    }
  }

  return Array.from(categoryMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      image: data.image,
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, "fr")
    );
}

export function getCategoryNames(): string[] {
  return getCatalogCategories().map(
    (category) => category.name
  );
}

export function getCategoryCount(
  name: string
): number {
  return (
    getCatalogCategories().find(
      (category) => category.name === name
    )?.count ?? 0
  );
}

// =====================================================
// 8. CATÉGORIES POUR LA PAGE D'ACCUEIL
// =====================================================

export function getHomeCategories(
  limit = 5
): CatalogCategory[] {
  const categories = getCatalogCategories();

  const keywords = [
    ["électrique", "electric", "e-bike"],
    ["vtt", "mountain"],
    ["cargo"],
    ["ville", "city", "urbain"],
    ["accessoire", "accessory", "équipement"],
  ];

  const selected: CatalogCategory[] = [];

  for (const group of keywords) {
    const category = categories
      .filter(
        (item) =>
          !selected.some(
            (selectedItem) =>
              selectedItem.name === item.name
          )
      )
      .filter((item) =>
        group.some((keyword) =>
          item.name.toLocaleLowerCase().includes(keyword)
        )
      )
      .sort((a, b) => b.count - a.count)[0];

    if (category) {
      selected.push(category);
    }
  }

  for (const category of [...categories].sort(
    (a, b) => b.count - a.count
  )) {
    if (selected.length >= limit) break;

    if (
      !selected.some(
        (item) => item.name === category.name
      )
    ) {
      selected.push(category);
    }
  }

  return selected.slice(0, Math.max(0, limit));
}

// =====================================================
// 9. PRODUITS POUR LA PAGE D'ACCUEIL
// =====================================================

export function getHomeProducts(
  limit = 8
): Product[] {
  return allProducts
    .filter(
      (product) =>
        currentPrice(product) !== null &&
        product.name.length > 0 &&
        product.images.length > 0
    )
    .slice(0, Math.max(0, limit));
}

export function getFeaturedProducts(
  limit = 8
): Product[] {
  return getHomeProducts(limit);
}

export function getProductsWithImages(
  limit?: number
): Product[] {
  const products = allProducts.filter(
    (product) => product.images.length > 0
  );

  if (limit === undefined) return products;

  return products.slice(0, Math.max(0, limit));
}

// =====================================================
// 10. TRADUCTIONS DU CATALOGUE
// =====================================================
//
// Priorité aux fichiers messages/*.json.
//
// Les traductions historiques restent disponibles
// si une clé n'existe pas encore dans les JSON.
//
// Cela évite de casser les composants existants.
// =====================================================

const catalogFallbackMessages = {
  fr: {
    home: "Boutique",
    products: "Produits",
    search: "Rechercher un produit…",
    all: "Toutes les catégories",
    result: "produit(s)",
    details: "Voir le produit",
    back: "Retour au catalogue",
    description: "Description",
    specifications: "Caractéristiques",
    images: "Photos",
    priceMissing: "Prix à confirmer",
    stock: "En stock",
    available: "Disponible",
    unavailable: "Indisponible",
    warning: "Catalogue en préparation.",
    translation:
      "Cette description est actuellement disponible en français.",
    category: "Catégorie",
    none: "Aucun produit trouvé",
    imageMissing: "Image indisponible",
    reference: "Référence",
    price: "Prix",
  },

  en: {
    home: "Shop",
    products: "Products",
    search: "Search products…",
    all: "All categories",
    result: "product(s)",
    details: "View product",
    back: "Back to catalogue",
    description: "Description",
    specifications: "Specifications",
    images: "Images",
    priceMissing: "Price to confirm",
    stock: "In stock",
    available: "Available",
    unavailable: "Unavailable",
    warning: "Catalogue in preparation.",
    translation:
      "This description is currently available in French.",
    category: "Category",
    none: "No products found",
    imageMissing: "Image unavailable",
    reference: "Reference",
    price: "Price",
  },

  de: {
    home: "Shop",
    products: "Produkte",
    search: "Produkte suchen…",
    all: "Alle Kategorien",
    result: "Produkt(e)",
    details: "Produkt ansehen",
    back: "Zurück zum Katalog",
    description: "Beschreibung",
    specifications: "Eigenschaften",
    images: "Bilder",
    priceMissing: "Preis zu bestätigen",
    stock: "Auf Lager",
    available: "Verfügbar",
    unavailable: "Nicht verfügbar",
    warning: "Katalog in Vorbereitung.",
    translation:
      "Diese Beschreibung ist derzeit auf Französisch verfügbar.",
    category: "Kategorie",
    none: "Keine Produkte gefunden",
    imageMissing: "Bild nicht verfügbar",
    reference: "Referenz",
    price: "Preis",
  },

  it: {
    home: "Negozio",
    products: "Prodotti",
    search: "Cerca prodotti…",
    all: "Tutte le categorie",
    result: "prodotto/i",
    details: "Vedi prodotto",
    back: "Torna al catalogo",
    description: "Descrizione",
    specifications: "Specifiche",
    images: "Immagini",
    priceMissing: "Prezzo da confermare",
    stock: "Disponibile",
    available: "Disponibile",
    unavailable: "Non disponibile",
    warning: "Catalogo in preparazione.",
    translation:
      "Questa descrizione è attualmente disponibile in francese.",
    category: "Categoria",
    none: "Nessun prodotto trovato",
    imageMissing: "Immagine non disponibile",
    reference: "Riferimento",
    price: "Prezzo",
  },

  es: {
    home: "Tienda",
    products: "Productos",
    search: "Buscar productos…",
    all: "Todas las categorías",
    result: "producto(s)",
    details: "Ver producto",
    back: "Volver al catálogo",
    description: "Descripción",
    specifications: "Características",
    images: "Imágenes",
    priceMissing: "Precio por confirmar",
    stock: "En stock",
    available: "Disponible",
    unavailable: "No disponible",
    warning: "Catálogo en preparación.",
    translation:
      "Esta descripción está actualmente disponible en francés.",
    category: "Categoría",
    none: "No se encontraron productos",
    imageMissing: "Imagen no disponible",
    reference: "Referencia",
    price: "Precio",
  },
} as const;

export type MessageKey =
  keyof typeof catalogFallbackMessages.fr;

/*
 * Correspondances entre les anciennes clés du
 * catalogue et les chemins des fichiers JSON.
 *
 * Une correspondance n'est utilisée que si
 * elle existe réellement dans le dictionnaire.
 */
const catalogMessagePaths: Partial<
  Record<MessageKey, string>
> = {
  home: "footer.store",
  products: "catalog.products",
  search: "catalog.search",
  all: "catalog.allCategories",
  result: "catalog.results",
  details: "catalog.viewProduct",
  back: "catalog.back",
  description: "product.description",
  specifications: "product.specifications",
  images: "product.images",
  priceMissing: "product.priceMissing",
  stock: "product.inStock",
  available: "product.available",
  unavailable: "product.unavailable",
  warning: "catalog.warning",
  translation: "product.translationNotice",
  category: "catalog.category",
  none: "catalog.noProducts",
  imageMissing: "product.imageMissing",
  reference: "product.reference",
  price: "product.price",
};

export function t(
  locale: Locale,
  key: MessageKey
): string {
  const path = catalogMessagePaths[key];

  if (path) {
    const translated = siteMessage(
      locale as SiteLocale,
      path
    );

    // siteMessage renvoie le chemin si la clé manque.
    if (translated !== path) {
      return translated;
    }
  }

  return catalogFallbackMessages[locale][key];
}

// =====================================================
// 11. GESTION DES PRIX
// =====================================================

export function currentPrice(
  product: Product
): number | null {
  return (
    product.salePrice ??
    product.price ??
    product.regularPrice ??
    null
  );
}

export function formatPrice(
  price: number | null,
  locale: Locale
): string {
  if (
    price === null ||
    !Number.isFinite(price)
  ) {
    return t(locale, "priceMissing");
  }

  return new Intl.NumberFormat(
    siteIntlLocales[locale],
    {
      style: "currency",
      currency: "EUR",
    }
  ).format(price);
}

// =====================================================
// 12. NETTOYAGE DES DESCRIPTIONS HTML
// =====================================================

const htmlEntities: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  euro: "€",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
};

function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(#(?:x[0-9a-f]+|[0-9]+)|[a-z]+);/gi,
    (match, entity: string) => {
      const normalized = entity.toLowerCase();

      if (normalized.startsWith("#")) {
        const isHex = normalized.startsWith("#x");

        const number = Number.parseInt(
          normalized.slice(isHex ? 2 : 1),
          isHex ? 16 : 10
        );

        if (
          Number.isInteger(number) &&
          number > 0 &&
          number <= 0x10ffff &&
          !(number >= 0xd800 && number <= 0xdfff)
        ) {
          return String.fromCodePoint(number);
        }

        return match;
      }

      return htmlEntities[normalized] ?? match;
    }
  );
}

export function stripHtml(
  value: string | null | undefined
): string {
  if (!value) return "";

  const cleaned = repairText(value)
    .replace(
      /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,
      " "
    )
    .replace(
      /<style\b[^>]*>[\s\S]*?<\/style\s*>/gi,
      " "
    )
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(?:p|div|li|h[1-6])\s*>/gi, "\n")
    .replace(/<[^>]*>/g, " ");

  return decodeHtmlEntities(cleaned)
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// =====================================================
// 13. TRADUCTION DES FICHES PRODUITS
// =====================================================

export function localizedProduct(
  product: Product,
  locale: Locale
): LocalizedProduct {
  const translation = product.translations[locale];

  const translatedName = repairText(
    translation?.name || catalogTranslation(product.name, locale)
  ).trim();

  const translatedShort = repairText(
    translation?.shortDescription || catalogTranslation(product.shortDescription, locale)
  ).trim();

  const translatedDescription = repairText(
    translation?.description || catalogTranslation(product.description, locale)
  ).trim();

  const name =
    translatedName ||
    product.name ||
    `Produit ${product.id}`;

  const shortDescription =
    translatedShort || product.shortDescription;

  const description =
    translatedDescription || product.description;

  const translated =
    locale === "fr" ||
    Boolean(
      translatedName &&
      (translatedDescription || !product.description) &&
      (translatedShort || !product.shortDescription)
    );

  return {
    name,
    shortDescription,
    description,
    translated,
  };
}

// =====================================================
// 14. CARACTÉRISTIQUES TECHNIQUES
// =====================================================

const specificationLabels = {
  fr: {
    reference: "Référence",
    sku: "UGS",
    weight: "Poids",
    dimensions: "Dimensions (L × l × H)",
  },

  en: {
    reference: "Reference",
    sku: "SKU",
    weight: "Weight",
    dimensions: "Dimensions (L × W × H)",
  },

  de: {
    reference: "Referenz",
    sku: "Artikelnummer",
    weight: "Gewicht",
    dimensions: "Maße (L × B × H)",
  },

  it: {
    reference: "Riferimento",
    sku: "Codice articolo",
    weight: "Peso",
    dimensions: "Dimensioni (L × l × A)",
  },

  es: {
    reference: "Referencia",
    sku: "SKU",
    weight: "Peso",
    dimensions: "Dimensiones (L × A × H)",
  },
} as const;

export function productSpecifications(
  product: Product,
  locale: Locale
): [string, string][] {
  const labels = specificationLabels[locale];

  const entries: [string, string][] = [
    [labels.reference, product.id],
  ];

  if (product.sku) {
    entries.push([labels.sku, product.sku]);
  }

  if (product.weightKg !== null) {
    entries.push([
      labels.weight,
      `${product.weightKg} kg`,
    ]);
  }

  const { length, width, height } =
    product.dimensionsCm;

  if (
    length !== null ||
    width !== null ||
    height !== null
  ) {
    entries.push([
      labels.dimensions,
      `${length ?? "—"} × ${width ?? "—"} × ${
        height ?? "—"
      } cm`,
    ]);
  }

  for (const [name, value] of Object.entries(
    product.attributes
  )) {
    if (value) {
      entries.push([
        catalogText(repairText(name), locale),
        catalogText(repairText(value), locale),
      ]);
    }
  }

  return entries;
}

// =====================================================
// 15. STATISTIQUES DU CATALOGUE
// =====================================================

export function getCatalogStats() {
  const productsWithImages = allProducts.filter(
    (product) => product.images.length > 0
  );

  const productsWithPrices = allProducts.filter(
    (product) => currentPrice(product) !== null
  );

  const confirmedProducts = allProducts.filter(
    (product) => product.stockConfirmed
  );

  return {
    totalProducts: allProducts.length,

    totalCategories: getCatalogCategories().length,

    productsWithImages: productsWithImages.length,

    productsWithPrices: productsWithPrices.length,

    confirmedProducts: confirmedProducts.length,

    unconfirmedProducts:
      allProducts.length - confirmedProducts.length,
  };
}
