
import {
  Bike,
  PackageSearch,
  SearchX,
} from "lucide-react";

import {
  CatalogProductCard,
} from "@/components/catalog/CatalogProductCard";

import type {
  CatalogView,
} from "@/components/catalog/CatalogToolbar";

import type {
  Product,
} from "@/lib/catalog";

import type {
  SiteLocale,
} from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — GRILLE DES PRODUITS
// ============================================================
//
// Next.js 16 — React — TypeScript — Tailwind CSS 4
//
// VERSION PC :
// - Grille de 4 colonnes sur grand écran
// - Grille adaptée aux écrans intermédiaires
// - Affichage en liste disponible
//
// VERSION MOBILE :
// - 2 colonnes
// - Cartes compactes
// - Espacements optimisés
// - Affichage en grille uniquement
//
// DONNÉES :
// - Produits réels fournis par le catalogue
// - Aucun produit fictif
// - Aucun prix ou stock inventé
//
// Ce composant ne filtre pas les produits.
// Il reçoit les produits déjà filtrés,
// triés et paginés par le parent.
//
// La pagination est gérée séparément
// par CatalogPagination.tsx.
//
// ============================================================

// ============================================================
// 1. TYPES PUBLICS
// ============================================================

export type CatalogProductGridProps = {
  /**
   * Liste des produits à afficher.
   *
   * Cette liste doit déjà être :
   * - filtrée
   * - triée
   * - paginée
   */
  products: readonly Product[];

  /**
   * Langue actuelle du site.
   */
  locale: SiteLocale;

  /**
   * Mode d'affichage :
   * - grid
   * - list
   *
   * Sur mobile, la grille reste active.
   */
  view?: CatalogView;

  /**
   * Indique si des filtres sont actifs.
   *
   * Permet d'afficher un message adapté
   * lorsqu'aucun résultat n'est trouvé.
   */
  hasActiveFilters?: boolean;

  /**
   * État de chargement facultatif.
   */
  loading?: boolean;

  /**
   * Nombre de cartes de chargement.
   */
  skeletonCount?: number;

  /**
   * Classes supplémentaires.
   */
  className?: string;

  /**
   * Identifiant HTML facultatif.
   */
  id?: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

type GridTranslations = {
  loading: string;
  loadingDescription: string;

  emptyTitle: string;
  emptyDescription: string;

  filteredEmptyTitle: string;
  filteredEmptyDescription: string;

  productList: string;
};

const translations: Record<
  SiteLocale,
  GridTranslations
> = {
  fr: {
    loading: "Chargement des produits",
    loadingDescription:
      "Préparation du catalogue CYCLORIVA.",

    emptyTitle: "Aucun produit disponible",
    emptyDescription:
      "Aucun produit n'est actuellement disponible dans cette sélection.",

    filteredEmptyTitle: "Aucun produit trouvé",
    filteredEmptyDescription:
      "Aucun produit ne correspond aux filtres sélectionnés. Essayez de modifier vos critères.",

    productList: "Liste des produits",
  },

  en: {
    loading: "Loading products",
    loadingDescription:
      "Preparing the CYCLORIVA catalogue.",

    emptyTitle: "No products available",
    emptyDescription:
      "There are currently no products in this selection.",

    filteredEmptyTitle: "No products found",
    filteredEmptyDescription:
      "No products match your selected filters. Try changing your criteria.",

    productList: "Product list",
  },

  de: {
    loading: "Produkte werden geladen",
    loadingDescription:
      "Der CYCLORIVA-Katalog wird vorbereitet.",

    emptyTitle: "Keine Produkte verfügbar",
    emptyDescription:
      "In dieser Auswahl sind derzeit keine Produkte verfügbar.",

    filteredEmptyTitle: "Keine Produkte gefunden",
    filteredEmptyDescription:
      "Keine Produkte entsprechen den gewählten Filtern. Ändern Sie Ihre Suchkriterien.",

    productList: "Produktliste",
  },

  it: {
    loading: "Caricamento dei prodotti",
    loadingDescription:
      "Preparazione del catalogo CYCLORIVA.",

    emptyTitle: "Nessun prodotto disponibile",
    emptyDescription:
      "Al momento non sono disponibili prodotti in questa selezione.",

    filteredEmptyTitle: "Nessun prodotto trovato",
    filteredEmptyDescription:
      "Nessun prodotto corrisponde ai filtri selezionati. Prova a modificare i criteri.",

    productList: "Elenco dei prodotti",
  },

  es: {
    loading: "Cargando productos",
    loadingDescription:
      "Preparando el catálogo CYCLORIVA.",

    emptyTitle: "No hay productos disponibles",
    emptyDescription:
      "Actualmente no hay productos disponibles en esta selección.",

    filteredEmptyTitle: "No se encontraron productos",
    filteredEmptyDescription:
      "Ningún producto coincide con los filtros seleccionados. Prueba a cambiar los criterios.",

    productList: "Lista de productos",
  },
};

// ============================================================
// 3. UTILITAIRES
// ============================================================

function getValidLocale(
  locale: SiteLocale
): SiteLocale {
  return Object.prototype.hasOwnProperty.call(
    translations,
    locale
  )
    ? locale
    : "fr";
}

function normalizeSkeletonCount(
  count: number
): number {
  if (!Number.isFinite(count)) {
    return 8;
  }

  return Math.max(
    1,
    Math.min(24, Math.floor(count))
  );
}

// ============================================================
// 4. CLASSES RESPONSIVE
// ============================================================
//
// Mobile : 2 colonnes
//
// Tablette : 3 colonnes lorsque la largeur
//            du contenu le permet
//
// PC : 4 colonnes sur grand écran
//
// Vue liste :
// - Desktop : une carte par ligne
// - Mobile : deux cartes par ligne
//
// ============================================================

const GRID_CLASSES = [
  "grid",
  "grid-cols-2",
  "gap-2.5",
  "sm:gap-3",
  "md:grid-cols-3",
  "xl:grid-cols-4",
  "xl:gap-3",
].join(" ");

const LIST_CLASSES = [
  "grid",
  "grid-cols-2",
  "gap-2.5",
  "sm:gap-3",
  "md:grid-cols-3",
  "lg:grid-cols-1",
  "lg:gap-4",
].join(" ");

// ============================================================
// 5. CARTE DE CHARGEMENT
// ============================================================

function CatalogProductSkeleton({
  index,
}: {
  index: number;
}) {
  return (
    <div
      aria-hidden="true"
      data-skeleton-index={index}
      className={[
        "flex min-w-0 flex-col",
        "overflow-hidden",
        "rounded-xl",
        "border border-slate-200",
        "bg-white",
        "p-3",
        "shadow-sm",
      ].join(" ")}
    >
      {/* PHOTO */}

      <div
        className={[
          "h-28 w-full",
          "animate-pulse",
          "rounded-lg",
          "bg-slate-100",
          "sm:h-36",
          "xl:h-40",
        ].join(" ")}
      />

      {/* CATÉGORIE */}

      <div
        className={[
          "mt-3 h-4 w-20",
          "animate-pulse",
          "rounded-full",
          "bg-[#edf9e8]",
        ].join(" ")}
      />

      {/* NOM */}

      <div
        className={[
          "mt-3 h-3.5 w-[88%]",
          "animate-pulse",
          "rounded",
          "bg-slate-200",
        ].join(" ")}
      />

      {/* DESCRIPTION */}

      <div
        className={[
          "mt-2 h-3 w-[70%]",
          "animate-pulse",
          "rounded",
          "bg-slate-100",
        ].join(" ")}
      />

      {/* PRIX */}

      <div
        className={[
          "mt-4 h-5 w-[52%]",
          "animate-pulse",
          "rounded",
          "bg-slate-200",
        ].join(" ")}
      />

      {/* DISPONIBILITÉ */}

      <div
        className={[
          "mt-2 h-3 w-[60%]",
          "animate-pulse",
          "rounded",
          "bg-slate-100",
        ].join(" ")}
      />

      {/* BOUTON */}

      <div
        className={[
          "mt-4 h-9 w-full",
          "animate-pulse",
          "rounded-lg",
          "bg-[#dff4d8]",
        ].join(" ")}
      />
    </div>
  );
}

// ============================================================
// 6. ÉTAT DE CHARGEMENT
// ============================================================

type LoadingStateProps = {
  locale: SiteLocale;
  count: number;
  view: CatalogView;
};

function CatalogGridLoading({
  locale,
  count,
  view,
}: LoadingStateProps) {
  const text = translations[locale];

  const layoutClass =
    view === "list"
      ? LIST_CLASSES
      : GRID_CLASSES;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full min-w-0"
    >
      <span className="sr-only">
        {text.loading}. {text.loadingDescription}
      </span>

      <div className={layoutClass}>
        {Array.from(
          {
            length: normalizeSkeletonCount(count),
          },
          (_, index) => (
            <CatalogProductSkeleton
              key={index}
              index={index}
            />
          )
        )}
      </div>
    </div>
  );
}

