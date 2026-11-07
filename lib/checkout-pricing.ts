
import "server-only";

import { allProducts, currentPrice } from "@/lib/catalog";

import type {
  CheckoutCountryCode,
  CheckoutOrderProduct,
  VerifiedCheckoutPricing,
} from "@/lib/checkout-orders";

/**
 * ============================================================
 * CYCLORIVA — CALCUL OFFICIEL DES COMMANDES
 * ============================================================
 *
 * FICHIER :
 * lib/checkout-pricing.ts
 *
 * TECHNOLOGIES :
 * - Next.js 16
 * - TypeScript
 * - Prisma 7
 * - PostgreSQL / Supabase
 *
 * SOURCE DES PRODUITS :
 * lib/catalog.ts -> data/products.json
 *
 * RESPONSABILITÉS :
 *
 * 1. Lire les véritables produits du catalogue
 * 2. Vérifier les identifiants
 * 3. Vérifier les quantités
 * 4. Vérifier les prix du catalogue
 * 5. Convertir les euros en centimes
 * 6. Calculer les montants de chaque ligne
 * 7. Calculer le sous-total
 * 8. Déterminer les frais de livraison configurés
 * 9. Calculer le total final
 * 10. Préparer les données pour Prisma
 *
 * SÉCURITÉ :
 *
 * - Aucun prix envoyé par le navigateur n'est accepté.
 * - Aucun sous-total client n'est accepté.
 * - Aucun montant de livraison client n'est accepté.
 * - Aucun total client n'est accepté.
 * - Pas de frais de livraison fictifs.
 * - Pas de paiement fictif.
 * - Pas de stock supposé disponible.
 *
 * ============================================================
 */

// ============================================================
// 1. CONSTANTES
// ============================================================

export const CHECKOUT_CURRENCY = "EUR" as const;

export const CHECKOUT_MAX_LINES = 100;

export const CHECKOUT_MAX_QUANTITY = 99;

/**
 * PostgreSQL Integer et Prisma Int utilisent
 * un entier signé de 32 bits.
 *
 * Les montants enregistrés dans le schéma
 * CheckoutOrder doivent respecter cette limite.
 */
export const CHECKOUT_MAX_CENTS = 2_147_483_647;

// ============================================================
// 2. PAYS AUTORISÉS
// ============================================================

export const CHECKOUT_ALLOWED_COUNTRIES = [
  "DE",
  "FR",
  "ES",
  "IT",
  "CH",
  "AT",
  "NL",
  "BE",
] as const satisfies readonly CheckoutCountryCode[];

const COUNTRY_SET = new Set<string>(
  CHECKOUT_ALLOWED_COUNTRIES
);

export function isCheckoutCountry(
  value: unknown
): value is CheckoutCountryCode {
  return (
    typeof value === "string" &&
    COUNTRY_SET.has(value)
  );
}

// ============================================================
// 3. TYPES PUBLICS
// ============================================================

/**
 * Seules les informations indispensables
 * doivent provenir du panier navigateur.
 *
 * Le navigateur ne fournit aucun prix fiable.
 */
export type CheckoutPricingCartItem = {
  productId: string;
  quantity: number;
  variantId?: string | null;
};

export type CheckoutPricingRequest = {
  country: CheckoutCountryCode;
  items: readonly CheckoutPricingCartItem[];
};

/**
 * Détail d'une ligne de prix vérifiée.
 */
export type CheckoutPriceLine = {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  currency: "EUR";
};

/**
 * Résultat pouvant être affiché dans
 * le récapitulatif de commande.
 */
export type CheckoutPricingSummary = {
  currency: "EUR";
  distinctItems: number;
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number | null;
  totalCents: number;
  country: CheckoutCountryCode;
  items: CheckoutPriceLine[];
};

/**
 * Signature d'un calculateur de livraison
 * fiable, exclusivement côté serveur.
 *
 * Cela permettra plus tard de remplacer
 * les tarifs fixes par ceux d'un transporteur.
 */
