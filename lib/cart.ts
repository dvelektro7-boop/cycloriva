
/**
 * ============================================================
 * CYCLORIVA — GESTION OFFICIELLE DU PANIER
 * ============================================================
 *
 * Fichier : lib/cart.ts
 *
 * Compatible :
 * - Next.js 16 / App Router
 * - TypeScript
 * - React 19
 * - Navigateurs PC et mobiles
 * - Site multilingue FR / EN / DE / IT / ES
 *
 * FONCTIONNALITÉS :
 * - Ajouter un produit
 * - Éviter les doublons
 * - Augmenter / diminuer la quantité
 * - Supprimer un produit
 * - Vider le panier
 * - Conserver le panier dans localStorage
 * - Synchroniser les onglets du navigateur
 * - Calculer les quantités
 * - Calculer le sous-total en centimes
 * - Fournir un abonnement aux composants React
 * - Préparer les données pour le checkout
 *
 * SÉCURITÉ :
 * - Aucun prix n'est considéré comme fiable côté client.
 * - Le serveur doit recalculer chaque commande.
 * - Aucune information personnelle n'est enregistrée ici.
 * - Aucun paiement n'est effectué ici.
 *
 * ============================================================
 */

// ============================================================
// 1. CONSTANTES
// ============================================================

import { allProducts, currentPrice } from "./catalog";

export const CART_STORAGE_KEY =
  "cycloriva:cart:v1";

export const CART_UPDATED_EVENT =
  "cycloriva:cart:updated";

export const CART_VERSION = 1;

export const CART_CURRENCY = "EUR";

export const MAX_CART_LINES = 100;

export const MAX_ITEM_QUANTITY = 99;

const MAX_STORAGE_LENGTH = 250_000;

// ============================================================
// 2. TYPES
// ============================================================

export type CartCurrency = "EUR";

export type CartProductInput = {
  /**
   * Identifiant réel du produit provenant du catalogue.
   */
  id: string | number;

  /**
   * Nom réel du produit.
   */
  name: string;

  /**
   * Prix courant en centimes d'euro.
   *
   * Exemple :
   * 721,65 € -> 72165
   *
   * Il doit provenir du catalogue, et non
   * d'une valeur saisie librement.
   */
  unitPriceCents: number;

  /**
   * Image réelle du catalogue.
   */
  image?: string | null;

  /**
   * Référence commerciale facultative.
   */
  sku?: string | null;

  /**
   * Identifiant d'une variante éventuelle.
   *
   * Exemple :
   * couleur, taille ou configuration,
   * uniquement si ces variantes existent.
   */
  variantId?: string | null;
};

export type CartItem = {
  /**
   * Identifiant unique de la ligne de panier.
   */
  lineId: string;

  productId: string;

  variantId: string | null;

  name: string;

  image: string | null;

  sku: string | null;

  quantity: number;

  unitPriceCents: number;

  currency: CartCurrency;
};

export type Cart = {
  version: 1;

  currency: CartCurrency;

  items: CartItem[];

  updatedAt: string;
};

export type CartTotals = {
  /**
   * Nombre de produits différents / lignes.
   */
  distinctItems: number;

  /**
   * Somme de toutes les quantités.
   */
  itemCount: number;

  /**
   * Somme des produits avant livraison.
   */
  subtotalCents: number;

  /**
   * Le vrai calcul de livraison est
   * effectué dans le checkout serveur.
   */
  currency: CartCurrency;
};

export type CheckoutCartItem = {
  productId: string;
  variantId: string | null;
  quantity: number;
};

export type CartOperationResult = {
  success: boolean;
  cart: Cart;
  error?: string;
};

// ============================================================
// 3. PANIER VIDE
// ============================================================

const EMPTY_CART: Cart = {
  version: CART_VERSION,
  currency: CART_CURRENCY,
  items: [],
  updatedAt: "",
};

const EMPTY_CART_TOTALS: CartTotals = {
  distinctItems: 0,
  itemCount: 0,
  subtotalCents: 0,
  currency: CART_CURRENCY,
};

// ============================================================
// 4. UTILITAIRES GÉNÉRAUX
// ============================================================

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function cleanString(
  value: unknown,
  maxLength: number
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function normalizeProductId(
  value: string | number
): string {
  if (
    typeof value !== "string" &&
    typeof value !== "number"
  ) {
    return "";
  }

  return String(value).trim().slice(0, 191);
}

function isValidAmount(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value > 0
  );
}

function isValidQuantity(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= MAX_ITEM_QUANTITY
  );
}

