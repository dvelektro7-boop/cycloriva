
"use client";

import { useMemo } from "react";

import {
  Bike,
  Building2,
  Grid2X2,
  HardHat,
  Mountain,
  Zap,
} from "lucide-react";

import type { SiteLocale } from "@/lib/site-i18n";

import type {
  CatalogFilterOption,
  CatalogFilterValues,
} from "@/components/catalog/CatalogSidebar";

// ============================================================
// CYCLORIVA — CATÉGORIES DU CATALOGUE MOBILE
// ============================================================
//
// Next.js 16 — React — TypeScript — Tailwind CSS 4
//
// Architecture mobile :
// - 6 boutons avec icônes
// - Tous
// - Vélos électriques
// - VTT
// - Vélos cargo
// - Vélos de ville
// - Accessoires
//
// Architecture PC :
// - Masqué dès lg (1024 px)
// - CatalogSidebar prend le relais
//
// Fonctionnement :
// - Une catégorie principale sélectionnée
// - Conservation des autres filtres
// - Réinitialisation de la pagination par le parent
// - Aucune donnée produit inventée
//
// ============================================================

// ============================================================
// TYPES
// ============================================================

export type CatalogMobileCategoryKey =
  | "electric"
  | "mtb"
  | "cargo"
  | "city"
  | "accessories";

export type CatalogMobileCategoryOption =
  CatalogFilterOption & {
    key: CatalogMobileCategoryKey;
  };

export type CatalogMobileCategoriesProps = {
  locale: SiteLocale;

  filters: CatalogFilterValues;

  onChange: (
    filters: CatalogFilterValues
  ) => void;

  categories: CatalogMobileCategoryOption[];

  className?: string;
};

// ============================================================
// TRADUCTIONS
// ============================================================

type CategoryTranslations = {
  all: string;
  electric: string;
  mtb: string;
  cargo: string;
  city: string;
  accessories: string;
  navigationLabel: string;
};

const translations: Record<
  SiteLocale,
  CategoryTranslations
> = {
  fr: {
    all: "Tous",
    electric: "Vélos électriques",
    mtb: "VTT",
    cargo: "Vélos cargo",
    city: "Vélos de ville",
    accessories: "Accessoires",
    navigationLabel: "Catégories de produits",
  },

  en: {
    all: "All",
    electric: "Electric bikes",
    mtb: "Mountain bikes",
    cargo: "Cargo bikes",
    city: "City bikes",
    accessories: "Accessories",
    navigationLabel: "Product categories",
  },

  de: {
    all: "Alle",
    electric: "E-Bikes",
    mtb: "Mountainbikes",
    cargo: "Lastenräder",
    city: "Citybikes",
    accessories: "Zubehör",
    navigationLabel: "Produktkategorien",
  },

  it: {
    all: "Tutti",
    electric: "Bici elettriche",
    mtb: "Mountain bike",
    cargo: "Bici cargo",
    city: "Bici da città",
    accessories: "Accessori",
    navigationLabel: "Categorie di prodotti",
  },

  es: {
    all: "Todos",
    electric: "Bicicletas eléctricas",
    mtb: "Bicicletas de montaña",
    cargo: "Bicicletas de carga",
    city: "Bicicletas urbanas",
    accessories: "Accesorios",
    navigationLabel: "Categorías de productos",
  },
};

// ============================================================
// CONFIGURATION VISUELLE
// ============================================================

const categoryDefinitions = [
  {
    key: "electric",
    icon: Zap,
  },
  {
    key: "mtb",
    icon: Mountain,
  },
  {
    key: "cargo",
    icon: Bike,
  },
  {
    key: "city",
    icon: Building2,
  },
  {
    key: "accessories",
    icon: HardHat,
  },
] as const;

