
/**
 * ============================================================
 * CYCLORIVA — TRADUCTIONS OFFICIELLES DU CHECKOUT
 * ============================================================
 *
 * Fichier : lib/checkout-i18n.ts
 *
 * Next.js 16 — TypeScript — React 19
 *
 * LANGUES :
 * - Français
 * - Anglais
 * - Allemand
 * - Italien
 * - Espagnol
 *
 * RESPONSABILITÉS :
 * - Traductions complètes de la page commande
 * - Formulaire client
 * - Adresse de livraison
 * - Indicatif téléphonique
 * - Récapitulatif du panier
 * - Boutons de commande
 * - Détection géographique
 * - Erreurs de validation
 * - Messages de chargement
 * - Confirmation de réception
 * - Statuts de commande
 *
 * Compatible avec les composants serveur
 * et les composants client React.
 *
 * Ce fichier ne contient aucune donnée
 * commerciale inventée.
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES DES LANGUES
// ============================================================

export type CheckoutLocale =
  | "fr"
  | "en"
  | "de"
  | "it"
  | "es";

export const CHECKOUT_LOCALES = [
  "fr",
  "en",
  "de",
  "it",
  "es",
] as const satisfies readonly CheckoutLocale[];

export const DEFAULT_CHECKOUT_LOCALE:
  CheckoutLocale = "fr";

// ============================================================
// 2. STRUCTURE COMMUNE DES TRADUCTIONS
// ============================================================

export type CheckoutTranslations = {
  common: {
    brand: string;
    required: string;
    optional: string;
    loading: string;
    retry: string;
    close: string;
    edit: string;
    remove: string;
    save: string;
    cancel: string;
    continue: string;
    back: string;
    yes: string;
    no: string;
    currency: string;
  };

  page: {
    eyebrow: string;
    title: string;
    description: string;
    breadcrumbHome: string;
    breadcrumbCart: string;
    breadcrumbCheckout: string;
    pageAriaLabel: string;
  };

  steps: {
    cart: string;
    information: string;
    confirmation: string;
    currentStep: string;
    completedStep: string;
  };

  customer: {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    phoneCountry: string;
    phoneDialCode: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    phoneHelp: string;
  };

  delivery: {
    title: string;
    country: string;
    selectCountry: string;
    city: string;
    cityPlaceholder: string;
    addressLine1: string;
    addressLine1Placeholder: string;
    addressLine2: string;
    addressLine2Placeholder: string;
    postalCode: string;
    postalCodePlaceholder: string;
    sameBillingAddress: string;
    billingAddress: string;
    differentBillingUnavailable: string;
    deliveryCountryRequired: string;
  };

  geo: {
    detectedTitle: string;
    detectedDescription: string;
    suggestedCountry: string;
    suggestedDialCode: string;
    unavailableTitle: string;
    unavailableDescription: string;
    unsupportedTitle: string;
    unsupportedDescription: string;
    manuallySelected: string;
    changeCountry: string;
    changeDialCode: string;
  };

  cart: {
    title: string;
    summary: string;
    empty: string;
    emptyDescription: string;
    product: string;
    products: string;
    distinctProducts: string;
    quantity: string;
    unitPrice: string;
    lineTotal: string;
    decreaseQuantity: string;
    increaseQuantity: string;
    removeProduct: string;
    subtotal: string;
    shipping: string;
    shippingPending: string;
    shippingUnavailable: string;
    freeShipping: string;
    taxes: string;
    taxInformation: string;
    total: string;
    totalInclTax: string;
    totalPending: string;
    updateCart: string;
    cartUpdated: string;
    returnToCart: string;
    continueShopping: string;
  };

  submit: {
    title: string;
    button: string;
    processing: string;
    validating: string;
    saving: string;
    submitting: string;
    unavailable: string;
    emptyCartDisabled: string;
    correctErrors: string;
    retry: string;
    notice: string;
    noPaymentNotice: string;
    termsIntro: string;
    termsLink: string;
    privacyLink: string;
  };

  security: {
    title: string;
    description: string;
    delivery: string;
    deliveryDescription: string;
    payment: string;
    paymentDescription: string;
    returns: string;
    returnsDescription: string;
    support: string;
    supportDescription: string;
  };

  confirmation: {
    eyebrow: string;
    title: string;
    description: string;
    orderNumber: string;
    received: string;
    confirmationEmail: string;
    emailPending: string;
    nextSteps: string;
    paymentNotConfirmed: string;
    viewProducts: string;
    returnHome: string;
    orderNotFound: string;
    protectedDetails: string;
  };

  statuses: {
    received: string;
    pendingPayment: string;
    confirmed: string;
    processing: string;
    shipped: string;
    delivered: string;
    cancelled: string;
    refunded: string;
    notRequested: string;
    pending: string;
    paid: string;
    failed: string;
    partiallyRefunded: string;
  };

  errors: {
    REQUIRED_OR_TOO_SHORT: string;
    REQUIRED: string;
    TEXT_TOO_LONG: string;
    INVALID_CHARACTERS: string;
    EMAIL_REQUIRED: string;
    EMAIL_TOO_LONG: string;
    INVALID_EMAIL: string;
    PHONE_REQUIRED: string;
    PHONE_TOO_LONG: string;
    INVALID_PHONE: string;
    INVALID_PHONE_INPUT: string;
    INVALID_PHONE_LENGTH: string;
    INVALID_PHONE_CHARACTERS: string;
    INVALID_PHONE_NUMBER: string;
    PHONE_COUNTRY_MISMATCH: string;
    INVALID_E164_NUMBER: string;
    PHONE_PARSING_FAILED: string;
    POSTAL_CODE_REQUIRED: string;
    INVALID_POSTAL_CODE: string;
    CART_EMPTY: string;
    TOO_MANY_PRODUCTS: string;
    PRODUCT_ID_REQUIRED: string;
    PRODUCT_ID_TOO_LONG: string;
    INVALID_PRODUCT_ID: string;
    DUPLICATE_PRODUCT: string;
    INVALID_QUANTITY: string;
    QUANTITY_TOO_HIGH: string;
    UNSUPPORTED_VARIANT: string;
    VARIANT_ID_TOO_LONG: string;
    IDEMPOTENCY_KEY_TOO_SHORT: string;
    IDEMPOTENCY_KEY_TOO_LONG: string;
    INVALID_IDEMPOTENCY_KEY: string;
    SEPARATE_BILLING_ADDRESS_NOT_SUPPORTED: string;
    CHECKOUT_COUNTRY_NOT_SUPPORTED: string;
    CHECKOUT_INVALID_LOCALE: string;
    CHECKOUT_VALIDATION_FAILED: string;
    VALIDATION_FAILED: string;
    PRODUCT_NOT_FOUND: string;
    PRODUCT_NOT_PURCHASABLE: string;
    PRODUCT_PRICE_UNAVAILABLE: string;
    PRODUCT_CURRENCY_UNSUPPORTED: string;
    SHIPPING_NOT_CONFIGURED: string;
    INVALID_SHIPPING: string;
    AMOUNT_OVERFLOW: string;
    CHECKOUT_IDEMPOTENCY_CONFLICT: string;
    CHECKOUT_ORDER_NOT_FOUND: string;
    NETWORK_ERROR: string;
    SERVER_ERROR: string;
    UNKNOWN_ERROR: string;
  };

  accessibility: {
    requiredField: string;
    selectCountry: string;
    selectPhoneCountry: string;
    orderSummary: string;
    loading: string;
    invalidField: string;
    stepProgress: string;
  };
};

// ============================================================
// 3. FRANÇAIS
// ============================================================

const fr: CheckoutTranslations = {
  common: {
    brand: "CYCLORIVA",
    required: "Obligatoire",
    optional: "Facultatif",
    loading: "Chargement…",
    retry: "Réessayer",
    close: "Fermer",
    edit: "Modifier",
    remove: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    continue: "Continuer",
    back: "Retour",
    yes: "Oui",
    no: "Non",
    currency: "EUR",
  },

  page: {
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    title: "Finaliser ma commande",
    description:
      "Vérifiez votre panier et renseignez vos coordonnées pour passer commande.",
    breadcrumbHome: "Accueil",
    breadcrumbCart: "Panier",
    breadcrumbCheckout: "Commande",
    pageAriaLabel: "Finalisation de commande",
  },

  steps: {
    cart: "Panier",
    information: "Informations de livraison",
    confirmation: "Validation",
    currentStep: "Étape en cours",
    completedStep: "Étape terminée",
  },

  customer: {
    title: "Informations personnelles",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse e-mail",
    phone: "Téléphone",
    phoneCountry: "Pays du téléphone",
    phoneDialCode: "Indicatif",
    firstNamePlaceholder: "Votre prénom",
    lastNamePlaceholder: "Votre nom",
    emailPlaceholder: "votre@email.com",
    phonePlaceholder: "Votre numéro de téléphone",
    phoneHelp:
      "Vous pouvez modifier l'indicatif indépendamment du pays de livraison.",
  },

  delivery: {
    title: "Adresse de livraison",
    country: "Pays",
    selectCountry: "Sélectionnez un pays",
    city: "Ville",
    cityPlaceholder: "Votre ville",
    addressLine1: "Adresse de livraison",
    addressLine1Placeholder:
      "Numéro et nom de la rue",
    addressLine2: "Complément d'adresse",
    addressLine2Placeholder:
      "Appartement, étage, bâtiment…",
    postalCode: "Code postal",
    postalCodePlaceholder: "Votre code postal",
    sameBillingAddress:
      "Utiliser la même adresse pour la facturation",
    billingAddress: "Adresse de facturation",
    differentBillingUnavailable:
      "Une adresse de facturation différente n'est pas encore disponible.",
    deliveryCountryRequired:
      "Choisissez l'un de nos huit pays de livraison.",
  },

  geo: {
    detectedTitle: "Pays détecté automatiquement",
    detectedDescription:
      "Pays proposé selon votre connexion. Vous pouvez le modifier.",
    suggestedCountry: "Pays proposé",
    suggestedDialCode: "Indicatif proposé",
    unavailableTitle:
      "Détection du pays indisponible",
    unavailableDescription:
      "Sélectionnez votre pays de livraison et votre indicatif.",
    unsupportedTitle:
      "Pays détecté hors de notre zone de livraison",
    unsupportedDescription:
      "Choisissez un pays parmi nos destinations disponibles.",
    manuallySelected: "Pays choisi manuellement",
    changeCountry: "Modifier le pays",
    changeDialCode: "Modifier l'indicatif",
  },

  cart: {
    title: "Récapitulatif de commande",
    summary: "Résumé du panier",
    empty: "Votre panier est vide",
    emptyDescription:
      "Ajoutez des produits avant de passer commande.",
    product: "produit",
    products: "produits",
    distinctProducts: "Produits différents",
    quantity: "Quantité",
    unitPrice: "Prix unitaire",
    lineTotal: "Total du produit",
    decreaseQuantity: "Diminuer la quantité",
    increaseQuantity: "Augmenter la quantité",
    removeProduct: "Supprimer ce produit",
    subtotal: "Sous-total",
    shipping: "Livraison",
    shippingPending: "À calculer",
    shippingUnavailable: "Livraison indisponible",
    freeShipping: "Gratuite",
    taxes: "Taxes",
    taxInformation:
      "Les taxes applicables sont déterminées selon la commande.",
    total: "Total",
    totalInclTax: "Total TTC",
    totalPending: "Total à confirmer",
    updateCart: "Mettre à jour le panier",
    cartUpdated: "Panier mis à jour",
    returnToCart: "Retour au panier",
    continueShopping: "Continuer mes achats",
  },

  submit: {
    title: "Validation de commande",
    button: "Valider la commande",
    processing: "Traitement en cours…",
    validating: "Vérification des informations…",
    saving: "Enregistrement de la commande…",
    submitting: "Envoi de la commande…",
    unavailable: "Commande indisponible",
    emptyCartDisabled:
      "Ajoutez un produit pour continuer.",
    correctErrors:
      "Veuillez corriger les champs indiqués.",
    retry: "Réessayer la validation",
    notice:
      "Votre commande sera enregistrée après validation des informations.",
    noPaymentNotice:
      "La réception d'une commande ne signifie pas qu'un paiement a été effectué.",
    termsIntro:
      "En validant, vous acceptez nos",
    termsLink: "conditions générales de vente",
    privacyLink: "politique de confidentialité",
  },

  security: {
    title: "Vos informations sont protégées",
    description:
      "Vos coordonnées sont utilisées pour traiter votre commande.",
    delivery: "Livraison",
    deliveryDescription:
      "Selon le pays et les conditions applicables",
    payment: "Paiement",
    paymentDescription:
      "Selon les moyens réellement disponibles",
    returns: "Retours",
    returnsDescription:
      "Selon les conditions de vente",
    support: "Service client",
    supportDescription:
      "Assistance pour votre commande",
  },

  confirmation: {
    eyebrow: "COMMANDE REÇUE",
    title: "Nous avons reçu votre commande",
    description:
      "Votre demande de commande a été enregistrée.",
    orderNumber: "Numéro de commande",
    received: "Commande reçue",
    confirmationEmail:
      "Une confirmation sera envoyée à votre adresse e-mail.",
    emailPending:
      "L'envoi de l'e-mail est en cours ou en attente.",
    nextSteps:
      "Notre équipe vous informera des prochaines étapes.",
    paymentNotConfirmed:
      "Cette confirmation ne constitue pas une preuve de paiement.",
    viewProducts: "Voir les produits",
    returnHome: "Retour à l'accueil",
    orderNotFound: "Commande introuvable",
    protectedDetails:
      "Les informations détaillées de commande sont protégées.",
  },

  statuses: {
    received: "Reçue",
    pendingPayment: "En attente de paiement",
    confirmed: "Confirmée",
    processing: "En préparation",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
    refunded: "Remboursée",
    notRequested: "Paiement non demandé",
    pending: "En attente",
    paid: "Payé",
    failed: "Échec",
    partiallyRefunded: "Partiellement remboursé",
  },

  errors: {
    REQUIRED_OR_TOO_SHORT:
      "Ce champ est obligatoire ou trop court.",
    REQUIRED: "Ce champ est obligatoire.",
    TEXT_TOO_LONG: "Le texte est trop long.",
    INVALID_CHARACTERS:
      "Certains caractères ne sont pas autorisés.",
    EMAIL_REQUIRED:
      "Indiquez votre adresse e-mail.",
    EMAIL_TOO_LONG:
      "L'adresse e-mail est trop longue.",
    INVALID_EMAIL:
      "Indiquez une adresse e-mail valide.",
    PHONE_REQUIRED:
      "Indiquez votre numéro de téléphone.",
    PHONE_TOO_LONG:
      "Le numéro de téléphone est trop long.",
    INVALID_PHONE:
      "Numéro de téléphone invalide.",
    INVALID_PHONE_INPUT:
      "Sélectionnez un indicatif et saisissez votre numéro.",
    INVALID_PHONE_LENGTH:
      "La longueur du numéro est incorrecte.",
    INVALID_PHONE_CHARACTERS:
      "Le numéro contient des caractères incorrects.",
    INVALID_PHONE_NUMBER:
      "Ce numéro de téléphone n'est pas valide.",
    PHONE_COUNTRY_MISMATCH:
      "L'indicatif ne correspond pas au pays du téléphone.",
    INVALID_E164_NUMBER:
      "Le format international du numéro est invalide.",
    PHONE_PARSING_FAILED:
      "Impossible de vérifier ce numéro.",
    POSTAL_CODE_REQUIRED:
      "Indiquez votre code postal.",
    INVALID_POSTAL_CODE:
      "Le format du code postal est incorrect.",
    CART_EMPTY:
      "Votre panier ne contient aucun produit.",
    TOO_MANY_PRODUCTS:
      "Le panier contient trop de produits différents.",
    PRODUCT_ID_REQUIRED:
      "Un produit du panier est invalide.",
    PRODUCT_ID_TOO_LONG:
      "Une référence de produit est trop longue.",
    INVALID_PRODUCT_ID:
      "Référence de produit invalide.",
    DUPLICATE_PRODUCT:
      "Un produit figure plusieurs fois dans le panier.",
    INVALID_QUANTITY:
      "La quantité choisie est invalide.",
    QUANTITY_TOO_HIGH:
      "La quantité maximale est dépassée.",
    UNSUPPORTED_VARIANT:
      "Cette variante de produit n'est pas encore prise en charge.",
    VARIANT_ID_TOO_LONG:
      "La référence de variante est trop longue.",
    IDEMPOTENCY_KEY_TOO_SHORT:
      "Identifiant de commande invalide.",
    IDEMPOTENCY_KEY_TOO_LONG:
      "Identifiant de commande invalide.",
    INVALID_IDEMPOTENCY_KEY:
      "Identifiant de commande invalide.",
    SEPARATE_BILLING_ADDRESS_NOT_SUPPORTED:
      "Une adresse de facturation différente n'est pas encore prise en charge.",
    CHECKOUT_COUNTRY_NOT_SUPPORTED:
      "La livraison n'est pas proposée dans ce pays.",
    CHECKOUT_INVALID_LOCALE:
      "La langue sélectionnée est invalide.",
    CHECKOUT_VALIDATION_FAILED:
      "Certaines informations sont incorrectes.",
    VALIDATION_FAILED:
      "Impossible de valider les informations.",
    PRODUCT_NOT_FOUND:
      "Un produit du panier est introuvable.",
    PRODUCT_NOT_PURCHASABLE:
      "Un produit ne peut pas être commandé actuellement.",
    PRODUCT_PRICE_UNAVAILABLE:
      "Le prix d'un produit n'est pas disponible.",
    PRODUCT_CURRENCY_UNSUPPORTED:
      "La devise d'un produit n'est pas prise en charge.",
    SHIPPING_NOT_CONFIGURED:
      "Les frais de livraison ne sont pas encore disponibles pour ce pays.",
    INVALID_SHIPPING:
      "Impossible de calculer les frais de livraison.",
    AMOUNT_OVERFLOW:
      "Le montant de la commande dépasse la limite autorisée.",
    CHECKOUT_IDEMPOTENCY_CONFLICT:
      "Cette tentative de commande a déjà été utilisée avec des informations différentes.",
    CHECKOUT_ORDER_NOT_FOUND:
      "La commande est introuvable.",
    NETWORK_ERROR:
      "Problème de connexion. Veuillez réessayer.",
    SERVER_ERROR:
      "Une erreur serveur est survenue.",
    UNKNOWN_ERROR:
      "Une erreur inattendue est survenue.",
  },

  accessibility: {
    requiredField: "Champ obligatoire",
    selectCountry: "Choisir le pays de livraison",
    selectPhoneCountry:
      "Choisir le pays du numéro de téléphone",
    orderSummary: "Récapitulatif de votre commande",
    loading: "Chargement en cours",
    invalidField: "Champ invalide",
    stepProgress: "Progression de la commande",
  },
};

// ============================================================
// 4. ANGLAIS
// ============================================================

const en: CheckoutTranslations = {
  common: {
    brand: "CYCLORIVA",
    required: "Required",
    optional: "Optional",
    loading: "Loading…",
    retry: "Try again",
    close: "Close",
    edit: "Edit",
    remove: "Remove",
    save: "Save",
    cancel: "Cancel",
    continue: "Continue",
    back: "Back",
    yes: "Yes",
    no: "No",
    currency: "EUR",
  },

  page: {
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    title: "Complete your order",
    description:
      "Review your cart and enter your details to place your order.",
    breadcrumbHome: "Home",
    breadcrumbCart: "Cart",
    breadcrumbCheckout: "Checkout",
    pageAriaLabel: "Checkout",
  },

  steps: {
    cart: "Cart",
    information: "Delivery information",
    confirmation: "Confirmation",
    currentStep: "Current step",
    completedStep: "Completed step",
  },

  customer: {
    title: "Personal information",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    phone: "Phone",
    phoneCountry: "Phone country",
    phoneDialCode: "Dialling code",
    firstNamePlaceholder: "Your first name",
    lastNamePlaceholder: "Your last name",
    emailPlaceholder: "your@email.com",
    phonePlaceholder: "Your phone number",
    phoneHelp:
      "You can change your dialling code independently of the delivery country.",
  },

  delivery: {
    title: "Delivery address",
    country: "Country",
    selectCountry: "Select a country",
    city: "City",
    cityPlaceholder: "Your city",
    addressLine1: "Delivery address",
    addressLine1Placeholder:
      "House number and street",
    addressLine2: "Address line 2",
    addressLine2Placeholder:
      "Apartment, floor, building…",
    postalCode: "Postal code",
    postalCodePlaceholder: "Your postal code",
    sameBillingAddress:
      "Use the same address for billing",
    billingAddress: "Billing address",
    differentBillingUnavailable:
      "A separate billing address is not yet available.",
    deliveryCountryRequired:
      "Choose one of our eight delivery countries.",
  },

  geo: {
    detectedTitle: "Country detected automatically",
    detectedDescription:
      "Country suggested based on your connection. You can change it.",
    suggestedCountry: "Suggested country",
    suggestedDialCode: "Suggested dialling code",
    unavailableTitle:
      "Country detection unavailable",
    unavailableDescription:
      "Select your delivery country and phone code.",
    unsupportedTitle:
      "Detected country outside our delivery area",
    unsupportedDescription:
      "Please choose one of our available destinations.",
    manuallySelected: "Country selected manually",
    changeCountry: "Change country",
    changeDialCode: "Change dialling code",
  },

  cart: {
    title: "Order summary",
    summary: "Cart summary",
    empty: "Your cart is empty",
    emptyDescription:
      "Add products before placing an order.",
    product: "product",
    products: "products",
    distinctProducts: "Different products",
    quantity: "Quantity",
    unitPrice: "Unit price",
    lineTotal: "Item total",
    decreaseQuantity: "Decrease quantity",
    increaseQuantity: "Increase quantity",
    removeProduct: "Remove this product",
    subtotal: "Subtotal",
    shipping: "Shipping",
    shippingPending: "To be calculated",
    shippingUnavailable: "Shipping unavailable",
    freeShipping: "Free",
    taxes: "Taxes",
    taxInformation:
      "Applicable taxes depend on the order.",
    total: "Total",
    totalInclTax: "Total incl. tax",
    totalPending: "Total to be confirmed",
    updateCart: "Update cart",
    cartUpdated: "Cart updated",
    returnToCart: "Back to cart",
    continueShopping: "Continue shopping",
  },

  submit: {
    title: "Order confirmation",
    button: "Place order",
    processing: "Processing…",
    validating: "Checking your details…",
    saving: "Saving your order…",
    submitting: "Submitting your order…",
    unavailable: "Checkout unavailable",
    emptyCartDisabled:
      "Add a product to continue.",
    correctErrors:
      "Please correct the highlighted fields.",
    retry: "Try submitting again",
    notice:
      "Your order will be recorded once your details have been validated.",
    noPaymentNotice:
      "Receiving an order does not mean that payment has been made.",
    termsIntro:
      "By placing your order, you accept our",
    termsLink: "terms and conditions",
    privacyLink: "privacy policy",
  },

  security: {
    title: "Your information is protected",
    description:
      "Your details are used to process your order.",
    delivery: "Delivery",
    deliveryDescription:
      "Subject to destination and applicable conditions",
    payment: "Payment",
    paymentDescription:
      "Subject to available payment methods",
    returns: "Returns",
    returnsDescription:
      "Subject to our terms of sale",
    support: "Customer support",
    supportDescription:
      "Assistance with your order",
  },

  confirmation: {
    eyebrow: "ORDER RECEIVED",
    title: "We have received your order",
    description:
      "Your order request has been recorded.",
    orderNumber: "Order number",
    received: "Order received",
    confirmationEmail:
      "A confirmation will be sent to your email address.",
    emailPending:
      "Your email is being sent or is pending.",
    nextSteps:
      "Our team will inform you of the next steps.",
    paymentNotConfirmed:
      "This confirmation is not proof of payment.",
    viewProducts: "Browse products",
    returnHome: "Back to home",
    orderNotFound: "Order not found",
    protectedDetails:
      "Detailed order information is protected.",
  },

  statuses: {
    received: "Received",
    pendingPayment: "Awaiting payment",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
    notRequested: "Payment not requested",
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    partiallyRefunded: "Partially refunded",
  },

  errors: {
    REQUIRED_OR_TOO_SHORT:
      "This field is required or too short.",
    REQUIRED: "This field is required.",
    TEXT_TOO_LONG: "The text is too long.",
    INVALID_CHARACTERS:
      "Some characters are not allowed.",
    EMAIL_REQUIRED:
      "Enter your email address.",
    EMAIL_TOO_LONG:
      "The email address is too long.",
    INVALID_EMAIL:
      "Enter a valid email address.",
    PHONE_REQUIRED:
      "Enter your phone number.",
    PHONE_TOO_LONG:
      "The phone number is too long.",
    INVALID_PHONE:
      "Invalid phone number.",
    INVALID_PHONE_INPUT:
      "Choose a dialling code and enter your number.",
    INVALID_PHONE_LENGTH:
      "Incorrect phone number length.",
    INVALID_PHONE_CHARACTERS:
      "The phone number contains invalid characters.",
    INVALID_PHONE_NUMBER:
      "This phone number is not valid.",
    PHONE_COUNTRY_MISMATCH:
      "The dialling code does not match the phone country.",
    INVALID_E164_NUMBER:
      "Invalid international phone format.",
    PHONE_PARSING_FAILED:
      "Unable to verify this phone number.",
    POSTAL_CODE_REQUIRED:
      "Enter your postal code.",
    INVALID_POSTAL_CODE:
      "Incorrect postal code format.",
    CART_EMPTY:
      "Your cart contains no products.",
    TOO_MANY_PRODUCTS:
      "Your cart contains too many different products.",
    PRODUCT_ID_REQUIRED:
      "A product in your cart is invalid.",
    PRODUCT_ID_TOO_LONG:
      "A product reference is too long.",
    INVALID_PRODUCT_ID:
      "Invalid product reference.",
    DUPLICATE_PRODUCT:
      "A product appears more than once in your cart.",
    INVALID_QUANTITY:
      "Invalid quantity.",
    QUANTITY_TOO_HIGH:
      "Maximum quantity exceeded.",
    UNSUPPORTED_VARIANT:
      "This product variant is not yet supported.",
    VARIANT_ID_TOO_LONG:
      "The variant reference is too long.",
    IDEMPOTENCY_KEY_TOO_SHORT:
      "Invalid order identifier.",
    IDEMPOTENCY_KEY_TOO_LONG:
      "Invalid order identifier.",
    INVALID_IDEMPOTENCY_KEY:
      "Invalid order identifier.",
    SEPARATE_BILLING_ADDRESS_NOT_SUPPORTED:
      "A separate billing address is not yet supported.",
    CHECKOUT_COUNTRY_NOT_SUPPORTED:
      "Delivery is not available in this country.",
    CHECKOUT_INVALID_LOCALE:
      "The selected language is invalid.",
    CHECKOUT_VALIDATION_FAILED:
      "Some information is incorrect.",
    VALIDATION_FAILED:
      "Unable to validate your information.",
    PRODUCT_NOT_FOUND:
      "A product in your cart was not found.",
    PRODUCT_NOT_PURCHASABLE:
      "A product cannot currently be ordered.",
    PRODUCT_PRICE_UNAVAILABLE:
      "A product price is unavailable.",
    PRODUCT_CURRENCY_UNSUPPORTED:
      "A product currency is not supported.",
    SHIPPING_NOT_CONFIGURED:
      "Shipping charges are not yet available for this country.",
    INVALID_SHIPPING:
      "Unable to calculate shipping charges.",
    AMOUNT_OVERFLOW:
      "The order amount exceeds the permitted limit.",
    CHECKOUT_IDEMPOTENCY_CONFLICT:
      "This order attempt was already used with different information.",
    CHECKOUT_ORDER_NOT_FOUND:
      "Order not found.",
    NETWORK_ERROR:
      "Connection problem. Please try again.",
    SERVER_ERROR:
      "A server error occurred.",
    UNKNOWN_ERROR:
      "An unexpected error occurred.",
  },

  accessibility: {
    requiredField: "Required field",
    selectCountry: "Select delivery country",
    selectPhoneCountry: "Select phone country",
    orderSummary: "Your order summary",
    loading: "Loading",
    invalidField: "Invalid field",
    stepProgress: "Checkout progress",
  },
};

// ============================================================
// 5. ALLEMAND
// ============================================================

const de: CheckoutTranslations = {
  common: {
    brand: "CYCLORIVA",
    required: "Pflichtfeld",
    optional: "Optional",
    loading: "Wird geladen…",
    retry: "Erneut versuchen",
    close: "Schließen",
    edit: "Bearbeiten",
    remove: "Entfernen",
    save: "Speichern",
    cancel: "Abbrechen",
    continue: "Weiter",
    back: "Zurück",
    yes: "Ja",
    no: "Nein",
    currency: "EUR",
  },

  page: {
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    title: "Bestellung abschließen",
    description:
      "Überprüfen Sie Ihren Warenkorb und geben Sie Ihre Daten ein, um die Bestellung aufzugeben.",
    breadcrumbHome: "Startseite",
    breadcrumbCart: "Warenkorb",
    breadcrumbCheckout: "Bestellung",
    pageAriaLabel: "Bestellabschluss",
  },

  steps: {
    cart: "Warenkorb",
    information: "Lieferinformationen",
    confirmation: "Bestätigung",
    currentStep: "Aktueller Schritt",
    completedStep: "Abgeschlossener Schritt",
  },

  customer: {
    title: "Persönliche Angaben",
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail-Adresse",
    phone: "Telefon",
    phoneCountry: "Land der Telefonnummer",
    phoneDialCode: "Vorwahl",
    firstNamePlaceholder: "Ihr Vorname",
    lastNamePlaceholder: "Ihr Nachname",
    emailPlaceholder: "ihre@email.com",
    phonePlaceholder: "Ihre Telefonnummer",
    phoneHelp:
      "Sie können die Telefonvorwahl unabhängig vom Lieferland ändern.",
  },

  delivery: {
    title: "Lieferadresse",
    country: "Land",
    selectCountry: "Land auswählen",
    city: "Stadt",
    cityPlaceholder: "Ihre Stadt",
    addressLine1: "Lieferadresse",
    addressLine1Placeholder:
      "Straße und Hausnummer",
    addressLine2: "Adresszusatz",
    addressLine2Placeholder:
      "Wohnung, Etage, Gebäude…",
    postalCode: "Postleitzahl",
    postalCodePlaceholder: "Ihre Postleitzahl",
    sameBillingAddress:
      "Lieferadresse auch als Rechnungsadresse verwenden",
    billingAddress: "Rechnungsadresse",
    differentBillingUnavailable:
      "Eine abweichende Rechnungsadresse ist noch nicht verfügbar.",
    deliveryCountryRequired:
      "Wählen Sie eines unserer acht Lieferländer.",
  },

  geo: {
    detectedTitle: "Land automatisch erkannt",
    detectedDescription:
      "Das Land wurde anhand Ihrer Verbindung vorgeschlagen. Sie können es ändern.",
    suggestedCountry: "Vorgeschlagenes Land",
    suggestedDialCode: "Vorgeschlagene Vorwahl",
    unavailableTitle:
      "Ländererkennung nicht verfügbar",
    unavailableDescription:
      "Wählen Sie Ihr Lieferland und Ihre Telefonvorwahl.",
    unsupportedTitle:
      "Erkanntes Land außerhalb unseres Liefergebiets",
    unsupportedDescription:
      "Bitte wählen Sie eines unserer verfügbaren Lieferländer.",
    manuallySelected: "Land manuell ausgewählt",
    changeCountry: "Land ändern",
    changeDialCode: "Vorwahl ändern",
  },

  cart: {
    title: "Bestellübersicht",
    summary: "Warenkorbübersicht",
    empty: "Ihr Warenkorb ist leer",
    emptyDescription:
      "Fügen Sie Produkte hinzu, bevor Sie bestellen.",
    product: "Produkt",
    products: "Produkte",
    distinctProducts: "Verschiedene Produkte",
    quantity: "Menge",
    unitPrice: "Einzelpreis",
    lineTotal: "Artikelgesamtpreis",
    decreaseQuantity: "Menge verringern",
    increaseQuantity: "Menge erhöhen",
    removeProduct: "Produkt entfernen",
    subtotal: "Zwischensumme",
    shipping: "Versand",
    shippingPending: "Wird berechnet",
    shippingUnavailable: "Versand nicht verfügbar",
    freeShipping: "Kostenlos",
    taxes: "Steuern",
    taxInformation:
      "Die geltenden Steuern hängen von der Bestellung ab.",
    total: "Gesamtbetrag",
    totalInclTax: "Gesamt inkl. Steuern",
    totalPending: "Gesamtbetrag noch offen",
    updateCart: "Warenkorb aktualisieren",
    cartUpdated: "Warenkorb aktualisiert",
    returnToCart: "Zurück zum Warenkorb",
    continueShopping: "Weiter einkaufen",
  },

  submit: {
    title: "Bestellung bestätigen",
    button: "Bestellung aufgeben",
    processing: "Wird verarbeitet…",
    validating: "Angaben werden geprüft…",
    saving: "Bestellung wird gespeichert…",
    submitting: "Bestellung wird übermittelt…",
    unavailable: "Bestellung nicht verfügbar",
    emptyCartDisabled:
      "Fügen Sie ein Produkt hinzu, um fortzufahren.",
    correctErrors:
      "Bitte korrigieren Sie die markierten Felder.",
    retry: "Bestellung erneut versuchen",
    notice:
      "Ihre Bestellung wird nach Prüfung Ihrer Angaben erfasst.",
    noPaymentNotice:
      "Der Eingang einer Bestellung bestätigt keinen Zahlungseingang.",
    termsIntro:
      "Mit Ihrer Bestellung akzeptieren Sie unsere",
    termsLink: "Allgemeinen Geschäftsbedingungen",
    privacyLink: "Datenschutzerklärung",
  },

  security: {
    title: "Ihre Daten sind geschützt",
    description:
      "Ihre Angaben werden zur Bearbeitung Ihrer Bestellung verwendet.",
    delivery: "Lieferung",
    deliveryDescription:
      "Abhängig vom Lieferland und den geltenden Bedingungen",
    payment: "Zahlung",
    paymentDescription:
      "Abhängig von den verfügbaren Zahlungsmethoden",
    returns: "Rückgabe",
    returnsDescription:
      "Gemäß den Verkaufsbedingungen",
    support: "Kundenservice",
    supportDescription:
      "Unterstützung bei Ihrer Bestellung",
  },

  confirmation: {
    eyebrow: "BESTELLUNG EINGEGANGEN",
    title: "Wir haben Ihre Bestellung erhalten",
    description:
      "Ihre Bestellung wurde erfasst.",
    orderNumber: "Bestellnummer",
    received: "Bestellung eingegangen",
    confirmationEmail:
      "Eine Bestätigung wird an Ihre E-Mail-Adresse gesendet.",
    emailPending:
      "Die E-Mail wird gesendet oder wartet auf den Versand.",
    nextSteps:
      "Unser Team informiert Sie über die nächsten Schritte.",
    paymentNotConfirmed:
      "Diese Bestätigung ist kein Zahlungsnachweis.",
    viewProducts: "Produkte ansehen",
    returnHome: "Zur Startseite",
    orderNotFound: "Bestellung nicht gefunden",
    protectedDetails:
      "Detaillierte Bestelldaten sind geschützt.",
  },

  statuses: {
    received: "Eingegangen",
    pendingPayment: "Zahlung ausstehend",
    confirmed: "Bestätigt",
    processing: "In Bearbeitung",
    shipped: "Versendet",
    delivered: "Zugestellt",
    cancelled: "Storniert",
    refunded: "Erstattet",
    notRequested: "Keine Zahlung angefordert",
    pending: "Ausstehend",
    paid: "Bezahlt",
    failed: "Fehlgeschlagen",
    partiallyRefunded: "Teilweise erstattet",
  },

  errors: {
    REQUIRED_OR_TOO_SHORT:
      "Dieses Feld ist erforderlich oder zu kurz.",
    REQUIRED: "Dieses Feld ist erforderlich.",
    TEXT_TOO_LONG: "Der Text ist zu lang.",
    INVALID_CHARACTERS:
      "Einige Zeichen sind nicht erlaubt.",
    EMAIL_REQUIRED:
      "Geben Sie Ihre E-Mail-Adresse ein.",
    EMAIL_TOO_LONG:
      "Die E-Mail-Adresse ist zu lang.",
    INVALID_EMAIL:
      "Geben Sie eine gültige E-Mail-Adresse ein.",
    PHONE_REQUIRED:
      "Geben Sie Ihre Telefonnummer ein.",
    PHONE_TOO_LONG:
      "Die Telefonnummer ist zu lang.",
    INVALID_PHONE:
      "Ungültige Telefonnummer.",
    INVALID_PHONE_INPUT:
      "Wählen Sie eine Vorwahl und geben Sie Ihre Nummer ein.",
    INVALID_PHONE_LENGTH:
      "Ungültige Länge der Telefonnummer.",
    INVALID_PHONE_CHARACTERS:
      "Die Telefonnummer enthält ungültige Zeichen.",
    INVALID_PHONE_NUMBER:
      "Diese Telefonnummer ist ungültig.",
    PHONE_COUNTRY_MISMATCH:
      "Die Vorwahl stimmt nicht mit dem Telefonland überein.",
    INVALID_E164_NUMBER:
      "Ungültiges internationales Telefonnummernformat.",
    PHONE_PARSING_FAILED:
      "Die Telefonnummer konnte nicht geprüft werden.",
    POSTAL_CODE_REQUIRED:
      "Geben Sie Ihre Postleitzahl ein.",
    INVALID_POSTAL_CODE:
      "Ungültiges Postleitzahlenformat.",
    CART_EMPTY:
      "Ihr Warenkorb enthält keine Produkte.",
    TOO_MANY_PRODUCTS:
      "Ihr Warenkorb enthält zu viele verschiedene Produkte.",
    PRODUCT_ID_REQUIRED:
      "Ein Produkt im Warenkorb ist ungültig.",
    PRODUCT_ID_TOO_LONG:
      "Eine Produktreferenz ist zu lang.",
    INVALID_PRODUCT_ID:
      "Ungültige Produktreferenz.",
    DUPLICATE_PRODUCT:
      "Ein Produkt ist mehrfach im Warenkorb enthalten.",
    INVALID_QUANTITY:
      "Ungültige Menge.",
    QUANTITY_TOO_HIGH:
      "Höchstmenge überschritten.",
    UNSUPPORTED_VARIANT:
      "Diese Produktvariante wird noch nicht unterstützt.",
    VARIANT_ID_TOO_LONG:
      "Die Variantenreferenz ist zu lang.",
    IDEMPOTENCY_KEY_TOO_SHORT:
      "Ungültige Bestellkennung.",
    IDEMPOTENCY_KEY_TOO_LONG:
      "Ungültige Bestellkennung.",
    INVALID_IDEMPOTENCY_KEY:
      "Ungültige Bestellkennung.",
    SEPARATE_BILLING_ADDRESS_NOT_SUPPORTED:
      "Eine abweichende Rechnungsadresse wird noch nicht unterstützt.",
    CHECKOUT_COUNTRY_NOT_SUPPORTED:
      "In dieses Land liefern wir nicht.",
    CHECKOUT_INVALID_LOCALE:
      "Die ausgewählte Sprache ist ungültig.",
    CHECKOUT_VALIDATION_FAILED:
      "Einige Angaben sind fehlerhaft.",
    VALIDATION_FAILED:
      "Die Angaben konnten nicht geprüft werden.",
    PRODUCT_NOT_FOUND:
      "Ein Produkt im Warenkorb wurde nicht gefunden.",
    PRODUCT_NOT_PURCHASABLE:
      "Ein Produkt kann derzeit nicht bestellt werden.",
    PRODUCT_PRICE_UNAVAILABLE:
      "Ein Produktpreis ist nicht verfügbar.",
    PRODUCT_CURRENCY_UNSUPPORTED:
      "Eine Produktwährung wird nicht unterstützt.",
    SHIPPING_NOT_CONFIGURED:
      "Die Versandkosten sind für dieses Land noch nicht verfügbar.",
    INVALID_SHIPPING:
      "Versandkosten konnten nicht berechnet werden.",
    AMOUNT_OVERFLOW:
      "Der Bestellbetrag überschreitet das zulässige Limit.",
    CHECKOUT_IDEMPOTENCY_CONFLICT:
      "Dieser Bestellversuch wurde bereits mit anderen Angaben verwendet.",
    CHECKOUT_ORDER_NOT_FOUND:
      "Bestellung nicht gefunden.",
    NETWORK_ERROR:
      "Verbindungsproblem. Bitte versuchen Sie es erneut.",
    SERVER_ERROR:
      "Ein Serverfehler ist aufgetreten.",
    UNKNOWN_ERROR:
      "Ein unerwarteter Fehler ist aufgetreten.",
  },

  accessibility: {
    requiredField: "Pflichtfeld",
    selectCountry: "Lieferland auswählen",
    selectPhoneCountry: "Telefonland auswählen",
    orderSummary: "Ihre Bestellübersicht",
    loading: "Wird geladen",
    invalidField: "Ungültiges Feld",
    stepProgress: "Bestellfortschritt",
  },
};

// ============================================================
// 6. ITALIEN
// ============================================================

const it: CheckoutTranslations = {
  common: {
    brand: "CYCLORIVA",
    required: "Obbligatorio",
    optional: "Facoltativo",
    loading: "Caricamento…",
    retry: "Riprova",
    close: "Chiudi",
    edit: "Modifica",
    remove: "Rimuovi",
    save: "Salva",
    cancel: "Annulla",
    continue: "Continua",
    back: "Indietro",
    yes: "Sì",
    no: "No",
    currency: "EUR",
  },

  page: {
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    title: "Completa il tuo ordine",
    description:
      "Controlla il carrello e inserisci i tuoi dati per effettuare l'ordine.",
    breadcrumbHome: "Home",
    breadcrumbCart: "Carrello",
    breadcrumbCheckout: "Ordine",
    pageAriaLabel: "Completamento dell'ordine",
  },

  steps: {
    cart: "Carrello",
    information: "Informazioni di consegna",
    confirmation: "Conferma",
    currentStep: "Fase attuale",
    completedStep: "Fase completata",
  },

  customer: {
    title: "Informazioni personali",
    firstName: "Nome",
    lastName: "Cognome",
    email: "Indirizzo e-mail",
    phone: "Telefono",
    phoneCountry: "Paese del telefono",
    phoneDialCode: "Prefisso internazionale",
    firstNamePlaceholder: "Il tuo nome",
    lastNamePlaceholder: "Il tuo cognome",
    emailPlaceholder: "tua@email.com",
    phonePlaceholder: "Il tuo numero di telefono",
    phoneHelp:
      "Puoi modificare il prefisso indipendentemente dal paese di consegna.",
  },

  delivery: {
    title: "Indirizzo di consegna",
    country: "Paese",
    selectCountry: "Seleziona un paese",
    city: "Città",
    cityPlaceholder: "La tua città",
    addressLine1: "Indirizzo di consegna",
    addressLine1Placeholder:
      "Via e numero civico",
    addressLine2: "Dettagli dell'indirizzo",
    addressLine2Placeholder:
      "Appartamento, piano, edificio…",
    postalCode: "Codice postale",
    postalCodePlaceholder: "Il tuo codice postale",
    sameBillingAddress:
      "Usa lo stesso indirizzo per la fatturazione",
    billingAddress: "Indirizzo di fatturazione",
    differentBillingUnavailable:
      "Un indirizzo di fatturazione diverso non è ancora disponibile.",
    deliveryCountryRequired:
      "Scegli uno degli otto paesi di consegna.",
  },

  geo: {
    detectedTitle: "Paese rilevato automaticamente",
    detectedDescription:
      "Paese suggerito in base alla tua connessione. Puoi modificarlo.",
    suggestedCountry: "Paese suggerito",
    suggestedDialCode: "Prefisso suggerito",
    unavailableTitle:
      "Rilevamento del paese non disponibile",
    unavailableDescription:
      "Seleziona il paese di consegna e il prefisso telefonico.",
    unsupportedTitle:
      "Paese rilevato fuori dall'area di consegna",
    unsupportedDescription:
      "Scegli una delle destinazioni disponibili.",
    manuallySelected: "Paese selezionato manualmente",
    changeCountry: "Cambia paese",
    changeDialCode: "Cambia prefisso",
  },

  cart: {
    title: "Riepilogo dell'ordine",
    summary: "Riepilogo del carrello",
    empty: "Il tuo carrello è vuoto",
    emptyDescription:
      "Aggiungi prodotti prima di effettuare l'ordine.",
    product: "prodotto",
    products: "prodotti",
    distinctProducts: "Prodotti diversi",
    quantity: "Quantità",
    unitPrice: "Prezzo unitario",
    lineTotal: "Totale articolo",
    decreaseQuantity: "Diminuisci la quantità",
    increaseQuantity: "Aumenta la quantità",
    removeProduct: "Rimuovi questo prodotto",
    subtotal: "Subtotale",
    shipping: "Spedizione",
    shippingPending: "Da calcolare",
    shippingUnavailable: "Spedizione non disponibile",
    freeShipping: "Gratuita",
    taxes: "Imposte",
    taxInformation:
      "Le imposte applicabili dipendono dall'ordine.",
    total: "Totale",
    totalInclTax: "Totale imposte incluse",
    totalPending: "Totale da confermare",
    updateCart: "Aggiorna carrello",
    cartUpdated: "Carrello aggiornato",
    returnToCart: "Torna al carrello",
    continueShopping: "Continua gli acquisti",
  },

  submit: {
    title: "Conferma dell'ordine",
    button: "Conferma l'ordine",
    processing: "Elaborazione in corso…",
    validating: "Verifica dei dati…",
    saving: "Salvataggio dell'ordine…",
    submitting: "Invio dell'ordine…",
    unavailable: "Ordine non disponibile",
    emptyCartDisabled:
      "Aggiungi un prodotto per continuare.",
    correctErrors:
      "Correggi i campi evidenziati.",
    retry: "Riprova a inviare l'ordine",
    notice:
      "L'ordine verrà registrato dopo la verifica dei dati.",
    noPaymentNotice:
      "La ricezione di un ordine non significa che il pagamento sia stato effettuato.",
    termsIntro:
      "Confermando l'ordine accetti le nostre",
    termsLink: "condizioni generali di vendita",
    privacyLink: "informativa sulla privacy",
  },

  security: {
    title: "I tuoi dati sono protetti",
    description:
      "I tuoi dati vengono utilizzati per gestire l'ordine.",
    delivery: "Consegna",
    deliveryDescription:
      "In base al paese e alle condizioni applicabili",
    payment: "Pagamento",
    paymentDescription:
      "In base ai metodi effettivamente disponibili",
    returns: "Resi",
    returnsDescription:
      "Secondo le condizioni di vendita",
    support: "Assistenza clienti",
    supportDescription:
      "Supporto per il tuo ordine",
  },

  confirmation: {
    eyebrow: "ORDINE RICEVUTO",
    title: "Abbiamo ricevuto il tuo ordine",
    description:
      "La tua richiesta d'ordine è stata registrata.",
    orderNumber: "Numero d'ordine",
    received: "Ordine ricevuto",
    confirmationEmail:
      "Una conferma sarà inviata al tuo indirizzo e-mail.",
    emailPending:
      "L'e-mail è in invio o in attesa.",
    nextSteps:
      "Il nostro team ti informerà sui prossimi passaggi.",
    paymentNotConfirmed:
      "Questa conferma non è una prova di pagamento.",
    viewProducts: "Vedi i prodotti",
    returnHome: "Torna alla home",
    orderNotFound: "Ordine non trovato",
    protectedDetails:
      "I dettagli dell'ordine sono protetti.",
  },

  statuses: {
    received: "Ricevuto",
    pendingPayment: "In attesa di pagamento",
    confirmed: "Confermato",
    processing: "In preparazione",
    shipped: "Spedito",
    delivered: "Consegnato",
    cancelled: "Annullato",
    refunded: "Rimborsato",
    notRequested: "Pagamento non richiesto",
    pending: "In attesa",
    paid: "Pagato",
    failed: "Non riuscito",
    partiallyRefunded: "Parzialmente rimborsato",
  },

  errors: {
    REQUIRED_OR_TOO_SHORT:
      "Questo campo è obbligatorio o troppo corto.",
    REQUIRED: "Questo campo è obbligatorio.",
    TEXT_TOO_LONG: "Il testo è troppo lungo.",
    INVALID_CHARACTERS:
      "Alcuni caratteri non sono consentiti.",
    EMAIL_REQUIRED:
      "Inserisci il tuo indirizzo e-mail.",
    EMAIL_TOO_LONG:
      "L'indirizzo e-mail è troppo lungo.",
    INVALID_EMAIL:
      "Inserisci un indirizzo e-mail valido.",
    PHONE_REQUIRED:
      "Inserisci il tuo numero di telefono.",
    PHONE_TOO_LONG:
      "Il numero di telefono è troppo lungo.",
    INVALID_PHONE:
      "Numero di telefono non valido.",
    INVALID_PHONE_INPUT:
      "Seleziona il prefisso e inserisci il numero.",
    INVALID_PHONE_LENGTH:
      "Lunghezza del numero non valida.",
    INVALID_PHONE_CHARACTERS:
      "Il numero contiene caratteri non validi.",
    INVALID_PHONE_NUMBER:
      "Questo numero di telefono non è valido.",
    PHONE_COUNTRY_MISMATCH:
      "Il prefisso non corrisponde al paese del telefono.",
    INVALID_E164_NUMBER:
      "Formato internazionale del numero non valido.",
    PHONE_PARSING_FAILED:
      "Impossibile verificare il numero.",
    POSTAL_CODE_REQUIRED:
      "Inserisci il codice postale.",
    INVALID_POSTAL_CODE:
      "Formato del codice postale non valido.",
    CART_EMPTY:
      "Il carrello non contiene prodotti.",
    TOO_MANY_PRODUCTS:
      "Il carrello contiene troppi prodotti diversi.",
    PRODUCT_ID_REQUIRED:
      "Un prodotto nel carrello non è valido.",
    PRODUCT_ID_TOO_LONG:
      "Il riferimento di un prodotto è troppo lungo.",
    INVALID_PRODUCT_ID:
      "Riferimento del prodotto non valido.",
    DUPLICATE_PRODUCT:
      "Un prodotto appare più volte nel carrello.",
    INVALID_QUANTITY:
      "Quantità non valida.",
    QUANTITY_TOO_HIGH:
      "Quantità massima superata.",
    UNSUPPORTED_VARIANT:
      "Questa variante non è ancora supportata.",
    VARIANT_ID_TOO_LONG:
      "Il riferimento della variante è troppo lungo.",
    IDEMPOTENCY_KEY_TOO_SHORT:
      "Identificativo dell'ordine non valido.",
    IDEMPOTENCY_KEY_TOO_LONG:
      "Identificativo dell'ordine non valido.",
    INVALID_IDEMPOTENCY_KEY:
      "Identificativo dell'ordine non valido.",
    SEPARATE_BILLING_ADDRESS_NOT_SUPPORTED:
      "Un indirizzo di fatturazione separato non è ancora supportato.",
    CHECKOUT_COUNTRY_NOT_SUPPORTED:
      "La consegna non è disponibile in questo paese.",
    CHECKOUT_INVALID_LOCALE:
      "La lingua selezionata non è valida.",
    CHECKOUT_VALIDATION_FAILED:
      "Alcuni dati non sono corretti.",
    VALIDATION_FAILED:
      "Impossibile verificare i dati.",
    PRODUCT_NOT_FOUND:
      "Un prodotto nel carrello non è stato trovato.",
    PRODUCT_NOT_PURCHASABLE:
      "Un prodotto non può essere ordinato al momento.",
    PRODUCT_PRICE_UNAVAILABLE:
      "Il prezzo di un prodotto non è disponibile.",
    PRODUCT_CURRENCY_UNSUPPORTED:
      "Una valuta del prodotto non è supportata.",
    SHIPPING_NOT_CONFIGURED:
      "Le spese di spedizione non sono ancora disponibili per questo paese.",
    INVALID_SHIPPING:
      "Impossibile calcolare le spese di spedizione.",
    AMOUNT_OVERFLOW:
      "L'importo supera il limite consentito.",
    CHECKOUT_IDEMPOTENCY_CONFLICT:
      "Questo tentativo d'ordine è già stato usato con dati diversi.",
    CHECKOUT_ORDER_NOT_FOUND:
      "Ordine non trovato.",
    NETWORK_ERROR:
      "Problema di connessione. Riprova.",
    SERVER_ERROR:
      "Si è verificato un errore del server.",
    UNKNOWN_ERROR:
      "Si è verificato un errore imprevisto.",
  },

  accessibility: {
    requiredField: "Campo obbligatorio",
    selectCountry: "Seleziona il paese di consegna",
    selectPhoneCountry:
      "Seleziona il paese del telefono",
    orderSummary: "Riepilogo del tuo ordine",
    loading: "Caricamento in corso",
    invalidField: "Campo non valido",
    stepProgress: "Avanzamento dell'ordine",
  },
};

// ============================================================
// 7. ESPAGNOL
// ============================================================

const es: CheckoutTranslations = {
  common: {
    brand: "CYCLORIVA",
    required: "Obligatorio",
    optional: "Opcional",
    loading: "Cargando…",
    retry: "Reintentar",
    close: "Cerrar",
    edit: "Editar",
    remove: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    continue: "Continuar",
    back: "Volver",
    yes: "Sí",
    no: "No",
    currency: "EUR",
  },

  page: {
    eyebrow: "BICICLETAS & E-MOVILIDAD EN EUROPA",
    title: "Finalizar mi pedido",
    description:
      "Revisa tu carrito e introduce tus datos para realizar el pedido.",
    breadcrumbHome: "Inicio",
    breadcrumbCart: "Carrito",
    breadcrumbCheckout: "Pedido",
    pageAriaLabel: "Finalización del pedido",
  },

  steps: {
    cart: "Carrito",
    information: "Información de entrega",
    confirmation: "Confirmación",
    currentStep: "Paso actual",
    completedStep: "Paso completado",
  },

  customer: {
    title: "Información personal",
    firstName: "Nombre",
    lastName: "Apellidos",
    email: "Correo electrónico",
    phone: "Teléfono",
    phoneCountry: "País del teléfono",
    phoneDialCode: "Prefijo internacional",
    firstNamePlaceholder: "Tu nombre",
    lastNamePlaceholder: "Tus apellidos",
    emailPlaceholder: "tu@email.com",
    phonePlaceholder: "Tu número de teléfono",
    phoneHelp:
      "Puedes cambiar el prefijo independientemente del país de entrega.",
  },

  delivery: {
    title: "Dirección de entrega",
    country: "País",
    selectCountry: "Selecciona un país",
    city: "Ciudad",
    cityPlaceholder: "Tu ciudad",
    addressLine1: "Dirección de entrega",
    addressLine1Placeholder:
      "Calle y número",
    addressLine2: "Información adicional",
    addressLine2Placeholder:
      "Piso, apartamento, edificio…",
    postalCode: "Código postal",
    postalCodePlaceholder: "Tu código postal",
    sameBillingAddress:
      "Usar la misma dirección para facturación",
    billingAddress: "Dirección de facturación",
    differentBillingUnavailable:
      "Aún no está disponible una dirección de facturación diferente.",
    deliveryCountryRequired:
      "Selecciona uno de nuestros ocho países de entrega.",
  },

  geo: {
    detectedTitle: "País detectado automáticamente",
    detectedDescription:
      "País sugerido según tu conexión. Puedes cambiarlo.",
    suggestedCountry: "País sugerido",
    suggestedDialCode: "Prefijo sugerido",
    unavailableTitle:
      "Detección de país no disponible",
    unavailableDescription:
      "Selecciona tu país de entrega y el prefijo telefónico.",
    unsupportedTitle:
      "País detectado fuera de nuestra zona de entrega",
    unsupportedDescription:
      "Elige uno de nuestros destinos disponibles.",
    manuallySelected: "País seleccionado manualmente",
    changeCountry: "Cambiar país",
    changeDialCode: "Cambiar prefijo",
  },

  cart: {
    title: "Resumen del pedido",
    summary: "Resumen del carrito",
    empty: "Tu carrito está vacío",
    emptyDescription:
      "Añade productos antes de realizar un pedido.",
    product: "producto",
    products: "productos",
    distinctProducts: "Productos diferentes",
    quantity: "Cantidad",
    unitPrice: "Precio unitario",
    lineTotal: "Total del producto",
    decreaseQuantity: "Reducir cantidad",
    increaseQuantity: "Aumentar cantidad",
    removeProduct: "Eliminar este producto",
    subtotal: "Subtotal",
    shipping: "Envío",
    shippingPending: "Por calcular",
    shippingUnavailable: "Envío no disponible",
    freeShipping: "Gratis",
    taxes: "Impuestos",
    taxInformation:
      "Los impuestos aplicables dependen del pedido.",
    total: "Total",
    totalInclTax: "Total con impuestos",
    totalPending: "Total pendiente de confirmar",
    updateCart: "Actualizar carrito",
    cartUpdated: "Carrito actualizado",
    returnToCart: "Volver al carrito",
    continueShopping: "Seguir comprando",
  },

  submit: {
    title: "Confirmación del pedido",
    button: "Confirmar pedido",
    processing: "Procesando…",
    validating: "Verificando tus datos…",
    saving: "Guardando el pedido…",
    submitting: "Enviando el pedido…",
    unavailable: "Pedido no disponible",
    emptyCartDisabled:
      "Añade un producto para continuar.",
    correctErrors:
      "Corrige los campos indicados.",
    retry: "Reintentar el pedido",
    notice:
      "El pedido se registrará después de verificar tus datos.",
    noPaymentNotice:
      "Recibir un pedido no significa que el pago se haya realizado.",
    termsIntro:
      "Al confirmar el pedido, aceptas nuestras",
    termsLink: "condiciones generales de venta",
    privacyLink: "política de privacidad",
  },

  security: {
    title: "Tus datos están protegidos",
    description:
      "Tus datos se utilizan para gestionar tu pedido.",
    delivery: "Entrega",
    deliveryDescription:
      "Según el país y las condiciones aplicables",
    payment: "Pago",
    paymentDescription:
      "Según los métodos realmente disponibles",
    returns: "Devoluciones",
    returnsDescription:
      "Según las condiciones de venta",
    support: "Atención al cliente",
    supportDescription:
      "Asistencia con tu pedido",
  },

  confirmation: {
    eyebrow: "PEDIDO RECIBIDO",
    title: "Hemos recibido tu pedido",
    description:
      "Tu solicitud de pedido ha sido registrada.",
    orderNumber: "Número de pedido",
    received: "Pedido recibido",
    confirmationEmail:
      "Se enviará una confirmación a tu correo electrónico.",
    emailPending:
      "El correo está enviándose o pendiente de envío.",
    nextSteps:
      "Nuestro equipo te informará de los siguientes pasos.",
    paymentNotConfirmed:
      "Esta confirmación no constituye un comprobante de pago.",
    viewProducts: "Ver productos",
    returnHome: "Volver al inicio",
    orderNotFound: "Pedido no encontrado",
    protectedDetails:
      "Los datos detallados del pedido están protegidos.",
  },

  statuses: {
    received: "Recibido",
    pendingPayment: "Pendiente de pago",
    confirmed: "Confirmado",
    processing: "En preparación",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    refunded: "Reembolsado",
    notRequested: "Pago no solicitado",
    pending: "Pendiente",
    paid: "Pagado",
    failed: "Fallido",
    partiallyRefunded: "Reembolso parcial",
  },

  errors: {
    REQUIRED_OR_TOO_SHORT:
      "Este campo es obligatorio o demasiado corto.",
    REQUIRED: "Este campo es obligatorio.",
    TEXT_TOO_LONG: "El texto es demasiado largo.",
    INVALID_CHARACTERS:
      "Algunos caracteres no están permitidos.",
    EMAIL_REQUIRED:
      "Introduce tu correo electrónico.",
    EMAIL_TOO_LONG:
      "El correo electrónico es demasiado largo.",
    INVALID_EMAIL:
      "Introduce un correo electrónico válido.",
    PHONE_REQUIRED:
      "Introduce tu número de teléfono.",
    PHONE_TOO_LONG:
      "El número de teléfono es demasiado largo.",
    INVALID_PHONE:
      "Número de teléfono no válido.",
    INVALID_PHONE_INPUT:
      "Selecciona el prefijo e introduce tu número.",
    INVALID_PHONE_LENGTH:
      "Longitud del número incorrecta.",
    INVALID_PHONE_CHARACTERS:
      "El número contiene caracteres no válidos.",
    INVALID_PHONE_NUMBER:
      "Este número de teléfono no es válido.",
    PHONE_COUNTRY_MISMATCH:
      "El prefijo no corresponde al país del teléfono.",
    INVALID_E164_NUMBER:
      "Formato internacional del número no válido.",
    PHONE_PARSING_FAILED:
      "No se pudo verificar el número.",
    POSTAL_CODE_REQUIRED:
      "Introduce tu código postal.",
    INVALID_POSTAL_CODE:
      "Formato de código postal incorrecto.",
    CART_EMPTY:
      "Tu carrito no contiene productos.",
    TOO_MANY_PRODUCTS:
      "El carrito contiene demasiados productos diferentes.",
    PRODUCT_ID_REQUIRED:
      "Un producto del carrito no es válido.",
    PRODUCT_ID_TOO_LONG:
      "La referencia de un producto es demasiado larga.",
    INVALID_PRODUCT_ID:
      "Referencia de producto no válida.",
    DUPLICATE_PRODUCT:
      "Un producto aparece varias veces en el carrito.",
    INVALID_QUANTITY:
      "Cantidad no válida.",
    QUANTITY_TOO_HIGH:
      "Cantidad máxima superada.",
    UNSUPPORTED_VARIANT:
      "Esta variante del producto aún no es compatible.",
    VARIANT_ID_TOO_LONG:
      "La referencia de la variante es demasiado larga.",
    IDEMPOTENCY_KEY_TOO_SHORT:
      "Identificador de pedido no válido.",
    IDEMPOTENCY_KEY_TOO_LONG:
      "Identificador de pedido no válido.",
    INVALID_IDEMPOTENCY_KEY:
      "Identificador de pedido no válido.",
    SEPARATE_BILLING_ADDRESS_NOT_SUPPORTED:
      "Aún no se admite una dirección de facturación diferente.",
    CHECKOUT_COUNTRY_NOT_SUPPORTED:
      "No realizamos entregas en este país.",
    CHECKOUT_INVALID_LOCALE:
      "El idioma seleccionado no es válido.",
    CHECKOUT_VALIDATION_FAILED:
      "Algunos datos son incorrectos.",
    VALIDATION_FAILED:
      "No se pudieron validar los datos.",
    PRODUCT_NOT_FOUND:
      "No se encontró un producto del carrito.",
    PRODUCT_NOT_PURCHASABLE:
      "Un producto no puede pedirse actualmente.",
    PRODUCT_PRICE_UNAVAILABLE:
      "El precio de un producto no está disponible.",
    PRODUCT_CURRENCY_UNSUPPORTED:
      "No se admite la moneda de un producto.",
    SHIPPING_NOT_CONFIGURED:
      "Los gastos de envío aún no están disponibles para este país.",
    INVALID_SHIPPING:
      "No se pudieron calcular los gastos de envío.",
    AMOUNT_OVERFLOW:
      "El importe supera el límite permitido.",
    CHECKOUT_IDEMPOTENCY_CONFLICT:
      "Este intento de pedido ya se utilizó con información diferente.",
    CHECKOUT_ORDER_NOT_FOUND:
      "Pedido no encontrado.",
    NETWORK_ERROR:
      "Problema de conexión. Inténtalo de nuevo.",
    SERVER_ERROR:
      "Se produjo un error del servidor.",
    UNKNOWN_ERROR:
      "Se produjo un error inesperado.",
  },

  accessibility: {
    requiredField: "Campo obligatorio",
    selectCountry: "Seleccionar país de entrega",
    selectPhoneCountry:
      "Seleccionar país del teléfono",
    orderSummary: "Resumen de tu pedido",
    loading: "Cargando",
    invalidField: "Campo no válido",
    stepProgress: "Progreso del pedido",
  },
};

// ============================================================
// 8. REGISTRE CENTRAL DES LANGUES
// ============================================================

export const CHECKOUT_TRANSLATIONS: Record<
  CheckoutLocale,
  CheckoutTranslations
> = {
  fr,
  en,
  de,
  it,
  es,
};

// ============================================================
// 9. VÉRIFIER UNE LANGUE
// ============================================================

const CHECKOUT_LOCALE_SET: ReadonlySet<string> =
  new Set(CHECKOUT_LOCALES);

export function isCheckoutLocale(
  value: unknown
): value is CheckoutLocale {
  return (
    typeof value === "string" &&
    CHECKOUT_LOCALE_SET.has(value)
  );
}

// ============================================================
// 10. NORMALISER UNE LANGUE
// ============================================================

export function normalizeCheckoutLocale(
  value: unknown
): CheckoutLocale {
  if (typeof value !== "string") {
    return DEFAULT_CHECKOUT_LOCALE;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace("_", "-")
    .split("-")[0];

  return isCheckoutLocale(normalized)
    ? normalized
    : DEFAULT_CHECKOUT_LOCALE;
}

// ============================================================
// 11. OBTENIR LES TRADUCTIONS
// ============================================================

export function getCheckoutTranslations(
  locale: unknown
): CheckoutTranslations {
  const language =
    normalizeCheckoutLocale(locale);

  return CHECKOUT_TRANSLATIONS[language];
}

// ============================================================
// 12. TRADUIRE UNE ERREUR
// ============================================================
//
// Les validations Zod et les API peuvent
// retourner des codes d'erreur.
//
// Cette fonction transforme un code
// en message compréhensible par le client.
//
// Aucun détail sensible du serveur
// ne doit être affiché directement.
//
// ============================================================

export type CheckoutTranslationErrorCode =
  keyof CheckoutTranslations["errors"];

export function translateCheckoutError(
  code: unknown,
  locale: unknown = "fr"
): string {
  const t = getCheckoutTranslations(locale);

  if (typeof code !== "string") {
    return t.errors.UNKNOWN_ERROR;
  }

  if (code === "PRICE_CHANGED") return {
    fr: "Le montant a changé. Vérifiez le récapitulatif avant de confirmer à nouveau.",
    en: "The amount has changed. Review the summary before confirming again.",
    de: "Der Betrag hat sich geändert. Prüfen Sie die Übersicht vor der erneuten Bestätigung.",
    it: "L’importo è cambiato. Controlla il riepilogo prima di confermare di nuovo.",
    es: "El importe ha cambiado. Revisa el resumen antes de volver a confirmar.",
  }[normalizeCheckoutLocale(locale)];

  if (code === "TOO_MANY_REQUESTS") return {
    fr: "Trop de tentatives. Réessayez dans une minute.",
    en: "Too many attempts. Please try again in a minute.",
    de: "Zu viele Versuche. Bitte versuchen Sie es in einer Minute erneut.",
    it: "Troppi tentativi. Riprova tra un minuto.",
    es: "Demasiados intentos. Vuelve a intentarlo en un minuto.",
  }[normalizeCheckoutLocale(locale)];

  if (
    Object.prototype.hasOwnProperty.call(
      t.errors,
      code
    )
  ) {
    return t.errors[
      code as CheckoutTranslationErrorCode
    ];
  }

  return t.errors.UNKNOWN_ERROR;
}

// ============================================================
// 13. TRADUIRE LES STATUTS DE COMMANDE
// ============================================================

export type CheckoutOrderStatusCode =
  | "RECEIVED"
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export function translateCheckoutOrderStatus(
  status: CheckoutOrderStatusCode | string,
  locale: unknown = "fr"
): string {
  const t = getCheckoutTranslations(locale);

  const statuses: Record<
    CheckoutOrderStatusCode,
    string
  > = {
    RECEIVED: t.statuses.received,
    PENDING_PAYMENT:
      t.statuses.pendingPayment,
    CONFIRMED: t.statuses.confirmed,
    PROCESSING: t.statuses.processing,
    SHIPPED: t.statuses.shipped,
    DELIVERED: t.statuses.delivered,
    CANCELLED: t.statuses.cancelled,
    REFUNDED: t.statuses.refunded,
  };

  if (
    Object.prototype.hasOwnProperty.call(
      statuses,
      status
    )
  ) {
    return statuses[
      status as CheckoutOrderStatusCode
    ];
  }

  return t.errors.UNKNOWN_ERROR;
}

// ============================================================
// 14. TRADUIRE LES STATUTS DE PAIEMENT
// ============================================================

export type CheckoutPaymentStatusCode =
  | "NOT_REQUESTED"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export function translateCheckoutPaymentStatus(
  status: CheckoutPaymentStatusCode | string,
  locale: unknown = "fr"
): string {
  const t = getCheckoutTranslations(locale);

  const statuses: Record<
    CheckoutPaymentStatusCode,
    string
  > = {
    NOT_REQUESTED:
      t.statuses.notRequested,
    PENDING: t.statuses.pending,
    PAID: t.statuses.paid,
    FAILED: t.statuses.failed,
    REFUNDED: t.statuses.refunded,
    PARTIALLY_REFUNDED:
      t.statuses.partiallyRefunded,
  };

  if (
    Object.prototype.hasOwnProperty.call(
      statuses,
      status
    )
  ) {
    return statuses[
      status as CheckoutPaymentStatusCode
    ];
  }

  return t.errors.UNKNOWN_ERROR;
}

// ============================================================
// 15. NOMBRE DE PRODUITS DANS LE PANIER
// ============================================================

export function formatCheckoutProductCount(
  count: number,
  locale: unknown = "fr"
): string {
  const t = getCheckoutTranslations(locale);

  const safeCount =
    Number.isSafeInteger(count) &&
    count >= 0
      ? count
      : 0;

  return `${safeCount} ${
    safeCount === 1
      ? t.cart.product
      : t.cart.products
  }`;
}

// ============================================================
// 16. FORMATER LES PRIX
// ============================================================
//
// Affichage uniquement.
//
// Les calculs réels restent dans :
// lib/checkout-pricing.ts
//
// Le montant reçu est en centimes.
//
// ============================================================

const CHECKOUT_INTL_LOCALES: Record<
  CheckoutLocale,
  string
> = {
  fr: "fr-FR",
  en: "en-GB",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
};

export function formatCheckoutCurrency(
  cents: number,
  locale: unknown = "fr"
): string {
  const language =
    normalizeCheckoutLocale(locale);

  const safeCents =
    Number.isSafeInteger(cents) &&
    cents >= 0
      ? cents
      : 0;

  return new Intl.NumberFormat(
    CHECKOUT_INTL_LOCALES[language],
    {
      style: "currency",
      currency: "EUR",
    }
  ).format(safeCents / 100);
}

// ============================================================
// 17. FORMATER LES DATES
// ============================================================

export function formatCheckoutDate(
  date: Date | string,
  locale: unknown = "fr"
): string {
  const language =
    normalizeCheckoutLocale(locale);

  const parsed =
    date instanceof Date
      ? date
      : new Date(date);

  if (
    Number.isNaN(parsed.getTime())
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    CHECKOUT_INTL_LOCALES[language],
    {
      dateStyle: "long",
      timeZone: "UTC",
    }
  ).format(parsed);
}

// ============================================================
// 18. OBTENIR LES TEXTES D'UNE SECTION
// ============================================================

export type CheckoutTranslationSection =
  keyof CheckoutTranslations;

export function getCheckoutTranslationSection<
  T extends CheckoutTranslationSection
>(
  locale: unknown,
  section: T
): CheckoutTranslations[T] {
  const translations =
    getCheckoutTranslations(locale);

  return translations[section];
}

// ============================================================
// 19. VÉRIFICATION DE DISPONIBILITÉ
// ============================================================

export function getCheckoutAvailableLocales():
  CheckoutLocale[] {
  return [...CHECKOUT_LOCALES];
}

// ============================================================
// FIN — CYCLORIVA CHECKOUT I18N
// ============================================================
