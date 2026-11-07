"use client";

import { useCallback, useRef, useState } from "react";

import {
  ArrowRight,
  Check,
  ChevronRight,
  Clipboard,
  Headphones,
  Mail,
} from "lucide-react";

import ContactForm from "@/components/contact/ContactForm";
import ContactFAQ from "@/components/contact/ContactFAQ";

import {
  normalizeCheckoutLocale,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

/**
 * ============================================================
 * CYCLORIVA — PAGE CONTACT / COMPOSANT PRINCIPAL
 * ============================================================
 *
 * Fichier :
 * components/contact/ContactClient.tsx
 *
 * STACK :
 * - Next.js 16
 * - React 19
 * - TypeScript
 * - Tailwind CSS 4
 * - Lucide React
 *
 * ARCHITECTURE :
 *
 * DESKTOP :
 *   Nos coordonnées | Formulaire de contact
 *   ----------------------------------------
 *                  FAQ
 *
 * MOBILE :
 *   Contactez-nous
 *   Coordonnées
 *   Bouton ouvrir le formulaire
 *   FAQ interactive
 *
 * FONCTIONNALITÉS :
 * - Deux e-mails officiels
 * - Copier une adresse e-mail
 * - Liens mailto
 * - Téléphone allemand
 * - Téléphone français
 * - WhatsApp allemand
 * - WhatsApp français
 * - Formulaire multilingue
 * - FAQ multilingue
 * - Responsive complet
 *
 * IMPORTANT :
 * - Aucun horaire d'ouverture inventé
 * - Aucun message envoyé directement ici
 * - L'envoi réel dépend de POST /api/contact
 * - Header et footer du site non dupliqués
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

export type ContactClientProps = {
  locale: CheckoutLocale | string;
  className?: string;
};

type ContactTexts = {
  title: string;
  subtitle: string;
  contactDetails: string;
  contactIntroduction: string;

  orderInformation: string;
  generalQuestions: string;

  phoneAndWhatsApp: string;
  germany: string;
  france: string;

  whatsapp: string;
  call: string;

  copyEmail: string;
  copied: string;
  copyFailed: string;

  openContactForm: string;
  closeContactForm: string;

  faqLabel: string;
};

type EmailContact = {
  id: string;
  email: string;
  labelKey: "orderInformation" | "generalQuestions";
};

type PhoneContact = {
  id: string;
  number: string;
  countryCode: "DE" | "FR";
  flag: string;
  telHref: string;
  whatsappHref: string;
};

// ============================================================
// 2. COORDONNÉES OFFICIELLES
// ============================================================

const EMAIL_CONTACTS: EmailContact[] = [
  {
    id: "orders",
    email: "sell@cycloriva.com",
    labelKey: "orderInformation",
  },
  {
    id: "general",
    email: "contact@cycloriva.com",
    labelKey: "generalQuestions",
  },
];

const PHONE_CONTACTS: PhoneContact[] = [
  {
    id: "germany",
    number: "+49 1573 0394552",
    countryCode: "DE",
    flag: "🇩🇪",
    telHref: "tel:+4915730394552",
    whatsappHref: "https://wa.me/4915730394552",
  },
  {
    id: "france",
    number: "+33 6 58 69 41 78",
    countryCode: "FR",
    flag: "🇫🇷",
    telHref: "tel:+33658694178",
    whatsappHref: "https://wa.me/33658694178",
  },
];

// ============================================================
// 3. TRADUCTIONS COMPLÈTES
// ============================================================

const CONTACT_TEXTS: Record<CheckoutLocale, ContactTexts> = {
  fr: {
    title: "Contactez-nous",
    subtitle: "Une question, une commande ou un besoin d'assistance ?",
    contactDetails: "Nos coordonnées",
    contactIntroduction:
      "Une question, une commande ou un besoin d'assistance ? Notre équipe vous répondra dès que possible.",

    orderInformation: "Information sur les commandes",
    generalQuestions: "Nous poser vos questions",

    phoneAndWhatsApp: "Téléphone et WhatsApp",
    germany: "Allemagne",
    france: "France",

    whatsapp: "WhatsApp",
    call: "Appeler",

    copyEmail: "Copier l'adresse e-mail",
    copied: "Adresse copiée",
    copyFailed:
      "Impossible de copier l'adresse. Vous pouvez la sélectionner manuellement.",

    openContactForm: "Envoyez-nous un message",
    closeContactForm: "Fermer le formulaire",

    faqLabel: "Questions fréquentes",
  },

  en: {
    title: "Contact us",
    subtitle: "Have a question, an order enquiry or need assistance?",
    contactDetails: "Our contact details",
    contactIntroduction:
      "Have a question, an order enquiry or need assistance? Our team will respond as soon as possible.",

    orderInformation: "Order information",
    generalQuestions: "General enquiries",

    phoneAndWhatsApp: "Phone and WhatsApp",
    germany: "Germany",
    france: "France",

    whatsapp: "WhatsApp",
    call: "Call",

    copyEmail: "Copy email address",
    copied: "Address copied",
    copyFailed: "Unable to copy the address. You can select it manually.",

    openContactForm: "Send us a message",
    closeContactForm: "Close the form",

    faqLabel: "Frequently asked questions",
  },

  de: {
    title: "Kontaktieren Sie uns",
    subtitle: "Haben Sie Fragen zu einer Bestellung oder benötigen Sie Hilfe?",
    contactDetails: "Unsere Kontaktdaten",
    contactIntroduction:
      "Haben Sie Fragen zu einer Bestellung oder benötigen Sie Hilfe? Unser Team antwortet Ihnen so bald wie möglich.",

    orderInformation: "Informationen zu Bestellungen",
    generalQuestions: "Allgemeine Fragen",

    phoneAndWhatsApp: "Telefon und WhatsApp",
    germany: "Deutschland",
    france: "Frankreich",

    whatsapp: "WhatsApp",
    call: "Anrufen",

    copyEmail: "E-Mail-Adresse kopieren",
    copied: "Adresse kopiert",
    copyFailed:
      "Die Adresse konnte nicht kopiert werden. Sie können sie manuell auswählen.",

    openContactForm: "Schreiben Sie uns eine Nachricht",
    closeContactForm: "Formular schließen",

    faqLabel: "Häufig gestellte Fragen",
  },

  it: {
    title: "Contattaci",
    subtitle: "Hai domande su un ordine o hai bisogno di assistenza?",
    contactDetails: "I nostri contatti",
    contactIntroduction:
      "Hai domande su un ordine o hai bisogno di assistenza? Il nostro team risponderà appena possibile.",

    orderInformation: "Informazioni sugli ordini",
    generalQuestions: "Domande generali",

    phoneAndWhatsApp: "Telefono e WhatsApp",
    germany: "Germania",
    france: "Francia",

    whatsapp: "WhatsApp",
    call: "Chiama",

    copyEmail: "Copia indirizzo e-mail",
    copied: "Indirizzo copiato",
    copyFailed:
      "Impossibile copiare l'indirizzo. Puoi selezionarlo manualmente.",

    openContactForm: "Inviaci un messaggio",
    closeContactForm: "Chiudi il modulo",

    faqLabel: "Domande frequenti",
  },

  es: {
    title: "Contáctanos",
    subtitle: "¿Tienes alguna pregunta sobre un pedido o necesitas ayuda?",
    contactDetails: "Nuestros datos de contacto",
    contactIntroduction:
      "¿Tienes alguna pregunta sobre un pedido o necesitas ayuda? Nuestro equipo responderá lo antes posible.",

    orderInformation: "Información sobre pedidos",
    generalQuestions: "Consultas generales",

    phoneAndWhatsApp: "Teléfono y WhatsApp",
    germany: "Alemania",
    france: "Francia",

    whatsapp: "WhatsApp",
    call: "Llamar",

    copyEmail: "Copiar correo electrónico",
    copied: "Dirección copiada",
    copyFailed:
      "No se pudo copiar la dirección. Puedes seleccionarla manualmente.",

    openContactForm: "Envíanos un mensaje",
    closeContactForm: "Cerrar formulario",

    faqLabel: "Preguntas frecuentes",
  },
};

// ============================================================
// 4. CLASSES VISUELLES
// ============================================================

const CARD_CLASS = [
  "min-w-0",
  "overflow-hidden",
  "rounded-xl",
  "border",
  "border-[#dce5eb]",
  "bg-white",
  "shadow-[0_3px_14px_rgba(16,43,57,0.045)]",
].join(" ");

const EMAIL_ROW_CLASS = [
  "flex",
  "min-w-0",
  "items-center",
  "gap-3",
  "rounded-lg",
  "border",
  "border-[#e0e7ed]",
  "bg-white",
  "p-2.5",
  "shadow-[0_2px_7px_rgba(16,43,57,0.035)]",
  "sm:p-3",
].join(" ");

const PHONE_ROW_CLASS = [
  "flex",
  "min-w-0",
  "items-center",
  "gap-3",
  "rounded-lg",
  "border",
  "border-[#e0e7ed]",
  "bg-white",
  "p-2.5",
  "shadow-[0_2px_7px_rgba(16,43,57,0.035)]",
  "sm:p-3",
].join(" ");

// ============================================================
// 5. ICÔNE WHATSAPP
// ============================================================
//
// Icône vectorielle utilisée uniquement
// pour ouvrir les liens WhatsApp officiels.
//
// ============================================================

function WhatsAppIcon({
  size = 21,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
      <path d="M8.2 8.4c.2-.3.4-.3.7-.3h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c.5 1 1.4 1.9 2.4 2.4l.6-.5c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.3.7-.5.4-1.1.6-1.8.4-2.8-.7-5.2-3.1-5.9-5.9-.2-.7 0-1.3.6-1.6Z" />
    </svg>
  );
}

// ============================================================
// 6. CARTE D'UNE ADRESSE E-MAIL
// ============================================================

function EmailContactRow({
  contact,
  texts,
  copied,
  copyFailed,
  onCopy,
}: {
  contact: EmailContact;
  texts: ContactTexts;
  copied: boolean;
  copyFailed: boolean;
  onCopy: (email: string) => void;
}) {
  return (
    <div className={EMAIL_ROW_CLASS}>
      {/* ICÔNE */}

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#ebf8eb] text-[#06991b] sm:h-12 sm:w-12">
        <Mail size={24} strokeWidth={1.9} aria-hidden="true" />
      </div>

      {/* LIBELLÉ ET ADRESSE */}

      <div className="min-w-0 flex-1">
        <p className="text-[12px] leading-5 font-extrabold text-[#102b39] sm:text-[13px]">
          {texts[contact.labelKey]}
        </p>

        <a
          href={`mailto:${contact.email}`}
          className="mt-0.5 block break-all text-[12px] leading-5 text-[#24425a] hover:text-[#07941e] hover:underline sm:text-[13px]"
        >
          {contact.email}
        </a>
      </div>

      {/* COPIER */}

      <button
        type="button"
        onClick={() => onCopy(contact.email)}
        aria-label={
          copied ? texts.copied : `${texts.copyEmail} : ${contact.email}`
        }
        title={copied ? texts.copied : texts.copyEmail}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#102b39] transition-colors hover:bg-[#eaf8e9] hover:text-[#088d1c] focus-visible:outline-2 focus-visible:outline-[#109b24]"
      >
        {copied ? (
          <Check size={18} className="text-[#109b24]" />
        ) : (
          <Clipboard size={17} />
        )}
      </button>

      {copyFailed && <span className="sr-only">{texts.copyFailed}</span>}
    </div>
  );
}

