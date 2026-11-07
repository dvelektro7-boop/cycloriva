
"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";

import type { SiteLocale } from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — PAGINATION DU CATALOGUE
// ============================================================
//
// Next.js 16 — React — TypeScript — Tailwind CSS 4
//
// PC :
// - Pagination centrée
// - Flèches précédent / suivant
// - Numéros de pages
// - Points de suspension
// - Page active en vert
//
// Mobile :
// - Pagination compacte
// - Bouton "Charger plus de produits"
// - Bouton masqué si tous les produits sont visibles
//
// Les données viennent du catalogue.
// Aucune page ou quantité fictive.
//
// ============================================================

// ============================================================
// 1. TYPES PUBLICS
// ============================================================

export type CatalogPaginationProps = {
  locale: SiteLocale;

  /** Page courante, numérotée à partir de 1. */
  currentPage: number;

  /** Nombre total de résultats après filtrage. */
  totalItems: number;

  /** Nombre de produits par page. */
  pageSize: number;

  /** Appelé lorsque le client sélectionne une page. */
  onPageChange: (page: number) => void;

  /**
   * Action facultative pour le bouton mobile
   * "Charger plus de produits".
   *
   * Le parent doit réellement augmenter le nombre
   * de produits visibles lorsque cette action est appelée.
   */
  onLoadMore?: () => void;

  /** Nombre de produits actuellement affichés. */
  visibleCount?: number;

  /** Indique un chargement supplémentaire en cours. */
  loadingMore?: boolean;

  /** Désactiver temporairement les interactions. */
  disabled?: boolean;

  /** Afficher le bouton mobile "Charger plus". */
  showLoadMore?: boolean;

  className?: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

type PaginationTranslations = {
  pagination: string;
  previous: string;
  next: string;
  page: string;
  currentPage: string;
  loadMore: string;
  loading: string;
  morePages: string;
};

const translations: Record<
  SiteLocale,
  PaginationTranslations
> = {
  fr: {
    pagination: "Pagination des produits",
    previous: "Page précédente",
    next: "Page suivante",
    page: "Aller à la page",
    currentPage: "Page actuelle",
    loadMore: "Charger plus de produits",
    loading: "Chargement des produits...",
    morePages: "Autres pages",
  },

  en: {
    pagination: "Product pagination",
    previous: "Previous page",
    next: "Next page",
    page: "Go to page",
    currentPage: "Current page",
    loadMore: "Load more products",
    loading: "Loading products...",
    morePages: "More pages",
  },

  de: {
    pagination: "Produktseitennavigation",
    previous: "Vorherige Seite",
    next: "Nächste Seite",
    page: "Zur Seite",
    currentPage: "Aktuelle Seite",
    loadMore: "Weitere Produkte laden",
    loading: "Produkte werden geladen...",
    morePages: "Weitere Seiten",
  },

  it: {
    pagination: "Paginazione dei prodotti",
    previous: "Pagina precedente",
    next: "Pagina successiva",
    page: "Vai alla pagina",
    currentPage: "Pagina corrente",
    loadMore: "Carica altri prodotti",
    loading: "Caricamento prodotti...",
    morePages: "Altre pagine",
  },

  es: {
    pagination: "Paginación de productos",
    previous: "Página anterior",
    next: "Página siguiente",
    page: "Ir a la página",
    currentPage: "Página actual",
    loadMore: "Cargar más productos",
    loading: "Cargando productos...",
    morePages: "Más páginas",
  },
};

// ============================================================
// 3. UTILITAIRES
// ============================================================

function normalizePositiveInteger(
  value: number,
  fallback: number
): number {
  if (!Number.isFinite(value) || value < 1) {
    return fallback;
  }

  return Math.floor(value);
}

function normalizeNonNegativeInteger(
  value: number
): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.floor(value);
}

function normalizeLocale(
  locale: SiteLocale
): SiteLocale {
  return Object.prototype.hasOwnProperty.call(
    translations,
    locale
  )
    ? locale
    : "fr";
}

type PageEntry =
  | { kind: "page"; value: number }
  | { kind: "ellipsis"; value: string };

