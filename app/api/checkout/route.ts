import { allowCheckoutRequest } from "@/lib/checkout-rate-limit";

import "server-only";

import {
  NextRequest,
  NextResponse,
} from "next/server";
import { after } from "next/server";
import { createConfirmationCookie, CONFIRMATION_COOKIE, CONFIRMATION_MAX_AGE } from "@/lib/checkout-confirmation";
import { prisma } from "@/lib/prisma";

import {
  safeValidateCheckout,
  buildValidatedOrderInput,
  type CheckoutValidationFieldError,
} from "@/lib/checkout-validation";

import {
  calculateCheckoutPricing,
  CheckoutPricingError,
  type CheckoutPricingErrorCode,
} from "@/lib/checkout-pricing";

import {
  createCheckoutOrder,
  processCheckoutOrderEmails,
} from "@/lib/checkout-orders";

import {
  detectCheckoutGeoFromRequest,
} from "@/lib/checkout-geo";

/**
 * ============================================================
 * CYCLORIVA — API OFFICIELLE DE COMMANDE
 * ============================================================
 *
 * Fichier :
 * app/api/checkout/route.ts
 *
 * TECHNOLOGIES :
 * - Next.js 16
 * - TypeScript
 * - Prisma ORM 7
 * - PostgreSQL / Supabase
 * - Resend
 *
 * MÉTHODE :
 * POST /api/checkout
 *
 * RESPONSABILITÉS :
 *
 * 1. Accepter uniquement les requêtes JSON.
 * 2. Contrôler l'origine de la requête.
 * 3. Limiter la taille du corps de requête.
 * 4. Valider les coordonnées du client.
 * 5. Vérifier les huit pays de livraison.
 * 6. Valider le numéro de téléphone.
 * 7. Vérifier le panier.
 * 8. Recalculer les prix côté serveur.
 * 9. Calculer les frais de livraison.
 * 10. Enregistrer la commande avec Prisma.
 * 11. Éviter les commandes en double.
 * 12. Préparer les deux e-mails Resend.
 * 13. Déclencher le traitement des notifications.
 * 14. Renvoyer une confirmation structurée.
 *
 * SÉCURITÉ :
 *
 * - Aucun prix client n'est accepté.
 * - Aucun total client n'est accepté.
 * - Aucun paiement fictif.
 * - Aucun compte client obligatoire.
 * - Aucun secret transmis au navigateur.
 * - Aucune adresse IP brute stockée ici.
 * - Aucune information personnelle dans les logs.
 *
 * ============================================================
 */

// ============================================================
// 1. CONFIGURATION NEXT.JS
// ============================================================




// ============================================================
// 2. CONSTANTES
// ============================================================

const MAX_REQUEST_BYTES = 64 * 1024;

const JSON_CONTENT_TYPE =
  "application/json";

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
} as const;

// ============================================================
// 3. TYPES DE RÉPONSE
// ============================================================

type CheckoutApiSuccess = {
  success: true;

  order: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: "NOT_REQUESTED";
    totalCents: number;
    currency: string;
  };

  created: boolean;

  redirectUrl: string;
};

type CheckoutApiFailure = {
  success: false;
  code: string;
  errors?: CheckoutValidationFieldError[];
};

type CheckoutApiResponse =
  | CheckoutApiSuccess
  | CheckoutApiFailure;

// ============================================================
// 4. CONSTRUIRE UNE RÉPONSE JSON
// ============================================================

function jsonResponse(
  data: CheckoutApiResponse,
  status: number
) {
  return NextResponse.json(
    data,
    {
      status,
      headers: RESPONSE_HEADERS,
    }
  );
}

// ============================================================
// 5. RÉPONSE D'ERREUR
// ============================================================

function errorResponse(
  code: string,
  status: number,
  errors?: CheckoutValidationFieldError[]
) {
  return jsonResponse(
    {
      success: false,
      code,
      ...(errors ? { errors } : {}),
    },
    status
  );
}

// ============================================================
// 6. VÉRIFIER L'ORIGINE
// ============================================================
//
// Le formulaire est hébergé sur le même
// site que l'API.
//
// Une origine différente est refusée.
//
// La vérification d'origine n'est pas
// un mécanisme de limitation du spam.
//
// ============================================================

