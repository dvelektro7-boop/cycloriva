
/**
 * ============================================================
 * CYCLORIVA — SERVICES DE COMMANDE PRODUIT
 * ============================================================
 *
 * Next.js 16 — TypeScript
 *
 * Responsabilités :
 *
 * 1. Valider le numéro WhatsApp officiel.
 * 2. Générer un message de commande traduit.
 * 3. Construire un lien WhatsApp sécurisé.
 * 4. Vérifier les données essentielles du produit.
 * 5. Préparer une ligne de panier.
 * 6. Construire les URL internes de navigation.
 *
 * IMPORTANT :
 *
 * Ce module ne :
 * - crée pas de commande dans une base de données ;
 * - ne débite aucune carte bancaire ;
 * - ne confirme aucun paiement ;
 * - ne confirme aucun stock en temps réel ;
 * - ne choisit aucun numéro WhatsApp arbitraire ;
 * - ne stocke aucune information sensible.
 *
 * ============================================================
 */

import type { Product } from "@/lib/catalog";

import {
  buildProductWhatsAppMessage,
  getProductTranslations,
  productCatalogPath,
  productDetailPath,
  resolveProductLocale,
  type ProductLocale,
} from "@/lib/product-i18n";

// ============================================================
// 1. CONFIGURATION
// ============================================================

export const PRODUCT_ORDER_CONFIG = {
  whatsappNumber: "4915730394552",
  minQuantity: 1,
  maxQuantity: 99,

  whatsappBaseUrl: "https://wa.me/",

  defaultLocale: "fr" as ProductLocale,
} as const;

// ============================================================
// 2. TYPES
// ============================================================

export type ProductOrderChannel =
  | "whatsapp"
  | "website";

export type ProductOrderAvailability =
  | "available"
  | "unavailable"
  | "unconfirmed";

export type ProductOrderValidationCode =
  | "INVALID_PRODUCT"
  | "INVALID_PRODUCT_ID"
  | "INVALID_QUANTITY"
  | "INVALID_PRICE"
  | "STOCK_UNAVAILABLE"
  | "STOCK_UNCONFIRMED"
  | "INVALID_WHATSAPP_NUMBER"
  | "INVALID_PRODUCT_URL";

export type ProductOrderValidationResult =
  | {
      valid: true;
      code: null;
    }
  | {
      valid: false;
      code: ProductOrderValidationCode;
    };

export type ProductOrderItem = {
  /**
   * Identifiant véritable du produit.
   */
  productId: string;

  /**
   * Référence issue du catalogue.
   */
  sku: string | null;

  /**
   * Nom réel du produit.
   */
  name: string;

  /**
   * Quantité demandée par le client.
   */
  quantity: number;
};

export type ProductOrderPriceSnapshot = {
  /**
   * Prix indicatif provenant du catalogue.
   *
   * Le serveur devra recalculer le prix
   * avant toute validation de commande.
   */
  unitPrice: number | null;

  currency: "EUR";
};

export type ProductCartItemDraft = ProductOrderItem & {
  catalogPrice: ProductOrderPriceSnapshot;
};

export type ProductWhatsAppOrderInput = {
  product: Product;

  locale: ProductLocale;

  whatsappNumber: string;

  /**
   * URL absolue publique de la fiche.
   *
   * Exemple :
   * https://domaine-verifie.com/fr/produits/123
   *
   * Le module ne devine pas le domaine.
   */
  productUrl: string;

  /**
   * Nom traduit, lorsque disponible.
   */
  productName?: string;

  /**
   * Quantité facultative.
   */
  quantity?: number;
};

export type ProductWhatsAppOrderResult =
  | {
      success: true;
      url: string;
      message: string;
      phone: string;
    }
  | {
      success: false;
      code: ProductOrderValidationCode;
      url: null;
      message: null;
      phone: null;
    };

export type ProductCartDraftResult =
  | {
      success: true;
      item: ProductCartItemDraft;
    }
  | {
      success: false;
      code: ProductOrderValidationCode;
      item: null;
    };

// ============================================================
// 3. NETTOYAGE DES TEXTES
// ============================================================

