
"use client";

import { getProductTranslations, PRODUCT_LOCALES } from "@/lib/product-i18n";


import {
  useId,
  useState,
  type ReactNode,
} from "react";

import {
  ChevronDown,
  ClipboardList,
  MessageSquareText,
  PackageCheck,
} from "lucide-react";

import type { Product } from "@/lib/catalog";
import type { SiteLocale } from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — ONGLETS DES DÉTAILS PRODUIT
// ============================================================
//
// Next.js 16 — React — TypeScript — Tailwind CSS 4
//
// PC :
// - Quatre onglets horizontaux
// - Caractéristiques sélectionnées initialement
// - Tableau technique en deux colonnes
// - Carte des avantages à droite si disponible
//
// MOBILE :
// - Onglets compacts et défilables si nécessaire
// - Description sélectionnée initialement
// - Accordéon des caractéristiques
// - Accordéon "Pourquoi choisir ce vélo ?"
// - Avis et livraison accessibles par onglet
//
// Toutes les données viennent du catalogue ou
// de contenus explicitement fournis par le parent.
//
// Aucun avis ou avantage fictif.
// Aucun header ni footer.
//
// ============================================================

// ============================================================
// 1. TYPES
// ============================================================

export type ProductDetailsTabKey =
  | "description"
  | "specifications"
  | "reviews"
  | "delivery";

export type ProductDetailsTabsProps = {
  product: Product;
  locale: SiteLocale;

  /**
   * Description du produit déjà traduite,
   * si elle est disponible.
   */
  description?: string;

  /**
   * Contenu personnalisé, facultatif.
   *
   * Utile pour intégrer les autres composants
   * sans importer de fichiers encore vides.
   */
  descriptionContent?: ReactNode;
  specificationsContent?: ReactNode;
  reviewsContent?: ReactNode;
  deliveryContent?: ReactNode;

  /**
   * Contenu de la carte :
   * "Pourquoi choisir ce vélo ?"
   *
   * À fournir uniquement avec des avantages
   * réels et justifiés par le produit.
   */
  benefitsContent?: ReactNode;

  /**
   * Nombre réel d'avis.
   * Omettre si aucune source d'avis n'existe.
   */
  reviewsCount?: number;

  /**
   * Onglet initial pour PC et mobile.
   */
  defaultDesktopTab?: ProductDetailsTabKey;
  defaultMobileTab?: ProductDetailsTabKey;

  className?: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

type DetailsText = {
  description: string;
  specifications: string;
  reviews: string;
  delivery: string;
  navigation: string;
  technicalTitle: string;
  benefitsTitle: string;
  descriptionUnavailable: string;
  specificationsUnavailable: string;
  reviewsUnavailable: string;
  deliveryUnavailable: string;
  reference: string;
  weight: string;
  dimensions: string;
};

const translations = Object.fromEntries(PRODUCT_LOCALES.map((locale) => { const t = getProductTranslations(locale); return [locale, { description: t.tabs.description, specifications: t.tabs.specifications, reviews: t.tabs.reviews, delivery: t.tabs.deliveryReturns, navigation: t.tabs.title, technicalTitle: t.specifications.title, benefitsTitle: t.benefits.genericTitle, descriptionUnavailable: t.tabs.noDescription, specificationsUnavailable: t.tabs.noSpecifications, reviewsUnavailable: t.tabs.noReviews, deliveryUnavailable: t.tabs.noDeliveryDetails, reference: t.specifications.reference, weight: t.specifications.weight, dimensions: t.specifications.dimensions }]; })) as Record<SiteLocale, DetailsText>;

// ============================================================
// 3. CONFIGURATION
// ============================================================

const TAB_KEYS: readonly ProductDetailsTabKey[] = [
  "description",
  "specifications",
  "reviews",
  "delivery",
];

function validLocale(locale: SiteLocale): SiteLocale {
  return Object.prototype.hasOwnProperty.call(
    translations,
    locale
  )
    ? locale
    : "fr";
}

function validTab(
  value: ProductDetailsTabKey | undefined,
  fallback: ProductDetailsTabKey
): ProductDetailsTabKey {
  return value && TAB_KEYS.includes(value)
    ? value
    : fallback;
}

// ============================================================
// 4. NETTOYAGE DU TEXTE
// ============================================================

function cleanText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function readValue(value: unknown): string {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return String(value);
  }

  if (typeof value === "boolean") {
    return "";
  }

  if (typeof value === "string") {
    return cleanText(value);
  }

  if (Array.isArray(value)) {
    return value
      .map(readValue)
      .filter(Boolean)
      .join(", ");
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return readValue(
      record.value ??
      record.values ??
      record.option ??
      record.options
    );
  }

  return "";
}

