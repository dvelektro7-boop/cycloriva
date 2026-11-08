import { accessibilityLabel } from "@/lib/accessibility-i18n";
import "@/components/site/InformationPages.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  FileQuestion,
  Headphones,
  House,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

/**
 * ============================================================
 * CYCLORIVA — SERVICE CLIENT
 * ============================================================
 *
 * Fichier :
 * app/[locale]/service-client/page.tsx
 *
 * Next.js 16 — App Router
 * React — TypeScript — Tailwind CSS 4
 *
 * ARCHITECTURE :
 * - Un seul fichier
 * - Responsive PC, tablette et mobile
 * - 5 langues : FR / EN / DE / IT / ES
 * - FAQ interactive native
 * - Coordonnées officielles
 * - Liens WhatsApp et téléphone
 * - Aucune dépendance supplémentaire
 *
 * COULEURS CYCLORIVA :
 * Bleu marine : #102b39
 * Vert : #109b24
 * Blanc : #ffffff
 *
 * IMPORTANT :
 * - Aucune commande fictive
 * - Aucun suivi de commande simulé
 * - Aucun horaire inventé
 * - Aucune politique commerciale inventée
 * - Aucun paiement simulé
 * - Aucun nouveau header ou footer
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

type ServiceId = "orders" | "delivery" | "returns" | "warranty";

type FAQItem = {
  question: string;
  answer: string;
};

type ServiceText = {
  title: string;
  description: string;
};

type PageTexts = {
  home: string;
  breadcrumb: string;
  eyebrow: string;
  pageTitle: string;
  pageDescription: string;

  heroLabel: string;
  heroTitle: string;
  heroDescription: string;
  contactButton: string;
  faqButton: string;

  servicesTitle: string;
  servicesDescription: string;
  services: Record<ServiceId, ServiceText>;

  processTitle: string;
  processDescription: string;
  processSteps: Array<{
    title: string;
    description: string;
  }>;

  contactsTitle: string;
  contactsDescription: string;
  orderEmail: string;
  generalEmail: string;
  telephone: string;
  whatsapp: string;
  germany: string;
  france: string;
  call: string;
  writeEmail: string;

  faqTitle: string;
  faqDescription: string;
  faq: FAQItem[];

  helpTitle: string;
  helpDescription: string;
  helpButton: string;
  guidesButton: string;

  notice: string;
};

// ============================================================
// 2. LANGUES
// ============================================================

const LOCALES: Locale[] = ["fr", "en", "de", "it", "es"];

function resolveLocale(value: string): Locale {
  if (!LOCALES.includes(value as Locale)) {
    notFound();
  }

  return value as Locale;
}

// ============================================================
// 3. COORDONNÉES OFFICIELLES
// ============================================================

const SALES_EMAIL = "sell@cycloriva.com";
const CONTACT_EMAIL = "contact@cycloriva.com";

const PHONE_DE = "+49 1573 0394552";
const PHONE_FR = "+33 6 58 69 41 78";

const WHATSAPP_DE = "https://wa.me/4915730394552";

const WHATSAPP_FR = "https://wa.me/33658694178";

const TEL_DE = "tel:+4915730394552";
const TEL_FR = "tel:+33658694178";

// ============================================================
// 4. TRADUCTIONS COMPLÈTES
// ============================================================

const TEXTS: Record<Locale, PageTexts> = {
  // ----------------------------------------------------------
  // FRANÇAIS
  // ----------------------------------------------------------

  fr: {
    home: "Accueil",
    breadcrumb: "Service client",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    pageTitle: "Service client",
    pageDescription:
      "Retrouvez l'assistance CYCLORIVA pour vos commandes, les livraisons, les produits et vos questions.",

    heroLabel: "ASSISTANCE CYCLORIVA",
    heroTitle: "Nous sommes là pour vous accompagner.",
    heroDescription:
      "Une question sur un vélo, une commande ou une livraison ? Retrouvez les informations essentielles et les moyens de contacter notre équipe.",
    contactButton: "Contacter notre équipe",
    faqButton: "Consulter la FAQ",

    servicesTitle: "Comment pouvons-nous vous aider ?",
    servicesDescription: "Choisissez le sujet qui correspond à votre demande.",

    services: {
      orders: {
        title: "Commandes",
        description:
          "Une question sur une commande enregistrée, son contenu ou ses informations ? Contactez notre équipe en indiquant votre numéro de commande.",
      },
      delivery: {
        title: "Livraison",
        description:
          "Obtenez des renseignements sur votre destination, les conditions de livraison et les informations disponibles concernant votre envoi.",
      },
      returns: {
        title: "Retours et remboursements",
        description:
          "Besoin d'informations sur un retour ? Contactez-nous pour connaître les démarches adaptées aux conditions applicables et à vos droits légaux.",
      },
      warranty: {
        title: "Garanties et assistance",
        description:
          "Pour une question technique ou une garantie, précisez le modèle du vélo et décrivez votre demande.",
      },
    },

    processTitle: "Comment obtenir de l'aide ?",
    processDescription:
      "Trois étapes simples pour nous transmettre votre demande.",

    processSteps: [
      {
        title: "Choisissez votre sujet",
        description:
          "Commande, livraison, produit, retour ou question générale.",
      },
      {
        title: "Préparez les informations utiles",
        description:
          "Indiquez votre numéro de commande si vous en possédez un, ainsi que les détails nécessaires.",
      },
      {
        title: "Contactez CYCLORIVA",
        description:
          "Écrivez-nous par e-mail, utilisez WhatsApp ou passez par notre formulaire de contact.",
      },
    ],

    contactsTitle: "Nos coordonnées",
    contactsDescription:
      "Deux adresses e-mail et deux numéros pour joindre notre équipe.",

    orderEmail: "Questions concernant les commandes",
    generalEmail: "Questions générales",
    telephone: "Téléphone",
    whatsapp: "WhatsApp",
    germany: "Allemagne",
    france: "France",
    call: "Appeler",
    writeEmail: "Écrire un e-mail",

    faqTitle: "Questions fréquentes",
    faqDescription: "Cliquez sur une question pour afficher sa réponse.",

    faq: [
      {
        question: "Comment obtenir des informations sur ma commande ?",
        answer:
          "Écrivez à sell@cycloriva.com en indiquant votre numéro de commande et l'objet de votre demande. Notre équipe pourra rechercher les informations disponibles.",
      },
      {
        question: "Quels sont les pays disponibles pour la livraison ?",
        answer:
          "Les destinations proposées sont l'Allemagne, la France, l'Espagne, l'Italie, la Suisse, l'Autriche, les Pays-Bas et la Belgique. La disponibilité et les conditions de livraison doivent être vérifiées lors de la commande.",
      },
      {
        question: "Quels sont les délais de livraison ?",
        answer:
          "Ils dépendent notamment du produit, de sa disponibilité et du pays de destination. Pour obtenir des informations propres à une commande, contactez sell@cycloriva.com.",
      },
      {
        question: "Puis-je modifier ma commande ?",
        answer:
          "Contactez-nous dès que possible à sell@cycloriva.com avec votre numéro de commande et la modification souhaitée. La possibilité d'effectuer un changement dépend de l'état de traitement de la commande.",
      },
      {
        question: "Comment demander un retour ou un remboursement ?",
        answer:
          "Contactez contact@cycloriva.com en indiquant la référence de votre commande, le produit concerné et le motif de votre demande. Les modalités applicables dépendent des conditions de vente et de vos droits légaux.",
      },
      {
        question: "Comment fonctionne la garantie d'un vélo ?",
        answer:
          "Les droits et garanties applicables dépendent du produit, du fabricant et de la réglementation. Précisez le modèle concerné afin que notre équipe puisse vous renseigner.",
      },
      {
        question: "Puis-je vous contacter sur WhatsApp ?",
        answer:
          "Oui. Vous pouvez nous écrire au +49 1573 0394552 pour l'Allemagne ou au +33 6 58 69 41 78 pour la France.",
      },
      {
        question: "Où trouver des conseils d'utilisation et d'entretien ?",
        answer:
          "Consultez la page Conseils & Guides de CYCLORIVA pour des informations générales sur le choix, l'utilisation, la sécurité et l'entretien des vélos.",
      },
    ],

    helpTitle: "Vous n'avez pas trouvé votre réponse ?",
    helpDescription:
      "Notre page Contact vous permet de nous transmettre directement votre question ou votre demande d'assistance.",
    helpButton: "Nous envoyer un message",
    guidesButton: "Conseils & Guides",

    notice:
      "Les informations de cette page sont générales. Les conditions de vente, les instructions des fabricants et les dispositions légales applicables prévalent.",
  },

  // ----------------------------------------------------------
  // ENGLISH
  // ----------------------------------------------------------

  en: {
    home: "Home",
    breadcrumb: "Customer service",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    pageTitle: "Customer service",
    pageDescription:
      "CYCLORIVA support for orders, deliveries, products and customer enquiries.",

    heroLabel: "CYCLORIVA SUPPORT",
    heroTitle: "We're here to help.",
    heroDescription:
      "Questions about a bicycle, an order or delivery? Find useful information and ways to contact our team.",
    contactButton: "Contact our team",
    faqButton: "View FAQ",

    servicesTitle: "How can we help?",
    servicesDescription: "Choose the topic that best matches your enquiry.",

    services: {
      orders: {
        title: "Orders",
        description:
          "Questions about a recorded order, its contents or details? Contact us with your order number.",
      },
      delivery: {
        title: "Delivery",
        description:
          "Ask about destinations, delivery conditions and available shipping information.",
      },
      returns: {
        title: "Returns and refunds",
        description:
          "Contact us about returning an item and the procedures applicable under the terms and your legal rights.",
      },
      warranty: {
        title: "Warranty and support",
        description:
          "For technical or warranty questions, specify your bicycle model and describe your enquiry.",
      },
    },

    processTitle: "How to get assistance",
    processDescription: "Three simple steps to send your enquiry.",

    processSteps: [
      {
        title: "Select your topic",
        description:
          "Orders, delivery, products, returns or general questions.",
      },
      {
        title: "Prepare the details",
        description:
          "Include your order number if available and any relevant information.",
      },
      {
        title: "Contact CYCLORIVA",
        description:
          "Email us, use WhatsApp or send a message through our contact form.",
      },
    ],

    contactsTitle: "Contact details",
    contactsDescription: "Two email addresses and two phone numbers.",

    orderEmail: "Order enquiries",
    generalEmail: "General enquiries",
    telephone: "Phone",
    whatsapp: "WhatsApp",
    germany: "Germany",
    france: "France",
    call: "Call",
    writeEmail: "Send email",

    faqTitle: "Frequently asked questions",
    faqDescription: "Select a question to reveal its answer.",

    faq: [
      {
        question: "How do I get information about my order?",
        answer:
          "Email sell@cycloriva.com with your order number and enquiry. Our team can look up the available information.",
      },
      {
        question: "Which countries are available for delivery?",
        answer:
          "The proposed destinations are Germany, France, Spain, Italy, Switzerland, Austria, the Netherlands and Belgium. Availability and delivery conditions are checked during checkout.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Delivery times depend on the product, its availability and destination. Contact sell@cycloriva.com for information about a specific order.",
      },
      {
        question: "Can I change my order?",
        answer:
          "Contact sell@cycloriva.com as soon as possible with your order number and requested change. Changes depend on the order's processing status.",
      },
      {
        question: "How do I request a return or refund?",
        answer:
          "Email contact@cycloriva.com with your order reference, product and reason for contacting us. Applicable procedures depend on the terms of sale and your legal rights.",
      },
      {
        question: "What warranty applies to a bicycle?",
        answer:
          "Applicable warranties and legal rights depend on the product, manufacturer and relevant law. Tell us the model so we can provide available information.",
      },
      {
        question: "Can I contact you on WhatsApp?",
        answer:
          "Yes. Message +49 1573 0394552 (Germany) or +33 6 58 69 41 78 (France).",
      },
      {
        question: "Where can I find cycling advice?",
        answer:
          "Visit our Tips & Guides page for general advice on choosing, using, maintaining and riding bicycles safely.",
      },
    ],

    helpTitle: "Still need help?",
    helpDescription: "Use our Contact page to send your enquiry directly.",
    helpButton: "Send us a message",
    guidesButton: "Tips & Guides",

    notice:
      "Information on this page is general. Applicable terms of sale, manufacturer instructions and legal requirements take precedence.",
  },

  // ----------------------------------------------------------
  // DEUTSCH
  // ----------------------------------------------------------

  de: {
    home: "Startseite",
    breadcrumb: "Kundenservice",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    pageTitle: "Kundenservice",
    pageDescription:
      "CYCLORIVA Kundenservice für Bestellungen, Lieferungen, Produkte und Fragen.",

    heroLabel: "CYCLORIVA KUNDENSERVICE",
    heroTitle: "Wir helfen Ihnen gerne weiter.",
    heroDescription:
      "Fragen zu einem Fahrrad, einer Bestellung oder Lieferung? Hier finden Sie Informationen und unsere Kontaktmöglichkeiten.",
    contactButton: "Team kontaktieren",
    faqButton: "FAQ ansehen",

    servicesTitle: "Wie können wir helfen?",
    servicesDescription: "Wählen Sie das Thema Ihrer Anfrage.",

    services: {
      orders: {
        title: "Bestellungen",
        description:
          "Fragen zu einer Bestellung oder ihren Angaben? Kontaktieren Sie uns unter Angabe Ihrer Bestellnummer.",
      },
      delivery: {
        title: "Lieferung",
        description:
          "Informationen zu Lieferländern, Versandbedingungen und verfügbaren Angaben zur Zustellung.",
      },
      returns: {
        title: "Rückgabe und Erstattung",
        description:
          "Fragen zu einer Rückgabe? Wir informieren über die anwendbaren Bedingungen und gesetzlichen Rechte.",
      },
      warranty: {
        title: "Garantie und Unterstützung",
        description:
          "Nennen Sie bei technischen Fragen das Fahrradmodell und beschreiben Sie Ihr Anliegen.",
      },
    },

    processTitle: "So erhalten Sie Unterstützung",
    processDescription: "Drei einfache Schritte für Ihre Anfrage.",

    processSteps: [
      {
        title: "Thema auswählen",
        description:
          "Bestellung, Lieferung, Produkt, Rückgabe oder allgemeine Frage.",
      },
      {
        title: "Angaben vorbereiten",
        description:
          "Halten Sie gegebenenfalls Ihre Bestellnummer und wichtige Einzelheiten bereit.",
      },
      {
        title: "CYCLORIVA kontaktieren",
        description: "Per E-Mail, WhatsApp oder über unser Kontaktformular.",
      },
    ],

    contactsTitle: "Unsere Kontaktdaten",
    contactsDescription: "Zwei E-Mail-Adressen und zwei Telefonnummern.",

    orderEmail: "Fragen zu Bestellungen",
    generalEmail: "Allgemeine Fragen",
    telephone: "Telefon",
    whatsapp: "WhatsApp",
    germany: "Deutschland",
    france: "Frankreich",
    call: "Anrufen",
    writeEmail: "E-Mail schreiben",

    faqTitle: "Häufig gestellte Fragen",
    faqDescription: "Klicken Sie auf eine Frage, um die Antwort zu sehen.",

    faq: [
      {
        question: "Wie erhalte ich Informationen zu meiner Bestellung?",
        answer:
          "Schreiben Sie mit Ihrer Bestellnummer und Ihrer Anfrage an sell@cycloriva.com. Unser Team kann die verfügbaren Informationen prüfen.",
      },
      {
        question: "In welche Länder wird geliefert?",
        answer:
          "Vorgesehene Lieferländer sind Deutschland, Frankreich, Spanien, Italien, die Schweiz, Österreich, die Niederlande und Belgien. Verfügbarkeit und Lieferbedingungen werden während der Bestellung geprüft.",
      },
      {
        question: "Wie lange dauert die Lieferung?",
        answer:
          "Die Lieferzeit hängt vom Produkt, seiner Verfügbarkeit und dem Lieferziel ab. Für Informationen zur konkreten Bestellung kontaktieren Sie sell@cycloriva.com.",
      },
      {
        question: "Kann ich meine Bestellung ändern?",
        answer:
          "Kontaktieren Sie sell@cycloriva.com möglichst früh mit Bestellnummer und Änderungswunsch. Änderungen hängen vom Bearbeitungsstatus ab.",
      },
      {
        question: "Wie beantrage ich eine Rückgabe oder Erstattung?",
        answer:
          "Schreiben Sie an contact@cycloriva.com und nennen Sie Bestellnummer, Produkt und Anliegen. Maßgeblich sind die anwendbaren Verkaufsbedingungen und gesetzlichen Rechte.",
      },
      {
        question: "Welche Garantie gilt für Fahrräder?",
        answer:
          "Garantien und gesetzliche Rechte hängen vom Produkt, Hersteller und geltendem Recht ab. Nennen Sie uns das betroffene Modell.",
      },
      {
        question: "Kann ich Sie über WhatsApp erreichen?",
        answer:
          "Ja, unter +49 1573 0394552 (Deutschland) oder +33 6 58 69 41 78 (Frankreich).",
      },
      {
        question: "Wo finde ich Tipps zum Fahrrad?",
        answer:
          "Auf unserer Seite Tipps & Ratgeber finden Sie allgemeine Hinweise zu Auswahl, Nutzung, Pflege und Sicherheit.",
      },
    ],

    helpTitle: "Weitere Fragen?",
    helpDescription: "Senden Sie uns Ihre Anfrage über unsere Kontaktseite.",
    helpButton: "Nachricht senden",
    guidesButton: "Tipps & Ratgeber",

    notice:
      "Diese Informationen sind allgemein. Die geltenden Verkaufsbedingungen, Herstelleranweisungen und gesetzlichen Vorschriften sind maßgeblich.",
  },

  // ----------------------------------------------------------
  // ITALIANO
  // ----------------------------------------------------------

  it: {
    home: "Home",
    breadcrumb: "Servizio clienti",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    pageTitle: "Servizio clienti",
    pageDescription:
      "Assistenza CYCLORIVA per ordini, consegne, prodotti e informazioni.",

    heroLabel: "ASSISTENZA CYCLORIVA",
    heroTitle: "Siamo qui per aiutarti.",
    heroDescription:
      "Hai domande su una bicicletta, un ordine o una consegna? Trova informazioni utili e contatta il nostro team.",
    contactButton: "Contatta il team",
    faqButton: "Consulta le FAQ",

    servicesTitle: "Come possiamo aiutarti?",
    servicesDescription: "Seleziona l'argomento della tua richiesta.",

    services: {
      orders: {
        title: "Ordini",
        description:
          "Domande su un ordine o sui relativi dettagli? Contattaci indicando il numero dell'ordine.",
      },
      delivery: {
        title: "Consegna",
        description:
          "Informazioni sulle destinazioni, sulle condizioni di consegna e sulla spedizione.",
      },
      returns: {
        title: "Resi e rimborsi",
        description:
          "Contattaci per informazioni sulle procedure di reso applicabili e sui tuoi diritti di legge.",
      },
      warranty: {
        title: "Garanzia e assistenza",
        description:
          "Per domande tecniche o sulla garanzia, indica il modello della bicicletta.",
      },
    },

    processTitle: "Come ricevere assistenza",
    processDescription: "Tre semplici passaggi per inviare la richiesta.",

    processSteps: [
      {
        title: "Scegli l'argomento",
        description: "Ordine, consegna, prodotto, reso o domanda generale.",
      },
      {
        title: "Prepara i dettagli",
        description:
          "Indica il numero d'ordine, se disponibile, e le informazioni utili.",
      },
      {
        title: "Contatta CYCLORIVA",
        description: "Via e-mail, WhatsApp o tramite il modulo di contatto.",
      },
    ],

    contactsTitle: "I nostri contatti",
    contactsDescription: "Due indirizzi e-mail e due numeri di telefono.",

    orderEmail: "Informazioni sugli ordini",
    generalEmail: "Domande generali",
    telephone: "Telefono",
    whatsapp: "WhatsApp",
    germany: "Germania",
    france: "Francia",
    call: "Chiama",
    writeEmail: "Invia e-mail",

    faqTitle: "Domande frequenti",
    faqDescription: "Seleziona una domanda per leggere la risposta.",

    faq: [
      {
        question: "Come posso avere informazioni sul mio ordine?",
        answer:
          "Scrivi a sell@cycloriva.com indicando il numero d'ordine e la tua richiesta. Il nostro team potrà verificare le informazioni disponibili.",
      },
      {
        question: "In quali paesi è disponibile la consegna?",
        answer:
          "Le destinazioni previste sono Germania, Francia, Spagna, Italia, Svizzera, Austria, Paesi Bassi e Belgio. Disponibilità e condizioni si verificano durante l'ordine.",
      },
      {
        question: "Quali sono i tempi di consegna?",
        answer:
          "Dipendono dal prodotto, dalla disponibilità e dalla destinazione. Per informazioni su un ordine specifico, contatta sell@cycloriva.com.",
      },
      {
        question: "Posso modificare un ordine?",
        answer:
          "Contatta sell@cycloriva.com quanto prima indicando il numero d'ordine e la modifica richiesta. La possibilità dipende dallo stato di elaborazione.",
      },
      {
        question: "Come richiedo un reso o rimborso?",
        answer:
          "Scrivi a contact@cycloriva.com con il riferimento dell'ordine, il prodotto e il motivo della richiesta. Si applicano le condizioni di vendita e i diritti previsti dalla legge.",
      },
      {
        question: "Quali garanzie si applicano alle biciclette?",
        answer:
          "Dipendono dal prodotto, dal produttore e dalla normativa applicabile. Indica il modello per ricevere informazioni.",
      },
      {
        question: "Posso contattarvi su WhatsApp?",
        answer:
          "Sì, al +49 1573 0394552 (Germania) o al +33 6 58 69 41 78 (Francia).",
      },
      {
        question: "Dove trovo consigli sulle biciclette?",
        answer:
          "Consulta la pagina Consigli e guide per suggerimenti generali su scelta, uso, manutenzione e sicurezza.",
      },
    ],

    helpTitle: "Hai ancora domande?",
    helpDescription: "Invia la tua richiesta dalla pagina Contatti.",
    helpButton: "Invia un messaggio",
    guidesButton: "Consigli e guide",

    notice:
      "Le informazioni sono generali. Prevalgono le condizioni di vendita, le istruzioni del produttore e le norme applicabili.",
  },

  // ----------------------------------------------------------
  // ESPAÑOL
  // ----------------------------------------------------------

  es: {
    home: "Inicio",
    breadcrumb: "Atención al cliente",
    eyebrow: "BICICLETAS & MOVILIDAD ELÉCTRICA EN EUROPA",
    pageTitle: "Atención al cliente",
    pageDescription:
      "Asistencia CYCLORIVA para pedidos, entregas, productos y consultas.",

    heroLabel: "ASISTENCIA CYCLORIVA",
    heroTitle: "Estamos aquí para ayudarte.",
    heroDescription:
      "¿Tienes preguntas sobre una bicicleta, un pedido o una entrega? Encuentra información y las formas de contactar con nuestro equipo.",
    contactButton: "Contactar con el equipo",
    faqButton: "Ver preguntas frecuentes",

    servicesTitle: "¿Cómo podemos ayudarte?",
    servicesDescription: "Selecciona el tema de tu consulta.",

    services: {
      orders: {
        title: "Pedidos",
        description:
          "¿Tienes preguntas sobre un pedido registrado? Contacta con nosotros e indica el número de pedido.",
      },
      delivery: {
        title: "Entrega",
        description:
          "Consulta los destinos, las condiciones de entrega y la información de envío disponible.",
      },
      returns: {
        title: "Devoluciones y reembolsos",
        description:
          "Contacta con nosotros para conocer los procedimientos aplicables y tus derechos legales.",
      },
      warranty: {
        title: "Garantía y asistencia",
        description:
          "Para dudas técnicas o sobre garantías, indica el modelo de la bicicleta y describe tu consulta.",
      },
    },

    processTitle: "Cómo obtener ayuda",
    processDescription: "Tres pasos sencillos para enviarnos tu consulta.",

    processSteps: [
      {
        title: "Elige el tema",
        description:
          "Pedidos, entrega, producto, devolución o consulta general.",
      },
      {
        title: "Prepara los datos",
        description:
          "Indica el número de pedido, si lo tienes, y la información necesaria.",
      },
      {
        title: "Contacta con CYCLORIVA",
        description: "Por correo, WhatsApp o mediante nuestro formulario.",
      },
    ],

    contactsTitle: "Nuestros contactos",
    contactsDescription: "Dos direcciones de correo y dos teléfonos.",

    orderEmail: "Consultas sobre pedidos",
    generalEmail: "Consultas generales",
    telephone: "Teléfono",
    whatsapp: "WhatsApp",
    germany: "Alemania",
    france: "Francia",
    call: "Llamar",
    writeEmail: "Enviar correo",

    faqTitle: "Preguntas frecuentes",
    faqDescription: "Pulsa una pregunta para ver su respuesta.",

    faq: [
      {
        question: "¿Cómo puedo consultar el estado de mi pedido?",
        answer:
          "Escribe a sell@cycloriva.com con tu número de pedido y la consulta. Nuestro equipo podrá revisar la información disponible.",
      },
      {
        question: "¿A qué países se realizan entregas?",
        answer:
          "Los destinos previstos son Alemania, Francia, España, Italia, Suiza, Austria, Países Bajos y Bélgica. La disponibilidad y las condiciones se comprueban durante el pedido.",
      },
      {
        question: "¿Cuánto tarda una entrega?",
        answer:
          "Depende del producto, su disponibilidad y el país de destino. Contacta con sell@cycloriva.com para información sobre un pedido concreto.",
      },
      {
        question: "¿Puedo modificar un pedido?",
        answer:
          "Contacta cuanto antes con sell@cycloriva.com indicando el número y el cambio solicitado. La posibilidad de modificarlo depende de su estado de tramitación.",
      },
      {
        question: "¿Cómo solicito una devolución o reembolso?",
        answer:
          "Escribe a contact@cycloriva.com indicando el pedido, el producto y el motivo. Se aplicarán las condiciones de venta y tus derechos legales.",
      },
      {
        question: "¿Qué garantía tienen las bicicletas?",
        answer:
          "Los derechos y garantías dependen del producto, el fabricante y la legislación aplicable. Indica el modelo para recibir información.",
      },
      {
        question: "¿Puedo contactar por WhatsApp?",
        answer:
          "Sí, en el +49 1573 0394552 (Alemania) o en el +33 6 58 69 41 78 (Francia).",
      },
      {
        question: "¿Dónde puedo encontrar consejos?",
        answer:
          "Visita Consejos y guías para información general sobre elección, uso, mantenimiento y seguridad de bicicletas.",
      },
    ],

    helpTitle: "¿Necesitas más ayuda?",
    helpDescription: "Envíanos tu consulta desde nuestra página de contacto.",
    helpButton: "Enviar un mensaje",
    guidesButton: "Consejos y guías",

    notice:
      "Esta información es general. Prevalecen las condiciones de venta aplicables, las instrucciones del fabricante y los requisitos legales.",
  },
};

// ============================================================
// 5. STYLES COMMUNS
// ============================================================

const CONTAINER = "mx-auto w-full max-w-none " + "px-4 sm:px-6 lg:px-6 xl:px-8";

const CARD =
  "min-w-0 rounded-2xl border border-[#dce5ec] " +
  "bg-white shadow-[0_3px_15px_rgba(16,43,57,0.045)]";

const SECTION_TITLE =
  "text-[23px] font-black tracking-tight " +
  "text-[#102b39] sm:text-[29px] lg:text-[31px]";

const GREEN_BUTTON =
  "inline-flex min-h-12 items-center justify-center " +
  "gap-2 rounded-lg bg-[#078e1d] px-5 py-3 " +
  "text-center text-[13px] font-extrabold text-white " +
  "transition-colors hover:bg-[#067719] " +
  "focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 " +
  "focus-visible:outline-[#109b24] sm:text-sm";

// ============================================================
// 6. MÉTADONNÉES
// ============================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return {
    title: `${t.pageTitle} | CYCLORIVA`,

    description: t.pageDescription,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      languages: {
        fr: "/fr/service-client",
        en: "/en/service-client",
        de: "/de/service-client",
        it: "/it/service-client",
        es: "/es/service-client",
        "x-default": "/fr/service-client",
      },
    },

    openGraph: {
      images: [{ url: "/images/imager.png", width: 1536, height: 1024, alt: "CYCLORIVA" }],
      type: "website",
      title: `${t.pageTitle} | CYCLORIVA`,
      description: t.pageDescription,
    },
  };
}

// ============================================================
// 7. BANDEAU PC
// ============================================================

function ServiceBanner({ t }: { t: PageTexts }) {
  return (
    <section
      aria-label={t.pageTitle}
      className="relative hidden min-h-31.25 overflow-hidden bg-[#082a3f] lg:block"
    >
      {/* Image du projet */}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/couverture.png')",
        }}
      />

      {/* Dégradé pour la lisibilité */}

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
          {t.pageTitle}
        </h1>
      </div>
    </section>
  );
}

