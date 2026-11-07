
import { z } from "zod";

import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/max";

import {
  CHECKOUT_COUNTRIES,
  getCheckoutDialCode,
  isCheckoutCountry,
  normalizeCheckoutPostalCode,
  validateCheckoutPostalCode,
  type CheckoutCountryCode,
} from "@/lib/checkout-countries";

import type {
  CheckoutCustomerDetails,
  CheckoutDeliveryDetails,
  CheckoutLocale,
  CreateCheckoutOrderInput,
} from "@/lib/checkout-orders";

import type {
  CheckoutPricingCartItem,
} from "@/lib/checkout-pricing";

/**
 * ============================================================
 * CYCLORIVA — VALIDATION DES COMMANDES
 * ============================================================
 *
 * Fichier : lib/checkout-validation.ts
 *
 * Compatible :
 * - Next.js 16
 * - TypeScript
 * - Zod
 * - libphonenumber-js
 * - Prisma 7
 *
 * RESPONSABILITÉS :
 *
 * 1. Valider le prénom et le nom.
 * 2. Valider l'adresse e-mail.
 * 3. Valider les numéros internationaux.
 * 4. Normaliser le téléphone au format E.164.
 * 5. Valider les huit pays de livraison.
 * 6. Valider la ville et l'adresse.
 * 7. Vérifier le format du code postal.
 * 8. Valider les produits et les quantités.
 * 9. Empêcher les lignes de panier dupliquées.
 * 10. Valider la clé d'idempotence.
 * 11. Préparer les données pour checkout-orders.
 *
 * SÉCURITÉ :
 *
 * - Aucun prix client n'est accepté.
 * - Aucun total client n'est accepté.
 * - Aucun montant de livraison client n'est accepté.
 * - Aucun statut de paiement client n'est accepté.
 * - Le pays IP doit provenir du serveur.
 * - Les erreurs ne contiennent pas les coordonnées.
 * - Aucun appel à Prisma ou Resend dans ce fichier.
 *
 * ============================================================
 */

// ============================================================
// 1. CONSTANTES
// ============================================================

export const CHECKOUT_VALIDATION_LIMITS = {
  firstName: 100,
  lastName: 100,
  email: 254,
  phone: 40,
  city: 150,
  postalCode: 32,
  addressLine1: 255,
  addressLine2: 255,
  productId: 191,
  idempotencyKey: 128,
  maxCartLines: 100,
  maxQuantity: 99,
} as const;

export const CHECKOUT_LANGUAGES = [
  "fr",
  "en",
  "de",
  "it",
  "es",
] as const;

const COUNTRY_CODES = CHECKOUT_COUNTRIES;

const EMAIL_PATTERN =
  /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

const IDEMPOTENCY_PATTERN =
  /^[A-Za-z0-9_-]{16,128}$/;

const CONTROL_CHARACTERS =
  /[\u0000-\u001F\u007F]/;

// ============================================================
// 2. TYPES
// ============================================================

export type CheckoutValidationFieldError = {
  field: string;
  code: string;
  message: string;
};

export type CheckoutValidatedData = {
  expectedTotalCents?: number;
  idempotencyKey: string;

  locale: CheckoutLocale;

  customer: CheckoutCustomerDetails;

  delivery: CheckoutDeliveryDetails;

  cartItems: CheckoutPricingCartItem[];
};

export type CheckoutValidationSuccess = {
  success: true;
  data: CheckoutValidatedData;
};

export type CheckoutValidationFailure = {
  success: false;
  errors: CheckoutValidationFieldError[];
};

export type CheckoutValidationResult =
  | CheckoutValidationSuccess
  | CheckoutValidationFailure;

export type CheckoutValidationOptions = {
  /**
   * Pays IP déterminé sur le serveur.
   *
   * Ne doit jamais être repris directement
   * du corps JSON envoyé par le client.
   */
  detectedCountry?: CheckoutCountryCode | null;
};

export type CheckoutValidatedOrderInput =
  Omit<
    CreateCheckoutOrderInput,
    "pricing"
  >;

// ============================================================
// 3. OUTILS DE NORMALISATION
// ============================================================

