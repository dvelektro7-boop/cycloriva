
import "server-only";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { CONFIRMATION_COOKIE, verifyConfirmationCookie } from "@/lib/checkout-confirmation";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bike,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  Home,
  Mail,
  MailCheck,
  MapPin,
  Package,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

import {
  getCheckoutTranslations,
  normalizeCheckoutLocale,
  formatCheckoutCurrency,
  formatCheckoutDate,
  translateCheckoutOrderStatus,
  translateCheckoutPaymentStatus,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

import {
  getCheckoutCountryName,
  isCheckoutCountry,
} from "@/lib/checkout-countries";

/**
 * ============================================================
 * CYCLORIVA — CONFIRMATION DE COMMANDE
 * ============================================================
 *
 * FICHIER :
 * app/[locale]/commande/confirmation/[orderId]/page.tsx
 *
 * Next.js 16 — App Router — TypeScript
 * Prisma 7 — PostgreSQL / Supabase
 *
 * VERSION PC ET MOBILE
 *
 * FONCTIONS :
 * - Lire une commande réellement enregistrée
 * - Vérifier l'accès à ses informations privées
 * - Afficher le numéro de commande
 * - Afficher les produits et leurs quantités
 * - Afficher les montants enregistrés
 * - Afficher les coordonnées de livraison
 * - Afficher le statut de la commande
 * - Afficher le statut du paiement
 * - Présenter le suivi des e-mails
 * - Proposer un retour à la boutique
 *
 * SÉCURITÉ :
 * - Aucun accès public aux coordonnées par orderId
 * - Cookie HttpOnly signé, fourni par l'API
 * - Vérification HMAC avec comparaison constante
 * - Aucune donnée de test
 * - Aucun paiement fictif
 * - Aucun e-mail déclaré livré sans confirmation
 *
 * IMPORTANT :
 *
 * L'API POST /api/checkout doit émettre le cookie
 * cycloriva_checkout_confirmation après avoir
 * enregistré la commande.
 *
 * ============================================================
 */

// ============================================================
// 1. CONFIGURATION NEXT.JS
// ============================================================


// ============================================================
// 2. TYPES
// ============================================================

type ConfirmationPageProps = {
  params: Promise<{
    locale: string;
    orderId: string;
  }>;
};

type ConfirmationText = {
  protectedTitle: string;
  protectedDescription: string;
  successEyebrow: string;
  successTitle: string;
  successDescription: string;
  nextStepTitle: string;
  notificationTitle: string;
  customerEmail: string;
  adminEmail: string;
  emailAccepted: string;
  emailPending: string;
  emailProblem: string;
  itemsHeading: string;
  contactHeading: string;
  noPayment: string;
  paymentReceived: string;
  shopButton: string;
  homeButton: string;
  reference: string;
  unitPrice: string;
  quantity: string;
  shipping: string;
  subtotal: string;
  total: string;
  postal: string;
  address: string;
  phone: string;
  email: string;
};

// ============================================================
// 3. TRADUCTIONS COMPLÉMENTAIRES
// ============================================================

const pageTexts: Record<
  CheckoutLocale,
  ConfirmationText
> = {
  fr: {
    protectedTitle: "Accès à la commande protégé",
    protectedDescription:
      "Votre session de confirmation a expiré ou n'est pas disponible. Retrouvez les informations de votre commande dans l'e-mail envoyé à votre adresse.",
    successEyebrow: "COMMANDE ENREGISTRÉE",
    successTitle: "Merci pour votre commande !",
    successDescription:
      "Votre commande a bien été enregistrée. Voici son récapitulatif.",
    nextStepTitle: "Que se passe-t-il ensuite ?",
    notificationTitle: "Notifications de commande",
    customerEmail: "Confirmation client",
    adminEmail: "Notification de notre équipe",
    emailAccepted: "Envoi accepté par notre service e-mail",
    emailPending: "Envoi en attente",
    emailProblem: "Envoi en cours de vérification",
    itemsHeading: "Produits commandés",
    contactHeading: "Vos coordonnées",
    noPayment:
      "Votre commande est reçue. Aucun paiement n'est confirmé à ce stade.",
    paymentReceived:
      "Le statut du paiement est marqué comme payé dans notre système.",
    shopButton: "Continuer mes achats",
    homeButton: "Retour à l'accueil",
    reference: "Référence",
    unitPrice: "Prix unitaire",
    quantity: "Quantité",
    shipping: "Livraison",
    subtotal: "Sous-total",
    total: "Total de la commande",
    postal: "Code postal",
    address: "Adresse",
    phone: "Téléphone",
    email: "Adresse e-mail",
  },
  en: {
    protectedTitle: "Protected order access",
    protectedDescription:
      "Your confirmation session has expired or is unavailable. Please check the email sent to you for your order details.",
    successEyebrow: "ORDER REGISTERED",
    successTitle: "Thank you for your order!",
    successDescription:
      "Your order has been recorded. Here is your summary.",
    nextStepTitle: "What happens next?",
    notificationTitle: "Order notifications",
    customerEmail: "Customer confirmation",
    adminEmail: "Team notification",
    emailAccepted: "Accepted by our email provider",
    emailPending: "Awaiting sending",
    emailProblem: "Delivery request under review",
    itemsHeading: "Ordered products",
    contactHeading: "Your contact details",
    noPayment:
      "Your order has been received. No payment is confirmed at this stage.",
    paymentReceived:
      "Your payment is marked as paid in our system.",
    shopButton: "Continue shopping",
    homeButton: "Back to home",
    reference: "Reference",
    unitPrice: "Unit price",
    quantity: "Quantity",
    shipping: "Shipping",
    subtotal: "Subtotal",
    total: "Order total",
    postal: "Postal code",
    address: "Address",
    phone: "Phone",
    email: "Email address",
  },
  de: {
    protectedTitle: "Geschützter Bestellzugriff",
    protectedDescription:
      "Ihre Bestätigungssitzung ist abgelaufen oder nicht verfügbar. Die Bestelldaten finden Sie in Ihrer Bestell-E-Mail.",
    successEyebrow: "BESTELLUNG ERFASST",
    successTitle: "Vielen Dank für Ihre Bestellung!",
    successDescription:
      "Ihre Bestellung wurde erfasst. Hier ist Ihre Übersicht.",
    nextStepTitle: "Wie geht es weiter?",
    notificationTitle: "Bestellbenachrichtigungen",
    customerEmail: "Kundenbestätigung",
    adminEmail: "Benachrichtigung unseres Teams",
    emailAccepted: "Vom E-Mail-Dienst angenommen",
    emailPending: "Versand ausstehend",
    emailProblem: "E-Mail-Versand wird geprüft",
    itemsHeading: "Bestellte Produkte",
    contactHeading: "Ihre Kontaktdaten",
    noPayment:
      "Ihre Bestellung ist eingegangen. Eine Zahlung ist noch nicht bestätigt.",
    paymentReceived:
      "Die Zahlung ist in unserem System als bezahlt markiert.",
    shopButton: "Weiter einkaufen",
    homeButton: "Zur Startseite",
    reference: "Artikelnummer",
    unitPrice: "Einzelpreis",
    quantity: "Menge",
    shipping: "Versand",
    subtotal: "Zwischensumme",
    total: "Gesamtbetrag",
    postal: "Postleitzahl",
    address: "Adresse",
    phone: "Telefon",
    email: "E-Mail-Adresse",
  },
  it: {
    protectedTitle: "Accesso all'ordine protetto",
    protectedDescription:
      "La sessione di conferma è scaduta o non è disponibile. Consulta l'e-mail inviata per i dettagli dell'ordine.",
    successEyebrow: "ORDINE REGISTRATO",
    successTitle: "Grazie per il tuo ordine!",
    successDescription:
      "Il tuo ordine è stato registrato. Ecco il riepilogo.",
    nextStepTitle: "Quali sono i prossimi passi?",
    notificationTitle: "Notifiche dell'ordine",
    customerEmail: "Conferma al cliente",
    adminEmail: "Notifica al nostro team",
    emailAccepted: "Accettata dal servizio e-mail",
    emailPending: "In attesa di invio",
    emailProblem: "Invio in verifica",
    itemsHeading: "Prodotti ordinati",
    contactHeading: "I tuoi dati",
    noPayment:
      "L'ordine è stato ricevuto. Nessun pagamento è ancora confermato.",
    paymentReceived:
      "Il pagamento risulta contrassegnato come effettuato nel nostro sistema.",
    shopButton: "Continua gli acquisti",
    homeButton: "Torna alla home",
    reference: "Riferimento",
    unitPrice: "Prezzo unitario",
    quantity: "Quantità",
    shipping: "Spedizione",
    subtotal: "Subtotale",
    total: "Totale ordine",
    postal: "Codice postale",
    address: "Indirizzo",
    phone: "Telefono",
    email: "Indirizzo e-mail",
  },
  es: {
    protectedTitle: "Acceso protegido al pedido",
    protectedDescription:
      "Tu sesión de confirmación ha caducado o no está disponible. Consulta el correo enviado para ver los detalles del pedido.",
    successEyebrow: "PEDIDO REGISTRADO",
    successTitle: "¡Gracias por tu pedido!",
    successDescription:
      "Tu pedido se ha registrado. Aquí tienes el resumen.",
    nextStepTitle: "¿Qué ocurre ahora?",
    notificationTitle: "Notificaciones del pedido",
    customerEmail: "Confirmación al cliente",
    adminEmail: "Notificación a nuestro equipo",
    emailAccepted: "Aceptado por el servicio de correo",
    emailPending: "Pendiente de envío",
    emailProblem: "Envío en revisión",
    itemsHeading: "Productos pedidos",
    contactHeading: "Tus datos",
    noPayment:
      "Tu pedido ha sido recibido. Todavía no hay ningún pago confirmado.",
    paymentReceived:
      "El pago figura como realizado en nuestro sistema.",
    shopButton: "Seguir comprando",
    homeButton: "Volver al inicio",
    reference: "Referencia",
    unitPrice: "Precio unitario",
    quantity: "Cantidad",
    shipping: "Envío",
    subtotal: "Subtotal",
    total: "Total del pedido",
    postal: "Código postal",
    address: "Dirección",
    phone: "Teléfono",
    email: "Correo electrónico",
  },
};

// ============================================================
// 4. CONTRÔLE D'ACCÈS SIGNÉ
// ============================================================
//
// Format attendu du cookie :
//
// orderId.expiresAt.signature
//
// signature = HMAC-SHA256(
//   secret,
//   `${orderId}.${expiresAt}`
// )
//
// expiresAt = timestamp Unix en secondes.
//
// L'API doit générer la même signature.
//
// ============================================================

export async function generateMetadata({
  params,
}: ConfirmationPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeCheckoutLocale(locale);
  const t = getCheckoutTranslations(language);

  return {
    title: `${t.confirmation.title} | CYCLORIVA`,
    description: t.confirmation.description,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
    },
    referrer: "no-referrer",
  };
}

