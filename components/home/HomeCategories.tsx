import Image from "next/image";

import Link from "next/link";
import { ArrowRight, Bike, Package } from "lucide-react";

import { allProducts, getCatalogCategories, type Product } from "@/lib/catalog";

import {
  resolveLocale,
  siteText,
  type SiteLocale,
  type SiteTextKey,
} from "@/lib/site-i18n";

// =====================================================
// CYCLORIVA — CATÉGORIES DE LA PAGE D'ACCUEIL
// =====================================================
// PC : 5 cartes sur une ligne
// Mobile : 3 cartes, puis 2 cartes
// Images : véritables produits du catalogue
// Langues : FR, EN, DE, IT, ES
// =====================================================

type CategoryKey = "electric" | "mtb" | "cargo" | "city" | "accessories";

type CategoryConfig = {
  key: CategoryKey;
  search: string;
  keywords: string[];
};

type HomeCategoriesProps = {
  locale: SiteLocale;
};

type HomeCategoryCard = {
  key: CategoryKey;
  label: string;
  href: string;
  image: string | null;
};

// =====================================================
// CATÉGORIES OFFICIELLES
// =====================================================

const categoryConfigs: CategoryConfig[] = [
  {
    key: "electric",
    search: "électrique",
    keywords: [
      "velo electrique",
      "velos electriques",
      "electrique",
      "vae",
      "e-bike",
      "ebike",
      "electric bike",
    ],
  },
  {
    key: "mtb",
    search: "VTT",
    keywords: [
      "vtt",
      "mountain bike",
      "mountainbike",
      "all mountain",
      "enduro",
    ],
  },
  {
    key: "cargo",
    search: "cargo",
    keywords: ["cargo", "longtail", "biporteur", "triporteur", "lastenrad"],
  },
  {
    key: "city",
    search: "ville",
    keywords: [
      "velo de ville",
      "velos de ville",
      "velo urbain",
      "city bike",
      "citybike",
      "urban bike",
      "hollandais",
    ],
  },
  {
    key: "accessories",
    search: "accessoire",
    keywords: [
      "accessoire",
      "accessoires",
      "accessory",
      "accessories",
      "casque",
      "helmet",
      "antivol",
      "equipement",
    ],
  },
];

// =====================================================
// TRADUCTIONS DU TITRE
// =====================================================

const headings: Record<SiteLocale, string> = {
  fr: "Nos catégories",
  en: "Our categories",
  de: "Unsere Kategorien",
  it: "Le nostre categorie",
  es: "Nuestras categorías",
};

// =====================================================
// NORMALISATION DES TEXTES
// =====================================================

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// =====================================================
// COMPARAISON DES CATÉGORIES
// =====================================================

function categoryMatches(name: string, keywords: string[]): boolean {
  const normalizedName = normalizeText(name);

  return keywords.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword);

    return (
      normalizedKeyword.length > 0 && normalizedName.includes(normalizedKeyword)
    );
  });
}

// =====================================================
// SÉLECTION D'UNE IMAGE DU CATALOGUE
// =====================================================

function getCategoryImage(names: string[], products: Product[]): string | null {
  const matchingProducts = products.filter((product) =>
    product.categories.some((category) => names.includes(category)),
  );

  // Priorité aux images locales déjà récupérées.
  for (const product of matchingProducts) {
    const localImage = product.images.find(
      (image) => image.startsWith("/") && !image.startsWith("//"),
    );

    if (localImage) {
      return localImage;
    }
  }

  // Sinon, utiliser l'URL réelle du catalogue.
  for (const product of matchingProducts) {
    const image = product.images.find(
      (value) => value.startsWith("https://") || value.startsWith("http://"),
    );

    if (image) {
      return image;
    }
  }

  return null;
}

// =====================================================
// CONSTRUCTION DES CINQ CATÉGORIES
// =====================================================

