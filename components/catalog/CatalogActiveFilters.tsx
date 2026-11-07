
"use client";

import { useMemo } from "react";
import { X } from "lucide-react";

import type { SiteLocale } from "@/lib/site-i18n";

import type {
  CatalogFilterOption,
  CatalogFilterValues,
} from "@/components/catalog/CatalogSidebar";

// ============================================================
// CYCLORIVA — FILTRES ACTIFS DU CATALOGUE
// ============================================================
//
// Next.js 16 — React — TypeScript — Tailwind CSS 4
//
// VERSION MOBILE :
// - Étiquettes vert clair
// - Catégorie sélectionnée
// - Disponibilité sélectionnée
// - Marque sélectionnée
// - Prix minimum et maximum
// - Suppression individuelle
// - Bouton "Effacer tout"
//
// VERSION PC :
// - Masqué par défaut conformément à la maquette
// - Les filtres restent dans CatalogSidebar
//
// Les valeurs viennent du moteur du catalogue.
// Aucune donnée fictive.
//
// ============================================================

// ============================================================
// 1. TYPES PUBLICS
// ============================================================

export type CatalogActiveFiltersProps = {
  locale: SiteLocale;

  filters: CatalogFilterValues;

  onChange: (next: CatalogFilterValues) => void;

  categories?: CatalogFilterOption[];

  brands?: CatalogFilterOption[];

  availability?: CatalogFilterOption[];

  className?: string;

  showOnDesktop?: boolean;
};

type ActiveFilterKind =
  | "category"
  | "brand"
  | "availability"
  | "minPrice"
  | "maxPrice";

