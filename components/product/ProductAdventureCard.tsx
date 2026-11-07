import { getProductTranslations, PRODUCT_LOCALES } from "@/lib/product-i18n";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
} from "lucide-react";

import type {
  SiteLocale,
} from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — CARTE AVENTURE
// ============================================================
//
// Next.js 16 — TypeScript — Tailwind CSS 4
//
// IMAGE OFFICIELLE :
// public/images/accueil.png
//
// VERSION PC :
// - Carte à l'intérieur du panneau des avantages
// - Image panoramique
// - Titre blanc en bas à gauche
// - Flèche verte en bas à droite
//
// VERSION MOBILE :
// - Carte pleine largeur du contenu
// - Hauteur réduite
// - Arrondis identiques
// - Texte et flèche bien visibles
//
// Fonctionnement :
// - Lien vers le catalogue existant
// - Respect de la langue actuelle
// - Aucun contenu commercial inventé
//
// Aucun header ni footer.
// ============================================================

// ============================================================
// 1. TYPES PUBLICS
// ============================================================

export type ProductAdventureCardProps = {
  locale: SiteLocale;

  /**
   * Lien réel de destination.
   *
   * Par défaut :
   * /fr/produits
   * /en/produits
   * /de/produits
   * /it/produits
   * /es/produits
   */
  href?: string;

  /**
   * Titre personnalisé facultatif.
   * Sinon, traduction automatique.
   */
  title?: string;

  /**
   * Image officielle par défaut :
   * /images/accueil.png
   */
  imageSrc?: string;

  /**
   * Mode d'affichage :
   *
   * compact : carte dans le panneau PC
   * wide    : carte plus panoramique
   *
   * Le mode compact reste responsive.
   */
  variant?: "compact" | "wide";

  /**
   * Classes supplémentaires facultatives.
   */
  className?: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

type AdventureTranslations = {
  title: string;
  imageAlt: string;
  linkLabel: string;
};

const translations = Object.fromEntries(PRODUCT_LOCALES.map((locale) => { const t = getProductTranslations(locale); return [locale, { title: t.adventure.title, imageAlt: t.adventure.imageAlt, linkLabel: t.adventure.linkLabel }]; })) as Record<
  SiteLocale,
  AdventureTranslations
>;

// ============================================================
// 3. UTILITAIRES
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

function cleanText(
  value: unknown
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Accepte uniquement les routes internes.
 *
 * Évite de créer un lien accidentel
 * vers une adresse externe non souhaitée.
 */
function getSafeHref(
  href: string | undefined,
  locale: SiteLocale
): string {
  const fallback = `/${locale}/produits`;

  const value = cleanText(href);

  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return fallback;
  }

  return value;
}

/**
 * Image du dossier public uniquement.
 *
 * L'image officielle est toujours utilisée
 * en l'absence de valeur explicite.
 */
function getSafeImageSource(
  source: string | undefined
): string {
  const fallback = "/images/accueil.png";

  const value = cleanText(source);

  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes("..") ||
    value.includes("?") ||
    value.includes("#")
  ) {
    return fallback;
  }

  return value;
}

// ============================================================
// 4. COMPOSANT PRINCIPAL
// ============================================================

export function ProductAdventureCard({
  locale,
  href,
  title,
  imageSrc,
  variant = "compact",
  className = "",
}: ProductAdventureCardProps) {
  const currentLocale = getValidLocale(locale);

  const text = translations[currentLocale];

  const finalTitle =
    cleanText(title) ||
    text.title;

  const finalHref = getSafeHref(
    href,
    currentLocale
  );

  const finalImage = getSafeImageSource(
    imageSrc
  );

  const isWide = variant === "wide";

  return (
    <section
      data-component="product-adventure-card"
      aria-label={finalTitle}
      className={[
        "w-full min-w-0",
        className,
      ].join(" ")}
    >
      <Link
        href={finalHref}
        aria-label={text.linkLabel}
        className={[
          "group relative block",
          "w-full min-w-0",
          "overflow-hidden",
          "rounded-xl",
          "bg-[#102b39]",
          "shadow-sm",
          "transition-shadow",
          "hover:shadow-md",
          "focus-visible:outline-2",
          "focus-visible:outline-offset-2",
          "focus-visible:outline-[#24b715]",

          isWide
            ? "h-37.5 sm:h-45 lg:h-52"
            : "h-31.25 sm:h-37.5 lg:h-35",

        ].join(" ")}
      >
        {/* ==================================================
            IMAGE OFFICIELLE
        ================================================== */}

        <Image
          src={finalImage}
          alt={text.imageAlt}
          fill
          sizes={
            isWide
              ? "(max-width: 768px) 100vw, 65vw"
              : "(max-width: 1024px) 100vw, 32vw"
          }
          className={[
            "object-cover",
            "object-center",
            "transition-transform",
            "duration-500",
            "group-hover:scale-105",
          ].join(" ")}
        />

        {/* ==================================================
            DÉGRADÉ SOMBRE
        ================================================== */}

        <div
          aria-hidden="true"
          className={[
            "pointer-events-none",
            "absolute inset-0",
            "bg-linear-to-t",
            "from-[#03151e]/90",
            "via-[#03151e]/25",
            "to-transparent",
          ].join(" ")}
        />

        {/* ==================================================
            CONTENU DU BAS
        ================================================== */}

        <div
          className={[
            "absolute inset-x-0 bottom-0",
            "flex items-end",
            "justify-between",
            "gap-3",
            "p-3",
            "sm:p-4",
          ].join(" ")}
        >
          {/* TITRE */}

          <h3
            className={[
              "max-w-[78%]",
              "text-sm",
              "font-extrabold",
              "leading-tight",
              "tracking-tight",
              "text-white",
              "drop-shadow-sm",
              "sm:text-base",
              isWide
                ? "lg:text-xl"
                : "lg:text-lg",
            ].join(" ")}
          >
            {finalTitle}
          </h3>

          {/* FLÈCHE VERTE */}

          <span
            aria-hidden="true"
            className={[
              "flex h-8 w-8",
              "shrink-0 items-center",
              "justify-center",
              "rounded-full",
              "bg-[#24b715]",
              "text-white",
              "shadow-sm",
              "transition-transform",
              "group-hover:translate-x-0.5",
              "group-hover:-translate-y-0.5",
              "sm:h-9 sm:w-9",
            ].join(" ")}
          >
            <ArrowUpRight
              className="h-4 w-4 sm:h-5 sm:w-5"
              strokeWidth={2.2}
            />
          </span>
        </div>
      </Link>
    </section>
  );
}

export default ProductAdventureCard;
