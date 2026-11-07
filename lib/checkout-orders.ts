
import "server-only";

import { randomUUID } from "node:crypto";

import type { PrismaClient } from "@/generated/prisma/client";

import {
  sendAdminOrderEmail,
  sendCustomerOrderEmail,
  getCheckoutEmailConfiguration,
  type CheckoutEmailOrder,
} from "@/lib/checkout-emails";

/**
 * ============================================================
 * CYCLORIVA — GESTION DES COMMANDES
 * ============================================================
 *
 * Fichier : lib/checkout-orders.ts
 *
 * Next.js 16 — Prisma 7 — PostgreSQL / Supabase
 *
 * RESPONSABILITÉS :
 *
 * 1. Vérifier les données serveur d'une commande
 * 2. Empêcher les commandes en double
 * 3. Générer un numéro unique
 * 4. Enregistrer la commande et ses produits
 * 5. Préparer les deux notifications e-mail
 * 6. Lire les commandes enregistrées
 * 7. Traiter les notifications via Resend
 * 8. Conserver les statuts et erreurs d'envoi
 *
 * IMPORTANT :
 *
 * Ce module est strictement serveur.
 *
 * Le panier et les prix doivent être vérifiés
 * par checkout-pricing.ts AVANT l'appel de
 * createCheckoutOrder().
 *
 * Aucun paiement n'est déclenché ici.
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES GÉNÉRAUX
// ============================================================

export type CheckoutLocale =
  | "fr"
  | "en"
  | "de"
  | "it"
  | "es";

export type CheckoutCountryCode =
  | "DE"
  | "FR"
  | "ES"
  | "IT"
  | "CH"
  | "AT"
  | "NL"
  | "BE";

export type CheckoutOrderProduct = {
  productId: string;
  productName: string;
  productImage?: string | null;
  sku?: string | null;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type CheckoutCustomerDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phoneDialCode: string;
  phoneNational: string;
  phoneE164: string;
};

export type CheckoutDeliveryDetails = {
  country: CheckoutCountryCode;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string | null;
};

export type VerifiedCheckoutPricing = {
  currency: "EUR";
  items: CheckoutOrderProduct[];
  subtotalCents: number;
  shippingCents: number;
  taxCents?: number | null;
  totalCents: number;
};

export type CreateCheckoutOrderInput = {
  /**
   * Clé générée pour une tentative de commande.
   *
   * Une même tentative doit conserver
   * la même clé après un nouvel essai.
   */
  idempotencyKey: string;

  locale: CheckoutLocale;

  customer: CheckoutCustomerDetails;

  delivery: CheckoutDeliveryDetails;

  /**
   * Pays approximatif détecté via IP.
   * Facultatif et distinct du pays de livraison.
   */
  detectedCountry?: CheckoutCountryCode | null;

  /**
   * Résultat de calcul préparé côté serveur.
   *
   * Ne jamais construire cet objet directement
   * depuis les prix envoyés par le navigateur.
   */
  pricing: VerifiedCheckoutPricing;
};

export type CheckoutOrderDatabase = Pick<
  PrismaClient,
  "$transaction" | "checkoutOrder" | "checkoutEmailNotification"
>;

export type CheckoutOrderCreateResult = {
  orderId: string;
  orderNumber: string;
  created: boolean;
  status: string;
  totalCents: number;
  currency: string;
};

export type CheckoutNotificationResult = {
  type: "CUSTOMER_CONFIRMATION" | "ADMIN_NOTIFICATION";
  success: boolean;
  skipped: boolean;
  error?: string;
};

export type CheckoutEmailProcessingResult = {
  orderId: string;
  results: CheckoutNotificationResult[];
};

// ============================================================
// 2. CONSTANTES
// ============================================================

const COUNTRIES = new Set<string>([
  "DE",
  "FR",
  "ES",
  "IT",
  "CH",
  "AT",
  "NL",
  "BE",
]);

const LOCALES = new Set<string>([
  "fr",
  "en",
  "de",
  "it",
  "es",
]);

const EMAIL_PATTERN =
  /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

const E164_PATTERN = /^\+[1-9]\d{1,14}$/;

const MAX_ITEMS = 100;

const MAX_QUANTITY = 99;