function normalizeSpaces(
  value: string
): string {
  return value
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeEmail(
  value: string
): string {
  return value.trim().toLowerCase();
}

function normalizePhoneText(
  value: string
): string {
  return value.trim();
}

function hasControlCharacters(
  value: string
): boolean {
  return CONTROL_CHARACTERS.test(value);
}

// ============================================================
// 4. SCHÉMA DES CHAMPS TEXTUELS
// ============================================================

function requiredText(
  maximum: number,
  minimum = 1
) {
  return z
    .string()
    .transform(normalizeSpaces)
    .pipe(
      z
        .string()
        .min(
          minimum,
          "REQUIRED_OR_TOO_SHORT"
        )
        .max(
          maximum,
          "TEXT_TOO_LONG"
        )
        .refine(
          (value) =>
            !hasControlCharacters(value),
          "INVALID_CHARACTERS"
        )
    );
}

function optionalText(
  maximum: number
) {
  return z
    .string()
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) {
        return null;
      }

      const normalized =
        normalizeSpaces(value);

      return normalized || null;
    })
    .pipe(
      z
        .string()
        .max(
          maximum,
          "TEXT_TOO_LONG"
        )
        .refine(
          (value) =>
            !hasControlCharacters(value),
          "INVALID_CHARACTERS"
        )
        .nullable()
    );
}

// ============================================================
// 5. SCHÉMA DES PAYS ET LANGUES
// ============================================================

export const checkoutCountrySchema =
  z.enum(COUNTRY_CODES);

export const checkoutLocaleSchema =
  z.enum(CHECKOUT_LANGUAGES);

// ============================================================
// 6. SCHÉMA DES INFORMATIONS PERSONNELLES
// ============================================================
//
// phoneCountry correspond au pays du numéro.
//
// Il peut être différent du pays de livraison.
//
// Exemple :
// Livraison : DE
// Téléphone : FR (+33)
//
// ============================================================

export const checkoutCustomerSchema =
  z
    .object({
      firstName:
        requiredText(
          CHECKOUT_VALIDATION_LIMITS.firstName,
          2
        ),

      lastName:
        requiredText(
          CHECKOUT_VALIDATION_LIMITS.lastName,
          2
        ),

      email: z
        .string()
        .transform(normalizeEmail)
        .pipe(
          z
            .string()
            .min(1, "EMAIL_REQUIRED")
            .max(
              CHECKOUT_VALIDATION_LIMITS.email,
              "EMAIL_TOO_LONG"
            )
            .regex(
              EMAIL_PATTERN,
              "INVALID_EMAIL"
            )
            .email("INVALID_EMAIL")
        ),

      phoneCountry:
        checkoutCountrySchema,

      phoneNational: z
        .string()
        .transform(normalizePhoneText)
        .pipe(
          z
            .string()
            .min(1, "PHONE_REQUIRED")
            .max(
              CHECKOUT_VALIDATION_LIMITS.phone,
              "PHONE_TOO_LONG"
            )
        ),
    })
    .strict();

// ============================================================
// 7. SCHÉMA DE L'ADRESSE DE LIVRAISON
// ============================================================

export const checkoutDeliverySchema =
  z
    .object({
      country:
        checkoutCountrySchema,

      city:
        requiredText(
          CHECKOUT_VALIDATION_LIMITS.city,
          2
        ),

      postalCode:
        requiredText(
          CHECKOUT_VALIDATION_LIMITS.postalCode
        ),

      addressLine1:
        requiredText(
          CHECKOUT_VALIDATION_LIMITS.addressLine1,
          3
        ),

      addressLine2:
        optionalText(
          CHECKOUT_VALIDATION_LIMITS.addressLine2
        ),
    })
    .strict()
    .superRefine(
      (delivery, context) => {
        const postalCode =
          validateCheckoutPostalCode(
            delivery.postalCode,
            delivery.country
          );

        if (!postalCode.valid) {
          context.addIssue({
            code: "custom",
            path: ["postalCode"],
            message:
              postalCode.error === "REQUIRED"
                ? "POSTAL_CODE_REQUIRED"
                : "INVALID_POSTAL_CODE",
          });
        }
      }
    );

// ============================================================
// 8. SCHÉMA D'UNE LIGNE DU PANIER
// ============================================================
//
// Aucun prix n'est envoyé au serveur
// comme donnée de confiance.
//
// Le panier indique uniquement :
// - productId
// - quantity
// - variantId éventuel
//
// ============================================================

