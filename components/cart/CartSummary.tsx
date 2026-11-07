
"use client";

import Link from "next/link";

import {
  ArrowRight,
  Calculator,
  LockKeyhole,
} from "lucide-react";

import {
  formatCheckoutCurrency,
  normalizeCheckoutLocale,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

/**
 * ============================================================
 * CYCLORIVA — RÉCAPITULATIF DU PANIER
 * ============================================================
 *
 * Fichier :
 * components/cart/CartSummary.tsx
 *
 * Next.js 16 — React 19 — TypeScript — Tailwind CSS 4
 *
 * ARCHITECTURE VISUELLE :
 *
 * PC :
 * - Carte à droite du panier
 * - Titre "Récapitulatif" avec icône
 * - Sous-total et nombre d'articles
 * - Livraison à calculer
 * - Séparateur horizontal
 * - Total des produits sur fond vert clair
 * - Grand bouton vert "Passer commande"
 * - Note de confidentialité
 *
 * MOBILE :
 * - Carte sous les produits
 * - Même contenu
 * - Mise en page compacte
 * - Bouton pleine largeur
 * - Aucun débordement horizontal
 *
 * DONNÉES :
 * - Les articles et le sous-total proviennent
 *   directement de lib/cart.ts via CartClient.
 * - Aucun prix inventé.
 * - Les frais de livraison sont calculés ensuite,
 *   à l'étape de commande selon le pays.
 * - Le montant affiché n'inclut pas les éventuels
 *   frais de livraison non encore déterminés.
 *
 * SÉCURITÉ :
 * - Aucun paiement déclenché ici.
 * - Aucun numéro de carte bancaire collecté.
 * - Aucune commande enregistrée ici.
 * - La validation finale est effectuée côté serveur.
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

export type CartSummaryProps = {
  /**
   * Langue de la boutique.
   */
  locale: CheckoutLocale | string;

  /**
   * Nombre total d'articles du panier.
   * Somme des quantités, pas seulement
   * nombre de lignes distinctes.
   */
  itemCount: number;

  /**
   * Sous-total local, en centimes d'euro.
   */
  subtotalCents: number;

  /**
   * True lorsqu'il existe au moins un article.
   */
  hasItems: boolean;

  /**
   * Lien vers la page de commande.
   */
  checkoutHref?: string;

  /**
   * Classes CSS supplémentaires.
   */
  className?: string;
};

// ============================================================
// 2. TEXTES MULTILINGUES
// ============================================================

type CartSummaryTexts = {
  title: string;

  subtotal: string;

  article: string;

  articles: string;

  shipping: string;

  shippingFree: string;


  productsTotal: string;

  checkoutButton: string;

  privacyNotice: string;

  emptyCartMessage: string;

  invalidAmount: string;
};

const SUMMARY_TEXTS: Record<
  CheckoutLocale,
  CartSummaryTexts
> = {
  fr: {
    title: "Récapitulatif",
    subtotal: "Sous-total",
    article: "article",
    articles: "articles",
    shipping: "Livraison",
    shippingFree: "Gratuite",
    productsTotal: "Total des produits",
    checkoutButton: "Passer commande",
    privacyNotice:
      "Vos coordonnées seront saisies à l'étape suivante.",
    emptyCartMessage:
      "Ajoutez un produit pour continuer.",
    invalidAmount:
      "Montant indisponible",
  },

  en: {
    title: "Order summary",
    subtotal: "Subtotal",
    article: "item",
    articles: "items",
    shipping: "Shipping",
    shippingFree: "Free",
    productsTotal: "Products total",
    checkoutButton: "Proceed to checkout",
    privacyNotice:
      "Your contact details will be entered in the next step.",
    emptyCartMessage:
      "Add a product to continue.",
    invalidAmount:
      "Amount unavailable",
  },

  de: {
    title: "Zusammenfassung",
    subtotal: "Zwischensumme",
    article: "Artikel",
    articles: "Artikel",
    shipping: "Versand",
    shippingFree: "Kostenlos",
    productsTotal: "Warenwert",
    checkoutButton: "Zur Kasse",
    privacyNotice:
      "Ihre Kontaktdaten geben Sie im nächsten Schritt ein.",
    emptyCartMessage:
      "Fügen Sie ein Produkt hinzu, um fortzufahren.",
    invalidAmount:
      "Betrag nicht verfügbar",
  },

  it: {
    title: "Riepilogo",
    subtotal: "Subtotale",
    article: "articolo",
    articles: "articoli",
    shipping: "Spedizione",
    shippingFree: "Gratuita",
    productsTotal: "Totale prodotti",
    checkoutButton: "Procedi all'ordine",
    privacyNotice:
      "I tuoi dati saranno inseriti nella fase successiva.",
    emptyCartMessage:
      "Aggiungi un prodotto per continuare.",
    invalidAmount:
      "Importo non disponibile",
  },

  es: {
    title: "Resumen",
    subtotal: "Subtotal",
    article: "artículo",
    articles: "artículos",
    shipping: "Envío",
    shippingFree: "Gratis",
    productsTotal: "Total de productos",
    checkoutButton: "Realizar pedido",
    privacyNotice:
      "Tus datos de contacto se introducirán en el siguiente paso.",
    emptyCartMessage:
      "Añade un producto para continuar.",
    invalidAmount:
      "Importe no disponible",
  },
};