// ============================================================
// 8. FIL D'ARIANE
// ============================================================

function ServiceBreadcrumb({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <nav
      aria-label={accessibilityLabel(locale, "breadcrumb")}
      className="flex min-w-0 flex-wrap items-center gap-2 py-1 text-[12px] text-[#425969]"
    >
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 transition-colors hover:text-[#109b24]"
      >
        <House size={17} className="text-[#109b24]" aria-hidden="true" />

        {t.home}
      </Link>

      <ChevronRight size={15} className="text-[#109b24]" aria-hidden="true" />

      <span aria-current="page" className="font-semibold text-[#102b39]">
        {t.breadcrumb}
      </span>
    </nav>
  );
}

// ============================================================
// 9. INTRODUCTION
// ============================================================

function ServiceHero({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <section className="grid min-w-0 items-center gap-3 py-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-3 lg:py-1">
      {/* Texte */}

      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-2 text-[11px] font-extrabold text-[#078d21]">
          <Headphones size={17} />
          {t.heroLabel}
        </span>

        <h2 className="mt-2 max-w-180 text-[30px] leading-[1.13] font-black tracking-tight text-[#102b39] sm:text-[40px] lg:text-[46px]">
          {t.heroTitle}
        </h2>

        <p className="mt-2 max-w-155 text-[14px] leading-7 text-[#536c7b] sm:text-[15px]">
          {t.heroDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link href={`/${locale}/contact`} className={GREEN_BUTTON}>
            <Mail size={18} />
            {t.contactButton}
            <ArrowRight size={17} />
          </Link>

          <a
            href="#faq"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#b6c7d2] bg-white px-5 py-3 text-[13px] font-bold text-[#102b39] transition-colors hover:bg-[#f4f8fa] sm:text-sm"
          >
            <CircleHelp size={18} />
            {t.faqButton}
          </a>
        </div>
      </div>

      {/* Image */}

      <div className={`${CARD} overflow-hidden`}>
        <div
          className="relative min-h-44 bg-[#0b3044] bg-cover bg-center sm:min-h-73.75 lg:min-h-64"
          style={{
            backgroundImage: "url('/images/accueil.png')",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-[#092639]/85 via-transparent to-transparent"
          />

          <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-xl border border-white/20 bg-[#102b39]/85 p-3 backdrop-blur-sm">
            <Headphones size={29} className="shrink-0 text-[#8de87a]" />

            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#a9e99d]">
                CYCLORIVA
              </p>

              <p className="mt-1 text-[15px] font-extrabold text-white">
                {t.pageTitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 10. DOMAINES D'ASSISTANCE
// ============================================================

function ServiceTopics({ t }: { t: PageTexts }) {
  const topics = [
    {
      id: "orders" as const,
      icon: ShoppingBag,
    },
    {
      id: "delivery" as const,
      icon: Truck,
    },
    {
      id: "returns" as const,
      icon: RotateCcw,
    },
    {
      id: "warranty" as const,
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2">
        <h2 className={SECTION_TITLE}>{t.servicesTitle}</h2>

        <p className="mt-2 text-[13px] leading-6 text-[#637889]">
          {t.servicesDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {topics.map(({ id, icon: Icon }) => {
          const item = t.services[id];

          return (
            <article
              key={id}
              className={`${CARD} p-3 transition-shadow hover:shadow-md`}
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                <Icon size={27} strokeWidth={1.8} aria-hidden="true" />
              </div>

              <h3 className="text-[16px] font-extrabold text-[#102b39]">
                {item.title}
              </h3>

              <p className="mt-3 text-[12px] leading-6 text-[#5c7080]">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// 11. COMMENT OBTENIR DE L'AIDE
// ============================================================

function ServiceProcess({ t }: { t: PageTexts }) {
  const icons = [FileQuestion, ClipboardList, MessageCircle];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2 text-center">
        <h2 className={SECTION_TITLE}>{t.processTitle}</h2>

        <p className="mx-auto mt-2 max-w-162.5 text-[13px] leading-6 text-[#637889]">
          {t.processDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {t.processSteps.map((step, index) => {
          const Icon = icons[index];

          return (
            <article key={index} className={`${CARD} p-3 sm:p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                  <Icon size={25} aria-hidden="true" />
                </div>

                <span className="text-[32px] font-black text-[#e2eee5]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-2 text-[16px] font-extrabold text-[#102b39]">
                {step.title}
              </h3>

              <p className="mt-3 text-[13px] leading-6 text-[#607383]">
                {step.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// 12. ADRESSES E-MAIL
// ============================================================

function ServiceEmailCard({
  label,
  email,
  action,
}: {
  label: string;
  email: string;
  action: string;
}) {
  return (
    <a
      href={`mailto:${email}`}
      className="group flex min-w-0 items-center gap-3 rounded-xl border border-[#dfe8ed] bg-white p-3 transition-colors hover:border-[#109b24] hover:bg-[#fbfefb]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eaf8e9] text-[#109b24]">
        <Mail size={24} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[12px] font-extrabold text-[#102b39] sm:text-[13px]">
          {label}
        </h3>

        <p className="mt-1 break-all text-[12px] text-[#4b6576]">{email}</p>

        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#078d21]">
          {action}
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </a>
  );
}

// ============================================================
// 13. TÉLÉPHONE ET WHATSAPP
// ============================================================

function ServicePhoneCard({
  country,
  flag,
  phone,
  telHref,
  whatsappHref,
  t,
}: {
  country: string;
  flag: string;
  phone: string;
  telHref: string;
  whatsappHref: string;
  t: PageTexts;
}) {
  return (
    <article className="min-w-0 rounded-xl border border-[#dfe8ed] bg-white p-3">
      <div className="flex items-center gap-3">
        <span role="img" aria-label={country} className="text-[27px]">
          {flag}
        </span>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-[#708292]">{country}</p>

          <p className="text-[14px] font-extrabold text-[#102b39]">{phone}</p>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <a
          href={telHref}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#c6d4df] px-2 text-[12px] font-bold text-[#102b39] transition-colors hover:bg-[#f2f7f9]"
        >
          <Phone size={16} aria-hidden="true" />
          {t.call}
        </a>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#07951e] px-2 text-[12px] font-extrabold text-white transition-colors hover:bg-[#087d1b]"
        >
          <MessageCircle size={16} aria-hidden="true" />
          {t.whatsapp}
        </a>
      </div>
    </article>
  );
}

// ============================================================
// 14. SECTION CONTACTS
// ============================================================

function ServiceContacts({ t }: { t: PageTexts }) {
  return (
    <section id="contacts" className="scroll-mt-24 py-1 lg:py-1">
      <div className={`${CARD} p-3 sm:p-4 lg:p-3`}>
        <div className="mb-3 flex items-start gap-3">
          <Headphones size={30} className="mt-1 shrink-0 text-[#109b24]" />

          <div>
            <h2 className={SECTION_TITLE}>{t.contactsTitle}</h2>

            <p className="mt-2 text-[13px] leading-6 text-[#617586]">
              {t.contactsDescription}
            </p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {/* E-mails */}

          <div className="space-y-3">
            <ServiceEmailCard
              label={t.orderEmail}
              email={SALES_EMAIL}
              action={t.writeEmail}
            />

            <ServiceEmailCard
              label={t.generalEmail}
              email={CONTACT_EMAIL}
              action={t.writeEmail}
            />
          </div>

          {/* Téléphones */}

          <div className="grid gap-3 sm:grid-cols-2">
            <ServicePhoneCard
              country={t.germany}
              flag="🇩🇪"
              phone={PHONE_DE}
              telHref={TEL_DE}
              whatsappHref={WHATSAPP_DE}
              t={t}
            />

            <ServicePhoneCard
              country={t.france}
              flag="🇫🇷"
              phone={PHONE_FR}
              telHref={TEL_FR}
              whatsappHref={WHATSAPP_FR}
              t={t}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 15. FAQ INTERACTIVE
// ============================================================

function ServiceFAQ({ t }: { t: PageTexts }) {
  return (
    <section id="faq" className="scroll-mt-24 py-1 lg:py-1">
      <div className="mb-2 flex items-start gap-3">
        <CircleHelp size={32} className="mt-0.5 shrink-0 text-[#109b24]" />

        <div>
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
              <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between gap-3 px-3 py-3.5 text-left text-[13px] font-extrabold leading-5 text-[#102b39] transition-colors hover:bg-[#f7fbf7] focus-visible:outline-2 focus-visible:outline-[#109b24] sm:px-5 sm:text-[14px] [&::-webkit-details-marker]:hidden">
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
// 16. BESOIN D'AIDE
// ============================================================

function ServiceHelp({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <section className="py-1 lg:py-1">
      <div className="relative overflow-hidden rounded-2xl bg-[#082b3e] px-5 py-1 text-center sm:px-8 lg:py-2">
        {/* Décoration */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full border-45 border-[#109b24]/20"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full border-45 border-[#109b24]/20"
        />

        <div className="relative z-10">
          <Headphones size={38} className="mx-auto mb-2 text-[#8be975]" />

          <h2 className="mx-auto max-w-187.5 text-[24px] font-black tracking-tight text-white sm:text-[31px]">
            {t.helpTitle}
          </h2>

          <p className="mx-auto mt-2 max-w-170 text-[13px] leading-6 text-[#d5e5eb] sm:text-[14px]">
            {t.helpDescription}
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Link href={`/${locale}/contact`} className={GREEN_BUTTON}>
              <Mail size={18} />
              {t.helpButton}
              <ArrowRight size={17} />
            </Link>

            <Link
              href={`/${locale}/conseils-guides`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/35 bg-white/10 px-5 py-3 text-[13px] font-bold text-white transition-colors hover:bg-white/20 sm:text-sm"
            >
              <BookOpen size={18} />
              {t.guidesButton}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 17. PAGE PRINCIPALE
// ============================================================

async function ServiceClientPageContent({ params }: PageProps) {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return (
    <main
      data-page="customer-service"
      className="info-page w-full min-w-0 bg-white pb-2 text-[#102b39] lg:pb-2"
    >
      {/* Header du site déjà géré par SiteChrome */}

      <ServiceBanner t={t} />

      <div className={CONTAINER}>
        <ServiceBreadcrumb locale={locale} t={t} />

        <ServiceHero locale={locale} t={t} />

        <ServiceTopics t={t} />

        <ServiceProcess t={t} />

        <ServiceContacts t={t} />

        <ServiceFAQ t={t} />

        <ServiceHelp locale={locale} t={t} />

        <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#6a7c88]">
          <CheckCircle2
            size={15}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          {t.notice}
        </p>
      </div>

      {/* Footer du site déjà géré par SiteChrome */}
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA SERVICE CLIENT
// ============================================================

export default function ServiceClientPage(
  props: Parameters<typeof ServiceClientPageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <ServiceClientPageContent {...props} />
    </Suspense>
  );
}