function normalizeQuantity(
  value: number
): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(
    1,
    Math.min(
      MAX_ITEM_QUANTITY,
      Math.trunc(value)
    )
  );
}

/**
 * Utiliser une représentation stable des identifiants
 * plutôt qu'une simple concaténation ambiguë.
 */
export function createCartLineId(
  productId: string | number,
  variantId?: string | null
): string {
  return JSON.stringify([
    normalizeProductId(productId),
    cleanString(variantId, 191),
  ]);
}

function nowISO(): string {
  return new Date().toISOString();
}

function cloneCart(cart: Cart): Cart {
  return {
    ...cart,
    items: cart.items.map((item) => ({
      ...item,
    })),
  };
}

// ============================================================
// 5. VALIDATION D'UNE LIGNE ENREGISTRÉE
// ============================================================

function parseStoredItem(
  value: unknown
): CartItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const productId =
    cleanString(value.productId, 191);

  const name =
    cleanString(value.name, 500);

  const variantId =
    typeof value.variantId === "string"
      ? cleanString(value.variantId, 191) || null
      : null;

  const quantity = value.quantity;

  const unitPriceCents =
    value.unitPriceCents;

  if (!productId || !name) {
    return null;
  }

  if (!isValidQuantity(quantity)) {
    return null;
  }

  if (!isValidAmount(unitPriceCents)) {
    return null;
  }

  if (value.currency !== CART_CURRENCY) {
    return null;
  }

  return {
    lineId: createCartLineId(
      productId,
      variantId
    ),

    productId,

    variantId,

    name,

    image:
      cleanString(value.image, 2048) || null,

    sku:
      cleanString(value.sku, 191) || null,

    quantity,

    unitPriceCents,

    currency: CART_CURRENCY,
  };
}

// ============================================================
// 6. VALIDATION DU PANIER STOCKÉ
// ============================================================

function parseStoredCart(
  raw: string | null
): Cart {
  if (
    !raw ||
    raw.length > MAX_STORAGE_LENGTH
  ) {
    return EMPTY_CART;
  }

  try {
    const data: unknown = JSON.parse(raw);

    if (!isRecord(data)) {
      return EMPTY_CART;
    }

    if (data.version !== CART_VERSION) {
      return EMPTY_CART;
    }

    if (data.currency !== CART_CURRENCY) {
      return EMPTY_CART;
    }

    if (!Array.isArray(data.items)) {
      return EMPTY_CART;
    }

    if (data.items.length > MAX_CART_LINES) {
      return EMPTY_CART;
    }

    const items: CartItem[] = [];

    const seen = new Set<string>();

    for (const entry of data.items) {
      const item = parseStoredItem(entry);

      if (!item) {
        return EMPTY_CART;
      }

      if (seen.has(item.lineId)) {
        return EMPTY_CART;
      }

      seen.add(item.lineId);

      items.push(item);
    }

    return {
      version: CART_VERSION,

      currency: CART_CURRENCY,

      items,

      updatedAt:
        cleanString(data.updatedAt, 40),
    };
  } catch {
    return EMPTY_CART;
  }
}

// ============================================================
// 7. STOCKAGE LOCAL
// ============================================================

function readStorage(): string | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage.getItem(
      CART_STORAGE_KEY
    );
  } catch {
    return null;
  }
}

function writeStorage(
  value: string
): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      value
    );

    return true;
  } catch {
    return false;
  }
}

// ============================================================
// 8. CACHE DU SNAPSHOT
// ============================================================
//
// Important pour useSyncExternalStore :
//
// La fonction getSnapshot doit renvoyer
// le même objet lorsque les données
// n'ont pas changé.
//
// ============================================================

let cachedRaw: string | null | undefined =
  undefined;

let cachedCart: Cart = EMPTY_CART;

function refreshCache(): Cart {
  if (!isBrowser()) {
    return EMPTY_CART;
  }

  let raw = readStorage();
  if (!raw) {
    try {
      const legacy = JSON.parse(window.localStorage.getItem("cycloriva-cart-v1") || "[]");
      if (Array.isArray(legacy) && legacy.length) {
        const migrated = { ...EMPTY_CART, items: catalogCartEntries(legacy), updatedAt: nowISO() };
        const serialized = JSON.stringify(migrated);
        if (writeStorage(serialized)) raw = serialized;
      }
    } catch { /* Leave unavailable storage or malformed legacy data untouched. */ }
  }

  if (
    cachedRaw !== undefined &&
    raw === cachedRaw
  ) {
    return cachedCart;
  }

  cachedRaw = raw;

  cachedCart = parseStoredCart(raw);
  // Refresh browser metadata from the real catalogue, never from supplied prices.
  cachedCart = { ...cachedCart, items: catalogCartEntries(cachedCart.items) };

  return cachedCart;
}