export const checkoutCartItemSchema =
  z
    .object({
      productId: z
        .string()
        .trim()
        .min(
          1,
          "PRODUCT_ID_REQUIRED"
        )
        .max(
          CHECKOUT_VALIDATION_LIMITS.productId,
          "PRODUCT_ID_TOO_LONG"
        )
        .refine(
          (value) =>
            !hasControlCharacters(value),
          "INVALID_PRODUCT_ID"
        ),

      quantity:
        z
          .number()
          .int("INVALID_QUANTITY")
          .min(
            1,
            "INVALID_QUANTITY"
          )
          .max(
            CHECKOUT_VALIDATION_LIMITS.maxQuantity,
            "QUANTITY_TOO_HIGH"
          ),

      /**
       * Pour le moment, le moteur de calcul
       * refuse les variantes non prises
       * en charge par le schéma Prisma.
       */
      variantId: z
        .string()
        .trim()
        .max(
          191,
          "VARIANT_ID_TOO_LONG"
        )
        .nullable()
        .optional(),
    })
    .strict()
    .superRefine(
      (item, context) => {
        if (
          item.variantId !== null &&
          item.variantId !== undefined &&
          item.variantId !== ""
        ) {
          context.addIssue({
            code: "custom",
            path: ["variantId"],
            message: "UNSUPPORTED_VARIANT",
          });
        }
      }
    );

// ============================================================
// 9. SCHÉMA DU PANIER COMPLET
// ============================================================

export const checkoutCartSchema =
  z
    .array(checkoutCartItemSchema)
    .min(1, "CART_EMPTY")
    .max(
      CHECKOUT_VALIDATION_LIMITS.maxCartLines,
      "TOO_MANY_PRODUCTS"
    )
    .superRefine(
      (items, context) => {
        const seen = new Set<string>();

        items.forEach((item, index) => {
          if (seen.has(item.productId)) {
            context.addIssue({
              code: "custom",
              path: [
                index,
                "productId",
              ],
              message: "DUPLICATE_PRODUCT",
            });
          }

          seen.add(item.productId);
        });
      }
    );

// ============================================================
// 10. CLÉ D'IDEMPOTENCE
// ============================================================
//
// Le navigateur doit créer une clé
// pour chaque tentative de commande.
//
// La même clé est conservée en cas
// de nouvelle tentative réseau.
//
// Le schéma Prisma possède une contrainte
// UNIQUE sur idempotencyKey.
//
// ============================================================

export const checkoutIdempotencyKeySchema =
  z
    .string()
    .trim()
    .min(
      16,
      "IDEMPOTENCY_KEY_TOO_SHORT"
    )
    .max(
      CHECKOUT_VALIDATION_LIMITS.idempotencyKey,
      "IDEMPOTENCY_KEY_TOO_LONG"
    )
    .regex(
      IDEMPOTENCY_PATTERN,
      "INVALID_IDEMPOTENCY_KEY"
    );

// ============================================================
// 11. SCHÉMA COMPLET DE LA REQUÊTE
// ============================================================
//
// Format envoyé à POST /api/checkout :
//
// {
//   idempotencyKey,
//   locale,
//   customer: {
//     firstName,
//     lastName,
//     email,
//     phoneCountry,
//     phoneNational
//   },
//   delivery: {
//     country,
//     city,
//     postalCode,
//     addressLine1,
//     addressLine2
//   },
//   items: [
//     { productId, quantity, variantId }
//   ]
// }
//
// Aucun montant ni paiement n'est accepté.
//
// ============================================================

export const checkoutSubmitSchema =
  z
    .object({
      idempotencyKey:
        checkoutIdempotencyKeySchema,

      locale:
        checkoutLocaleSchema,

      customer:
        checkoutCustomerSchema,

      delivery:
        checkoutDeliverySchema,

      items:
        checkoutCartSchema,

      /**
       * La maquette comporte une case :
       * utiliser la même adresse
       * pour la facturation.
       *
       * Le schéma Prisma ne dispose pas
       * encore de champs de facturation
       * indépendants.
       *
       * Nous refusons donc explicitement
       * les commandes nécessitant une
       * adresse de facturation différente,
       * au lieu de perdre silencieusement
       * cette information.
       */
      sameBillingAddress:
        z.boolean().optional(),
      expectedTotalCents: z.number().int().min(0).max(2_147_483_647).optional(),
    })
    .strict()
    .superRefine(
      (data, context) => {
        if (
          data.sameBillingAddress === false
        ) {
          context.addIssue({
            code: "custom",
            path: ["sameBillingAddress"],
            message:
              "SEPARATE_BILLING_ADDRESS_NOT_SUPPORTED",
          });
        }
      }
    );

