
/**
 * ============================================================
 * CYCLORIVA — MOTEUR DU CATALOGUE PRODUITS
 * ============================================================
 *
 * Next.js 16 — TypeScript
 *
 * Source : data/products.json, via lib/catalog.ts
 *
 * Responsabilités :
 * - Recherche textuelle
 * - Catégories
 * - Marques explicitement renseignées
 * - Prix minimum et maximum
 * - Disponibilité
 * - Tri
 * - Compteurs de filtres
 * - Pagination
 * - Paramètres d'URL
 *
 * Aucun produit ni chiffre fictif.
 * Aucune dépendance React.
 * Aucun accès à window ou document.
 * ============================================================
 */

import type { Product } from "@/lib/catalog";
import { localizedProduct } from "@/lib/catalog";
import { catalogText } from "@/lib/catalog-translations";
import type { SiteLocale } from "@/lib/site-i18n";

import type {
  CatalogFilterOption,
  CatalogFilterValues,
  CatalogPriceBounds,
} from "@/components/catalog/CatalogSidebar";

import type {
  CatalogMobileCategoryOption,
  CatalogMobileCategoryKey,
} from "@/components/catalog/CatalogMobileCategories";

import type {
  CatalogSort,
  CatalogView,
} from "@/components/catalog/CatalogToolbar";

// ============================================================
// 1. CONFIGURATION
// ============================================================

export const CATALOG_PAGE_SIZE = 12;

export const CATALOG_DEFAULT_SORT: CatalogSort = "relevance";

export const CATALOG_DEFAULT_VIEW: CatalogView = "grid";

export const CATALOG_DEFAULT_FILTERS: CatalogFilterValues = {
  categories: [],
  brands: [],
  availability: [],
  minPrice: null,
  maxPrice: null,
};

export const CATALOG_CATEGORY_KEYS = [
  "electric",
  "mtb",
  "cargo",
  "city",
  "accessories",
] as const;

export const CATALOG_AVAILABILITY = {
  IN_STOCK: "in-stock",
  OUT_OF_STOCK: "out-of-stock",
  UNKNOWN: "unknown",
} as const;

export type CatalogAvailability =
  (typeof CATALOG_AVAILABILITY)[keyof typeof CATALOG_AVAILABILITY];

export type CatalogQuery = {
  search: string;
  filters: CatalogFilterValues;
  sort: CatalogSort;
  view: CatalogView;
  page: number;
};

// ============================================================
// 2. UTILITAIRES GÉNÉRAUX
// ============================================================