/**
 * Snapshot stable pour les composants React.
 *
 * À utiliser avec useSyncExternalStore.
 */
export function getCartSnapshot(): Cart {
  return refreshCache();
}

/**
 * Snapshot constant pour le rendu serveur.
 */
export function getServerCartSnapshot(): Cart {
  return EMPTY_CART;
}

/**
 * Lecture classique du panier.
 *
 * Une copie est renvoyée afin d'éviter
 * toute modification accidentelle du cache.
 */
export function getCart(): Cart {
  return cloneCart(refreshCache());
}

// ============================================================
// 9. NOTIFICATION DES CHANGEMENTS
// ============================================================

function notifyCartChanged(): void {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(
    new Event(CART_UPDATED_EVENT)
  );
}

/**
 * Abonnement pour les composants React.
 *
 * Exemple :
 *
 * useSyncExternalStore(
 *   subscribeToCart,
 *   getCartSnapshot,
 *   getServerCartSnapshot
 * )
 *
 * L'événement storage synchronise
 * les autres onglets du navigateur.
 */
export function subscribeToCart(
  callback: () => void
): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  const handleLocalChange = () => {
    callback();
  };

  const handleStorageChange = (
    event: StorageEvent
  ) => {
    if (
      event.key === CART_STORAGE_KEY ||
      event.key === null
    ) {
      callback();
    }
  };

  window.addEventListener(
    CART_UPDATED_EVENT,
    handleLocalChange
  );

  window.addEventListener(
    "storage",
    handleStorageChange
  );

  return () => {
    window.removeEventListener(
      CART_UPDATED_EVENT,
      handleLocalChange
    );

    window.removeEventListener(
      "storage",
      handleStorageChange
    );
  };
}

// ============================================================
// 10. SAUVEGARDE DU PANIER
// ============================================================

function saveCart(
  items: CartItem[]
): CartOperationResult {
  if (!isBrowser()) {
    return {
      success: false,
      cart: EMPTY_CART,
      error: "BROWSER_REQUIRED",
    };
  }

  if (items.length > MAX_CART_LINES) {
    return {
      success: false,
      cart: getCart(),
      error: "CART_LIMIT_EXCEEDED",
    };
  }

  const cart: Cart = {
    version: CART_VERSION,
    currency: CART_CURRENCY,
    items,
    updatedAt: nowISO(),
  };

  const serialized = JSON.stringify(cart);

  if (
    serialized.length > MAX_STORAGE_LENGTH ||
    !writeStorage(serialized)
  ) {
    return {
      success: false,
      cart: getCart(),
      error: "CART_STORAGE_FAILED",
    };
  }

  cachedRaw = serialized;

  cachedCart = cart;

  notifyCartChanged();

  return {
    success: true,
    cart: cloneCart(cart),
  };
}

// ============================================================
// 11. AJOUTER UN PRODUIT
// ============================================================

export function addToCart(
  product: CartProductInput,
  quantity = 1
): CartOperationResult {
  if (!isBrowser()) {
    return {
      success: false,
      cart: EMPTY_CART,
      error: "BROWSER_REQUIRED",
    };
  }

  const productId =
    normalizeProductId(product.id);

  const name =
    cleanString(product.name, 500);

  if (!productId || !name) {
    return {
      success: false,
      cart: getCart(),
      error: "INVALID_PRODUCT",
    };
  }

  if (!isValidAmount(product.unitPriceCents)) {
    return {
      success: false,
      cart: getCart(),
      error: "INVALID_PRODUCT_PRICE",
    };
  }

  if (!isValidQuantity(quantity)) {
    return {
      success: false,
      cart: getCart(),
      error: "INVALID_QUANTITY",
    };
  }

  const variantId =
    cleanString(product.variantId, 191) ||
    null;

  const lineId = createCartLineId(
    productId,
    variantId
  );

  const cart = getCart();

  const existingIndex =
    cart.items.findIndex(
      (item) => item.lineId === lineId
    );

  if (existingIndex >= 0) {
    const existing =
      cart.items[existingIndex];

    const nextQuantity =
      existing.quantity + quantity;

    if (nextQuantity > MAX_ITEM_QUANTITY) {
      return {
        success: false,
        cart,
        error: "MAX_QUANTITY_EXCEEDED",
      };
    }

    cart.items[existingIndex] = {
      ...existing,

      // Actualiser les données visibles
      // depuis le produit fourni.
      name,

      image:
        cleanString(product.image, 2048) ||
        null,

      sku:
        cleanString(product.sku, 191) ||
        null,

      unitPriceCents:
        product.unitPriceCents,

      quantity: nextQuantity,
    };

    return saveCart(cart.items);
  }

  if (
    cart.items.length >= MAX_CART_LINES
  ) {
    return {
      success: false,
      cart,
      error: "CART_LIMIT_EXCEEDED",
    };
  }

  const newItem: CartItem = {
    lineId,

    productId,

    variantId,

    name,

    image:
      cleanString(product.image, 2048) ||
      null,

    sku:
      cleanString(product.sku, 191) ||
      null,

    quantity,

    unitPriceCents:
      product.unitPriceCents,

    currency: CART_CURRENCY,
  };

  return saveCart([
    ...cart.items,
    newItem,
  ]);
}