const MAX_EMAIL_ATTEMPTS = 5;

const EMAIL_RETRY_MINUTES = [
  1,
  5,
  15,
  60,
  180,
] as const;

// ============================================================
// 3. UTILITAIRES
// ============================================================

function clean(
  value: string,
  max: number
): string {
  return value.trim().slice(0, max);
}

function requireText(
  value: string,
  field: string,
  max: number
): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.trim().length > max
  ) {
    throw new Error(
      `CHECKOUT_INVALID_${field}`
    );
  }

  return value.trim();
}

function validAmount(
  value: number,
  field: string
): number {
  if (
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    throw new Error(
      `CHECKOUT_INVALID_${field}`
    );
  }

  return value;
}

function validCountry(
  value: string
): value is CheckoutCountryCode {
  return COUNTRIES.has(value);
}

function validLocale(
  value: string
): value is CheckoutLocale {
  return LOCALES.has(value);
}

function getAdminEmail(): string {
  const email =
    process.env.CYCLORIVA_ADMIN_EMAIL
      ?.trim()
      .toLowerCase() ?? "";

  if (
    email.length > 254 ||
    !EMAIL_PATTERN.test(email)
  ) {
    return "";
  }

  return email;
}

function generateOrderNumber(): string {
  const year = new Date().getUTCFullYear();

  const randomPart = randomUUID()
    .replaceAll("-", "")
    .slice(0, 16)
    .toUpperCase();

  return `CY-${year}-${randomPart}`;
}

function isUniqueConstraintError(
  error: unknown
): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

// ============================================================
// 4. VALIDATION DE LA COMMANDE
// ============================================================