// ============================================================
// 5. EXTRACTION DES CARACTÉRISTIQUES RÉELLES
// ============================================================

export type ProductTechnicalRow = {
  label: string;
  value: string;
};

export function getProductTechnicalRows(
  product: Product,
  locale: SiteLocale
): ProductTechnicalRow[] {
  const text = translations[validLocale(locale)];

  const rows: ProductTechnicalRow[] = [];
  const seen = new Set<string>();

  function add(label: unknown, value: unknown) {
    const cleanLabel = cleanText(label);
    const cleanValue = readValue(value);

    if (
      !cleanLabel ||
      !cleanValue ||
      ["null", "undefined", "n/a", "-"].includes(
        cleanValue.toLowerCase()
      )
    ) {
      return;
    }

    const key = cleanLabel.toLowerCase();

    if (seen.has(key)) {
      return;
    }

    seen.add(key);

    rows.push({
      label: cleanLabel,
      value: cleanValue,
    });
  }

  // Référence du catalogue.
  add(text.reference, product.sku);

  // Attributs réels.
  const attributes: unknown = product.attributes;

  if (Array.isArray(attributes)) {
    for (const item of attributes) {
      if (
        !item ||
        typeof item !== "object" ||
        Array.isArray(item)
      ) {
        continue;
      }

      const attribute = item as Record<string, unknown>;

      add(
        attribute.name ??
          attribute.label ??
          attribute.key,
        attribute.value ??
          attribute.values ??
          attribute.option
      );
    }
  } else if (
    attributes &&
    typeof attributes === "object"
  ) {
    for (const [name, value] of Object.entries(
      attributes as Record<string, unknown>
    )) {
      add(name, value);
    }
  }

  // Poids et dimensions uniquement si ces champs
  // existent réellement dans les données.

  if (
    typeof product.weightKg === "number" &&
    Number.isFinite(product.weightKg) &&
    product.weightKg > 0
  ) {
    add(text.weight, `${product.weightKg} kg`);
  }

  const dimensions = product.dimensionsCm;

  if (dimensions && typeof dimensions === "object") {
    const record = dimensions as Record<string, unknown>;

    const length = record.length;
    const width = record.width;
    const height = record.height;

    if (
      [length, width, height].every(
        (value) =>
          typeof value === "number" &&
          Number.isFinite(value) &&
          value > 0
      )
    ) {
      add(
        text.dimensions,
        `${length} × ${width} × ${height} cm`
      );
    }
  }

  return rows;
}

// ============================================================
// 6. TABLEAU TECHNIQUE
// ============================================================

type TechnicalTableProps = {
  rows: readonly ProductTechnicalRow[];
  emptyText: string;
};