function cleanText(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function normalizeText(value: unknown): string {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ");
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function safeNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0
      ? value
      : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value
    .replace(/\s/g, "")
    .replace(",", ".");

  if (!cleaned) {
    return null;
  }

  const parsed = Number(cleaned);

  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : null;
}

function safeInteger(value: unknown, fallback = 1): number {
  const parsed = Number(value);

  return Number.isSafeInteger(parsed) && parsed >= 1
    ? parsed
    : fallback;
}

function safeLocale(locale: SiteLocale): SiteLocale {
  return ["fr", "en", "de", "it", "es"].includes(locale)
    ? locale
    : "fr";
}

// ============================================================
// 3. PRIX RÉEL DU PRODUIT
// ============================================================

/**
 * Utilise la même priorité que CatalogProductCard :
 * promotion valide, puis prix principal.
 *
 * Aucun prix de remplacement n'est inventé.
 */
export function getCatalogProductPrice(
  product: Product
): number | null {
  const price = safeNumber(product.price);
  const sale = safeNumber(product.salePrice);
  const regular = safeNumber(product.regularPrice);

  if (
    sale !== null &&
    regular !== null &&
    regular > 0 &&
    sale < regular
  ) {
    return sale;
  }

  return price ?? sale ?? regular;
}

// ============================================================
// 4. IDENTIFICATION DES CATÉGORIES
// ============================================================

/**
 * Les catégories proviennent exclusivement du produit.
 *
 * Les libellés sont reconnus en FR/EN/DE/IT/ES.
 * Les catégories non reconnues ne sont pas supprimées :
 * elles restent accessibles par leur libellé original.
 */

export function getCatalogCategoryKey(
  category: string
): CatalogMobileCategoryKey | null {
  const value = normalizeText(category);

  if (!value) return null;

  if (
    /accessoir|accessor|zubehor|accesori|accesorio|helm|casque|helmet|casco|lighting|eclairage|beleuchtung|lock|antivol|sacoche|bagage|pannier/.test(value)
  ) {
    return "accessories";
  }

  if (
    /cargo|lastenrad|lastenfahrrad|carga|carico|transportbike/.test(value)
  ) {
    return "cargo";
  }

  if (
    /vtt|mountain|mtb|tout.terrain|all.mountain|enduro|downhill/.test(value)
  ) {
    return "mtb";
  }

  if (
    /ville|city|urban|stadt|citta|ciudad|trekking|commuter/.test(value)
  ) {
    return "city";
  }

  if (
    /electri|elektr|electric|e.bike|ebike|pedelec|assistance/.test(value)
  ) {
    return "electric";
  }

  return null;
}

function getProductCategories(product: Product): string[] {
  if (!Array.isArray(product.categories)) {
    return [];
  }

  return uniqueStrings(
    product.categories
      .filter((item): item is string =>
        typeof item === "string"
      )
      .map((item) => item.trim())
  );
}

function productCategoryValues(product: Product): string[] {
  const values: string[] = [];

  for (const category of getProductCategories(product)) {
    const key = getCatalogCategoryKey(category);

    if (key) {
      values.push(key);
    } else {
      values.push(`raw:${normalizeText(category)}`);
    }
  }

  return uniqueStrings(values);
}

const categoryLabels: Record<
  SiteLocale,
  Record<CatalogMobileCategoryKey, string>
> = {
  fr: {
    electric: "Vélos électriques",
    mtb: "VTT",
    cargo: "Vélos cargo",
    city: "Vélos de ville",
    accessories: "Accessoires",
  },
  en: {
    electric: "Electric bikes",
    mtb: "Mountain bikes",
    cargo: "Cargo bikes",
    city: "City bikes",
    accessories: "Accessories",
  },
  de: {
    electric: "E-Bikes",
    mtb: "Mountainbikes",
    cargo: "Lastenräder",
    city: "Citybikes",
    accessories: "Zubehör",
  },
  it: {
    electric: "Bici elettriche",
    mtb: "Mountain bike",
    cargo: "Bici cargo",
    city: "Bici da città",
    accessories: "Accessori",
  },
  es: {
    electric: "Bicicletas eléctricas",
    mtb: "Bicicletas de montaña",
    cargo: "Bicicletas de carga",
    city: "Bicicletas urbanas",
    accessories: "Accesorios",
  },
};

// ============================================================
// 5. EXTRACTION DES MARQUES
// ============================================================

/**
 * Une marque est retenue uniquement lorsqu'elle est
 * explicitement présente dans les données.
 *
 * Aucun nom de marque n'est déduit du titre du produit.
 *
 * Accepte :
 * - product.brand, si le champ existe réellement
 * - attributes sous forme d'objet
 * - attributes sous forme de tableau name/value
 */

function readAttributeValue(value: unknown): string {
  if (typeof value === "string") {
    return cleanText(value);
  }

  if (Array.isArray(value)) {
    const first = value.find(
      (item) => typeof item === "string" && item.trim()
    );
    return cleanText(first);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return (
      readAttributeValue(record.value) ||
      readAttributeValue(record.values) ||
      readAttributeValue(record.option)
    );
  }

  return "";
}

export function getCatalogProductBrand(
  product: Product
): string | null {
  const record = product as unknown as Record<string, unknown>;

  const directBrand = readAttributeValue(record.brand);
  if (directBrand) return directBrand;

  const attributes = record.attributes;

  if (!attributes || typeof attributes !== "object") {
    return null;
  }

  const brandKeys = [
    "brand",
    "marque",
    "marke",
    "marca",
    "fabricant",
    "manufacturer",
    "hersteller",
  ];

  if (Array.isArray(attributes)) {
    for (const entry of attributes) {
      if (!entry || typeof entry !== "object") continue;

      const attribute = entry as Record<string, unknown>;
      const name = normalizeText(
        attribute.name ?? attribute.key ?? attribute.label
      );

      if (brandKeys.includes(name)) {
        const brand = readAttributeValue(
          attribute.value ?? attribute.values
        );

        if (brand) return brand;
      }
    }

    return null;
  }

  const attributesRecord =
    attributes as Record<string, unknown>;

  for (const [key, value] of Object.entries(attributesRecord)) {
    if (brandKeys.includes(normalizeText(key))) {
      const brand = readAttributeValue(value);
      if (brand) return brand;
    }
  }

  return null;
}

// ============================================================
// 6. DISPONIBILITÉ
// ============================================================

/**
 * Les quantités importées ne garantissent pas
 * une disponibilité en temps réel.
 *
 * Seuls les produits stockConfirmed === true
 * peuvent être classés comme confirmés.
 */

export function getCatalogAvailability(
  product: Product
): CatalogAvailability {
  if (product.stockConfirmed !== true) {
    return CATALOG_AVAILABILITY.UNKNOWN;
  }

  const quantity = safeNumber(
    product.stockQuantityAtExport
  );

  if (quantity === null) {
    return CATALOG_AVAILABILITY.UNKNOWN;
  }

  return quantity > 0
    ? CATALOG_AVAILABILITY.IN_STOCK
    : CATALOG_AVAILABILITY.OUT_OF_STOCK;
}

// ============================================================
// 7. OPTIONS DE FILTRAGE
// ============================================================

function makeOptions(
  counts: Map<string, number>,
  labels: Map<string, string>,
  locale: SiteLocale
): CatalogFilterOption[] {
  return [...counts.entries()]
    .map(([value, count]) => ({
      value,
      label: labels.get(value) ?? value,
      count,
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, locale, {
        sensitivity: "base",
      })
    );
}

export function getCatalogCategoryOptions(
  products: readonly Product[],
  locale: SiteLocale
): CatalogFilterOption[] {
  const language = safeLocale(locale);

  const counts = new Map<string, number>();
  const labels = new Map<string, string>();

  for (const product of products) {
    for (const category of getProductCategories(product)) {
      const key = getCatalogCategoryKey(category);
      const value = key
        ? key
        : `raw:${normalizeText(category)}`;

      labels.set(
        value,
        key ? categoryLabels[language][key] : catalogText(category, language)
      );

      // Évite de compter deux fois une même catégorie
      // sur un seul produit.
    }

    for (const value of productCategoryValues(product)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  const baseOrder: string[] = [
    ...CATALOG_CATEGORY_KEYS,
  ];

  return makeOptions(counts, labels, language).sort(
    (a, b) => {
      const ai = baseOrder.indexOf(a.value);
      const bi = baseOrder.indexOf(b.value);

      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai >= 0) return -1;
      if (bi >= 0) return 1;

      return a.label.localeCompare(b.label, language);
    }
  );
}

export function getCatalogMobileCategoryOptions(
  products: readonly Product[],
  locale: SiteLocale
): CatalogMobileCategoryOption[] {
  const options = getCatalogCategoryOptions(
    products,
    locale
  );

  return CATALOG_CATEGORY_KEYS.flatMap((key) => {
    const option = options.find(
      (entry) => entry.value === key
    );

    return option ? [{ ...option, key }] : [];
  });
}

export function getCatalogBrandOptions(
  products: readonly Product[],
  locale: SiteLocale
): CatalogFilterOption[] {
  const counts = new Map<string, number>();
  const labels = new Map<string, string>();

  for (const product of products) {
    const brand = getCatalogProductBrand(product);

    if (!brand) continue;

    const value = normalizeText(brand);

    labels.set(value, brand);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return makeOptions(counts, labels, safeLocale(locale));
}

const availabilityLabels: Record<
  SiteLocale,
  Record<CatalogAvailability, string>
> = {
  fr: {
    "in-stock": "En stock",
    "out-of-stock": "Stock épuisé confirmé",
    unknown: "En stock",
  },
  en: {
    "in-stock": "In stock",
    "out-of-stock": "Confirmed out of stock",
    unknown: "In stock",
  },
  de: {
    "in-stock": "Auf Lager",
    "out-of-stock": "Bestätigt ausverkauft",
    unknown: "Auf Lager",
  },
  it: {
    "in-stock": "Disponibile",
    "out-of-stock": "Esaurito confermato",
    unknown: "Disponibile",
  },
  es: {
    "in-stock": "En stock",
    "out-of-stock": "Agotado confirmado",
    unknown: "En stock",
  },
};

export function getCatalogAvailabilityOptions(
  products: readonly Product[],
  locale: SiteLocale
): CatalogFilterOption[] {
  const counts = new Map<CatalogAvailability, number>();

  for (const product of products) {
    const value = getCatalogAvailability(product);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  const language = safeLocale(locale);

  const order: CatalogAvailability[] = [
    "in-stock",
    "out-of-stock",
    "unknown",
  ];

  return order
    .filter((value) => (counts.get(value) ?? 0) > 0)
    .map((value) => ({
      value,
      label: availabilityLabels[language][value],
      count: counts.get(value) ?? 0,
    }));
}

// ============================================================
// 8. LIMITES RÉELLES DES PRIX
// ============================================================

export function getCatalogPriceBounds(
  products: readonly Product[]
): CatalogPriceBounds {
  const prices = products
    .map(getCatalogProductPrice)
    .filter((value): value is number => value !== null);

  if (prices.length === 0) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

// ============================================================
// 9. RECHERCHE TEXTUELLE
// ============================================================

function getSearchableText(product: Product, locale: SiteLocale): string {
  const localized = localizedProduct(product, locale);
  const values = [
    localized.name,
    localized.shortDescription,
    localized.description,
    product.name,
    product.sku,
    product.shortDescription,
    getCatalogProductBrand(product),
    ...getProductCategories(product),
    ...getProductCategories(product).map(value => catalogText(value, locale)),
  ];

  return normalizeText(
    values.filter(Boolean).join(" ")
  );
}

export function searchCatalogProducts(
  products: readonly Product[],
  search: string,
  locale: SiteLocale = "fr"
): Product[] {
  const query = normalizeText(search);

  if (!query) {
    return [...products];
  }

  const words = query.split(" ").filter(Boolean);

  return products.filter((product) => {
    const searchable = getSearchableText(product, locale);

    return words.every((word) =>
      searchable.includes(word)
    );
  });
}

// ============================================================
// 10. FILTRAGE DES PRODUITS
// ============================================================

export function filterCatalogProducts(
  products: readonly Product[],
  filters: CatalogFilterValues
): Product[] {
  const selectedCategories = new Set(
    filters.categories
  );

  const selectedBrands = new Set(
    filters.brands.map(normalizeText)
  );

  const selectedAvailability = new Set(
    filters.availability
  );

  const minPrice = safeNumber(filters.minPrice);
  const maxPrice = safeNumber(filters.maxPrice);

  return products.filter((product) => {
    // CATÉGORIES : OU entre les catégories cochées.
    if (selectedCategories.size > 0) {
      const values = productCategoryValues(product);

      if (
        !values.some((value) =>
          selectedCategories.has(value)
        )
      ) {
        return false;
      }
    }

    // MARQUES : OU entre les marques cochées.
    if (selectedBrands.size > 0) {
      const brand = getCatalogProductBrand(product);

      if (
        !brand ||
        !selectedBrands.has(normalizeText(brand))
      ) {
        return false;
      }
    }

    // DISPONIBILITÉ.
    if (selectedAvailability.size > 0) {
      const status = getCatalogAvailability(product);

      if (!selectedAvailability.has(status)) {
        return false;
      }
    }

    // PRIX : les produits sans prix ne peuvent pas
    // correspondre à une plage chiffrée.
    if (minPrice !== null || maxPrice !== null) {
      const price = getCatalogProductPrice(product);

      if (price === null) return false;

      if (minPrice !== null && price < minPrice) {
        return false;
      }

      if (maxPrice !== null && price > maxPrice) {
        return false;
      }
    }

    return true;
  });
}

// ============================================================
// 11. TRI
// ============================================================

export function sortCatalogProducts(
  products: readonly Product[],
  sort: CatalogSort,
  locale: SiteLocale
): Product[] {
  const result = [...products];
  const language = safeLocale(locale);

  if (sort === "relevance") {
    // Ordre original de la source.
    // Aucun classement commercial inventé.
    return result;
  }

  if (sort === "name-asc" || sort === "name-desc") {
    const multiplier = sort === "name-asc" ? 1 : -1;

    return result.sort(
      (a, b) =>
        multiplier *
        localizedProduct(a, language).name.localeCompare(localizedProduct(b, language).name, language, {
          sensitivity: "base",
          numeric: true,
        })
    );
  }

  if (sort === "price-asc" || sort === "price-desc") {
    const multiplier = sort === "price-asc" ? 1 : -1;

    return result.sort((a, b) => {
      const aPrice = getCatalogProductPrice(a);
      const bPrice = getCatalogProductPrice(b);

      // Les prix manquants restent toujours à la fin.
      if (aPrice === null && bPrice === null) return 0;
      if (aPrice === null) return 1;
      if (bPrice === null) return -1;

      return multiplier * (aPrice - bPrice);
    });
  }

  return result;
}

// ============================================================
// 12. RECHERCHE + FILTRES + TRI
// ============================================================

export function getFilteredCatalogProducts(
  products: readonly Product[],
  query: Pick<CatalogQuery, "search" | "filters" | "sort">,
  locale: SiteLocale
): Product[] {
  const searched = searchCatalogProducts(
    products,
    query.search,
    locale
  );

  const filtered = filterCatalogProducts(
    searched,
    query.filters
  );

  return sortCatalogProducts(
    filtered,
    query.sort,
    locale
  );
}

// ============================================================
// 13. PAGINATION
// ============================================================

export type CatalogPaginationResult = {
  products: Product[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export function paginateCatalogProducts(
  products: readonly Product[],
  page: number,
  pageSize = CATALOG_PAGE_SIZE
): CatalogPaginationResult {
  const totalItems = products.length;
  const size = safeInteger(
    pageSize,
    CATALOG_PAGE_SIZE
  );

  const totalPages = Math.ceil(totalItems / size);

  const currentPage =
    totalPages === 0
      ? 1
      : Math.min(
          safeInteger(page),
          totalPages
        );

  const start = (currentPage - 1) * size;

  return {
    products: products.slice(start, start + size),
    currentPage,
    pageSize: size,
    totalItems,
    totalPages,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
}

// ============================================================
// 14. COMPTEUR DES FILTRES ACTIFS
// ============================================================

export function countCatalogActiveFilters(
  filters: CatalogFilterValues
): number {
  return (
    filters.categories.length +
    filters.brands.length +
    filters.availability.length +
    Number(filters.minPrice !== null) +
    Number(filters.maxPrice !== null)
  );
}

export function hasCatalogActiveFilters(
  filters: CatalogFilterValues
): boolean {
  return countCatalogActiveFilters(filters) > 0;
}

// ============================================================
// 15. PARAMÈTRES D'URL
// ============================================================

const validSorts: CatalogSort[] = [
  "relevance",
  "price-asc",
  "price-desc",
  "name-asc",
  "name-desc",
];

function getList(
  params: URLSearchParams,
  name: string
): string[] {
  return uniqueStrings(
    params
      .getAll(name)
      .flatMap((value) => value.split(","))
      .map((value) => value.trim())
      .filter(Boolean)
  );
}

/**
 * Convertit une URL en état de catalogue.
 *
 * Exemple :
 * /fr/produits?categorie=mtb&marque=bosch&page=2
 */
export function parseCatalogQuery(
  input: URLSearchParams | string
): CatalogQuery {
  const params =
    typeof input === "string"
      ? new URLSearchParams(
          input.startsWith("?") ? input.slice(1) : input
        )
      : input;

  const sortValue = params.get("sort") ?? "";

  const viewValue = params.get("view");

  return {
    search: cleanText(
      params.get("q") ?? params.get("search")
    ),

    filters: {
      categories: getList(params, "categorie"),
      brands: getList(params, "marque"),
      availability: getList(params, "disponibilite"),
      minPrice: safeNumber(params.get("min")),
      maxPrice: safeNumber(params.get("max")),
    },

    sort: validSorts.includes(sortValue as CatalogSort)
      ? (sortValue as CatalogSort)
      : CATALOG_DEFAULT_SORT,

    view:
      viewValue === "list"
        ? "list"
        : CATALOG_DEFAULT_VIEW,

    page: safeInteger(params.get("page")),
  };
}

/**
 * Convertit l'état du catalogue en paramètres d'URL.
 *
 * N'écrit pas les valeurs par défaut inutiles.
 */
export function serializeCatalogQuery(
  query: CatalogQuery
): URLSearchParams {
  const params = new URLSearchParams();

  if (query.search.trim()) {
    params.set("q", query.search.trim());
  }

  for (const category of uniqueStrings(
    query.filters.categories
  )) {
    params.append("categorie", category);
  }

  for (const brand of uniqueStrings(
    query.filters.brands
  )) {
    params.append("marque", brand);
  }

  for (const availability of uniqueStrings(
    query.filters.availability
  )) {
    params.append("disponibilite", availability);
  }

  if (
    query.filters.minPrice !== null &&
    safeNumber(query.filters.minPrice) !== null
  ) {
    params.set(
      "min",
      String(query.filters.minPrice)
    );
  }

  if (
    query.filters.maxPrice !== null &&
    safeNumber(query.filters.maxPrice) !== null
  ) {
    params.set(
      "max",
      String(query.filters.maxPrice)
    );
  }

  if (query.sort !== CATALOG_DEFAULT_SORT) {
    params.set("sort", query.sort);
  }

  if (query.view !== CATALOG_DEFAULT_VIEW) {
    params.set("view", query.view);
  }

  if (query.page > 1) {
    params.set("page", String(query.page));
  }

  return params;
}

// ============================================================
// 16. RÉINITIALISATION DES FILTRES
// ============================================================

export function createEmptyCatalogFilters(): CatalogFilterValues {
  return {
    categories: [],
    brands: [],
    availability: [],
    minPrice: null,
    maxPrice: null,
  };
}

// ============================================================
// 17. DONNÉES NÉCESSAIRES À LA BARRE LATÉRALE
// ============================================================

export type CatalogFilterOptions = {
  categories: CatalogFilterOption[];
  mobileCategories: CatalogMobileCategoryOption[];
  brands: CatalogFilterOption[];
  availability: CatalogFilterOption[];
  priceBounds: CatalogPriceBounds;
};

export function getCatalogFilterOptions(
  products: readonly Product[],
  locale: SiteLocale
): CatalogFilterOptions {
  return {
    categories: getCatalogCategoryOptions(
      products,
      locale
    ),

    mobileCategories:
      getCatalogMobileCategoryOptions(
        products,
        locale
      ),

    brands: getCatalogBrandOptions(
      products,
      locale
    ),

    availability: getCatalogAvailabilityOptions(
      products,
      locale
    ),

    priceBounds: getCatalogPriceBounds(products),
  };
}

// ============================================================
// FIN — MOTEUR DU CATALOGUE CYCLORIVA
// ============================================================