function hasValidOrigin(
  request: NextRequest
): boolean {
  const origin =
    request.headers.get("origin");

  if (!origin) {
    // Les navigateurs envoient normalement
    // Origin pour un POST JSON.
    //
    // Pour l'API publique de commande,
    // nous exigeons cet en-tête.
    return false;
  }

  try {
    const requestOrigin =
      new URL(origin).origin;

    return (
      requestOrigin ===
      request.nextUrl.origin
    );
  } catch {
    return false;
  }
}

// ============================================================
// 7. VÉRIFIER LE TYPE DE CONTENU
// ============================================================

function hasJsonContentType(
  request: NextRequest
): boolean {
  const contentType =
    request.headers
      .get("content-type")
      ?.split(";")[0]
      .trim()
      .toLowerCase();

  return (
    contentType === JSON_CONTENT_TYPE
  );
}

// ============================================================
// 8. LIRE LE CORPS JSON
// ============================================================
//
// Lecture bornée : on refuse les corps
// excessivement volumineux.
//
// Content-Length est consulté comme
// vérification préliminaire.
//
// La limite réelle est appliquée pendant
// la lecture du flux.
//
// ============================================================

class CheckoutRequestBodyError
  extends Error {
  constructor(
    readonly code: string,
    readonly status: number
  ) {
    super(code);

    this.name =
      "CheckoutRequestBodyError";
  }
}

async function readCheckoutJson(
  request: NextRequest
): Promise<unknown> {
  const declaredLength =
    request.headers.get("content-length");

  if (declaredLength) {
    const value = Number(declaredLength);

    if (
      !Number.isSafeInteger(value) ||
      value < 0
    ) {
      throw new CheckoutRequestBodyError(
        "INVALID_CONTENT_LENGTH",
        400
      );
    }

    if (value > MAX_REQUEST_BYTES) {
      throw new CheckoutRequestBodyError(
        "REQUEST_TOO_LARGE",
        413
      );
    }
  }

  if (!request.body) {
    throw new CheckoutRequestBodyError(
      "EMPTY_REQUEST_BODY",
      400
    );
  }

  const reader = request.body.getReader();

  const chunks: Uint8Array[] = [];

  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } =
        await reader.read();

      if (done) {
        break;
      }

      totalBytes += value.byteLength;

      if (
        totalBytes > MAX_REQUEST_BYTES
      ) {
        await reader.cancel().catch(
          () => undefined
        );

        throw new CheckoutRequestBodyError(
          "REQUEST_TOO_LARGE",
          413
        );
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  if (totalBytes === 0) {
    throw new CheckoutRequestBodyError(
      "EMPTY_REQUEST_BODY",
      400
    );
  }

  const buffer = new Uint8Array(
    totalBytes
  );

  let offset = 0;

  for (const chunk of chunks) {
    buffer.set(chunk, offset);

    offset += chunk.byteLength;
  }

  let text: string;

  try {
    text = new TextDecoder(
      "utf-8",
      { fatal: true }
    ).decode(buffer);
  } catch {
    throw new CheckoutRequestBodyError(
      "INVALID_UTF8",
      400
    );
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new CheckoutRequestBodyError(
      "INVALID_JSON",
      400
    );
  }
}

// ============================================================
// 9. CLASSIFICATION DES ERREURS DE PRIX
// ============================================================
//
// Le navigateur reçoit seulement un code
// exploitable par checkout-i18n.ts.
//
// Aucune exception brute ne doit révéler
// des informations de la base de données.
//
// ============================================================

function pricingErrorStatus(
  code: CheckoutPricingErrorCode
): number {
  switch (code) {
    case "INVALID_COUNTRY":
    case "EMPTY_CART":
    case "TOO_MANY_PRODUCTS":
    case "INVALID_PRODUCT_ID":
    case "DUPLICATE_PRODUCT":
    case "UNSUPPORTED_VARIANT":
    case "INVALID_QUANTITY":
      return 422;

    case "PRODUCT_NOT_FOUND":
    case "PRODUCT_NOT_PURCHASABLE":
    case "PRODUCT_PRICE_UNAVAILABLE":
    case "PRODUCT_CURRENCY_UNSUPPORTED":
      return 409;

    case "SHIPPING_NOT_CONFIGURED":
      return 503;

    case "INVALID_SHIPPING":
    case "INVALID_PRICE_FORMAT":
    case "INVALID_AMOUNT":
    case "AMOUNT_OVERFLOW":
      return 422;

    default:
      return 422;
  }
}