function validateCheckoutInput(
  input: CreateCheckoutOrderInput
): CreateCheckoutOrderInput {
  const key = requireText(
    input.idempotencyKey,
    "IDEMPOTENCY_KEY",
    128
  );

  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(key)) {
    throw new Error(
      "CHECKOUT_INVALID_IDEMPOTENCY_KEY"
    );
  }

  if (!validLocale(input.locale)) {
    throw new Error(
      "CHECKOUT_INVALID_LOCALE"
    );
  }

  if (!validCountry(input.delivery.country)) {
    throw new Error(
      "CHECKOUT_COUNTRY_NOT_SUPPORTED"
    );
  }

  if (
    input.detectedCountry &&
    !validCountry(input.detectedCountry)
  ) {
    throw new Error(
      "CHECKOUT_INVALID_DETECTED_COUNTRY"
    );
  }

  const customer = input.customer;

  const delivery = input.delivery;

  const pricing = input.pricing;

  const firstName = requireText(
    customer.firstName,
    "FIRST_NAME",
    100
  );

  const lastName = requireText(
    customer.lastName,
    "LAST_NAME",
    100
  );

  const email = requireText(
    customer.email,
    "EMAIL",
    254
  ).toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    throw new Error(
      "CHECKOUT_INVALID_EMAIL"
    );
  }

  const phoneDialCode = requireText(
    customer.phoneDialCode,
    "PHONE_DIAL_CODE",
    8
  );

  const phoneNational = requireText(
    customer.phoneNational,
    "PHONE",
    40
  );

  const phoneE164 = requireText(
    customer.phoneE164,
    "PHONE_E164",
    20
  );

  if (
    !/^\+[1-9]\d{0,3}$/.test(phoneDialCode) ||
    !E164_PATTERN.test(phoneE164)
  ) {
    throw new Error(
      "CHECKOUT_INVALID_PHONE"
    );
  }

  const city = requireText(
    delivery.city,
    "CITY",
    150
  );

  const postalCode = requireText(
    delivery.postalCode,
    "POSTAL_CODE",
    32
  );

  const addressLine1 = requireText(
    delivery.addressLine1,
    "ADDRESS",
    255
  );

  if (
    delivery.addressLine2 &&
    delivery.addressLine2.trim().length > 255
  ) {
    throw new Error(
      "CHECKOUT_INVALID_ADDRESS_LINE_2"
    );
  }

  if (pricing.currency !== "EUR") {
    throw new Error(
      "CHECKOUT_UNSUPPORTED_CURRENCY"
    );
  }

  if (
    !Array.isArray(pricing.items) ||
    pricing.items.length === 0 ||
    pricing.items.length > MAX_ITEMS
  ) {
    throw new Error(
      "CHECKOUT_INVALID_PRODUCTS"
    );
  }

  const items: CheckoutOrderProduct[] = [];

  const seen = new Set<string>();

  let subtotalCents = 0;

  for (const item of pricing.items) {
    const productId = requireText(
      item.productId,
      "PRODUCT_ID",
      191
    );

    const productName = requireText(
      item.productName,
      "PRODUCT_NAME",
      500
    );

    if (seen.has(productId)) {
      throw new Error(
        "CHECKOUT_DUPLICATE_PRODUCT"
      );
    }

    seen.add(productId);

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_QUANTITY
    ) {
      throw new Error(
        "CHECKOUT_INVALID_QUANTITY"
      );
    }

    validAmount(
      item.unitPriceCents,
      "UNIT_PRICE"
    );

    validAmount(
      item.lineTotalCents,
      "LINE_TOTAL"
    );

    const expectedLineTotal =
      item.unitPriceCents * item.quantity;

    if (
      !Number.isSafeInteger(expectedLineTotal) ||
      expectedLineTotal !== item.lineTotalCents
    ) {
      throw new Error(
        "CHECKOUT_LINE_TOTAL_MISMATCH"
      );
    }

    subtotalCents += expectedLineTotal;

    if (!Number.isSafeInteger(subtotalCents)) {
      throw new Error(
        "CHECKOUT_SUBTOTAL_OVERFLOW"
      );
    }

    items.push({
      productId,
      productName,

      productImage:
        item.productImage
          ? clean(item.productImage, 2048)
          : null,

      sku:
        item.sku
          ? clean(item.sku, 191)
          : null,

      quantity: item.quantity,

      unitPriceCents:
        item.unitPriceCents,

      lineTotalCents:
        item.lineTotalCents,
    });
  }

  validAmount(
    pricing.subtotalCents,
    "SUBTOTAL"
  );

  validAmount(
    pricing.shippingCents,
    "SHIPPING"
  );

  validAmount(
    pricing.totalCents,
    "TOTAL"
  );

  if (
    pricing.taxCents != null
  ) {
    validAmount(
      pricing.taxCents,
      "TAX"
    );
  }

  if (
    subtotalCents !== pricing.subtotalCents
  ) {
    throw new Error(
      "CHECKOUT_SUBTOTAL_MISMATCH"
    );
  }

  /**
   * Convention actuelle :
   *
   * total = produits + livraison
   *
   * Les taxes éventuelles sont déjà comprises
   * dans les prix et ne sont pas ajoutées deux fois.
   */
  const expectedTotal =
    subtotalCents + pricing.shippingCents;

  if (
    !Number.isSafeInteger(expectedTotal) ||
    expectedTotal !== pricing.totalCents
  ) {
    throw new Error(
      "CHECKOUT_TOTAL_MISMATCH"
    );
  }

  return {
    idempotencyKey: key,
    locale: input.locale,

    customer: {
      firstName,
      lastName,
      email,
      phoneDialCode,
      phoneNational,
      phoneE164,
    },

    delivery: {
      country: delivery.country,
      city,
      postalCode,
      addressLine1,
      addressLine2:
        delivery.addressLine2?.trim() || null,
    },

    detectedCountry:
      input.detectedCountry ?? null,

    pricing: {
      currency: "EUR",
      items,
      subtotalCents,
      shippingCents:
        pricing.shippingCents,
      taxCents:
        pricing.taxCents ?? null,
      totalCents:
        pricing.totalCents,
    },
  };
}

// ============================================================
// 5. CONTRÔLE D'UNE COMMANDE DÉJÀ CRÉÉE
// ============================================================
//
// Une clé d'idempotence ne doit pas permettre
// de récupérer la commande d'un autre client.
//
// On compare donc les données significatives
// avant de retourner une commande existante.
//
// ============================================================

