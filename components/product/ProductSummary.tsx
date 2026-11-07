import { getProductTranslations, PRODUCT_LOCALES } from "@/lib/product-i18n";
import { productIntroduction, productParagraphs } from "@/lib/product-content";

import { Check, Star, Tag } from "lucide-react";

import type { Product } from "@/lib/catalog";
import type { SiteLocale } from "@/lib/site-i18n";

type ProductSummaryBadge =
  | "bestseller"
  | "new"
  | "promotion";

type ProductSummaryReview = {
  rating: number;
  count: number;
};

export type ProductSummaryProps = {
  product: Product;
  locale: SiteLocale;
  productName?: string;
  shortDescription?: string;
  description?: string;
  badge?: ProductSummaryBadge | null;
  reviews?: ProductSummaryReview | null;
  showDescription?: boolean;
  className?: string;
};

const labels = Object.fromEntries(PRODUCT_LOCALES.map((locale) => { const t = getProductTranslations(locale); return [locale, { information: t.summary.productDetails, priceUnknown: t.summary.priceUnavailable, stockUnknown: t.summary.stockUnknown, stockAvailable: t.summary.inStock, stockUnavailable: t.summary.outOfStock, noDescription: t.summary.descriptionUnavailable, reference: t.summary.sku, bestseller: t.summary.bestseller, new: t.summary.new, promotion: t.summary.promotion, reviews: t.summary.reviews }]; })) as Record<
  SiteLocale,
  {
    information: string;
    priceUnknown: string;
    stockUnknown: string;
    stockAvailable: string;
    stockUnavailable: string;
    noDescription: string;
    reference: string;
    bestseller: string;
    new: string;
    promotion: string;
    reviews: string;
  }
>;

const numberLocales: Record<SiteLocale, string> = {
  fr: "fr-FR",
  en: "en-GB",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
};

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Limite le texte au dernier mot entier.
 * La description complète reste disponible
 * dans les onglets de la fiche produit.
 */
function excerpt(
  value: string,
  maximum: number
): string {
  if (value.length <= maximum) return value;

  const part = value.slice(0, maximum + 1);
  const boundary = part.lastIndexOf(" ");

  return (
    (boundary > maximum * 0.6
      ? part.slice(0, boundary)
      : value.slice(0, maximum)
    ).trimEnd() + "…"
  );
}

function validPrice(value: unknown): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.replace(",", "."))
        : NaN;

  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : null;
}

function getPrices(product: Product) {
  const normal = validPrice(product.price);
  const regular = validPrice(product.regularPrice);
  const sale = validPrice(product.salePrice);

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
    current: normal ?? regular ?? sale,
    previous: null,
    discount: null,
  };
}

function getStock(product: Product) {
  if (product.stockConfirmed !== true) {
    return "unknown" as const;
  }

  const quantity = product.stockQuantityAtExport;

  if (
    typeof quantity !== "number" ||
    !Number.isFinite(quantity) ||
    quantity < 0
  ) {
    return "unknown" as const;
  }

  return quantity > 0
    ? ("available" as const)
    : ("unavailable" as const);
}

