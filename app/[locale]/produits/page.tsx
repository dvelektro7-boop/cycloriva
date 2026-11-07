
"use client";

import "@/components/catalog/CatalogLayout.css";

import {
  Suspense,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
  notFound,
} from "next/navigation";

// ============================================================
// CYCLORIVA — COMPOSANTS DU CATALOGUE
// ============================================================

import { CatalogBanner } from "@/components/catalog/CatalogBanner";

import { CatalogBreadcrumb } from "@/components/catalog/CatalogBreadcrumb";

import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";

import { CatalogMobileCategories } from "@/components/catalog/CatalogMobileCategories";

import { CatalogMobileFilters } from "@/components/catalog/CatalogMobileFilters";

import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";

import { CatalogActiveFilters } from "@/components/catalog/CatalogActiveFilters";

import { CatalogProductGrid } from "@/components/catalog/CatalogProductGrid";

import { CatalogPagination } from "@/components/catalog/CatalogPagination";

// ============================================================
// SERVICES DÉJÀ PRÉSENTS SUR LE SITE
// ============================================================

import { HomeServices } from "@/components/home/HomeServices";

// ============================================================
// PRODUITS ET LANGUES
// ============================================================

import { allProducts } from "@/lib/catalog";

import {
  isSiteLocale,
  type SiteLocale,
} from "@/lib/site-i18n";

// ============================================================
// MOTEUR DU CATALOGUE
// ============================================================

import {
  CATALOG_PAGE_SIZE,
  getCatalogFilterOptions,
  getFilteredCatalogProducts,
  hasCatalogActiveFilters,
  paginateCatalogProducts,
  parseCatalogQuery,
  serializeCatalogQuery,
  type CatalogQuery,
} from "@/lib/catalog-filters";

import type {
  CatalogFilterValues,
} from "@/components/catalog/CatalogSidebar";

import type {
  CatalogSort,
  CatalogView,
} from "@/components/catalog/CatalogToolbar";

// ============================================================
// PAGE OFFICIELLE — TOUS LES PRODUITS
// ============================================================
//
// URL : /fr/produits
//       /en/produits
//       /de/produits
//       /it/produits
//       /es/produits
//
// PC :
// 1. Header existant
// 2. Bannière
// 3. Fil d'Ariane
// 4. Filtres à gauche
// 5. Toolbar
// 6. Grille des produits
// 7. Pagination
// 8. Footer existant
//
// MOBILE :
// 1. Header existant
// 2. Bannière avec fil d'Ariane
// 3. Catégories
// 4. Filtres et tri
// 5. Filtres actifs
// 6. Grille à 2 colonnes
// 7. Pagination et chargement supplémentaire
// 8. Services
// 9. Footer existant
//
// Les produits proviennent de lib/catalog.ts.
//
// Aucun header ou footer dupliqué.
//
// ============================================================

// ============================================================
// 1. TYPES
// ============================================================

type LoadMoreState = {
  queryKey: string;
  extraItems: number;
};

// ============================================================
// 2. ÉTAT DE CHARGEMENT INITIAL
// ============================================================