function sameExistingOrder(
  existing: {
    firstName: string;
    lastName: string;
    email: string;
    phoneE164: string;
    country: string;
    city: string;
    postalCode: string;
    addressLine1: string;
    addressLine2: string | null;
    locale: string;
    currency: string;
    subtotalCents: number;
    shippingCents: number;
    taxCents: number | null;
    totalCents: number;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitPriceCents: number;
      lineTotalCents: number;
    }>;
  },
  input: CreateCheckoutOrderInput
): boolean {
  const expected = input.pricing.items
    .map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      lineTotalCents: item.lineTotalCents,
    }))
    .sort((a, b) =>
      a.productId.localeCompare(b.productId)
    );

  const actual = existing.items
    .map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      lineTotalCents: item.lineTotalCents,
    }))
    .sort((a, b) =>
      a.productId.localeCompare(b.productId)
    );

  return (
    existing.firstName === input.customer.firstName &&
    existing.lastName === input.customer.lastName &&
    existing.email === input.customer.email &&
    existing.phoneE164 === input.customer.phoneE164 &&
    existing.country === input.delivery.country &&
    existing.city === input.delivery.city &&
    existing.postalCode === input.delivery.postalCode &&
    existing.addressLine1 === input.delivery.addressLine1 &&
    existing.addressLine2 ===
      (input.delivery.addressLine2 ?? null) &&
    existing.locale === input.locale &&
    existing.currency === input.pricing.currency &&
    existing.subtotalCents ===
      input.pricing.subtotalCents &&
    existing.shippingCents ===
      input.pricing.shippingCents &&
    existing.taxCents ===
      (input.pricing.taxCents ?? null) &&
    existing.totalCents ===
      input.pricing.totalCents &&
    JSON.stringify(actual) === JSON.stringify(expected)
  );
}

// ============================================================
// 6. CRÉER LA COMMANDE DANS POSTGRESQL
// ============================================================
//
// Cette fonction attend un client Prisma déjà
// initialisé avec l'adaptateur PostgreSQL.
//
// L'API de commande devra :
//
// 1. Vérifier les données du formulaire
// 2. Lire les véritables produits du catalogue
// 3. Recalculer les prix côté serveur
// 4. Vérifier les conditions de livraison
// 5. Appeler createCheckoutOrder()
//
// ============================================================

