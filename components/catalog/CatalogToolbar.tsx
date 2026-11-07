
"use client";

import {
  useId,
  type ReactNode,
} from "react";

import {
  ChevronDown,
  LayoutGrid,
  List,
} from "lucide-react";

import type { SiteLocale } from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — BARRE D'OUTILS DU CATALOGUE
// ============================================================
//
// Next.js 16 — React — TypeScript — Tailwind CSS 4
//
// VERSION PC :
// - Titre "Tous les produits"
// - Nombre réel de produits
// - Bouton affichage grille
// - Bouton affichage liste
// - Menu de tri
//
// VERSION MOBILE :
// - Bouton Filtres à gauche
// - Menu de tri à droite
// - Aucune duplication des filtres
//
// Langues : français, anglais, allemand,
// italien et espagnol.
//
// Les données sont transmises par la page catalogue.
// Aucun compteur fictif.
//
// ============================================================

// ============================================================
// 1. TYPES EXPORTÉS
// ============================================================

export type CatalogSort =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export type CatalogView = "grid" | "list";

export type CatalogToolbarProps = {
  locale: SiteLocale;

  resultCount: number;

  sort: CatalogSort;

  onSortChange: (sort: CatalogSort) => void;

  view: CatalogView;

  onViewChange: (view: CatalogView) => void;

  /**
   * Emplacement réservé au composant
   * CatalogMobileFilters existant.
   *
   * Le parent transmet son bouton de filtres
   * directement, sans duplication.
   */
  mobileFilters?: ReactNode;

  className?: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

type ToolbarTranslations = {
  title: string;
  product: string;
  products: string;
  sortBy: string;
  relevance: string;
  priceAsc: string;
  priceDesc: string;
  nameAsc: string;
  nameDesc: string;
  gridView: string;
  listView: string;
  displayOptions: string;
};

const translations: Record<
  SiteLocale,
  ToolbarTranslations
> = {
  fr: {
    title: "Tous les produits",
    product: "produit",
    products: "produits",
    sortBy: "Trier par",
    relevance: "Pertinence",
    priceAsc: "Prix croissant",
    priceDesc: "Prix décroissant",
    nameAsc: "Nom : A à Z",
    nameDesc: "Nom : Z à A",
    gridView: "Affichage en grille",
    listView: "Affichage en liste",
    displayOptions: "Mode d'affichage",
  },

  en: {
    title: "All products",
    product: "product",
    products: "products",
    sortBy: "Sort by",
    relevance: "Relevance",
    priceAsc: "Price: low to high",
    priceDesc: "Price: high to low",
    nameAsc: "Name: A to Z",
    nameDesc: "Name: Z to A",
    gridView: "Grid view",
    listView: "List view",
    displayOptions: "Display options",
  },

  de: {
    title: "Alle Produkte",
    product: "Produkt",
    products: "Produkte",
    sortBy: "Sortieren nach",
    relevance: "Relevanz",
    priceAsc: "Preis aufsteigend",
    priceDesc: "Preis absteigend",
    nameAsc: "Name: A bis Z",
    nameDesc: "Name: Z bis A",
    gridView: "Rasteransicht",
    listView: "Listenansicht",
    displayOptions: "Ansichtsoptionen",
  },

  it: {
    title: "Tutti i prodotti",
    product: "prodotto",
    products: "prodotti",
    sortBy: "Ordina per",
    relevance: "Rilevanza",
    priceAsc: "Prezzo crescente",
    priceDesc: "Prezzo decrescente",
    nameAsc: "Nome: dalla A alla Z",
    nameDesc: "Nome: dalla Z alla A",
    gridView: "Vista griglia",
    listView: "Vista elenco",
    displayOptions: "Opzioni di visualizzazione",
  },

  es: {
    title: "Todos los productos",
    product: "producto",
    products: "productos",
    sortBy: "Ordenar por",
    relevance: "Relevancia",
    priceAsc: "Precio ascendente",
    priceDesc: "Precio descendente",
    nameAsc: "Nombre: A a Z",
    nameDesc: "Nombre: Z a A",
    gridView: "Vista de cuadrícula",
    listView: "Vista de lista",
    displayOptions: "Opciones de visualización",
  },
};

// ============================================================
// 3. OPTIONS DE TRI
// ============================================================

const SORT_OPTIONS: {
  value: CatalogSort;
  labelKey: keyof Pick<
    ToolbarTranslations,
    | "relevance"
    | "priceAsc"
    | "priceDesc"
    | "nameAsc"
    | "nameDesc"
  >;
}[] = [
  {
    value: "relevance",
    labelKey: "relevance",
  },
  {
    value: "price-asc",
    labelKey: "priceAsc",
  },
  {
    value: "price-desc",
    labelKey: "priceDesc",
  },
  {
    value: "name-asc",
    labelKey: "nameAsc",
  },
  {
    value: "name-desc",
    labelKey: "nameDesc",
  },
];

// ============================================================
// 4. FONCTIONS UTILITAIRES
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

function normalizeCount(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.floor(value);
}

function formatCount(
  value: number,
  locale: SiteLocale
): string {
  const localeCodes: Record<SiteLocale, string> = {
    fr: "fr-FR",
    en: "en-GB",
    de: "de-DE",
    it: "it-IT",
    es: "es-ES",
  };

  return new Intl.NumberFormat(
    localeCodes[locale]
  ).format(value);
}

function isCatalogSort(
  value: string
): value is CatalogSort {
  return SORT_OPTIONS.some(
    (option) => option.value === value
  );
}

// ============================================================
// 5. SÉLECTEUR DE TRI
// ============================================================

type SortSelectProps = {
  locale: SiteLocale;
  sort: CatalogSort;
  onSortChange: (sort: CatalogSort) => void;
  variant: "desktop" | "mobile";
};

function SortSelect({
  locale,
  sort,
  onSortChange,
  variant,
}: SortSelectProps) {
  const selectId = useId();
  const text = translations[locale];

  const isMobile = variant === "mobile";

  return (
    <div
      className={[
        "flex min-w-0 items-center",
        isMobile
          ? "w-full"
          : "gap-3",
      ].join(" ")}
    >
      {/* ÉTIQUETTE PC */}

      {!isMobile && (
        <label
          htmlFor={selectId}
          className="shrink-0 text-xs font-bold text-[#102b39]"
        >
          {text.sortBy} :
        </label>
      )}

      {/* SÉLECTEUR */}

      <div
        className={[
          "relative min-w-0",
          isMobile
            ? "w-full"
            : "w-43",
        ].join(" ")}
      >
        {/* ÉTIQUETTE MOBILE */}

        {isMobile && (
          <label
            htmlFor={selectId}
            className={[
              "pointer-events-none absolute",
              "top-1/2 left-3 z-10",
              "-translate-y-1/2",
              "whitespace-nowrap",
              "text-[11px] font-semibold",
              "text-[#102b39]",
              "sm:text-xs",
            ].join(" ")}
          >
            {text.sortBy} :
          </label>
        )}

        <select
          id={selectId}
          name="catalog-sort"
          value={sort}
          onChange={(event) => {
            const next = event.target.value;

            if (isCatalogSort(next)) {
              onSortChange(next);
            }
          }}
          aria-label={
            isMobile ? text.sortBy : undefined
          }
          className={[
            "h-10 w-full min-w-0",
            "appearance-none rounded-lg",
            "border border-slate-300",
            "bg-white",
            "pr-8",
            "font-semibold text-[#102b39]",
            "outline-none",
            "transition-colors",
            "hover:border-[#24b715]",
            "focus:border-[#24b715]",
            "focus:ring-1",
            "focus:ring-[#24b715]",
            isMobile
              ? "pl-21 text-[11px] sm:pl-24 sm:text-xs"
              : "px-3 text-xs",
          ].join(" ")}
        >
          {SORT_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {text[option.labelKey]}
            </option>
          ))}
        </select>

        <ChevronDown
          aria-hidden="true"
          className={[
            "pointer-events-none",
            "absolute top-1/2 right-2.5",
            "h-4 w-4",
            "-translate-y-1/2",
            "text-[#102b39]",
          ].join(" ")}
          strokeWidth={2}
        />
      </div>
    </div>
  );
}