// ============================================================
// 12. MODIFIER LA QUANTITÉ
// ============================================================

export function setCartItemQuantity(
  lineId: string,
  quantity: number
): CartOperationResult {
  const cart = getCart();

  if (
    !Number.isInteger(quantity) ||
    quantity < 0 ||
    quantity > MAX_ITEM_QUANTITY
  ) {
    return {
      success: false,
      cart,
      error: "INVALID_QUANTITY",
    };
  }

  const existing = cart.items.some(
    (item) => item.lineId === lineId
  );

  if (!existing) {
    return {
      success: false,
      cart,
      error: "CART_ITEM_NOT_FOUND",
    };
  }

  if (quantity === 0) {
    return removeFromCart(lineId);
  }

  const items = cart.items.map(
    (item): CartItem =>
      item.lineId === lineId
        ? {
            ...item,
            quantity,
          }
        : item
  );

  return saveCart(items);
}

// ============================================================
// 13. AUGMENTER LA QUANTITÉ
// ============================================================

export function increaseCartItemQuantity(
  lineId: string
): CartOperationResult {
  const cart = getCart();

  const item = cart.items.find(
    (entry) => entry.lineId === lineId
  );

  if (!item) {
    return {
      success: false,
      cart,
      error: "CART_ITEM_NOT_FOUND",
    };
  }

  if (item.quantity >= MAX_ITEM_QUANTITY) {
    return {
      success: false,
      cart,
      error: "MAX_QUANTITY_EXCEEDED",
    };
  }

  return setCartItemQuantity(
    lineId,
    item.quantity + 1
  );
}

// ============================================================
// 14. DIMINUER LA QUANTITÉ
// ============================================================

export function decreaseCartItemQuantity(
  lineId: string
): CartOperationResult {
  const cart = getCart();

  const item = cart.items.find(
    (entry) => entry.lineId === lineId
  );

  if (!item) {
    return {
      success: false,
      cart,
      error: "CART_ITEM_NOT_FOUND",
    };
  }

  if (item.quantity <= 1) {
    return removeFromCart(lineId);
  }

  return setCartItemQuantity(
    lineId,
    item.quantity - 1
  );
}

// ============================================================
// 15. SUPPRIMER UN PRODUIT
// ============================================================

export function removeFromCart(
  lineId: string
): CartOperationResult {
  const cart = getCart();

  const exists = cart.items.some(
    (item) => item.lineId === lineId
  );

  if (!exists) {
    return {
      success: false,
      cart,
      error: "CART_ITEM_NOT_FOUND",
    };
  }

  const items = cart.items.filter(
    (item) => item.lineId !== lineId
  );

  return saveCart(items);
}

// ============================================================
// 16. VIDER LE PANIER
// ============================================================

export function clearCart(): CartOperationResult {
  return saveCart([]);
}

// ============================================================
// 17. VÉRIFIER SI UN PRODUIT EST DANS LE PANIER
// ============================================================

export function isProductInCart(
  productId: string | number,
  variantId?: string | null
): boolean {
  const lineId = createCartLineId(
    productId,
    variantId
  );

  return getCart().items.some(
    (item) => item.lineId === lineId
  );
}

// ============================================================
// 18. OBTENIR LA QUANTITÉ D'UN PRODUIT
// ============================================================

export function getProductCartQuantity(
  productId: string | number,
  variantId?: string | null
): number {
  const lineId = createCartLineId(
    productId,
    variantId
  );

  const item = getCart().items.find(
    (entry) => entry.lineId === lineId
  );

  return item?.quantity ?? 0;
}

// ============================================================
// 19. CALCUL DU RÉCAPITULATIF
// ============================================================

