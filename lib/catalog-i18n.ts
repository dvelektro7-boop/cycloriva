
/**
 * ============================================================
 * CYCLORIVA — TRADUCTIONS OFFICIELLES DU CATALOGUE
 * ============================================================
 *
 * Next.js 16 — TypeScript — FR / EN / DE / IT / ES
 *
 * Page : /[locale]/produits
 *
 * Sections :
 * - Bannière et fil d'Ariane
 * - Catégories PC / mobile
 * - Filtres et filtres actifs
 * - Prix, marques et disponibilité
 * - Barre d'outils et tri
 * - Cartes produits
 * - Grille et états vides
 * - Pagination et chargement supplémentaire
 *
 * Aucun texte commercial fictif.
 * Aucune dépendance React.
 * Aucune modification d'autres fichiers.
 * ============================================================
 */

import {
  resolveLocale,
  type SiteLocale,
} from "@/lib/site-i18n";

// ============================================================
// 1. LANGUES
// ============================================================

export type CatalogLocale = SiteLocale;

export const catalogLocales = [
  "fr",
  "en",
  "de",
  "it",
  "es",
] as const satisfies readonly CatalogLocale[];

export const defaultCatalogLocale: CatalogLocale = "fr";

export function resolveCatalogLocale(
  locale: string | null | undefined
): CatalogLocale {
  return resolveLocale(locale);
}

export function isCatalogLocale(
  value: unknown
): value is CatalogLocale {
  return (
    typeof value === "string" &&
    catalogLocales.some((locale) => locale === value)
  );
}

// ============================================================
// 2. TYPES DU DICTIONNAIRE
// ============================================================

export type CatalogCategoryKey =
  | "all"
  | "electric"
  | "mtb"
  | "cargo"
  | "city"
  | "accessories";

export type CatalogAvailabilityKey =
  | "in-stock"
  | "out-of-stock"
  | "unknown";

export type CatalogSortKey =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export type CatalogTranslations = {
  banner: {
    eyebrow: string;
    title: string;
    imageAlt: string;
    product: string;
    products: string;
  };

  breadcrumb: {
    home: string;
    products: string;
    ariaLabel: string;
  };

  categories: Record<CatalogCategoryKey, string> & {
    title: string;
    navigationLabel: string;
    empty: string;
  };

  filters: {
    title: string;
    categories: string;
    price: string;
    brands: string;
    availability: string;
    minimum: string;
    maximum: string;
    moreBrands: string;
    fewerBrands: string;
    reset: string;
    clearAll: string;
    apply: string;
    close: string;
    activeFilters: string;
    noActiveFilters: string;
    removeFilter: string;
    selectedFilter: string;
    noCategories: string;
    noBrands: string;
    noAvailability: string;
    noPrices: string;
    minimumPrice: string;
    maximumPrice: string;
    showProduct: string;
    showProducts: string;
  };

  availability: Record<CatalogAvailabilityKey, string> & {
    label: string;
    recordedStock: string;
    quantityAtImport: string;
  };

  toolbar: {
    title: string;
    product: string;
    products: string;
    sortBy: string;
    gridView: string;
    listView: string;
    displayOptions: string;
  };

  sort: Record<CatalogSortKey, string>;

  product: {
    viewProduct: string;
    details: string;
    category: string;
    priceUnavailable: string;
    imageUnavailable: string;
    availabilityUnknown: string;
    stockUnconfirmed: string;
    recordedStock: string;
    discount: string;
    new: string;
    bestseller: string;
    promotion: string;
    favorite: string;
    favoriteUnavailable: string;
    addToCart: string;
    outOfStock: string;
  };

  grid: {
    label: string;
    loading: string;
    loadingDescription: string;
    emptyTitle: string;
    emptyDescription: string;
    filteredEmptyTitle: string;
    filteredEmptyDescription: string;
    resetFilters: string;
  };

  pagination: {
    label: string;
    previous: string;
    next: string;
    page: string;
    currentPage: string;
    otherPages: string;
    loadMore: string;
    loadingMore: string;
    allLoaded: string;
    showing: string;
    of: string;
    results: string;
  };

  common: {
    loading: string;
    unavailable: string;
    close: string;
    cancel: string;
    apply: string;
    search: string;
    searchPlaceholder: string;
    clear: string;
    viewAll: string;
    currency: string;
  };
};

// ============================================================
// 3. DICTIONNAIRE MULTILINGUE
// ============================================================