// ============================================================
// 7. AUCUN PRODUIT DISPONIBLE
// ============================================================

type EmptyStateProps = {
  locale: SiteLocale;
  hasActiveFilters: boolean;
};

function CatalogGridEmpty({
  locale,
  hasActiveFilters,
}: EmptyStateProps) {
  const text = translations[locale];

  const title = hasActiveFilters
    ? text.filteredEmptyTitle
    : text.emptyTitle;

  const description = hasActiveFilters
    ? text.filteredEmptyDescription
    : text.emptyDescription;

  return (
    <div
      role="status"
      aria-live="polite"
      data-component="catalog-empty-state"
      className={[
        "flex w-full min-w-0",
        "flex-col items-center",
        "justify-center",
        "rounded-xl",
        "border border-slate-200",
        "bg-white",
        "px-5 py-12",
        "text-center",
        "sm:px-8 sm:py-16",
      ].join(" ")}
    >
      {/* ICÔNE */}

      <div
        className={[
          "flex h-17 w-17",
          "items-center justify-center",
          "rounded-full",
          "bg-[#edf9e8]",
          "text-[#24b715]",
        ].join(" ")}
      >
        {hasActiveFilters ? (
          <SearchX
            aria-hidden="true"
            className="h-8 w-8"
            strokeWidth={1.7}
          />
        ) : (
          <PackageSearch
            aria-hidden="true"
            className="h-8 w-8"
            strokeWidth={1.7}
          />
        )}
      </div>

      {/* TITRE */}

      <h2
        className={[
          "mt-5",
          "text-base font-extrabold",
          "text-[#102b39]",
          "sm:text-lg",
        ].join(" ")}
      >
        {title}
      </h2>

      {/* DESCRIPTION */}

      <p
        className={[
          "mt-2 max-w-md",
          "text-xs leading-relaxed",
          "text-slate-600",
          "sm:text-sm",
        ].join(" ")}
      >
        {description}
      </p>

      {/* DÉCORATION */}

      <div
        aria-hidden="true"
        className="mt-5 flex items-center gap-2 text-[#24b715]"
      >
        <span className="h-px w-10 bg-[#cfeac6]" />

        <Bike
          className="h-5 w-5"
          strokeWidth={1.7}
        />

        <span className="h-px w-10 bg-[#cfeac6]" />
      </div>
    </div>
  );
}

