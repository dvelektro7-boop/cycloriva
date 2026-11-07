import "@/components/site/InformationPages.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock3,
  FileText,
  Headphones,
  House,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

/**
 * ============================================================
 * CYCLORIVA — SUIVI DE COMMANDE
 * ============================================================
 *
 * FICHIER :
 * app/[locale]/suivi-commande/page.tsx
 *
 * Next.js 16 — App Router
 * TypeScript — React — Tailwind CSS 4
 *
 * UN SEUL FICHIER
 *
 * ROUTES :
 * /fr/suivi-commande
 * /en/suivi-commande
 * /de/suivi-commande
 * /it/suivi-commande
 * /es/suivi-commande
 *
 * FONCTIONNALITÉS :
 * - Présentation responsive
 * - Étapes possibles d'une commande
 * - Informations sur le suivi
 * - Assistance par e-mail et WhatsApp
 * - FAQ interactive
 * - SEO multilingue
 *
 * SÉCURITÉ :
 * - Aucune donnée de commande exposée
 * - Aucun statut inventé
 * - Aucune requête à une API inexistante
 * - Aucun accès à Prisma depuis le navigateur
 * - Aucun numéro de commande dans l'URL du site
 *
 * Le suivi automatique nécessitera
 * une intégration serveur authentifiée.
 *
 * Header / Footer : déjà dans le layout.
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

type Locale = "fr" | "en" | "de" | "it" | "es";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

type Info = {
  title: string;
  description: string;
};

type FAQ = {
  question: string;
  answer: string;
};

type PageTexts = {
  title: string;
  home: string;
  eyebrow: string;
  metaDescription: string;

  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  requestTracking: string;
  viewFAQ: string;

  trackTitle: string;
  trackDescription: string;
  trackNoticeTitle: string;
  trackNotice: string;
  contactOrderButton: string;

  statusTitle: string;
  statusDescription: string;
  statuses: Info[];
  statusNotice: string;

  requestTitle: string;
  requestDescription: string;
  requestSteps: Info[];

  prepareTitle: string;
  prepareDescription: string;
  prepareItems: string[];

  informationTitle: string;
  informationDescription: string;
  delivery: Info;
  trackingNumber: Info;
  address: Info;

  faqTitle: string;
  faqDescription: string;
  faq: FAQ[];

  contactTitle: string;
  contactDescription: string;
  salesEmail: string;
  generalEmail: string;
  whatsappGermany: string;
  whatsappFrance: string;
  sendEmail: string;
  contactPage: string;
  deliveryPage: string;

  closingTitle: string;
  closingDescription: string;
  closingButton: string;

  footerNotice: string;
};

// ============================================================
// 2. CONSTANTES
// ============================================================

const LOCALES: Locale[] = ["fr", "en", "de", "it", "es"];

function resolveLocale(value: string): Locale {
  if (!LOCALES.includes(value as Locale)) {
    notFound();
  }

  return value as Locale;
}

const SALES_EMAIL = "sell@cycloriva.com";
const CONTACT_EMAIL = "contact@cycloriva.com";

const PHONE_DE = "+49 1573 0394552";
const PHONE_FR = "+33 6 58 69 41 78";

const WHATSAPP_DE = "https://wa.me/4915730394552";

const WHATSAPP_FR = "https://wa.me/33658694178";

const CONTAINER = "mx-auto w-full max-w-none px-4 sm:px-6 lg:px-6 xl:px-8";

const CARD =
  "min-w-0 rounded-2xl border border-[#dce5ec] bg-white " +
  "shadow-[0_3px_15px_rgba(16,43,57,0.045)]";

const SECTION_TITLE =
  "text-[23px] font-black tracking-tight text-[#102b39] " +
  "sm:text-[29px] lg:text-[31px]";

const GREEN_BUTTON =
  "inline-flex min-h-12 items-center justify-center gap-2 " +
  "rounded-lg bg-[#078e1d] px-5 py-3 text-center " +
  "text-[13px] font-extrabold text-white transition-colors " +
  "hover:bg-[#067719] focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 " +
  "focus-visible:outline-[#109b24] sm:text-sm";

const OUTLINE_BUTTON =
  "inline-flex min-h-12 items-center justify-center gap-2 " +
  "rounded-lg border border-[#b6c7d2] bg-white " +
  "px-5 py-3 text-center text-[13px] font-bold " +
  "text-[#102b39] hover:bg-[#f4f8fa] sm:text-sm";

// ============================================================
// 3. TRADUCTIONS
// ============================================================

const TEXTS: Record<Locale, PageTexts> = {
  // ==========================================================
  // FRANÇAIS
  // ==========================================================

  fr: {
    title: "Suivi de commande",
    home: "Accueil",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    metaDescription:
      "Retrouvez les informations sur le suivi des commandes CYCLORIVA et les moyens de contacter notre équipe pour une livraison.",

    heroBadge: "ASSISTANCE COMMANDES",
    heroTitle: "Gardez le contact avec CYCLORIVA pour votre commande.",
    heroDescription:
      "Vous souhaitez connaître l'état de préparation ou d'expédition de votre commande ? Découvrez les étapes habituelles et comment demander une mise à jour à notre équipe.",
    requestTracking: "Demander un suivi",
    viewFAQ: "Questions fréquentes",

    trackTitle: "Obtenir des informations sur votre commande",
    trackDescription:
      "Notre équipe peut examiner votre demande à partir de votre référence de commande et des informations disponibles.",
    trackNoticeTitle: "Consultation du statut",
    trackNotice:
      "Le suivi automatique n'est pas encore relié ici à une base de commandes ou à un transporteur. Pour éviter toute information incorrecte, aucun statut de livraison n'est affiché sans vérification. Écrivez à notre équipe avec votre numéro de commande.",
    contactOrderButton: "Écrire au service des commandes",

    statusTitle: "Comprendre les étapes d'une commande",
    statusDescription:
      "Voici les principales étapes possibles. Elles sont présentées à titre explicatif et ne correspondent pas au statut d'une commande particulière.",
    statuses: [
      {
        title: "Commande enregistrée",
        description:
          "La demande de commande est reçue et enregistrée dans le système.",
      },
      {
        title: "Commande en préparation",
        description:
          "Les articles et les modalités de traitement sont en cours de préparation.",
      },
      {
        title: "Commande expédiée",
        description:
          "Le colis a été remis au transporteur lorsqu'une expédition a effectivement eu lieu.",
      },
      {
        title: "En cours de livraison",
        description:
          "Le transporteur assure l'acheminement vers la destination prévue.",
      },
      {
        title: "Commande livrée",
        description:
          "La livraison est confirmée par les informations réelles disponibles.",
      },
    ],
    statusNotice:
      "Ces étapes sont illustratives : aucune n'est attribuée automatiquement à votre commande sur cette page.",

    requestTitle: "Comment demander le suivi ?",
    requestDescription:
      "Trois étapes simples pour obtenir les informations disponibles.",
    requestSteps: [
      {
        title: "Retrouvez votre référence",
        description:
          "Consultez votre confirmation de commande pour retrouver son numéro.",
      },
      {
        title: "Préparez votre demande",
        description:
          "Indiquez votre référence et la question concernant la préparation ou la livraison.",
      },
      {
        title: "Contactez notre équipe",
        description:
          "Envoyez votre demande à sell@cycloriva.com ou utilisez la page Contact.",
      },
    ],

    prepareTitle: "Informations utiles à préparer",
    prepareDescription: "Pour faciliter la recherche de votre commande.",
    prepareItems: [
      "Votre numéro de commande, si vous le possédez.",
      "L'adresse e-mail utilisée lors de la commande.",
      "La date approximative de votre achat.",
      "Une description précise de votre question.",
    ],

    informationTitle: "À savoir sur votre livraison",
    informationDescription: "Quelques informations utiles après la commande.",
    delivery: {
      title: "Délais de livraison",
      description:
        "Ils dépendent du produit, de sa disponibilité et de la destination. Un délai précis doit être confirmé pour la commande concernée.",
    },
    trackingNumber: {
      title: "Numéro de suivi du transporteur",
      description:
        "Un numéro de suivi ne peut être communiqué que lorsqu'il a réellement été attribué à une expédition.",
    },
    address: {
      title: "Modification d'adresse",
      description:
        "Contactez-nous au plus vite en cas d'erreur. Les modifications possibles dépendent de l'état de traitement de la commande.",
    },

    faqTitle: "Questions fréquentes",
    faqDescription: "Cliquez sur une question pour afficher sa réponse.",
    faq: [
      {
        question: "Comment connaître le statut de ma commande ?",
        answer:
          "Contactez sell@cycloriva.com en indiquant votre numéro de commande. Notre équipe pourra vous communiquer les informations disponibles après vérification.",
      },
      {
        question: "Où trouver mon numéro de commande ?",
        answer:
          "Consultez la confirmation de commande reçue par e-mail, lorsqu'elle est disponible. Si vous ne la retrouvez pas, contactez le service client avec les informations utilisées lors de l'achat.",
      },
      {
        question: "Pourquoi je n'ai pas encore de numéro de suivi ?",
        answer:
          "Un numéro de suivi n'est pas nécessairement créé dès l'enregistrement de la commande. Il dépend de la préparation de l'expédition et du transporteur.",
      },
      {
        question: "Quels sont les délais de livraison ?",
        answer:
          "Ils varient selon le produit et la destination. Contactez-nous pour les informations spécifiques à votre commande.",
      },
      {
        question: "Puis-je modifier mon adresse ?",
        answer:
          "Signalez rapidement toute erreur à sell@cycloriva.com avec votre référence. Une modification dépend du traitement et de l'expédition déjà effectués.",
      },
      {
        question: "Que faire si mon colis semble en retard ?",
        answer:
          "Contactez CYCLORIVA avec votre numéro de commande. Les informations de transport et les recours applicables pourront être vérifiés.",
      },
      {
        question: "Que faire si un colis est endommagé ?",
        answer:
          "Conservez les informations de livraison, décrivez les dommages et contactez contact@cycloriva.com. Des photographies peuvent faciliter l'examen de la demande.",
      },
      {
        question: "Comment joindre le service client ?",
        answer:
          "Écrivez à sell@cycloriva.com pour les commandes, ou à contact@cycloriva.com pour les questions générales. Les liens WhatsApp sont également disponibles ci-dessous.",
      },
    ],

    contactTitle: "Contacter CYCLORIVA",
    contactDescription:
      "Pour une question concernant une commande, indiquez sa référence. Ne communiquez pas de mot de passe ou de données bancaires confidentielles.",
    salesEmail: "Suivi et informations sur les commandes",
    generalEmail: "Questions générales",
    whatsappGermany: "Allemagne",
    whatsappFrance: "France",
    sendEmail: "Envoyer un e-mail",
    contactPage: "Page Contact",
    deliveryPage: "Informations de livraison",

    closingTitle: "Besoin d'informations sur votre commande ?",
    closingDescription:
      "Notre équipe reste joignable pour examiner votre demande et les informations disponibles concernant votre livraison.",
    closingButton: "Contacter le service client",

    footerNotice:
      "Cette page explique le suivi des commandes et les moyens d'assistance. Elle ne constitue pas un suivi automatique en temps réel et ne présente aucun statut de commande non vérifié.",
  },

  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    title: "Order Tracking",
    home: "Home",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    metaDescription:
      "Information about CYCLORIVA orders, shipping updates and how to request tracking assistance.",

    heroBadge: "ORDER SUPPORT",
    heroTitle: "Stay informed about your CYCLORIVA order.",
    heroDescription:
      "Want to know whether your order is being prepared or shipped? Learn about the usual stages and how to request an update.",
    requestTracking: "Request an update",
    viewFAQ: "Frequently asked questions",

    trackTitle: "Get information about your order",
    trackDescription:
      "Our team can review your enquiry using the order reference and available information.",
    trackNoticeTitle: "Checking order status",
    trackNotice:
      "Automatic tracking is not yet connected to the order database or a carrier on this page. To avoid incorrect information, no unverified delivery status is displayed. Contact our team with your order number.",
    contactOrderButton: "Email the orders team",

    statusTitle: "Understanding order stages",
    statusDescription:
      "These are possible stages for illustration only, not the actual status of a particular order.",
    statuses: [
      {
        title: "Order recorded",
        description: "The order request has been received and recorded.",
      },
      {
        title: "Preparing the order",
        description:
          "The products and fulfilment arrangements are being prepared.",
      },
      {
        title: "Shipped",
        description:
          "The parcel has been handed to a carrier when dispatch has actually occurred.",
      },
      {
        title: "In transit",
        description:
          "The carrier is transporting the parcel to its destination.",
      },
      {
        title: "Delivered",
        description:
          "Delivery is confirmed using actual available information.",
      },
    ],
    statusNotice:
      "These stages are illustrative and are not automatically assigned to your order.",

    requestTitle: "How to request an update",
    requestDescription: "Three simple steps to request available information.",
    requestSteps: [
      {
        title: "Find your order reference",
        description: "Check your order confirmation for the reference number.",
      },
      {
        title: "Prepare your enquiry",
        description:
          "Include your reference and explain what you need to know.",
      },
      {
        title: "Contact our team",
        description: "Email sell@cycloriva.com or use the Contact page.",
      },
    ],

    prepareTitle: "Useful information to prepare",
    prepareDescription: "These details can help locate your order.",
    prepareItems: [
      "Your order number, if available.",
      "The email address used for the order.",
      "The approximate purchase date.",
      "A clear description of your enquiry.",
    ],

    informationTitle: "About your delivery",
    informationDescription: "Helpful information following an order.",
    delivery: {
      title: "Delivery times",
      description:
        "Timing depends on the product, availability and destination. A specific estimate must be confirmed for your order.",
    },
    trackingNumber: {
      title: "Carrier tracking number",
      description:
        "A tracking number can only be supplied when one has actually been assigned to a shipment.",
    },
    address: {
      title: "Changing your address",
      description:
        "Contact us promptly if an address is incorrect. Changes depend on the order's processing and shipping status.",
    },

    faqTitle: "Frequently asked questions",
    faqDescription: "Select a question to view the answer.",
    faq: [
      {
        question: "How do I check my order status?",
        answer:
          "Contact sell@cycloriva.com with your order number. Our team can check and share the available information.",
      },
      {
        question: "Where can I find my order number?",
        answer:
          "Check your order confirmation email, when available. If you cannot find it, contact customer service with your purchase details.",
      },
      {
        question: "Why don't I have a tracking number yet?",
        answer:
          "Tracking numbers are not necessarily created when orders are first recorded. They depend on dispatch arrangements and the carrier.",
      },
      {
        question: "How long will delivery take?",
        answer:
          "Timing varies by product and destination. Contact our team for details relating to your order.",
      },
      {
        question: "Can I change the delivery address?",
        answer:
          "Contact sell@cycloriva.com promptly with your order reference. The possibility of changing the address depends on processing and dispatch status.",
      },
      {
        question: "What if my parcel seems delayed?",
        answer:
          "Contact CYCLORIVA with your order number so available shipping information and applicable remedies can be reviewed.",
      },
      {
        question: "What if the parcel arrives damaged?",
        answer:
          "Keep the delivery information, describe the damage and contact contact@cycloriva.com. Photos may be useful.",
      },
      {
        question: "How do I contact customer service?",
        answer:
          "Email sell@cycloriva.com for orders or contact@cycloriva.com for general enquiries. WhatsApp links are also listed below.",
      },
    ],

    contactTitle: "Contact CYCLORIVA",
    contactDescription:
      "Include your order reference when asking about an order. Never share passwords or confidential banking data.",
    salesEmail: "Order updates and enquiries",
    generalEmail: "General enquiries",
    whatsappGermany: "Germany",
    whatsappFrance: "France",
    sendEmail: "Send an email",
    contactPage: "Contact page",
    deliveryPage: "Delivery information",

    closingTitle: "Need an update on your order?",
    closingDescription:
      "Our team can review your enquiry and the available shipping information.",
    closingButton: "Contact customer service",

    footerNotice:
      "This page explains order tracking and support. It does not offer live automated tracking or display unverified order statuses.",
  },

  // ==========================================================
  // DEUTSCH
  // ==========================================================

  de: {
    title: "Bestellverfolgung",
    home: "Startseite",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    metaDescription:
      "CYCLORIVA Informationen zur Bestellverfolgung, Lieferung und Kontaktmöglichkeiten bei Versandfragen.",

    heroBadge: "BESTELLSERVICE",
    heroTitle: "Informationen zu Ihrer CYCLORIVA-Bestellung.",
    heroDescription:
      "Möchten Sie den Bearbeitungs- oder Versandstand erfahren? Hier finden Sie die möglichen Schritte und Kontaktmöglichkeiten.",
    requestTracking: "Status anfragen",
    viewFAQ: "Häufige Fragen",

    trackTitle: "Informationen zur Bestellung erhalten",
    trackDescription:
      "Unser Team kann Ihre Anfrage anhand der Bestellnummer und verfügbarer Angaben prüfen.",
    trackNoticeTitle: "Bestellstatus prüfen",
    trackNotice:
      "Die automatische Verfolgung ist auf dieser Seite noch nicht mit einer Bestelldatenbank oder einem Transportdienst verbunden. Deshalb werden keine unbestätigten Statusangaben angezeigt. Kontaktieren Sie unser Team mit Ihrer Bestellnummer.",
    contactOrderButton: "Bestellservice per E-Mail kontaktieren",

    statusTitle: "Mögliche Schritte einer Bestellung",
    statusDescription:
      "Diese Schritte dienen nur der Erklärung und sind keine Angaben zu einer konkreten Bestellung.",
    statuses: [
      {
        title: "Bestellung erfasst",
        description: "Die Bestellanfrage wurde empfangen und gespeichert.",
      },
      {
        title: "In Vorbereitung",
        description: "Produkte und Versandvorbereitung werden bearbeitet.",
      },
      {
        title: "Versendet",
        description:
          "Die Sendung wurde tatsächlich an einen Transportdienst übergeben.",
      },
      {
        title: "Unterwegs",
        description: "Die Sendung befindet sich im Transport zum Lieferziel.",
      },
      {
        title: "Zugestellt",
        description:
          "Die Zustellung wurde durch verfügbare tatsächliche Angaben bestätigt.",
      },
    ],
    statusNotice:
      "Die dargestellten Schritte sind Beispiele und kein bestätigter Status Ihrer Bestellung.",

    requestTitle: "So fragen Sie den Status an",
    requestDescription: "Drei Schritte für Ihre Anfrage.",
    requestSteps: [
      {
        title: "Bestellnummer finden",
        description: "Prüfen Sie die Bestellbestätigung auf Ihre Referenz.",
      },
      {
        title: "Anfrage vorbereiten",
        description: "Nennen Sie die Bestellnummer und Ihr Anliegen.",
      },
      {
        title: "Team kontaktieren",
        description:
          "Schreiben Sie an sell@cycloriva.com oder nutzen Sie die Kontaktseite.",
      },
    ],

    prepareTitle: "Diese Angaben sind hilfreich",
    prepareDescription: "Damit wir Ihre Bestellung leichter zuordnen können.",
    prepareItems: [
      "Ihre Bestellnummer, falls vorhanden.",
      "Die bei der Bestellung verwendete E-Mail-Adresse.",
      "Das ungefähre Bestelldatum.",
      "Eine genaue Beschreibung Ihrer Frage.",
    ],

    informationTitle: "Informationen zur Lieferung",
    informationDescription: "Wichtige Hinweise nach der Bestellung.",
    delivery: {
      title: "Lieferzeiten",
      description:
        "Sie hängen von Produkt, Verfügbarkeit und Lieferziel ab. Konkrete Angaben müssen für die Bestellung bestätigt werden.",
    },
    trackingNumber: {
      title: "Sendungsnummer",
      description:
        "Eine Nummer kann nur übermittelt werden, wenn sie der Sendung tatsächlich zugeordnet wurde.",
    },
    address: {
      title: "Lieferadresse ändern",
      description:
        "Melden Sie Fehler schnellstmöglich. Änderungen hängen vom Bearbeitungs- und Versandstatus ab.",
    },

    faqTitle: "Häufig gestellte Fragen",
    faqDescription: "Klicken Sie auf eine Frage, um die Antwort zu lesen.",
    faq: [
      {
        question: "Wie erfahre ich den Status meiner Bestellung?",
        answer:
          "Kontaktieren Sie sell@cycloriva.com mit Ihrer Bestellnummer. Unser Team prüft die verfügbaren Informationen.",
      },
      {
        question: "Wo finde ich die Bestellnummer?",
        answer:
          "Prüfen Sie die Bestätigung per E-Mail, sofern vorhanden. Andernfalls helfen die beim Kauf verwendeten Angaben.",
      },
      {
        question: "Warum habe ich noch keine Sendungsnummer?",
        answer:
          "Eine Sendungsnummer wird nicht immer sofort bei der Bestellerfassung erstellt. Sie hängt vom Versandvorgang und dem Transportdienst ab.",
      },
      {
        question: "Wie lange dauert die Lieferung?",
        answer:
          "Die Dauer hängt vom Produkt und Lieferziel ab. Fragen Sie uns nach Informationen zu Ihrer Bestellung.",
      },
      {
        question: "Kann ich meine Lieferadresse ändern?",
        answer:
          "Schreiben Sie möglichst schnell an sell@cycloriva.com mit Ihrer Referenz. Änderungen hängen vom Bearbeitungsstand ab.",
      },
      {
        question: "Was tun bei einer Lieferverzögerung?",
        answer:
          "Kontaktieren Sie CYCLORIVA mit Ihrer Bestellnummer. Verfügbare Versanddaten und etwaige Ansprüche können geprüft werden.",
      },
      {
        question: "Was tun bei einem beschädigten Paket?",
        answer:
          "Bewahren Sie die Lieferangaben auf, beschreiben Sie den Schaden und schreiben Sie an contact@cycloriva.com.",
      },
      {
        question: "Wie erreiche ich den Kundenservice?",
        answer:
          "Bestellungen: sell@cycloriva.com. Allgemeine Fragen: contact@cycloriva.com. WhatsApp-Kontakte finden Sie weiter unten.",
      },
    ],

    contactTitle: "CYCLORIVA kontaktieren",
    contactDescription:
      "Nennen Sie bei Bestellanfragen die Bestellnummer. Übermitteln Sie keine Passwörter oder vertraulichen Bankdaten.",
    salesEmail: "Bestellstatus und Informationen",
    generalEmail: "Allgemeine Fragen",
    whatsappGermany: "Deutschland",
    whatsappFrance: "Frankreich",
    sendEmail: "E-Mail senden",
    contactPage: "Kontaktseite",
    deliveryPage: "Lieferinformationen",

    closingTitle: "Fragen zum Bestellstatus?",
    closingDescription:
      "Unser Team kann Ihre Anfrage anhand der verfügbaren Informationen prüfen.",
    closingButton: "Kundenservice kontaktieren",

    footerNotice:
      "Diese Seite erklärt die Bestellverfolgung und Kontaktmöglichkeiten. Sie zeigt keine unbestätigten Statusangaben und bietet noch keine automatische Echtzeitabfrage.",
  },

  // ==========================================================
  // ITALIANO
  // ==========================================================

  it: {
    title: "Tracciamento ordini",
    home: "Home",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    metaDescription:
      "Informazioni CYCLORIVA per verificare gli ordini, richiedere aggiornamenti sulle spedizioni e contattare l'assistenza.",

    heroBadge: "ASSISTENZA ORDINI",
    heroTitle: "Rimani informato sul tuo ordine CYCLORIVA.",
    heroDescription:
      "Vuoi conoscere lo stato di preparazione o spedizione? Scopri le fasi possibili e come chiedere aggiornamenti.",
    requestTracking: "Richiedi aggiornamenti",
    viewFAQ: "Domande frequenti",

    trackTitle: "Informazioni sul tuo ordine",
    trackDescription:
      "Il nostro team può esaminare la richiesta utilizzando il riferimento dell'ordine e i dati disponibili.",
    trackNoticeTitle: "Verifica dello stato",
    trackNotice:
      "Il tracciamento automatico non è ancora collegato in questa pagina al database degli ordini o a un corriere. Per evitare informazioni errate non viene mostrato alcuno stato non verificato. Contattaci indicando il numero d'ordine.",
    contactOrderButton: "Scrivi al servizio ordini",

    statusTitle: "Le possibili fasi di un ordine",
    statusDescription:
      "Queste fasi sono illustrative e non rappresentano lo stato di un ordine specifico.",
    statuses: [
      {
        title: "Ordine registrato",
        description: "La richiesta è stata ricevuta e registrata.",
      },
      {
        title: "In preparazione",
        description:
          "Gli articoli e le modalità di spedizione vengono preparati.",
      },
      {
        title: "Spedito",
        description: "Il pacco è stato effettivamente affidato al corriere.",
      },
      {
        title: "In transito",
        description: "Il corriere sta trasportando il pacco alla destinazione.",
      },
      {
        title: "Consegnato",
        description: "La consegna è confermata da informazioni effettive.",
      },
    ],
    statusNotice:
      "Queste fasi sono esempi e non rappresentano lo stato verificato del tuo ordine.",

    requestTitle: "Come richiedere aggiornamenti",
    requestDescription: "Tre semplici passaggi.",
    requestSteps: [
      {
        title: "Trova il riferimento",
        description: "Controlla il numero nella conferma dell'ordine.",
      },
      {
        title: "Prepara la richiesta",
        description: "Indica il riferimento e le informazioni desiderate.",
      },
      {
        title: "Contatta il team",
        description:
          "Scrivi a sell@cycloriva.com oppure usa la pagina Contatti.",
      },
    ],

    prepareTitle: "Dati utili da preparare",
    prepareDescription: "Per facilitare la ricerca dell'ordine.",
    prepareItems: [
      "Il numero d'ordine, se disponibile.",
      "L'indirizzo e-mail utilizzato durante l'acquisto.",
      "La data approssimativa dell'ordine.",
      "Una descrizione chiara della richiesta.",
    ],

    informationTitle: "Informazioni sulla consegna",
    informationDescription: "Alcune indicazioni utili.",
    delivery: {
      title: "Tempi di consegna",
      description:
        "Dipendono dal prodotto, dalla disponibilità e dalla destinazione. Una stima deve essere confermata per l'ordine.",
    },
    trackingNumber: {
      title: "Numero di tracciamento",
      description:
        "Può essere comunicato solo quando è stato effettivamente assegnato alla spedizione.",
    },
    address: {
      title: "Modifica dell'indirizzo",
      description:
        "Segnala eventuali errori quanto prima. Le modifiche dipendono dallo stato di elaborazione.",
    },

    faqTitle: "Domande frequenti",
    faqDescription: "Seleziona una domanda per leggere la risposta.",
    faq: [
      {
        question: "Come verifico lo stato del mio ordine?",
        answer:
          "Scrivi a sell@cycloriva.com con il numero d'ordine. Il nostro team potrà verificare i dati disponibili.",
      },
      {
        question: "Dove trovo il numero d'ordine?",
        answer:
          "Consulta la conferma ricevuta via e-mail, se disponibile. In alternativa contatta l'assistenza con i dettagli dell'acquisto.",
      },
      {
        question: "Perché non ho un numero di tracciamento?",
        answer:
          "Il numero potrebbe non essere ancora stato assegnato. Dipende dalla preparazione e dal corriere.",
      },
      {
        question: "Quanto dura la consegna?",
        answer:
          "I tempi variano secondo prodotto e destinazione. Richiedi informazioni specifiche al nostro team.",
      },
      {
        question: "Posso cambiare l'indirizzo?",
        answer:
          "Contatta subito sell@cycloriva.com con il riferimento. La possibilità dipende dallo stato dell'ordine.",
      },
      {
        question: "Cosa fare in caso di ritardo?",
        answer:
          "Contatta CYCLORIVA con il numero d'ordine per verificare le informazioni disponibili e gli eventuali diritti applicabili.",
      },
      {
        question: "Cosa fare se il pacco arriva danneggiato?",
        answer:
          "Conserva i dettagli della consegna, descrivi il danno e contatta contact@cycloriva.com.",
      },
      {
        question: "Come contatto l'assistenza?",
        answer:
          "Per gli ordini usa sell@cycloriva.com; per domande generali contact@cycloriva.com. Trovi anche i contatti WhatsApp.",
      },
    ],

    contactTitle: "Contatta CYCLORIVA",
    contactDescription:
      "Indica il riferimento dell'ordine quando disponibile. Non condividere password o dati bancari riservati.",
    salesEmail: "Aggiornamenti e informazioni sugli ordini",
    generalEmail: "Domande generali",
    whatsappGermany: "Germania",
    whatsappFrance: "Francia",
    sendEmail: "Invia un'e-mail",
    contactPage: "Pagina Contatti",
    deliveryPage: "Informazioni sulla consegna",

    closingTitle: "Hai domande sul tuo ordine?",
    closingDescription:
      "Il nostro team può esaminare la tua richiesta e i dati di spedizione disponibili.",
    closingButton: "Contatta l'assistenza",

    footerNotice:
      "Questa pagina fornisce informazioni sul tracciamento e sull'assistenza. Non mostra stati non verificati né un tracciamento automatico in tempo reale.",
  },

  // ==========================================================
  // ESPAÑOL
  // ==========================================================

  es: {
    title: "Seguimiento de pedidos",
    home: "Inicio",
    eyebrow: "BICICLETAS & MOVILIDAD ELÉCTRICA EN EUROPA",
    metaDescription:
      "Información CYCLORIVA para consultar pedidos, solicitar actualizaciones de envíos y contactar con atención al cliente.",

    heroBadge: "ASISTENCIA DE PEDIDOS",
    heroTitle: "Mantente informado sobre tu pedido CYCLORIVA.",
    heroDescription:
      "¿Quieres conocer el estado de preparación o envío? Descubre las etapas habituales y cómo solicitar información.",
    requestTracking: "Solicitar seguimiento",
    viewFAQ: "Preguntas frecuentes",

    trackTitle: "Obtener información sobre tu pedido",
    trackDescription:
      "Nuestro equipo puede revisar tu consulta mediante la referencia y los datos disponibles.",
    trackNoticeTitle: "Consulta de estado",
    trackNotice:
      "El seguimiento automático todavía no está conectado en esta página a la base de datos ni a un transportista. Para evitar información incorrecta, no se muestran estados sin verificar. Contacta con nosotros con tu número de pedido.",
    contactOrderButton: "Escribir al servicio de pedidos",

    statusTitle: "Las etapas posibles de un pedido",
    statusDescription:
      "Son ejemplos informativos y no muestran el estado de un pedido concreto.",
    statuses: [
      {
        title: "Pedido registrado",
        description: "La solicitud se ha recibido y registrado.",
      },
      {
        title: "En preparación",
        description: "Se están preparando los artículos y la expedición.",
      },
      {
        title: "Enviado",
        description: "El paquete se ha entregado realmente al transportista.",
      },
      {
        title: "En tránsito",
        description: "El transportista traslada el paquete a su destino.",
      },
      {
        title: "Entregado",
        description: "La entrega está confirmada mediante información real.",
      },
    ],
    statusNotice:
      "Estas etapas son orientativas y no constituyen información verificada de tu pedido.",

    requestTitle: "Cómo solicitar el seguimiento",
    requestDescription: "Tres pasos para solicitar la información disponible.",
    requestSteps: [
      {
        title: "Busca tu referencia",
        description: "Consulta el número en la confirmación del pedido.",
      },
      {
        title: "Prepara la consulta",
        description: "Indica la referencia y la información que necesitas.",
      },
      {
        title: "Contacta con el equipo",
        description:
          "Escribe a sell@cycloriva.com o utiliza la página de contacto.",
      },
    ],

    prepareTitle: "Datos útiles para preparar",
    prepareDescription: "Ayudan a identificar el pedido.",
    prepareItems: [
      "Número de pedido, si lo tienes.",
      "Correo electrónico utilizado en la compra.",
      "Fecha aproximada de compra.",
      "Descripción clara de tu consulta.",
    ],

    informationTitle: "Sobre la entrega",
    informationDescription: "Información útil después de comprar.",
    delivery: {
      title: "Plazos de entrega",
      description:
        "Dependen del producto, disponibilidad y destino. Debe confirmarse el plazo para cada pedido.",
    },
    trackingNumber: {
      title: "Número de seguimiento",
      description:
        "Solo puede proporcionarse cuando realmente se haya asignado a un envío.",
    },
    address: {
      title: "Cambiar la dirección",
      description:
        "Comunica los errores cuanto antes. Los cambios dependen del estado de tramitación.",
    },

    faqTitle: "Preguntas frecuentes",
    faqDescription: "Selecciona una pregunta para ver la respuesta.",
    faq: [
      {
        question: "¿Cómo conozco el estado de mi pedido?",
        answer:
          "Contacta con sell@cycloriva.com e indica el número de pedido. Nuestro equipo podrá consultar los datos disponibles.",
      },
      {
        question: "¿Dónde encuentro el número de pedido?",
        answer:
          "Busca la confirmación de pedido recibida por correo, si está disponible. Si no la encuentras, contacta con atención al cliente.",
      },
      {
        question: "¿Por qué todavía no tengo número de seguimiento?",
        answer:
          "Puede que todavía no se haya asignado. Depende de la preparación del envío y del transportista.",
      },
      {
        question: "¿Cuánto tarda la entrega?",
        answer:
          "Depende del producto y destino. Solicita información específica a nuestro equipo.",
      },
      {
        question: "¿Puedo modificar la dirección?",
        answer:
          "Contacta cuanto antes con sell@cycloriva.com con la referencia. La posibilidad de cambiarla depende del estado del pedido.",
      },
      {
        question: "¿Qué hago si mi paquete se retrasa?",
        answer:
          "Contacta con CYCLORIVA con tu número de pedido para revisar la información disponible y los posibles derechos aplicables.",
      },
      {
        question: "¿Qué hago si el paquete llega dañado?",
        answer:
          "Conserva los datos de entrega, describe el daño y escribe a contact@cycloriva.com.",
      },
      {
        question: "¿Cómo contacto con el servicio al cliente?",
        answer:
          "Pedidos: sell@cycloriva.com. Consultas generales: contact@cycloriva.com. También puedes utilizar WhatsApp.",
      },
    ],

    contactTitle: "Contacta con CYCLORIVA",
    contactDescription:
      "Incluye la referencia del pedido cuando sea posible. Nunca compartas contraseñas ni datos bancarios confidenciales.",
    salesEmail: "Información y seguimiento de pedidos",
    generalEmail: "Consultas generales",
    whatsappGermany: "Alemania",
    whatsappFrance: "Francia",
    sendEmail: "Enviar correo",
    contactPage: "Página de contacto",
    deliveryPage: "Información de entrega",

    closingTitle: "¿Necesitas información sobre tu pedido?",
    closingDescription:
      "Nuestro equipo puede revisar tu consulta y los datos disponibles.",
    closingButton: "Contactar con atención al cliente",

    footerNotice:
      "Esta página explica el seguimiento y los medios de contacto. No muestra estados sin verificar ni ofrece seguimiento automático en tiempo real.",
  },
};

// ============================================================
// 4. MÉTADONNÉES SEO
// ============================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return {
    title: `${t.title} | CYCLORIVA`,
    description: t.metaDescription,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: `/${locale}/suivi-commande`,
      languages: {
        fr: "/fr/suivi-commande",
        en: "/en/suivi-commande",
        de: "/de/suivi-commande",
        it: "/it/suivi-commande",
        es: "/es/suivi-commande",
        "x-default": "/fr/suivi-commande",
      },
    },

    openGraph: {
      type: "website",
      title: `${t.title} | CYCLORIVA`,
      description: t.metaDescription,
    },
  };
}

// ============================================================
// 5. BANDEAU PC
// ============================================================

function TrackingBanner({ t }: { t: PageTexts }) {
  return (
    <section
      aria-label={t.title}
      className="relative hidden min-h-31.25 overflow-hidden bg-[#082a3f] lg:block"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/couverture.png')",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-[#061f32]/95 via-[#061f32]/80 to-[#061f32]/10"
      />

      <div
        className={`${CONTAINER} relative z-10 flex min-h-31.25 flex-col justify-center py-1`}
      >
        <p className="mb-2 flex items-center gap-2 text-[11px] font-extrabold tracking-wide text-white">
          <span aria-hidden="true" className="h-0.75 w-6 bg-[#91df20]" />

          {t.eyebrow}
        </p>

        <h1 className="text-[32px] font-black tracking-tight text-white xl:text-[38px]">
          {t.title}
        </h1>
      </div>
    </section>
  );
}

// ============================================================
// 6. FIL D'ARIANE
// ============================================================

function TrackingBreadcrumb({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 flex-wrap items-center gap-2 py-1 text-xs text-[#425969]"
    >
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 transition-colors hover:text-[#109b24]"
      >
        <House size={17} className="text-[#109b24]" aria-hidden="true" />

        {t.home}
      </Link>

      <ChevronRight
        size={15}
        className="shrink-0 text-[#109b24]"
        aria-hidden="true"
      />

      <span aria-current="page" className="font-semibold text-[#102b39]">
        {t.title}
      </span>
    </nav>
  );
}

// ============================================================
// 7. INTRODUCTION
// ============================================================

function TrackingHero({ t }: { locale: Locale; t: PageTexts }) {
  return (
    <section className="grid min-w-0 items-center gap-3 py-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-3 lg:py-1">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-2 text-[11px] font-extrabold text-[#078d21]">
          <PackageCheck size={17} aria-hidden="true" />
          {t.heroBadge}
        </span>

        <h2 className="mt-2 max-w-180 text-[29px] leading-[1.13] font-black tracking-tight text-[#102b39] sm:text-[40px] lg:text-[46px]">
          {t.heroTitle}
        </h2>

        <p className="mt-2 max-w-157.5 text-[14px] leading-7 text-[#536c7b] sm:text-[15px]">
          {t.heroDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <a href="#demander-suivi" className={GREEN_BUTTON}>
            <SearchCheck size={18} />
            {t.requestTracking}
            <ArrowRight size={17} />
          </a>

          <a href="#faq-suivi" className={OUTLINE_BUTTON}>
            <CircleHelp size={18} />
            {t.viewFAQ}
          </a>
        </div>
      </div>

      {/* Illustration des étapes :
          visuel explicatif, jamais statut réel */}

      <div className={`${CARD} overflow-hidden`}>
        <div className="relative min-h-70 overflow-hidden bg-[#082b3e] p-4 sm:p-3 lg:min-h-64">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-40 border-[#109b24]/15"
          />

          <div className="relative mx-auto flex min-h-58.75 max-w-107.5 flex-col justify-center sm:min-h-65">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#109b24] text-white">
                <PackageCheck size={27} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#a9e99d]">
                  CYCLORIVA
                </p>

                <h3 className="mt-1 text-[16px] font-extrabold text-white">
                  {t.title}
                </h3>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <Package
                  size={32}
                  className="text-[#92ed8d]"
                  aria-hidden="true"
                />

                <Truck size={36} className="text-white" aria-hidden="true" />

                <MapPin
                  size={31}
                  className="text-[#92ed8d]"
                  aria-hidden="true"
                />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#a7e8a2]" />
                <span className="h-1 flex-1 rounded-full bg-white/35" />
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#a7e8a2]" />
                <span className="h-1 flex-1 rounded-full bg-white/35" />
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#a7e8a2]" />
              </div>

              <div className="mt-3 flex items-center gap-2 text-[12px] leading-5 text-white/85">
                <CircleHelp
                  size={17}
                  className="shrink-0 text-[#9de794]"
                  aria-hidden="true"
                />
                {t.statusNotice}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 8. DEMANDER UN SUIVI
// ============================================================

function TrackingRequest({ t }: { t: PageTexts }) {
  return (
    <section id="demander-suivi" className="scroll-mt-24 py-1 lg:py-1">
      <div
        className={`${CARD} grid items-center gap-3 p-3 sm:p-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:p-3`}
      >
        <div className="min-w-0">
          <div className="mb-2 flex h-13 w-13 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
            <SearchCheck size={29} aria-hidden="true" />
          </div>

          <h2 className={SECTION_TITLE}>{t.trackTitle}</h2>

          <p className="mt-3 text-[13px] leading-7 text-[#5d7282]">
            {t.trackDescription}
          </p>

          <a
            href={`mailto:${SALES_EMAIL}?subject=${encodeURIComponent(
              "CYCLORIVA - Order tracking request",
            )}`}
            className={`mt-3 ${GREEN_BUTTON}`}
          >
            <Mail size={18} />
            {t.contactOrderButton}
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="rounded-xl border border-[#dbe9dd] bg-[#f3faf2] p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <FileText
              size={25}
              className="mt-0.5 shrink-0 text-[#109b24]"
              aria-hidden="true"
            />

            <div>
              <h3 className="text-[16px] font-extrabold text-[#102b39]">
                {t.trackNoticeTitle}
              </h3>

              <p className="mt-3 text-[13px] leading-7 text-[#426354]">
                {t.trackNotice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 9. ÉTAPES EXPLICATIVES
// ============================================================

function TrackingStatuses({ t }: { t: PageTexts }) {
  const icons = [
    ClipboardList,
    Package,
    PackageCheck,
    Truck,
    BadgeCheck,
  ] as const;

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2">
        <h2 className={SECTION_TITLE}>{t.statusTitle}</h2>

        <p className="mt-2 max-w-200 text-[13px] leading-6 text-[#617586]">
          {t.statusDescription}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {t.statuses.map((item, index) => {
          const Icon = icons[index];

          return (
            <article key={index} className={`${CARD} relative p-3`}>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                  <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                </div>

                <span className="text-[28px] font-black text-[#e0ede4]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-2 text-[15px] font-extrabold leading-6 text-[#102b39]">
                {item.title}
              </h3>

              <p className="mt-3 text-[12px] leading-6 text-[#607383]">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>

      <p className="mt-2 flex items-start gap-2 rounded-xl border border-[#dce6ed] bg-[#f8fafc] p-3 text-[12px] leading-6 text-[#526879]">
        <CircleHelp
          size={19}
          className="mt-0.5 shrink-0 text-[#109b24]"
          aria-hidden="true"
        />

        {t.statusNotice}
      </p>
    </section>
  );
}

// ============================================================
// 10. COMMENT DEMANDER LE SUIVI
// ============================================================

function TrackingSteps({ t }: { t: PageTexts }) {
  const icons = [ReceiptIcon, FileText, Mail] as const;

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2 text-center">
        <h2 className={SECTION_TITLE}>{t.requestTitle}</h2>

        <p className="mx-auto mt-2 max-w-175 text-[13px] leading-6 text-[#617586]">
          {t.requestDescription}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {t.requestSteps.map((item, index) => {
          const Icon = icons[index];

          return (
            <article key={index} className={`${CARD} p-3 sm:p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                  <Icon size={26} aria-hidden="true" />
                </div>

                <span className="text-[30px] font-black text-[#e1eee5]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-2 text-[16px] font-extrabold text-[#102b39]">
                {item.title}
              </h3>

              <p className="mt-3 text-[13px] leading-6 text-[#607383]">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// Icône interne réutilisant un élément Lucide existant.
const ReceiptIcon = ClipboardList;

// ============================================================
// 11. INFORMATIONS À PRÉPARER
// ============================================================

function TrackingPrepare({ t }: { t: PageTexts }) {
  return (
    <section className="py-1 lg:py-1">
      <div
        className={`${CARD} grid items-start gap-3 p-3 sm:p-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:p-3`}
      >
        <div>
          <ClipboardList
            size={35}
            className="mb-2 text-[#109b24]"
            aria-hidden="true"
          />

          <h2 className={SECTION_TITLE}>{t.prepareTitle}</h2>

          <p className="mt-3 text-[13px] leading-6 text-[#617586]">
            {t.prepareDescription}
          </p>
        </div>

        <div className="space-y-3">
          {t.prepareItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-[#e0e9ed] bg-[#f9fcf9] p-3"
            >
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-[#109b24]"
                aria-hidden="true"
              />

              <p className="text-[12px] leading-6 text-[#324c5d] sm:text-[13px]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 12. INFORMATIONS SUR LA LIVRAISON
// ============================================================

function TrackingInformation({ t }: { t: PageTexts }) {
  const items = [
    {
      icon: Clock3,
      content: t.delivery,
    },
    {
      icon: Truck,
      content: t.trackingNumber,
    },
    {
      icon: MapPin,
      content: t.address,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2">
        <h2 className={SECTION_TITLE}>{t.informationTitle}</h2>

        <p className="mt-2 text-[13px] leading-6 text-[#617586]">
          {t.informationDescription}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {items.map(({ icon: Icon, content }) => (
          <article key={content.title} className={`${CARD} p-3 sm:p-4`}>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
              <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <h3 className="text-[16px] font-extrabold text-[#102b39]">
              {content.title}
            </h3>

            <p className="mt-3 text-[13px] leading-6 text-[#607383]">
              {content.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 13. FAQ
// ============================================================

function TrackingFAQ({ t }: { t: PageTexts }) {
  return (
    <section id="faq-suivi" className="scroll-mt-24 py-1 lg:py-1">
      <div className="mb-2 flex items-start gap-3">
        <CircleHelp
          size={32}
          className="mt-0.5 shrink-0 text-[#109b24]"
          aria-hidden="true"
        />

        <div className="min-w-0">
          <h2 className={SECTION_TITLE}>{t.faqTitle}</h2>

          <p className="mt-2 text-[13px] leading-6 text-[#617586]">
            {t.faqDescription}
          </p>
        </div>
      </div>

      <div className={`${CARD} p-3 sm:p-3`}>
        <div className="space-y-2">
          {t.faq.map((item, index) => (
            <details
              key={index}
              className="group min-w-0 overflow-hidden rounded-xl border border-[#dce6ed] bg-white open:border-[#b9dfb9]"
            >
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-3 py-3.5 text-left text-[13px] leading-6 font-extrabold text-[#102b39] transition-colors hover:bg-[#f7fbf7] focus-visible:outline-2 focus-visible:outline-[#109b24] sm:px-5 sm:text-[14px] [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1">{item.question}</span>

                <ChevronDown
                  size={19}
                  className="shrink-0 text-[#102b39] transition-transform group-open:rotate-180 group-open:text-[#109b24]"
                  aria-hidden="true"
                />
              </summary>

              <div className="mx-3 mb-3 rounded-lg bg-[#ecf9e9] p-3 sm:mx-4 sm:mb-2 sm:p-3">
                <p className="text-[12px] leading-6 text-[#234334] sm:text-[13px]">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 14. COORDONNÉES OFFICIELLES
// ============================================================

function TrackingContacts({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <section className="py-1 lg:py-1">
      <div className={`${CARD} p-3 sm:p-3 lg:p-3`}>
        <div className="flex items-start gap-3">
          <Headphones
            size={31}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          <div className="min-w-0">
            <h2 className={SECTION_TITLE}>{t.contactTitle}</h2>

            <p className="mt-2 max-w-195 text-[13px] leading-6 text-[#617586]">
              {t.contactDescription}
            </p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <a
            href={`mailto:${SALES_EMAIL}`}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e0e9ed] bg-[#fbfcfd] p-3 transition-colors hover:border-[#109b24]"
          >
            <Mail
              size={24}
              className="shrink-0 text-[#109b24]"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-[12px] font-bold text-[#102b39]">
                {t.salesEmail}
              </p>

              <p className="mt-1 break-all text-[13px] text-[#52697b]">
                {SALES_EMAIL}
              </p>
            </div>
          </a>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e0e9ed] bg-[#fbfcfd] p-3 transition-colors hover:border-[#109b24]"
          >
            <Mail
              size={24}
              className="shrink-0 text-[#109b24]"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-[12px] font-bold text-[#102b39]">
                {t.generalEmail}
              </p>

              <p className="mt-1 break-all text-[13px] text-[#52697b]">
                {CONTACT_EMAIL}
              </p>
            </div>
          </a>
        </div>

        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <a
            href={WHATSAPP_DE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#dce8df] bg-[#f6fcf6] px-4 py-3 transition-colors hover:border-[#109b24]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <MessageCircle
                size={23}
                className="shrink-0 text-[#109b24]"
                aria-hidden="true"
              />

              <div>
                <p className="text-[12px] font-bold text-[#102b39]">
                  🇩🇪 {t.whatsappGermany}
                </p>

                <p className="mt-1 text-[13px] font-extrabold text-[#078d21]">
                  {PHONE_DE}
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-[#109b24]"
              aria-hidden="true"
            />
          </a>

          <a
            href={WHATSAPP_FR}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#dce8df] bg-[#f6fcf6] px-4 py-3 transition-colors hover:border-[#109b24]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <MessageCircle
                size={23}
                className="shrink-0 text-[#109b24]"
                aria-hidden="true"
              />

              <div>
                <p className="text-[12px] font-bold text-[#102b39]">
                  🇫🇷 {t.whatsappFrance}
                </p>

                <p className="mt-1 text-[13px] font-extrabold text-[#078d21]">
                  {PHONE_FR}
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-[#109b24]"
              aria-hidden="true"
            />
          </a>
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link href={`/${locale}/contact`} className={GREEN_BUTTON}>
            <Mail size={18} />
            {t.contactPage}
            <ArrowRight size={17} />
          </Link>

          <Link href={`/${locale}/livraison`} className={OUTLINE_BUTTON}>
            <Truck size={18} />
            {t.deliveryPage}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 15. SECTION FINALE
// ============================================================

function TrackingClosing({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <section className="py-1 lg:py-1">
      <div className="relative overflow-hidden rounded-2xl bg-[#082b3e] px-5 py-1 text-center sm:px-8 lg:py-2">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full border-45 border-[#109b24]/20"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full border-45 border-[#109b24]/20"
        />

        <div className="relative z-10">
          <PackageCheck
            size={38}
            className="mx-auto mb-2 text-[#8be975]"
            aria-hidden="true"
          />

          <h2 className="mx-auto max-w-190 text-[24px] font-black tracking-tight text-white sm:text-[31px]">
            {t.closingTitle}
          </h2>

          <p className="mx-auto mt-2 max-w-175 text-[13px] leading-6 text-[#d5e5eb] sm:text-[14px]">
            {t.closingDescription}
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#109b24] px-6 py-3 text-[13px] font-extrabold text-white transition-colors hover:bg-[#07861b] sm:text-sm"
          >
            <Mail size={18} />
            {t.closingButton}
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 16. PAGE PRINCIPALE
// ============================================================

async function OrderTrackingPageContent({ params }: PageProps) {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return (
    <main
      data-page="order-tracking"
      className="info-page w-full min-w-0 bg-white pb-2 text-[#102b39] lg:pb-2"
    >
      {/* Header et navigation :
          déjà gérés dans le layout global */}

      <TrackingBanner t={t} />

      <div className={CONTAINER}>
        <TrackingBreadcrumb locale={locale} t={t} />

        <TrackingHero locale={locale} t={t} />

        <TrackingRequest t={t} />

        <TrackingStatuses t={t} />

        <TrackingSteps t={t} />

        <TrackingPrepare t={t} />

        <TrackingInformation t={t} />

        <TrackingFAQ t={t} />

        <TrackingContacts locale={locale} t={t} />

        <TrackingClosing locale={locale} t={t} />

        <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#6a7c88]">
          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          {t.footerNotice}
        </p>
      </div>

      {/* Footer : déjà géré dans le layout global */}
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA SUIVI DE COMMANDE
// ============================================================

export default function OrderTrackingPage(
  props: Parameters<typeof OrderTrackingPageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <OrderTrackingPageContent {...props} />
    </Suspense>
  );
}
