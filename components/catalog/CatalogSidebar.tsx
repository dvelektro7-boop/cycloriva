
"use client";

import { useMemo, useState } from "react";
import { CatalogPriceFilter } from "./CatalogPriceFilter";
import {
  ChevronDown,
  RotateCcw,
} from "lucide-react";

import type { SiteLocale } from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — FILTRES DU CATALOGUE
// ============================================================
//
// Next.js 16 — React — TypeScript — Tailwind CSS 4
//
// PC : panneau latéral gauche.
// Mobile : contenu réutilisable dans un tiroir.
//
// Aucune donnée commerciale inventée.
// Les options et leurs compteurs viennent du parent.
//
// ============================================================

// ============================================================
// TYPES PUBLICS
// ============================================================

export type CatalogFilterOption = {
  value: string;
  label: string;
  count: number;
  disabled?: boolean;
};

export type CatalogPriceBounds = {
  min: number;
  max: number;
};

export type CatalogFilterValues = {
  categories: string[];
  brands: string[];
  availability: string[];
  minPrice: number | null;
  maxPrice: number | null;
};

export type CatalogSidebarProps = {
  locale: SiteLocale;

  filters: CatalogFilterValues;

  onChange: (next: CatalogFilterValues) => void;

  categories: CatalogFilterOption[];
  brands: CatalogFilterOption[];
  availability: CatalogFilterOption[];

  priceBounds: CatalogPriceBounds;

  mode?: "desktop" | "mobile";

  className?: string;

  onReset?: () => void;
};

// ============================================================
// VALEUR INITIALE EXPORTÉE
// ============================================================

export const EMPTY_CATALOG_FILTERS: CatalogFilterValues = {
  categories: [],
  brands: [],
  availability: [],
  minPrice: null,
  maxPrice: null,
};

// ============================================================
// TRADUCTIONS
// ============================================================

type SidebarText = {
  filters: string;
  categories: string;
  price: string;
  brands: string;
  availability: string;
  min: string;
  max: string;
  moreBrands: string;
  fewerBrands: string;
  reset: string;
  noCategories: string;
  noBrands: string;
  noAvailability: string;
  noPrices: string;
  euro: string;
};

const translations: Record<SiteLocale, SidebarText> = {
  fr: {
    filters: "Filtres",
    categories: "Catégories",
    price: "Prix",
    brands: "Marque",
    availability: "Disponibilité",
    min: "Min",
    max: "Max",
    moreBrands: "Voir plus de marques",
    fewerBrands: "Voir moins de marques",
    reset: "Réinitialiser les filtres",
    noCategories: "Aucune catégorie disponible",
    noBrands: "Aucune marque disponible",
    noAvailability: "Disponibilité non renseignée",
    noPrices: "Prix non disponibles",
    euro: "EUR",
  },

  en: {
    filters: "Filters",
    categories: "Categories",
    price: "Price",
    brands: "Brand",
    availability: "Availability",
    min: "Min",
    max: "Max",
    moreBrands: "View more brands",
    fewerBrands: "View fewer brands",
    reset: "Reset filters",
    noCategories: "No categories available",
    noBrands: "No brands available",
    noAvailability: "Availability not provided",
    noPrices: "Prices unavailable",
    euro: "EUR",
  },

  de: {
    filters: "Filter",
    categories: "Kategorien",
    price: "Preis",
    brands: "Marke",
    availability: "Verfügbarkeit",
    min: "Min",
    max: "Max",
    moreBrands: "Weitere Marken anzeigen",
    fewerBrands: "Weniger Marken anzeigen",
    reset: "Filter zurücksetzen",
    noCategories: "Keine Kategorien verfügbar",
    noBrands: "Keine Marken verfügbar",
    noAvailability: "Verfügbarkeit nicht angegeben",
    noPrices: "Preise nicht verfügbar",
    euro: "EUR",
  },

  it: {
    filters: "Filtri",
    categories: "Categorie",
    price: "Prezzo",
    brands: "Marca",
    availability: "Disponibilità",
    min: "Min",
    max: "Max",
    moreBrands: "Mostra altre marche",
    fewerBrands: "Mostra meno marche",
    reset: "Reimposta filtri",
    noCategories: "Nessuna categoria disponibile",
    noBrands: "Nessuna marca disponibile",
    noAvailability: "Disponibilità non indicata",
    noPrices: "Prezzi non disponibili",
    euro: "EUR",
  },

  es: {
    filters: "Filtros",
    categories: "Categorías",
    price: "Precio",
    brands: "Marca",
    availability: "Disponibilidad",
    min: "Mín",
    max: "Máx",
    moreBrands: "Ver más marcas",
    fewerBrands: "Ver menos marcas",
    reset: "Restablecer filtros",
    noCategories: "No hay categorías disponibles",
    noBrands: "No hay marcas disponibles",
    noAvailability: "Disponibilidad no indicada",
    noPrices: "Precios no disponibles",
    euro: "EUR",
  },
};