export async function createCheckoutOrder(
  db: CheckoutOrderDatabase,
  rawInput: CreateCheckoutOrderInput
): Promise<CheckoutOrderCreateResult> {
  const input = validateCheckoutInput(
    rawInput
  );

  /**
   * Vérifier l'adresse admin avant
   * d'enregistrer la commande.
   */
  const adminEmail = getAdminEmail();

  const existing = await db.checkoutOrder.findUnique({
    where: {
      idempotencyKey:
        input.idempotencyKey,
    },

    include: {
      items: true,
    },
  });

  if (existing) {
    if (!sameExistingOrder(existing, input)) {
      throw new Error(
        "CHECKOUT_IDEMPOTENCY_CONFLICT"
      );
    }

    return {
      orderId: existing.id,
      orderNumber: existing.orderNumber,
      created: false,
      status: existing.status,
      totalCents: existing.totalCents,
      currency: existing.currency,
    };
  }

  const orderNumber = generateOrderNumber();

  try {
    const order = await db.checkoutOrder.create({
      data: {
        orderNumber,

        idempotencyKey:
          input.idempotencyKey,

        // CLIENT
        firstName:
          input.customer.firstName,

        lastName:
          input.customer.lastName,

        email:
          input.customer.email,

        phoneDialCode:
          input.customer.phoneDialCode,

        phoneNational:
          input.customer.phoneNational,

        phoneE164:
          input.customer.phoneE164,

        // LIVRAISON
        country:
          input.delivery.country,

        city:
          input.delivery.city,

        postalCode:
          input.delivery.postalCode,

        addressLine1:
          input.delivery.addressLine1,

        addressLine2:
          input.delivery.addressLine2,

        // LANGUE ET PAYS IP
        locale:
          input.locale,

        detectedCountry:
          input.detectedCountry,

        // MONTANTS
        currency:
          input.pricing.currency,

        subtotalCents:
          input.pricing.subtotalCents,

        shippingCents:
          input.pricing.shippingCents,

        taxCents:
          input.pricing.taxCents,

        totalCents:
          input.pricing.totalCents,

        // STATUTS
        status: "RECEIVED",

        paymentStatus:
          "NOT_REQUESTED",

        // PRODUITS
        items: {
          create: input.pricing.items.map(
            (item) => ({
              productId:
                item.productId,

              productName:
                item.productName,

              productImage:
                item.productImage ?? null,

              sku:
                item.sku ?? null,

              quantity:
                item.quantity,

              unitPriceCents:
                item.unitPriceCents,

              lineTotalCents:
                item.lineTotalCents,

              currency:
                input.pricing.currency,
            })
          ),
        },

        // DEUX NOTIFICATIONS EN ATTENTE
        emailNotifications: {
          create: [
            {
              type: "CUSTOMER_CONFIRMATION",
              recipientEmail:
                input.customer.email,
              locale:
                input.locale,
              status: "PENDING",
              attempts: 0,
            },

            {
              type: "ADMIN_NOTIFICATION",
              recipientEmail:
                adminEmail,
              locale: "fr",
              status: "PENDING",
              attempts: 0,
            },
          ],
        },
      },

      include: {
        items: true,
        emailNotifications: true,
      },
    });

    /**
     * La création imbriquée Prisma enregistre
     * la commande, ses produits et ses deux
     * notifications de façon atomique.
     */

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      created: true,
      status: order.status,
      totalCents: order.totalCents,
      currency: order.currency,
    };
  } catch (error) {
    /**
     * Deux requêtes simultanées peuvent
     * utiliser la même clé d'idempotence.
     *
     * La contrainte UNIQUE en base protège
     * contre la création de deux commandes.
     */
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const existingAfterConflict =
      await db.checkoutOrder.findUnique({
        where: {
          idempotencyKey:
            input.idempotencyKey,
        },

        include: {
          items: true,
        },
      });

    if (!existingAfterConflict) {
      // Le conflit pourrait venir du numéro
      // de commande ou d'une autre contrainte.
      throw error;
    }

    if (
      !sameExistingOrder(
        existingAfterConflict,
        input
      )
    ) {
      throw new Error(
        "CHECKOUT_IDEMPOTENCY_CONFLICT"
      );
    }

    return {
      orderId:
        existingAfterConflict.id,

      orderNumber:
        existingAfterConflict.orderNumber,

      created: false,

      status:
        existingAfterConflict.status,

      totalCents:
        existingAfterConflict.totalCents,

      currency:
        existingAfterConflict.currency,
    };
  }
}

// ============================================================
// 7. LIRE UNE COMMANDE EN BASE
// ============================================================
//
// À utiliser uniquement dans un contexte serveur
// autorisé : administration ou traitement interne.
//
// Ne pas exposer une commande au public uniquement
// parce qu'il connaît son identifiant.
//
// ============================================================

export async function getCheckoutOrderById(
  db: CheckoutOrderDatabase,
  orderId: string
) {
  if (
    typeof orderId !== "string" ||
    !orderId.trim()
  ) {
    return null;
  }

  return db.checkoutOrder.findUnique({
    where: {
      id: orderId,
    },

    include: {
      items: true,
      emailNotifications: true,
    },
  });
}

// ============================================================
// 8. LIRE UNE COMMANDE PAR SON NUMÉRO
// ============================================================

export async function getCheckoutOrderByNumber(
  db: CheckoutOrderDatabase,
  orderNumber: string
) {
  if (
    typeof orderNumber !== "string" ||
    !orderNumber.trim()
  ) {
    return null;
  }

  return db.checkoutOrder.findUnique({
    where: {
      orderNumber:
        orderNumber.trim(),
    },

    include: {
      items: true,
      emailNotifications: true,
    },
  });
}

// ============================================================
// 9. PRÉPARER LES DONNÉES POUR RESEND
// ============================================================