export type CheckoutShippingCalculator = (
  input: {
    country: CheckoutCountryCode;
    items: readonly CheckoutOrderProduct[];
    subtotalCents: number;
  }
) => number | Promise<number>;

export type CheckoutPricingOptions = {
  shippingCalculator?: CheckoutShippingCalculator;
};

// ============================================================
// 4. ERREURS STRUCTURÉES
// ============================================================

export type CheckoutPricingErrorCode =
  | "INVALID_COUNTRY"
  | "EMPTY_CART"
  | "TOO_MANY_PRODUCTS"
  | "INVALID_PRODUCT_ID"
  | "DUPLICATE_PRODUCT"
  | "UNSUPPORTED_VARIANT"
  | "INVALID_QUANTITY"
  | "PRODUCT_NOT_FOUND"
  | "PRODUCT_NOT_PURCHASABLE"
  | "PRODUCT_PRICE_UNAVAILABLE"
  | "PRODUCT_CURRENCY_UNSUPPORTED"
  | "INVALID_PRICE_FORMAT"
  | "INVALID_AMOUNT"
  | "AMOUNT_OVERFLOW"
  | "SHIPPING_NOT_CONFIGURED"
  | "INVALID_SHIPPING";

export class CheckoutPricingError extends Error {
  readonly code: CheckoutPricingErrorCode;

  constructor(
    code: CheckoutPricingErrorCode
  ) {
    super(code);

    this.name = "CheckoutPricingError";
    this.code = code;

    Object.setPrototypeOf(
      this,
      CheckoutPricingError.prototype
    );
  }
}

function fail(
  code: CheckoutPricingErrorCode
): never {
  throw new CheckoutPricingError(code);
}

// ============================================================
// 5. UTILITAIRES
// ============================================================

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
  maximum: number
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maximum);
}

function requiredString(
  value: unknown,
  maximum: number,
  errorCode: CheckoutPricingErrorCode
): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.trim().length > maximum
  ) {
    fail(errorCode);
  }

  return value.trim();
}

function validCents(
  value: number
): number {
  if (
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    fail("INVALID_AMOUNT");
  }

  if (value > CHECKOUT_MAX_CENTS) {
    fail("AMOUNT_OVERFLOW");
  }

  return value;
}

function checkedAdd(
  left: number,
  right: number
): number {
  return validCents(left + right);
}

function checkedMultiply(
  left: number,
  right: number
): number {
  return validCents(left * right);
}

// ============================================================
// 6. CONVERSION D'UN PRIX EN CENTIMES
// ============================================================
//
// Les produits JSON peuvent parfois contenir :
//
// 721.65
// "721.65"
// "721,65"
// "1 299,99"
// "1.299,99"
// "1,299.99"
//
// Les formats ambigus sont refusés.
//
// Cette fonction ne prend pas les centimes
// directement : elle reçoit un montant en euros.
//
// ============================================================