// ============================================================
// 10. RECONNAÎTRE LES ERREURS DE COMMANDE
// ============================================================

function checkoutOrderErrorCode(
  error: unknown
): string | null {
  if (!(error instanceof Error)) {
    return null;
  }

  if (
    error.message ===
    "CHECKOUT_IDEMPOTENCY_CONFLICT"
  ) {
    return error.message;
  }

  if (
    error.message.startsWith(
      "CHECKOUT_INVALID_"
    ) ||
    error.message ===
      "CHECKOUT_COUNTRY_NOT_SUPPORTED" ||
    error.message ===
      "CHECKOUT_UNSUPPORTED_CURRENCY" ||
    error.message ===
      "CHECKOUT_DUPLICATE_PRODUCT" ||
    error.message ===
      "CHECKOUT_INVALID_PRODUCTS" ||
    error.message ===
      "CHECKOUT_LINE_TOTAL_MISMATCH" ||
    error.message ===
      "CHECKOUT_SUBTOTAL_MISMATCH" ||
    error.message ===
      "CHECKOUT_TOTAL_MISMATCH"
  ) {
    return "CHECKOUT_VALIDATION_FAILED";
  }

  return null;
}

// ============================================================
// 11. ENVOYER LES NOTIFICATIONS APRÈS CRÉATION
// ============================================================
//
// La commande est déjà enregistrée.
//
// Si Resend ou le suivi e-mail échoue,
// la commande n'est pas supprimée.
//
// Les notifications restent enregistrées
// en base pour permettre des reprises.
//
// ============================================================

async function attemptOrderEmails(
  orderId: string
): Promise<void> {
  try {
    await processCheckoutOrderEmails(
      prisma,
      orderId
    );
  } catch {
    /**
     * Ne jamais faire échouer une commande
     * déjà enregistrée pour une erreur
     * temporaire d'e-mail.
     *
     * Le traitement de reprise des
     * notifications sera assuré par
     * un worker / job serveur protégé.
     */
  }
}

// ============================================================
// 12. ROUTE POST /api/checkout
// ============================================================