function toEmailOrder(
  order: NonNullable<
    Awaited<
      ReturnType<typeof getCheckoutOrderById>
    >
  >
): CheckoutEmailOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,

    firstName: order.firstName,
    lastName: order.lastName,

    email: order.email,

    phoneDialCode:
      order.phoneDialCode,

    phoneNational:
      order.phoneNational,

    phoneE164:
      order.phoneE164,

    country: order.country,

    city: order.city,
    postalCode: order.postalCode,

    addressLine1:
      order.addressLine1,

    addressLine2:
      order.addressLine2,

    locale: order.locale,

    currency: order.currency,

    subtotalCents:
      order.subtotalCents,

    shippingCents:
      order.shippingCents,

    taxCents:
      order.taxCents,

    totalCents:
      order.totalCents,

    status: order.status,

    paymentStatus:
      order.paymentStatus,

    createdAt:
      order.createdAt,

    items: order.items.map(
      (item) => ({
        productId: item.productId,

        productName:
          item.productName,

        sku:
          item.sku,

        quantity:
          item.quantity,

        unitPriceCents:
          item.unitPriceCents,

        lineTotalCents:
          item.lineTotalCents,

        currency:
          item.currency,
      })
    ),
  };
}

// ============================================================
// 10. CALCUL DU PROCHAIN ESSAI D'E-MAIL
// ============================================================

function nextEmailAttempt(
  attempts: number
): Date {
  const index = Math.min(
    Math.max(0, attempts - 1),
    EMAIL_RETRY_MINUTES.length - 1
  );

  const minutes =
    EMAIL_RETRY_MINUTES[index];

  return new Date(
    Date.now() + minutes * 60_000
  );
}

// ============================================================
// 11. TRAITER LES NOTIFICATIONS RESEND
// ============================================================
//
// Fonction interne :
// - Recherche une notification en attente
// - La revendique de manière atomique
// - Appelle Resend
// - Enregistre l'identifiant de message
// - Conserve les erreurs et planifie une reprise
//
// Une notification SENT n'est pas renvoyée.
//
// IMPORTANT :
//
// Cette fonction doit être appelée par une route
// serveur protégée ou un worker autorisé.
//
// Il ne faut jamais laisser le navigateur
// déclencher directement un envoi arbitraire.
//
// ============================================================