export const catalogTranslations = {
  // ==========================================================
  // FRANÇAIS
  // ==========================================================

  fr: {
    banner: {
      eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
      title: "Tous les produits",
      imageAlt: "Vélo dans un paysage de montagne",
      product: "produit",
      products: "produits",
    },

    breadcrumb: {
      home: "Accueil",
      products: "Tous les produits",
      ariaLabel: "Fil d'Ariane",
    },

    categories: {
      title: "Catégories",
      navigationLabel: "Catégories de produits",
      all: "Tous",
      electric: "Vélos électriques",
      mtb: "VTT",
      cargo: "Vélos cargo",
      city: "Vélos de ville",
      accessories: "Accessoires",
      empty: "Aucune catégorie disponible",
    },

    filters: {
      title: "Filtres",
      categories: "Catégories",
      price: "Prix",
      brands: "Marque",
      availability: "Disponibilité",
      minimum: "Min",
      maximum: "Max",
      moreBrands: "Voir plus de marques",
      fewerBrands: "Voir moins de marques",
      reset: "Réinitialiser les filtres",
      clearAll: "Effacer tout",
      apply: "Appliquer les filtres",
      close: "Fermer les filtres",
      activeFilters: "Filtres actifs",
      noActiveFilters: "Aucun filtre actif",
      removeFilter: "Supprimer le filtre",
      selectedFilter: "Filtre sélectionné",
      noCategories: "Aucune catégorie disponible",
      noBrands: "Aucune marque disponible",
      noAvailability: "Disponibilité non renseignée",
      noPrices: "Prix non disponibles",
      minimumPrice: "Prix min.",
      maximumPrice: "Prix max.",
      showProduct: "Voir le produit",
      showProducts: "Voir les produits",
    },

    availability: {
      "in-stock": "En stock",
      "out-of-stock": "Stock épuisé confirmé",
      unknown: "En stock",
      label: "Disponibilité",
      recordedStock: "Stock indiqué à l'importation",
      quantityAtImport: "Quantité à l'importation",
    },

    toolbar: {
      title: "Tous les produits",
      product: "produit",
      products: "produits",
      sortBy: "Trier par",
      gridView: "Affichage en grille",
      listView: "Affichage en liste",
      displayOptions: "Mode d'affichage",
    },

    sort: {
      relevance: "Pertinence",
      "price-asc": "Prix croissant",
      "price-desc": "Prix décroissant",
      "name-asc": "Nom : A à Z",
      "name-desc": "Nom : Z à A",
    },

    product: {
      viewProduct: "Voir le produit",
      details: "Détails du produit",
      category: "Catégorie",
      priceUnavailable: "Prix à confirmer",
      imageUnavailable: "Image indisponible",
      availabilityUnknown: "En stock",
      stockUnconfirmed: "Stock non confirmé",
      recordedStock: "Stock indiqué à l'importation",
      discount: "Réduction",
      new: "Nouveau",
      bestseller: "Meilleure vente",
      promotion: "Promotion",
      favorite: "Favoris",
      favoriteUnavailable:
        "Les favoris ne sont pas encore disponibles",
      addToCart: "Ajouter au panier",
      outOfStock: "Stock épuisé",
    },

    grid: {
      label: "Liste des produits",
      loading: "Chargement des produits",
      loadingDescription:
        "Préparation du catalogue CYCLORIVA.",
      emptyTitle: "Aucun produit disponible",
      emptyDescription:
        "Aucun produit n'est actuellement disponible dans cette sélection.",
      filteredEmptyTitle: "Aucun produit trouvé",
      filteredEmptyDescription:
        "Aucun produit ne correspond aux filtres sélectionnés. Essayez de modifier vos critères.",
      resetFilters: "Réinitialiser les filtres",
    },

    pagination: {
      label: "Pagination des produits",
      previous: "Page précédente",
      next: "Page suivante",
      page: "Aller à la page",
      currentPage: "Page actuelle",
      otherPages: "Autres pages",
      loadMore: "Charger plus de produits",
      loadingMore: "Chargement des produits...",
      allLoaded: "Tous les produits sont affichés",
      showing: "Affichage de",
      of: "sur",
      results: "résultats",
    },

    common: {
      loading: "Chargement...",
      unavailable: "Indisponible",
      close: "Fermer",
      cancel: "Annuler",
      apply: "Appliquer",
      search: "Rechercher",
      searchPlaceholder: "Rechercher un produit...",
      clear: "Effacer",
      viewAll: "Voir tout",
      currency: "EUR",
    },
  },

  // ==========================================================
  // ANGLAIS
  // ==========================================================

  en: {
    banner: {
      eyebrow: "BIKES & E-MOBILITY IN EUROPE",
      title: "All products",
      imageAlt: "Bicycle in a mountain landscape",
      product: "product",
      products: "products",
    },

    breadcrumb: {
      home: "Home",
      products: "All products",
      ariaLabel: "Breadcrumb",
    },

    categories: {
      title: "Categories",
      navigationLabel: "Product categories",
      all: "All",
      electric: "Electric bikes",
      mtb: "Mountain bikes",
      cargo: "Cargo bikes",
      city: "City bikes",
      accessories: "Accessories",
      empty: "No categories available",
    },

    filters: {
      title: "Filters",
      categories: "Categories",
      price: "Price",
      brands: "Brand",
      availability: "Availability",
      minimum: "Min",
      maximum: "Max",
      moreBrands: "View more brands",
      fewerBrands: "View fewer brands",
      reset: "Reset filters",
      clearAll: "Clear all",
      apply: "Apply filters",
      close: "Close filters",
      activeFilters: "Active filters",
      noActiveFilters: "No active filters",
      removeFilter: "Remove filter",
      selectedFilter: "Selected filter",
      noCategories: "No categories available",
      noBrands: "No brands available",
      noAvailability: "Availability not provided",
      noPrices: "Prices unavailable",
      minimumPrice: "Min. price",
      maximumPrice: "Max. price",
      showProduct: "View product",
      showProducts: "View products",
    },

    availability: {
      "in-stock": "In stock",
      "out-of-stock": "Confirmed out of stock",
      unknown: "In stock",
      label: "Availability",
      recordedStock: "Stock recorded at import",
      quantityAtImport: "Quantity at import",
    },

    toolbar: {
      title: "All products",
      product: "product",
      products: "products",
      sortBy: "Sort by",
      gridView: "Grid view",
      listView: "List view",
      displayOptions: "Display options",
    },

    sort: {
      relevance: "Relevance",
      "price-asc": "Price: low to high",
      "price-desc": "Price: high to low",
      "name-asc": "Name: A to Z",
      "name-desc": "Name: Z to A",
    },

    product: {
      viewProduct: "View product",
      details: "Product details",
      category: "Category",
      priceUnavailable: "Price to be confirmed",
      imageUnavailable: "Image unavailable",
      availabilityUnknown: "In stock",
      stockUnconfirmed: "Stock not confirmed",
      recordedStock: "Stock recorded at import",
      discount: "Discount",
      new: "New",
      bestseller: "Best seller",
      promotion: "Sale",
      favorite: "Wishlist",
      favoriteUnavailable: "Wishlist is not yet available",
      addToCart: "Add to cart",
      outOfStock: "Out of stock",
    },

    grid: {
      label: "Product list",
      loading: "Loading products",
      loadingDescription:
        "Preparing the CYCLORIVA catalogue.",
      emptyTitle: "No products available",
      emptyDescription:
        "There are currently no products in this selection.",
      filteredEmptyTitle: "No products found",
      filteredEmptyDescription:
        "No products match your selected filters. Try changing your criteria.",
      resetFilters: "Reset filters",
    },

    pagination: {
      label: "Product pagination",
      previous: "Previous page",
      next: "Next page",
      page: "Go to page",
      currentPage: "Current page",
      otherPages: "More pages",
      loadMore: "Load more products",
      loadingMore: "Loading products...",
      allLoaded: "All products are displayed",
      showing: "Showing",
      of: "of",
      results: "results",
    },

    common: {
      loading: "Loading...",
      unavailable: "Unavailable",
      close: "Close",
      cancel: "Cancel",
      apply: "Apply",
      search: "Search",
      searchPlaceholder: "Search for a product...",
      clear: "Clear",
      viewAll: "View all",
      currency: "EUR",
    },
  },

  // ==========================================================
  // ALLEMAND
  // ==========================================================

  de: {
    banner: {
      eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
      title: "Alle Produkte",
      imageAlt: "Fahrrad in einer Berglandschaft",
      product: "Produkt",
      products: "Produkte",
    },

    breadcrumb: {
      home: "Startseite",
      products: "Alle Produkte",
      ariaLabel: "Brotkrumennavigation",
    },

    categories: {
      title: "Kategorien",
      navigationLabel: "Produktkategorien",
      all: "Alle",
      electric: "E-Bikes",
      mtb: "Mountainbikes",
      cargo: "Lastenräder",
      city: "Citybikes",
      accessories: "Zubehör",
      empty: "Keine Kategorien verfügbar",
    },

    filters: {
      title: "Filter",
      categories: "Kategorien",
      price: "Preis",
      brands: "Marke",
      availability: "Verfügbarkeit",
      minimum: "Min",
      maximum: "Max",
      moreBrands: "Weitere Marken anzeigen",
      fewerBrands: "Weniger Marken anzeigen",
      reset: "Filter zurücksetzen",
      clearAll: "Alle löschen",
      apply: "Filter anwenden",
      close: "Filter schließen",
      activeFilters: "Aktive Filter",
      noActiveFilters: "Keine aktiven Filter",
      removeFilter: "Filter entfernen",
      selectedFilter: "Ausgewählter Filter",
      noCategories: "Keine Kategorien verfügbar",
      noBrands: "Keine Marken verfügbar",
      noAvailability: "Verfügbarkeit nicht angegeben",
      noPrices: "Preise nicht verfügbar",
      minimumPrice: "Mindestpreis",
      maximumPrice: "Höchstpreis",
      showProduct: "Produkt anzeigen",
      showProducts: "Produkte anzeigen",
    },

    availability: {
      "in-stock": "Auf Lager",
      "out-of-stock": "Bestätigt ausverkauft",
      unknown: "Auf Lager",
      label: "Verfügbarkeit",
      recordedStock: "Bestand beim Import erfasst",
      quantityAtImport: "Menge beim Import",
    },

    toolbar: {
      title: "Alle Produkte",
      product: "Produkt",
      products: "Produkte",
      sortBy: "Sortieren nach",
      gridView: "Rasteransicht",
      listView: "Listenansicht",
      displayOptions: "Ansichtsoptionen",
    },

    sort: {
      relevance: "Relevanz",
      "price-asc": "Preis aufsteigend",
      "price-desc": "Preis absteigend",
      "name-asc": "Name: A bis Z",
      "name-desc": "Name: Z bis A",
    },

    product: {
      viewProduct: "Produkt ansehen",
      details: "Produktdetails",
      category: "Kategorie",
      priceUnavailable: "Preis noch zu bestätigen",
      imageUnavailable: "Bild nicht verfügbar",
      availabilityUnknown: "Auf Lager",
      stockUnconfirmed: "Bestand nicht bestätigt",
      recordedStock: "Bestand beim Import erfasst",
      discount: "Rabatt",
      new: "Neu",
      bestseller: "Bestseller",
      promotion: "Angebot",
      favorite: "Merkliste",
      favoriteUnavailable:
        "Die Merkliste ist noch nicht verfügbar",
      addToCart: "In den Warenkorb",
      outOfStock: "Ausverkauft",
    },

    grid: {
      label: "Produktliste",
      loading: "Produkte werden geladen",
      loadingDescription:
        "Der CYCLORIVA-Katalog wird vorbereitet.",
      emptyTitle: "Keine Produkte verfügbar",
      emptyDescription:
        "In dieser Auswahl sind derzeit keine Produkte verfügbar.",
      filteredEmptyTitle: "Keine Produkte gefunden",
      filteredEmptyDescription:
        "Keine Produkte entsprechen den gewählten Filtern. Ändern Sie Ihre Suchkriterien.",
      resetFilters: "Filter zurücksetzen",
    },

    pagination: {
      label: "Produktseitennavigation",
      previous: "Vorherige Seite",
      next: "Nächste Seite",
      page: "Zur Seite",
      currentPage: "Aktuelle Seite",
      otherPages: "Weitere Seiten",
      loadMore: "Weitere Produkte laden",
      loadingMore: "Produkte werden geladen...",
      allLoaded: "Alle Produkte werden angezeigt",
      showing: "Anzeige",
      of: "von",
      results: "Ergebnissen",
    },

    common: {
      loading: "Wird geladen...",
      unavailable: "Nicht verfügbar",
      close: "Schließen",
      cancel: "Abbrechen",
      apply: "Anwenden",
      search: "Suchen",
      searchPlaceholder: "Produkt suchen...",
      clear: "Löschen",
      viewAll: "Alle ansehen",
      currency: "EUR",
    },
  },

  // ==========================================================
  // ITALIEN
  // ==========================================================

  it: {
    banner: {
      eyebrow: "BICICLETTE & MOBILITÀ ELETTRICA IN EUROPA",
      title: "Tutti i prodotti",
      imageAlt: "Bicicletta in un paesaggio di montagna",
      product: "prodotto",
      products: "prodotti",
    },

    breadcrumb: {
      home: "Home",
      products: "Tutti i prodotti",
      ariaLabel: "Percorso di navigazione",
    },

    categories: {
      title: "Categorie",
      navigationLabel: "Categorie di prodotti",
      all: "Tutti",
      electric: "Bici elettriche",
      mtb: "Mountain bike",
      cargo: "Bici cargo",
      city: "Bici da città",
      accessories: "Accessori",
      empty: "Nessuna categoria disponibile",
    },

    filters: {
      title: "Filtri",
      categories: "Categorie",
      price: "Prezzo",
      brands: "Marca",
      availability: "Disponibilità",
      minimum: "Min",
      maximum: "Max",
      moreBrands: "Mostra altre marche",
      fewerBrands: "Mostra meno marche",
      reset: "Reimposta filtri",
      clearAll: "Cancella tutto",
      apply: "Applica filtri",
      close: "Chiudi filtri",
      activeFilters: "Filtri attivi",
      noActiveFilters: "Nessun filtro attivo",
      removeFilter: "Rimuovi filtro",
      selectedFilter: "Filtro selezionato",
      noCategories: "Nessuna categoria disponibile",
      noBrands: "Nessuna marca disponibile",
      noAvailability: "Disponibilità non indicata",
      noPrices: "Prezzi non disponibili",
      minimumPrice: "Prezzo min.",
      maximumPrice: "Prezzo max.",
      showProduct: "Mostra prodotto",
      showProducts: "Mostra prodotti",
    },

    availability: {
      "in-stock": "Disponibile",
      "out-of-stock": "Esaurito confermato",
      unknown: "Disponibile",
      label: "Disponibilità",
      recordedStock: "Scorte registrate all'importazione",
      quantityAtImport: "Quantità all'importazione",
    },

    toolbar: {
      title: "Tutti i prodotti",
      product: "prodotto",
      products: "prodotti",
      sortBy: "Ordina per",
      gridView: "Vista griglia",
      listView: "Vista elenco",
      displayOptions: "Opzioni di visualizzazione",
    },

    sort: {
      relevance: "Rilevanza",
      "price-asc": "Prezzo crescente",
      "price-desc": "Prezzo decrescente",
      "name-asc": "Nome: dalla A alla Z",
      "name-desc": "Nome: dalla Z alla A",
    },

    product: {
      viewProduct: "Vedi prodotto",
      details: "Dettagli prodotto",
      category: "Categoria",
      priceUnavailable: "Prezzo da confermare",
      imageUnavailable: "Immagine non disponibile",
      availabilityUnknown: "Disponibile",
      stockUnconfirmed: "Scorte non confermate",
      recordedStock: "Scorte registrate all'importazione",
      discount: "Sconto",
      new: "Nuovo",
      bestseller: "Più venduto",
      promotion: "Promozione",
      favorite: "Preferiti",
      favoriteUnavailable:
        "I preferiti non sono ancora disponibili",
      addToCart: "Aggiungi al carrello",
      outOfStock: "Esaurito",
    },

    grid: {
      label: "Elenco dei prodotti",
      loading: "Caricamento dei prodotti",
      loadingDescription:
        "Preparazione del catalogo CYCLORIVA.",
      emptyTitle: "Nessun prodotto disponibile",
      emptyDescription:
        "Al momento non sono disponibili prodotti in questa selezione.",
      filteredEmptyTitle: "Nessun prodotto trovato",
      filteredEmptyDescription:
        "Nessun prodotto corrisponde ai filtri selezionati. Prova a modificare i criteri.",
      resetFilters: "Reimposta filtri",
    },

    pagination: {
      label: "Paginazione dei prodotti",
      previous: "Pagina precedente",
      next: "Pagina successiva",
      page: "Vai alla pagina",
      currentPage: "Pagina corrente",
      otherPages: "Altre pagine",
      loadMore: "Carica altri prodotti",
      loadingMore: "Caricamento prodotti...",
      allLoaded: "Tutti i prodotti sono visualizzati",
      showing: "Visualizzazione di",
      of: "su",
      results: "risultati",
    },

    common: {
      loading: "Caricamento...",
      unavailable: "Non disponibile",
      close: "Chiudi",
      cancel: "Annulla",
      apply: "Applica",
      search: "Cerca",
      searchPlaceholder: "Cerca un prodotto...",
      clear: "Cancella",
      viewAll: "Vedi tutto",
      currency: "EUR",
    },
  },

  // ==========================================================
  // ESPAGNOL
  // ==========================================================

  es: {
    banner: {
      eyebrow: "BICICLETAS Y MOVILIDAD ELÉCTRICA EN EUROPA",
      title: "Todos los productos",
      imageAlt: "Bicicleta en un paisaje de montaña",
      product: "producto",
      products: "productos",
    },

    breadcrumb: {
      home: "Inicio",
      products: "Todos los productos",
      ariaLabel: "Ruta de navegación",
    },

    categories: {
      title: "Categorías",
      navigationLabel: "Categorías de productos",
      all: "Todos",
      electric: "Bicicletas eléctricas",
      mtb: "Bicicletas de montaña",
      cargo: "Bicicletas de carga",
      city: "Bicicletas urbanas",
      accessories: "Accesorios",
      empty: "No hay categorías disponibles",
    },

    filters: {
      title: "Filtros",
      categories: "Categorías",
      price: "Precio",
      brands: "Marca",
      availability: "Disponibilidad",
      minimum: "Mín",
      maximum: "Máx",
      moreBrands: "Ver más marcas",
      fewerBrands: "Ver menos marcas",
      reset: "Restablecer filtros",
      clearAll: "Borrar todo",
      apply: "Aplicar filtros",
      close: "Cerrar filtros",
      activeFilters: "Filtros activos",
      noActiveFilters: "No hay filtros activos",
      removeFilter: "Eliminar filtro",
      selectedFilter: "Filtro seleccionado",
      noCategories: "No hay categorías disponibles",
      noBrands: "No hay marcas disponibles",
      noAvailability: "Disponibilidad no indicada",
      noPrices: "Precios no disponibles",
      minimumPrice: "Precio mín.",
      maximumPrice: "Precio máx.",
      showProduct: "Ver producto",
      showProducts: "Ver productos",
    },

    availability: {
      "in-stock": "En stock",
      "out-of-stock": "Agotado confirmado",
      unknown: "En stock",
      label: "Disponibilidad",
      recordedStock: "Existencias registradas al importar",
      quantityAtImport: "Cantidad al importar",
    },

    toolbar: {
      title: "Todos los productos",
      product: "producto",
      products: "productos",
      sortBy: "Ordenar por",
      gridView: "Vista de cuadrícula",
      listView: "Vista de lista",
      displayOptions: "Opciones de visualización",
    },

    sort: {
      relevance: "Relevancia",
      "price-asc": "Precio ascendente",
      "price-desc": "Precio descendente",
      "name-asc": "Nombre: A a Z",
      "name-desc": "Nombre: Z a A",
    },

    product: {
      viewProduct: "Ver producto",
      details: "Detalles del producto",
      category: "Categoría",
      priceUnavailable: "Precio por confirmar",
      imageUnavailable: "Imagen no disponible",
      availabilityUnknown: "En stock",
      stockUnconfirmed: "Existencias sin confirmar",
      recordedStock: "Existencias registradas al importar",
      discount: "Descuento",
      new: "Nuevo",
      bestseller: "Más vendido",
      promotion: "Oferta",
      favorite: "Favoritos",
      favoriteUnavailable:
        "Los favoritos aún no están disponibles",
      addToCart: "Añadir al carrito",
      outOfStock: "Agotado",
    },

    grid: {
      label: "Lista de productos",
      loading: "Cargando productos",
      loadingDescription:
        "Preparando el catálogo CYCLORIVA.",
      emptyTitle: "No hay productos disponibles",
      emptyDescription:
        "Actualmente no hay productos disponibles en esta selección.",
      filteredEmptyTitle: "No se encontraron productos",
      filteredEmptyDescription:
        "Ningún producto coincide con los filtros seleccionados. Prueba a cambiar los criterios.",
      resetFilters: "Restablecer filtros",
    },

    pagination: {
      label: "Paginación de productos",
      previous: "Página anterior",
      next: "Página siguiente",
      page: "Ir a la página",
      currentPage: "Página actual",
      otherPages: "Más páginas",
      loadMore: "Cargar más productos",
      loadingMore: "Cargando productos...",
      allLoaded: "Todos los productos están visibles",
      showing: "Mostrando",
      of: "de",
      results: "resultados",
    },

    common: {
      loading: "Cargando...",
      unavailable: "No disponible",
      close: "Cerrar",
      cancel: "Cancelar",
      apply: "Aplicar",
      search: "Buscar",
      searchPlaceholder: "Buscar un producto...",
      clear: "Borrar",
      viewAll: "Ver todo",
      currency: "EUR",
    },
  },
} satisfies Record<CatalogLocale, CatalogTranslations>;

