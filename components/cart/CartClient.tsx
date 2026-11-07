
"use client";

import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import Link from "next/link";
import { productImageUrl } from "@/lib/product-images";

import {
  AlertCircle,
  ArrowLeft,
  Headphones,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Truck,
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
} from "@/lib/cart";

import {
  formatCheckoutCurrency,
  normalizeCheckoutLocale,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

import { allProducts, localizedProduct, stripHtml } from "@/lib/catalog";

import CartSummary from "@/components/cart/CartSummary";

/**
 * ============================================================
 * CYCLORIVA — PAGE PANIER / COMPOSANT PRINCIPAL
 * ============================================================
 *
 * Fichier :
 * components/cart/CartClient.tsx
 *
 * Next.js 16 — React 19 — TypeScript
 * Tailwind CSS 4
 *
 * ARCHITECTURE :
 *
 * PC :
 * - Titre "Mon panier"
 * - Nombre d'articles
 * - Produits à gauche
 * - Récapitulatif à droite
 * - Continuer mes achats
 * - Bandeau des services
 *
 * MOBILE :
 * - Titre compact
 * - Produits empilés
 * - Quantités accessibles
 * - Prix lisibles
 * - Récapitulatif en dessous
 * - Bouton passer commande
 * - Continuer mes achats
 *
 * DONNÉES :
 * - Panier réel provenant de lib/cart.ts
 * - Aucun produit fictif
 * - Aucun prix inventé
 * - Aucune livraison gratuite supposée
 *
 * ============================================================
 */

// ============================================================
// 1. PROPRIÉTÉS
// ============================================================

export type CartClientProps = {
  locale: CheckoutLocale | string;

  className?: string;

  /**
   * Lien vers la page catalogue.
   */
  productsHref?: string;

  /**
   * Lien vers la page de commande.
   */
  checkoutHref?: string;
};

// ============================================================
// 2. TRADUCTIONS DE LA PAGE PANIER
// ============================================================

type CartTexts = {
  title: string;
  article: string;
  articles: string;
  reference: string;
  continueShopping: string;
  emptyTitle: string;
  emptyDescription: string;
  discoverProducts: string;
  decrease: string;
  increase: string;
  delete: string;
  quantity: string;
  cartError: string;

  serviceDelivery: string;
  serviceDeliveryDescription: string;
  serviceSecurity: string;
  serviceSecurityDescription: string;
  serviceReturns: string;
  serviceReturnsDescription: string;
  serviceSupport: string;
  serviceSupportDescription: string;
};

const CART_TEXTS: Record<CheckoutLocale, CartTexts> = {
  fr: {
    title: "Mon panier",
    article: "article",
    articles: "articles",
    reference: "Réf.",
    continueShopping: "Continuer mes achats",
    emptyTitle: "Votre panier est vide",
    emptyDescription:
      "Vous n'avez pas encore ajouté de produit à votre panier.",
    discoverProducts: "Découvrir nos produits",
    decrease: "Diminuer la quantité",
    increase: "Augmenter la quantité",
    delete: "Supprimer le produit",
    quantity: "Quantité",
    cartError:
      "Impossible de modifier le panier. Veuillez réessayer.",

    serviceDelivery: "Livraison en Europe",
    serviceDeliveryDescription:
      "Selon votre destination",
    serviceSecurity: "Données protégées",
    serviceSecurityDescription:
      "Traitement confidentiel",
    serviceReturns: "Retours",
    serviceReturnsDescription:
      "Selon nos conditions",
    serviceSupport: "Service client",
    serviceSupportDescription:
      "Assistance pour vos achats",
  },

  en: {
    title: "My cart",
    article: "item",
    articles: "items",
    reference: "Ref.",
    continueShopping: "Continue shopping",
    emptyTitle: "Your cart is empty",
    emptyDescription:
      "You haven't added any products to your cart yet.",
    discoverProducts: "Browse products",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    delete: "Remove product",
    quantity: "Quantity",
    cartError:
      "Unable to update your cart. Please try again.",

    serviceDelivery: "European delivery",
    serviceDeliveryDescription:
      "Subject to destination",
    serviceSecurity: "Protected data",
    serviceSecurityDescription:
      "Confidential processing",
    serviceReturns: "Returns",
    serviceReturnsDescription:
      "Subject to our terms",
    serviceSupport: "Customer support",
    serviceSupportDescription:
      "Help with your purchases",
  },

  de: {
    title: "Mein Warenkorb",
    article: "Artikel",
    articles: "Artikel",
    reference: "Art.-Nr.",
    continueShopping: "Weiter einkaufen",
    emptyTitle: "Ihr Warenkorb ist leer",
    emptyDescription:
      "Sie haben Ihrem Warenkorb noch keine Produkte hinzugefügt.",
    discoverProducts: "Produkte entdecken",
    decrease: "Menge verringern",
    increase: "Menge erhöhen",
    delete: "Produkt entfernen",
    quantity: "Menge",
    cartError:
      "Der Warenkorb konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.",

    serviceDelivery: "Lieferung in Europa",
    serviceDeliveryDescription:
      "Je nach Lieferland",
    serviceSecurity: "Geschützte Daten",
    serviceSecurityDescription:
      "Vertrauliche Verarbeitung",
    serviceReturns: "Rückgabe",
    serviceReturnsDescription:
      "Gemäß unseren Bedingungen",
    serviceSupport: "Kundenservice",
    serviceSupportDescription:
      "Hilfe bei Ihrem Einkauf",
  },

  it: {
    title: "Il mio carrello",
    article: "articolo",
    articles: "articoli",
    reference: "Rif.",
    continueShopping: "Continua gli acquisti",
    emptyTitle: "Il tuo carrello è vuoto",
    emptyDescription:
      "Non hai ancora aggiunto prodotti al carrello.",
    discoverProducts: "Scopri i prodotti",
    decrease: "Diminuisci la quantità",
    increase: "Aumenta la quantità",
    delete: "Rimuovi il prodotto",
    quantity: "Quantità",
    cartError:
      "Impossibile aggiornare il carrello. Riprova.",

    serviceDelivery: "Consegna in Europa",
    serviceDeliveryDescription:
      "In base alla destinazione",
    serviceSecurity: "Dati protetti",
    serviceSecurityDescription:
      "Trattamento riservato",
    serviceReturns: "Resi",
    serviceReturnsDescription:
      "Secondo le condizioni",
    serviceSupport: "Assistenza clienti",
    serviceSupportDescription:
      "Aiuto per i tuoi acquisti",
  },

  es: {
    title: "Mi carrito",
    article: "artículo",
    articles: "artículos",
    reference: "Ref.",
    continueShopping: "Seguir comprando",
    emptyTitle: "Tu carrito está vacío",
    emptyDescription:
      "Todavía no has añadido productos al carrito.",
    discoverProducts: "Descubrir productos",
    decrease: "Reducir cantidad",
    increase: "Aumentar cantidad",
    delete: "Eliminar producto",
    quantity: "Cantidad",
    cartError:
      "No se pudo actualizar el carrito. Inténtalo de nuevo.",

    serviceDelivery: "Entrega en Europa",
    serviceDeliveryDescription:
      "Según el destino",
    serviceSecurity: "Datos protegidos",
    serviceSecurityDescription:
      "Tratamiento confidencial",
    serviceReturns: "Devoluciones",
    serviceReturnsDescription:
      "Según nuestras condiciones",
    serviceSupport: "Atención al cliente",
    serviceSupportDescription:
      "Ayuda con tus compras",
  },
};

// ============================================================
// 3. CLASSES CSS COMMUNES
// ============================================================

const CARD_CLASS =
  "min-w-0 overflow-hidden rounded-xl " +
  "border border-[#dce5ec] bg-white " +
  "shadow-[0_3px_15px_rgba(16,43,57,0.045)]";

const QUANTITY_BUTTON_CLASS =
  "flex h-8 w-8 shrink-0 items-center justify-center " +
  "text-[#102b39] transition-colors " +
  "hover:bg-[#edf8ee] hover:text-[#078f20] " +
  "focus-visible:outline-2 focus-visible:outline-[#109b24] " +
  "disabled:cursor-not-allowed disabled:opacity-35";

// ============================================================
// 4. IMAGE PRODUIT
// ============================================================

function safeImageUrl(
  value: string | null | undefined
): string | null {
  if (!value) {
    return null;
  }

  const image = value.trim();

  if (
    image.startsWith("/") &&
    !image.startsWith("//") &&
    !image.includes("\\")
  ) {
    return image;
  }

  try {
    const url = new URL(image);

    return url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function CartProductImage({
  image,
  name,
}: {
  image: string | null;
  name: string;
}) {
  const src = safeImageUrl(image ? productImageUrl(image) : image);

  return (
    <div
      className="flex h-22 w-22 shrink-0
                 items-center justify-center overflow-hidden
                 rounded-lg bg-white
                 sm:h-29 sm:w-29
                 lg:h-32 lg:w-32"
    >
      {src ? (
        // Images issues du catalogue existant.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <Package
          size={34}
          aria-hidden="true"
          className="text-[#9aabb6]"
        />
      )}
    </div>
  );
}

// ============================================================
// 5. CONTRÔLE DES QUANTITÉS
// ============================================================

function CartQuantity({
  quantity,
  productName,
  texts,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  productName: string;
  texts: CartTexts;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div
      role="group"
      aria-label={`${texts.quantity} : ${productName}`}
      className="inline-flex h-8 shrink-0 items-center
                 overflow-hidden rounded-lg
                 border border-[#bfcfda] bg-white"
    >
      <button
        type="button"
        onClick={onDecrease}
        aria-label={`${texts.decrease} : ${productName}`}
        className={QUANTITY_BUTTON_CLASS}
      >
        <Minus
          size={15}
          aria-hidden="true"
        />
      </button>

      <span
        aria-live="polite"
        className="min-w-8 px-1 text-center
                   text-[13px] font-extrabold
                   tabular-nums text-[#102b39]"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= 99}
        aria-label={`${texts.increase} : ${productName}`}
        className={QUANTITY_BUTTON_CLASS}
      >
        <Plus
          size={15}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

// ============================================================
// 6. CARTE PRODUIT
// ============================================================

function CartProductRow({
  item,
  locale,
  texts,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: CartItem;
  locale: CheckoutLocale;
  texts: CartTexts;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  const sourceProduct = allProducts.find(product => product.id === item.productId);
  const localized = sourceProduct ? localizedProduct(sourceProduct, locale) : null;
  const name = localized?.name || item.name;
  const description = stripHtml(localized?.shortDescription || "");
  const lineTotal =
    item.unitPriceCents * item.quantity;

  const priceValid =
    Number.isSafeInteger(lineTotal) &&
    lineTotal >= 0 &&
    lineTotal <= 2_147_483_647;

  return (
    <article
      data-component="cart-product-row"
      data-product-id={item.productId}
      className="flex min-w-0 items-start gap-3
                 py-4 sm:gap-5 sm:py-5"
    >
      {/* PHOTO DU PRODUIT */}

      <CartProductImage
        image={item.image}
        name={name}
      />

      {/* INFORMATIONS */}

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3
              className="line-clamp-2 text-[12px]
                         leading-4.5 font-extrabold
                         text-[#102b39]
                         sm:text-[15px] sm:leading-6"
            >
              <Link href={`/${locale}/produits/${item.productId}`} className="hover:text-[#078d21]">{name}</Link>
            </h3>
            {description && <p className="cart-product-description">{description}</p>}

            {item.sku && (
              <p
                className="mt-1 truncate text-[11px]
                           text-[#5c7080] sm:text-xs"
              >
                {texts.reference} : {item.sku}
              </p>
            )}
          </div>

          {/* SUPPRESSION MOBILE */}

          <button
            type="button"
            onClick={onRemove}
            aria-label={`${texts.delete} : ${name}`}
            title={texts.delete}
            className="flex h-8 w-8 shrink-0 items-center
                       justify-center rounded-md
                       text-[#607482]
                       hover:bg-red-50 hover:text-red-600
                       focus-visible:outline-2
                       focus-visible:outline-[#109b24]
                       lg:hidden"
          >
            <Trash2
              size={17}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* COMMANDES MOBILE ET TABLETTE */}

        <div
          className="mt-3 flex flex-wrap items-center
                     justify-between gap-2 lg:hidden"
        >
          <CartQuantity
            quantity={item.quantity}
            productName={name}
            texts={texts}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />

          <strong
            className="text-[13px] font-black
                       whitespace-nowrap tabular-nums
                       text-[#b91c1c] sm:text-[15px]"
          >
            {priceValid
              ? formatCheckoutCurrency(
                  lineTotal,
                  locale
                )
              : "—"}
          </strong>
        </div>
      </div>

      {/* COMMANDES PC */}

      <div className="hidden shrink-0 items-center gap-4 lg:flex">
        <CartQuantity
          quantity={item.quantity}
          productName={name}
          texts={texts}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />

        <strong
          className="min-w-29 text-right
                     text-[16px] font-black
                     whitespace-nowrap tabular-nums
                     text-[#b91c1c]"
        >
          {priceValid
            ? formatCheckoutCurrency(
                lineTotal,
                locale
              )
            : "—"}
        </strong>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`${texts.delete} : ${name}`}
          title={texts.delete}
          className="flex h-9 w-9 items-center
                     justify-center rounded-md
                     text-[#607482]
                     hover:bg-red-50 hover:text-red-600
                     focus-visible:outline-2
                     focus-visible:outline-[#109b24]"
        >
          <Trash2
            size={19}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}

// ============================================================
// 7. PANIER VIDE
// ============================================================

function CartEmpty({
  locale,
  texts,
  productsHref,
}: {
  locale: CheckoutLocale;
  texts: CartTexts;
  productsHref: string;
}) {
  return (
    <div
      className={`${CARD_CLASS} px-5 py-8 text-center sm:py-10`}
    >
      <div
        className="mx-auto flex h-18 w-18
                   items-center justify-center
                   rounded-full bg-[#edf8e9]"
      >
        <ShoppingBag
          size={32}
          aria-hidden="true"
          className="text-[#109b24]"
        />
      </div>

      <h2
        className="mt-5 text-lg font-black
                   text-[#102b39] sm:text-xl"
      >
        {texts.emptyTitle}
      </h2>

      <p
        className="mx-auto mt-2 max-w-sm
                   text-sm leading-6 text-[#627583]"
      >
        {texts.emptyDescription}
      </p>

      <Link
        href={productsHref}
        className="mt-6 inline-flex min-h-11
                   items-center justify-center gap-2
                   rounded-lg bg-[#08951b]
                   px-6 text-sm font-bold text-white
                   transition-colors hover:bg-[#087b19]"
      >
        {texts.discoverProducts}
        <ArrowLeft
          size={16}
          className="rotate-180"
          aria-hidden="true"
        />
      </Link>

      <span className="sr-only">
        {locale}
      </span>
    </div>
  );
}

// ============================================================
// 8. SERVICE / AVANTAGES
// ============================================================

function CartBenefits({
  locale,
}: {
  locale: CheckoutLocale;
}) {
  const texts = CART_TEXTS[locale];

  const benefits = [
    {
      icon: Truck,
      title: texts.serviceDelivery,
      description:
        texts.serviceDeliveryDescription,
    },
    {
      icon: ShieldCheck,
      title: texts.serviceSecurity,
      description:
        texts.serviceSecurityDescription,
    },
    {
      icon: RotateCcw,
      title: texts.serviceReturns,
      description:
        texts.serviceReturnsDescription,
    },
    {
      icon: Headphones,
      title: texts.serviceSupport,
      description:
        texts.serviceSupportDescription,
    },
  ] as const;

  return (
    <section
      className="cart-benefits mt-5 hidden rounded-xl
                 border border-[#dce5ec]
                 bg-white px-5 py-5
                 lg:block"
      aria-label="CYCLORIVA"
    >
      <div className="grid grid-cols-4">
        {benefits.map(
          ({
            icon: Icon,
            title,
            description,
          }) => (
            <div
              key={title}
              className="flex min-w-0 flex-col
                         items-center gap-2
                         border-r border-[#e1e8ee]
                         px-3 text-center
                         last:border-r-0"
            >
              <Icon
                size={30}
                strokeWidth={1.8}
                aria-hidden="true"
                className="text-[#109b24]"
              />

              <strong
                className="text-[12px]
                           leading-5 text-[#102b39]"
              >
                {title}
              </strong>

              <span
                className="text-[11px]
                           leading-5 text-[#536879]"
              >
                {description}
              </span>
            </div>
          )
        )}
      </div>
    </section>
  );
}

// ============================================================
// 9. COMPOSANT PRINCIPAL
// ============================================================

export default function CartClient({
  locale: rawLocale,
  className = "",
  productsHref,
  checkoutHref,
}: CartClientProps) {
  const locale =
    normalizeCheckoutLocale(rawLocale);

  const texts = CART_TEXTS[locale];

  // ----------------------------------------------------------
  // PANIER RÉEL
  // ----------------------------------------------------------

  const cart = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot
  );

  const totals = useMemo(
    () => calculateCartTotals(cart),
    [cart]
  );

  const items = cart.items;

  const hasItems =
    items.length > 0;

  // ----------------------------------------------------------
  // LIENS
  // ----------------------------------------------------------

  const resolvedProductsHref =
    productsHref ?? `/${locale}/produits`;

  const resolvedCheckoutHref =
    checkoutHref ?? `/${locale}/commande`;

  // ----------------------------------------------------------
  // ERREUR DE MODIFICATION
  // ----------------------------------------------------------

  const [cartError, setCartError] =
    useState(false);

  // ----------------------------------------------------------
  // ACTIONS
  // ----------------------------------------------------------

  const runCartAction = useCallback(
    (action: () => { success: boolean }) => {
      setCartError(false);

      try {
        const result = action();

        if (!result.success) {
          setCartError(true);
        }
      } catch {
        setCartError(true);
      }
    },
    []
  );

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

  const deleteProduct = useCallback(
    (lineId: string) => {
      runCartAction(() =>
        removeFromCart(lineId)
      );
    },
    [runCartAction]
  );

  // ----------------------------------------------------------
  // NOMBRE TOTAL D'ARTICLES
  // ----------------------------------------------------------

  const itemCount = totals.itemCount;

  const articleLabel =
    itemCount === 1
      ? texts.article
      : texts.articles;

  // ----------------------------------------------------------
  // RENDU PRINCIPAL
  // ----------------------------------------------------------

  return (
    <div
      data-component="cart-client"
      className={`w-full min-w-0 ${className}`}
    >
      {/* ====================================================
          EN-TÊTE DE LA ZONE PANIER
      ==================================================== */}

      <div
        className="mb-4 flex min-w-0
                   items-center justify-between
                   gap-3 sm:mb-5"
      >
        <div
          className="flex min-w-0
                     items-center gap-3"
        >
          <ShoppingCart
            size={32}
            strokeWidth={1.8}
            aria-hidden="true"
            className="shrink-0 text-[#109b24]
                       sm:size-9"
          />

          <h1
            className="text-[21px] font-black
                       tracking-tight text-[#102b39]
                       sm:text-[26px] lg:text-[29px]"
          >
            {texts.title}
          </h1>
        </div>

        <span
          aria-live="polite"
          className="shrink-0 text-[12px]
                     font-medium text-[#102b39]
                     sm:text-sm"
        >
          {itemCount} {articleLabel}
        </span>
      </div>

      {/* ====================================================
          GRILLE DESKTOP / MOBILE
      ==================================================== */}

      <div
        className="cart-layout grid min-w-0 grid-cols-1
                   items-start gap-5
                   lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.95fr)]
                   lg:gap-6"
      >
        {/* ==================================================
            COLONNE PRODUITS
        ================================================== */}

        <div className="min-w-0">

          {hasItems ? (
            <div className={`${CARD_CLASS} px-3 sm:px-5`}>
              <div className="divide-y divide-[#e0e7ed]">
                {items.map((item) => (
                  <CartProductRow
                    key={item.lineId}
                    item={item}
                    locale={locale}
                    texts={texts}
                    onDecrease={() =>
                      decreaseQuantity(item.lineId)
                    }
                    onIncrease={() =>
                      increaseQuantity(item.lineId)
                    }
                    onRemove={() =>
                      deleteProduct(item.lineId)
                    }
                  />
                ))}
              </div>
            </div>
          ) : (
            <CartEmpty
              locale={locale}
              texts={texts}
              productsHref={resolvedProductsHref}
            />
          )}

          {/* ERREUR DU PANIER */}

          {cartError && (
            <div
              role="alert"
              className="mt-3 flex items-start gap-2
                         rounded-lg border border-red-200
                         bg-red-50 px-4 py-3
                         text-xs leading-5 text-red-700"
            >
              <AlertCircle
                size={17}
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              />

              <span>{texts.cartError}</span>
            </div>
          )}

          {/* RETOUR CATALOGUE : PC */}

          {hasItems && (
            <Link
              href={resolvedProductsHref}
              className="mt-5 hidden items-center
                         gap-2 text-[13px] font-extrabold
                         text-[#078d21] transition-colors
                         hover:text-[#066f19]
                         lg:inline-flex"
            >
              <ArrowLeft
                size={19}
                aria-hidden="true"
              />
              {texts.continueShopping}
            </Link>
          )}
        </div>

        {/* ==================================================
            COLONNE RÉCAPITULATIF
        ================================================== */}

        <div className="min-w-0 lg:sticky lg:top-5">
          <CartSummary
            locale={locale}
            itemCount={itemCount}
            subtotalCents={totals.subtotalCents}
            hasItems={hasItems}
            checkoutHref={resolvedCheckoutHref}
          />
        </div>
      </div>

      {/* ====================================================
          CONTINUER MES ACHATS : MOBILE
      ==================================================== */}

      {hasItems && (
        <div className="mt-5 flex justify-center lg:hidden">
          <Link
            href={resolvedProductsHref}
            className="inline-flex min-h-10
                       items-center justify-center
                       gap-2 text-[13px] font-extrabold
                       text-[#078d21]"
          >
            <ArrowLeft
              size={19}
              aria-hidden="true"
            />

            {texts.continueShopping}
          </Link>
        </div>
      )}

      {/* ====================================================
          BANDEAU DES SERVICES : PC
      ==================================================== */}

      <CartBenefits locale={locale} />
    </div>
  );
}

// ============================================================
// 10. EXPORT NOMMÉ
// ============================================================

export { CartClient };

// ============================================================
// FIN — CYCLORIVA CART CLIENT
// ============================================================
