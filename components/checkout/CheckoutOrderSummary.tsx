
"use client";

import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import Link from "next/link";
import { productImageUrl } from "@/lib/product-images";
import { allProducts, localizedProduct } from "@/lib/catalog";

import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import {
  calculateCartTotals,
  decreaseCartItemQuantity,
  getCartSnapshot,
  getServerCartSnapshot,
  increaseCartItemQuantity,
  removeFromCart,
  subscribeToCart,
  type CartItem,
  type CartOperationResult,
} from "@/lib/cart";

import {
  formatCheckoutCurrency,
  getCheckoutTranslations,
  normalizeCheckoutLocale,
  translateCheckoutError,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

/**
 * ============================================================
 * CYCLORIVA — RÉCAPITULATIF DE COMMANDE
 * ============================================================
 *
 * Fichier :
 * components/checkout/CheckoutOrderSummary.tsx
 *
 * Next.js 16 — React 19 — TypeScript — Tailwind 4
 *
 * DESIGN :
 * - Bleu marine : #102b39
 * - Vert : #109b24
 * - Blanc et bordures discrètes
 * - Desktop : liste complète des produits
 * - Mobile : liste dépliable, totaux toujours visibles
 *
 * FONCTIONNALITÉS :
 * - Lecture du vrai panier local
 * - Synchronisation avec le header et les autres onglets
 * - Affichage des images réelles du panier
 * - Augmentation des quantités
 * - Diminution des quantités
 * - Suppression d'un article
 * - Affichage du sous-total
 * - Affichage des frais de livraison
 * - Affichage du total confirmé par le devis serveur
 * - États de chargement et d'erreur
 * - Affichage accessible au clavier
 *
 * SÉCURITÉ ET COHÉRENCE :
 * - Les prix locaux sont indicatifs.
 * - Seul le devis serveur établit les montants fiables.
 * - Aucune livraison gratuite n'est inventée.
 * - Aucun faux produit n'est ajouté.
 * - Le composant ne déclenche aucun paiement.
 * - Les modifications du panier sont bloquées
 *   pendant la validation d'une commande.
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

export type CheckoutSummaryPricing = {
  currency: "EUR";
  subtotalCents: number;
  shippingCents: number;
  taxCents: number | null;
  totalCents: number;
};

export type CheckoutOrderSummaryProps = {
  /**
   * Langue actuelle du site.
   */
  locale: CheckoutLocale | string;

  /**
   * Devis obtenu via POST /api/checkout/quote.
   *
   * IMPORTANT :
   * Le parent doit transmettre null si le devis
   * ne correspond plus au panier ou au pays actuel.
   */
  pricing?: CheckoutSummaryPricing | null;

  /**
   * Un calcul de devis est en cours.
   */
  quoteLoading?: boolean;

  /**
   * Code d'erreur du devis.
   */
  quoteError?: string | null;

  /**
   * Une commande est en cours de validation.
   * Les quantités et les suppressions sont bloquées.
   */
  disabled?: boolean;

  /**
   * Permet d'être averti lorsqu'un produit
   * ou une quantité change.
   *
   * Utile pour invalider la clé d'idempotence
   * et le devis dans CheckoutClient.
   */
  onCartChange?: (
    cart: CartOperationResult["cart"]
  ) => void;

  /**
   * Variante responsive :
   * - auto : complet PC, dépliable mobile
   * - expanded : toujours ouvert
   */
  variant?: "auto" | "expanded";

  /**
   * Afficher les lignes produits ouvertes
   * initialement sur mobile.
   *
   * false reproduit le récapitulatif compact
   * de ta maquette mobile.
   */
  initiallyExpanded?: boolean;

  /**
   * Chemin vers la véritable page catalogue.
   */
  productsHref?: string;

  /**
   * Classes CSS supplémentaires.
   */
  className?: string;
};

// ============================================================
// 2. CONSTANTES
// ============================================================

