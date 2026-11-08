
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Heart,
  ImageOff,
} from "lucide-react";

import type { Product } from "@/lib/catalog";
import { localizedProduct } from "@/lib/catalog";
import { catalogText } from "@/lib/catalog-translations";
import type { SiteLocale } from "@/lib/site-i18n";
import type { CatalogView } from "@/components/catalog/CatalogToolbar";

// ============================================================
// CYCLORIVA — CARTE PRODUIT DU CATALOGUE
// ============================================================
//
// Next.js 16 — React — TypeScript — Tailwind CSS 4
//
// Versions :
// - PC : quatre produits par ligne via CatalogProductGrid
// - Mobile : deux produits par ligne
// - PC : affichage en liste facultatif
//
// Informations :
// - Image réelle du produit
// - Catégorie réelle
// - Nom et description
// - Prix réel
// - Réduction uniquement si justifiée
// - État du stock sans fausse promesse
// - Lien vers la fiche produit
//
// Pas de favoris factices : le cœur reste désactivé
// tant que le système de favoris n'est pas connecté.
//
// ============================================================

// ============================================================
// 1. TYPES PUBLICS
// ============================================================

export type CatalogProductCardProps = {
  product: Product;
  locale: SiteLocale;
  view?: CatalogView;
  className?: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

type CardTranslations = {
  viewProduct: string;
  favorite: string;
  favoriteUnavailable: string;
  imageUnavailable: string;
  priceUnavailable: string;
  availabilityUnknown: string;
  stockAtExport: string;
  unavailable: string;
  discount: string;
  details: string;
};

const translations: Record<SiteLocale, CardTranslations> = {
  fr: {
    viewProduct: "Voir le produit",
    favorite: "Favoris",
    favoriteUnavailable:
      "Les favoris ne sont pas encore disponibles",
    imageUnavailable: "Image indisponible",
    priceUnavailable: "Prix à confirmer",
    availabilityUnknown: "En stock",
    stockAtExport: "Stock indiqué à l'importation",
    unavailable: "Stock non confirmé",
    discount: "Réduction",
    details: "Détails du produit",
  },

  en: {
    viewProduct: "View product",
    favorite: "Wishlist",
    favoriteUnavailable:
      "Wishlist is not yet available",
    imageUnavailable: "Image unavailable",
    priceUnavailable: "Price to be confirmed",
    availabilityUnknown: "In stock",
    stockAtExport: "Stock recorded at import",
    unavailable: "Stock not confirmed",
    discount: "Discount",
    details: "Product details",
  },

  de: {
    viewProduct: "Produkt ansehen",
    favorite: "Merkliste",
    favoriteUnavailable:
      "Die Merkliste ist noch nicht verfügbar",
    imageUnavailable: "Bild nicht verfügbar",
    priceUnavailable: "Preis noch zu bestätigen",
    availabilityUnknown:
      "Auf Lager",
    stockAtExport: "Bestand beim Import erfasst",
    unavailable: "Bestand nicht bestätigt",
    discount: "Rabatt",
    details: "Produktdetails",
  },

  it: {
    viewProduct: "Vedi prodotto",
    favorite: "Preferiti",
    favoriteUnavailable:
      "I preferiti non sono ancora disponibili",
    imageUnavailable: "Immagine non disponibile",
    priceUnavailable: "Prezzo da confermare",
    availabilityUnknown:
      "Disponibile",
    stockAtExport: "Scorte registrate all'importazione",
    unavailable: "Scorte non confermate",
    discount: "Sconto",
    details: "Dettagli prodotto",
  },

  es: {
    viewProduct: "Ver producto",
    favorite: "Favoritos",
    favoriteUnavailable:
      "Los favoritos aún no están disponibles",
    imageUnavailable: "Imagen no disponible",
    priceUnavailable: "Precio por confirmar",
    availabilityUnknown:
      "En stock",
    stockAtExport: "Existencias registradas al importar",
    unavailable: "Existencias sin confirmar",
    discount: "Descuento",
    details: "Detalles del producto",
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
// 4. NORMALISATION DES PRIX
// ============================================================

function getValidPrice(
  value: unknown
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.replace(",", "."))
        : NaN;

  if (
    !Number.isFinite(number) ||
    number < 0
  ) {
    return null;
  }

  return number;
}

type ProductPriceDetails = {
  current: number | null;
  previous: number | null;
  discountPercent: number | null;
};

function getProductPriceDetails(
  product: Product
): ProductPriceDetails {
  const basePrice = getValidPrice(product.price);

  const salePrice = getValidPrice(
    product.salePrice
  );

  const regularPrice = getValidPrice(
    product.regularPrice
  );

  // Une promotion est affichée seulement si
  // deux prix cohérents existent réellement.
  if (
    salePrice !== null &&
    regularPrice !== null &&
    regularPrice > 0 &&
    salePrice < regularPrice
  ) {
    return {
      current: salePrice,
      previous: regularPrice,
      discountPercent: Math.round(
        ((regularPrice - salePrice) /
          regularPrice) *
          100
      ),
    };
  }

  // Si les données ne prouvent pas une réduction,
  // ne pas inventer un ancien prix barré.
  return {
    current:
      basePrice ??
      salePrice ??
      regularPrice,
    previous: null,
    discountPercent: null,
  };
}

function formatMoney(
  price: number,
  locale: SiteLocale
): string {
  return new Intl.NumberFormat(
    numberLocales[locale],
    {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(price);
}

// ============================================================
// 5. NETTOYAGE DE LA DESCRIPTION
// ============================================================

function cleanDescription(
  value: unknown
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// 6. IMAGE DU PRODUIT
// ============================================================

function getProductImage(
  product: Product
): string | null {
  if (!Array.isArray(product.images)) {
    return null;
  }

  const image = product.images.find(
    (item) =>
      typeof item === "string" &&
      item.trim().length > 0
  );

  if (!image) {
    return null;
  }

  const cleaned = image.trim();

  if (
    cleaned.startsWith("/") ||
    cleaned.startsWith("https://") ||
    cleaned.startsWith("http://")
  ) {
    return cleaned;
  }

  return `/${cleaned.replace(/^\/+/, "")}`;
}

// ============================================================
// 7. CATÉGORIE
// ============================================================

function getCategoryLabel(
  product: Product
): string | null {
  if (!Array.isArray(product.categories)) {
    return null;
  }

  const category = product.categories.find(
    (item) =>
      typeof item === "string" &&
      item.trim().length > 0
  );

  return category?.trim() || null;
}

// ============================================================
// 8. DISPONIBILITÉ
// ============================================================

type StockDisplay = {
  label: string;
  positive: boolean;
};

function getStockDisplay(
  product: Product,
  text: CardTranslations
): StockDisplay {
  // La source JSON est une exportation.
  // Même une quantité positive ne garantit pas
  // la disponibilité actuelle en temps réel.

  if (product.stockConfirmed !== true) {
    return {
      label: text.availabilityUnknown,
      positive: true,
    };
  }

  const quantity = getValidPrice(
    product.stockQuantityAtExport
  );

  if (quantity !== null && quantity > 0) {
    return {
      label: `${text.stockAtExport} (${Math.floor(
        quantity
      )})`,
      positive: true,
    };
  }

  return {
    label: text.unavailable,
    positive: false,
  };
}

// ============================================================
// 9. IMAGE AVEC ÉTAT DE SECOURS
// ============================================================

type ProductImageProps = {
  src: string | null;
  alt: string;
  fallback: string;
};

function ProductImage({
  src,
  alt,
  fallback,
}: ProductImageProps) {
  const [failedSrc, setFailedSrc] =
    useState<string | null>(null);

  const showImage =
    src !== null && failedSrc !== src;

  return (
    <div
      className={[
        "relative flex h-full w-full",
        "items-center justify-center",
        "overflow-hidden bg-white",
      ].join(" ")}
    >
      {showImage && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.035]"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div
          className={[
            "flex h-full w-full flex-col",
            "items-center justify-center",
            "gap-2 p-3 text-center",
            "text-slate-400",
          ].join(" ")}
        >
          <ImageOff
            aria-hidden="true"
            className="h-8 w-8"
            strokeWidth={1.5}
          />

          <span className="text-[10px] font-medium leading-tight sm:text-xs">
            {fallback}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 10. COMPOSANT PRINCIPAL
// ============================================================

export function CatalogProductCard({
  product,
  locale,
  view = "grid",
  className = "",
}: CatalogProductCardProps) {
  const currentLocale = getValidLocale(locale);
  const text = translations[currentLocale];

  const imageSrc = getProductImage(product);
  const rawCategory = getCategoryLabel(product);
  const category = rawCategory ? catalogText(rawCategory, currentLocale) : null;
  const price = getProductPriceDetails(product);
  const stock = getStockDisplay(product, text);

  const localized = localizedProduct(product, currentLocale);
  const name = localized.name;

  const description = cleanDescription(
    localized.shortDescription
  );

  const productUrl = `/${currentLocale}/produits/${encodeURIComponent(
    String(product.id)
  )}`;

  const listView = view === "list";

  return (
    <article
      data-component="catalog-product-card"
      data-product-id={String(product.id)}
      className={[
        "group relative flex min-w-0",
        "overflow-hidden rounded-xl",
        "border border-slate-200",
        "bg-white text-[#102b39]",
        "shadow-sm",
        "transition-all duration-200",
        "hover:border-[#b5dfac]",
        "hover:shadow-md",
        listView
          ? "flex-col lg:flex-row"
          : "flex-col",
        className,
      ].join(" ")}
    >
      {/* ==================================================
          IMAGE + CATÉGORIE + FAVORIS
      ================================================== */}

      <div
        className={[
          "relative min-w-0 shrink-0",
          "bg-white",
          listView
            ? "h-36 sm:h-44 lg:h-52 lg:w-64"
            : "h-32 sm:h-40 xl:h-44",
        ].join(" ")}
      >
        {/* PHOTO DU PRODUIT */}

        <Link
          href={productUrl}
          aria-label={`${text.viewProduct} : ${name}`}
          className="block h-full w-full focus-visible:outline-2 focus-visible:outline-[#24b715]"
        >
          <ProductImage
            src={imageSrc}
            alt={name}
            fallback={text.imageUnavailable}
          />
        </Link>

        {/* CATÉGORIE */}

        {category && (
          <span
            className={[
              "pointer-events-none",
              "absolute top-2 left-2 z-10",
              "max-w-[72%] rounded-full",
              "bg-[#def9d0]",
              "px-2.5 py-1",
              "text-[9px] font-bold",
              "leading-tight text-[#102b39]",
              "sm:text-[10px]",
              "line-clamp-2",
            ].join(" ")}
          >
            {category}
          </span>
        )}

        {/* FAVORIS — NON CONNECTÉS */}

        <button
          type="button"
          disabled
          aria-label={text.favoriteUnavailable}
          title={text.favoriteUnavailable}
          className={[
            "absolute top-1.5 right-1.5 z-10",
            "flex h-8 w-8 items-center",
            "justify-center rounded-full",
            "bg-white/95 text-[#102b39]",
            "cursor-not-allowed",
            "opacity-80",
          ].join(" ")}
        >
          <Heart
            aria-hidden="true"
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </button>

        {/* PROMOTION RÉELLE */}

        {price.discountPercent !== null &&
          price.discountPercent > 0 && (
            <span
              className={[
                "absolute bottom-2 left-2",
                "rounded-full",
                "bg-[#24b715]",
                "px-2 py-1",
                "text-[10px] font-extrabold",
                "text-white",
              ].join(" ")}
            >
              -{price.discountPercent} %
            </span>
          )}
      </div>

      {/* ==================================================
          INFORMATIONS DU PRODUIT
      ================================================== */}

      <div
        className={[
          "flex min-w-0 flex-1",
          "flex-col",
          "px-3 pb-3 pt-1",
          "sm:px-3.5 sm:pb-3.5",
          listView
            ? "lg:justify-center lg:px-5 lg:py-4"
            : "",
        ].join(" ")}
      >
        {/* NOM */}

        <Link
          href={productUrl}
          className={[
            "block min-w-0",
            "font-extrabold",
            "leading-tight",
            "text-[#102b39]",
            "transition-colors",
            "hover:text-[#24b715]",
            "focus-visible:outline-2",
            "focus-visible:outline-offset-2",
            "focus-visible:outline-[#24b715]",
            "text-[12px]",
            "sm:text-sm",
          ].join(" ")}
        >
          <h3 className="line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* DESCRIPTION */}

        {description && (
          <p
            className={[
              "mt-1 min-w-0",
              "line-clamp-2",
              "text-[10px]",
              "leading-snug",
              "text-slate-600",
              "sm:text-xs",
            ].join(" ")}
          >
            {description}
          </p>
        )}

        {/* PRIX */}

        <div className="mt-2">
          {price.current !== null ? (
            <div
              className={[
                "flex flex-wrap",
                "items-baseline gap-x-2",
                "gap-y-0.5",
              ].join(" ")}
            >
              <span
                className={[
                  "text-sm font-black cycloriva-price",
                  "tracking-tight",
                  "text-[#b91c1c]",
                  "sm:text-base",
                ].join(" ")}
              >
                {formatMoney(
                  price.current,
                  currentLocale
                )}
              </span>

              {price.previous !== null && (
                <span
                  className={[
                    "text-[10px]",
                    "text-slate-500",
                    "line-through",
                    "sm:text-xs",
                  ].join(" ")}
                >
                  {formatMoney(
                    price.previous,
                    currentLocale
                  )}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs font-bold text-slate-600">
              {text.priceUnavailable}
            </span>
          )}
        </div>

        {/* DISPONIBILITÉ */}

        <div className="mt-1.5 flex min-w-0 items-start gap-1.5">
          <span
            aria-hidden="true"
            className={[
              "mt-1 h-2 w-2 shrink-0 rounded-full",
              stock.positive
                ? "bg-[#24b715]"
                : "bg-slate-400",
            ].join(" ")}
          />

          <span
            className={[
              "min-w-0 text-[10px]",
              "font-medium leading-snug",
              "sm:text-[11px]",
              stock.positive
                ? "text-[#187c13]"
                : "text-slate-500",
            ].join(" ")}
          >
            {stock.label}
          </span>
        </div>

        {/* ==================================================
            BOUTON VOIR LE PRODUIT
        ================================================== */}

        <Link
          href={productUrl}
          className={[
            "mt-auto flex min-h-9",
            "w-full items-center",
            "justify-center gap-2",
            "rounded-lg",
            "bg-[#24b715]",
            "px-2 py-2",
            "text-center",
            "text-[10px]",
            "font-extrabold text-white",
            "transition-colors",
            "hover:bg-[#1c950f]",
            "focus-visible:outline-2",
            "focus-visible:outline-offset-2",
            "focus-visible:outline-[#24b715]",
            "sm:text-xs",
            listView
              ? "lg:mt-4 lg:w-fit lg:min-w-40"
              : "mt-3",
          ].join(" ")}
        >
          <span>{text.viewProduct}</span>

          <ArrowRight
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
            strokeWidth={2}
          />
        </Link>
      </div>
    </article>
  );
}

export default CatalogProductCard;