function CatalogPageFallback() {
  return (
    <main
      aria-busy="true"
      className="cycloriva-catalog-loading min-h-screen w-full bg-white"
    >
      {/* BANNIÈRE */}

      <div className="h-38 w-full animate-pulse bg-[#102b39] sm:h-40" />

      {/* CONTENU */}

      <div className="cycloriva-container py-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[245px_minmax(0,1fr)]">
          {/* COLONNE DES FILTRES PC */}

          <div className="hidden h-115 animate-pulse rounded-xl border border-slate-200 bg-slate-50 lg:block" />

          <div className="min-w-0">
            {/* BARRE DE CONTRÔLE */}

            <div className="mb-5 h-11 animate-pulse rounded-lg bg-slate-100" />

            {/* CARTES */}

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {Array.from(
                { length: 8 },
                (_, index) => (
                  <div
                    key={index}
                    className="min-w-0 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <div className="h-30 animate-pulse rounded-lg bg-slate-100 sm:h-38" />

                    <div className="mt-3 h-3 w-3/4 animate-pulse rounded bg-slate-200" />

                    <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-slate-100" />

                    <div className="mt-4 h-8 animate-pulse rounded-lg bg-[#e3f6dc]" />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// 3. CONTENU INTERACTIF DU CATALOGUE
// ============================================================

function CatalogPageContent() {
  const params = useParams<{
    locale: string;
  }>();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ==========================================================
  // LANGUE
  // ==========================================================

  const rawLocale = params.locale;

  const locale: SiteLocale =
    isSiteLocale(rawLocale)
      ? rawLocale
      : "fr";

  // ==========================================================
  // PARAMÈTRES DE L'URL
  // ==========================================================

  const queryString = searchParams.toString();

  const query = useMemo(
    () => parseCatalogQuery(queryString),
    [queryString]
  );

  // ==========================================================
  // OPTIONS RÉELLES DES FILTRES
  // ==========================================================

  const filterOptions = useMemo(
    () =>
      getCatalogFilterOptions(
        allProducts,
        locale
      ),
    [locale]
  );

  const {
    categories,
    mobileCategories,
    brands,
    availability,
    priceBounds,
  } = filterOptions;

  // ==========================================================
  // PRODUITS FILTRÉS ET TRIÉS
  // ==========================================================

  const filteredProducts = useMemo(
    () =>
      getFilteredCatalogProducts(
        allProducts,
        {
          search: query.search,
          filters: query.filters,
          sort: query.sort,
        },
        locale
      ),
    [
      query.search,
      query.filters,
      query.sort,
      locale,
    ]
  );

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const pagination = useMemo(
    () =>
      paginateCatalogProducts(
        filteredProducts,
        query.page,
        CATALOG_PAGE_SIZE
      ),
    [filteredProducts, query.page]
  );

  // ==========================================================
  // CHARGER DAVANTAGE DE PRODUITS SUR MOBILE
  // ==========================================================

  const [loadMoreState, setLoadMoreState] =
    useState<LoadMoreState>({
      queryKey: "",
      extraItems: 0,
    });

  // Chaque combinaison d'URL et de page possède sa
  // propre sélection de produits supplémentaires.
  // Si les filtres changent, l'extension précédente
  // ne s'applique plus.

  const loadMoreKey = [
    pathname,
    queryString,
    pagination.currentPage,
  ].join("|");

  const extraItems =
    loadMoreState.queryKey === loadMoreKey
      ? loadMoreState.extraItems
      : 0;

  const pageStart =
    (pagination.currentPage - 1) *
    pagination.pageSize;

  const visibleProducts = useMemo(
    () =>
      filteredProducts.slice(
        pageStart,
        pageStart +
          pagination.pageSize +
          extraItems
      ),
    [
      filteredProducts,
      pageStart,
      pagination.pageSize,
      extraItems,
    ]
  );

  // Nombre cumulé servant à déterminer s'il reste
  // des produits à charger depuis cette page.

  const visibleCount =
    pageStart + visibleProducts.length;

  // ==========================================================
  // FILTRES ACTIFS
  // ==========================================================

  const hasActiveFilters =
    hasCatalogActiveFilters(
      query.filters
    ) || query.search.trim().length > 0;

  // ==========================================================
  // NAVIGATION DANS L'URL
  // ==========================================================

  function updateCatalogQuery(
    next: CatalogQuery
  ) {
    const serialized =
      serializeCatalogQuery(next);

    const nextSearch = serialized.toString();

    const url = nextSearch
      ? `${pathname}?${nextSearch}`
      : pathname;

    router.replace(url, {
      scroll: false,
    });
  }

  // ==========================================================
  // MODIFICATION DES FILTRES
  // ==========================================================

  function handleFiltersChange(
    filters: CatalogFilterValues
  ) {
    updateCatalogQuery({
      ...query,
      filters,
      page: 1,
    });
  }

  // ==========================================================
  // MODIFICATION DU TRI
  // ==========================================================

  function handleSortChange(
    sort: CatalogSort
  ) {
    updateCatalogQuery({
      ...query,
      sort,
      page: 1,
    });
  }

  // ==========================================================
  // MODIFICATION DU MODE D'AFFICHAGE
  // ==========================================================

  function handleViewChange(
    view: CatalogView
  ) {
    updateCatalogQuery({
      ...query,
      view,
    });
  }

  // ==========================================================
  // CHANGEMENT DE PAGE
  // ==========================================================

  function handlePageChange(
    page: number
  ) {
    const totalPages =
      pagination.totalPages;

    if (
      !Number.isSafeInteger(page) ||
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    updateCatalogQuery({
      ...query,
      page,
    });
  }

  // ==========================================================
  // CHARGER PLUS
  // ==========================================================

  function handleLoadMore() {
    const remaining =
      filteredProducts.length -
      visibleCount;

    if (remaining <= 0) {
      return;
    }

    setLoadMoreState({
      queryKey: loadMoreKey,
      extraItems:
        extraItems +
        Math.min(
          pagination.pageSize,
          remaining
        ),
    });
  }

  // ==========================================================
  // PAGE INVALIDE
  // ==========================================================

  if (!isSiteLocale(rawLocale)) {
    notFound();
  }

  // ==========================================================
  // AFFICHAGE DE LA PAGE
  // ==========================================================

  return (
    <main
      id="cycloriva-catalog"
      data-page="catalog"
      data-locale={locale}
      className="min-h-screen w-full min-w-0 overflow-x-clip bg-white text-[#102b39]"
    >
      {/* ====================================================
          1. BANNIÈRE OFFICIELLE
      ==================================================== */}

      <CatalogBanner
        locale={locale}
        productCount={
          filteredProducts.length
        }
      />

      {/* ====================================================
          2. FIL D'ARIANE PC
      ==================================================== */}

      <CatalogBreadcrumb
        locale={locale}
      />

      {/* ====================================================
          3. CATÉGORIES MOBILE
      ==================================================== */}

      <CatalogMobileCategories
        locale={locale}
        filters={query.filters}
        onChange={handleFiltersChange}
        categories={mobileCategories}
      />

      {/* ====================================================
          4. STRUCTURE PRINCIPALE DU CATALOGUE
      ==================================================== */}

      <div className="cycloriva-container pt-3 pb-6 sm:pt-4 sm:pb-8 lg:pt-1 lg:pb-10">
        <div
          className={[
            "grid min-w-0",
            "grid-cols-1",
            "items-start",
            "gap-4",
            "lg:grid-cols-[245px_minmax(0,1fr)]",
            "lg:gap-5",
            "xl:gap-5",
          ].join(" ")}
        >
          {/* ==================================================
              5. FILTRES LATÉRAUX PC
          ================================================== */}

          <CatalogSidebar
            locale={locale}
            filters={query.filters}
            onChange={handleFiltersChange}
            categories={categories}
            brands={brands}
            availability={availability}
            priceBounds={priceBounds}
            mode="desktop"
          />

          {/* ==================================================
              6. COLONNE DES PRODUITS
          ================================================== */}

          <div className="min-w-0">
            {/* ==============================================
                BARRE D'OUTILS PC ET MOBILE
            ============================================== */}

            <CatalogToolbar
              locale={locale}
              resultCount={
                filteredProducts.length
              }
              sort={query.sort}
              onSortChange={
                handleSortChange
              }
              view={query.view}
              onViewChange={
                handleViewChange
              }
              mobileFilters={
                <CatalogMobileFilters
                  locale={locale}
                  filters={query.filters}
                  onChange={
                    handleFiltersChange
                  }
                  categories={categories}
                  brands={brands}
                  availability={
                    availability
                  }
                  priceBounds={
                    priceBounds
                  }
                  resultCount={
                    filteredProducts.length
                  }
                />
              }
            />

            {/* ==============================================
                FILTRES ACTIFS MOBILE
            ============================================== */}

            <CatalogActiveFilters
              locale={locale}
              filters={query.filters}
              onChange={
                handleFiltersChange
              }
              categories={categories}
              brands={brands}
              availability={
                availability
              }
            />

            {/* ==============================================
                GRILLE / LISTE DES PRODUITS
            ============================================== */}

            <CatalogProductGrid
              id="catalog-products"
              locale={locale}
              products={visibleProducts}
              view={query.view}
              hasActiveFilters={
                hasActiveFilters
              }
            />

            {/* ==============================================
                PAGINATION
            ============================================== */}

            <CatalogPagination
              locale={locale}
              currentPage={
                pagination.currentPage
              }
              totalItems={
                pagination.totalItems
              }
              pageSize={
                pagination.pageSize
              }
              onPageChange={
                handlePageChange
              }
              visibleCount={
                visibleCount
              }
              onLoadMore={
                handleLoadMore
              }
            />
          </div>
        </div>
      </div>

      {/* ====================================================
          7. SERVICES — BANDEAU MOBILE
          
          Le footer lui-même est déjà géré
          par SiteChrome.
      ==================================================== */}

      <div className="lg:hidden">
        <HomeServices locale={locale} />
      </div>
    </main>
  );
}

// ============================================================
// 8. PAGE AVEC SUSPENSE
// ============================================================
//
// Next.js 16 :
// useSearchParams est exécuté à l'intérieur de
// la frontière Suspense.
//
// La page n'ajoute aucun header ni footer.
//
// ============================================================

export default function ProductsPage() {
  return (
    <Suspense
      fallback={<CatalogPageFallback />}
    >
      <CatalogPageContent />
    </Suspense>
  );
}