export function eurosToCents(
  value: unknown
): number {
  if (
    typeof value !== "string" &&
    typeof value !== "number"
  ) {
    fail("INVALID_PRICE_FORMAT");
  }

  if (
    typeof value === "number" &&
    !Number.isFinite(value)
  ) {
    fail("INVALID_PRICE_FORMAT");
  }

  let text = String(value)
    .trim()
    .replace(/[\u00A0\u202F\s]/g, "");

  if (!text || /[^\d.,]/.test(text)) {
    fail("INVALID_PRICE_FORMAT");
  }

  /**
   * Format européen avec regroupement :
   * 1.299,99
   */
  if (/^\d{1,3}(?:\.\d{3})+,\d{1,2}$/.test(text)) {
    text = text
      .replace(/\./g, "")
      .replace(",", ".");
  }

  /**
   * Format international avec regroupement :
   * 1,299.99
   */
  else if (
    /^\d{1,3}(?:,\d{3})+\.\d{1,2}$/.test(text)
  ) {
    text = text.replace(/,/g, "");
  }

  /**
   * Format décimal européen :
   * 721,65
   */
  else if (/^\d+,\d{1,2}$/.test(text)) {
    text = text.replace(",", ".");
  }

  /**
   * Format décimal classique :
   * 721.65
   *
   * Ou entier :
   * 721
   */
  else if (
    !/^\d+(?:\.\d{1,2})?$/.test(text)
  ) {
    fail("INVALID_PRICE_FORMAT");
  }

  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(
    text
  );

  if (!match) {
    fail("INVALID_PRICE_FORMAT");
  }

  const euros = Number(match[1]);

  const decimal = (match[2] ?? "")
    .padEnd(2, "0");

  const cents = Number(decimal);

  if (
    !Number.isSafeInteger(euros) ||
    !Number.isSafeInteger(cents)
  ) {
    fail("INVALID_PRICE_FORMAT");
  }

  return validCents(
    euros * 100 + cents
  );
}

// ============================================================
// 7. FORMATER UN MONTANT
// ============================================================

const PRICE_LOCALES: Record<string, string> = {
  fr: "fr-FR",
  en: "en-GB",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
};

export function formatCheckoutMoney(
  cents: number,
  locale = "fr"
): string {
  validCents(cents);

  return new Intl.NumberFormat(
    PRICE_LOCALES[locale] ?? "fr-FR",
    {
      style: "currency",
      currency: CHECKOUT_CURRENCY,
    }
  ).format(cents / 100);
}

// ============================================================
// 8. LECTURE DU CATALOGUE RÉEL
// ============================================================
//
// Utilise allProducts depuis lib/catalog.ts.
//
// On accède uniquement aux propriétés
// indispensables au checkout.
//
// Le type Record permet de vérifier
// les données avant leur utilisation.
//
// ============================================================

type CatalogProduct = Record<string, unknown>;

function getCatalogProducts(): CatalogProduct[] {
  const products: readonly unknown[] = allProducts;

  return products.filter(
    (product): product is CatalogProduct =>
      isRecord(product)
  );
}

function normalizeCatalogId(
  value: unknown
): string {
  if (
    typeof value !== "string" &&
    typeof value !== "number"
  ) {
    return "";
  }

  return String(value).trim();
}

function findCatalogProduct(
  id: string
): CatalogProduct | null {
  const products = getCatalogProducts();

  return (
    products.find(
      (product) =>
        normalizeCatalogId(product.id) === id
    ) ?? null
  );
}

// ============================================================
// 9. EXTRACTION DU NOM
// ============================================================

function getCatalogProductName(
  product: CatalogProduct
): string {
  const name = cleanString(
    product.name,
    500
  );

  if (!name) {
    fail("PRODUCT_NOT_FOUND");
  }

  return name;
}

// ============================================================
// 10. EXTRACTION DE L'IMAGE
// ============================================================
//
// Selon la structure d'import du catalogue,
// une image peut être :
//
// - une chaîne URL
// - un objet contenant src
// - une collection d'images
//
// Aucune image fictive n'est utilisée.
//
// ============================================================

function extractImageUrl(
  value: unknown
): string | null {
  if (typeof value === "string") {
    return cleanString(value, 2048) || null;
  }

  if (Array.isArray(value)) {
    for (const image of value) {
      const result = extractImageUrl(image);

      if (result) {
        return result;
      }
    }

    return null;
  }

  if (isRecord(value)) {
    const possibleFields = [
      value.src,
      value.url,
    ];

    for (const field of possibleFields) {
      if (
        typeof field === "string" &&
        field.trim()
      ) {
        return cleanString(field, 2048);
      }
    }
  }

  return null;
}

function getCatalogProductImage(
  product: CatalogProduct
): string | null {
  return (
    extractImageUrl(product.images) ??
    extractImageUrl(product.image) ??
    extractImageUrl(product.thumbnail) ??
    null
  );
}

