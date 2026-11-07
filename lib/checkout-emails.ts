
import "server-only";

/**
 * ============================================================
 * CYCLORIVA — E-MAILS AUTOMATIQUES DE COMMANDE
 * ============================================================
 *
 * Fichier : lib/checkout-emails.ts
 *
 * Next.js 16 — TypeScript — Resend
 *
 * FONCTIONS :
 * - E-mail de confirmation au client
 * - Notification de nouvelle commande à l'admin
 * - Templates HTML professionnels
 * - Versions texte pour les messageries
 * - Traduction client : FR, EN, DE, IT, ES
 * - Message administrateur en français
 * - Informations complètes de commande
 * - Protection contre l'injection HTML
 * - Clés d'idempotence Resend
 *
 * IMPORTANT :
 * - Utilisation côté serveur uniquement.
 * - Ne jamais appeler ce module depuis le navigateur.
 * - La commande doit exister en base avant l'envoi.
 * - Une réponse Resend signifie que le prestataire
 *   a accepté le message, pas qu'il est livré.
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

export type CheckoutEmailLocale =
  | "fr"
  | "en"
  | "de"
  | "it"
  | "es";

export type CheckoutEmailKind =
  | "CUSTOMER_CONFIRMATION"
  | "ADMIN_NOTIFICATION";

export type CheckoutEmailOrderItem = {
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  currency: string;
};

export type CheckoutEmailOrder = {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneDialCode: string;
  phoneNational: string;
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
  status: string;
  paymentStatus: string;
  createdAt: Date | string;
  items: CheckoutEmailOrderItem[];
};

export type CheckoutEmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type CheckoutEmailSendResult = {
  success: true;
  type: CheckoutEmailKind;
  recipientEmail: string;
  providerMessageId: string;
};

export type CheckoutEmailDispatchResult = {
  customer:
    | CheckoutEmailSendResult
    | { success: false; error: string };

  admin:
    | CheckoutEmailSendResult
    | { success: false; error: string };
};

type EmailTranslations = {
  subject: string;
  eyebrow: string;
  title: string;
  greeting: string;
  intro: string;
  orderNumber: string;
  orderDate: string;
  orderSummary: string;
  product: string;
  reference: string;
  quantity: string;
  unitPrice: string;
  lineTotal: string;
  subtotal: string;
  shipping: string;
  taxesIncluded: string;
  total: string;
  customer: string;
  email: string;
  phone: string;
  delivery: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  orderStatus: string;
  paymentStatus: string;
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
  nextSteps: string;
  footer: string;
  thankYou: string;
};

// ============================================================
// 2. CONFIGURATION DES LANGUES
// ============================================================

const EMAIL_LOCALES: Record<
  CheckoutEmailLocale,
  string
> = {
  fr: "fr-FR",
  en: "en-GB",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
};

const TRANSLATIONS: Record<
  CheckoutEmailLocale,
  EmailTranslations
> = {
  fr: {
    subject: "Confirmation de réception de votre commande",
    eyebrow: "CONFIRMATION DE COMMANDE",
    title: "Nous avons reçu votre commande",
    greeting: "Bonjour",
    intro:
      "Votre commande a bien été enregistrée. Voici le récapitulatif des informations que vous nous avez communiquées.",
    orderNumber: "Numéro de commande",
    orderDate: "Date de commande",
    orderSummary: "Récapitulatif de la commande",
    product: "Produit",
    reference: "Référence",
    quantity: "Qté",
    unitPrice: "Prix unitaire",
    lineTotal: "Total",
    subtotal: "Sous-total des produits",
    shipping: "Frais de livraison",
    taxesIncluded: "Taxes (montant informatif)",
    total: "TOTAL DE LA COMMANDE",
    customer: "Informations du client",
    email: "Adresse e-mail",
    phone: "Téléphone",
    delivery: "Adresse de livraison",
    country: "Pays",
    city: "Ville",
    postalCode: "Code postal",
    address: "Adresse",
    orderStatus: "Statut de la commande",
    paymentStatus: "Statut du paiement",
    received: "Commande reçue",
    pendingPayment: "En attente de paiement",
    confirmed: "Commande confirmée",
    processing: "En préparation",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
    refunded: "Remboursée",
    notRequested: "Paiement non demandé",
    pending: "En attente",
    paid: "Payé",
    failed: "Échec du paiement",
    partiallyRefunded: "Partiellement remboursé",
    nextSteps:
      "Notre équipe examinera votre commande et vous informera des prochaines étapes. La réception de cet e-mail ne constitue pas une confirmation de paiement.",
    footer:
      "Cet e-mail concerne une commande effectuée sur CYCLORIVA.",
    thankYou: "Merci pour votre confiance.",
  },

  en: {
    subject: "We have received your order",
    eyebrow: "ORDER CONFIRMATION",
    title: "We have received your order",
    greeting: "Hello",
    intro:
      "Your order has been recorded. Please find all your order details below.",
    orderNumber: "Order number",
    orderDate: "Order date",
    orderSummary: "Order summary",
    product: "Product",
    reference: "Reference",
    quantity: "Qty",
    unitPrice: "Unit price",
    lineTotal: "Total",
    subtotal: "Products subtotal",
    shipping: "Shipping",
    taxesIncluded: "Taxes (informational amount)",
    total: "ORDER TOTAL",
    customer: "Customer information",
    email: "Email address",
    phone: "Phone",
    delivery: "Delivery address",
    country: "Country",
    city: "City",
    postalCode: "Postal code",
    address: "Address",
    orderStatus: "Order status",
    paymentStatus: "Payment status",
    received: "Order received",
    pendingPayment: "Awaiting payment",
    confirmed: "Order confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
    notRequested: "Payment not requested",
    pending: "Pending",
    paid: "Paid",
    failed: "Payment failed",
    partiallyRefunded: "Partially refunded",
    nextSteps:
      "Our team will review your order and inform you of the next steps. This email does not confirm that payment has been made.",
    footer:
      "This email concerns an order placed with CYCLORIVA.",
    thankYou: "Thank you for choosing CYCLORIVA.",
  },

  de: {
    subject: "Wir haben Ihre Bestellung erhalten",
    eyebrow: "BESTELLBESTÄTIGUNG",
    title: "Wir haben Ihre Bestellung erhalten",
    greeting: "Guten Tag",
    intro:
      "Ihre Bestellung wurde erfasst. Nachfolgend finden Sie die vollständige Übersicht Ihrer Bestellung.",
    orderNumber: "Bestellnummer",
    orderDate: "Bestelldatum",
    orderSummary: "Bestellübersicht",
    product: "Produkt",
    reference: "Artikelnummer",
    quantity: "Menge",
    unitPrice: "Einzelpreis",
    lineTotal: "Gesamt",
    subtotal: "Zwischensumme",
    shipping: "Versandkosten",
    taxesIncluded: "Steuern (zur Information)",
    total: "GESAMTBETRAG",
    customer: "Kundendaten",
    email: "E-Mail-Adresse",
    phone: "Telefon",
    delivery: "Lieferadresse",
    country: "Land",
    city: "Stadt",
    postalCode: "Postleitzahl",
    address: "Adresse",
    orderStatus: "Bestellstatus",
    paymentStatus: "Zahlungsstatus",
    received: "Bestellung eingegangen",
    pendingPayment: "Zahlung ausstehend",
    confirmed: "Bestellung bestätigt",
    processing: "In Bearbeitung",
    shipped: "Versendet",
    delivered: "Zugestellt",
    cancelled: "Storniert",
    refunded: "Erstattet",
    notRequested: "Noch keine Zahlung angefordert",
    pending: "Ausstehend",
    paid: "Bezahlt",
    failed: "Zahlung fehlgeschlagen",
    partiallyRefunded: "Teilweise erstattet",
    nextSteps:
      "Unser Team wird Ihre Bestellung prüfen und Sie über die nächsten Schritte informieren. Diese E-Mail bestätigt keinen Zahlungseingang.",
    footer:
      "Diese E-Mail betrifft eine Bestellung bei CYCLORIVA.",
    thankYou: "Vielen Dank für Ihr Vertrauen.",
  },

  it: {
    subject: "Abbiamo ricevuto il tuo ordine",
    eyebrow: "CONFERMA DI RICEZIONE ORDINE",
    title: "Abbiamo ricevuto il tuo ordine",
    greeting: "Buongiorno",
    intro:
      "Il tuo ordine è stato registrato. Di seguito trovi il riepilogo completo.",
    orderNumber: "Numero d'ordine",
    orderDate: "Data dell'ordine",
    orderSummary: "Riepilogo dell'ordine",
    product: "Prodotto",
    reference: "Riferimento",
    quantity: "Qtà",
    unitPrice: "Prezzo unitario",
    lineTotal: "Totale",
    subtotal: "Subtotale prodotti",
    shipping: "Spese di spedizione",
    taxesIncluded: "Imposte (a titolo informativo)",
    total: "TOTALE ORDINE",
    customer: "Informazioni cliente",
    email: "Indirizzo e-mail",
    phone: "Telefono",
    delivery: "Indirizzo di consegna",
    country: "Paese",
    city: "Città",
    postalCode: "Codice postale",
    address: "Indirizzo",
    orderStatus: "Stato dell'ordine",
    paymentStatus: "Stato del pagamento",
    received: "Ordine ricevuto",
    pendingPayment: "In attesa di pagamento",
    confirmed: "Ordine confermato",
    processing: "In preparazione",
    shipped: "Spedito",
    delivered: "Consegnato",
    cancelled: "Annullato",
    refunded: "Rimborsato",
    notRequested: "Pagamento non richiesto",
    pending: "In attesa",
    paid: "Pagato",
    failed: "Pagamento non riuscito",
    partiallyRefunded: "Rimborso parziale",
    nextSteps:
      "Il nostro team esaminerà il tuo ordine e ti informerà sui prossimi passaggi. Questa e-mail non conferma l'avvenuto pagamento.",
    footer:
      "Questa e-mail riguarda un ordine effettuato su CYCLORIVA.",
    thankYou: "Grazie per la fiducia.",
  },

  es: {
    subject: "Hemos recibido tu pedido",
    eyebrow: "CONFIRMACIÓN DE RECEPCIÓN",
    title: "Hemos recibido tu pedido",
    greeting: "Hola",
    intro:
      "Tu pedido ha sido registrado. A continuación encontrarás todos sus detalles.",
    orderNumber: "Número de pedido",
    orderDate: "Fecha del pedido",
    orderSummary: "Resumen del pedido",
    product: "Producto",
    reference: "Referencia",
    quantity: "Cant.",
    unitPrice: "Precio unitario",
    lineTotal: "Total",
    subtotal: "Subtotal de productos",
    shipping: "Gastos de envío",
    taxesIncluded: "Impuestos (importe informativo)",
    total: "TOTAL DEL PEDIDO",
    customer: "Información del cliente",
    email: "Correo electrónico",
    phone: "Teléfono",
    delivery: "Dirección de entrega",
    country: "País",
    city: "Ciudad",
    postalCode: "Código postal",
    address: "Dirección",
    orderStatus: "Estado del pedido",
    paymentStatus: "Estado del pago",
    received: "Pedido recibido",
    pendingPayment: "Pendiente de pago",
    confirmed: "Pedido confirmado",
    processing: "En preparación",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    refunded: "Reembolsado",
    notRequested: "Pago no solicitado",
    pending: "Pendiente",
    paid: "Pagado",
    failed: "Pago fallido",
    partiallyRefunded: "Reembolso parcial",
    nextSteps:
      "Nuestro equipo revisará tu pedido y te informará de los próximos pasos. Este correo no confirma que se haya realizado el pago.",
    footer:
      "Este correo corresponde a un pedido realizado en CYCLORIVA.",
    thankYou: "Gracias por tu confianza.",
  },
};

// ============================================================
// 3. PAYS DISPONIBLES
// ============================================================

const COUNTRY_NAMES: Record<
  string,
  Record<CheckoutEmailLocale, string>
> = {
  DE: {
    fr: "Allemagne",
    en: "Germany",
    de: "Deutschland",
    it: "Germania",
    es: "Alemania",
  },
  FR: {
    fr: "France",
    en: "France",
    de: "Frankreich",
    it: "Francia",
    es: "Francia",
  },
  ES: {
    fr: "Espagne",
    en: "Spain",
    de: "Spanien",
    it: "Spagna",
    es: "España",
  },
  IT: {
    fr: "Italie",
    en: "Italy",
    de: "Italien",
    it: "Italia",
    es: "Italia",
  },
  CH: {
    fr: "Suisse",
    en: "Switzerland",
    de: "Schweiz",
    it: "Svizzera",
    es: "Suiza",
  },
  AT: {
    fr: "Autriche",
    en: "Austria",
    de: "Österreich",
    it: "Austria",
    es: "Austria",
  },
  NL: {
    fr: "Pays-Bas",
    en: "Netherlands",
    de: "Niederlande",
    it: "Paesi Bassi",
    es: "Países Bajos",
  },
  BE: {
    fr: "Belgique",
    en: "Belgium",
    de: "Belgien",
    it: "Belgio",
    es: "Bélgica",
  },
};

// ============================================================
// 4. UTILITAIRES DE SÉCURITÉ
// ============================================================

const EMAIL_PATTERN =
  /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function normalizeLocale(
  value: string
): CheckoutEmailLocale {
  if (
    value === "fr" ||
    value === "en" ||
    value === "de" ||
    value === "it" ||
    value === "es"
  ) {
    return value;
  }

  return "fr";
}

function escapeHtml(
  value: unknown
): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeText(
  value: unknown
): string {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .trim();
}

function isValidEmail(
  value: string
): boolean {
  return (
    value.length <= 254 &&
    EMAIL_PATTERN.test(value)
  );
}

function validCents(
  value: number,
  field: string
): number {
  if (
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    throw new Error(
      `INVALID_EMAIL_AMOUNT:${field}`
    );
  }

  return value;
}

function money(
  cents: number,
  locale: CheckoutEmailLocale,
  currency: string
): string {
  validCents(cents, "money");

  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error("INVALID_CURRENCY");
  }

  return new Intl.NumberFormat(
    EMAIL_LOCALES[locale],
    {
      style: "currency",
      currency,
    }
  ).format(cents / 100);
}

function formatDate(
  value: Date | string,
  locale: CheckoutEmailLocale
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("INVALID_ORDER_DATE");
  }

  return new Intl.DateTimeFormat(
    EMAIL_LOCALES[locale],
    {
      dateStyle: "long",
      timeZone: "UTC",
    }
  ).format(date);
}

function countryName(
  code: string,
  locale: CheckoutEmailLocale
): string {
  return COUNTRY_NAMES[code]?.[locale] ?? code;
}

function fullName(
  order: CheckoutEmailOrder
): string {
  return `${order.firstName} ${order.lastName}`.trim();
}

function customerPhone(
  order: CheckoutEmailOrder
): string {
  if (order.phoneE164.trim()) {
    return order.phoneE164.trim();
  }

  return [
    order.phoneDialCode,
    order.phoneNational,
  ]
    .filter(Boolean)
    .join(" ");
}

function statusText(
  status: string,
  t: EmailTranslations
): string {
  const values: Record<string, string> = {
    RECEIVED: t.received,
    PENDING_PAYMENT: t.pendingPayment,
    CONFIRMED: t.confirmed,
    PROCESSING: t.processing,
    SHIPPED: t.shipped,
    DELIVERED: t.delivered,
    CANCELLED: t.cancelled,
    REFUNDED: t.refunded,
  };

  return values[status] ?? status;
}

function paymentText(
  status: string,
  t: EmailTranslations
): string {
  const values: Record<string, string> = {
    NOT_REQUESTED: t.notRequested,
    PENDING: t.pending,
    PAID: t.paid,
    FAILED: t.failed,
    REFUNDED: t.refunded,
    PARTIALLY_REFUNDED: t.partiallyRefunded,
  };

  return values[status] ?? status;
}

// ============================================================
// 5. VALIDATION DES DONNÉES DE COMMANDE
// ============================================================

function validateOrderForEmail(
  order: CheckoutEmailOrder
): void {
  if (
    !order.id.trim() ||
    !order.orderNumber.trim()
  ) {
    throw new Error("INVALID_ORDER_ID");
  }

  if (
    !order.firstName.trim() ||
    !order.lastName.trim() ||
    !isValidEmail(order.email)
  ) {
    throw new Error("INVALID_CUSTOMER_DETAILS");
  }

  if (
    !COUNTRY_NAMES[order.country] ||
    !order.city.trim() ||
    !order.postalCode.trim() ||
    !order.addressLine1.trim()
  ) {
    throw new Error("INVALID_DELIVERY_ADDRESS");
  }

  if (!order.phoneE164.trim()) {
    throw new Error("INVALID_CUSTOMER_PHONE");
  }

  if (!Array.isArray(order.items) ||
      order.items.length === 0) {
    throw new Error("EMPTY_ORDER");
  }

  const subtotal = order.items.reduce(
    (sum, item) => {
      if (
        !item.productId.trim() ||
        !item.productName.trim() ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        throw new Error("INVALID_ORDER_ITEM");
      }

      validCents(
        item.unitPriceCents,
        "unitPriceCents"
      );

      validCents(
        item.lineTotalCents,
        "lineTotalCents"
      );

      if (
        item.currency !== order.currency ||
        item.lineTotalCents !==
          item.quantity * item.unitPriceCents
      ) {
        throw new Error("INVALID_ORDER_ITEM_TOTAL");
      }

      return sum + item.lineTotalCents;
    },
    0
  );

  validCents(
    order.subtotalCents,
    "subtotalCents"
  );
  validCents(
    order.shippingCents,
    "shippingCents"
  );
  validCents(
    order.totalCents,
    "totalCents"
  );

  if (order.taxCents !== null) {
    validCents(order.taxCents, "taxCents");
  }

  if (
    subtotal !== order.subtotalCents ||
    order.subtotalCents +
      order.shippingCents !==
      order.totalCents
  ) {
    throw new Error("INVALID_ORDER_TOTAL");
  }

  if (
    !Number.isSafeInteger(order.totalCents) ||
    !/^[A-Z]{3}$/.test(order.currency)
  ) {
    throw new Error("INVALID_ORDER_CURRENCY");
  }
}

// ============================================================
// 6. DESIGN CENTRAL DES E-MAILS
// ============================================================

const COLORS = {
  navy: "#102b39",
  dark: "#071c2c",
  green: "#159c27",
  brightGreen: "#83d91d",
  lightGreen: "#edf8e9",
  white: "#ffffff",
  light: "#f4f7f9",
  border: "#dce5ea",
  muted: "#617380",
};

const CELL_STYLE = [
  "padding:11px 12px;",
  "border-bottom:1px solid #e4eaee;",
  "font-size:13px;",
  "vertical-align:top;",
].join("");

function sectionTitle(
  title: string
): string {
  return `
    <h2 style="
      margin:0 0 14px;
      color:${COLORS.navy};
      font-size:17px;
      line-height:24px;
      font-weight:800;
    ">
      <span style="color:${COLORS.green};">
        &#9679;
      </span>
      ${escapeHtml(title)}
    </h2>
  `;
}

function detailRow(
  label: string,
  value: string
): string {
  return `
    <tr>
      <td style="
        ${CELL_STYLE}
        width:42%;
        color:${COLORS.muted};
      ">
        ${escapeHtml(label)}
      </td>
      <td style="
        ${CELL_STYLE}
        color:${COLORS.navy};
        font-weight:600;
        overflow-wrap:anywhere;
      ">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

function detailTable(
  rows: string
): string {
  return `
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
        width:100%;
        border:1px solid ${COLORS.border};
        border-radius:10px;
        border-collapse:separate;
        border-spacing:0;
        overflow:hidden;
      "
    >
      ${rows}
    </table>
  `;
}

function section(
  title: string,
  content: string
): string {
  return `
    <section style="margin:0 0 26px;">
      ${sectionTitle(title)}
      ${content}
    </section>
  `;
}

function emailLayout(params: {
  locale: CheckoutEmailLocale;
  eyebrow: string;
  title: string;
  intro: string;
  content: string;
  footer: string;
}): string {
  return `<!doctype html>
<html lang="${params.locale}">
<head>
  <meta charset="utf-8"/>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />
  <meta
    name="color-scheme"
    content="light"
  />
  <title>${escapeHtml(params.title)}</title>
</head>
<body style="
  margin:0;
  padding:0;
  background:${COLORS.light};
  color:${COLORS.navy};
  font-family:Arial,Helvetica,sans-serif;
  -webkit-text-size-adjust:100%;
">
  <div style="
    display:none;
    max-height:0;
    overflow:hidden;
    opacity:0;
  ">
    ${escapeHtml(params.intro)}
  </div>

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
      width:100%;
      background:${COLORS.light};
    "
  >
    <tr>
      <td
        align="center"
        style="padding:28px 12px;"
      >
        <table
          role="presentation"
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="
            width:100%;
            max-width:600px;
            background:${COLORS.white};
            border:1px solid ${COLORS.border};
            border-radius:14px;
            overflow:hidden;
          "
        >
          <!-- MARQUE -->
          <tr>
            <td style="
              padding:25px 27px 22px;
              background:${COLORS.dark};
              border-bottom:4px solid
                ${COLORS.brightGreen};
            ">
              <div style="
                font-size:27px;
                line-height:33px;
                font-weight:900;
                letter-spacing:-0.8px;
                color:#ffffff;
              ">
                CYCLOR<span style="
                  color:${COLORS.brightGreen};
                ">IVA</span>
              </div>

              <div style="
                margin-top:7px;
                font-size:10px;
                line-height:16px;
                font-weight:700;
                letter-spacing:1.6px;
                color:#d6e5ee;
              ">
                VÉLOS &amp; E-MOBILITÉ
              </div>
            </td>
          </tr>

          <!-- INTRODUCTION -->
          <tr>
            <td style="padding:30px 27px 14px;">
              <div style="
                margin-bottom:9px;
                color:${COLORS.green};
                font-size:11px;
                line-height:16px;
                font-weight:800;
                letter-spacing:1.4px;
              ">
                ${escapeHtml(params.eyebrow)}
              </div>

              <h1 style="
                margin:0 0 14px;
                color:${COLORS.navy};
                font-size:25px;
                line-height:32px;
                font-weight:800;
              ">
                ${escapeHtml(params.title)}
              </h1>

              <p style="
                margin:0;
                color:#526675;
                font-size:14px;
                line-height:23px;
              ">
                ${escapeHtml(params.intro)}
              </p>
            </td>
          </tr>

          <!-- CONTENU -->
          <tr>
            <td style="padding:15px 27px 24px;">
              ${params.content}
            </td>
          </tr>

          <!-- PIED DE MESSAGE -->
          <tr>
            <td style="
              padding:22px 27px;
              background:${COLORS.dark};
            ">
              <p style="
                margin:0 0 7px;
                color:#ffffff;
                font-size:15px;
                font-weight:800;
              ">
                CYCLOR<span style="
                  color:${COLORS.brightGreen};
                ">IVA</span>
              </p>

              <p style="
                margin:0;
                color:#cad8e0;
                font-size:11px;
                line-height:18px;
              ">
                ${escapeHtml(params.footer)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================================
// 7. INFORMATIONS DU CLIENT
// ============================================================

function customerDetailsHtml(
  order: CheckoutEmailOrder,
  t: EmailTranslations
): string {
  return section(
    t.customer,
    detailTable(
      detailRow(
        "Nom complet",
        fullName(order)
      ) +
      detailRow(t.email, order.email) +
      detailRow(
        t.phone,
        customerPhone(order)
      )
    )
  );
}

// ============================================================
// 8. ADRESSE DE LIVRAISON
// ============================================================

function deliveryDetailsHtml(
  order: CheckoutEmailOrder,
  locale: CheckoutEmailLocale,
  t: EmailTranslations
): string {
  const fullAddress = [
    order.addressLine1,
    order.addressLine2,
  ]
    .filter(Boolean)
    .join(", ");

  return section(
    t.delivery,
    detailTable(
      detailRow(
        t.country,
        countryName(order.country, locale)
      ) +
      detailRow(t.city, order.city) +
      detailRow(
        t.postalCode,
        order.postalCode
      ) +
      detailRow(t.address, fullAddress)
    )
  );
}

// ============================================================
// 9. TABLEAU DES PRODUITS COMMANDÉS
// ============================================================

function productsHtml(
  order: CheckoutEmailOrder,
  locale: CheckoutEmailLocale,
  t: EmailTranslations
): string {
  const rows = order.items
    .map((item) => {
      const reference = item.sku
        ? `<div style="
             margin-top:4px;
             color:${COLORS.muted};
             font-size:11px;
           ">
             ${escapeHtml(t.reference)} :
             ${escapeHtml(item.sku)}
           </div>`
        : "";

      return `
        <tr>
          <td style="
            ${CELL_STYLE}
            color:${COLORS.navy};
            overflow-wrap:anywhere;
          ">
            <div style="font-weight:700;">
              ${escapeHtml(item.productName)}
            </div>

            <div style="
              margin-top:4px;
              color:${COLORS.muted};
              font-size:11px;
            ">
              ID : ${escapeHtml(item.productId)}
            </div>

            ${reference}
          </td>

          <td
            align="center"
            style="${CELL_STYLE}"
          >
            ${item.quantity}
          </td>

          <td
            align="right"
            style="${CELL_STYLE}"
          >
            ${escapeHtml(
              money(
                item.unitPriceCents,
                locale,
                order.currency
              )
            )}
          </td>

          <td
            align="right"
            style="
              ${CELL_STYLE}
              font-weight:700;
              color:${COLORS.navy};
            "
          >
            ${escapeHtml(
              money(
                item.lineTotalCents,
                locale,
                order.currency
              )
            )}
          </td>
        </tr>
      `;
    })
    .join("");

  const heading = `
    <tr style="background:#edf3f5;">
      <th
        align="left"
        style="${CELL_STYLE}"
      >
        ${escapeHtml(t.product)}
      </th>

      <th
        align="center"
        style="${CELL_STYLE}"
      >
        ${escapeHtml(t.quantity)}
      </th>

      <th
        align="right"
        style="${CELL_STYLE}"
      >
        ${escapeHtml(t.unitPrice)}
      </th>

      <th
        align="right"
        style="${CELL_STYLE}"
      >
        ${escapeHtml(t.lineTotal)}
      </th>
    </tr>
  `;

  const totalRows = [
    {
      label: t.subtotal,
      value: money(
        order.subtotalCents,
        locale,
        order.currency
      ),
    },
    {
      label: t.shipping,
      value: money(
        order.shippingCents,
        locale,
        order.currency
      ),
    },
  ];

  const totalsHtml = totalRows
    .map(
      (row) => `
        <tr>
          <td colspan="3" style="
            ${CELL_STYLE}
            text-align:right;
            color:${COLORS.muted};
          ">
            ${escapeHtml(row.label)}
          </td>
          <td
            align="right"
            style="${CELL_STYLE}"
          >
            ${escapeHtml(row.value)}
          </td>
        </tr>
      `
    )
    .join("");

  // La taxe est informative ; elle n'est pas
  // automatiquement ajoutée au total.
  const taxHtml =
    order.taxCents !== null
      ? `
        <tr>
          <td colspan="3" style="
            ${CELL_STYLE}
            text-align:right;
            color:${COLORS.muted};
          ">
            ${escapeHtml(t.taxesIncluded)}
          </td>
          <td
            align="right"
            style="${CELL_STYLE}"
          >
            ${escapeHtml(
              money(
                order.taxCents,
                locale,
                order.currency
              )
            )}
          </td>
        </tr>
      `
      : "";

  return section(
    t.orderSummary,
    `
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="
          width:100%;
          border:1px solid ${COLORS.border};
          border-collapse:separate;
          border-spacing:0;
          border-radius:10px;
          overflow:hidden;
        "
      >
        ${heading}
        ${rows}
        ${totalsHtml}
        ${taxHtml}

        <tr style="
          background:${COLORS.lightGreen};
        ">
          <td
            colspan="3"
            style="
              padding:15px 12px;
              font-weight:800;
              font-size:13px;
              color:${COLORS.navy};
            "
          >
            ${escapeHtml(t.total)}
          </td>

          <td
            align="right"
            style="
              padding:15px 12px;
              font-weight:900;
              font-size:17px;
              color:${COLORS.green};
              white-space:nowrap;
            "
          >
            ${escapeHtml(
              money(
                order.totalCents,
                locale,
                order.currency
              )
            )}
          </td>
        </tr>
      </table>
    `
  );
}

// ============================================================
// 10. INFORMATIONS ET STATUTS
// ============================================================

function orderDetailsHtml(
  order: CheckoutEmailOrder,
  locale: CheckoutEmailLocale,
  t: EmailTranslations
): string {
  return section(
    t.orderNumber,
    detailTable(
      detailRow(
        t.orderNumber,
        order.orderNumber
      ) +
      detailRow(
        t.orderDate,
        formatDate(order.createdAt, locale)
      ) +
      detailRow(
        t.orderStatus,
        statusText(order.status, t)
      ) +
      detailRow(
        t.paymentStatus,
        paymentText(order.paymentStatus, t)
      )
    )
  );
}

// ============================================================
// 11. VERSION TEXTE DE LA COMMANDE
// ============================================================

function orderText(
  order: CheckoutEmailOrder,
  locale: CheckoutEmailLocale,
  t: EmailTranslations
): string {
  const items = order.items
    .map((item, index) => {
      return [
        `${index + 1}. ${escapeText(item.productName)}`,
        `ID : ${escapeText(item.productId)}`,
        item.sku
          ? `${t.reference} : ${escapeText(item.sku)}`
          : "",
        `${t.quantity} : ${item.quantity}`,
        `${t.unitPrice} : ${money(
          item.unitPriceCents,
          locale,
          order.currency
        )}`,
        `${t.lineTotal} : ${money(
          item.lineTotalCents,
          locale,
          order.currency
        )}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const address = [
    order.addressLine1,
    order.addressLine2,
  ]
    .filter(Boolean)
    .map(escapeText)
    .join(", ");

  return [
    `${t.orderNumber} : ${escapeText(order.orderNumber)}`,
    `${t.orderDate} : ${formatDate(order.createdAt, locale)}`,
    `${t.orderStatus} : ${statusText(order.status, t)}`,
    `${t.paymentStatus} : ${paymentText(order.paymentStatus, t)}`,
    "",
    `=== ${t.orderSummary} ===`,
    items,
    "",
    `${t.subtotal} : ${money(order.subtotalCents, locale, order.currency)}`,
    `${t.shipping} : ${money(order.shippingCents, locale, order.currency)}`,
    order.taxCents !== null
      ? `${t.taxesIncluded} : ${money(order.taxCents, locale, order.currency)}`
      : "",
    `${t.total} : ${money(order.totalCents, locale, order.currency)}`,
    "",
    `=== ${t.customer} ===`,
    `${escapeText(fullName(order))}`,
    `${t.email} : ${escapeText(order.email)}`,
    `${t.phone} : ${escapeText(customerPhone(order))}`,
    "",
    `=== ${t.delivery} ===`,
    `${t.country} : ${countryName(order.country, locale)}`,
    `${t.city} : ${escapeText(order.city)}`,
    `${t.postalCode} : ${escapeText(order.postalCode)}`,
    `${t.address} : ${address}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

// ============================================================
// 12. E-MAIL DE CONFIRMATION CLIENT
// ============================================================

export function buildCustomerOrderEmail(
  order: CheckoutEmailOrder
): CheckoutEmailMessage {
  validateOrderForEmail(order);

  const locale = normalizeLocale(order.locale);
  const t = TRANSLATIONS[locale];

  const introduction = [
    `${t.greeting} ${fullName(order)},`,
    t.intro,
  ].join("\n\n");

  const content = [
    orderDetailsHtml(order, locale, t),
    productsHtml(order, locale, t),
    customerDetailsHtml(order, t),
    deliveryDetailsHtml(order, locale, t),

    `
      <div style="
        padding:16px 18px;
        background:${COLORS.lightGreen};
        border-left:4px solid ${COLORS.green};
        border-radius:8px;
        color:${COLORS.navy};
        font-size:13px;
        line-height:21px;
      ">
        <strong>
          ${escapeHtml(t.nextSteps)}
        </strong>
      </div>

      <p style="
        margin:20px 0 0;
        color:${COLORS.navy};
        font-size:14px;
        font-weight:700;
      ">
        ${escapeHtml(t.thankYou)}
      </p>
    `,
  ].join("");

  return {
    to: order.email,

    subject:
      `${t.subject} — ${order.orderNumber}`,

    html: emailLayout({
      locale,
      eyebrow: t.eyebrow,
      title: t.title,
      intro: introduction,
      content,
      footer: t.footer,
    }),

    text: [
      introduction,
      "",
      orderText(order, locale, t),
      "",
      t.nextSteps,
      "",
      t.thankYou,
      "CYCLORIVA",
    ].join("\n"),
  };
}

// ============================================================
// 13. E-MAIL ADMINISTRATEUR
// ============================================================

export function buildAdminOrderEmail(
  order: CheckoutEmailOrder,
  adminEmail: string
): CheckoutEmailMessage {
  validateOrderForEmail(order);

  if (!isValidEmail(adminEmail)) {
    throw new Error("INVALID_ADMIN_EMAIL");
  }

  const locale: CheckoutEmailLocale = "fr";
  const t = TRANSLATIONS.fr;

  const introduction = [
    "Une nouvelle commande vient d'être enregistrée sur la boutique CYCLORIVA.",
    "Les informations suivantes proviennent de la commande enregistrée dans la base de données.",
  ].join(" ");

  const adminSummary = `
    <div style="
      padding:17px 18px;
      margin-bottom:24px;
      background:${COLORS.lightGreen};
      border:1px solid #c7e8c5;
      border-radius:10px;
    ">
      <div style="
        color:${COLORS.navy};
        font-size:12px;
        font-weight:700;
      ">
        NOUVELLE COMMANDE
      </div>

      <div style="
        margin-top:8px;
        color:${COLORS.green};
        font-size:26px;
        line-height:32px;
        font-weight:900;
        overflow-wrap:anywhere;
      ">
        ${escapeHtml(
          money(
            order.totalCents,
            locale,
            order.currency
          )
        )}
      </div>

      <div style="
        margin-top:7px;
        color:${COLORS.navy};
        font-size:12px;
      ">
        ${escapeHtml(order.orderNumber)}
      </div>
    </div>
  `;

  const content = [
    adminSummary,
    orderDetailsHtml(order, locale, t),
    productsHtml(order, locale, t),
    customerDetailsHtml(order, t),
    deliveryDetailsHtml(order, locale, t),

    `
      <div style="
        padding:15px 17px;
        border-radius:8px;
        background:#eef3f6;
        color:${COLORS.navy};
        font-size:12px;
        line-height:20px;
      ">
        <strong>Traitement de la commande</strong>
        <br/>
        Vérifiez les produits, la disponibilité,
        la livraison et le statut du paiement
        avant toute confirmation définitive.
      </div>
    `,
  ].join("");

  return {
    to: adminEmail,

    subject:
      `CYCLORIVA | Nouvelle commande ${order.orderNumber} | ${money(order.totalCents, locale, order.currency)}`,

    html: emailLayout({
      locale,
      eyebrow: "NOTIFICATION ADMINISTRATEUR",
      title: "Une nouvelle commande a été reçue",
      intro: introduction,
      content,
      footer:
        "Notification transactionnelle destinée à l'administration CYCLORIVA.",
    }),

    text: [
      "CYCLORIVA — NOUVELLE COMMANDE",
      "",
      introduction,
      "",
      orderText(order, locale, t),
      "",
      "Vérifiez la commande avant confirmation définitive.",
    ].join("\n"),
  };
}

// ============================================================
// 14. CONFIGURATION RESEND
// ============================================================

type ResendSettings = {
  apiKey: string;
  from: string;
  adminEmail: string;
};

function readResendSettings(requireAdmin = false): ResendSettings {
  const apiKey =
    process.env.RESEND_API_KEY?.trim() ?? "";

  const from =
    process.env.CYCLORIVA_MAIL_FROM?.trim() ??
    "";

  const adminEmail =
    process.env.CYCLORIVA_ADMIN_EMAIL?.trim() ??
    "";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY_MISSING");
  }

  if (
    !from ||
    !isValidEmail(from.match(/<([^<>]+)>$/)?.[1] || from) ||
    /votre-domaine|example\.(?:com|org)|\.example[>\s]*$/i.test(from) ||
    /[\r\n]/.test(from)
  ) {
    throw new Error("CYCLORIVA_MAIL_FROM_INVALID");
  }

  if (requireAdmin && !isValidEmail(adminEmail)) {
    throw new Error(
      "CYCLORIVA_ADMIN_EMAIL_INVALID"
    );
  }

  return {
    apiKey,
    from,
    adminEmail,
  };
}

// ============================================================
// 15. ENVOI D'UN MESSAGE VIA RESEND
// ============================================================

export function getCheckoutEmailConfiguration() {
  let senderConfigured = false;
  try { readResendSettings(); senderConfigured = true; } catch { /* Pending until configured. */ }
  return { senderConfigured, adminConfigured: isValidEmail(process.env.CYCLORIVA_ADMIN_EMAIL?.trim() || "") };
}