// ============================================================
// 7. CARTE D'UN NUMÉRO WHATSAPP
// ============================================================

function PhoneContactRow({
  contact,
  texts,
}: {
  contact: PhoneContact;
  texts: ContactTexts;
}) {
  const countryName =
    contact.countryCode === "DE" ? texts.germany : texts.france;

  return (
    <div className={PHONE_ROW_CLASS}>
      {/* ICÔNE WHATSAPP */}

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#079b20] text-white sm:h-11 sm:w-11">
        <WhatsAppIcon size={25} />
      </div>

      {/* INDICATIF ET NUMÉRO */}

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span
            role="img"
            aria-label={countryName}
            className="shrink-0 text-lg"
          >
            {contact.flag}
          </span>

          <a
            href={contact.telHref}
            aria-label={`${texts.call} ${contact.number}`}
            className="min-w-0 text-[12px] leading-5 font-extrabold text-[#102b39] hover:text-[#098b20] sm:text-[14px]"
          >
            {contact.number}
          </a>
        </div>

        <p className="mt-0.5 text-[11px] leading-4 text-[#5b7080]">
          {texts.phoneAndWhatsApp}
        </p>
      </div>

      {/* BOUTON PC */}

      <a
        href={contact.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${texts.whatsapp} ${countryName} : ${contact.number}`}
        className="hidden min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#008e19] px-3 text-[12px] font-extrabold text-white transition-colors hover:bg-[#087a19] sm:inline-flex"
      >
        <WhatsAppIcon size={17} />
        {texts.whatsapp}
      </a>

      {/* FLÈCHE MOBILE */}

      <a
        href={contact.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${texts.whatsapp} ${countryName} : ${contact.number}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#102b39] hover:bg-[#edf8ee] sm:hidden"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </a>
    </div>
  );
}

// ============================================================
// 8. COORDONNÉES
// ============================================================

function ContactDetails({
  texts,
  copiedEmail,
  copyFailed,
  onCopy,
}: {
  texts: ContactTexts;
  copiedEmail: string | null;
  copyFailed: boolean;
  onCopy: (email: string) => void;
}) {
  return (
    <section
      aria-label={texts.contactDetails}
      className={`${CARD_CLASS} p-4 sm:p-5 lg:p-5`}
      data-component="contact-details"
    >
      {/* ====================================================
          TITRE
      ==================================================== */}

      <div className="mb-4 flex items-start gap-3">
        <Headphones
          size={30}
          strokeWidth={1.8}
          className="mt-0.5 shrink-0 text-[#079c22]"
          aria-hidden="true"
        />

        <div className="min-w-0">
          <h2 className="text-[20px] leading-tight font-black tracking-tight text-[#102b39] sm:text-[23px]">
            {texts.contactDetails}
          </h2>

          <p className="mt-2 text-[12px] leading-5 text-[#234054] sm:text-[13px]">
            {texts.contactIntroduction}
          </p>
        </div>
      </div>

      {/* ====================================================
          E-MAILS
      ==================================================== */}

      <div className="space-y-2">
        {EMAIL_CONTACTS.map((contact) => (
          <EmailContactRow
            key={contact.id}
            contact={contact}
            texts={texts}
            copied={copiedEmail === contact.email}
            copyFailed={copyFailed && copiedEmail === contact.email}
            onCopy={onCopy}
          />
        ))}
      </div>

      {/* ====================================================
          TÉLÉPHONE ET WHATSAPP
      ==================================================== */}

      <div className="mt-2 space-y-2">
        {PHONE_CONTACTS.map((contact) => (
          <PhoneContactRow key={contact.id} contact={contact} texts={texts} />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 9. COMPOSANT PRINCIPAL
// ============================================================

export default function ContactClient({
  locale: rawLocale,
  className = "",
}: ContactClientProps) {
  // ----------------------------------------------------------
  // LANGUE
  // ----------------------------------------------------------

  const locale = normalizeCheckoutLocale(rawLocale);

  const texts = CONTACT_TEXTS[locale];

  // ----------------------------------------------------------
  // COPIE E-MAIL
  // ----------------------------------------------------------

  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const [copyFailed, setCopyFailed] = useState(false);

  const handleCopyEmail = useCallback(async (email: string) => {
    setCopyFailed(false);
    setCopiedEmail(null);

    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(email);

      setCopiedEmail(email);
    } catch {
      setCopyFailed(true);
      setCopiedEmail(email);
    }
  }, []);

  // ----------------------------------------------------------
  // FORMULAIRE MOBILE
  // ----------------------------------------------------------
  //
  // Le formulaire reste visible sur PC.
  //
  // Sur mobile, le bouton vert permet
  // de l'ouvrir ou de le refermer.
  //
  // ----------------------------------------------------------

  const [mobileFormOpen, setMobileFormOpen] = useState(false);

  const mobileFormRef = useRef<HTMLDivElement>(null);

  function handleMobileFormToggle() {
    setMobileFormOpen((current) => {
      const next = !current;

      if (next) {
        window.requestAnimationFrame(() => {
          mobileFormRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }

      return next;
    });
  }

  // ----------------------------------------------------------
  // RENDU PRINCIPAL
  // ----------------------------------------------------------

  return (
    <div
      className={`w-full min-w-0 ${className}`}
      data-component="contact-client"
    >
      {/* ====================================================
          TITRE MOBILE
      ==================================================== */}

      <div className="mb-5 flex items-start gap-3 lg:hidden">
        <Headphones
          size={29}
          strokeWidth={1.9}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[#109b24]"
        />

        <div className="min-w-0">
          <h1 className="text-[22px] leading-7 font-black tracking-tight text-[#102b39]">
            {texts.title}
          </h1>

          <p className="mt-1 text-[12px] leading-5 text-[#344c5e]">
            {texts.subtitle}
          </p>
        </div>
      </div>

      {/* ====================================================
          DEUX COLONNES SUR PC
      ==================================================== */}

      <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-5">
        {/* ==================================================
            COORDONNÉES
        ================================================== */}

        <div className="min-w-0">
          <ContactDetails
            texts={texts}
            copiedEmail={copiedEmail}
            copyFailed={copyFailed}
            onCopy={handleCopyEmail}
          />

          {/* ERREUR COPIE ACCESSIBLE */}

          {copyFailed && (
            <p role="alert" className="mt-2 text-xs leading-5 text-red-600">
              {texts.copyFailed}
            </p>
          )}
        </div>

        {/* ==================================================
            FORMULAIRE PC
        ================================================== */}

        <div className="hidden min-w-0 lg:block">
          <ContactForm locale={locale} id="contact-form-desktop" />
        </div>
      </div>

      {/* ====================================================
          BOUTON MOBILE D'OUVERTURE DU FORMULAIRE
      ==================================================== */}

      <div className="mt-5 lg:hidden">
        <button
          type="button"
          onClick={handleMobileFormToggle}
          aria-expanded={mobileFormOpen}
          aria-controls="cycloriva-contact-mobile-form"
          className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-[#008e19] px-4 py-3 text-center text-[14px] font-extrabold text-white transition-colors hover:bg-[#087a19] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#109b24]"
        >
          <Mail size={20} aria-hidden="true" />

          <span>
            {mobileFormOpen ? texts.closeContactForm : texts.openContactForm}
          </span>

          <ArrowRight
            size={17}
            aria-hidden="true"
            className={`transition-transform ${
              mobileFormOpen ? "rotate-90" : ""
            }`}
          />
        </button>
      </div>

      {/* ====================================================
          FORMULAIRE MOBILE DÉPLIABLE
      ==================================================== */}

      <div
        id="cycloriva-contact-mobile-form"
        ref={mobileFormRef}
        className={`min-w-0 scroll-mt-6 pt-4 lg:hidden ${
          mobileFormOpen ? "block" : "hidden"
        }`}
      >
        <ContactForm locale={locale} id="contact-form" />
      </div>

      {/* ====================================================
          FAQ PC ET MOBILE
      ==================================================== */}

      <div className="mt-6 min-w-0 lg:mt-5" aria-label={texts.faqLabel}>
        <ContactFAQ locale={locale} initialOpenIndex={0} id="faq" />
      </div>
    </div>
  );
}

// ============================================================
// 10. EXPORT NOMMÉ
// ============================================================

export { ContactClient };

// ============================================================
// FIN — CYCLORIVA CONTACT CLIENT
// ============================================================