export function calculateCartTotals(
  cart: Cart
): CartTotals {
  if (!cart.items.length) {
    return EMPTY_CART_TOTALS;
  }

  let itemCount = 0;

  let subtotalCents = 0;

  for (const item of cart.items) {
    itemCount += item.quantity;

    subtotalCents +=
      item.unitPriceCents * item.quantity;
  }

  return {
    distinctItems: cart.items.length,

    itemCount,

    subtotalCents,

    currency: CART_CURRENCY,
  };
}

/**
 * Totaux actuels du panier navigateur.
 */
export function getCartTotals(): CartTotals {
  return calculateCartTotals(getCart());
}

// ============================================================
// 20. FORMATER LES MONTANTS
// ============================================================
//
// Le site vend actuellement en euros.
// Ce helper adapte l'affichage à la langue.
//
// Exemples :
// fr-FR : 721,65 €
// de-DE : 721,65 €
// en-GB : €721.65
//
// ============================================================

const MONEY_LOCALES: Record<
  string,
  string
> = {
  fr: "fr-FR",
  en: "en-GB",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
};

export function formatCartMoney(
  cents: number,
  locale = "fr"
): string {
  const safeCents =
    Number.isSafeInteger(cents)
      ? cents
      : 0;

  const intlLocale =
    MONEY_LOCALES[locale] ?? "fr-FR";

  return new Intl.NumberFormat(
    intlLocale,
    {
      style: "currency",
      currency: CART_CURRENCY,
    }
  ).format(safeCents / 100);
}

// ============================================================
// 21. DONNÉES À TRANSMETTRE AU CHECKOUT
// ============================================================
//
// IMPORTANT :
//
// Ces informations servent uniquement
// à indiquer au serveur quels produits
// et quelles quantités sont demandés.
//
// On n'envoie PAS les prix du panier
// comme source de vérité.
//
// Le serveur doit :
// - retrouver les produits dans le catalogue
// - vérifier leur disponibilité
// - retrouver les prix actuels
// - recalculer les taxes et la livraison
// - recalculer le total final
//
// ============================================================

export function getCheckoutCartItems():
  CheckoutCartItem[] {
  return getCart().items.map(
    (item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    })
  );
}

// ============================================================
// 22. VÉRIFIER SI LE PANIER EST VIDE
// ============================================================

export function isCartEmpty(): boolean {
  return getCart().items.length === 0;
}

// ============================================================
// 23. NOMBRE TOTAL DE PRODUITS
// ============================================================

export function getCartItemCount(): number {
  return getCartTotals().itemCount;
}

// ============================================================
// 24. NOMBRE DE LIGNES DISTINCTES
// ============================================================

export function getCartDistinctCount(): number {
  return getCartTotals().distinctItems;
}

// ============================================================
// 25. SOUS-TOTAL ACTUEL
// ============================================================

export function getCartSubtotalCents(): number {
  return getCartTotals().subtotalCents;
}

// ============================================================
// 26. COMPATIBILITÉ DES QUANTITÉS
// ============================================================

export function clampCartQuantity(
  quantity: number
): number {
  return normalizeQuantity(quantity);
}

// ============================================================
// FIN — CYCLORIVA CART ENGINE
// ============================================================

function catalogCartEntries(entries: readonly { productId?: unknown; quantity?: unknown }[]): CartItem[] {
 const result: CartItem[]=[];const seen=new Set<string>();
 for(const entry of entries.slice(0,MAX_CART_LINES)) {
  if(typeof entry.productId!=="string" || typeof entry.quantity!=="number" || !Number.isInteger(entry.quantity) || entry.quantity<1 || entry.quantity>99 || seen.has(entry.productId))continue;
  const product=allProducts.find(product=>product.id===entry.productId);if(!product)continue;
  const price=currentPrice(product);if(price===null)continue;
  seen.add(product.id);result.push({lineId:createCartLineId(product.id),productId:product.id,variantId:null,name:product.name,image:product.images[0] || null,sku:product.sku || null,quantity:entry.quantity,unitPriceCents:Math.round(price*100),currency:"EUR"});
 }
 return result;
}
export function replaceProductCart(entries: readonly {productId:string;quantity:number}[]): CartOperationResult { return saveCart(catalogCartEntries(entries)); }
export function addCatalogProductToCart(id:string,quantity:number):CartOperationResult {
 const item=catalogCartEntries([{productId:id,quantity}])[0];
 if(!item)return {success:false,cart:getCart(),error:"INVALID_PRODUCT"};
 return addToCart({id:item.productId,name:item.name,unitPriceCents:item.unitPriceCents,image:item.image,sku:item.sku},quantity);
}