export function cleanProductOrderText(
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
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// 4. IDENTIFIANT DU PRODUIT
// ============================================================

export function getProductOrderId(
  product: Product
): string | null {
  const value: unknown = product.id;

  if (
    typeof value !== "string" &&
    typeof value !== "number"
  ) {
    return null;
  }

  if (
    typeof value === "number" &&
    !Number.isSafeInteger(value)
  ) {
    return null;
  }

  const id = String(value).trim();

  return id.length > 0 ? id : null;
}

// ============================================================
// 5. RÉFÉRENCE DU PRODUIT
// ============================================================

export function getProductOrderSku(
  product: Product
): string | null {
  const sku = cleanProductOrderText(
    product.sku
  );

  return sku || null;
}

// ============================================================
// 6. NOM DU PRODUIT
// ============================================================

export function getProductOrderName(
  product: Product,
  localizedName?: string
): string {
  const name =
    cleanProductOrderText(localizedName) ||
    cleanProductOrderText(product.name);

  return name || getProductOrderId(product) || "";
}

// ============================================================
// 7. VALIDATION DE LA QUANTITÉ
// ============================================================

export function isValidProductOrderQuantity(
  quantity: unknown
): quantity is number {
  return (
    typeof quantity === "number" &&
    Number.isSafeInteger(quantity) &&
    quantity >= PRODUCT_ORDER_CONFIG.minQuantity &&
    quantity <= PRODUCT_ORDER_CONFIG.maxQuantity
  );
}

export function normalizeProductOrderQuantity(
  quantity: unknown
): number | null {
  if (
    isValidProductOrderQuantity(quantity)
  ) {
    return quantity;
  }

  if (
    typeof quantity === "string" &&
    /^\d+$/.test(quantity.trim())
  ) {
    const parsed = Number(quantity.trim());

    return isValidProductOrderQuantity(parsed)
      ? parsed
      : null;
  }

  return null;
}

// ============================================================
// 8. VALIDATION DES PRIX
// ============================================================

export function normalizeProductOrderPrice(
  value: unknown
): number | null {
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
        ? Number(
            value.trim().replace(",", ".")
          )
        : NaN;

  if (
    !Number.isFinite(parsed) ||
    parsed < 0
  ) {
    return null;
  }

  return parsed;
}

// ============================================================
// 9. PRIX COURANT DU CATALOGUE
// ============================================================

/**
 * Une réduction est reconnue seulement
 * lorsque le prix promotionnel est inférieur
 * au prix habituel renseigné.
 *
 * Le montant obtenu reste indicatif.
 * Le serveur devra valider les prix finaux.
 */

export function getProductOrderPrice(
  product: Product
): number | null {
  const regular = normalizeProductOrderPrice(
    product.regularPrice
  );

  const sale = normalizeProductOrderPrice(
    product.salePrice
  );

  const standard = normalizeProductOrderPrice(
    product.price
  );

  if (
    regular !== null &&
    regular > 0 &&
    sale !== null &&
    sale < regular
  ) {
    return sale;
  }

  return standard ?? regular ?? sale;
}

// ============================================================
// 10. DISPONIBILITÉ
// ============================================================

/**
 * IMPORTANT :
 *
 * Les données proviennent du catalogue importé.
 * Elles ne constituent pas un contrôle de stock
 * effectué au moment de la commande.
 *
 * "available" signifie uniquement que
 * la donnée du catalogue indique un stock
 * positif et marqué comme confirmé.
 *
 * Un système de commande opérationnel
 * devra consulter le stock côté serveur.
 */

export function getProductOrderAvailability(
  product: Product
): ProductOrderAvailability {
  if (product.stockConfirmed !== true) {
    return "unconfirmed";
  }

  const quantity =
    product.stockQuantityAtExport;

  if (
    typeof quantity !== "number" ||
    !Number.isFinite(quantity) ||
    quantity < 0
  ) {
    return "unconfirmed";
  }

  if (quantity === 0) {
    return "unavailable";
  }

  return "available";
}

// ============================================================
// 11. VÉRIFICATION DES DONNÉES DU PANIER
// ============================================================

export function validateProductCartDraft(
  product: Product,
  quantity: number
): ProductOrderValidationResult {
  if (
    !product ||
    typeof product !== "object"
  ) {
    return {
      valid: false,
      code: "INVALID_PRODUCT",
    };
  }

  if (!getProductOrderId(product)) {
    return {
      valid: false,
      code: "INVALID_PRODUCT_ID",
    };
  }

  if (
    !isValidProductOrderQuantity(quantity)
  ) {
    return {
      valid: false,
      code: "INVALID_QUANTITY",
    };
  }

  if (
    getProductOrderPrice(product) === null
  ) {
    return {
      valid: false,
      code: "INVALID_PRICE",
    };
  }

  const availability =
    getProductOrderAvailability(product);

  if (availability === "unavailable") {
    return {
      valid: false,
      code: "STOCK_UNAVAILABLE",
    };
  }

  // A draft is a request, never a reservation or confirmation of imported stock.

  return {
    valid: true,
    code: null,
  };
}

// ============================================================
// 12. CONSTRUCTION D'UNE LIGNE DE PANIER
// ============================================================

/**
 * Produit une ligne de panier provisoire.
 *
 * Le serveur doit ensuite :
 *
 * - vérifier le produit ;
 * - contrôler son prix ;
 * - contrôler son stock ;
 * - recalculer le total ;
 * - valider la commande.
 *
 * Ne jamais utiliser le prix transmis
 * par le navigateur comme prix définitif.
 */

export function createProductCartDraft(
  product: Product,
  quantity = 1,
  localizedName?: string
): ProductCartDraftResult {
  const validation =
    validateProductCartDraft(
      product,
      quantity
    );

  if (!validation.valid) {
    return {
      success: false,
      code: validation.code,
      item: null,
    };
  }

  const productId =
    getProductOrderId(product);

  const unitPrice =
    getProductOrderPrice(product);

  if (!productId) {
    return {
      success: false,
      code: "INVALID_PRODUCT_ID",
      item: null,
    };
  }

  if (unitPrice === null) {
    return {
      success: false,
      code: "INVALID_PRICE",
      item: null,
    };
  }

  return {
    success: true,

    item: {
      productId,

      sku: getProductOrderSku(product),

      name: getProductOrderName(
        product,
        localizedName
      ),

      quantity,

      catalogPrice: {
        unitPrice,
        currency: "EUR",
      },
    },
  };
}

// ============================================================
// 13. NUMÉRO WHATSAPP OFFICIEL
// ============================================================

/**
 * Le numéro doit être fourni explicitement
 * par la configuration de la boutique.
 *
 * Formats acceptés :
 *
 * +XXXXXXXXXXX
 * 00XXXXXXXXXXX
 * XXXXXXXXXXX
 *
 * Retourne uniquement les chiffres
 * nécessaires à l'adresse wa.me.
 */

export function normalizeProductWhatsAppNumber(
  value: unknown
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const input = value.trim();

  if (!input) {
    return null;
  }

  if (
    !/^[+\d\s().-]+$/.test(input) ||
    (input.includes("+") &&
      !input.startsWith("+"))
  ) {
    return null;
  }

  let digits = input.replace(/\D/g, "");

  if (
    !input.startsWith("+") &&
    digits.startsWith("00")
  ) {
    digits = digits.slice(2);
  }

  if (
    !/^[1-9]\d{7,14}$/.test(digits)
  ) {
    return null;
  }

  return digits;
}

// ============================================================
// 14. VALIDATION DE L'URL PUBLIQUE
// ============================================================

/**
 * Accepte une véritable URL HTTPS.
 *
 * En développement local, HTTP est accepté
 * uniquement pour localhost ou 127.0.0.1.
 *
 * N'invente aucun domaine CYCLORIVA.
 */

export function normalizeProductPublicUrl(
  value: unknown
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const input = value.trim();

  if (
    !input ||
    /[\u0000-\u001f\u007f\\]/.test(input)
  ) {
    return null;
  }

  try {
    const url = new URL(input);

    if (url.username || url.password) {
      return null;
    }

    const isHttps =
      url.protocol === "https:";

    const isLocalHttp =
      url.protocol === "http:" &&
      [
        "localhost",
        "127.0.0.1",
        "[::1]",
      ].includes(url.hostname);

    if (!isHttps && !isLocalHttp) {
      return null;
    }

    if (!url.hostname) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

// ============================================================
// 15. CRÉATION DU LIEN WHATSAPP
// ============================================================

/**
 * Le message est traduit par product-i18n.ts.
 *
 * Aucun prix n'est ajouté automatiquement,
 * car une disponibilité ou un prix issu
 * du catalogue peut nécessiter vérification.
 *
 * L'ouverture de WhatsApp n'est pas exécutée
 * dans ce module.
 */

export function createProductWhatsAppOrder(
  input: ProductWhatsAppOrderInput
): ProductWhatsAppOrderResult {
  const productId =
    getProductOrderId(input.product);

  if (!productId) {
    return {
      success: false,
      code: "INVALID_PRODUCT_ID",
      url: null,
      message: null,
      phone: null,
    };
  }

  const quantity =
    input.quantity ?? 1;

  if (
    !isValidProductOrderQuantity(quantity)
  ) {
    return {
      success: false,
      code: "INVALID_QUANTITY",
      url: null,
      message: null,
      phone: null,
    };
  }

  const phone =
    normalizeProductWhatsAppNumber(
      input.whatsappNumber
    );

  if (!phone) {
    return {
      success: false,
      code: "INVALID_WHATSAPP_NUMBER",
      url: null,
      message: null,
      phone: null,
    };
  }

  const productUrl =
    normalizeProductPublicUrl(
      input.productUrl
    );

  if (!productUrl) {
    return {
      success: false,
      code: "INVALID_PRODUCT_URL",
      url: null,
      message: null,
      phone: null,
    };
  }

  const locale =
    resolveProductLocale(input.locale);

  const name =
    getProductOrderName(
      input.product,
      input.productName
    );

  const message =
    buildProductWhatsAppMessage(
      locale,
      {
        name,
        sku: getProductOrderSku(input.product) || productId,
        url: productUrl,
        quantity,
        unitPrice: getProductOrderPrice(input.product),
      }
    );

  // Ajouter la quantité réelle lorsque
  // plusieurs unités sont demandées.
  const quantityMessage = message;

  const url =
    `${PRODUCT_ORDER_CONFIG.whatsappBaseUrl}` +
    `${phone}?text=${encodeURIComponent(
      quantityMessage
    )}`;

  return {
    success: true,
    url,
    message: quantityMessage,
    phone,
  };
}

// ============================================================
// 16. URL DE LA FICHE PRODUIT
// ============================================================

export function getProductOrderPagePath(
  product: Product,
  locale: ProductLocale
): string {
  const id = getProductOrderId(product);

  if (!id) {
    return productCatalogPath(locale);
  }

  return productDetailPath(locale, id);
}

// ============================================================
// 17. VALIDATION D'UNE ROUTE INTERNE
// ============================================================

export function normalizeProductInternalPath(
  value: unknown
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const input = value.trim();

  if (
    !input ||
    !input.startsWith("/") ||
    input.startsWith("//") ||
    /[\u0000-\u001f\u007f\\]/.test(input)
  ) {
    return null;
  }

  const pathname = input.split(/[?#]/, 1)[0];

  let decodedPath: string;

  try {
    decodedPath =
      decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (
    decodedPath.startsWith("//") ||
    decodedPath.includes("\\") ||
    decodedPath.split("/").some(
      (part) => part === "." || part === ".."
    )
  ) {
    return null;
  }

  return input;
}

// ============================================================
// 18. PRÉPARATION D'UNE COMMANDE SUR LE SITE
// ============================================================

export type WebsiteOrderPreparation = {
  item: ProductCartItemDraft;

  /**
   * Cette valeur n'est jamais un justificatif
   * de commande ou de paiement.
   */
  status: "draft";

  /**
   * Toujours false :
   * une ligne de panier ne prouve aucun paiement.
   */
  paid: false;
};

export type WebsiteOrderPreparationResult =
  | {
      success: true;
      order: WebsiteOrderPreparation;
    }
  | {
      success: false;
      code: ProductOrderValidationCode;
      order: null;
    };

/**
 * Prépare la ligne à transmettre au système
 * réel de panier.
 *
 * Ne sauvegarde rien automatiquement.
 */

export function prepareWebsiteProductOrder(
  product: Product,
  quantity = 1,
  localizedName?: string
): WebsiteOrderPreparationResult {
  const cartDraft =
    createProductCartDraft(
      product,
      quantity,
      localizedName
    );

  if (!cartDraft.success) {
    return {
      success: false,
      code: cartDraft.code,
      order: null,
    };
  }

  return {
    success: true,

    order: {
      item: cartDraft.item,
      status: "draft",
      paid: false,
    },
  };
}

// ============================================================
// 19. MESSAGES D'ERREUR LOCALISÉS
// ============================================================

export function getProductOrderErrorMessage(
  code: ProductOrderValidationCode,
  locale: ProductLocale
): string {
  const language =
    resolveProductLocale(locale);

  const text =
    getProductTranslations(language);

  switch (code) {
    case "INVALID_WHATSAPP_NUMBER":
      return text.order.whatsappUnavailable;

    case "STOCK_UNAVAILABLE":
      return text.summary.outOfStock;

    case "STOCK_UNCONFIRMED":
      return text.summary.stockUnknown;

    case "INVALID_PRICE":
      return text.summary.priceUnavailable;

    case "INVALID_PRODUCT_URL":
    case "INVALID_PRODUCT":
    case "INVALID_PRODUCT_ID":
    case "INVALID_QUANTITY":
    default:
      return text.order.error;
  }
}

// ============================================================
// 20. EXPORTS
// ============================================================

export const productOrder = {
  cleanProductOrderText,

  getProductOrderId,
  getProductOrderSku,
  getProductOrderName,

  isValidProductOrderQuantity,
  normalizeProductOrderQuantity,

  normalizeProductOrderPrice,
  getProductOrderPrice,

  getProductOrderAvailability,
  validateProductCartDraft,

  createProductCartDraft,
  prepareWebsiteProductOrder,

  normalizeProductWhatsAppNumber,
  normalizeProductPublicUrl,

  createProductWhatsAppOrder,

  getProductOrderPagePath,
  normalizeProductInternalPath,

  getProductOrderErrorMessage,
} as const;

export default productOrder;

// ============================================================
// FIN — CYCLORIVA PRODUCT ORDER
// ============================================================