export type CheckoutSubmitInput =
  z.input<typeof checkoutSubmitSchema>;

export type CheckoutSubmitParsed =
  z.output<typeof checkoutSubmitSchema>;

// ============================================================
// 12. VALIDATION INTERNATIONALE DU TÉLÉPHONE
// ============================================================
//
// libphonenumber-js permet :
//
// - La prise en charge des indicatifs
// - La vérification des longueurs
// - Le contrôle du pays sélectionné
// - Le format E.164
// - Le traitement correct des numéros italiens
//
// Aucun zéro n'est retiré manuellement.
//
// ============================================================

export type CheckoutPhoneValidation = {
  valid: boolean;
  phoneE164: string | null;
  phoneDialCode: string | null;
  phoneNational: string | null;
  error: string | null;
};

export function validateCheckoutPhone(
  value: unknown,
  phoneCountry: unknown
): CheckoutPhoneValidation {
  if (
    typeof value !== "string" ||
    !isCheckoutCountry(phoneCountry)
  ) {
    return {
      valid: false,
      phoneE164: null,
      phoneDialCode: null,
      phoneNational: null,
      error: "INVALID_PHONE_INPUT",
    };
  }

  const input = value.trim();

  if (
    !input ||
    input.length >
      CHECKOUT_VALIDATION_LIMITS.phone
  ) {
    return {
      valid: false,
      phoneE164: null,
      phoneDialCode: null,
      phoneNational: null,
      error: "INVALID_PHONE_LENGTH",
    };
  }

  /**
   * Tolère :
   * - les espaces
   * - les parenthèses
   * - les points
   * - les tirets
   * - le préfixe + déjà saisi
   *
   * La bibliothèque réalise la normalisation.
   */
  if (
    !/^\+?[\d\s().-]+$/.test(input)
  ) {
    return {
      valid: false,
      phoneE164: null,
      phoneDialCode: null,
      phoneNational: null,
      error: "INVALID_PHONE_CHARACTERS",
    };
  }

  try {
    const parsed =
      parsePhoneNumberFromString(
        input,
        phoneCountry as CountryCode
      );

    if (
      !parsed ||
      !parsed.isValid()
    ) {
      return {
        valid: false,
        phoneE164: null,
        phoneDialCode: null,
        phoneNational: null,
        error: "INVALID_PHONE_NUMBER",
      };
    }

    const expectedDialCode =
      getCheckoutDialCode(
        phoneCountry
      );

    const actualDialCode =
      `+${parsed.countryCallingCode}`;

    /**
     * Un numéro commençant par +33
     * ne doit pas être validé comme
     * un numéro allemand +49.
     *
     * Le pays de livraison peut cependant
     * être différent du pays du téléphone.
     */
    if (
      actualDialCode !== expectedDialCode
    ) {
      return {
        valid: false,
        phoneE164: null,
        phoneDialCode: null,
        phoneNational: null,
        error: "PHONE_COUNTRY_MISMATCH",
      };
    }

    const e164 = parsed.number;

    if (
      !/^\+[1-9]\d{1,14}$/.test(
        e164
      )
    ) {
      return {
        valid: false,
        phoneE164: null,
        phoneDialCode: null,
        phoneNational: null,
        error: "INVALID_E164_NUMBER",
      };
    }

    return {
      valid: true,

      phoneE164: e164,

      phoneDialCode:
        expectedDialCode,

      phoneNational:
        parsed.nationalNumber,

      error: null,
    };
  } catch {
    return {
      valid: false,
      phoneE164: null,
      phoneDialCode: null,
      phoneNational: null,
      error: "PHONE_PARSING_FAILED",
    };
  }
}

// ============================================================
// 13. NORMALISATION DES DONNÉES VALIDÉES
// ============================================================

