
import Link from "next/link";
import { ChevronRight, House } from "lucide-react";

import type { SiteLocale } from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — FIL D'ARIANE DU CATALOGUE
// ============================================================
//
// Next.js 16 — TypeScript — Tailwind CSS 4
//
// PC :
// Accueil > Tous les produits
//
// Mobile :
// Masqué par défaut, car le fil d'Ariane mobile
// est déjà affiché dans CatalogBanner.tsx.
//
// Langues : FR, EN, DE, IT, ES
//
// Aucun header, footer ou autre fichier modifié.
//
// ============================================================

// ============================================================
// TYPES
// ============================================================

export type CatalogBreadcrumbProps = {
  locale: SiteLocale;
  className?: string;
};

type BreadcrumbTranslation = {
  home: string;
  products: string;
  ariaLabel: string;
};

// ============================================================
// TRADUCTIONS
// ============================================================

const translations: Record<
  SiteLocale,
  BreadcrumbTranslation
> = {
  fr: {
    home: "Accueil",
    products: "Tous les produits",
    ariaLabel: "Fil d'Ariane",
  },

  en: {
    home: "Home",
    products: "All products",
    ariaLabel: "Breadcrumb",
  },

  de: {
    home: "Startseite",
    products: "Alle Produkte",
    ariaLabel: "Brotkrumennavigation",
  },

  it: {
    home: "Home",
    products: "Tutti i prodotti",
    ariaLabel: "Percorso di navigazione",
  },

  es: {
    home: "Inicio",
    products: "Todos los productos",
    ariaLabel: "Ruta de navegación",
  },
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export function CatalogBreadcrumb({
  locale,
  className = "",
}: CatalogBreadcrumbProps) {
  const currentLocale: SiteLocale =
    locale in translations ? locale : "fr";

  const text = translations[currentLocale];

  return (
    <nav
      aria-label={text.ariaLabel}
      data-component="catalog-breadcrumb"
      className={[
        "hidden w-full bg-white",
        "md:block",
        className,
      ].join(" ")}
    >
      <div className="cycloriva-container">
        <ol
          className={[
            "flex min-h-11 items-center",
            "gap-2.5 py-2.5",
            "text-[11px] font-semibold",
            "text-[#102b39]",
            "lg:text-xs",
          ].join(" ")}
        >
          {/* ACCUEIL */}
          <li className="shrink-0">
            <Link
              href={`/${currentLocale}`}
              className={[
                "inline-flex items-center gap-2",
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
                className="h-4 w-4 text-[#24b715]"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              <span>{text.home}</span>
            </Link>
          </li>

          {/* SÉPARATEUR */}
          <li
            aria-hidden="true"
            className="flex shrink-0 items-center"
          >
            <ChevronRight
              className="h-3.5 w-3.5 text-[#24b715]"
              strokeWidth={2}
            />
          </li>

          {/* PAGE ACTUELLE */}
          <li
            aria-current="page"
            className="min-w-0 truncate font-bold text-[#102b39]"
          >
            {text.products}
          </li>
        </ol>
      </div>
    </nav>
  );
}

export default CatalogBreadcrumb;