export async function POST(
  request: NextRequest
) {
  // ---------------------------------------------------------
  // ÉTAPE 1 : VÉRIFIER L'ORIGINE
  // ---------------------------------------------------------

  if (!hasValidOrigin(request)) {
    return errorResponse(
      "FORBIDDEN_ORIGIN",
      403
    );
  }

  // ---------------------------------------------------------
  // ÉTAPE 2 : VÉRIFIER LE FORMAT
  // ---------------------------------------------------------

  if (!hasJsonContentType(request)) {
    return errorResponse(
      "UNSUPPORTED_CONTENT_TYPE",
      415
    );
  }

  // ---------------------------------------------------------
  // ÉTAPE 3 : LIRE ET LIMITER LE CORPS
  // ---------------------------------------------------------

  if (!allowCheckoutRequest(request,"order")) return errorResponse("TOO_MANY_REQUESTS",429);
  let requestBody: unknown;

  try {
    requestBody =
      await readCheckoutJson(request);
  } catch (error) {
    if (
      error instanceof
      CheckoutRequestBodyError
    ) {
      return errorResponse(
        error.code,
        error.status
      );
    }

    return errorResponse(
      "INVALID_REQUEST_BODY",
      400
    );
  }

  // ---------------------------------------------------------
  // ÉTAPE 4 : VALIDER LE FORMULAIRE
  // ---------------------------------------------------------

  const validation =
    safeValidateCheckout(
      requestBody
    );

  if (!validation.success) {
    return errorResponse(
      "CHECKOUT_VALIDATION_FAILED",
      422,
      validation.errors
    );
  }

  const validated = validation.data;
  try { createConfirmationCookie("configuration-check"); } catch { return errorResponse("SERVER_ERROR", 503); }

  // ---------------------------------------------------------
  // ÉTAPE 5 : DÉTECTER LE PAYS APPROXIMATIF
  // ---------------------------------------------------------
  //
  // Le pays détecté vient uniquement
  // des en-têtes vérifiés par checkout-geo.
  //
  // Le pays choisi dans le formulaire
  // reste la destination officielle.
  //
  // ---------------------------------------------------------

  const geo =
    detectCheckoutGeoFromRequest(
      request,
      validated.locale
    );

  const detectedCountry =
    geo.detectedCountry;

  // ---------------------------------------------------------
  // ÉTAPE 6 : RECALCULER LES PRIX
  // ---------------------------------------------------------
  //
  // Ne jamais utiliser de montant client.
  //
  // Le calcul lit le catalogue réel
  // et les tarifs de livraison serveur.
  //
  // ---------------------------------------------------------

  let pricing: Awaited<
    ReturnType<typeof calculateCheckoutPricing>
  >;

  try {
    pricing =
      await calculateCheckoutPricing({
        country:
          validated.delivery.country,

        items:
          validated.cartItems,
      });
  } catch (error) {
    if (
      error instanceof
      CheckoutPricingError
    ) {
      return errorResponse(
        error.code,
        pricingErrorStatus(error.code)
      );
    }

    return errorResponse(
      "CHECKOUT_PRICING_FAILED",
      500
    );
  }

  // ---------------------------------------------------------
  // ÉTAPE 7 : CONSTRUIRE LES DONNÉES OFFICIELLES
  // ---------------------------------------------------------

  if (validated.expectedTotalCents !== undefined && validated.expectedTotalCents !== pricing.totalCents) return errorResponse("PRICE_CHANGED", 409);

  const orderInput =
    buildValidatedOrderInput(
      validated,
      {
        detectedCountry,
      }
    );

  // ---------------------------------------------------------
  // ÉTAPE 8 : ENREGISTRER LA COMMANDE
  // ---------------------------------------------------------

  let order: Awaited<
    ReturnType<typeof createCheckoutOrder>
  >;

  try {
    order = await createCheckoutOrder(
      prisma,
      {
        ...orderInput,
        pricing,
      }
    );
  } catch (error) {
    const knownError =
      checkoutOrderErrorCode(
        error
      );

    if (
      knownError ===
      "CHECKOUT_IDEMPOTENCY_CONFLICT"
    ) {
      return errorResponse(
        knownError,
        409
      );
    }

    if (knownError) {
      return errorResponse(
        knownError,
        422
      );
    }

    return errorResponse(
      "CHECKOUT_ORDER_SAVE_FAILED",
      500
    );
  }

  // ---------------------------------------------------------
  // ÉTAPE 9 : TRAITEMENT DES DEUX E-MAILS
  // ---------------------------------------------------------
  //
  // Les notifications sont déjà en base.
  //
  // Une erreur de Resend ne doit jamais
  // annuler une commande enregistrée.
  //
  // Pour les commandes rejouées, un worker
  // dédié assure les éventuelles reprises.
  //
  // ---------------------------------------------------------

  after(() => attemptOrderEmails(order.orderId));

  // ---------------------------------------------------------
  // ÉTAPE 10 : URL DE CONFIRMATION
  // ---------------------------------------------------------

  const redirectUrl =
    `/${validated.locale}` +
    `/commande/confirmation/` +
    encodeURIComponent(order.orderId);

  // ---------------------------------------------------------
  // ÉTAPE 11 : RÉPONSE OFFICIELLE
  // ---------------------------------------------------------
  //
  // On ne transmet :
  // - ni l'adresse du client
  // - ni son téléphone
  // - ni ses informations de paiement
  // - ni les détails internes des e-mails
  //
  // Le montant provient de la base.
  //
  // ---------------------------------------------------------

  const response = jsonResponse(
    {
      success: true,

      order: {
        id: order.orderId,

        orderNumber:
          order.orderNumber,

        status:
          order.status,

        paymentStatus:
          "NOT_REQUESTED",

        totalCents:
          order.totalCents,

        currency:
          order.currency,
      },

      created:
        order.created,

      redirectUrl,
    },

    order.created ? 201 : 200
  );
  response.cookies.set(CONFIRMATION_COOKIE, createConfirmationCookie(order.orderId), { httpOnly:true, sameSite:"lax", secure:request.nextUrl.protocol === "https:", path:"/", maxAge:CONFIRMATION_MAX_AGE });
  return response;
}

// ============================================================
// 13. AUTRES MÉTHODES HTTP
// ============================================================
//
// La création de commande se fait uniquement
// par POST.
//
// Les lectures de commandes ne doivent
// pas être exposées publiquement sans
// authentification / autorisation.
//
// ============================================================

export async function GET() {
  return errorResponse(
    "METHOD_NOT_ALLOWED",
    405
  );
}

// ============================================================
// FIN — CYCLORIVA CHECKOUT API
// ============================================================