const CARD_CLASS = [
  "min-w-0",
  "overflow-hidden",
  "rounded-xl",
  "border",
  "border-[#dce4eb]",
  "bg-white",
  "shadow-[0_2px_12px_rgba(16,43,57,0.035)]",
].join(" ");

const CONTROL_BUTTON_CLASS = [
  "inline-flex",
  "h-8",
  "w-8",
  "items-center",
  "justify-center",
  "text-[#102b39]",
  "transition-colors",
  "hover:bg-[#eef7ee]",
  "hover:text-[#118c24]",
  "focus-visible:outline-2",
  "focus-visible:outline-[#159c27]",
  "disabled:cursor-not-allowed",
  "disabled:opacity-30",
  "disabled:hover:bg-transparent",
].join(" ");

// ============================================================
// 3. VALIDATION DE L'IMAGE À AFFICHER
// ============================================================
//
// Le panier peut être modifié par le navigateur.
//
// Nous autorisons uniquement :
// - Les chemins relatifs locaux commençant par /
// - Les URL HTTPS absolues
//
// L'image reste une donnée d'affichage,
// jamais une source de confiance commerciale.
//
// ============================================================

function getSafeProductImage(
  image: string | null
): string | null {
  if (!image) {
    return null;
  }

  const value = image.trim();

  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\")
  ) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

// ============================================================
// 4. VÉRIFICATION D'UN DEVIS
// ============================================================

function isValidPricing(
  pricing: CheckoutSummaryPricing | null | undefined
): pricing is CheckoutSummaryPricing {
  if (!pricing) {
    return false;
  }

  const validAmount = (value: number) =>
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= 2_147_483_647;

  if (
    pricing.currency !== "EUR" ||
    !validAmount(pricing.subtotalCents) ||
    !validAmount(pricing.shippingCents) ||
    !validAmount(pricing.totalCents)
  ) {
    return false;
  }

  if (
    pricing.taxCents !== null &&
    !validAmount(pricing.taxCents)
  ) {
    return false;
  }

  return (
    pricing.subtotalCents +
      pricing.shippingCents ===
    pricing.totalCents
  );
}

// ============================================================
// 5. COMPOSANT D'IMAGE
// ============================================================