// ============================================================
// 6. BOUTONS GRILLE / LISTE
// ============================================================

type ViewSwitchProps = {
  locale: SiteLocale;
  view: CatalogView;
  onViewChange: (view: CatalogView) => void;
};

function ViewSwitch({
  locale,
  view,
  onViewChange,
}: ViewSwitchProps) {
  const text = translations[locale];

  const baseClass = [
    "inline-flex h-9 w-9",
    "shrink-0 items-center",
    "justify-center rounded-md",
    "border",
    "transition-colors",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-[#24b715]",
  ].join(" ");

  const activeClass = [
    "border-[#24b715]",
    "bg-[#24b715]",
    "text-white",
  ].join(" ");

  const inactiveClass = [
    "border-slate-200",
    "bg-white",
    "text-[#102b39]",
    "hover:border-[#24b715]",
    "hover:text-[#24b715]",
  ].join(" ");

  return (
    <div
      role="group"
      aria-label={text.displayOptions}
      className="flex items-center gap-2"
    >
      {/* GRILLE */}

      <button
        type="button"
        aria-label={text.gridView}
        aria-pressed={view === "grid"}
        title={text.gridView}
        onClick={() => onViewChange("grid")}
        className={[
          baseClass,
          view === "grid"
            ? activeClass
            : inactiveClass,
        ].join(" ")}
      >
        <LayoutGrid
          aria-hidden="true"
          className="h-4 w-4"
          strokeWidth={2}
        />
      </button>

      {/* LISTE */}

      <button
        type="button"
        aria-label={text.listView}
        aria-pressed={view === "list"}
        title={text.listView}
        onClick={() => onViewChange("list")}
        className={[
          baseClass,
          view === "list"
            ? activeClass
            : inactiveClass,
        ].join(" ")}
      >
        <List
          aria-hidden="true"
          className="h-4 w-4"
          strokeWidth={2}
        />
      </button>
    </div>
  );
}

// ============================================================
// 7. COMPOSANT PRINCIPAL
// ============================================================

export function CatalogToolbar({
  locale,
  resultCount,
  sort,
  onSortChange,
  view,
  onViewChange,
  mobileFilters,
  className = "",
}: CatalogToolbarProps) {
  const currentLocale = getValidLocale(locale);

  const text = translations[currentLocale];

  const count = normalizeCount(resultCount);

  const formattedCount = formatCount(
    count,
    currentLocale
  );

  const productLabel =
    count === 1
      ? text.product
      : text.products;

  return (
    <div
      data-component="catalog-toolbar"
      className={[
        "w-full min-w-0",
        className,
      ].join(" ")}
    >
      {/* ==================================================
          VERSION PC
      ================================================== */}

      <div
        className={[
          "hidden w-full min-w-0",
          "items-center justify-between",
          "gap-4 pb-3",
          "lg:flex",
        ].join(" ")}
      >
        {/* TITRE + COMPTEUR */}

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h2
              className={[
                "text-lg font-extrabold",
                "tracking-tight",
                "text-[#102b39]",
              ].join(" ")}
            >
              {text.title}
            </h2>

            <span
              aria-live="polite"
              className="text-sm font-medium text-[#102b39]"
            >
              ({formattedCount} {productLabel})
            </span>
          </div>

          <span
            aria-hidden="true"
            className="mt-1 block h-0.75 w-8 rounded-full bg-[#24b715]"
          />
        </div>

        {/* AFFICHAGE + TRI */}

        <div className="flex shrink-0 items-center gap-4">
          <ViewSwitch
            locale={currentLocale}
            view={view}
            onViewChange={onViewChange}
          />

          <span
            aria-hidden="true"
            className="h-7 w-px bg-slate-300"
          />

          <SortSelect
            locale={currentLocale}
            sort={sort}
            onSortChange={onSortChange}
            variant="desktop"
          />
        </div>
      </div>

      {/* ==================================================
          VERSION MOBILE ET TABLETTE
      ================================================== */}

      <div
        className={[
          "grid w-full min-w-0",
          "grid-cols-2",
          "items-center gap-3",
          "pb-3",
          "lg:hidden",
        ].join(" ")}
      >
        {/* BOUTON FILTRES */}

        <div className="min-w-0">
          {mobileFilters ?? (
            <div
              aria-hidden="true"
              className="h-11"
            />
          )}
        </div>

        {/* MENU DE TRI */}

        <div className="min-w-0">
          <SortSelect
            locale={currentLocale}
            sort={sort}
            onSortChange={onSortChange}
            variant="mobile"
          />
        </div>
      </div>
    </div>
  );
}

export default CatalogToolbar;
