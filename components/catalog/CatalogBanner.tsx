
import Image from "next/image";
import Link from "next/link";

import { ChevronRight, House } from "lucide-react";

import type { SiteLocale } from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — BANNIÈRE DU CATALOGUE
// ============================================================
//
// Next.js 16 — TypeScript — Tailwind CSS 4
//
// PC :
// - Bannière horizontale
// - Titre à gauche
// - Image de vélo à droite
// - Fond bleu marine et accents verts
//
// Mobile :
// - Fil d'Ariane dans la bannière
// - Titre sur une ligne si l'espace le permet
// - Nombre réel de produits
// - Image adaptée au format mobile
//
// Langues : FR, EN, DE, IT, ES
//
// Header et Footer non inclus.
//
// ============================================================

// ============================================================
// TYPES
// ============================================================

type CatalogBannerProps = {
  locale: SiteLocale;
  productCount?: number;
  imageSrc?: string;
  className?: string;
};

type BannerTranslations = {
  eyebrow: string;
  title: string;
  home: string;
  productSingular: string;
  productPlural: string;
  imageAlt: string;
};

// ============================================================
// TRADUCTIONS
// ============================================================

const bannerTranslations: Record<
  SiteLocale,
  BannerTranslations
> = {
  fr: {
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    title: "Tous les produits",
    home: "Accueil",
    productSingular: "produit",
    productPlural: "produits",
    imageAlt:
      "Vélo dans un paysage naturel de montagne",
  },

  en: {
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    title: "All products",
    home: "Home",
    productSingular: "product",
    productPlural: "products",
    imageAlt:
      "Bicycle in a mountain landscape",
  },

  de: {
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    title: "Alle Produkte",
    home: "Startseite",
    productSingular: "Produkt",
    productPlural: "Produkte",
    imageAlt:
      "Fahrrad in einer Berglandschaft",
  },

  it: {
    eyebrow: "BICICLETTE & MOBILITÀ ELETTRICA IN EUROPA",
    title: "Tutti i prodotti",
    home: "Home",
    productSingular: "prodotto",
    productPlural: "prodotti",
    imageAlt:
      "Bicicletta in un paesaggio di montagna",
  },

  es: {
    eyebrow: "BICICLETAS Y MOVILIDAD ELÉCTRICA EN EUROPA",
    title: "Todos los productos",
    home: "Inicio",
    productSingular: "producto",
    productPlural: "productos",
    imageAlt:
      "Bicicleta en un paisaje de montaña",
  },
};

// ============================================================
// FONCTIONS UTILITAIRES
// ============================================================

function normalizeProductCount(
  value: number | undefined
): number | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return null;
  }

  return Math.floor(value);
}

function formatProductCount(
  count: number,
  locale: SiteLocale
): string {
  const localeMap: Record<SiteLocale, string> = {
    fr: "fr-FR",
    en: "en-GB",
    de: "de-DE",
    it: "it-IT",
    es: "es-ES",
  };

  return new Intl.NumberFormat(localeMap[locale]).format(
    count
  );
}

// ============================================================
// COMPOSANT
// ============================================================