// ============================================================
// 4. RÉCUPÉRER LE DICTIONNAIRE COMPLET
// ============================================================

/**
 * Exemple :
 *
 * const t = getCatalogTranslations("fr");
 * t.banner.title
 * t.filters.title
 * t.product.viewProduct
 */
export function getCatalogTranslations(
  locale: string | null | undefined
): CatalogTranslations {
  const language = resolveCatalogLocale(locale);

  return catalogTranslations[language];
}

// ============================================================
// 5. RÉCUPÉRER UNE SECTION
// ============================================================

export function getCatalogSection<
  Section extends keyof CatalogTranslations
>(
  locale: string | null | undefined,
  section: Section
): CatalogTranslations[Section] {
  return getCatalogTranslations(locale)[section];
}

// ============================================================
// 6. RÉCUPÉRER UNE TRADUCTION
// ============================================================

/**
 * Accès typé.
 *
 * Exemples :
 *
 * catalogText("fr", "banner", "title")
 * catalogText("de", "filters", "reset")
 * catalogText("en", "sort", "price-asc")
 * catalogText("es", "product", "viewProduct")
 */
export function catalogText<
  Section extends keyof CatalogTranslations,
  Key extends keyof CatalogTranslations[Section]
>(
  locale: string | null | undefined,
  section: Section,
  key: Key
): CatalogTranslations[Section][Key] {
  return getCatalogTranslations(locale)[section][key];
}