// ============================================================
// 8. COMPOSANT PRINCIPAL
// ============================================================

export function CatalogProductGrid({
  products,
  locale,
  view = "grid",
  hasActiveFilters = false,
  loading = false,
  skeletonCount = 8,
  className = "",
  id = "catalog-products",
}: CatalogProductGridProps) {
  const currentLocale = getValidLocale(locale);

  const text = translations[currentLocale];

  // ==========================================================
  // AFFICHAGE EN GRILLE OU EN LISTE
  // ==========================================================

  const currentView: CatalogView =
    view === "list"
      ? "list"
      : "grid";

  const layoutClass =
    currentView === "list"
      ? LIST_CLASSES
      : GRID_CLASSES;

  // ==========================================================
  // ÉTAT DE CHARGEMENT
  // ==========================================================

  if (loading) {
    return (
      <section
        id={id}
        data-component="catalog-product-grid"
        data-view={currentView}
        aria-label={text.productList}
        aria-busy="true"
        className={[
          "w-full min-w-0",
          className,
        ].join(" ")}
      >
        <CatalogGridLoading
          locale={currentLocale}
          count={skeletonCount}
          view={currentView}
        />
      </section>
    );
  }

  // ==========================================================
  // AUCUN PRODUIT
  // ==========================================================

  if (products.length === 0) {
    return (
      <section
        id={id}
        data-component="catalog-product-grid"
        aria-label={text.productList}
        className={[
          "w-full min-w-0",
          className,
        ].join(" ")}
      >
        <CatalogGridEmpty
          locale={currentLocale}
          hasActiveFilters={hasActiveFilters}
        />
      </section>
    );
  }

  // ==========================================================
  // GRILLE DES PRODUITS
  // ==========================================================

  return (
    <section
      id={id}
      data-component="catalog-product-grid"
      data-view={currentView}
      aria-label={text.productList}
      className={[
        "w-full min-w-0",
        className,
      ].join(" ")}
    >
      <div
        role="list"
        className={layoutClass}
      >
        {products.map((product) => (
          <div
            key={String(product.id)}
            role="listitem"
            className="flex min-w-0"
          >
            <CatalogProductCard
              product={product}
              locale={currentLocale}
              view={currentView}
              className="h-full w-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default CatalogProductGrid;