// ============================================================
// 11. EXTRACTION DE LA RÉFÉRENCE
// ============================================================

function getCatalogProductSku(
  product: CatalogProduct
): string | null {
  return (
    cleanString(product.sku, 191) ||
    null
  );
}

// ============================================================
// 12. VÉRIFICATION COMMERCIALE
// ============================================================
//
// On rejette uniquement les indications
// explicites de non-commercialisation.
//
// Attention :
// un stock importé dans un fichier JSON
// n'est pas une preuve de disponibilité
// en temps réel.
//
// Le contrôle de stock réel doit être
// ajouté avant toute confirmation définitive.
//
// ============================================================

function assertProductPurchasable(
  product: CatalogProduct
): void {
  if (
    product.purchasable === false ||
    product.isPurchasable === false
  ) {
    fail("PRODUCT_NOT_PURCHASABLE");
  }

  const status =
    typeof product.status === "string"
      ? product.status.trim().toLowerCase()
      : "";

  if (
    status === "draft" ||
    status === "private" ||
    status === "trash"
  ) {
    fail("PRODUCT_NOT_PURCHASABLE");
  }

  if (product.stockConfirmed === true && typeof product.stockQuantityAtExport === "number" && product.stockQuantityAtExport <= 0) fail("PRODUCT_NOT_PURCHASABLE");

  const stockStatus =
    typeof product.stockStatus === "string"
      ? product.stockStatus.trim().toLowerCase()
      : "";

  if (
    stockStatus === "outofstock" ||
    stockStatus === "out_of_stock"
  ) {
    fail("PRODUCT_NOT_PURCHASABLE");
  }
}

// ============================================================
// 13. EXTRACTION DU PRIX RÉEL
// ============================================================
//
// Priorité :
//
// 1. product.price
//    Prix courant réellement fourni
//    par le catalogue.
//
// 2. product.salePrice
//    Utilisé seulement si price est absent.
//
// 3. product.regularPrice
//    Utilisé seulement si aucun autre
//    prix courant n'est renseigné.
//
// IMPORTANT :
// Nous ne calculons pas de promotion fictive.
//
// ============================================================

function getCatalogPriceCents(
  product: CatalogProduct
): number {
  const currency =
    typeof product.currency === "string"
      ? product.currency.trim().toUpperCase()
      : "";

  if (
    currency &&
    currency !== CHECKOUT_CURRENCY
  ) {
    fail("PRODUCT_CURRENCY_UNSUPPORTED");
  }

  const sourceProduct=allProducts.find(item=>item.id===normalizeCatalogId(product.id));
  const cataloguePrice=sourceProduct?currentPrice(sourceProduct):null;
  if(cataloguePrice!==null){const cents=eurosToCents(cataloguePrice);if(cents<=0)fail("PRODUCT_PRICE_UNAVAILABLE");return cents;}
  const candidates = [
    product.price,
    product.salePrice,
    product.regularPrice,
  ];

  for (const candidate of candidates) {
    if (
      candidate === null ||
      candidate === undefined ||
      candidate === ""
    ) {
      continue;
    }

    const cents = eurosToCents(candidate);

    if (cents <= 0) {
      fail("PRODUCT_PRICE_UNAVAILABLE");
    }

    return cents;
  }

  fail("PRODUCT_PRICE_UNAVAILABLE");
}

// ============================================================
// 14. VÉRIFICATION DU PANIER
// ============================================================