// ============================================================
// 6. BANNIÈRE
// ============================================================

function ConfirmationBanner({
  locale,
}: {
  locale: CheckoutLocale;
}) {
  const t = getCheckoutTranslations(locale);

  return (
    <section className="relative hidden min-h-36 overflow-hidden bg-[#09283d] lg:block">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/couverture.png')",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-[#071c2c]/95 via-[#071c2c]/75 to-[#071c2c]/25"
      />

      <div className="cycloriva-container relative flex min-h-36 flex-col justify-center py-7">
        <span className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-white">
          <span className="h-1 w-8 bg-[#83d91d]" />
          {t.page.eyebrow}
        </span>

        <h1 className="text-3xl font-black tracking-tight text-white">
          {t.confirmation.title}
        </h1>
      </div>
    </section>
  );
}

// ============================================================
// 7. FIL D'ARIANE
// ============================================================

function ConfirmationBreadcrumb({
  locale,
}: {
  locale: CheckoutLocale;
}) {
  const t = getCheckoutTranslations(locale);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 py-4 text-xs text-[#526675]"
    >
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1.5 hover:text-[#16a51f]"
      >
        <Home size={14} aria-hidden="true" />
        {t.page.breadcrumbHome}
      </Link>

      <ArrowRight size={12} aria-hidden="true" />

      <span>{t.page.breadcrumbCheckout}</span>

      <ArrowRight size={12} aria-hidden="true" />

      <span
        aria-current="page"
        className="font-semibold text-[#102b39]"
      >
        {t.confirmation.received}
      </span>
    </nav>
  );
}

// ============================================================
// 8. CARTE DE LIGNE DE PRODUIT
// ============================================================

function ConfirmationItem({
  name,
  sku,
  productId,
  quantity,
  unitPriceCents,
  lineTotalCents,
  locale,
  currency,
}: {
  name: string;
  sku: string | null;
  productId: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  locale: CheckoutLocale;
  currency: string;
}) {
  const t = pageTexts[locale];

  return (
    <div className="flex min-w-0 items-start gap-3 border-b border-slate-100 py-4 last:border-b-0">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 sm:h-20 sm:w-20">
        <Bike
          size={30}
          className="text-[#16a51f]"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug font-bold text-[#102b39] sm:text-base">
          {name}
        </p>

        <p className="mt-1 text-[11px] text-slate-500">
          {t.reference} : {sku || productId}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {t.quantity} : {quantity}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {t.unitPrice} :{" "}
          {formatCheckoutCurrency(
            unitPriceCents,
            locale
          )}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-extrabold text-[#102b39] sm:text-base">
          {formatCheckoutCurrency(
            lineTotalCents,
            locale
          )}
        </p>
        <span className="sr-only">{currency}</span>
      </div>
    </div>
  );
}

// ============================================================
// 9. CARTE DE NOTIFICATION
// ============================================================

function NotificationStatus({
  title,
  status,
  locale,
}: {
  title: string;
  status: string | null;
  locale: CheckoutLocale;
}) {
  const text = pageTexts[locale];
  const accepted = status === "SENT";
  const problem = status === "FAILED";

  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf8e9] text-[#159c27]">
        {accepted ? (
          <MailCheck size={19} />
        ) : problem ? (
          <Clock3 size={19} />
        ) : (
          <Mail size={19} />
        )}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold text-[#102b39]">
          {title}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          {accepted
            ? text.emailAccepted
            : problem
              ? text.emailProblem
              : text.emailPending}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// 10. PAGE SANS AUTORISATION
// ============================================================

function ProtectedConfirmation({
  locale,
}: {
  locale: CheckoutLocale;
}) {
  const t = getCheckoutTranslations(locale);
  const text = pageTexts[locale];

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <ShieldCheck
          size={32}
          className="text-[#102b39]"
        />
      </div>

      <h2 className="mt-5 text-xl font-extrabold text-[#102b39]">
        {text.protectedTitle}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
        {text.protectedDescription}
      </p>

      <Link
        href={`/${locale}/produits`}
        className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0b9224] px-6 text-sm font-bold text-white hover:bg-[#087b1c]"
      >
        <ShoppingBag size={17} />
        {t.confirmation.viewProducts}
      </Link>
    </div>
  );
}

// ============================================================
// 11. PAGE DE CONFIRMATION
// ============================================================

async function CheckoutConfirmationContent({
  params,
}: ConfirmationPageProps) {
  const { locale: rawLocale, orderId } =
    await params;

  const locale =
    normalizeCheckoutLocale(rawLocale);

  const t = getCheckoutTranslations(locale);
  const text = pageTexts[locale];

  // ----------------------------------------------------------
  // VÉRIFICATION DU COOKIE SIGNÉ
  // ----------------------------------------------------------

  const cookieStore = await cookies();

  const confirmationCookie = cookieStore
    .get(CONFIRMATION_COOKIE)
    ?.value;

  const authorized =
    typeof orderId === "string" &&
    orderId.length <= 128 &&
    verifyConfirmationCookie(
      confirmationCookie,
      orderId
    );

  // ----------------------------------------------------------
  // LECTURE DE LA COMMANDE UNIQUEMENT SI AUTORISÉ
  // ----------------------------------------------------------

  const order = authorized
    ? await prisma.checkoutOrder.findUnique({
        where: { id: orderId },
        include: {
          items: {
            orderBy: {
              createdAt: "asc",
            },
          },
          emailNotifications: true,
        },
      })
    : null;

  const customerNotification =
    order?.emailNotifications.find(
      (item) =>
        item.type === "CUSTOMER_CONFIRMATION"
    );

  const adminNotification =
    order?.emailNotifications.find(
      (item) =>
        item.type === "ADMIN_NOTIFICATION"
    );

  const destinationCountry =
    order && isCheckoutCountry(order.country)
      ? getCheckoutCountryName(
          order.country,
          locale
        )
      : null;

  return (
    <main
      data-page="checkout-confirmation"
      className="min-h-screen w-full bg-[#f7f9fa] pb-12 text-[#102b39] lg:pb-16"
    >
      <ConfirmationBanner locale={locale} />

      <div className="cycloriva-container">
        <ConfirmationBreadcrumb locale={locale} />

        {!order ? (
          <ProtectedConfirmation locale={locale} />
        ) : (
          <>
            {/* ===============================================
                BANDEAU DE SUCCÈS
            =============================================== */}

            <section className="relative overflow-hidden rounded-2xl border border-[#cce9cb] bg-white p-5 shadow-sm sm:p-7">
              <div className="absolute inset-y-0 left-0 w-1.5 bg-[#16a51f]" />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e8f8e5]">
                  <CheckCircle2
                    size={31}
                    strokeWidth={2}
                    className="text-[#16a51f]"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-[#168d24]">
                    {text.successEyebrow}
                  </p>

                  <h1 className="mt-1 text-xl font-black tracking-tight sm:text-2xl lg:text-[28px]">
                    {text.successTitle}
                  </h1>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {text.successDescription}
                  </p>
                </div>

                <div className="rounded-xl bg-[#edf8e9] px-4 py-3 sm:min-w-44">
                  <span className="block text-[11px] font-semibold text-[#52745d]">
                    {t.confirmation.orderNumber}
                  </span>
                  <span className="mt-1 block break-all text-sm font-black text-[#102b39]">
                    {order.orderNumber}
                  </span>
                </div>
              </div>
            </section>

            {/* ===============================================
                ÉTAPES — PC ET MOBILE
            =============================================== */}

            <section
              aria-label={t.accessibility.stepProgress}
              className="mt-5 rounded-xl border border-slate-200 bg-white px-3 py-5 shadow-sm sm:px-6"
            >
              <div className="grid grid-cols-3 gap-2">
                {[
                  t.steps.cart,
                  t.steps.information,
                  t.steps.confirmation,
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex min-w-0 flex-col items-center gap-2 text-center"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16a51f] text-white">
                      {index === 2 ? (
                        <CheckCircle2
                          size={20}
                          aria-hidden="true"
                        />
                      ) : (
                        <Check
                          size={19}
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <span className="text-[10px] font-semibold text-[#102b39] sm:text-xs">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ===============================================
                GRILLE PRINCIPALE PC
            =============================================== */}

            <div className="mt-6 grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)] lg:gap-6">

              {/* =============================================
                  COLONNE GAUCHE
              ============================================= */}

              <div className="flex min-w-0 flex-col gap-5">

                {/* -------------------------------------------
                    PRODUITS
                ------------------------------------------- */}

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Package
                      size={22}
                      className="text-[#16a51f]"
                    />
                    <h2 className="text-base font-extrabold sm:text-lg">
                      {text.itemsHeading}
                    </h2>
                  </div>

                  <div>
                    {order.items.map((item) => (
                      <ConfirmationItem
                        key={item.id}
                        name={item.productName}
                        sku={item.sku}
                        productId={item.productId}
                        quantity={item.quantity}
                        unitPriceCents={
                          item.unitPriceCents
                        }
                        lineTotalCents={
                          item.lineTotalCents
                        }
                        locale={locale}
                        currency={item.currency}
                      />
                    ))}
                  </div>
                </section>

                {/* -------------------------------------------
                    INFORMATIONS PERSONNELLES
                ------------------------------------------- */}

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <UserRound
                      size={22}
                      className="text-[#16a51f]"
                    />
                    <h2 className="text-base font-extrabold">
                      {text.contactHeading}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-500">
                        {t.customer.firstName} /{" "}
                        {t.customer.lastName}
                      </p>
                      <p className="mt-1 wrap-break-word font-semibold">
                        {order.firstName}{" "}
                        {order.lastName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        {text.email}
                      </p>
                      <p className="mt-1 break-all font-semibold">
                        {order.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        {text.phone}
                      </p>
                      <p className="mt-1 font-semibold">
                        {order.phoneE164}
                      </p>
                    </div>
                  </div>
                </section>

                {/* -------------------------------------------
                    ADRESSE DE LIVRAISON
                ------------------------------------------- */}

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin
                      size={22}
                      className="text-[#16a51f]"
                    />

                    <h2 className="text-base font-extrabold">
                      {t.delivery.title}
                    </h2>
                  </div>

                  <div className="space-y-2 text-sm leading-6">
                    <p className="font-bold">
                      {order.firstName}{" "}
                      {order.lastName}
                    </p>

                    <p>{order.addressLine1}</p>

                    {order.addressLine2 && (
                      <p>{order.addressLine2}</p>
                    )}

                    <p>
                      {order.postalCode}{" "}
                      {order.city}
                    </p>

                    <p className="font-semibold">
                      {destinationCountry}
                    </p>
                  </div>
                </section>
              </div>

              {/* =============================================
                  COLONNE DROITE
              ============================================= */}

              <aside className="flex min-w-0 flex-col gap-5">

                {/* -------------------------------------------
                    MONTANTS
                ------------------------------------------- */}

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="mb-5 flex items-center gap-2">
                    <ReceiptText
                      size={22}
                      className="text-[#16a51f]"
                    />
                    <h2 className="text-base font-extrabold">
                      {t.cart.title}
                    </h2>
                  </div>

                  <dl className="space-y-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <dt className="text-slate-600">
                        {text.subtotal}
                      </dt>
                      <dd className="font-semibold">
                        {formatCheckoutCurrency(
                          order.subtotalCents,
                          locale
                        )}
                      </dd>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <dt className="text-slate-600">
                        {text.shipping}
                      </dt>
                      <dd className="font-semibold">
                        {formatCheckoutCurrency(
                          order.shippingCents,
                          locale
                        )}
                      </dd>
                    </div>

                    {order.taxCents !== null && (
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <dt className="text-slate-600">
                          {t.cart.taxes}
                        </dt>
                        <dd className="font-semibold">
                          {formatCheckoutCurrency(
                            order.taxCents,
                            locale
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#edf8e9] px-4 py-4">
                    <span className="text-sm font-black">
                      {text.total}
                    </span>

                    <span className="text-lg font-black text-[#128b20] sm:text-xl">
                      {formatCheckoutCurrency(
                        order.totalCents,
                        locale
                      )}
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <BadgeCheck
                        size={17}
                        className="text-[#16a51f]"
                      />

                      <span className="text-xs font-bold">
                        {translateCheckoutOrderStatus(
                          order.status,
                          locale
                        )}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-600">
                      {t.confirmation.orderNumber} :{" "}
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {formatCheckoutDate(
                        order.createdAt,
                        locale
                      )}
                    </p>
                  </div>
                </section>

                {/* -------------------------------------------
                    PAIEMENT
                ------------------------------------------- */}

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-center gap-2">
                    <CreditCard
                      size={20}
                      className="text-[#16a51f]"
                    />
                    <h2 className="text-sm font-extrabold">
                      {t.confirmation.paymentNotConfirmed}
                    </h2>
                  </div>

                  <p className="mt-3 text-sm font-semibold">
                    {translateCheckoutPaymentStatus(
                      order.paymentStatus,
                      locale
                    )}
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {order.paymentStatus === "PAID"
                      ? text.paymentReceived
                      : text.noPayment}
                  </p>
                </section>

                {/* -------------------------------------------
                    NOTIFICATIONS E-MAIL
                ------------------------------------------- */}

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Mail
                      size={20}
                      className="text-[#16a51f]"
                    />
                    <h2 className="text-sm font-extrabold">
                      {text.notificationTitle}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <NotificationStatus
                      title={text.customerEmail}
                      status={
                        customerNotification?.status ??
                        null
                      }
                      locale={locale}
                    />

                    <NotificationStatus
                      title={text.adminEmail}
                      status={
                        adminNotification?.status ??
                        null
                      }
                      locale={locale}
                    />
                  </div>
                </section>

                {/* -------------------------------------------
                    PROCHAINES ÉTAPES
                ------------------------------------------- */}

                <section className="rounded-2xl border border-[#d5e9d5] bg-[#f0f8ef] p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <Truck
                      size={21}
                      className="text-[#16a51f]"
                    />
                    <h2 className="text-sm font-extrabold">
                      {text.nextStepTitle}
                    </h2>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#254238]">
                    {t.confirmation.nextSteps}
                  </p>

                  <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#46644e]">
                    <ShieldCheck
                      size={16}
                      className="mt-0.5 shrink-0"
                    />
                    <span>
                      {t.security.description}
                    </span>
                  </div>
                </section>
              </aside>
            </div>

            {/* ===============================================
                BOUTONS
            =============================================== */}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link
                href={`/${locale}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-sm font-bold text-[#102b39] hover:bg-slate-50"
              >
                <ArrowLeft size={17} />
                {text.homeButton}
              </Link>

              <Link
                href={`/${locale}/produits`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0c9422] px-7 text-sm font-bold text-white hover:bg-[#087a19]"
              >
                {text.shopButton}
                <ArrowRight size={17} />
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA CHECKOUT CONFIRMATION
// ============================================================

export default function CheckoutConfirmationPage(props: ConfirmationPageProps) { return <Suspense fallback={<main aria-busy="true" className="min-h-80"/>}><CheckoutConfirmationContent {...props}/></Suspense>; }