function ProductThumbnail({
  image,
  name,
}: {
  image: string | null;
  name: string;
}) {
  const safeImage = getSafeProductImage(image ? productImageUrl(image) : image);

  return (
    <div className="flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#e0e6eb] bg-[#fafcfd] sm:h-20 sm:w-20">
      {safeImage ? (
        // Les sources d'images peuvent provenir du
        // catalogue importé et de domaines externes.
        // L'utilisation de img ne nécessite pas de
        // configuration Next/Image pour chaque domaine.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={safeImage}
          alt={name}
          className="h-full w-full object-contain p-1.5"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      ) : (
        <Package
          size={27}
          className="text-[#8ba0af]"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// ============================================================
// 6. CONTRÔLE DE QUANTITÉ
// ============================================================

function QuantityControl({
  quantity,
  disabled,
  decrementLabel,
  incrementLabel,
  productName,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  disabled: boolean;
  decrementLabel: string;
  incrementLabel: string;
  productName: string;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div
      className="inline-flex h-8 items-center overflow-hidden rounded-lg border border-[#d5dfe7] bg-white"
      role="group"
      aria-label={productName}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={onDecrease}
        aria-label={`${decrementLabel} : ${productName}`}
        className={CONTROL_BUTTON_CLASS}
      >
        <Minus size={14} aria-hidden="true" />
      </button>

      <span
        aria-live="polite"
        className="min-w-8 px-1 text-center text-xs font-bold tabular-nums text-[#b91c1c]"
      >
        {quantity}
      </span>

      <button
        type="button"
        disabled={disabled || quantity >= 99}
        onClick={onIncrease}
        aria-label={`${incrementLabel} : ${productName}`}
        className={CONTROL_BUTTON_CLASS}
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

// ============================================================
// 7. LIGNE D'UN PRODUIT
// ============================================================

function SummaryProductRow({
  item,
  locale,
  disabled,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: CartItem;
  locale: CheckoutLocale;
  disabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  const t = getCheckoutTranslations(locale);
  const sourceProduct = allProducts.find(product => product.id === item.productId);
  const name = sourceProduct ? localizedProduct(sourceProduct, locale).name : item.name;

  /**
   * Ce montant provient du panier local.
   * Il sert à l'aperçu des articles.
   *
   * Le total définitif provient séparément
   * du devis recalculé côté serveur.
   */
  const indicativeLineTotal =
    item.unitPriceCents * item.quantity;

  return (
    <div className="flex min-w-0 gap-3 border-b border-[#e8edf1] py-4 last:border-b-0">
      <ProductThumbnail
        image={item.image}
        name={name}
      />

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-w-0 text-[12px] leading-4.5 font-extrabold text-[#102b39] sm:text-[13px]">
            {name}
          </h3>

          <button
            type="button"
            disabled={disabled}
            onClick={onRemove}
            aria-label={`${t.cart.removeProduct} : ${name}`}
            title={t.cart.removeProduct}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#70808d] transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-[#159c27] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>

        {item.sku && (
          <p className="mt-1 truncate text-[10px] leading-4 text-[#687d8b]">
            {item.sku}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
          <QuantityControl
            quantity={item.quantity}
            disabled={disabled}
            decrementLabel={t.cart.decreaseQuantity}
            incrementLabel={t.cart.increaseQuantity}
            productName={name}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />

          <p className="text-right text-[13px] font-black whitespace-nowrap tabular-nums text-[#b91c1c] sm:text-[15px]">
            {Number.isSafeInteger(indicativeLineTotal)
              ? formatCheckoutCurrency(
                  indicativeLineTotal,
                  locale
                )
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 8. LIGNE DE MONTANT
// ============================================================

function AmountRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <span className="min-w-0 text-xs leading-5 text-[#243b4b] sm:text-[13px]">
        {label}
      </span>

      <span
        className={
          emphasized
            ? "shrink-0 text-xs font-bold whitespace-nowrap tabular-nums text-[#109b24] sm:text-[13px]"
            : "shrink-0 text-xs font-semibold whitespace-nowrap tabular-nums text-[#102b39] sm:text-[13px]"
        }
      >
        {value}
      </span>
    </div>
  );
}

// ============================================================
// 9. COMPOSANT PRINCIPAL
// ============================================================

export default function CheckoutOrderSummary({
  locale: rawLocale,
  pricing = null,
  quoteLoading = false,
  quoteError = null,
  disabled = false,
  onCartChange,
  variant = "auto",
  initiallyExpanded = false,
  productsHref,
  className = "",
}: CheckoutOrderSummaryProps) {
  const locale = normalizeCheckoutLocale(rawLocale);
  const t = getCheckoutTranslations(locale);

  // ----------------------------------------------------------
  // PANIER GLOBAL
  // ----------------------------------------------------------

  const cart = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot
  );

  const cartTotals = useMemo(
    () => calculateCartTotals(cart),
    [cart]
  );

  const hasItems = cart.items.length > 0;

  // ----------------------------------------------------------
  // DÉPLIABLE MOBILE
  // ----------------------------------------------------------

  const [expanded, setExpanded] = useState(
    initiallyExpanded
  );

  // ----------------------------------------------------------
  // ERREURS DES ACTIONS SUR LE PANIER
  // ----------------------------------------------------------

  const [cartError, setCartError] = useState<
    string | null
  >(null);

  // ----------------------------------------------------------
  // DEVIS CONFIRMÉ
  // ----------------------------------------------------------

  const verifiedPricing =
    hasItems && isValidPricing(pricing)
      ? pricing
      : null;

  /**
   * Les totaux sans devis sont uniquement
   * des indications issues du panier local.
   *
   * On ne montre jamais de total final
   * tant que le devis serveur est absent.
   */
  const displayedSubtotalCents =
    verifiedPricing?.subtotalCents ??
    cartTotals.subtotalCents;

  // ----------------------------------------------------------
  // ARTICLES DU PANIER
  // ----------------------------------------------------------

  const productCount = cartTotals.itemCount;

  const productsLabel =
    productCount === 1
      ? t.cart.product
      : t.cart.products;

  // ----------------------------------------------------------
  // EXÉCUTER UNE ACTION SUR LE PANIER
  // ----------------------------------------------------------

  const runCartAction = useCallback(
    (action: () => CartOperationResult) => {
      if (disabled) {
        return;
      }

      setCartError(null);

      const result = action();

      if (!result.success) {
        setCartError(
          result.error ?? "UNKNOWN_ERROR"
        );

        return;
      }

      /**
       * CheckoutClient invalidera ici :
       * - son devis serveur précédent
       * - sa clé d'idempotence en cours
       * - ses éventuelles erreurs de formulaire
       */
      onCartChange?.(result.cart);
    },
    [disabled, onCartChange]
  );

  // ----------------------------------------------------------
  // MODIFIER LES QUANTITÉS
  // ----------------------------------------------------------

  const decreaseQuantity = useCallback(
    (lineId: string) => {
      runCartAction(() =>
        decreaseCartItemQuantity(lineId)
      );
    },
    [runCartAction]
  );

  const increaseQuantity = useCallback(
    (lineId: string) => {
      runCartAction(() =>
        increaseCartItemQuantity(lineId)
      );
    },
    [runCartAction]
  );

  const removeProduct = useCallback(
    (lineId: string) => {
      runCartAction(() =>
        removeFromCart(lineId)
      );
    },
    [runCartAction]
  );

  // ----------------------------------------------------------
  // LIEN VERS LE CATALOGUE RÉEL
  // ----------------------------------------------------------

  const catalogueHref =
    productsHref ?? `/${locale}/produits`;

  // ----------------------------------------------------------
  // RENDU
  // ----------------------------------------------------------

  return (
    <section
      className={`${CARD_CLASS} ${className}`}
      aria-label={t.accessibility.orderSummary}
      data-component="checkout-order-summary"
    >
      <div className="p-4 sm:p-5">

        {/* ==================================================
            EN-TÊTE DU RÉCAPITULATIF
        ================================================== */}

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <ShoppingCart
              size={24}
              strokeWidth={1.9}
              className="mt-0.5 shrink-0 text-[#109b24]"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <h2 className="text-[14px] leading-6 font-black tracking-tight text-[#102b39] sm:text-[17px]">
                {t.cart.title}
              </h2>

              <p className="mt-1 text-[11px] leading-5 text-[#536879] sm:text-xs">
                {productCount} {productsLabel}
              </p>
            </div>
          </div>

          {/* BOUTON DÉPLIABLE MOBILE */}

          {variant === "auto" && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="cycloriva-summary-items"
              aria-label={t.cart.summary}
              onClick={() =>
                setExpanded((current) => !current)
              }
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#102b39] transition-colors hover:bg-[#eef7ee] focus-visible:outline-2 focus-visible:outline-[#159c27] lg:hidden"
            >
              {expanded ? (
                <ChevronUp size={19} />
              ) : (
                <ChevronDown size={19} />
              )}
            </button>
          )}
        </div>

        {/* ==================================================
            LISTE DES PRODUITS
        ================================================== */}

        <div
          id="cycloriva-summary-items"
          className={[
            "mt-4",
            "border-t",
            "border-[#e1e7ec]",
            variant === "expanded" || expanded
              ? "block"
              : "hidden lg:block",
          ].join(" ")}
        >
          {!hasItems ? (
            <div className="px-2 py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf8e9]">
                <ShoppingCart
                  size={27}
                  className="text-[#109b24]"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-3 text-sm font-extrabold text-[#102b39]">
                {t.cart.empty}
              </h3>

              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-[#617380]">
                {t.cart.emptyDescription}
              </p>

              <Link
                href={catalogueHref}
                className="mt-4 inline-flex min-h-9 items-center justify-center rounded-lg bg-[#109b24] px-4 text-xs font-bold text-white transition-colors hover:bg-[#087a19]"
              >
                {t.cart.continueShopping}
              </Link>
            </div>
          ) : (
            <div>
              {cart.items.map((item) => (
                <SummaryProductRow
                  key={item.lineId}
                  item={item}
                  locale={locale}
                  disabled={disabled}
                  onDecrease={() =>
                    decreaseQuantity(item.lineId)
                  }
                  onIncrease={() =>
                    increaseQuantity(item.lineId)
                  }
                  onRemove={() =>
                    removeProduct(item.lineId)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* ==================================================
            MESSAGES D'ERREUR DU PANIER
        ================================================== */}

        {cartError && (
          <div
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700"
          >
            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />

            <span>
              {translateCheckoutError(
                cartError,
                locale
              )}
            </span>
          </div>
        )}

        {/* ==================================================
            TOTALS ET LIVRAISON
        ================================================== */}

        <div className="mt-4 space-y-3 border-t border-[#e1e7ec] pt-4">

          {/* SOUS-TOTAL */}

          <AmountRow
            label={t.cart.subtotal}
            value={
              hasItems
                ? formatCheckoutCurrency(
                    displayedSubtotalCents,
                    locale
                  )
                : formatCheckoutCurrency(0, locale)
            }
          />

          {/* LIVRAISON */}

          <AmountRow
            label={t.cart.shipping}
            value={
              verifiedPricing
                ? verifiedPricing.shippingCents === 0
                  ? t.cart.freeShipping
                  : formatCheckoutCurrency(
                      verifiedPricing.shippingCents,
                      locale
                    )
                : t.cart.shippingPending
            }
            emphasized={
              verifiedPricing !== null &&
              verifiedPricing.shippingCents === 0
            }
          />

          {/* TAXES : SI VENTILATION DISPONIBLE */}

          {verifiedPricing &&
            verifiedPricing.taxCents !== null && (
              <AmountRow
                label={t.cart.taxes}
                value={formatCheckoutCurrency(
                  verifiedPricing.taxCents,
                  locale
                )}
              />
            )}

          {/* TOTAL OFFICIEL */}

          <div className="flex min-w-0 items-center justify-between gap-3 rounded-lg bg-[#eaf7e9] px-3 py-3.5 sm:px-4">
            <span className="text-[13px] font-black leading-5 text-[#102b39] sm:text-[15px]">
              {verifiedPricing
                ? t.cart.total
                : t.cart.totalPending}
            </span>

            <span
              className="text-right text-[19px] leading-6 font-black whitespace-nowrap tabular-nums text-[#b91c1c] sm:text-[23px]"
              aria-live="polite"
            >
              {verifiedPricing
                ? formatCheckoutCurrency(
                    verifiedPricing.totalCents,
                    locale
                  )
                : "—"}
            </span>
          </div>

          {/* DEVIS EN COURS */}

          {quoteLoading && (
            <div
              role="status"
              className="flex items-center gap-2 text-xs leading-5 text-[#617380]"
            >
              <LoaderCircle
                size={15}
                className="shrink-0 animate-spin text-[#109b24]"
                aria-hidden="true"
              />
              {t.common.loading}
            </div>
          )}

          {/* ERREUR DE DEVIS */}

          {quoteError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700"
            >
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />

              <span>
                {translateCheckoutError(
                  quoteError,
                  locale
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 10. EXPORT NOMMÉ
// ============================================================

export { CheckoutOrderSummary };

// ============================================================
// FIN — CYCLORIVA CHECKOUT ORDER SUMMARY
// ============================================================