function validateCartItems(
  items: readonly CheckoutPricingCartItem[]
): CheckoutPricingCartItem[] {
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    fail("EMPTY_CART");
  }

  if (items.length > CHECKOUT_MAX_LINES) {
    fail("TOO_MANY_PRODUCTS");
  }

  const normalized: CheckoutPricingCartItem[] = [];

  const seen = new Set<string>();

  for (const item of items) {
    if (!isRecord(item)) {
      fail("INVALID_PRODUCT_ID");
    }

    const productId = requiredString(
      item.productId,
      191,
      "INVALID_PRODUCT_ID"
    );

    if (
      item.variantId !== undefined &&
      item.variantId !== null &&
      item.variantId !== ""
    ) {
      /**
       * Le schéma actuel CheckoutOrderItem
       * ne possède pas de champ variantId.
       *
       * On refuse donc les variantes
       * plutôt que de perdre leur information.
       */
      fail("UNSUPPORTED_VARIANT");
    }

    if (
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > CHECKOUT_MAX_QUANTITY
    ) {
      fail("INVALID_QUANTITY");
    }

    if (seen.has(productId)) {
      fail("DUPLICATE_PRODUCT");
    }

    seen.add(productId);

    normalized.push({
      productId,
      quantity: item.quantity,
      variantId: null,
    });
  }

  return normalized;
}

// ============================================================
// 15. CALCUL DES PRODUITS
// ============================================================

function calculateProductLines(
  cartItems: readonly CheckoutPricingCartItem[]
): {
  items: CheckoutOrderProduct[];
  subtotalCents: number;
} {
  const items: CheckoutOrderProduct[] = [];

  let subtotalCents = 0;

  for (const cartItem of cartItems) {
    const product = findCatalogProduct(
      cartItem.productId
    );

    if (!product) {
      fail("PRODUCT_NOT_FOUND");
    }

    assertProductPurchasable(product);
    if(product.stockConfirmed===true && typeof product.stockQuantityAtExport==="number" && cartItem.quantity>product.stockQuantityAtExport)fail("PRODUCT_NOT_PURCHASABLE");

    const productName =
      getCatalogProductName(product);

    const unitPriceCents =
      getCatalogPriceCents(product);

    const lineTotalCents = checkedMultiply(
      unitPriceCents,
      cartItem.quantity
    );

    subtotalCents = checkedAdd(
      subtotalCents,
      lineTotalCents
    );

    items.push({
      productId: cartItem.productId,

      productName,

      productImage:
        getCatalogProductImage(product),

      sku:
        getCatalogProductSku(product),

      quantity:
        cartItem.quantity,

      unitPriceCents,

      lineTotalCents,
    });
  }

  return {
    items,
    subtotalCents,
  };
}

// ============================================================
// 16. FRAIS DE LIVRAISON
// ============================================================
//
// Aucun tarif de livraison n'est inventé.
//
// Les tarifs fixes peuvent être configurés
// côté serveur dans .env :
//
// CYCLORIVA_SHIPPING_DE_CENTS
// CYCLORIVA_SHIPPING_FR_CENTS
// CYCLORIVA_SHIPPING_ES_CENTS
// CYCLORIVA_SHIPPING_IT_CENTS
// CYCLORIVA_SHIPPING_CH_CENTS
// CYCLORIVA_SHIPPING_AT_CENTS
// CYCLORIVA_SHIPPING_NL_CENTS
// CYCLORIVA_SHIPPING_BE_CENTS
//
// Les montants doivent être renseignés
// en centimes d'euro.
//
// Exemple purement technique :
// 1500 correspond à 15,00 EUR.
//
// Une valeur 0 n'est autorisée que si
// la livraison est réellement gratuite.
//
// ============================================================

const SHIPPING_ENV_KEYS: Record<
  CheckoutCountryCode,
  string
> = {
  DE: "CYCLORIVA_SHIPPING_DE_CENTS",
  FR: "CYCLORIVA_SHIPPING_FR_CENTS",
  ES: "CYCLORIVA_SHIPPING_ES_CENTS",
  IT: "CYCLORIVA_SHIPPING_IT_CENTS",
  CH: "CYCLORIVA_SHIPPING_CH_CENTS",
  AT: "CYCLORIVA_SHIPPING_AT_CENTS",
  NL: "CYCLORIVA_SHIPPING_NL_CENTS",
  BE: "CYCLORIVA_SHIPPING_BE_CENTS",
};