// ============================================================
// 4. CALCUL DES PAGES À AFFICHER
// ============================================================
//
// Exemple 15 pages :
//
// Page 1 : 1 2 3 4 5 ... 15
// Page 7 : 1 ... 5 6 7 8 9 ... 15
// Page 15 : 1 ... 11 12 13 14 15
//
// Pour un petit nombre de pages :
// toutes les pages restent visibles.
//
// ============================================================

function getPageEntries(
  currentPage: number,
  totalPages: number
): PageEntry[] {
  if (totalPages <= 0) {
    return [];
  }

  const visible = new Set<number>();

  // Toujours afficher la première et la dernière.
  visible.add(1);
  visible.add(totalPages);

  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page++) {
      visible.add(page);
    }
  } else if (currentPage <= 4) {
    for (let page = 1; page <= 5; page++) {
      visible.add(page);
    }
  } else if (currentPage >= totalPages - 3) {
    for (
      let page = totalPages - 4;
      page <= totalPages;
      page++
    ) {
      visible.add(page);
    }
  } else {
    for (
      let page = currentPage - 2;
      page <= currentPage + 2;
      page++
    ) {
      visible.add(page);
    }
  }

  const sorted = Array.from(visible)
    .filter(
      (page) =>
        page >= 1 &&
        page <= totalPages
    )
    .sort((a, b) => a - b);

  const result: PageEntry[] = [];

  let previousPage = 0;

  for (const page of sorted) {
    if (previousPage > 0) {
      const gap = page - previousPage;

      if (gap === 2) {
        result.push({
          kind: "page",
          value: previousPage + 1,
        });
      } else if (gap > 2) {
        result.push({
          kind: "ellipsis",
          value: `ellipsis-${previousPage}-${page}`,
        });
      }
    }

    result.push({
      kind: "page",
      value: page,
    });

    previousPage = page;
  }

  return result;
}

// ============================================================
// 5. COMPOSANT PRINCIPAL
// ============================================================

