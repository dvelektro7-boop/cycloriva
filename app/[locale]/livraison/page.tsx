import "@/components/site/InformationPages.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRight,
  Bike,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Globe2,
  Headphones,
  House,
  Mail,
  MapPin,
  Package,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wallet,
} from "lucide-react";

/**
 * ============================================================
 * CYCLORIVA — PAGE LIVRAISON
 * ============================================================
 *
 * FICHIER :
 * app/[locale]/livraison/page.tsx
 *
 * TECHNOLOGIES :
 * - Next.js 16 / App Router
 * - React / TypeScript
 * - Tailwind CSS 4
 * - Lucide React
 *
 * STRUCTURE :
 * - Un seul fichier
 * - Version PC et mobile
 * - Cinq langues
 * - Bandeau CYCLORIVA
 * - Présentation des livraisons
 * - Huit pays disponibles
 * - Informations sur les frais
 * - Parcours de commande
 * - FAQ interactive
 * - Contacts et assistance
 *
 * INFORMATIONS COMMERCIALES :
 * Les frais et les délais dépendent
 * de la commande et des informations
 * réellement disponibles.
 *
 * Aucune gratuité ou durée de livraison
 * n'est inventée.
 *
 * Le header et le footer généraux
 * sont déjà gérés par SiteChrome.
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

type Locale = "fr" | "en" | "de" | "it" | "es";

type PageProps = {
  params: Promise<{ locale: string }>;
};

type Country = {
  code: string;
  flag: string;
  name: Record<Locale, string>;
};

type FAQItem = {
  question: string;
  answer: string;
};

type PageTexts = {
  pageTitle: string;
  description: string;
  eyebrow: string;
  home: string;

  heroLabel: string;
  heroTitle: string;
  heroDescription: string;
  viewCountries: string;
  contactUs: string;

  countriesTitle: string;
  countriesDescription: string;
  countriesNotice: string;

  informationTitle: string;
  informationDescription: string;
  shippingCostTitle: string;
  shippingCostDescription: string;
  shippingTimeTitle: string;
  shippingTimeDescription: string;
  destinationTitle: string;
  destinationDescription: string;
  orderStatusTitle: string;
  orderStatusDescription: string;

  processTitle: string;
  processDescription: string;
  stepOneTitle: string;
  stepOneDescription: string;
  stepTwoTitle: string;
  stepTwoDescription: string;
  stepThreeTitle: string;
  stepThreeDescription: string;
  stepFourTitle: string;
  stepFourDescription: string;

  adviceTitle: string;
  adviceDescription: string;
  adviceOne: string;
  adviceTwo: string;
  adviceThree: string;

  faqTitle: string;
  faqDescription: string;
  faq: FAQItem[];

  contactTitle: string;
  contactDescription: string;
  ordersEmailLabel: string;
  generalEmailLabel: string;
  contactButton: string;
  shopButton: string;
  footerNotice: string;
};

// ============================================================
// 2. LANGUES AUTORISÉES
// ============================================================

const LOCALES: Locale[] = ["fr", "en", "de", "it", "es"];

function resolveLocale(value: string): Locale {
  if (!LOCALES.includes(value as Locale)) {
    notFound();
  }

  return value as Locale;
}

// ============================================================
// 3. COORDONNÉES
// ============================================================

const SALES_EMAIL = "sell@cycloriva.com";
const CONTACT_EMAIL = "contact@cycloriva.com";

// ============================================================
// 4. PAYS DE LIVRAISON
// ============================================================

const COUNTRIES: Country[] = [
  {
    code: "DE",
    flag: "🇩🇪",
    name: {
      fr: "Allemagne",
      en: "Germany",
      de: "Deutschland",
      it: "Germania",
      es: "Alemania",
    },
  },
  {
    code: "FR",
    flag: "🇫🇷",
    name: {
      fr: "France",
      en: "France",
      de: "Frankreich",
      it: "Francia",
      es: "Francia",
    },
  },
  {
    code: "ES",
    flag: "🇪🇸",
    name: {
      fr: "Espagne",
      en: "Spain",
      de: "Spanien",
      it: "Spagna",
      es: "España",
    },
  },
  {
    code: "IT",
    flag: "🇮🇹",
    name: {
      fr: "Italie",
      en: "Italy",
      de: "Italien",
      it: "Italia",
      es: "Italia",
    },
  },
  {
    code: "CH",
    flag: "🇨🇭",
    name: {
      fr: "Suisse",
      en: "Switzerland",
      de: "Schweiz",
      it: "Svizzera",
      es: "Suiza",
    },
  },
  {
    code: "AT",
    flag: "🇦🇹",
    name: {
      fr: "Autriche",
      en: "Austria",
      de: "Österreich",
      it: "Austria",
      es: "Austria",
    },
  },
  {
    code: "NL",
    flag: "🇳🇱",
    name: {
      fr: "Pays-Bas",
      en: "Netherlands",
      de: "Niederlande",
      it: "Paesi Bassi",
      es: "Países Bajos",
    },
  },
  {
    code: "BE",
    flag: "🇧🇪",
    name: {
      fr: "Belgique",
      en: "Belgium",
      de: "Belgien",
      it: "Belgio",
      es: "Bélgica",
    },
  },
];

// ============================================================
// 5. TRADUCTIONS
// ============================================================

const TEXTS: Record<Locale, PageTexts> = {
  fr: {
    pageTitle: "Livraison",
    description:
      "Informations CYCLORIVA sur les pays de livraison, les frais de transport, les délais et le traitement des commandes.",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    home: "Accueil",

    heroLabel: "LIVRAISON CYCLORIVA",
    heroTitle: "Vos vélos et accessoires, jusqu'à votre destination.",
    heroDescription:
      "Découvrez les pays disponibles pour vos commandes, les informations de livraison et les étapes à connaître avant de valider votre achat.",
    viewCountries: "Voir les pays de livraison",
    contactUs: "Nous contacter",

    countriesTitle: "Nos pays de livraison",
    countriesDescription:
      "CYCLORIVA propose la prise de commande vers huit pays européens.",
    countriesNotice:
      "La possibilité de livrer un produit à une adresse précise dépend de sa disponibilité et des conditions applicables à la commande.",

    informationTitle: "Informations de livraison",
    informationDescription:
      "Les principaux éléments à connaître avant de confirmer votre commande.",
    shippingCostTitle: "Frais de livraison",
    shippingCostDescription:
      "Les frais sont déterminés selon les produits, les quantités et la destination. Le montant applicable doit être présenté au client avant la validation finale.",
    shippingTimeTitle: "Délais de livraison",
    shippingTimeDescription:
      "Les délais varient selon le produit, sa disponibilité, la préparation et le transport. Un délai précis doit être confirmé pour la commande concernée.",
    destinationTitle: "Adresse de livraison",
    destinationDescription:
      "Le client renseigne son pays, sa ville, son adresse et son code postal. Ces informations doivent être vérifiées avant la validation.",
    orderStatusTitle: "Informations sur l'expédition",
    orderStatusDescription:
      "Pour obtenir des informations sur le traitement ou l'expédition d'une commande, contactez sell@cycloriva.com avec votre référence.",

    processTitle: "Comment se déroule une commande ?",
    processDescription:
      "Un parcours simple, depuis le panier jusqu'à la livraison.",
    stepOneTitle: "Choisissez vos produits",
    stepOneDescription:
      "Parcourez notre catalogue et ajoutez les articles souhaités à votre panier.",
    stepTwoTitle: "Indiquez votre destination",
    stepTwoDescription:
      "Sélectionnez votre pays et renseignez les informations nécessaires à la livraison.",
    stepThreeTitle: "Vérifiez et validez",
    stepThreeDescription:
      "Contrôlez vos coordonnées, les articles et le montant total proposé avant de confirmer.",
    stepFourTitle: "Traitement de la commande",
    stepFourDescription:
      "Une fois la commande enregistrée, son traitement et les modalités de livraison sont suivis selon les informations disponibles.",

    adviceTitle: "Avant de valider votre commande",
    adviceDescription:
      "Quelques vérifications utiles pour éviter les erreurs d'adresse ou de contact.",
    adviceOne: "Vérifiez votre adresse complète et votre code postal.",
    adviceTwo:
      "Indiquez un numéro de téléphone et une adresse e-mail auxquels vous êtes joignable.",
    adviceThree:
      "Vérifiez le montant total et les informations de livraison présentées avant de confirmer.",

    faqTitle: "Questions fréquentes sur la livraison",
    faqDescription: "Cliquez sur une question pour consulter sa réponse.",
    faq: [
      {
        question: "Dans quels pays CYCLORIVA propose-t-il la livraison ?",
        answer:
          "Les huit pays proposés sont l'Allemagne, la France, l'Espagne, l'Italie, la Suisse, l'Autriche, les Pays-Bas et la Belgique. La disponibilité reste soumise aux conditions applicables à chaque produit et destination.",
      },
      {
        question: "La livraison est-elle gratuite ?",
        answer:
          "La livraison gratuite n'est pas systématiquement prévue. Les frais doivent être calculés pour votre commande et présentés avant la validation.",
      },
      {
        question: "Combien de temps prend la livraison ?",
        answer:
          "Le délai dépend de la disponibilité des articles, de leur préparation et du pays de destination. Contactez notre équipe pour les informations applicables à une commande précise.",
      },
      {
        question: "Comment connaître le montant de la livraison ?",
        answer:
          "Ajoutez les produits souhaités à votre panier, puis indiquez votre pays et votre adresse sur la page de commande. Les frais applicables doivent être calculés avant la validation finale.",
      },
      {
        question: "Puis-je modifier mon adresse après une commande ?",
        answer:
          "Contactez sell@cycloriva.com dès que possible avec votre référence et la nouvelle adresse. Les modifications dépendent de l'état de traitement et d'expédition de la commande.",
      },
      {
        question: "Comment suivre ma commande ?",
        answer:
          "Vous pouvez demander des informations sur votre commande à sell@cycloriva.com en précisant son numéro. Un numéro de suivi ne sera communiqué que s'il est réellement disponible.",
      },
      {
        question: "Puis-je commander depuis la Suisse ?",
        answer:
          "La Suisse fait partie des destinations proposées. Les éventuelles formalités douanières et les frais applicables doivent être clarifiés avant la confirmation de la commande.",
      },
      {
        question: "Que faire en cas de problème de livraison ?",
        answer:
          "Contactez sell@cycloriva.com avec votre numéro de commande et une description du problème. Vous pouvez également utiliser la page Contact de CYCLORIVA.",
      },
    ],

    contactTitle: "Une question sur votre livraison ?",
    contactDescription:
      "Notre équipe peut vous renseigner sur une commande, sa destination et les informations de transport disponibles.",
    ordersEmailLabel: "Informations sur les commandes",
    generalEmailLabel: "Questions générales",
    contactButton: "Contacter CYCLORIVA",
    shopButton: "Découvrir nos produits",
    footerNotice:
      "Les frais, disponibilités et délais affichés sur cette page sont des informations générales. Les conditions effectivement confirmées lors de la commande prévalent.",
  },

  en: {
    pageTitle: "Delivery",
    description:
      "CYCLORIVA delivery countries, shipping charges, lead times and order information.",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    home: "Home",

    heroLabel: "CYCLORIVA DELIVERY",
    heroTitle: "Bicycles and accessories, delivered to your destination.",
    heroDescription:
      "Explore supported countries, delivery information and what to check before submitting your order.",
    viewCountries: "View delivery countries",
    contactUs: "Contact us",

    countriesTitle: "Delivery countries",
    countriesDescription:
      "CYCLORIVA accepts orders for eight European destinations.",
    countriesNotice:
      "Delivery to a specific address depends on product availability and the conditions applicable to the order.",

    informationTitle: "Delivery information",
    informationDescription:
      "Essential details to review before confirming an order.",
    shippingCostTitle: "Shipping charges",
    shippingCostDescription:
      "Charges depend on products, quantities and destination. Applicable costs must be shown before final order confirmation.",
    shippingTimeTitle: "Delivery times",
    shippingTimeDescription:
      "Times vary according to availability, preparation and transport. Any specific delivery estimate must be confirmed for the order.",
    destinationTitle: "Delivery address",
    destinationDescription:
      "Customers enter their country, city, street address and postal code. These details should be checked before submission.",
    orderStatusTitle: "Shipment enquiries",
    orderStatusDescription:
      "For information on processing or dispatch, contact sell@cycloriva.com with your order reference.",

    processTitle: "How does ordering work?",
    processDescription: "A straightforward process from cart to delivery.",
    stepOneTitle: "Choose your products",
    stepOneDescription:
      "Browse the catalogue and add your preferred items to the cart.",
    stepTwoTitle: "Enter your destination",
    stepTwoDescription:
      "Select your country and provide the necessary delivery details.",
    stepThreeTitle: "Review and submit",
    stepThreeDescription:
      "Check contact details, products and the proposed total before confirming.",
    stepFourTitle: "Order processing",
    stepFourDescription:
      "Once recorded, order processing and shipping arrangements are handled according to available information.",

    adviceTitle: "Before submitting your order",
    adviceDescription: "A few useful checks to help avoid delivery issues.",
    adviceOne: "Check your complete address and postal code.",
    adviceTwo:
      "Provide a phone number and email address where you can be reached.",
    adviceThree:
      "Review the total amount and shipping information before confirmation.",

    faqTitle: "Delivery FAQ",
    faqDescription: "Select a question to view the answer.",
    faq: [
      {
        question: "Which countries does CYCLORIVA serve?",
        answer:
          "The eight proposed destinations are Germany, France, Spain, Italy, Switzerland, Austria, the Netherlands and Belgium. Delivery remains subject to product and destination conditions.",
      },
      {
        question: "Is shipping free?",
        answer:
          "Free shipping is not automatically offered. Applicable shipping charges must be calculated and shown before final confirmation.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Timing depends on availability, preparation and destination. Contact our team for information about a specific order.",
      },
      {
        question: "How do I find out the shipping cost?",
        answer:
          "Add items to your cart and enter your country and address at checkout. Applicable shipping charges must be calculated before final submission.",
      },
      {
        question: "Can I change my delivery address?",
        answer:
          "Contact sell@cycloriva.com as early as possible with your order reference and the corrected address. Changes depend on processing and dispatch status.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Request an update at sell@cycloriva.com with your order number. Tracking details will only be provided if available.",
      },
      {
        question: "Can I order from Switzerland?",
        answer:
          "Switzerland is a proposed destination. Any customs procedures and applicable fees must be clarified before order confirmation.",
      },
      {
        question: "What if I have a delivery problem?",
        answer:
          "Contact sell@cycloriva.com with your order number and a description of the issue, or use our Contact page.",
      },
    ],

    contactTitle: "Questions about delivery?",
    contactDescription:
      "Our team can assist with order destinations and available shipping information.",
    ordersEmailLabel: "Order enquiries",
    generalEmailLabel: "General enquiries",
    contactButton: "Contact CYCLORIVA",
    shopButton: "Explore our products",
    footerNotice:
      "Shipping charges, availability and delivery timing depend on the conditions confirmed for each order.",
  },

  de: {
    pageTitle: "Lieferung",
    description:
      "Informationen von CYCLORIVA zu Lieferländern, Versandkosten, Lieferzeiten und Bestellungen.",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    home: "Startseite",

    heroLabel: "CYCLORIVA LIEFERUNG",
    heroTitle: "Fahrräder und Zubehör für Ihre Lieferadresse.",
    heroDescription:
      "Entdecken Sie die vorgesehenen Lieferländer und wichtige Informationen zum Versand und zur Bestellung.",
    viewCountries: "Lieferländer ansehen",
    contactUs: "Kontakt",

    countriesTitle: "Unsere Lieferländer",
    countriesDescription:
      "CYCLORIVA nimmt Bestellungen für acht europäische Länder entgegen.",
    countriesNotice:
      "Eine Lieferung an eine bestimmte Adresse hängt von der Verfügbarkeit und den Bedingungen der Bestellung ab.",

    informationTitle: "Versandinformationen",
    informationDescription:
      "Wichtige Hinweise vor dem Abschluss Ihrer Bestellung.",
    shippingCostTitle: "Versandkosten",
    shippingCostDescription:
      "Die Kosten hängen von den Produkten, Mengen und dem Lieferziel ab. Die geltenden Kosten müssen vor der endgültigen Bestellung angezeigt werden.",
    shippingTimeTitle: "Lieferzeiten",
    shippingTimeDescription:
      "Die Lieferzeit hängt von Verfügbarkeit, Vorbereitung und Transport ab. Eine konkrete Angabe muss für die Bestellung bestätigt werden.",
    destinationTitle: "Lieferadresse",
    destinationDescription:
      "Geben Sie Land, Stadt, Straße und Postleitzahl an und prüfen Sie diese Angaben vor dem Absenden.",
    orderStatusTitle: "Versandstatus",
    orderStatusDescription:
      "Informationen zu Bearbeitung und Versand erhalten Sie unter sell@cycloriva.com mit Ihrer Bestellnummer.",

    processTitle: "So läuft eine Bestellung ab",
    processDescription: "Von der Produktauswahl bis zur Lieferung.",
    stepOneTitle: "Produkte auswählen",
    stepOneDescription:
      "Wählen Sie Artikel aus dem Sortiment und legen Sie sie in den Warenkorb.",
    stepTwoTitle: "Lieferziel angeben",
    stepTwoDescription:
      "Wählen Sie das Land und tragen Sie Ihre Lieferadresse ein.",
    stepThreeTitle: "Prüfen und bestellen",
    stepThreeDescription:
      "Kontrollieren Sie Ihre Daten, Artikel und den angezeigten Gesamtbetrag.",
    stepFourTitle: "Bestellbearbeitung",
    stepFourDescription:
      "Nach Erfassung der Bestellung erfolgen Bearbeitung und Versand nach den verfügbaren Angaben.",

    adviceTitle: "Vor der Bestellung",
    adviceDescription: "Drei einfache Kontrollen für korrekte Lieferdaten.",
    adviceOne: "Prüfen Sie Ihre vollständige Adresse und Postleitzahl.",
    adviceTwo:
      "Geben Sie eine erreichbare Telefonnummer und E-Mail-Adresse an.",
    adviceThree: "Kontrollieren Sie Gesamtbetrag und Versandinformationen.",

    faqTitle: "Häufige Fragen zur Lieferung",
    faqDescription: "Klicken Sie auf eine Frage, um die Antwort zu lesen.",
    faq: [
      {
        question: "In welche Länder liefert CYCLORIVA?",
        answer:
          "Vorgesehen sind Deutschland, Frankreich, Spanien, Italien, die Schweiz, Österreich, die Niederlande und Belgien. Die Lieferung hängt von den Bedingungen für Produkt und Lieferziel ab.",
      },
      {
        question: "Ist der Versand kostenlos?",
        answer:
          "Kostenloser Versand ist nicht grundsätzlich vorgesehen. Die anfallenden Kosten müssen vor der endgültigen Bestellung berechnet und angezeigt werden.",
      },
      {
        question: "Wie lange dauert die Lieferung?",
        answer:
          "Die Lieferzeit hängt von Verfügbarkeit, Vorbereitung und Lieferland ab. Fragen zu einer konkreten Bestellung beantwortet unser Team.",
      },
      {
        question: "Wie erfahre ich die Versandkosten?",
        answer:
          "Legen Sie Produkte in den Warenkorb und geben Sie beim Bestellabschluss Ihr Lieferland und Ihre Adresse ein. Die Kosten müssen vor dem Absenden berechnet werden.",
      },
      {
        question: "Kann ich meine Lieferadresse ändern?",
        answer:
          "Schreiben Sie so früh wie möglich an sell@cycloriva.com mit Ihrer Bestellnummer und der neuen Adresse. Änderungen hängen vom Bearbeitungsstand ab.",
      },
      {
        question: "Wie kann ich meine Bestellung verfolgen?",
        answer:
          "Fragen Sie unter sell@cycloriva.com mit Ihrer Bestellnummer nach. Sendungsverfolgungsdaten werden nur mitgeteilt, wenn sie vorhanden sind.",
      },
      {
        question: "Kann ich aus der Schweiz bestellen?",
        answer:
          "Die Schweiz gehört zu den vorgesehenen Lieferländern. Zollformalitäten und gegebenenfalls zusätzliche Gebühren müssen vor der Bestellung geklärt werden.",
      },
      {
        question: "Was tun bei einem Lieferproblem?",
        answer:
          "Kontaktieren Sie sell@cycloriva.com mit Bestellnummer und Problembeschreibung oder nutzen Sie die Kontaktseite.",
      },
    ],

    contactTitle: "Fragen zur Lieferung?",
    contactDescription:
      "Unser Team informiert Sie über Bestellungen, Lieferländer und verfügbare Versandangaben.",
    ordersEmailLabel: "Fragen zu Bestellungen",
    generalEmailLabel: "Allgemeine Fragen",
    contactButton: "CYCLORIVA kontaktieren",
    shopButton: "Produkte entdecken",
    footerNotice:
      "Versandkosten, Verfügbarkeit und Lieferzeiten richten sich nach den für die jeweilige Bestellung bestätigten Bedingungen.",
  },

  it: {
    pageTitle: "Consegna",
    description:
      "Informazioni CYCLORIVA su paesi di consegna, spese di spedizione, tempi e ordini.",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    home: "Home",

    heroLabel: "CONSEGNE CYCLORIVA",
    heroTitle: "Biciclette e accessori fino alla tua destinazione.",
    heroDescription:
      "Scopri i paesi previsti per gli ordini e tutte le informazioni utili prima di confermare l'acquisto.",
    viewCountries: "Vedi i paesi disponibili",
    contactUs: "Contattaci",

    countriesTitle: "Paesi di consegna",
    countriesDescription:
      "CYCLORIVA accetta ordini per otto destinazioni europee.",
    countriesNotice:
      "La consegna a un indirizzo specifico dipende dalla disponibilità del prodotto e dalle condizioni dell'ordine.",

    informationTitle: "Informazioni sulla consegna",
    informationDescription:
      "I dettagli essenziali prima di confermare l'ordine.",
    shippingCostTitle: "Costi di spedizione",
    shippingCostDescription:
      "Le spese dipendono da prodotti, quantità e destinazione. Il costo applicabile deve essere mostrato prima della conferma definitiva.",
    shippingTimeTitle: "Tempi di consegna",
    shippingTimeDescription:
      "I tempi variano secondo disponibilità, preparazione e trasporto. Una stima precisa deve essere confermata per ogni ordine.",
    destinationTitle: "Indirizzo di consegna",
    destinationDescription:
      "Inserisci paese, città, indirizzo e codice postale e controlla attentamente i dati.",
    orderStatusTitle: "Informazioni sulla spedizione",
    orderStatusDescription:
      "Per informazioni sulla preparazione o sulla spedizione scrivi a sell@cycloriva.com indicando il numero d'ordine.",

    processTitle: "Come funziona un ordine?",
    processDescription: "Un processo semplice dal carrello alla consegna.",
    stepOneTitle: "Scegli i prodotti",
    stepOneDescription:
      "Esplora il catalogo e aggiungi gli articoli al carrello.",
    stepTwoTitle: "Indica la destinazione",
    stepTwoDescription:
      "Seleziona il paese e inserisci i dati necessari alla consegna.",
    stepThreeTitle: "Verifica e conferma",
    stepThreeDescription:
      "Controlla contatti, prodotti e importo totale prima della conferma.",
    stepFourTitle: "Elaborazione dell'ordine",
    stepFourDescription:
      "Dopo la registrazione, l'ordine e la spedizione vengono gestiti secondo le informazioni disponibili.",

    adviceTitle: "Prima di confermare",
    adviceDescription: "Tre controlli utili per evitare errori di consegna.",
    adviceOne: "Verifica indirizzo completo e codice postale.",
    adviceTwo: "Indica un telefono e un indirizzo e-mail validi.",
    adviceThree: "Controlla il totale e le informazioni di spedizione.",

    faqTitle: "Domande frequenti sulla consegna",
    faqDescription: "Seleziona una domanda per leggere la risposta.",
    faq: [
      {
        question: "In quali paesi consegna CYCLORIVA?",
        answer:
          "Le destinazioni previste sono Germania, Francia, Spagna, Italia, Svizzera, Austria, Paesi Bassi e Belgio, secondo le condizioni applicabili a ciascun prodotto.",
      },
      {
        question: "La spedizione è gratuita?",
        answer:
          "La spedizione gratuita non è prevista automaticamente. Le spese applicabili devono essere calcolate e presentate prima della conferma.",
      },
      {
        question: "Quanto tempo richiede la consegna?",
        answer:
          "Dipende dalla disponibilità, dalla preparazione e dalla destinazione. Contatta il nostro team per informazioni su un ordine specifico.",
      },
      {
        question: "Come posso conoscere il costo di spedizione?",
        answer:
          "Aggiungi gli articoli al carrello e inserisci il paese e l'indirizzo durante l'ordine. Le spese devono essere calcolate prima della conferma.",
      },
      {
        question: "Posso modificare l'indirizzo?",
        answer:
          "Scrivi quanto prima a sell@cycloriva.com con il numero d'ordine e il nuovo indirizzo. Le modifiche dipendono dallo stato di elaborazione.",
      },
      {
        question: "Come seguo il mio ordine?",
        answer:
          "Richiedi informazioni a sell@cycloriva.com con il numero d'ordine. I dati di tracciamento saranno comunicati solo se disponibili.",
      },
      {
        question: "Posso ordinare dalla Svizzera?",
        answer:
          "La Svizzera è tra le destinazioni previste. Eventuali formalità doganali e spese devono essere chiarite prima della conferma.",
      },
      {
        question: "Cosa faccio se ho un problema di consegna?",
        answer:
          "Contatta sell@cycloriva.com indicando il numero d'ordine e il problema, oppure utilizza la pagina Contatti.",
      },
    ],

    contactTitle: "Domande sulla consegna?",
    contactDescription:
      "Il nostro team può aiutarti con informazioni su ordini, destinazioni e spedizioni.",
    ordersEmailLabel: "Informazioni sugli ordini",
    generalEmailLabel: "Domande generali",
    contactButton: "Contatta CYCLORIVA",
    shopButton: "Scopri i prodotti",
    footerNotice:
      "Costi, disponibilità e tempi di spedizione dipendono dalle condizioni confermate per ciascun ordine.",
  },

  es: {
    pageTitle: "Envíos y entregas",
    description:
      "Información CYCLORIVA sobre países de entrega, gastos de envío, plazos y pedidos.",
    eyebrow: "BICICLETAS & MOVILIDAD ELÉCTRICA EN EUROPA",
    home: "Inicio",

    heroLabel: "ENTREGAS CYCLORIVA",
    heroTitle: "Bicicletas y accesorios hasta tu destino.",
    heroDescription:
      "Consulta los países disponibles y la información necesaria antes de confirmar tu pedido.",
    viewCountries: "Ver países de entrega",
    contactUs: "Contáctanos",

    countriesTitle: "Países de entrega",
    countriesDescription:
      "CYCLORIVA acepta pedidos para ocho destinos europeos.",
    countriesNotice:
      "La entrega a una dirección concreta depende de la disponibilidad del producto y de las condiciones del pedido.",

    informationTitle: "Información de entrega",
    informationDescription: "Lo que debes saber antes de confirmar tu pedido.",
    shippingCostTitle: "Gastos de envío",
    shippingCostDescription:
      "Dependen de los productos, las cantidades y el destino. Los gastos aplicables deben mostrarse antes de la confirmación final.",
    shippingTimeTitle: "Plazos de entrega",
    shippingTimeDescription:
      "Los plazos varían según disponibilidad, preparación y transporte. Una estimación concreta debe confirmarse para cada pedido.",
    destinationTitle: "Dirección de entrega",
    destinationDescription:
      "Indica país, ciudad, dirección y código postal, y revisa los datos antes de confirmar.",
    orderStatusTitle: "Información de envío",
    orderStatusDescription:
      "Para consultar la preparación o expedición de tu pedido escribe a sell@cycloriva.com con la referencia.",

    processTitle: "¿Cómo funciona un pedido?",
    processDescription:
      "Un proceso sencillo desde el carrito hasta la entrega.",
    stepOneTitle: "Elige tus productos",
    stepOneDescription: "Explora el catálogo y añade los artículos al carrito.",
    stepTwoTitle: "Indica tu destino",
    stepTwoDescription:
      "Selecciona el país e introduce los datos necesarios para la entrega.",
    stepThreeTitle: "Revisa y confirma",
    stepThreeDescription:
      "Comprueba tus datos, los artículos y el importe total.",
    stepFourTitle: "Tramitación del pedido",
    stepFourDescription:
      "Una vez registrado, el pedido se procesa según la información disponible.",

    adviceTitle: "Antes de confirmar",
    adviceDescription: "Tres comprobaciones para evitar errores de entrega.",
    adviceOne: "Comprueba la dirección completa y el código postal.",
    adviceTwo: "Facilita un teléfono y correo electrónico de contacto.",
    adviceThree:
      "Revisa el total y la información de envío antes de confirmar.",

    faqTitle: "Preguntas frecuentes sobre entregas",
    faqDescription: "Selecciona una pregunta para ver la respuesta.",
    faq: [
      {
        question: "¿A qué países entrega CYCLORIVA?",
        answer:
          "Los ocho destinos previstos son Alemania, Francia, España, Italia, Suiza, Austria, Países Bajos y Bélgica. La entrega depende de las condiciones de cada producto y destino.",
      },
      {
        question: "¿El envío es gratuito?",
        answer:
          "El envío gratuito no se ofrece automáticamente. Los gastos aplicables deben calcularse y mostrarse antes de la confirmación final.",
      },
      {
        question: "¿Cuánto tarda la entrega?",
        answer:
          "El plazo depende de la disponibilidad, preparación y destino. Contacta con nuestro equipo para información sobre un pedido concreto.",
      },
      {
        question: "¿Cómo conozco el coste del envío?",
        answer:
          "Añade artículos al carrito e introduce el país y la dirección durante el pedido. Los gastos deben calcularse antes de la confirmación.",
      },
      {
        question: "¿Puedo cambiar la dirección de entrega?",
        answer:
          "Escribe cuanto antes a sell@cycloriva.com con la referencia y la nueva dirección. Los cambios dependen del estado de tramitación.",
      },
      {
        question: "¿Cómo puedo seguir mi pedido?",
        answer:
          "Solicita información a sell@cycloriva.com con tu número de pedido. Los datos de seguimiento solo se proporcionarán si están disponibles.",
      },
      {
        question: "¿Puedo pedir desde Suiza?",
        answer:
          "Suiza es un destino previsto. Los posibles trámites aduaneros y gastos aplicables deben aclararse antes de confirmar.",
      },
      {
        question: "¿Qué hago si hay un problema de entrega?",
        answer:
          "Contacta con sell@cycloriva.com con tu referencia y la descripción del problema, o utiliza la página Contacto.",
      },
    ],

    contactTitle: "¿Dudas sobre la entrega?",
    contactDescription:
      "Nuestro equipo puede orientarte sobre pedidos, destinos e información de transporte disponible.",
    ordersEmailLabel: "Información sobre pedidos",
    generalEmailLabel: "Consultas generales",
    contactButton: "Contactar con CYCLORIVA",
    shopButton: "Descubrir productos",
    footerNotice:
      "Los gastos, la disponibilidad y los plazos dependen de las condiciones confirmadas para cada pedido.",
  },
};

// ============================================================
// 6. STYLES
// ============================================================

const CONTAINER = "mx-auto w-full max-w-none px-4 sm:px-6 lg:px-6 xl:px-8";

const CARD =
  "min-w-0 rounded-2xl border border-[#dce5ec] bg-white " +
  "shadow-[0_3px_15px_rgba(16,43,57,0.045)]";

const SECTION_TITLE =
  "text-[23px] font-black tracking-tight text-[#102b39] " +
  "sm:text-[29px] lg:text-[31px]";

const GREEN_BUTTON =
  "inline-flex min-h-12 items-center justify-center gap-2 " +
  "rounded-lg bg-[#078e1d] px-5 py-3 text-center text-[13px] " +
  "font-extrabold text-white transition-colors hover:bg-[#067719] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[#109b24] sm:text-sm";

// ============================================================
// 7. MÉTADONNÉES
// ============================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return {
    title: `${t.pageTitle} | CYCLORIVA`,
    description: t.description,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      languages: {
        fr: "/fr/livraison",
        en: "/en/livraison",
        de: "/de/livraison",
        it: "/it/livraison",
        es: "/es/livraison",
        "x-default": "/fr/livraison",
      },
    },

    openGraph: {
      type: "website",
      title: `${t.pageTitle} | CYCLORIVA`,
      description: t.description,
    },
  };
}

// ============================================================
// 8. BANDEAU PC
// ============================================================

function DeliveryBanner({ t }: { t: PageTexts }) {
  return (
    <section
      aria-label={t.pageTitle}
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
          {t.pageTitle}
        </h1>
      </div>
    </section>
  );
}

// ============================================================
// 9. FIL D'ARIANE
// ============================================================

function DeliveryBreadcrumb({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <nav
      aria-label="Breadcrumb"
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
        {t.pageTitle}
      </span>
    </nav>
  );
}

// ============================================================
// 10. INTRODUCTION
// ============================================================

function DeliveryHero({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <section className="grid min-w-0 items-center gap-3 py-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-3 lg:py-1">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-2 text-[11px] font-extrabold text-[#078d21]">
          <Truck size={17} />
          {t.heroLabel}
        </span>

        <h2 className="mt-2 max-w-180 text-[29px] leading-[1.13] font-black tracking-tight text-[#102b39] sm:text-[40px] lg:text-[45px]">
          {t.heroTitle}
        </h2>

        <p className="mt-2 max-w-155 text-[14px] leading-7 text-[#536c7b] sm:text-[15px]">
          {t.heroDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <a href="#pays-livraison" className={GREEN_BUTTON}>
            <Globe2 size={18} />
            {t.viewCountries}
            <ArrowRight size={17} />
          </a>

          <Link
            href={`/${locale}/contact`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#b6c7d2] bg-white px-5 py-3 text-[13px] font-bold text-[#102b39] transition-colors hover:bg-[#f4f8fa] sm:text-sm"
          >
            <Headphones size={18} />
            {t.contactUs}
          </Link>
        </div>
      </div>

      <div className={`${CARD} overflow-hidden`}>
        <div
          className="relative min-h-44 bg-[#0b3044] bg-cover bg-center sm:min-h-52 lg:min-h-64"
          style={{
            backgroundImage: "url('/images/accueil.png')",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-[#092639]/85 via-transparent to-transparent"
          />

          <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-xl border border-white/20 bg-[#102b39]/85 p-3 backdrop-blur-sm">
            <Truck size={30} className="shrink-0 text-[#8de87a]" />

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
// 11. PAYS DISPONIBLES
// ============================================================

function DeliveryCountries({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <section id="pays-livraison" className="scroll-mt-24 py-1 lg:py-1">
      <div className={`${CARD} p-3 sm:p-3 lg:p-3`}>
        <div className="flex items-start gap-3">
          <Globe2 size={31} className="mt-0.5 shrink-0 text-[#109b24]" />

          <div className="min-w-0">
            <h2 className={SECTION_TITLE}>{t.countriesTitle}</h2>

            <p className="mt-2 text-[13px] leading-6 text-[#617586]">
              {t.countriesDescription}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COUNTRIES.map((country) => (
            <div
              key={country.code}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e0e9ed] bg-[#f9fbfc] px-3 py-3.5"
            >
              <span
                role="img"
                aria-label={country.name[locale]}
                className="shrink-0 text-[25px]"
              >
                {country.flag}
              </span>

              <div className="min-w-0">
                <p className="text-[12px] font-extrabold text-[#102b39] sm:text-[13px]">
                  {country.name[locale]}
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-[#708493]">
                  {country.code}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 flex items-start gap-2 rounded-xl border border-[#d8ecd7] bg-[#f0faee] p-3 text-[12px] leading-6 text-[#315b43]">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          {t.countriesNotice}
        </p>
      </div>
    </section>
  );
}

// ============================================================
// 12. INFORMATIONS DE LIVRAISON
// ============================================================

function DeliveryInformation({ t }: { t: PageTexts }) {
  const information = [
    {
      icon: Wallet,
      title: t.shippingCostTitle,
      description: t.shippingCostDescription,
    },
    {
      icon: Clock3,
      title: t.shippingTimeTitle,
      description: t.shippingTimeDescription,
    },
    {
      icon: MapPin,
      title: t.destinationTitle,
      description: t.destinationDescription,
    },
    {
      icon: PackageCheck,
      title: t.orderStatusTitle,
      description: t.orderStatusDescription,
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {information.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className={`${CARD} p-3`}>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
              </div>

              <h3 className="text-[15px] font-extrabold text-[#102b39]">
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
// 13. PROCESSUS DE COMMANDE
// ============================================================

function DeliveryProcess({ t }: { t: PageTexts }) {
  const steps = [
    {
      icon: ShoppingCart,
      title: t.stepOneTitle,
      description: t.stepOneDescription,
    },
    {
      icon: MapPin,
      title: t.stepTwoTitle,
      description: t.stepTwoDescription,
    },
    {
      icon: ClipboardCheck,
      title: t.stepThreeTitle,
      description: t.stepThreeDescription,
    },
    {
      icon: Package,
      title: t.stepFourTitle,
      description: t.stepFourDescription,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2 text-center">
        <h2 className={SECTION_TITLE}>{t.processTitle}</h2>

        <p className="mx-auto mt-2 max-w-162.5 text-[13px] leading-6 text-[#617586]">
          {t.processDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article key={step.title} className={`${CARD} p-3 sm:p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                  <Icon size={26} aria-hidden="true" />
                </div>

                <span className="text-[30px] font-black text-[#e1eee5]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-2 text-[15px] font-extrabold text-[#102b39]">
                {step.title}
              </h3>

              <p className="mt-3 text-[12px] leading-6 text-[#607383]">
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
// 14. CONSEILS AVANT LA COMMANDE
// ============================================================

function DeliveryAdvice({ t }: { t: PageTexts }) {
  const advice = [t.adviceOne, t.adviceTwo, t.adviceThree];

  return (
    <section className="py-1 lg:py-1">
      <div
        className={`${CARD} grid gap-3 p-3 sm:p-3 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:gap-3 lg:p-3`}
      >
        <div>
          <ShieldCheck
            size={35}
            className="mb-2 text-[#109b24]"
            aria-hidden="true"
          />

          <h2 className={SECTION_TITLE}>{t.adviceTitle}</h2>

          <p className="mt-3 text-[13px] leading-6 text-[#617586]">
            {t.adviceDescription}
          </p>
        </div>

        <div className="space-y-3">
          {advice.map((text, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-[#e0e9ed] bg-[#f9fcf9] p-3"
            >
              <CheckCircle2
                size={21}
                className="mt-0.5 shrink-0 text-[#109b24]"
                aria-hidden="true"
              />

              <p className="text-[13px] leading-6 text-[#324c5d]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 15. FAQ INTERACTIVE
// ============================================================

function DeliveryFAQ({ t }: { t: PageTexts }) {
  return (
    <section id="faq-livraison" className="scroll-mt-24 py-1 lg:py-1">
      <div className="mb-2 flex items-start gap-3">
        <CircleHelp
          size={32}
          className="mt-0.5 shrink-0 text-[#109b24]"
          aria-hidden="true"
        />

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
              <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between gap-3 px-3 py-3.5 text-left text-[13px] leading-5 font-extrabold text-[#102b39] transition-colors hover:bg-[#f7fbf7] focus-visible:outline-2 focus-visible:outline-[#109b24] sm:px-5 sm:text-[14px] [&::-webkit-details-marker]:hidden">
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
// 16. CONTACT LIVRAISON
// ============================================================

function DeliveryContact({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <section className="py-1 lg:py-1">
      <div className={`${CARD} p-3 sm:p-3 lg:p-3`}>
        <div className="flex items-start gap-3">
          <Headphones
            size={31}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          <div>
            <h2 className={SECTION_TITLE}>{t.contactTitle}</h2>

            <p className="mt-2 max-w-187.5 text-[13px] leading-6 text-[#617586]">
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
                {t.ordersEmailLabel}
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
                {t.generalEmailLabel}
              </p>

              <p className="mt-1 break-all text-[13px] text-[#52697b]">
                {CONTACT_EMAIL}
              </p>
            </div>
          </a>
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link href={`/${locale}/contact`} className={GREEN_BUTTON}>
            <Mail size={18} />
            {t.contactButton}
            <ArrowRight size={17} />
          </Link>

          <Link
            href={`/${locale}/produits`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#b6c7d2] px-5 py-3 text-[13px] font-bold text-[#102b39] transition-colors hover:bg-[#f4f8fa] sm:text-sm"
          >
            <Bike size={18} />
            {t.shopButton}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 17. PAGE PRINCIPALE
// ============================================================

async function DeliveryPageContent({ params }: PageProps) {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return (
    <main
      data-page="delivery"
      className="info-page w-full min-w-0 bg-white pb-2 text-[#102b39] lg:pb-2"
    >
      {/* Header général : SiteChrome */}

      <DeliveryBanner t={t} />

      <div className={CONTAINER}>
        <DeliveryBreadcrumb locale={locale} t={t} />

        <DeliveryHero locale={locale} t={t} />

        <DeliveryCountries locale={locale} t={t} />

        <DeliveryInformation t={t} />

        <DeliveryProcess t={t} />

        <DeliveryAdvice t={t} />

        <DeliveryFAQ t={t} />

        <DeliveryContact locale={locale} t={t} />

        <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#6a7c88]">
          <CheckCircle2
            size={15}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          {t.footerNotice}
        </p>
      </div>

      {/* Footer général : SiteChrome */}
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA PAGE LIVRAISON
// ============================================================

export default function DeliveryPage(
  props: Parameters<typeof DeliveryPageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <DeliveryPageContent {...props} />
    </Suspense>
  );
}
