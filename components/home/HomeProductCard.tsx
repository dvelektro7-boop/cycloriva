"use client";
import Image from "next/image";

import Link from "next/link";
import { useState } from "react";

import { ArrowRight, Heart, ImageOff, ShoppingCart } from "lucide-react";

import {
  currentPrice,
  formatPrice,
  localizedProduct,
  stripHtml,
  type Product,
} from "@/lib/catalog";

import { resolveLocale, type SiteLocale } from "@/lib/site-i18n";

// =====================================================
// CYCLORIVA — CARTE PRODUIT OFFICIELLE
// =====================================================
//
// Compatible : Next.js 16, React, TypeScript
//
// Responsive :
// - Mobile : 2 produits par ligne
// - Tablette : 2 produits par ligne
// - PC : 4 produits par ligne
//
// Fonctionnalités :
// - Image originale du catalogue
// - Nom et description du produit
// - Prix réel en euros
// - Ancien prix si promotion vérifiable
// - Badge de réduction si applicable
// - Favoris visuels
// - Lien vers la fiche produit
// - Gestion des images indisponibles
// - Traductions FR, EN, DE, IT, ES
//
// =====================================================

// =====================================================
// TYPES
// =====================================================

export type HomeProductCardProps = {
  product: Product;
  locale: SiteLocale;
  className?: string;
  compact?: boolean;
};

// =====================================================
// TRADUCTIONS DE LA CARTE PRODUIT
// =====================================================

const translations = {
  fr: {
    view: "Voir le produit",
    imageMissing: "Image indisponible",
    priceMissing: "Prix à confirmer",
    favorite: "Favoris bientôt disponibles",
    translation: "Traduction en préparation",
    stock: "En stock",
    promotion: "Réduction",
  },

  en: {
    view: "View product",
    imageMissing: "Image unavailable",
    priceMissing: "Price to be confirmed",
    favorite: "Wishlist coming soon",
    translation: "Translation in progress",
    stock: "In stock",
    promotion: "Discount",
  },

  de: {
    view: "Produkt ansehen",
    imageMissing: "Bild nicht verfügbar",
    priceMissing: "Preis noch zu bestätigen",
    favorite: "Merkliste bald verfügbar",
    translation: "Übersetzung in Vorbereitung",
    stock: "Auf Lager",
    promotion: "Rabatt",
  },

  it: {
    view: "Vedi prodotto",
    imageMissing: "Immagine non disponibile",
    priceMissing: "Prezzo da confermare",
    favorite: "Preferiti disponibili prossimamente",
    translation: "Traduzione in preparazione",
    stock: "Disponibile",
    promotion: "Sconto",
  },

  es: {
    view: "Ver producto",
    imageMissing: "Imagen no disponible",
    priceMissing: "Precio por confirmar",
    favorite: "Favoritos próximamente",
    translation: "Traducción en preparación",
    stock: "En stock",
    promotion: "Descuento",
  },
} as const;

// =====================================================
// VÉRIFICATION DE LA PROMOTION
// =====================================================