export function CatalogPagination({
  locale,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onLoadMore,
  visibleCount,
  loadingMore = false,
  disabled = false,
  showLoadMore = true,
  className = "",
}: CatalogPaginationProps) {
  const currentLocale = normalizeLocale(locale);

  const text = translations[currentLocale];

  const safeTotalItems =
    normalizeNonNegativeInteger(totalItems);

  const safePageSize =
    normalizePositiveInteger(pageSize, 12);

  const totalPages = Math.ceil(
    safeTotalItems / safePageSize
  );

  const safeCurrentPage =
    totalPages === 0
      ? 1
      : Math.min(
          totalPages,
          normalizePositiveInteger(currentPage, 1)
        );

  const pageEntries = getPageEntries(
    safeCurrentPage,
    totalPages
  );

  const hasPrevious =
    safeCurrentPage > 1;

  const hasNext =
    safeCurrentPage < totalPages;

  const safeVisibleCount =
    visibleCount !== undefined
      ? normalizeNonNegativeInteger(visibleCount)
      : Math.min(
          safeTotalItems,
          safeCurrentPage * safePageSize
        );

  const canLoadMore =
    showLoadMore &&
    typeof onLoadMore === "function" &&
    safeVisibleCount < safeTotalItems &&
    !loadingMore &&
    !disabled;

  const showLoadMoreButton =
    showLoadMore &&
    typeof onLoadMore === "function" &&
    safeVisibleCount < safeTotalItems;

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  function goToPage(page: number) {
    if (
      disabled ||
      loadingMore ||
      totalPages === 0 ||
      page < 1 ||
      page > totalPages ||
      page === safeCurrentPage
    ) {
      return;
    }

    onPageChange(page);
  }

  // ==========================================================
  // STYLES
  // ==========================================================

  const controlBase = [
    "inline-flex h-9 w-9",
    "shrink-0 items-center justify-center",
    "rounded-lg border",
    "text-xs font-bold",
    "transition-colors",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-[#24b715]",
    "disabled:cursor-not-allowed",
    "disabled:opacity-40",
    "sm:h-10 sm:w-10 sm:text-sm",
  ].join(" ");

  const pageDefault = [
    "border-slate-200",
    "bg-white text-[#102b39]",
    "hover:border-[#24b715]",
    "hover:bg-[#f0fbe9]",
  ].join(" ");

  const pageActive = [
    "border-[#24b715]",
    "bg-[#24b715]",
    "font-extrabold text-white",
    "shadow-sm",
  ].join(" ");

  // ==========================================================
  // AUCUN PRODUIT
  // ==========================================================

  if (totalPages === 0) {
    return null;
  }

  // ==========================================================
  // AFFICHAGE
  // ==========================================================

  return (
    <div
      data-component="catalog-pagination"
      className={[
        "flex w-full min-w-0",
        "flex-col items-center",
        "gap-4 py-5",
        "sm:gap-5 sm:py-6",
        className,
      ].join(" ")}
    >
      {/* ====================================================
          NAVIGATION ENTRE LES PAGES
      ==================================================== */}

      {totalPages > 1 && (
        <nav
          aria-label={text.pagination}
          className="w-full min-w-0"
        >
          <div
            className={[
              "flex w-full items-center",
              "justify-center",
              "gap-1.5",
              "sm:gap-2",
            ].join(" ")}
          >
            {/* PAGE PRÉCÉDENTE */}

            <button
              type="button"
              aria-label={text.previous}
              title={text.previous}
              disabled={
                !hasPrevious ||
                disabled ||
                loadingMore
              }
              onClick={() =>
                goToPage(safeCurrentPage - 1)
              }
              className={[
                controlBase,
                pageDefault,
              ].join(" ")}
            >
              <ChevronLeft
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2.2}
              />
            </button>

            {/* NUMÉROS DES PAGES */}

            {pageEntries.map((entry) => {
              if (entry.kind === "ellipsis") {
                return (
                  <span
                    key={entry.value}
                    aria-label={text.morePages}
                    className={[
                      "flex h-9 min-w-4",
                      "items-center justify-center",
                      "text-xs font-bold",
                      "text-slate-600",
                      "sm:h-10 sm:min-w-5",
                    ].join(" ")}
                  >
                    …
                  </span>
                );
              }

              const page = entry.value;

              const isActive =
                page === safeCurrentPage;

              return (
                <button
                  key={page}
                  type="button"
                  aria-label={
                    isActive
                      ? `${text.currentPage} ${page}`
                      : `${text.page} ${page}`
                  }
                  aria-current={
                    isActive ? "page" : undefined
                  }
                  disabled={
                    disabled || loadingMore
                  }
                  onClick={() => goToPage(page)}
                  className={[
                    controlBase,
                    isActive
                      ? pageActive
                      : pageDefault,
                  ].join(" ")}
                >
                  {page}
                </button>
              );
            })}

            {/* PAGE SUIVANTE */}

            <button
              type="button"
              aria-label={text.next}
              title={text.next}
              disabled={
                !hasNext ||
                disabled ||
                loadingMore
              }
              onClick={() =>
                goToPage(safeCurrentPage + 1)
              }
              className={[
                controlBase,
                pageDefault,
              ].join(" ")}
            >
              <ChevronRight
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2.2}
              />
            </button>
          </div>
        </nav>
      )}

      {/* ====================================================
          CHARGER PLUS DE PRODUITS — MOBILE
      ==================================================== */}

      {showLoadMoreButton && (
        <div className="w-full max-w-125 lg:hidden">
          <button
            type="button"
            disabled={!canLoadMore}
            aria-busy={loadingMore}
            onClick={() => {
              if (canLoadMore) {
                onLoadMore?.();
              }
            }}
            className={[
              "inline-flex min-h-11",
              "w-full items-center justify-center",
              "gap-2 rounded-xl",
              "border border-[#24b715]",
              "bg-white",
              "px-4 py-2.5",
              "text-center",
              "text-sm font-extrabold",
              "text-[#145d13]",
              "transition-colors",
              "hover:bg-[#edf9e8]",
              "focus-visible:outline-2",
              "focus-visible:outline-offset-2",
              "focus-visible:outline-[#24b715]",
              "disabled:cursor-not-allowed",
              "disabled:opacity-60",
            ].join(" ")}
          >
            {loadingMore ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin"
                />

                <span>{text.loading}</span>
              </>
            ) : (
              <>
                <span>{text.loadMore}</span>

                <ChevronDown
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={2.2}
                />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default CatalogPagination;
