import { ProductRelatedRail } from "./ProductRelatedRail";
import { getProductTranslations, PRODUCT_LOCALES } from "@/lib/product-i18n";
import { localizedProduct } from "@/lib/catalog";
import { catalogText } from "@/lib/catalog-translations";
import { getCatalogCategoryKey } from "@/lib/catalog-filters";
import { catalogCategoryText } from "@/lib/catalog-i18n";

import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  ImageOff,
  Tag,
} from "lucide-react";

import {
  allProducts,
  type Product,
} from "@/lib/catalog";

import type {
  SiteLocale,
} from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — PRODUITS SIMILAIRES
// ============================================================
//
// Next.js 16 — TypeScript — Tailwind CSS 4
//
// PC :
// - Quatre cartes par ligne
// - Image centrale
// - Catégorie verte
// - Nom et prix
// - Bouton vert "Voir le produit"
//
// MOBILE :
// - Deux cartes par ligne
// - Bouton de consultation pleine largeur
// - Cartes compactes
//
// PRODUITS :
// - Source : allProducts / data/products.json
// - Catégories comparées au produit actuel
// - Produit actuel toujours exclu
// - Aucun prix ou produit inventé
//
// AUCUN FOOTER.
// ============================================================

// ============================================================
// 1. TYPES PUBLICS
// ============================================================