// ============================================================
// NORMALISATION DE LA LANGUE
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

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export function CatalogMobileCategories({
  locale,
  filters,
  onChange,
  categories,
  className = "",
}: CatalogMobileCategoriesProps) {
  const currentLocale = getValidLocale(locale);

  const text = translations[currentLocale];

  // ==========================================================
  // ASSOCIER LES CATÉGORIES AUX VALEURS DU CATALOGUE
  // ==========================================================

  const categoryMap = useMemo(() => {
    const result = new Map<
      CatalogMobileCategoryKey,
      CatalogMobileCategoryOption
    >();

    for (const category of categories) {
      if (
        category.value.trim() !== "" &&
        !result.has(category.key)
      ) {
        result.set(category.key, category);
      }
    }

    return result;
  }, [categories]);

  // ==========================================================
  // CATÉGORIES ACTIVES
  // ==========================================================

  const selectedCategories = filters.categories;

  const allSelected =
    selectedCategories.length === 0;

  // ==========================================================
  // MISE À JOUR
  // ==========================================================

  function selectAll() {
    if (allSelected) return;

    onChange({
      ...filters,
      categories: [],
    });
  }

  function selectCategory(
    category: CatalogMobileCategoryOption
  ) {
    const alreadySelected =
      selectedCategories.length === 1 &&
      selectedCategories[0] === category.value;

    onChange({
      ...filters,
      categories: alreadySelected
        ? []
        : [category.value],
    });
  }

  // ==========================================================
  // STYLES COMMUNS
  // ==========================================================

  const cardBase = [
    "group relative",
    "flex min-w-0 flex-col",
    "items-center justify-center",
    "gap-2",
    "rounded-xl",
    "border",
    "px-1.5 py-3",
    "text-center",
    "transition-colors duration-150",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-[#24b715]",
  ].join(" ");

  const cardSelected = [
    "border-[#24b715]",
    "bg-[#f0fbe9]",
    "text-[#102b39]",
    "shadow-sm",
  ].join(" ");

  const cardDefault = [
    "border-slate-200",
    "bg-[#f7f8f9]",
    "text-[#102b39]",
    "shadow-sm",
    "hover:border-[#24b715]",
    "hover:bg-[#f3fbea]",
  ].join(" ");

  // ==========================================================
  // RENDU
  // ==========================================================

  return (
    <nav
      data-component="catalog-mobile-categories"
      aria-label={text.navigationLabel}
      className={[
        "w-full bg-white",
        "py-3",
        "lg:hidden",
        className,
      ].join(" ")}
    >
      <div className="cycloriva-container">
        {/* La rangée défile uniquement si l'écran
            ne permet pas d'afficher les 6 catégories. */}

        <div className="overflow-x-auto pb-1">
          <div
            className={[
              "grid min-w-140 grid-cols-6",
              "gap-2",
              "min-[400px]:min-w-0",
              "sm:gap-3",
            ].join(" ")}
          >
            {/* ============================================
                TOUS LES PRODUITS
            ============================================ */}

            <button
              type="button"
              aria-pressed={allSelected}
              onClick={selectAll}
              className={[
                cardBase,
                allSelected
                  ? cardSelected
                  : cardDefault,
              ].join(" ")}
            >
              <Grid2X2
                aria-hidden="true"
                className={[
                  "h-6 w-6 shrink-0",
                  allSelected
                    ? "text-[#24b715]"
                    : "text-[#102b39]",
                ].join(" ")}
                strokeWidth={2}
              />

              <span
                className={[
                  "flex min-h-8 items-center",
                  "justify-center",
                  "text-[10px] font-bold",
                  "leading-tight",
                  "sm:text-xs",
                ].join(" ")}
              >
                {text.all}
              </span>
            </button>

            {/* ============================================
                LES 5 CATÉGORIES
            ============================================ */}

            {categoryDefinitions.map(
              (definition) => {
                const category = categoryMap.get(
                  definition.key
                );

                const Icon = definition.icon;

                const selected =
                  category !== undefined &&
                  selectedCategories.includes(
                    category.value
                  );

                const disabled =
                  category === undefined ||
                  category.disabled === true ||
                  (category.count <= 0 && !selected);

                return (
                  <button
                    key={definition.key}
                    type="button"
                    disabled={disabled}
                    aria-pressed={selected}
                    onClick={() => {
                      if (category) {
                        selectCategory(category);
                      }
                    }}
                    className={[
                      cardBase,
                      selected
                        ? cardSelected
                        : cardDefault,
                      "disabled:cursor-not-allowed",
                      "disabled:opacity-45",
                    ].join(" ")}
                  >
                    <Icon
                      aria-hidden="true"
                      className={[
                        "h-6 w-6 shrink-0",
                        selected
                          ? "text-[#24b715]"
                          : "text-[#102b39]",
                      ].join(" ")}
                      strokeWidth={1.9}
                    />

                    <span
                      className={[
                        "flex min-h-8 items-center",
                        "justify-center",
                        "text-[10px] font-bold",
                        "leading-tight",
                        "sm:text-xs",
                      ].join(" ")}
                    >
                      {text[definition.key]}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default CatalogMobileCategories;