type ActiveFilterItem = {
  id: string;
  kind: ActiveFilterKind;
  value: string;
  label: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

type ActiveFilterTranslations = {
  filters: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  clearAll: string;
  remove: string;
  selected: string;
};

const translations: Record<
  SiteLocale,
  ActiveFilterTranslations
> = {
  fr: {
    filters: "Filtres actifs",
    brand: "Marques",
    minPrice: "Prix min.",
    maxPrice: "Prix max.",
    clearAll: "Effacer tout",
    remove: "Supprimer le filtre",
    selected: "Filtre sélectionné",
  },

  en: {
    filters: "Active filters",
    brand: "Brands",
    minPrice: "Min. price",
    maxPrice: "Max. price",
    clearAll: "Clear all",
    remove: "Remove filter",
    selected: "Selected filter",
  },

  de: {
    filters: "Aktive Filter",
    brand: "Marken",
    minPrice: "Mindestpreis",
    maxPrice: "Höchstpreis",
    clearAll: "Alle löschen",
    remove: "Filter entfernen",
    selected: "Ausgewählter Filter",
  },

  it: {
    filters: "Filtri attivi",
    brand: "Marche",
    minPrice: "Prezzo min.",
    maxPrice: "Prezzo max.",
    clearAll: "Cancella tutto",
    remove: "Rimuovi filtro",
    selected: "Filtro selezionato",
  },

  es: {
    filters: "Filtros activos",
    brand: "Marcas",
    minPrice: "Precio mín.",
    maxPrice: "Precio máx.",
    clearAll: "Borrar todo",
    remove: "Eliminar filtro",
    selected: "Filtro seleccionado",
  },
};

// ============================================================
// 3. CONFIGURATION DES LANGUES
// ============================================================

const numberLocales: Record<SiteLocale, string> = {
  fr: "fr-FR",
  en: "en-GB",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
};

function validLocale(
  locale: SiteLocale
): SiteLocale {
  return Object.prototype.hasOwnProperty.call(
    translations,
    locale
  )
    ? locale
    : "fr";
}

// ============================================================
// 4. FORMATAGE DES PRIX
// ============================================================

function formatPrice(
  value: number,
  locale: SiteLocale
): string {
  return new Intl.NumberFormat(
    numberLocales[locale],
    {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  ).format(value);
}

// ============================================================
// 5. RECHERCHE DU LIBELLÉ RÉEL
// ============================================================

function getOptionLabel(
  value: string,
  options: CatalogFilterOption[]
): string {
  const option = options.find(
    (item) => item.value === value
  );

  return option?.label || value;
}

// ============================================================
// 6. CONSTRUCTION DES ÉTIQUETTES
// ============================================================

function buildActiveFilters(
  filters: CatalogFilterValues,
  categories: CatalogFilterOption[],
  brands: CatalogFilterOption[],
  availability: CatalogFilterOption[],
  locale: SiteLocale
): ActiveFilterItem[] {
  const text = translations[locale];

  const items: ActiveFilterItem[] = [];

  // CATÉGORIES

  for (const value of filters.categories) {
    items.push({
      id: `category:${value}`,
      kind: "category",
      value,
      label: getOptionLabel(
        value,
        categories
      ),
    });
  }

  // DISPONIBILITÉS

  for (const value of filters.availability) {
    items.push({
      id: `availability:${value}`,
      kind: "availability",
      value,
      label: getOptionLabel(
        value,
        availability
      ),
    });
  }

  // MARQUES

  for (const value of filters.brands) {
    const brandName = getOptionLabel(
      value,
      brands
    );

    items.push({
      id: `brand:${value}`,
      kind: "brand",
      value,
      label: `${text.brand} : ${brandName}`,
    });
  }

  // PRIX MINIMUM

  if (
    filters.minPrice !== null &&
    Number.isFinite(filters.minPrice)
  ) {
    items.push({
      id: "price:min",
      kind: "minPrice",
      value: String(filters.minPrice),
      label: `${text.minPrice} : ${formatPrice(
        filters.minPrice,
        locale
      )}`,
    });
  }

  // PRIX MAXIMUM

  if (
    filters.maxPrice !== null &&
    Number.isFinite(filters.maxPrice)
  ) {
    items.push({
      id: "price:max",
      kind: "maxPrice",
      value: String(filters.maxPrice),
      label: `${text.maxPrice} : ${formatPrice(
        filters.maxPrice,
        locale
      )}`,
    });
  }

  return items;
}

// ============================================================
// 7. SUPPRESSION D'UN FILTRE
// ============================================================

function removeFilter(
  filters: CatalogFilterValues,
  item: ActiveFilterItem
): CatalogFilterValues {
  switch (item.kind) {
    case "category":
      return {
        ...filters,
        categories: filters.categories.filter(
          (value) => value !== item.value
        ),
      };

    case "brand":
      return {
        ...filters,
        brands: filters.brands.filter(
          (value) => value !== item.value
        ),
      };

    case "availability":
      return {
        ...filters,
        availability: filters.availability.filter(
          (value) => value !== item.value
        ),
      };

    case "minPrice":
      return {
        ...filters,
        minPrice: null,
      };

    case "maxPrice":
      return {
        ...filters,
        maxPrice: null,
      };
  }
}

// ============================================================
// 8. COMPOSANT PRINCIPAL
// ============================================================

export function CatalogActiveFilters({
  locale,
  filters,
  onChange,
  categories = [],
  brands = [],
  availability = [],
  className = "",
  showOnDesktop = false,
}: CatalogActiveFiltersProps) {
  const currentLocale = validLocale(locale);

  const text = translations[currentLocale];

  // ==========================================================
  // FILTRES À AFFICHER
  // ==========================================================

  const activeFilters = useMemo(
    () =>
      buildActiveFilters(
        filters,
        categories,
        brands,
        availability,
        currentLocale
      ),
    [
      filters,
      categories,
      brands,
      availability,
      currentLocale,
    ]
  );

  // ==========================================================
  // SUPPRESSION INDIVIDUELLE
  // ==========================================================

  function handleRemove(
    item: ActiveFilterItem
  ) {
    const nextFilters = removeFilter(
      filters,
      item
    );

    onChange(nextFilters);
  }

  // ==========================================================
  // EFFACER TOUS LES FILTRES
  // ==========================================================

  function handleClearAll() {
    onChange({
      categories: [],
      brands: [],
      availability: [],
      minPrice: null,
      maxPrice: null,
    });
  }

  // ==========================================================
  // AUCUN FILTRE ACTIF
  // ==========================================================

  if (activeFilters.length === 0) {
    return null;
  }

  // ==========================================================
  // AFFICHAGE PRINCIPAL
  // ==========================================================

  return (
    <section
      data-component="catalog-active-filters"
      aria-label={text.filters}
      className={[
        "w-full min-w-0",
        showOnDesktop
          ? "block"
          : "lg:hidden",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "flex w-full min-w-0",
          "flex-wrap items-center",
          "gap-x-2 gap-y-2.5",
          "py-2",
          "sm:gap-x-3",
        ].join(" ")}
      >
        {/* ==================================================
            ÉTIQUETTES DES FILTRES ACTIFS
        ================================================== */}

        {activeFilters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              handleRemove(item)
            }
            title={`${text.remove} : ${item.label}`}
            aria-label={`${text.remove} : ${item.label}`}
            className={[
              "group inline-flex",
              "min-h-8 max-w-full",
              "items-center justify-center",
              "gap-2 rounded-full",
              "border border-transparent",
              "bg-[#edf9e8]",
              "px-3 py-1.5",
              "text-[11px] font-semibold",
              "text-[#102b39]",
              "transition-colors",
              "hover:border-[#24b715]",
              "hover:bg-[#ddf5d1]",
              "focus-visible:outline-2",
              "focus-visible:outline-offset-2",
              "focus-visible:outline-[#24b715]",
              "sm:text-xs",
            ].join(" ")}
          >
            {/* NOM DU FILTRE */}

            <span className="min-w-0 wrap-break-word text-left">
              {item.label}
            </span>

            {/* CROIX DE SUPPRESSION */}

            <X
              aria-hidden="true"
              strokeWidth={2.2}
              className={[
                "h-3.5 w-3.5",
                "shrink-0",
                "text-[#102b39]",
                "transition-colors",
                "group-hover:text-[#187c13]",
              ].join(" ")}
            />
          </button>
        ))}

        {/* ==================================================
            EFFACER TOUS LES FILTRES
        ================================================== */}

        <button
          type="button"
          onClick={handleClearAll}
          className={[
            "ml-auto",
            "inline-flex min-h-8",
            "shrink-0 items-center",
            "justify-center",
            "px-1 py-1",
            "text-[11px] font-bold",
            "text-[#187c13]",
            "underline underline-offset-2",
            "transition-colors",
            "hover:text-[#24b715]",
            "focus-visible:outline-2",
            "focus-visible:outline-offset-2",
            "focus-visible:outline-[#24b715]",
            "sm:text-xs",
          ].join(" ")}
        >
          {text.clearAll}
        </button>
      </div>
    </section>
  );
}

export default CatalogActiveFilters;