function normalizeValidatedData(
  parsed: CheckoutSubmitParsed
): CheckoutValidatedData {
  const phone = validateCheckoutPhone(
    parsed.customer.phoneNational,
    parsed.customer.phoneCountry
  );

  if (
    !phone.valid ||
    !phone.phoneE164 ||
    !phone.phoneDialCode ||
    !phone.phoneNational
  ) {
    throw new CheckoutValidationError([
      {
        field: "customer.phoneNational",
        code:
          phone.error ??
          "INVALID_PHONE",
        message:
          phone.error ??
          "INVALID_PHONE",
      },
    ]);
  }

  const customer:
    CheckoutCustomerDetails = {
      firstName:
        parsed.customer.firstName,

      lastName:
        parsed.customer.lastName,

      email:
        parsed.customer.email,

      phoneDialCode:
        phone.phoneDialCode,

      phoneNational:
        phone.phoneNational,

      phoneE164:
        phone.phoneE164,
    };

  const delivery:
    CheckoutDeliveryDetails = {
      country:
        parsed.delivery.country,

      city:
        parsed.delivery.city,

      postalCode:
        normalizeCheckoutPostalCode(
          parsed.delivery.postalCode,
          parsed.delivery.country
        ),

      addressLine1:
        parsed.delivery.addressLine1,

      addressLine2:
        parsed.delivery.addressLine2 ??
        null,
    };

  const cartItems:
    CheckoutPricingCartItem[] =
    parsed.items.map((item) => ({
      productId:
        item.productId,

      quantity:
        item.quantity,

      variantId:
        item.variantId ?? null,
    }));

  return {
    idempotencyKey:
      parsed.idempotencyKey,

    locale:
      parsed.locale,

    customer,

    delivery,

    cartItems,
    expectedTotalCents: parsed.expectedTotalCents,
  };
}

// ============================================================
// 14. CLASSE D'ERREUR DE VALIDATION
// ============================================================

export class CheckoutValidationError
  extends Error {
  readonly code =
    "CHECKOUT_VALIDATION_FAILED";

  readonly errors:
    CheckoutValidationFieldError[];

  constructor(
    errors: CheckoutValidationFieldError[]
  ) {
    super("CHECKOUT_VALIDATION_FAILED");

    this.name =
      "CheckoutValidationError";

    this.errors = errors;
  }
}

// ============================================================
// 15. TRANSFORMER LES ERREURS ZOD
// ============================================================
//
// Ne jamais inclure dans les erreurs
// la valeur complète des coordonnées,
// du téléphone ou du formulaire.
//
// ============================================================

export function getCheckoutZodErrors(
  error: z.ZodError
): CheckoutValidationFieldError[] {
  return error.issues.map(
    (issue) => ({
      field:
        issue.path.map(String).join(".") ||
        "form",

      code:
        issue.code,

      message:
        issue.message,
    })
  );
}

// ============================================================
// 16. VALIDATION SANS EXCEPTION
// ============================================================
//
// À utiliser dans une route API
// lorsqu'on souhaite retourner des
// erreurs structurées au formulaire.
//
// ============================================================

export function safeValidateCheckout(
  input: unknown
): CheckoutValidationResult {
  const result =
    checkoutSubmitSchema.safeParse(
      input
    );

  if (!result.success) {
    return {
      success: false,
      errors: getCheckoutZodErrors(
        result.error
      ),
    };
  }

  try {
    const data =
      normalizeValidatedData(
        result.data
      );

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (
      error instanceof
      CheckoutValidationError
    ) {
      return {
        success: false,
        errors: error.errors,
      };
    }

    return {
      success: false,
      errors: [
        {
          field: "form",
          code: "VALIDATION_FAILED",
          message: "VALIDATION_FAILED",
        },
      ],
    };
  }
}

// ============================================================
// 17. VALIDATION AVEC EXCEPTION
// ============================================================
//
// Pratique pour les fonctions serveur
// qui exigent des données valides.
//
// ============================================================

export function validateCheckout(
  input: unknown
): CheckoutValidatedData {
  const result =
    safeValidateCheckout(input);

  if (!result.success) {
    throw new CheckoutValidationError(
      result.errors
    );
  }

  return result.data;
}

// ============================================================
// 18. PRÉPARER LES DONNÉES DE COMMANDE
// ============================================================
//
// Cette fonction construit les données
// personnelles et de livraison attendues
// par createCheckoutOrder().
//
// Elle NE fournit PAS les prix.
//
// Les prix doivent être calculés
// séparément par calculateCheckoutPricing().
//
// Le detectedCountry doit venir d'une
// source serveur contrôlée.
//
// ============================================================