function getConfiguredShippingCents(
  country: CheckoutCountryCode
): number {
  const envKey = SHIPPING_ENV_KEYS[country];

  const raw = process.env[envKey];

  if (
    raw === undefined ||
    raw.trim() === ""
  ) {
    fail("SHIPPING_NOT_CONFIGURED");
  }

  if (!/^\d+$/.test(raw.trim())) {
    fail("INVALID_SHIPPING");
  }

  const cents = Number(raw.trim());

  if (
    !Number.isSafeInteger(cents) ||
    cents < 0 ||
    cents > CHECKOUT_MAX_CENTS
  ) {
    fail("INVALID_SHIPPING");
  }

  return cents;
}

// ============================================================
// 17. CALCUL COMPLET DE LA COMMANDE
// ============================================================
//
// Cette fonction est la source du montant
// de commande côté serveur.
//
// Elle ignore volontairement les éventuels
// prix transmis par le navigateur.
//
// Si aucun transporteur n'est connecté,
// les tarifs de livraison sont lus depuis
// les variables serveur configurées.
//
// ============================================================

export async function calculateCheckoutPricing(
  request: CheckoutPricingRequest,
  options: CheckoutPricingOptions = {}
): Promise<VerifiedCheckoutPricing> {
  if (!isCheckoutCountry(request.country)) {
    fail("INVALID_COUNTRY");
  }

  // ---------------------------------------------------------
  // ÉTAPE 1 : VALIDER LES ARTICLES
  // ---------------------------------------------------------

  const cartItems = validateCartItems(
    request.items
  );

  // ---------------------------------------------------------
  // ÉTAPE 2 : LIRE LES PRODUITS RÉELS
  // ---------------------------------------------------------

  const {
    items,
    subtotalCents,
  } = calculateProductLines(cartItems);

  // ---------------------------------------------------------
  // ÉTAPE 3 : CALCULER LA LIVRAISON
  // ---------------------------------------------------------

  let shippingCents: number;

  if (options.shippingCalculator) {
    shippingCents =
      await options.shippingCalculator({
        country: request.country,
        items,
        subtotalCents,
      });
  } else {
    shippingCents =
      getConfiguredShippingCents(
        request.country
      );
  }

  if (
    !Number.isSafeInteger(shippingCents) ||
    shippingCents < 0 ||
    shippingCents > CHECKOUT_MAX_CENTS
  ) {
    fail("INVALID_SHIPPING");
  }

  // ---------------------------------------------------------
  // ÉTAPE 4 : CALCULER LE TOTAL
  // ---------------------------------------------------------

  const totalCents = checkedAdd(
    subtotalCents,
    shippingCents
  );

  // ---------------------------------------------------------
  // ÉTAPE 5 : TAXES
  // ---------------------------------------------------------
  //
  // Le schéma CheckoutOrder actuel utilise :
  //
  // total = subtotal + shipping
  //
  // taxCents est un montant informatif
  // lorsqu'une ventilation fiscale fiable
  // est disponible.
  //
  // Aucune taxe fictive n'est calculée ici.
  //
  // Les règles TVA / Suisse devront être
  // intégrées avant la mise en production.
  //
  // ---------------------------------------------------------

  const taxCents: number | null = null;

  // ---------------------------------------------------------
  // ÉTAPE 6 : RETOURNER LE PRIX VÉRIFIÉ
  // ---------------------------------------------------------

  return {
    currency: CHECKOUT_CURRENCY,

    items,

    subtotalCents,

    shippingCents,

    taxCents,

    totalCents,
  };
}

// ============================================================
// 18. RÉCAPITULATIF POUR L'AFFICHAGE
// ============================================================
//
// Ce helper reçoit un résultat déjà
// calculé côté serveur.
//
// Il ne doit pas transformer un montant
// de panier client en prix vérifié.
//
// ============================================================