async function sendViaResend(params: {
  message: CheckoutEmailMessage;
  orderId: string;
  kind: CheckoutEmailKind;
  replyTo?: string;
}): Promise<string> {
  const settings = readResendSettings();

  if (!isValidEmail(params.message.to)) {
    throw new Error("INVALID_EMAIL_RECIPIENT");
  }

  const idempotencyKey = [
    "cycloriva",
    params.kind.toLowerCase(),
    params.orderId,
  ].join("/");

  if (idempotencyKey.length > 256) {
    throw new Error(
      "EMAIL_IDEMPOTENCY_KEY_TOO_LONG"
    );
  }

  const payload = {
    from: settings.from,
    to: [params.message.to],
    subject: params.message.subject,
    html: params.message.html,
    text: params.message.text,
    ...(params.replyTo &&
    isValidEmail(params.replyTo)
      ? {
          reply_to: params.replyTo,
        }
      : {}),
  };

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${settings.apiKey}`,

        "Content-Type": "application/json",

        "Idempotency-Key": idempotencyKey,
      },

      body: JSON.stringify(payload),

      cache: "no-store",

      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    const retryable =
      response.status === 429 ||
      response.status >= 500;

    throw new Error(
      `RESEND_HTTP_${response.status}${
        retryable ? "_RETRYABLE" : ""
      }`
    );
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("id" in data) ||
    typeof data.id !== "string" ||
    !data.id
  ) {
    throw new Error(
      "RESEND_INVALID_RESPONSE"
    );
  }

  return data.id;
}

// ============================================================
// 16. ENVOYER LA CONFIRMATION CLIENT
// ============================================================

export async function sendCustomerOrderEmail(
  order: CheckoutEmailOrder
): Promise<CheckoutEmailSendResult> {
  const message =
    buildCustomerOrderEmail(order);

  const providerMessageId =
    await sendViaResend({
      message,
      orderId: order.id,
      kind: "CUSTOMER_CONFIRMATION",
    });

  return {
    success: true,
    type: "CUSTOMER_CONFIRMATION",
    recipientEmail: message.to,
    providerMessageId,
  };
}

// ============================================================
// 17. ENVOYER LA NOTIFICATION ADMINISTRATEUR
// ============================================================

export async function sendAdminOrderEmail(
  order: CheckoutEmailOrder
): Promise<CheckoutEmailSendResult> {
  const settings = readResendSettings(true);

  const message = buildAdminOrderEmail(
    order,
    settings.adminEmail
  );

  const providerMessageId =
    await sendViaResend({
      message,
      orderId: order.id,
      kind: "ADMIN_NOTIFICATION",
      replyTo: order.email,
    });

  return {
    success: true,
    type: "ADMIN_NOTIFICATION",
    recipientEmail: message.to,
    providerMessageId,
  };
}

// ============================================================
// 18. ENVOYER LES DEUX E-MAILS
// ============================================================
//
// Les deux envois sont indépendants.
//
// Si l'un échoue, l'autre peut réussir.
//
// IMPORTANT :
// Cette fonction ne met pas à jour Prisma.
// Le traitement des notifications en base doit
// suivre les résultats retournés.
//
// Pour la production, appeler les fonctions
// d'envoi depuis un worker / traitement outbox
// qui revendique d'abord chaque notification
// PENDING et persiste SENT ou FAILED.
//
// ============================================================

export async function sendCheckoutOrderEmails(
  order: CheckoutEmailOrder
): Promise<CheckoutEmailDispatchResult> {
  const [customer, admin] =
    await Promise.allSettled([
      sendCustomerOrderEmail(order),
      sendAdminOrderEmail(order),
    ]);

  return {
    customer:
      customer.status === "fulfilled"
        ? customer.value
        : {
            success: false,
            error:
              customer.reason instanceof Error
                ? customer.reason.message
                : "CUSTOMER_EMAIL_FAILED",
          },

    admin:
      admin.status === "fulfilled"
        ? admin.value
        : {
            success: false,
            error:
              admin.reason instanceof Error
                ? admin.reason.message
                : "ADMIN_EMAIL_FAILED",
          },
  };
}

// ============================================================
// FIN — CYCLORIVA CHECKOUT EMAILS
// ============================================================