export function CatalogBanner({
  locale,
  productCount,
  imageSrc = "/images/couverture.png",
  className = "",
}: CatalogBannerProps) {
  const currentLocale: SiteLocale =
    locale in bannerTranslations ? locale : "fr";

  const text = bannerTranslations[currentLocale];

  const count = normalizeProductCount(productCount);

  const productLabel =
    count === 1
      ? text.productSingular
      : text.productPlural;

  const formattedCount =
    count === null
      ? null
      : formatProductCount(count, currentLocale);

  return (
    <section
      aria-labelledby="catalog-banner-title"
      data-component="catalog-banner"
      className={[
        "relative isolate w-full overflow-hidden",
        "bg-[#102b39] text-white",
        className,
      ].join(" ")}
    >
      {/* ==================================================
          IMAGE DE COUVERTURE
      ================================================== */}

      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className={[
            "object-cover",
            "object-[62%_center]",
            "sm:object-[65%_center]",
            "lg:object-center",
          ].join(" ")}
        />

        {/* Dégradé bleu marine : PC */}
        <div
          className={[
            "absolute inset-0",
            "bg-linear-to-r",
            "from-[#071f35]/95",
            "via-[#102b39]/85",
            "to-[#102b39]/15",
            "md:from-[#071f35]/95",
            "md:via-[#102b39]/70",
            "md:to-transparent",
          ].join(" ")}
        />

        {/* Renforcement de la lisibilité mobile */}
        <div
          className={[
            "absolute inset-0",
            "bg-[#071f35]/15",
            "md:hidden",
          ].join(" ")}
        />

        {/* Accent vert en haut à gauche */}
        <div
          className={[
            "absolute -left-12 -top-14",
            "h-28 w-28 rotate-45",
            "bg-[#76d900]",
            "sm:-left-10 sm:-top-20",
            "sm:h-36 sm:w-36",
          ].join(" ")}
        />

        {/* Accent vert en bas à droite */}
        <div
          className={[
            "absolute -bottom-16 -right-20",
            "h-24 w-60 -rotate-28",
            "bg-[#76d900]",
            "sm:-bottom-20",
            "sm:h-28 sm:w-76",
            "lg:-bottom-16 lg:-right-16",
          ].join(" ")}
        />
      </div>

      {/* ==================================================
          CONTENU
      ================================================== */}

      <div
        className={[
          "cycloriva-container relative z-10",
          "flex min-h-34 flex-col justify-center",
          "py-6",
          "sm:min-h-39 sm:py-7",
          "lg:min-h-32 lg:py-5",
        ].join(" ")}
      >
        <div className="max-w-3xl">
          {/* ==============================================
              FIL D'ARIANE MOBILE
          ============================================== */}

          <nav
            aria-label={
              currentLocale === "fr"
                ? "Fil d'Ariane"
                : "Breadcrumb"
            }
            className="mb-4 md:hidden"
          >
            <ol className="flex items-center gap-2 text-[11px] font-medium text-white sm:text-xs">
              <li>
                <Link
                  href={`/${currentLocale}`}
                  className={[
                    "inline-flex items-center gap-1.5",
                    "transition-colors",
                    "hover:text-[#9cff48]",
                    "focus-visible:outline-2",
                    "focus-visible:outline-offset-2",
                    "focus-visible:outline-white",
                  ].join(" ")}
                >
                  <House
                    className="h-3.5 w-3.5 shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />

                  <span>{text.home}</span>
                </Link>
              </li>

              <li aria-hidden="true">
                <ChevronRight
                  className="h-3.5 w-3.5"
                  strokeWidth={2}
                />
              </li>

              <li
                aria-current="page"
                className="min-w-0 truncate font-semibold"
              >
                {text.title}
              </li>
            </ol>
          </nav>

          {/* ==============================================
              PETIT TITRE PC
          ============================================== */}

          <div className="mb-2 hidden items-center gap-2 md:flex">
            <span
              className="h-0.75 w-7 shrink-0 bg-[#8ce900]"
              aria-hidden="true"
            />

            <p className="text-[10px] font-bold uppercase tracking-wide text-white lg:text-xs">
              {text.eyebrow}
            </p>
          </div>

          {/* ==============================================
              TITRE PRINCIPAL
          ============================================== */}

          <h1
            id="catalog-banner-title"
            className={[
              "text-[27px] font-extrabold",
              "leading-tight tracking-tight",
              "text-white",
              "sm:text-3xl",
              "md:text-[35px]",
              "lg:text-[38px]",
            ].join(" ")}
          >
            {text.title}
          </h1>

          {/* Barre verte sous le titre sur PC */}
          <span
            aria-hidden="true"
            className="mt-2 hidden h-1 w-15 rounded-full bg-[#8ce900] md:block"
          />

          {/* ==============================================
              NOMBRE RÉEL DE PRODUITS — MOBILE
          ============================================== */}

          {formattedCount !== null && (
            <p
              className="mt-2 text-sm font-semibold text-white md:hidden"
              aria-live="polite"
            >
              {formattedCount} {productLabel}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default CatalogBanner;