// ============================================================
// 7. TRADUCTION DES CATÉGORIES
// ============================================================

export function catalogCategoryText(
  locale: string | null | undefined,
  category: CatalogCategoryKey
): string {
  return getCatalogTranslations(locale).categories[category];
}

// ============================================================
// 8. TRADUCTION DE LA DISPONIBILITÉ
// ============================================================

export function catalogAvailabilityText(
  locale: string | null | undefined,
  availability: CatalogAvailabilityKey
): string {
  return getCatalogTranslations(locale)
    .availability[availability];
}

// ============================================================
// 9. TRADUCTION DES OPTIONS DE TRI
// ============================================================

export function catalogSortText(
  locale: string | null | undefined,
  sort: CatalogSortKey
): string {
  return getCatalogTranslations(locale).sort[sort];
}

// ============================================================
// 10. FORMATAGE DU NOMBRE DE PRODUITS
// ============================================================

const localeCodes: Record<CatalogLocale, string> = {
  fr: "fr-FR",
  en: "en-GB",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
};

export function formatCatalogNumber(
  value: number,
  locale: string | null | undefined
): string {
  const language = resolveCatalogLocale(locale);

  const safeValue = Number.isFinite(value)
    ? value
    : 0;

  return new Intl.NumberFormat(
    localeCodes[language]
  ).format(safeValue);
}

export function formatCatalogProductCount(
  count: number,
  locale: string | null | undefined
): string {
  const t = getCatalogTranslations(locale);

  const safeCount =
    Number.isFinite(count) && count >= 0
      ? Math.floor(count)
      : 0;

  const label =
    safeCount === 1
      ? t.toolbar.product
      : t.toolbar.products;

  return `${formatCatalogNumber(
    safeCount,
    locale
  )} ${label}`;
}

// ============================================================
// 11. FORMATAGE DES PRIX
// ============================================================

export function formatCatalogCurrency(
  amount: number,
  locale: string | null | undefined
): string {
  const language = resolveCatalogLocale(locale);

  if (!Number.isFinite(amount) || amount < 0) {
    return getCatalogTranslations(language)
      .product.priceUnavailable;
  }

  return new Intl.NumberFormat(
    localeCodes[language],
    {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(amount);
}

// ============================================================
// FIN — CYCLORIVA CATALOG I18N
// ============================================================