// ============================================================
// 3. CONSTANTES VISUELLES
// ============================================================

const CARD_CLASS = [
  "w-full",
  "min-w-0",
  "overflow-hidden",
  "rounded-xl",
  "border",
  "border-[#dce5ec]",
  "bg-white",
  "shadow-[0_3px_15px_rgba(16,43,57,0.045)]",
].join(" ");

const CHECKOUT_BUTTON_CLASS = [
  "group",
  "inline-flex",
  "min-h-13",
  "w-full",
  "items-center",
  "justify-center",
  "gap-3",
  "rounded-lg",
  "bg-[#008e16]",
  "px-4",
  "py-3",
  "text-center",
  "text-[15px]",
  "font-extrabold",
  "leading-6",
  "text-white",
  "shadow-[0_3px_8px_rgba(0,142,22,0.12)]",
  "transition-colors",
  "duration-150",
  "hover:bg-[#007a12]",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-[#109b24]",
  "sm:text-[16px]",
].join(" ");

// ============================================================
// 4. NORMALISATION DES MONTANTS
// ============================================================

function isValidSubtotal(
  value: number
): boolean {
  return (
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= 2_147_483_647
  );
}

function isValidItemCount(
  value: number
): boolean {
  return (
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= 9_900
  );
}

// ============================================================
// 5. COMPOSANT DE LIGNE RÉCAPITULATIVE
// ============================================================

function SummaryLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex min-w-0 items-start
                 justify-between gap-3"
    >
      <span
        className="min-w-0 text-[12px]
                   leading-5 text-[#102b39]
                   sm:text-[14px]"
      >
        {label}
      </span>

      <span
        className="shrink-0 text-right
                   text-[12px] leading-5
                   font-semibold whitespace-nowrap
                   tabular-nums text-[#102b39]
                   sm:text-[14px]"
      >
        {value}
      </span>
    </div>
  );
}

// ============================================================
// 6. COMPOSANT PRINCIPAL
// ============================================================

export default function CartSummary({
  locale: rawLocale,
  itemCount,
  subtotalCents,
  hasItems,
  checkoutHref,
  className = "",
}: CartSummaryProps) {
  // ----------------------------------------------------------
  // LANGUE
  // ----------------------------------------------------------

  const locale =
    normalizeCheckoutLocale(rawLocale);

  const text =
    SUMMARY_TEXTS[locale];

  // ----------------------------------------------------------
  // VALIDATION DES DONNÉES D'AFFICHAGE
  // ----------------------------------------------------------

  const countIsValid =
    isValidItemCount(itemCount);

  const subtotalIsValid =
    isValidSubtotal(subtotalCents);

  const validCart =
    hasItems &&
    countIsValid &&
    itemCount > 0 &&
    subtotalIsValid;

  // ----------------------------------------------------------
  // NOMBRE D'ARTICLES
  // ----------------------------------------------------------

  const articleCountText =
    countIsValid
      ? `${itemCount} ${
          itemCount === 1
            ? text.article
            : text.articles
        }`
      : text.invalidAmount;

  // ----------------------------------------------------------
  // MONTANT
  // ----------------------------------------------------------

  const displaySubtotal =
    subtotalIsValid
      ? formatCheckoutCurrency(
          subtotalCents,
          locale
        )
      : text.invalidAmount;

  // ----------------------------------------------------------
  // CHEMIN DE COMMANDE
  // ----------------------------------------------------------

  const resolvedCheckoutHref =
    checkoutHref ??
    `/${locale}/commande`;

  // ----------------------------------------------------------
  // RENDU
  // ----------------------------------------------------------

  return (
    <section
      aria-label={text.title}
      data-component="cart-summary"
      className={`${CARD_CLASS} ${className}`}
    >
      <div className="px-4 py-5 sm:px-5 sm:py-6">

        {/* ==================================================
            TITRE
        ================================================== */}

        <div
          className="flex items-center gap-3"
        >
          <Calculator
            size={27}
            strokeWidth={1.9}
            aria-hidden="true"
            className="shrink-0 text-[#109b24]"
          />

          <h2
            className="text-[17px] font-black
                       tracking-tight text-[#102b39]
                       sm:text-[21px]"
          >
            {text.title}
          </h2>
        </div>

        {/* ==================================================
            LIGNES DE MONTANTS
        ================================================== */}

        <div className="mt-6 space-y-4">

          {/* SOUS-TOTAL */}

          <SummaryLine
            label={`${text.subtotal} (${articleCountText})`}
            value={displaySubtotal}
          />

          {/* LIVRAISON */}

          <div
            className="flex min-w-0
                       items-center justify-between gap-3"
          >
            <span
              className="text-[12px]
                         leading-5 text-[#102b39]
                         sm:text-[14px]"
            >
              {text.shipping}
            </span>

            <div className="flex shrink-0 items-center gap-2">
              <span
                className="text-[12px]
                           font-semibold text-[#078d21]
                           sm:text-[14px]"
              >
                {text.shippingFree}
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            SÉPARATEUR
        ================================================== */}

        <div
          aria-hidden="true"
          className="my-5 h-px w-full bg-[#dce5ec]"
        />

        {/* ==================================================
            TOTAL DES PRODUITS
        ================================================== */}

        <div
          className="flex min-w-0 items-center
                     justify-between gap-3
                     rounded-xl bg-[#eaf8e7]
                     px-3 py-4 sm:px-4"
        >
          <span
            className="text-[13px]
                       leading-5 font-black
                       text-[#102b39]
                       sm:text-[15px]"
          >
            {text.productsTotal}
          </span>

          <strong
            aria-live="polite"
            className="shrink-0 text-right
                       text-[18px] leading-6
                       font-black whitespace-nowrap
                       tabular-nums text-[#b91c1c]
                       sm:text-[22px]"
          >
            {displaySubtotal}
          </strong>
        </div>

        {/* ==================================================
            PASSER COMMANDE
        ================================================== */}

        <div className="mt-5">
          {validCart ? (
            <Link
              href={resolvedCheckoutHref}
              className={CHECKOUT_BUTTON_CLASS}
            >
              <span>
                {text.checkoutButton}
              </span>

              <ArrowRight
                size={20}
                strokeWidth={2}
                aria-hidden="true"
                className="shrink-0 transition-transform group-hover:translate-x-1"
              />
            </Link>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              title={text.emptyCartMessage}
              className={`${CHECKOUT_BUTTON_CLASS} cursor-not-allowed bg-[#b6c9bb] shadow-none hover:bg-[#b6c9bb]`}
            >
              {text.checkoutButton}

              <ArrowRight
                size={20}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {/* ==================================================
            CONFIDENTIALITÉ
        ================================================== */}

        <div
          className="mt-4 flex items-start
                     justify-center gap-2"
        >
          <LockKeyhole
            size={16}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[#102b39]"
          />

          <p
            className="text-center text-[11px]
                       leading-5 text-[#314b5d]
                       sm:text-[12px]"
          >
            {text.privacyNotice}
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 7. EXPORT NOMMÉ
// ============================================================

export { CartSummary };

// ============================================================
// FIN — CYCLORIVA CART SUMMARY
// ============================================================