function formatMoney(
  amount: number,
  locale: SiteLocale
) {
  return new Intl.NumberFormat(numberLocales[locale], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function ProductSummary({
  product,
  locale,
  productName,
  shortDescription,
  description,
  badge = null,
  reviews = null,
  showDescription = true,
  className = "",
}: ProductSummaryProps) {
  const language = labels[locale] ? locale : "fr";
  const text = labels[language];

  const name =
    cleanText(productName) ||
    cleanText(product.name) ||
    String(product.id);

  const rawFull =
    cleanText(description) ||
    cleanText(product.description);

  // La courte description ne doit pas devenir
  // un grand paragraphe avant le prix.
  const subtitle = excerpt(
    productParagraphs(shortDescription || product.shortDescription)[0] || rawFull,
    115
  );

  // Le texte principal affiché ici doit être
  // une introduction, pas la totalité de la fiche.
  const introduction = excerpt(
    productIntroduction(description || product.description) || productIntroduction(shortDescription || product.shortDescription),
    245
  );

  const prices = getPrices(product);
  const stock = getStock(product);

  const ratingValid =
    reviews !== null &&
    Number.isFinite(reviews.rating) &&
    reviews.rating >= 0 &&
    reviews.rating <= 5 &&
    Number.isSafeInteger(reviews.count) &&
    reviews.count > 0;

  const badgeText =
    badge === "bestseller"
      ? text.bestseller
      : badge === "new"
        ? text.new
        : badge === "promotion" &&
            prices.discount !== null
          ? text.promotion
          : null;

  const sku =
    typeof product.sku === "string"
      ? product.sku.trim()
      : "";

  return (
    <section
      data-component="product-summary"
      aria-label={text.information}
      className={[
        "min-w-0 w-full",
        "text-[#102b39]",
        className,
      ].join(" ")}
    >
      {/* BADGE UNIQUEMENT SI CONFIRMÉ */}
      {badgeText && (
        <span className="mb-2 inline-flex rounded-full bg-[#24b715] px-2.5 py-1 text-[10px] font-bold text-white">
          {badgeText}
        </span>
      )}

      {/* NOM : TAILLE PROCHE DE LA MAQUETTE */}
      <h1
        className={[
          "wrap-break-word",
          "text-[19px] leading-[1.2]",
          "font-extrabold tracking-tight",
          "sm:text-[22px]",
          "lg:text-[23px]",
          "xl:text-[25px]",
        ].join(" ")}
      >
        {name}
      </h1>

      {/* COURTE DESCRIPTION : 2 LIGNES MAXIMUM */}
      {subtitle && (
        <p
          className={[
            "mt-1.5 line-clamp-2",
            "text-[12px] leading-normal",
            "font-medium text-[#44586b]",
            "sm:text-[13px]",
          ].join(" ")}
        >
          {subtitle}
        </p>
      )}

      {/* AVIS RÉELS UNIQUEMENT */}
      {ratingValid && reviews && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div
            aria-hidden="true"
            className="flex items-center gap-0.5"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={[
                  "h-3.5 w-3.5",
                  reviews.rating >= index + 0.5
                    ? "fill-[#eeb300] text-[#eeb300]"
                    : "text-slate-300",
                ].join(" ")}
              />
            ))}
          </div>

          <span className="text-[11px] font-semibold">
            {reviews.rating.toLocaleString(
              numberLocales[language],
              { maximumFractionDigits: 1 }
            )}{" "}
            ({reviews.count} {text.reviews})
          </span>
        </div>
      )}

      {/* PRIX IMMÉDIATEMENT APRÈS LE TITRE */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-4">
        {prices.current !== null ? (
          <div className="flex flex-wrap items-baseline gap-x-2">
            <strong className="cycloriva-price text-[#b91c1c] text-[25px] font-black leading-none tracking-tight sm:text-[29px]">
              {formatMoney(prices.current, language)}
            </strong>

            {prices.previous !== null && (
              <span className="text-[12px] text-slate-500 line-through">
                {formatMoney(
                  prices.previous,
                  language
                )}
              </span>
            )}
          </div>
        ) : (
          <p className="font-semibold text-slate-600">
            {text.priceUnknown}
          </p>
        )}

        <span
          className={[
            "inline-flex items-center gap-1.5",
            "text-[11px] font-semibold",
            stock === "available"
              ? "text-[#16851a]"
              : stock === "unavailable"
                ? "text-red-700"
                : "text-[#16851a]",
          ].join(" ")}
        >
          {stock === "available" ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#24b715] text-white">
              <Check className="h-3 w-3" />
            </span>
          ) : (
            <span className="h-2 w-2 rounded-full bg-current opacity-70" />
          )}

          {stock === "available"
            ? text.stockAvailable
            : stock === "unavailable"
              ? text.stockUnavailable
              : text.stockUnknown}
        </span>
      </div>

      {/* PROMOTION RÉELLE */}
      {prices.discount !== null &&
        prices.discount > 0 && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e8f8df] px-2 py-1 text-[10px] font-bold text-[#187c13]">
              <Tag className="h-3 w-3" />
              -{prices.discount} %
            </span>
          </div>
        )}

      {/* PRÉSENTATION COURTE SOUS LE PRIX */}
      {showDescription && introduction && !introduction.startsWith(subtitle.replace(/…$/, "")) && (
        <p
          className={[
            "mt-3 max-w-2xl",
            "text-[12px] leading-[1.65]",
            "text-[#33485a]",
            "sm:mt-4 sm:text-[13px]",
            "line-clamp-4",
          ].join(" ")}
        >
          {introduction || text.noDescription}
        </p>
      )}

      {/* RÉFÉRENCE DISCRÈTE */}
      {sku && (
        <p className="mt-2 text-[10px] text-slate-500 sm:text-[11px]">
          {text.reference} : {sku}
        </p>
      )}
    </section>
  );
}

export default ProductSummary;