function getDiscount(product: Product): number | null {
  const regularPrice = product.regularPrice;
  const salePrice = product.salePrice;

  if (
    regularPrice === null ||
    salePrice === null ||
    !Number.isFinite(regularPrice) ||
    !Number.isFinite(salePrice) ||
    regularPrice <= 0 ||
    salePrice < 0 ||
    salePrice >= regularPrice
  ) {
    return null;
  }

  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

// =====================================================
// DESCRIPTION COURTE
// =====================================================

function getDescription(product: Product, locale: SiteLocale): string {
  const localized = localizedProduct(product, locale);

  const description = stripHtml(
    localized.shortDescription || localized.description || "",
  );

  if (description.length <= 115) {
    return description;
  }

  return `${description.slice(0, 112).trimEnd()}…`;
}

// =====================================================
// COMPOSANT PRINCIPAL
// =====================================================

export function HomeProductCard({
  product,
  locale,
  className = "",
  compact = false,
}: HomeProductCardProps) {
  const currentLocale = resolveLocale(locale);
  const tr = translations[currentLocale];

  const [imageError, setImageError] = useState(false);

  const localized = localizedProduct(product, currentLocale);

  const price = currentPrice(product);
  const discount = getDiscount(product);

  const description = getDescription(product, currentLocale);

  const image =
    product.images.find(
      (value) => typeof value === "string" && value.trim().length > 0,
    ) ?? null;

  const imageAvailable = Boolean(image && !imageError);

  const productUrl = `/${currentLocale}/produits/${encodeURIComponent(
    product.id,
  )}`;

  const showOriginalPrice = discount !== null && product.regularPrice !== null;

  return (
    <article
      className={`
        group relative flex h-full min-w-0 flex-col
        overflow-hidden rounded-xl
        border border-slate-200 bg-white
        transition-all duration-200
        hover:border-[#24b715]
        hover:shadow-md
        ${className}
      `}
    >
      {/* =================================================
          IMAGE ET BADGES
      ================================================= */}

      <div className="relative bg-white">
        {/* BADGE PROMOTION */}
        {discount !== null && (
          <span
            className="
              absolute left-2 top-2 z-10
              rounded-full bg-[#24b715]
              px-2.5 py-1
              text-[10px] font-bold text-white
              sm:left-3 sm:top-3
            "
            aria-label={`${tr.promotion} ${discount}%`}
          >
            -{discount}%
          </span>
        )}

        {/* FAVORIS — EN ATTENTE DU MODULE */}
        <button
          type="button"
          disabled
          title={tr.favorite}
          aria-label={tr.favorite}
          className="
            absolute right-2 top-2 z-10
            flex h-8 w-8 items-center
            justify-center rounded-full
            bg-white/90 text-[#102b39]
            opacity-75
            sm:right-3 sm:top-3
          "
        >
          <Heart size={19} strokeWidth={1.8} aria-hidden="true" />
        </button>

        {/* IMAGE ORIGINALE */}
        <Link
          href={productUrl}
          aria-label={`${tr.view}: ${localized.name}`}
          className={`relative 
            flex w-full items-center justify-center
            overflow-hidden bg-white
            ${compact ? "h-28 sm:h-36" : "h-36 sm:h-44 lg:h-48"}
          `}
        >
          {imageAvailable ? (
            <Image
              fill
              sizes="(max-width: 1023px) 50vw, 25vw"
              unoptimized={!image!.startsWith("/") || image!.startsWith("//")}
              key={image}
              src={image!}
              alt={localized.name}
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
              className="
                h-full w-full object-contain
                p-3 transition-transform
                duration-300
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex h-full w-full flex-col
                items-center justify-center
                gap-2 bg-slate-50 p-4
                text-slate-400
              "
            >
              <ImageOff size={30} strokeWidth={1.5} aria-hidden="true" />

              <span className="text-center text-[11px]">{tr.imageMissing}</span>
            </div>
          )}
        </Link>
      </div>

      {/* =================================================
          INFORMATIONS PRODUIT
      ================================================= */}

      <div
        className={`
          flex min-w-0 flex-1 flex-col
          ${compact ? "px-2.5 pb-3 pt-2" : "px-3 pb-4 pt-2 sm:px-4"}
        `}
      >
        {/* NOM DU PRODUIT */}
        <Link href={productUrl} className="block">
          <h3
            className="
              line-clamp-2 min-h-10
              text-xs font-extrabold
              leading-5 text-[#102b39]
              transition-colors
              group-hover:text-[#168e0a]
              sm:min-h-12 sm:text-sm
            "
          >
            {localized.name}
          </h3>
        </Link>

        {/* DESCRIPTION COURTE */}
        {description && (
          <p
            className="
              mt-1 line-clamp-2
              text-[10px] leading-4
              text-slate-500 sm:text-xs
            "
          >
            {description}
          </p>
        )}

        {/* ESPACE FLEXIBLE */}
        <div className="flex-1" />

        {/* =================================================
            PRIX ET BOUTON
        ================================================= */}

        <div
          className="
            mt-3 flex items-end
            justify-between gap-2
          "
        >
          <div className="min-w-0">
            {/* PRIX ACTUEL */}
            <p
              className="
                text-sm font-extrabold cycloriva-price
                text-[#b91c1c]
                sm:text-lg
              "
            >
              {price !== null
                ? formatPrice(price, currentLocale)
                : tr.priceMissing}
            </p>

            {/* ANCIEN PRIX */}
            {showOriginalPrice && (
              <p
                className="
                  mt-0.5 text-[10px]
                  text-slate-400 line-through
                  sm:text-xs
                "
              >
                {formatPrice(product.regularPrice, currentLocale)}
              </p>
            )}
          </div>

          {/* BOUTON VERT VERS LA FICHE PRODUIT */}
          <Link
            href={productUrl}
            title={tr.view}
            aria-label={`${tr.view}: ${localized.name}`}
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg bg-[#24b715]
              text-white
              transition-colors
              hover:bg-[#168e0a]
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[#24b715]
              sm:h-9 sm:w-9
            "
          >
            {compact ? (
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            ) : (
              <ShoppingCart size={17} strokeWidth={2} aria-hidden="true" />
            )}
          </Link>
        </div>

        {/* =================================================
            INFORMATIONS COMPLÉMENTAIRES
        ================================================= */}

        {!localized.translated && (
          <p
            className="
              mt-2 text-[10px]
              leading-4 text-slate-500
            "
          >
            {tr.translation}
          </p>
        )}

        {!product.stockConfirmed && (
          <p
            className="
              mt-1 text-[10px]
              leading-4 text-amber-700
            "
          >
            {tr.stock}
          </p>
        )}
      </div>
    </article>
  );
}

export default HomeProductCard;