// ============================================================
// FONCTIONS UTILITAIRES
// ============================================================

function normalizeCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

function normalizeBounds(
  bounds: CatalogPriceBounds
): CatalogPriceBounds | null {
  if (
    !Number.isFinite(bounds.min) ||
    !Number.isFinite(bounds.max) ||
    bounds.min < 0 ||
    bounds.max < bounds.min
  ) {
    return null;
  }

  return {
    min: bounds.min,
    max: bounds.max,
  };
}

function toggleValue(
  values: string[],
  value: string
): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function hasFilters(
  filters: CatalogFilterValues
): boolean {
  return (
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.availability.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null
  );
}

// ============================================================
// TITRE DE SECTION
// ============================================================

function FilterSectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-0.75 w-5 shrink-0 rounded-full bg-[#24b715]"
      />

      <h3 className="text-sm font-extrabold text-[#102b39]">
        {children}
      </h3>
    </div>
  );
}

// ============================================================
// OPTIONS À COCHER
// ============================================================

type FilterCheckboxGroupProps = {
  options: CatalogFilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  emptyMessage: string;
  locale: SiteLocale;
  name: string;
};

function FilterCheckboxGroup({
  options,
  selected,
  onToggle,
  emptyMessage,
  locale,
  name,
}: FilterCheckboxGroupProps) {
  if (options.length === 0) {
    return (
      <p className="text-xs leading-5 text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const checked = selected.includes(option.value);

        const count = normalizeCount(option.count);

        const disabled =
          option.disabled === true ||
          (count === 0 && !checked);

        return (
          <label
            key={`${name}-${option.value}`}
            className={[
              "flex min-w-0 items-center justify-between gap-2",
              "text-xs leading-5",
              disabled
                ? "cursor-not-allowed text-slate-400"
                : "cursor-pointer text-[#102b39]",
            ].join(" ")}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <input
                type="checkbox"
                name={name}
                value={option.value}
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(option.value)}
                className={[
                  "h-4 w-4 shrink-0 rounded",
                  "border border-slate-400",
                  "accent-[#24b715]",
                  "focus-visible:outline-2",
                  "focus-visible:outline-offset-2",
                  "focus-visible:outline-[#24b715]",
                ].join(" ")}
              />

              <span className="min-w-0 wrap-break-word font-medium">
                {option.label}
              </span>
            </span>

            <span className="shrink-0 text-[11px] tabular-nums text-slate-500">
              (
              {new Intl.NumberFormat(locale).format(
                count
              )}
              )
            </span>
          </label>
        );
      })}
    </div>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export function CatalogSidebar({
  locale,
  filters,
  onChange,
  categories,
  brands,
  availability,
  priceBounds,
  mode = "desktop",
  className = "",
  onReset,
}: CatalogSidebarProps) {
  const [showAllBrands, setShowAllBrands] =
    useState(false);

  const currentLocale: SiteLocale =
    Object.prototype.hasOwnProperty.call(
      translations,
      locale
    )
      ? locale
      : "fr";

  const text = translations[currentLocale];

  const validBounds = normalizeBounds(priceBounds);

  const sortedBrands = useMemo(
    () =>
      [...brands].sort((a, b) =>
        a.label.localeCompare(
          b.label,
          currentLocale,
          { sensitivity: "base" }
        )
      ),
    [brands, currentLocale]
  );

  const visibleBrands = showAllBrands
    ? sortedBrands
    : sortedBrands.filter(
        (brand, index) =>
          index < 6 ||
          filters.brands.includes(brand.value)
      );

  // ==========================================================
  // MISE À JOUR DES FILTRES
  // ==========================================================

  function updateCategories(value: string) {
    onChange({
      ...filters,
      categories: toggleValue(
        filters.categories,
        value
      ),
    });
  }

  function updateBrands(value: string) {
    onChange({
      ...filters,
      brands: toggleValue(filters.brands, value),
    });
  }

  function updateAvailability(value: string) {
    onChange({
      ...filters,
      availability: toggleValue(
        filters.availability,
        value
      ),
    });
  }

  function resetAll() {
    onChange({
      categories: [],
      brands: [],
      availability: [],
      minPrice: null,
      maxPrice: null,
    });

    setShowAllBrands(false);
    onReset?.();
  }

  // ==========================================================
  // AFFICHAGE
  // ==========================================================

  return (
    <aside
      data-component="catalog-sidebar"
      aria-label={text.filters}
      className={[
        mode === "desktop"
          ? "hidden self-start lg:block"
          : "block w-full",
        "min-w-0",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "w-full bg-white",
          mode === "desktop"
            ? "rounded-xl border border-slate-200 px-4 py-4 shadow-sm"
            : "px-1 py-3",
        ].join(" ")}
      >
        {/* ==================================================
            CATÉGORIES
        ================================================== */}

        <section
          aria-labelledby={`catalog-${mode}-categories`}
          className="pb-4"
        >
          <div id={`catalog-${mode}-categories`}>
            <FilterSectionTitle>
              {text.categories}
            </FilterSectionTitle>
          </div>

          <FilterCheckboxGroup
            name={`catalog-${mode}-categories`}
            options={categories}
            selected={filters.categories}
            onToggle={updateCategories}
            emptyMessage={text.noCategories}
            locale={currentLocale}
          />
        </section>

        <div className="border-t border-slate-200" />

        {/* ==================================================
            FILTRE DE PRIX
        ================================================== */}

        <section
          aria-labelledby={`catalog-${mode}-price`}
          className="py-4"
        >
          <div id={`catalog-${mode}-price`}>
            <FilterSectionTitle>
              {text.price}
            </FilterSectionTitle>
          </div>

          {!validBounds ? (
            <p className="text-xs text-slate-500">
              {text.noPrices}
            </p>
          ) : (
            <CatalogPriceFilter
              bounds={validBounds}
              min={filters.minPrice}
              max={filters.maxPrice}
              locale={currentLocale}
              minLabel={text.min}
              maxLabel={text.max}
              onChange={(minPrice, maxPrice) => onChange({ ...filters, minPrice, maxPrice })}
            />
          )}

        </section>

        <div className="border-t border-slate-200" />

        {/* ==================================================
            MARQUES
        ================================================== */}

        <section
          aria-labelledby={`catalog-${mode}-brands`}
          className="py-4"
        >
          <div id={`catalog-${mode}-brands`}>
            <FilterSectionTitle>
              {text.brands}
            </FilterSectionTitle>
          </div>

          <FilterCheckboxGroup
            name={`catalog-${mode}-brands`}
            options={visibleBrands}
            selected={filters.brands}
            onToggle={updateBrands}
            emptyMessage={text.noBrands}
            locale={currentLocale}
          />

          {sortedBrands.length > 6 && (
            <button
              type="button"
              aria-expanded={showAllBrands}
              onClick={() =>
                setShowAllBrands((previous) => !previous)
              }
              className={[
                "mt-3 inline-flex items-center gap-1",
                "text-xs font-semibold",
                "text-[#187c13] underline",
                "underline-offset-2",
                "transition-colors",
                "hover:text-[#24b715]",
                "focus-visible:outline-2",
                "focus-visible:outline-offset-2",
                "focus-visible:outline-[#24b715]",
              ].join(" ")}
            >
              {showAllBrands
                ? text.fewerBrands
                : text.moreBrands}

              <ChevronDown
                aria-hidden="true"
                className={[
                  "h-3.5 w-3.5",
                  "transition-transform",
                  showAllBrands
                    ? "rotate-180"
                    : "",
                ].join(" ")}
              />
            </button>
          )}
        </section>

        <div className="border-t border-slate-200" />

        {/* ==================================================
            DISPONIBILITÉ
        ================================================== */}

        <section
          aria-labelledby={`catalog-${mode}-availability`}
          className="py-4"
        >
          <div id={`catalog-${mode}-availability`}>
            <FilterSectionTitle>
              {text.availability}
            </FilterSectionTitle>
          </div>

          <FilterCheckboxGroup
            name={`catalog-${mode}-availability`}
            options={availability}
            selected={filters.availability}
            onToggle={updateAvailability}
            emptyMessage={text.noAvailability}
            locale={currentLocale}
          />
        </section>

        {/* ==================================================
            RÉINITIALISATION
        ================================================== */}

        <button
          type="button"
          onClick={resetAll}
          disabled={!hasFilters(filters)}
          className={[
            "inline-flex min-h-10 w-full",
            "items-center justify-center gap-2",
            "rounded-lg",
            "border border-slate-300",
            "bg-white px-3 py-2",
            "text-xs font-bold text-[#102b39]",
            "transition-colors",
            "hover:border-[#24b715]",
            "hover:bg-[#edf9e8]",
            "focus-visible:outline-2",
            "focus-visible:outline-offset-2",
            "focus-visible:outline-[#24b715]",
            "disabled:cursor-not-allowed",
            "disabled:opacity-50",
          ].join(" ")}
        >
          <RotateCcw
            aria-hidden="true"
            className="h-4 w-4"
            strokeWidth={2}
          />

          <span>{text.reset}</span>
        </button>
      </div>
    </aside>
  );
}

export default CatalogSidebar;