function TechnicalTable({
  rows,
  emptyText,
}: TechnicalTableProps) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm leading-relaxed text-slate-600">
        {emptyText}
      </p>
    );
  }

  // La maquette PC présente deux tableaux.
  const midpoint = Math.ceil(rows.length / 2);

  const columns = [
    rows.slice(0, midpoint),
    rows.slice(midpoint),
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {columns.map((column, index) => (
        <div
          key={index}
          className={[
            "min-w-0 overflow-hidden",
            "rounded-xl border border-slate-200",
            "bg-white",
          ].join(" ")}
        >
          <dl className="divide-y divide-slate-100">
            {column.map((row, rowIndex) => (
              <div
                key={`${row.label}-${rowIndex}`}
                className={[
                  "grid min-w-0",
                  "grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]",
                  "gap-3 px-3 py-2.5",
                  "text-[11px] leading-relaxed",
                  "sm:px-4 sm:text-xs",
                ].join(" ")}
              >
                <dt className="min-w-0 wrap-break-word font-medium text-slate-600">
                  {row.label}
                </dt>

                <dd className="min-w-0 wrap-break-word font-semibold text-[#102b39]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 7. PANNEAU DÉPLIABLE MOBILE
// ============================================================

type MobileAccordionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

function MobileAccordion({
  title,
  children,
  defaultOpen = false,
}: MobileAccordionProps) {
  return (
    <details
      className={[
        "group overflow-hidden",
        "rounded-xl border border-slate-200",
        "bg-white",
      ].join(" ")}
      // defaultOpen fonctionne avec l'élément natif
      // sans ajouter un autre état React.
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary
        className={[
          "flex min-h-11 cursor-pointer",
          "list-none items-center",
          "justify-between gap-3",
          "bg-[#f6faf5]",
          "px-3 py-3",
          "text-xs font-bold",
          "text-[#102b39]",
          "marker:hidden",
          "[&::-webkit-details-marker]:hidden",
        ].join(" ")}
      >
        <span className="min-w-0">{title}</span>

        <ChevronDown
          aria-hidden="true"
          className={[
            "h-4 w-4 shrink-0",
            "text-[#24b715]",
            "transition-transform",
            "group-open:rotate-180",
          ].join(" ")}
        />
      </summary>

      <div className="px-3 py-3">
        {children}
      </div>
    </details>
  );
}

// ============================================================
// 8. CONTENU VIDE
// ============================================================

function EmptyPanel({
  icon: Icon,
  message,
}: {
  icon: typeof ClipboardList;
  message: string;
}) {
  return (
    <div className="flex min-h-24 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <Icon
        aria-hidden="true"
        className="h-6 w-6 shrink-0 text-[#24b715]"
      />

      <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
        {message}
      </p>
    </div>
  );
}

// ============================================================
// 9. COMPOSANT PRINCIPAL
// ============================================================

export function ProductDetailsTabs({
  product,
  locale,
  description,
  descriptionContent,
  specificationsContent,
  reviewsContent,
  deliveryContent,
  benefitsContent,
  reviewsCount,
  defaultDesktopTab = "specifications",
  defaultMobileTab = "description",
  className = "",
}: ProductDetailsTabsProps) {
  const language = validLocale(locale);
  const text = translations[language];
  const uniqueId = useId();

  const [desktopTab, setDesktopTab] =
    useState<ProductDetailsTabKey>(
      validTab(defaultDesktopTab, "specifications")
    );

  const [mobileTab, setMobileTab] =
    useState<ProductDetailsTabKey>(
      validTab(defaultMobileTab, "description")
    );

  // ==========================================================
  // DONNÉES DU PRODUIT
  // ==========================================================

  const technicalRows = getProductTechnicalRows(
    product,
    language
  );

  const descriptionText =
    cleanText(description) ||
    cleanText(product.description) ||
    cleanText(product.shortDescription);

  const validReviewsCount =
    typeof reviewsCount === "number" &&
    Number.isSafeInteger(reviewsCount) &&
    reviewsCount > 0
      ? reviewsCount
      : null;

  const tabLabels: Record<ProductDetailsTabKey, string> = {
    description: text.description,
    specifications: text.specifications,
    reviews:
      validReviewsCount !== null && reviewsContent != null
        ? `${text.reviews} (${validReviewsCount})`
        : text.reviews,
    delivery: text.delivery,
  };

  // ==========================================================
  // CONTENU DE DESCRIPTION
  // ==========================================================

  const productDescription = descriptionContent ?? (
    descriptionText ? (
      <p className="whitespace-pre-line text-xs leading-6 text-[#33485a] sm:text-sm">
        {descriptionText}
      </p>
    ) : (
      <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
        {text.descriptionUnavailable}
      </p>
    )
  );

  // ==========================================================
  // CONTENU DES CARACTÉRISTIQUES
  // ==========================================================

  const productSpecifications =
    specificationsContent ?? (
      <TechnicalTable
        rows={technicalRows}
        emptyText={text.specificationsUnavailable}
      />
    );

  // ==========================================================
  // CONTENU DES AVIS
  // ==========================================================

  const productReviews =
    reviewsContent ?? (
      <EmptyPanel
        icon={MessageSquareText}
        message={text.reviewsUnavailable}
      />
    );

  // ==========================================================
  // CONTENU LIVRAISON ET RETOUR
  // ==========================================================

  const productDelivery =
    deliveryContent ?? (
      <EmptyPanel
        icon={PackageCheck}
        message={text.deliveryUnavailable}
      />
    );

  // ==========================================================
  // CONTENU DES ONGLETS PC
  // ==========================================================

  function renderDesktopPanel(
    tab: ProductDetailsTabKey
  ): ReactNode {
    switch (tab) {
      case "description":
        return (
          <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.9fr)]">
            <div className="min-w-0">
              <h2 className="mb-3 text-lg font-extrabold text-[#102b39]">
                {text.description}
              </h2>

              {productDescription}
            </div>

            {benefitsContent != null && (
              <aside className="min-w-0 rounded-xl bg-[#f0f9ed] p-4">
                <h3 className="mb-3 text-sm font-extrabold text-[#102b39]">
                  {text.benefitsTitle}
                </h3>

                {benefitsContent}
              </aside>
            )}
          </div>
        );

      case "specifications":
        return (
          <div
            className={[
              "grid min-w-0",
              "grid-cols-1 gap-5",
              benefitsContent != null
                ? "lg:grid-cols-[minmax(0,1.8fr)_minmax(240px,0.85fr)]"
                : "",
            ].join(" ")}
          >
            <div className="min-w-0">
              <h2 className="mb-3 text-base font-extrabold text-[#102b39] sm:text-lg">
                {text.technicalTitle}
              </h2>

              {productSpecifications}
            </div>

            {benefitsContent != null && (
              <aside className="min-w-0 rounded-xl bg-[#f0f9ed] p-4">
                <h3 className="mb-3 text-sm font-extrabold text-[#102b39]">
                  {text.benefitsTitle}
                </h3>

                {benefitsContent}
              </aside>
            )}
          </div>
        );

      case "reviews":
        return (
          <div className="min-w-0">
            <h2 className="mb-3 text-base font-extrabold text-[#102b39] sm:text-lg">
              {tabLabels.reviews}
            </h2>

            {productReviews}
          </div>
        );

      case "delivery":
        return (
          <div className="min-w-0">
            <h2 className="mb-3 text-base font-extrabold text-[#102b39] sm:text-lg">
              {text.delivery}
            </h2>

            {productDelivery}
          </div>
        );
    }
  }

  // ==========================================================
  // CONTENU DES ONGLETS MOBILE
  // ==========================================================

  function renderMobilePanel(
    tab: ProductDetailsTabKey
  ): ReactNode {
    switch (tab) {
      case "description":
        return (
          <div className="flex min-w-0 flex-col gap-3">
            {productDescription}

            <MobileAccordion
              title={text.technicalTitle}
            >
              {productSpecifications}
            </MobileAccordion>

            {benefitsContent != null && (
              <MobileAccordion
                title={text.benefitsTitle}
                defaultOpen
              >
                {benefitsContent}
              </MobileAccordion>
            )}
          </div>
        );

      case "specifications":
        return <div className="space-y-3"><MobileAccordion title={text.technicalTitle} defaultOpen>{productSpecifications}</MobileAccordion>{benefitsContent != null && <MobileAccordion title={text.benefitsTitle}>{benefitsContent}</MobileAccordion>}</div>;

      case "reviews":
        return (
          <div className="min-w-0">
            {productReviews}
          </div>
        );

      case "delivery":
        return (
          <div className="min-w-0">
            {productDelivery}
          </div>
        );
    }
  }

  // ==========================================================
  // AFFICHAGE
  // ==========================================================

  return (
    <section
      data-component="product-details-tabs"
      aria-label={text.navigation}
      className={[
        "w-full min-w-0",
        "bg-white text-[#102b39]",
        className,
      ].join(" ")}
    >
      {/* ====================================================
          VERSION PC
      ==================================================== */}

      <div className="hidden lg:block">
        {/* NAVIGATION DES ONGLETS */}

        <div
          role="tablist"
          aria-label={text.navigation}
          className="flex min-w-0 items-center gap-6 border-b border-slate-200"
        >
          {TAB_KEYS.map((tab) => {
            const selected = desktopTab === tab;

            return (
              <button
                key={tab}
                id={`${uniqueId}-desktop-tab-${tab}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${uniqueId}-desktop-panel-${tab}`}
                onClick={() => setDesktopTab(tab)}
                className={[
                  "relative min-h-12",
                  "shrink-0 px-2 py-3",
                  "text-xs font-bold",
                  "transition-colors",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[#24b715]",
                  selected
                    ? "text-[#16851a]"
                    : "text-[#102b39] hover:text-[#24b715]",
                ].join(" ")}
              >
                {tabLabels[tab]}

                {selected && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.75 bg-[#24b715]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* PANNEAU ACTIF */}

        <div
          id={`${uniqueId}-desktop-panel-${desktopTab}`}
          role="tabpanel"
          aria-labelledby={`${uniqueId}-desktop-tab-${desktopTab}`}
          className="min-w-0 py-5"
        >
          {renderDesktopPanel(desktopTab)}
        </div>
      </div>

      {/* ====================================================
          VERSION MOBILE / TABLETTE
      ==================================================== */}

      <div className="lg:hidden">
        {/* BARRE DES ONGLETS */}

        <div
          role="tablist"
          aria-label={text.navigation}
          className={[
            "flex min-w-0 items-center",
            "gap-4 overflow-x-auto",
            "border-b border-slate-200",
            "overscroll-x-contain",
          ].join(" ")}
        >
          {TAB_KEYS.map((tab) => {
            const selected = mobileTab === tab;

            return (
              <button
                key={tab}
                id={`${uniqueId}-mobile-tab-${tab}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${uniqueId}-mobile-panel-${tab}`}
                onClick={() => setMobileTab(tab)}
                className={[
                  "relative min-h-11 shrink-0",
                  "px-1 py-3",
                  "text-[11px] font-bold",
                  "whitespace-nowrap",
                  "transition-colors",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[#24b715]",
                  selected
                    ? "text-[#16851a]"
                    : "text-[#102b39] hover:text-[#24b715]",
                ].join(" ")}
              >
                {tab === "specifications"
                  ? language === "fr"
                    ? "Caractéristiques"
                    : language === "en"
                      ? "Specifications"
                      : language === "de"
                        ? "Technische Daten"
                        : language === "it"
                          ? "Caratteristiche"
                          : "Características"
                  : tabLabels[tab]}

                {selected && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.75 bg-[#24b715]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* CONTENU MOBILE */}

        <div
          id={`${uniqueId}-mobile-panel-${mobileTab}`}
          role="tabpanel"
          aria-labelledby={`${uniqueId}-mobile-tab-${mobileTab}`}
          className="min-w-0 py-3"
        >
          {renderMobilePanel(mobileTab)}
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsTabs;