export function buildValidatedOrderInput(
  validated: CheckoutValidatedData,
  options: CheckoutValidationOptions = {}
): CheckoutValidatedOrderInput {
  const detectedCountry =
    options.detectedCountry &&
    isCheckoutCountry(
      options.detectedCountry
    )
      ? options.detectedCountry
      : null;

  return {
    idempotencyKey:
      validated.idempotencyKey,

    locale:
      validated.locale,

    customer: {
      ...validated.customer,
    },

    delivery: {
      ...validated.delivery,
    },

    detectedCountry,
  };
}

// ============================================================
// 19. VÉRIFIER UN FORMULAIRE INDIVIDUEL
// ============================================================

export function validateCheckoutCustomer(
  input: unknown
) {
  const parsed =
    checkoutCustomerSchema.safeParse(
      input
    );

  if (!parsed.success) {
    return {
      success: false as const,
      errors: getCheckoutZodErrors(
        parsed.error
      ),
    };
  }

  const phone = validateCheckoutPhone(
    parsed.data.phoneNational,
    parsed.data.phoneCountry
  );

  if (
    !phone.valid ||
    !phone.phoneE164 ||
    !phone.phoneDialCode ||
    !phone.phoneNational
  ) {
    return {
      success: false as const,
      errors: [
        {
          field: "phoneNational",
          code:
            phone.error ??
            "INVALID_PHONE",
          message:
            phone.error ??
            "INVALID_PHONE",
        },
      ],
    };
  }

  return {
    success: true as const,

    data: {
      firstName:
        parsed.data.firstName,

      lastName:
        parsed.data.lastName,

      email:
        parsed.data.email,

      phoneDialCode:
        phone.phoneDialCode,

      phoneNational:
        phone.phoneNational,

      phoneE164:
        phone.phoneE164,
    } satisfies CheckoutCustomerDetails,
  };
}

// ============================================================
// 20. VÉRIFIER UNE ADRESSE INDIVIDUELLE
// ============================================================

export function validateCheckoutDelivery(
  input: unknown
) {
  const parsed =
    checkoutDeliverySchema.safeParse(
      input
    );

  if (!parsed.success) {
    return {
      success: false as const,
      errors: getCheckoutZodErrors(
        parsed.error
      ),
    };
  }

  const data:
    CheckoutDeliveryDetails = {
      country:
        parsed.data.country,

      city:
        parsed.data.city,

      postalCode:
        normalizeCheckoutPostalCode(
          parsed.data.postalCode,
          parsed.data.country
        ),

      addressLine1:
        parsed.data.addressLine1,

      addressLine2:
        parsed.data.addressLine2 ??
        null,
    };

  return {
    success: true as const,
    data,
  };
}

// ============================================================
// 21. VÉRIFIER LE PANIER INDIVIDUELLEMENT
// ============================================================

export function validateCheckoutCart(
  input: unknown
) {
  const parsed =
    checkoutCartSchema.safeParse(
      input
    );

  if (!parsed.success) {
    return {
      success: false as const,
      errors: getCheckoutZodErrors(
        parsed.error
      ),
    };
  }

  const items:
    CheckoutPricingCartItem[] =
    parsed.data.map(
      (item) => ({
        productId:
          item.productId,

        quantity:
          item.quantity,

        variantId:
          item.variantId ?? null,
      })
    );

  return {
    success: true as const,
    data: items,
  };
}

// ============================================================
// 22. VALIDATION DU PAYS DE LIVRAISON
// ============================================================

export function assertValidCheckoutCountry(
  value: unknown
): CheckoutCountryCode {
  if (!isCheckoutCountry(value)) {
    throw new Error(
      "CHECKOUT_COUNTRY_NOT_SUPPORTED"
    );
  }

  return value;
}

// ============================================================
// 23. VALIDATION DE LA LANGUE
// ============================================================

export function assertValidCheckoutLocale(
  value: unknown
): CheckoutLocale {
  const parsed =
    checkoutLocaleSchema.safeParse(
      value
    );

  if (!parsed.success) {
    throw new Error(
      "CHECKOUT_INVALID_LOCALE"
    );
  }

  return parsed.data;
}

// ============================================================
// FIN — CYCLORIVA CHECKOUT VALIDATION
// ============================================================