export type ProductRelatedProductsProps = {
  product: Product;

  locale: SiteLocale;

  /**
   * Liste source facultative.
   *
   * Par défaut : allProducts.
   */
  products?: readonly Product[];

  /**
   * Nombre maximum de produits.
   *
   * Par défaut : 4 comme sur la maquette PC.
   */
  limit?: number;

  /**
   * Afficher le titre de la section.
   */
  showTitle?: boolean;

  /**
   * Masquer la section si aucun produit
   * similaire n'est trouvé.
   */
  hideWhenEmpty?: boolean;

  className?: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

type RelatedTranslations = {
  title: string;
  viewProduct: string;
  unavailable: string;
  priceUnavailable: string;
  imageUnavailable: string;
  categoryFallback: string;
  discount: string;
};

const translations = Object.fromEntries(PRODUCT_LOCALES.map((locale) => { const t = getProductTranslations(locale); return [locale, { title: t.related.title, viewProduct: t.related.viewProduct, unavailable: t.related.empty, priceUnavailable: t.related.priceUnavailable, imageUnavailable: t.related.imageUnavailable, categoryFallback: t.common.product, discount: t.summary.discount }]; })) as Record<
  SiteLocale,
  RelatedTranslations
>;

// ============================================================
// 3. LANGUES ET FORMATAGE
// ============================================================

const numberLocales: Record<
  SiteLocale,
  string
> = {
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

function formatMoney(
  value: number,
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
  ).format(value);
}

// ============================================================
// 4. NETTOYAGE DES TEXTES
// ============================================================

function cleanText(
  value: unknown
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(
      /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      " "
    )
    .replace(
      /<style\b[^>]*>[\s\S]*?<\/style>/gi,
      " "
    )
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeText(
  value: unknown
): string {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// 5. VALIDATION DES PRIX
// ============================================================

function validPrice(
  value: unknown
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const price =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(
            value.trim().replace(",", ".")
          )
        : NaN;

  return Number.isFinite(price) && price >= 0
    ? price
    : null;
}

type ProductPrice = {
  current: number | null;
  previous: number | null;
  discount: number | null;
};

function getProductPrice(
  product: Product
): ProductPrice {
  const regular = validPrice(
    product.regularPrice
  );

  const sale = validPrice(
    product.salePrice
  );

  const normal = validPrice(
    product.price
  );

  // Ne montre une promotion que si
  // le prix barré est supérieur au prix soldé.
  if (
    regular !== null &&
    regular > 0 &&
    sale !== null &&
    sale < regular
  ) {
    return {
      current: sale,
      previous: regular,
      discount: Math.round(
        ((regular - sale) / regular) * 100
      ),
    };
  }

  return {
    current: normal ?? sale ?? regular,
    previous: null,
    discount: null,
  };
}

// ============================================================
// 6. IMAGE RÉELLE DU PRODUIT
// ============================================================

function validImage(
  value: unknown
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const source = value.trim();

  if (!source) return null;

  if (
    source.startsWith("https://") ||
    source.startsWith("http://")
  ) {
    try {
      const url = new URL(source);

      if (
        url.protocol === "https:" ||
        url.protocol === "http:"
      ) {
        return url.toString();
      }
    } catch {
      return null;
    }
  }

  if (
    source.startsWith("//") ||
    source.includes("\\") ||
    source.includes("..")
  ) {
    return null;
  }

  return source.startsWith("/")
    ? source
    : `/${source}`;
}

function getProductImage(
  product: Product
): string | null {
  if (!Array.isArray(product.images)) {
    return null;
  }

  for (const image of product.images) {
    const source = validImage(image);

    if (source) return source;
  }

  return null;
}

// ============================================================
// 7. CATÉGORIES
// ============================================================

function getCategories(
  product: Product
): string[] {
  if (!Array.isArray(product.categories)) {
    return [];
  }

  return [
    ...new Set(
      product.categories
        .filter(
          (category): category is string =>
            typeof category === "string"
        )
        .map(normalizeText)
        .filter(Boolean)
    ),
  ];
}

function getDisplayCategory(
  product: Product,
  locale: SiteLocale
): string | null {
  if (!Array.isArray(product.categories)) {
    return null;
  }

  for (const category of [...product.categories].reverse()) {
    const label = cleanText(category);
    const key = getCatalogCategoryKey(label);
    if (key) return catalogCategoryText(locale, key);

    if (label) return catalogText(label, locale);
  }

  return null;
}

// ============================================================
// 8. PRODUITS SIMILAIRES
// ============================================================

type ScoredRelatedProduct = {
  product: Product;
  score: number;
  index: number;
};

/**
 * Sélectionne uniquement les produits
 * partageant au moins une catégorie exacte
 * avec le produit actuel.
 *
 * Les produits possédant davantage de
 * catégories communes apparaissent d'abord.
 *
 * Aucun classement "best-seller" inventé.
 */
export function getRelatedProducts(
  product: Product,
  products: readonly Product[],
  limit = 4
): Product[] {
  const safeLimit =
    Number.isFinite(limit)
      ? Math.max(
          0,
          Math.min(24, Math.floor(limit))
        )
      : 4;

  if (safeLimit === 0) {
    return [];
  }

  const currentId = String(product.id);

  const specificCategories = (item: Product) => getCategories(item).filter((category) => !/^(v[eé]los?\s*\/\s*cyclisme|v[eé]los?|cyclisme|bikes?|uncategorized|non class[eé])$/i.test(category));
  const currentCategories = new Set(specificCategories(product));
  // Imported umbrella categories alone do not make two products comparable.
  const family = (item: Product) => {
    const value = normalizeText(`${item.name} ${item.categories.join(" ")}`);
    if (/cargo|lasten|triporteur/.test(value)) return "cargo";
    if (/casque|helmet|accessoire|antivol|batterie seule/.test(value)) return "accessory";
    if (/enfant|junior|kids/.test(value)) return "child";
    if (/tout terrain|vtt|mountain|fully|hardtail/.test(value)) return "mtb";
    if (/ville|city|urbain|trekking/.test(value)) return "city";
    if (/pliable|folding/.test(value)) return "folding";
    return null;
  };
  const currentFamily = family(product);

  if (currentCategories.size === 0) {
    return [];
  }

  const scored: ScoredRelatedProduct[] = [];

  const seenIds = new Set<string>();

  for (
    let index = 0;
    index < products.length;
    index++
  ) {
    const candidate = products[index];

    if (!candidate) continue;
    if (currentFamily && family(candidate) !== currentFamily) continue;

    const candidateId = String(
      candidate.id
    );

    // Exclure le produit affiché.
    if (candidateId === currentId) {
      continue;
    }

    // Éviter les doublons dans le catalogue.
    if (seenIds.has(candidateId)) {
      continue;
    }

    seenIds.add(candidateId);

    const categories = specificCategories(candidate);

    const commonCategories =
      categories.filter((category) =>
        currentCategories.has(category)
      );

    if (commonCategories.length === 0) {
      continue;
    }

    scored.push({
      product: candidate,
      score: commonCategories.length + (candidate.images.length ? 0.2 : 0),
      index,
    });
  }

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      a.index - b.index
  );

  return scored
    .slice(0, safeLimit)
    .map((entry) => entry.product);
}

// ============================================================
// 9. CARTE D'UN PRODUIT SIMILAIRE
// ============================================================

type RelatedProductCardProps = {
  product: Product;
  locale: SiteLocale;
};

function RelatedProductCard({
  product,
  locale,
}: RelatedProductCardProps) {
  const text = translations[locale];

  const productName =
    cleanText(localizedProduct(product, locale).name) ||
    String(product.id);

  const category = getDisplayCategory(
    product, locale
  );

  const price = getProductPrice(
    product
  );

  const imageSource = getProductImage(
    product
  );

  // L'identifiant réel est conservé dans l'URL.
  const productHref =
    `/${locale}/produits/` +
    encodeURIComponent(String(product.id));

  return (
    <article
      data-component="related-product-card"
      className={[
        "group flex h-full min-w-0",
        "flex-col overflow-hidden",
        "rounded-xl",
        "border border-slate-200",
        "bg-white",
        "p-2",
        "shadow-sm",
        "transition-all duration-200",
        "hover:border-[#b4e4a4]",
        "hover:shadow-md",
        "sm:p-3",
      ].join(" ")}
    >
      {/* ==================================================
          IMAGE ET CATÉGORIE
      ================================================== */}

      <div
        className={[
          "relative min-w-0",
          "overflow-hidden",
          "rounded-lg",
          "bg-white",
        ].join(" ")}
      >
        {/* CATÉGORIE */}

        {category && (
          <span
            className={[
              "absolute top-1.5 left-1.5",
              "z-10",
              "max-w-[80%]",
              "truncate rounded-full",
              "bg-[#dff8d3]",
              "px-2 py-1",
              "text-[9px] font-extrabold",
              "text-[#195b17]",
              "sm:top-2 sm:left-2",
              "sm:text-[10px]",
            ].join(" ")}
            title={category}
          >
            {category}
          </span>
        )}

        {/* PHOTO */}

        <Link
          href={productHref}
          aria-label={`${text.viewProduct} : ${productName}`}
          className={[
            "relative block w-full",
            "aspect-5/3",
            "overflow-hidden",
            "rounded-lg",
            "focus-visible:outline-2",
            "focus-visible:outline-[#24b715]",
            "sm:aspect-video",
          ].join(" ")}
        >
          {imageSource ? (
            <Image
              src={imageSource}
              alt={productName}
              fill
              unoptimized
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
              className={[
                "object-contain",
                "p-2 pt-5",
                "transition-transform",
                "duration-300",
                "group-hover:scale-105",
                "sm:p-3",
              ].join(" ")}
            />
          ) : (
            <div
              className={[
                "flex h-full w-full",
                "flex-col items-center",
                "justify-center",
                "gap-1",
                "bg-slate-50",
                "p-3 text-center",
              ].join(" ")}
            >
              <ImageOff
                aria-hidden="true"
                className="h-7 w-7 text-slate-400"
              />

              <span className="text-[10px] text-slate-500">
                {text.imageUnavailable}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* ==================================================
          NOM ET PRIX
      ================================================== */}

      <div
        className={[
          "flex min-w-0 flex-1",
          "flex-col",
          "pt-2",
          "sm:pt-2.5",
        ].join(" ")}
      >
        {/* NOM */}

        <h3
          className={[
            "line-clamp-2",
            "min-h-8",
            "text-[11px]",
            "font-extrabold",
            "leading-4",
            "text-[#102b39]",
            "sm:min-h-9",
            "sm:text-xs",
            "sm:leading-4.5",
            "lg:text-[13px]",
          ].join(" ")}
        >
          <Link
            href={productHref}
            className={[
              "transition-colors",
              "hover:text-[#24b715]",
              "focus-visible:outline-2",
              "focus-visible:outline-[#24b715]",
            ].join(" ")}
          >
            {productName}
          </Link>
        </h3>

        {/* PRIX */}

        <div
          className={[
            "mt-1 flex min-w-0",
            "flex-wrap items-baseline",
            "gap-x-2 gap-y-0.5",
          ].join(" ")}
        >
          {price.current !== null ? (
            <>
              <strong
                className={[
                  "text-[12px]",
                  "font-black cycloriva-price",
                  "leading-tight",
                  "text-[#b91c1c]",
                  "sm:text-sm",
                  "lg:text-base",
                ].join(" ")}
              >
                {formatMoney(
                  price.current,
                  locale
                )}
              </strong>

              {price.previous !== null && (
                <span
                  className={[
                    "text-[10px]",
                    "font-medium",
                    "text-slate-500",
                    "line-through",
                    "sm:text-xs",
                  ].join(" ")}
                >
                  {formatMoney(
                    price.previous,
                    locale
                  )}
                </span>
              )}
            </>
          ) : (
            <span className="text-[11px] font-semibold text-slate-500">
              {text.priceUnavailable}
            </span>
          )}
        </div>

        {/* PROMOTION RÉELLE */}

        {price.discount !== null &&
          price.discount > 0 && (
            <span
              className={[
                "mt-1 inline-flex",
                "w-fit items-center gap-1",
                "rounded-md",
                "bg-[#e8f9df]",
                "px-1.5 py-0.5",
                "text-[9px] font-bold",
                "text-[#187c13]",
              ].join(" ")}
            >
              <Tag
                aria-hidden="true"
                className="h-3 w-3"
              />

              -{price.discount} %
            </span>
          )}

        {/* ==================================================
            BOUTON VERT
        ================================================== */}

        <Link
          href={productHref}
          className={[
            "mt-auto",
            "flex min-h-8 w-full",
            "items-center",
            "justify-center",
            "gap-1.5",
            "rounded-md",
            "bg-[#16a51f]",
            "px-2 py-2",
            "text-center",
            "text-[10px] font-extrabold",
            "text-white",
            "transition-colors",
            "hover:bg-[#11851a]",
            "focus-visible:outline-2",
            "focus-visible:outline-offset-2",
            "focus-visible:outline-[#24b715]",
            "sm:mt-3",
            "sm:min-h-9",
            "sm:text-xs",
          ].join(" ")}
        >
          <span>{text.viewProduct}</span>

          <ArrowRight
            aria-hidden="true"
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
        </Link>
      </div>
    </article>
  );
}

// ============================================================
// 10. COMPOSANT PRINCIPAL
// ============================================================

export function ProductRelatedProducts({
  product,
  locale,
  products = allProducts,
  limit = 4,
  showTitle = true,
  hideWhenEmpty = true,
  className = "",
}: ProductRelatedProductsProps) {
  const language = validLocale(locale);

  const text = translations[language];

  // ==========================================================
  // PRODUITS RÉELS SIMILAIRES
  // ==========================================================

  const relatedProducts = getRelatedProducts(
    product,
    products,
    limit
  );

  // ==========================================================
  // SECTION VIDE
  // ==========================================================

  if (
    relatedProducts.length === 0 &&
    hideWhenEmpty
  ) {
    return null;
  }

  // ==========================================================
  // RENDU
  // ==========================================================

  return (
    <section
      data-component="product-related-products"
      aria-label={text.title}
      className={[
        "w-full min-w-0",
        "border-t border-slate-200",
        "bg-white",
        "pt-3 pb-1",
        "sm:pt-4 sm:pb-1",
        "lg:pt-4 lg:pb-2",
        className,
      ].join(" ")}
    >
      {/* ==================================================
          TITRE
      ================================================== */}

      {showTitle && (
        <div
          className={[
            "mb-3 flex",
            "items-center justify-between",
            "gap-3",
            "sm:mb-4",
          ].join(" ")}
        >
          <h2
            className={[
              "text-sm font-extrabold",
              "text-[#102b39]",
              "sm:text-base",
              "lg:text-lg",
            ].join(" ")}
          >
            {text.title}
          </h2>
        </div>
      )}

      {/* ==================================================
          AUCUN PRODUIT SIMILAIRE
      ================================================== */}

      {relatedProducts.length === 0 ? (
        <p
          className={[
            "rounded-xl",
            "border border-slate-200",
            "bg-slate-50",
            "px-4 py-5",
            "text-sm text-slate-600",
          ].join(" ")}
        >
          {text.unavailable}
        </p>
      ) : (
        /* =================================================
           GRILLE RESPONSIVE
        ================================================= */

        <ProductRelatedRail locale={language} title={text.title}>
          {relatedProducts.map(
            (relatedProduct) => (
              <RelatedProductCard
                key={String(
                  relatedProduct.id
                )}
                product={relatedProduct}
                locale={language}
              />
            )
          )}
        </ProductRelatedRail>
      )}
    </section>
  );
}

export default ProductRelatedProducts;