export function buildCheckoutPricingSummary(
  country: CheckoutCountryCode,
  pricing: VerifiedCheckoutPricing
): CheckoutPricingSummary {
  if (!isCheckoutCountry(country)) {
    fail("INVALID_COUNTRY");
  }

  if (pricing.currency !== CHECKOUT_CURRENCY) {
    fail("PRODUCT_CURRENCY_UNSUPPORTED");
  }

  let itemCount = 0;
  let subtotalCents = 0;

  const items: CheckoutPriceLine[] =
    pricing.items.map((item) => {
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > CHECKOUT_MAX_QUANTITY
      ) {
        fail("INVALID_QUANTITY");
      }

      const lineTotalCents = checkedMultiply(
        item.unitPriceCents,
        item.quantity
      );

      if (
        lineTotalCents !== item.lineTotalCents
      ) {
        fail("INVALID_AMOUNT");
      }

      subtotalCents = checkedAdd(
        subtotalCents,
        lineTotalCents
      );

      itemCount += item.quantity;

      return {
        productId:
          item.productId,

        productName:
          item.productName,

        quantity:
          item.quantity,

        unitPriceCents:
          item.unitPriceCents,

        lineTotalCents,

        currency:
          CHECKOUT_CURRENCY,
      };
    });

  if (
    subtotalCents !== pricing.subtotalCents
  ) {
    fail("INVALID_AMOUNT");
  }

  const totalCents = checkedAdd(
    subtotalCents,
    validCents(pricing.shippingCents)
  );

  if (totalCents !== pricing.totalCents) {
    fail("INVALID_AMOUNT");
  }

  return {
    currency: CHECKOUT_CURRENCY,

    country,

    distinctItems:
      pricing.items.length,

    itemCount,

    subtotalCents,

    shippingCents:
      pricing.shippingCents,

    taxCents:
      pricing.taxCents ?? null,

    totalCents,

    items,
  };
}

// ============================================================
// 19. CALCUL D'UN APERÇU SANS LIVRAISON
// ============================================================
//
// Utilisé uniquement pour un aperçu
// des produits et du sous-total.
//
// Ne représente PAS le montant final
// d'une commande.
//
// ============================================================

export function calculateCheckoutSubtotal(
  rawItems: readonly CheckoutPricingCartItem[]
): {
  currency: "EUR";
  items: CheckoutOrderProduct[];
  distinctItems: number;
  itemCount: number;
  subtotalCents: number;
} {
  const cartItems =
    validateCartItems(rawItems);

  const result =
    calculateProductLines(cartItems);

  const itemCount =
    result.items.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  return {
    currency: CHECKOUT_CURRENCY,

    items: result.items,

    distinctItems:
      result.items.length,

    itemCount,

    subtotalCents:
      result.subtotalCents,
  };
}

// ============================================================
// 20. VÉRIFICATION DE LA CONFIGURATION LIVRAISON
// ============================================================
//
// Cette fonction permet de vérifier
// quels pays possèdent un tarif configuré.
//
// À utiliser uniquement dans une route
// serveur ou un contrôle d'administration.
//
// ============================================================

export function getCheckoutShippingConfiguration(): {
  country: CheckoutCountryCode;
  configured: boolean;
}[] {
  return CHECKOUT_ALLOWED_COUNTRIES.map(
    (country) => {
      const key =
        SHIPPING_ENV_KEYS[country];

      const raw =
        process.env[key];

      const configured =
        typeof raw === "string" &&
        /^\d+$/.test(raw.trim()) &&
        Number.isSafeInteger(
          Number(raw.trim())
        ) &&
        Number(raw.trim()) <=
          CHECKOUT_MAX_CENTS;

      return {
        country,
        configured,
      };
    }
  );
}

// ============================================================
// FIN — CYCLORIVA CHECKOUT PRICING
// ============================================================
