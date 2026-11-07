import { getProductTranslations, PRODUCT_LOCALES } from "@/lib/product-i18n";

import Link from "next/link";

import {
  ChevronRight,
  House,
} from "lucide-react";

import type { SiteLocale } from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — FIL D'ARIANE DE LA FICHE PRODUIT
// ============================================================
//
// Next.js 16 — TypeScript — Tailwind CSS 4
//
// PC :
// Accueil > Tous les produits > Nom du produit
//
// Mobile :
// Accueil > Tous les produits > Nom du produit
//
// - Design responsive
// - Nom du produit tronqué si nécessaire
// - Liens de navigation fonctionnels
// - 5 langues : FR, EN, DE, IT, ES
// - Aucun produit fictif
// - Aucun footer ou header dupliqué
//
// ============================================================

// ============================================================
// 1. TYPES
// ============================================================

export type ProductBreadcrumbProps = {
  locale: SiteLocale;

  /**
   * Nom réel du produit provenant du catalogue.
   */
  productName: string;

  /**
   * Classes supplémentaires facultatives.
   */
  className?: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

type BreadcrumbText = {
  home: string;
  products: string;
  navigation: string;
  unnamedProduct: string;
};

const translations = Object.fromEntries(PRODUCT_LOCALES.map((locale) => { const t = getProductTranslations(locale); return [locale, { home: t.breadcrumb.home, products: t.breadcrumb.products, navigation: t.breadcrumb.navigation, unnamedProduct: t.common.product }]; })) as Record<
  SiteLocale,
  BreadcrumbText
>;

// ============================================================
// 3. LANGUE
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
// 4. COMPOSANT PRINCIPAL
// ============================================================

export function ProductBreadcrumb({
  locale,
  productName,
  className = "",
}: ProductBreadcrumbProps) {
  const currentLocale = getValidLocale(locale);

  const text = translations[currentLocale];

  const name =
    typeof productName === "string" &&
    productName.trim().length > 0
      ? productName.trim()
      : text.unnamedProduct;

  const homeUrl = `/${currentLocale}`;

  const productsUrl = `/${currentLocale}/produits`;

  return (
    <nav
      data-component="product-breadcrumb"
      aria-label={text.navigation}
      className={[
        "w-full min-w-0",
        "bg-white",
        "text-[#102b39]",
        className,
      ].join(" ")}
    >
      <div className="cycloriva-container">
        <ol
          className={[
            "flex min-h-11 min-w-0",
            "items-center gap-1.5",
            "py-2.5",
            "text-[10px]",
            "font-medium",
            "sm:min-h-12",
            "sm:gap-2.5",
            "sm:text-xs",
            "lg:py-3",
          ].join(" ")}
        >
          {/* ==================================================
              1. ACCUEIL
          ================================================== */}

          <li className="shrink-0">
            <Link
              href={homeUrl}
              className={[
                "inline-flex items-center",
                "gap-1.5",
                "rounded-sm",
                "text-[#102b39]",
                "transition-colors",
                "hover:text-[#24b715]",
                "focus-visible:outline-2",
                "focus-visible:outline-offset-2",
                "focus-visible:outline-[#24b715]",
              ].join(" ")}
            >
              <House
                aria-hidden="true"
                className={[
                  "h-3.5 w-3.5",
                  "shrink-0",
                  "text-[#24b715]",
                  "sm:h-4 sm:w-4",
                ].join(" ")}
                strokeWidth={2}
              />

              <span>{text.home}</span>
            </Link>
          </li>

          {/* ==================================================
              SÉPARATEUR
          ================================================== */}

          <li
            aria-hidden="true"
            className="flex shrink-0 items-center"
          >
            <ChevronRight
              className="h-3 w-3 text-[#24b715] sm:h-3.5 sm:w-3.5"
              strokeWidth={2}
            />
          </li>

          {/* ==================================================
              2. TOUS LES PRODUITS
          ================================================== */}

          <li className="shrink-0">
            <Link
              href={productsUrl}
              className={[
                "inline-flex items-center",
                "rounded-sm",
                "text-[#102b39]",
                "transition-colors",
                "hover:text-[#24b715]",
                "focus-visible:outline-2",
                "focus-visible:outline-offset-2",
                "focus-visible:outline-[#24b715]",
              ].join(" ")}
            >
              {text.products}
            </Link>
          </li>

          {/* ==================================================
              SÉPARATEUR
          ================================================== */}

          <li
            aria-hidden="true"
            className="flex shrink-0 items-center"
          >
            <ChevronRight
              className="h-3 w-3 text-[#24b715] sm:h-3.5 sm:w-3.5"
              strokeWidth={2}
            />
          </li>

          {/* ==================================================
              3. NOM DU PRODUIT
          ================================================== */}

          <li
            aria-current="page"
            className={[
              "min-w-0 flex-1",
              "truncate",
              "font-semibold",
              "text-slate-500",
              "sm:font-medium",
            ].join(" ")}
            title={name}
          >
            {name}
          </li>
        </ol>
      </div>
    </nav>
  );
}

export default ProductBreadcrumb;