export async function processCheckoutOrderEmails(
  db: CheckoutOrderDatabase,
  orderId: string
): Promise<CheckoutEmailProcessingResult> {
  await db.checkoutEmailNotification.updateMany({ where:{orderId,status:"PROCESSING",updatedAt:{lt:new Date(Date.now()-5*60*1000)}},data:{status:"FAILED",nextAttemptAt:new Date()} });
  const order = await getCheckoutOrderById(
    db,
    orderId
  );

  if (!order) {
    throw new Error(
      "CHECKOUT_ORDER_NOT_FOUND"
    );
  }

  const emailOrder = toEmailOrder(order);

  const results: CheckoutNotificationResult[] = [];

  const types = [
    "CUSTOMER_CONFIRMATION",
    "ADMIN_NOTIFICATION",
  ] as const;

  for (const type of types) {
    const notification =
      order.emailNotifications.find(
        (item) => item.type === type
      );

    if (!notification) {
      results.push({
        type,
        success: false,
        skipped: true,
        error: "NOTIFICATION_NOT_FOUND",
      });

      continue;
    }

    if (notification.status === "SENT") {
      results.push({
        type,
        success: true,
        skipped: true,
      });

      continue;
    }

    const configuration = getCheckoutEmailConfiguration();
    if (!configuration.senderConfigured || (type === "ADMIN_NOTIFICATION" && !configuration.adminConfigured)) {
      results.push({ type, success: false, skipped: true, error: "EMAIL_NOT_CONFIGURED" });
      continue;
    }

    if (
      notification.attempts >=
      MAX_EMAIL_ATTEMPTS
    ) {
      results.push({
        type,
        success: false,
        skipped: true,
        error: "MAX_ATTEMPTS_REACHED",
      });

      continue;
    }

    if (
      notification.nextAttemptAt &&
      notification.nextAttemptAt >
        new Date()
    ) {
      results.push({
        type,
        success: false,
        skipped: true,
        error: "RETRY_NOT_DUE",
      });

      continue;
    }

    if (
      notification.status !== "PENDING" &&
      notification.status !== "FAILED"
    ) {
      results.push({
        type,
        success: false,
        skipped: true,
        error: "NOTIFICATION_IN_PROGRESS",
      });

      continue;
    }

    // -------------------------------------------------------
    // REVENDICATION ATOMIQUE
    // -------------------------------------------------------

    const claimed =
      await db.checkoutEmailNotification.updateMany({
        where: {
          id: notification.id,

          status: {
            in: ["PENDING", "FAILED"],
          },

          attempts: {
            lt: MAX_EMAIL_ATTEMPTS,
          },

          OR: [
            {
              nextAttemptAt: null,
            },
            {
              nextAttemptAt: {
                lte: new Date(),
              },
            },
          ],
        },

        data: {
          status: "PROCESSING",

          attempts: {
            increment: 1,
          },

          nextAttemptAt: null,

          lastError: null,
        },
      });

    if (claimed.count !== 1) {
      results.push({
        type,
        success: false,
        skipped: true,
        error: "NOTIFICATION_ALREADY_CLAIMED",
      });

      continue;
    }

    // -------------------------------------------------------
    // ENVOI RESEND
    // -------------------------------------------------------

    try {
      const sent =
        type === "CUSTOMER_CONFIRMATION"
          ? await sendCustomerOrderEmail(
              emailOrder
            )
          : await sendAdminOrderEmail(
              emailOrder
            );

      // -----------------------------------------------------
      // SUCCÈS
      // -----------------------------------------------------

      await db.checkoutEmailNotification.update({
        where: {
          id: notification.id,
        },

        data: {
          status: "SENT",
          recipientEmail: sent.recipientEmail,

          sentAt: new Date(),

          providerMessageId:
            sent.providerMessageId,

          lastError: null,

          nextAttemptAt: null,
        },
      });

      results.push({
        type,
        success: true,
        skipped: false,
      });
    } catch (error) {
      // -----------------------------------------------------
      // ÉCHEC : CONSERVER LA NOTIFICATION
      // -----------------------------------------------------

      const message =
        error instanceof Error
          ? error.message
          : "EMAIL_SEND_FAILED";

      const attempts =
        notification.attempts + 1;

      const nextAttemptAt =
        attempts >= MAX_EMAIL_ATTEMPTS
          ? null
          : nextEmailAttempt(attempts);

      await db.checkoutEmailNotification.update({
        where: {
          id: notification.id,
        },

        data: {
          status: "FAILED",

          lastError: message.slice(0, 2000),

          nextAttemptAt,
        },
      });

      results.push({
        type,
        success: false,
        skipped: false,
        error: message,
      });
    }
  }

  return {
    orderId: order.id,
    results,
  };
}

// ============================================================
// 12. RÉCUPÉRER LES COMMANDES RÉCENTES
// ============================================================
//
// Usage : espace administrateur uniquement.
//
// ============================================================

export async function getRecentCheckoutOrders(
  db: CheckoutOrderDatabase,
  limit = 20
) {
  const take = Math.max(
    1,
    Math.min(
      100,
      Math.trunc(limit) || 20
    )
  );

  return db.checkoutOrder.findMany({
    take,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      items: true,
      emailNotifications: true,
    },
  });
}

// ============================================================
// 13. STATISTIQUES DES COMMANDES
// ============================================================
//
// Retourne les informations réelles de la base.
//
// Le chiffre d'affaires encaissé doit être calculé
// séparément à partir des paiements confirmés.
//
// ============================================================

export async function getCheckoutOrderStats(
  db: CheckoutOrderDatabase
) {
  const [
    totalOrders,
    receivedOrders,
    confirmedOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
  ] = await Promise.all([
    db.checkoutOrder.count(),

    db.checkoutOrder.count({
      where: {
        status: "RECEIVED",
      },
    }),

    db.checkoutOrder.count({
      where: {
        status: "CONFIRMED",
      },
    }),

    db.checkoutOrder.count({
      where: {
        status: "PROCESSING",
      },
    }),

    db.checkoutOrder.count({
      where: {
        status: "SHIPPED",
      },
    }),

    db.checkoutOrder.count({
      where: {
        status: "DELIVERED",
      },
    }),

    db.checkoutOrder.count({
      where: {
        status: "CANCELLED",
      },
    }),
  ]);

  return {
    totalOrders,
    receivedOrders,
    confirmedOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
  };
}

// ============================================================
// FIN — CYCLORIVA CHECKOUT ORDERS
// ============================================================