function buildCategories(locale: SiteLocale): HomeCategoryCard[] {
  const catalogCategories = getCatalogCategories();

  return categoryConfigs.map((config) => {
    const matchingCategories = catalogCategories.filter((category) =>
      categoryMatches(category.name, config.keywords),
    );

    const matchingNames = matchingCategories.map((category) => category.name);

    const image = getCategoryImage(matchingNames, allProducts);

    const params = new URLSearchParams({
      q: config.search,
    });

    return {
      key: config.key,

      label: siteText(locale, config.key as SiteTextKey),

      href: `/${locale}/produits?${params.toString()}`,

      image,
    };
  });
}

// =====================================================
// COMPOSANT PRINCIPAL
// =====================================================

export function HomeCategories({ locale }: HomeCategoriesProps) {
  const currentLocale = resolveLocale(locale);

  const categories = buildCategories(currentLocale);

  return (
    <section
      id="categories"
      aria-labelledby="home-categories-title"
      className="w-full bg-white py-5 sm:py-7"
    >
      <div className="cycloriva-container">
        {/* TITRE */}
        <div className="mb-4 sm:mb-5">
          <h2
            id="home-categories-title"
            className="text-xl font-extrabold tracking-tight text-[#102b39] sm:text-2xl"
          >
            {headings[currentLocale]}
          </h2>

          <div
            aria-hidden="true"
            className="mt-1.5 h-0.75 w-9 rounded-full bg-[#24b715]"
          />
        </div>

        {/* GRILLE PC ET MOBILE */}
        <div className="grid grid-cols-6 gap-2 sm:gap-3 lg:grid-cols-5 lg:gap-4">
          {categories.map((category, index) => {
            const gridClass =
              index >= 3
                ? "col-span-3 lg:col-span-1"
                : "col-span-2 lg:col-span-1";

            return (
              <Link
                key={category.key}
                href={category.href}
                aria-label={category.label}
                className={`
                  group relative
                  ${gridClass}
                  flex min-h-29.5 flex-col
                  overflow-hidden rounded-xl
                  border border-[#e7edf1]
                  bg-[#f3f7f9]
                  p-2.5
                  transition-all duration-200
                  hover:border-[#24b715]
                  hover:bg-[#edf8ea]
                  hover:shadow-md
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-[#24b715]
                  sm:min-h-32.5
                  sm:p-3
                  lg:min-h-25
                  lg:flex-row
                  lg:items-center
                  lg:gap-3
                `}
              >
                {/* IMAGE */}
                <div
                  className="relative 
                    flex h-16.5 w-full
                    shrink-0 items-center justify-center
                    overflow-hidden
                    sm:h-19
                    lg:h-19.5
                    lg:w-[47%]
                  "
                >
                  {category.image ? (
                    <Image
                      fill
                      sizes="(max-width: 639px) 25vw, (max-width: 1023px) 20vw, 10vw"
                      unoptimized={
                        !category.image.startsWith("/") ||
                        category.image.startsWith("//")
                      }
                      src={category.image}
                      alt={category.label}
                      loading="lazy"
                      className="
                        h-full w-full
                        object-contain
                        transition-transform duration-300
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex h-full w-full
                        items-center justify-center
                        text-[#70808b]
                      "
                    >
                      {category.key === "accessories" ? (
                        <Package
                          size={36}
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                      ) : (
                        <Bike size={42} strokeWidth={1.4} aria-hidden="true" />
                      )}
                    </div>
                  )}
                </div>

                {/* NOM ET FLÈCHE */}
                <div
                  className="
                    flex w-full min-w-0
                    items-end justify-between
                    gap-1
                    lg:flex-1
                    lg:items-center
                  "
                >
                  <h3
                    className="
                      min-w-0 flex-1
                      text-[11px] font-extrabold
                      leading-tight
                      text-[#102b39]
                      sm:text-sm
                      lg:text-[13px]
                    "
                  >
                    {category.label}
                  </h3>

                  <span
                    aria-hidden="true"
                    className="
                      flex h-6 w-6
                      shrink-0 items-center
                      justify-center rounded-full
                      bg-[#24b715]
                      text-white
                      transition-colors
                      group-hover:bg-[#168e0a]
                      sm:h-7 sm:w-7
                    "
                  >
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HomeCategories;
