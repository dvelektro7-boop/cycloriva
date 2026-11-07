import "@/components/site/InformationPages.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRight,
  Bike,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Headphones,
  House,
  Mail,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

/**
 * ============================================================
 * CYCLORIVA — FOIRE AUX QUESTIONS
 * ============================================================
 *
 * FICHIER :
 * app/[locale]/faq/page.tsx
 *
 * TECHNOLOGIES :
 * Next.js 16 — App Router
 * React — TypeScript — Tailwind CSS 4
 * Lucide React
 *
 * UN SEUL FICHIER
 *
 * ROUTES :
 * /fr/faq
 * /en/faq
 * /de/faq
 * /it/faq
 * /es/faq
 *
 * FONCTIONNALITÉS :
 * - Bandeau sur ordinateur
 * - Fil d'Ariane
 * - Introduction
 * - Navigation par catégories
 * - Questions dépliables
 * - Réponses traduites
 * - Liens utiles
 * - Contact WhatsApp et e-mail
 * - Responsive PC et mobile
 *
 * Aucun faux tarif, délai, suivi de commande
 * ou mode de paiement n'est annoncé.
 *
 * Aucun fichier complémentaire nécessaire.
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

type Locale = "fr" | "en" | "de" | "it" | "es";

type FAQCategoryId =
  "orders" | "delivery" | "payment" | "products" | "returns" | "support";

type FAQQuestion = {
  question: string;
  answer: string;
};

type FAQCategory = {
  id: FAQCategoryId;
  title: string;
  description: string;
  questions: FAQQuestion[];
};

type FAQTexts = {
  title: string;
  home: string;
  eyebrow: string;
  metaDescription: string;

  heroBadge: string;
  heroTitle: string;
  heroDescription: string;

  exploreQuestions: string;
  contactUs: string;

  categoriesTitle: string;
  categoriesDescription: string;
  allQuestions: string;

  helpTitle: string;
  helpDescription: string;
  emailOrders: string;
  emailGeneral: string;
  whatsappGermany: string;
  whatsappFrance: string;

  contactPage: string;
  customerService: string;
  usefulLinks: string;

  linkDelivery: string;
  linkReturns: string;
  linkGuides: string;

  finalTitle: string;
  finalDescription: string;

  disclaimer: string;

  categories: FAQCategory[];
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

// ============================================================
// 2. CONFIGURATION
// ============================================================

const SUPPORTED_LOCALES: Locale[] = ["fr", "en", "de", "it", "es"];

function resolveLocale(value: string): Locale {
  if (!SUPPORTED_LOCALES.includes(value as Locale)) {
    notFound();
  }

  return value as Locale;
}

const EMAIL_ORDERS = "sell@cycloriva.com";
const EMAIL_GENERAL = "contact@cycloriva.com";

const WHATSAPP_DE = "https://wa.me/4915730394552";
const WHATSAPP_FR = "https://wa.me/33658694178";

const PHONE_DE = "+49 1573 0394552";
const PHONE_FR = "+33 6 58 69 41 78";

// ============================================================
// 3. TRADUCTIONS
// ============================================================

const TEXTS: Record<Locale, FAQTexts> = {
  // ==========================================================
  // FRANÇAIS
  // ==========================================================

  fr: {
    title: "Questions fréquentes",
    home: "Accueil",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    metaDescription:
      "Toutes les réponses aux questions fréquentes sur les commandes, livraisons, paiements, vélos, retours et services CYCLORIVA.",

    heroBadge: "CENTRE D'AIDE CYCLORIVA",
    heroTitle: "Une question ? Trouvez votre réponse facilement.",
    heroDescription:
      "Consultez les réponses aux questions les plus courantes sur nos produits, les commandes, la livraison et l'assistance.",

    exploreQuestions: "Consulter les questions",
    contactUs: "Nous contacter",

    categoriesTitle: "Comment pouvons-nous vous aider ?",
    categoriesDescription:
      "Choisissez une catégorie pour accéder directement aux réponses.",
    allQuestions: "Toutes les questions",

    helpTitle: "Besoin d'une réponse personnalisée ?",
    helpDescription:
      "Si votre question concerne une commande précise, indiquez sa référence lorsque vous contactez notre équipe.",

    emailOrders: "Informations sur les commandes",
    emailGeneral: "Questions générales",
    whatsappGermany: "WhatsApp Allemagne",
    whatsappFrance: "WhatsApp France",

    contactPage: "Page Contact",
    customerService: "Service client",
    usefulLinks: "Informations utiles",

    linkDelivery: "Livraison",
    linkReturns: "Retours & remboursements",
    linkGuides: "Conseils & Guides",

    finalTitle: "Vous avez encore une question ?",
    finalDescription:
      "L'équipe CYCLORIVA reste joignable par e-mail ou WhatsApp pour vous aider.",

    disclaimer:
      "Ces réponses sont générales. Les informations propres au produit, les conditions de vente et les droits légaux applicables prévalent.",

    categories: [
      {
        id: "orders",
        title: "Commandes",
        description: "Passer, vérifier ou modifier une commande.",
        questions: [
          {
            question: "Comment passer une commande sur CYCLORIVA ?",
            answer:
              "Sélectionnez les produits souhaités, ajoutez-les au panier, vérifiez les quantités puis ouvrez la page de commande. Renseignez vos coordonnées et votre adresse de livraison avant de valider les informations et le montant présenté.",
          },
          {
            question: "Comment savoir si ma commande a été reçue ?",
            answer:
              "Après l'enregistrement réussi d'une commande, une confirmation doit être envoyée à l'adresse e-mail renseignée. Si vous ne recevez rien, vérifiez vos courriers indésirables puis contactez sell@cycloriva.com en précisant les informations utiles.",
          },
          {
            question: "Puis-je modifier ou annuler une commande ?",
            answer:
              "Contactez sell@cycloriva.com dès que possible avec votre numéro de commande et la modification souhaitée. Les possibilités dépendent de l'état de traitement de la commande et de vos droits légaux.",
          },
        ],
      },

      {
        id: "delivery",
        title: "Livraison",
        description: "Destinations, frais et suivi des commandes.",
        questions: [
          {
            question: "Dans quels pays puis-je commander ?",
            answer:
              "CYCLORIVA propose les destinations suivantes : Allemagne, France, Espagne, Italie, Suisse, Autriche, Pays-Bas et Belgique. La disponibilité et les conditions de livraison doivent être confirmées pour chaque commande.",
          },
          {
            question: "Comment sont calculés les frais de livraison ?",
            answer:
              "Les frais peuvent dépendre des produits, de leur quantité et de votre destination. Le montant applicable doit être communiqué avant la validation définitive de la commande. Nous ne supposons pas que la livraison est gratuite.",
          },
          {
            question: "Comment suivre ma livraison ?",
            answer:
              "Pour obtenir des informations sur le traitement ou l'expédition, contactez sell@cycloriva.com avec votre numéro de commande. Les informations de suivi sont communiquées lorsqu'elles sont effectivement disponibles.",
          },
        ],
      },

      {
        id: "payment",
        title: "Paiement et montants",
        description: "Prix, total de commande et statut du paiement.",
        questions: [
          {
            question: "Comment connaître le montant total de ma commande ?",
            answer:
              "Votre panier affiche le sous-total des produits sélectionnés. Les frais de livraison et le montant final doivent être vérifiés sur la page de commande avant sa validation.",
          },
          {
            question: "Quels moyens de paiement sont acceptés ?",
            answer:
              "Les moyens de paiement disponibles doivent être indiqués sur le parcours de commande lorsqu'ils sont effectivement activés. Contactez sell@cycloriva.com pour vérifier les modalités applicables à votre achat.",
          },
          {
            question: "Valider une commande signifie-t-il que j'ai payé ?",
            answer:
              "Non. L'enregistrement d'une commande et la confirmation d'un paiement sont deux opérations distinctes. Une commande reçue ne doit pas être considérée comme payée sans confirmation réelle du paiement.",
          },
        ],
      },

      {
        id: "products",
        title: "Vélos et produits",
        description: "Choix, caractéristiques et entretien.",
        questions: [
          {
            question: "Comment choisir un vélo adapté à mes besoins ?",
            answer:
              "Tenez compte de votre utilisation, de la taille du cadre, du confort, des équipements et des caractéristiques du modèle. Consultez notre page Conseils & Guides pour découvrir les principaux critères de choix.",
          },
          {
            question: "Quelle autonomie possède un vélo électrique ?",
            answer:
              "L'autonomie dépend de la batterie, du système d'assistance, du relief, du poids transporté et des conditions d'utilisation. Consultez les caractéristiques du vélo concerné : une autonomie identique ne peut pas être garantie pour tous les trajets.",
          },
          {
            question: "Comment entretenir mon vélo ?",
            answer:
              "Contrôlez notamment les pneus, les freins et les éléments de transmission. Respectez les recommandations du fabricant, particulièrement pour la batterie et le système électrique, et faites intervenir un professionnel lorsque nécessaire.",
          },
        ],
      },

      {
        id: "returns",
        title: "Retours et remboursements",
        description: "Rétractation, produits défectueux et assistance.",
        questions: [
          {
            question: "Puis-je retourner un produit après réception ?",
            answer:
              "Vos possibilités dépendent du droit applicable, des conditions de vente et du motif. Pour les ventes à distance couvertes par les règles de consommation de l'Union européenne, un droit de rétractation de 14 jours s'applique généralement, sous réserve des exceptions légales.",
          },
          {
            question: "Que faire si mon produit est endommagé ?",
            answer:
              "Contactez contact@cycloriva.com avec le numéro de commande, une description du problème et, si possible, des photographies. Les garanties légales applicables restent indépendantes d'un éventuel retour pour changement d'avis.",
          },
          {
            question: "Comment demander un remboursement ?",
            answer:
              "Contactez CYCLORIVA en indiquant le produit et la référence de commande. Les modalités et les délais dépendent de la situation et des dispositions légales applicables. Consultez également notre page Retours & remboursements.",
          },
        ],
      },

      {
        id: "support",
        title: "Service client",
        description: "Coordonnées, WhatsApp et assistance.",
        questions: [
          {
            question: "Comment contacter le service client ?",
            answer:
              "Pour les commandes, écrivez à sell@cycloriva.com. Pour les questions générales, utilisez contact@cycloriva.com. Vous pouvez également passer par le formulaire disponible sur notre page Contact.",
          },
          {
            question: "CYCLORIVA est-il disponible sur WhatsApp ?",
            answer:
              "Oui. Vous pouvez utiliser le +49 1573 0394552 pour le contact allemand ou le +33 6 58 69 41 78 pour le contact français.",
          },
          {
            question:
              "Quelles informations faut-il fournir pour obtenir de l'aide ?",
            answer:
              "Indiquez le sujet de votre demande et, si elle concerne une commande, sa référence. Pour une question technique, ajoutez le nom du produit et une description claire du problème.",
          },
        ],
      },
    ],
  },

  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    title: "Frequently Asked Questions",
    home: "Home",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    metaDescription:
      "Answers to common questions about CYCLORIVA orders, delivery, payments, bicycles, returns and customer support.",

    heroBadge: "CYCLORIVA HELP CENTRE",
    heroTitle: "Have a question? Find your answer.",
    heroDescription:
      "Explore helpful information about our products, orders, delivery and customer support.",

    exploreQuestions: "Browse questions",
    contactUs: "Contact us",

    categoriesTitle: "How can we help you?",
    categoriesDescription:
      "Choose a category to find the information you need.",
    allQuestions: "All questions",

    helpTitle: "Need personalised assistance?",
    helpDescription:
      "For questions about a specific order, include your order reference when contacting our team.",

    emailOrders: "Order enquiries",
    emailGeneral: "General questions",
    whatsappGermany: "WhatsApp Germany",
    whatsappFrance: "WhatsApp France",

    contactPage: "Contact page",
    customerService: "Customer service",
    usefulLinks: "Useful information",

    linkDelivery: "Delivery",
    linkReturns: "Returns & refunds",
    linkGuides: "Tips & Guides",

    finalTitle: "Still have a question?",
    finalDescription:
      "The CYCLORIVA team can be contacted by email or WhatsApp.",

    disclaimer:
      "These answers are general. Product-specific details, applicable terms of sale and statutory rights take precedence.",

    categories: [
      {
        id: "orders",
        title: "Orders",
        description: "Place, review or change an order.",
        questions: [
          {
            question: "How do I place an order?",
            answer:
              "Choose your products, add them to your cart, check quantities and proceed to checkout. Enter your contact and delivery details, then review the amount and information before submitting.",
          },
          {
            question: "How do I know my order was received?",
            answer:
              "After an order is successfully recorded, a confirmation email should be sent to the address provided. If you do not receive it, check your spam folder and contact sell@cycloriva.com.",
          },
          {
            question: "Can I change or cancel an order?",
            answer:
              "Contact sell@cycloriva.com as soon as possible with your order number and requested change. Options depend on processing status and applicable legal rights.",
          },
        ],
      },
      {
        id: "delivery",
        title: "Delivery",
        description: "Destinations, shipping and order updates.",
        questions: [
          {
            question: "Which countries can I order from?",
            answer:
              "The proposed delivery destinations are Germany, France, Spain, Italy, Switzerland, Austria, the Netherlands and Belgium. Availability and delivery conditions must be confirmed for each order.",
          },
          {
            question: "How are shipping charges calculated?",
            answer:
              "Charges can depend on your products, quantities and destination. Applicable shipping costs must be presented before final submission. Free shipping is not assumed.",
          },
          {
            question: "How can I track my delivery?",
            answer:
              "Contact sell@cycloriva.com with your order number. Tracking information will be provided when it is genuinely available.",
          },
        ],
      },
      {
        id: "payment",
        title: "Payment and totals",
        description: "Prices, final totals and payment status.",
        questions: [
          {
            question: "How can I check my order total?",
            answer:
              "Your cart shows the subtotal for your selected items. Shipping charges and the final amount must be reviewed at checkout before confirmation.",
          },
          {
            question: "Which payment methods are accepted?",
            answer:
              "Available payment methods must appear at checkout once enabled. Contact sell@cycloriva.com to confirm the arrangements currently available.",
          },
          {
            question: "Does submitting an order mean I have paid?",
            answer:
              "No. Recording an order and successfully processing a payment are separate actions. An order must not be considered paid without actual payment confirmation.",
          },
        ],
      },
      {
        id: "products",
        title: "Bicycles and products",
        description: "Choosing, specifications and maintenance.",
        questions: [
          {
            question: "How do I choose the right bicycle?",
            answer:
              "Consider your intended use, frame size, comfort and equipment. Visit our Tips & Guides page for helpful selection criteria.",
          },
          {
            question: "What is an e-bike's range?",
            answer:
              "Range depends on battery capacity, assistance level, terrain, load and riding conditions. Check each model's specifications rather than expecting a fixed distance.",
          },
          {
            question: "How should I maintain my bicycle?",
            answer:
              "Regularly inspect tyres, brakes and drivetrain components. Follow manufacturer instructions, especially for electrical systems and batteries, and consult a qualified mechanic when necessary.",
          },
        ],
      },
      {
        id: "returns",
        title: "Returns and refunds",
        description: "Withdrawal, faulty goods and support.",
        questions: [
          {
            question: "Can I return an item after receiving it?",
            answer:
              "Your rights depend on applicable law, the terms of sale and the reason for return. Under qualifying EU distance-sale rules, a 14-day withdrawal period generally applies, subject to legal exceptions.",
          },
          {
            question: "What if my product arrives damaged?",
            answer:
              "Contact contact@cycloriva.com with your order number, a description and photographs if possible. Applicable statutory protections remain in force.",
          },
          {
            question: "How do I request a refund?",
            answer:
              "Contact CYCLORIVA with the product and order reference. The process and timing depend on the circumstances and relevant law. You can also visit our Returns & refunds page.",
          },
        ],
      },
      {
        id: "support",
        title: "Customer support",
        description: "Email, WhatsApp and assistance.",
        questions: [
          {
            question: "How can I contact customer service?",
            answer:
              "For orders, email sell@cycloriva.com. For general enquiries, use contact@cycloriva.com or the form on our Contact page.",
          },
          {
            question: "Is CYCLORIVA available on WhatsApp?",
            answer:
              "Yes. Use +49 1573 0394552 for Germany or +33 6 58 69 41 78 for France.",
          },
          {
            question: "What information should I provide?",
            answer:
              "Describe your enquiry and include the order number when relevant. For technical questions, provide the product name and a clear description.",
          },
        ],
      },
    ],
  },

  // ==========================================================
  // DEUTSCH
  // ==========================================================

  de: {
    title: "Häufig gestellte Fragen",
    home: "Startseite",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    metaDescription:
      "Antworten auf Fragen zu CYCLORIVA Bestellungen, Lieferung, Zahlung, Fahrrädern, Rückgaben und Kundenservice.",

    heroBadge: "CYCLORIVA HILFECENTER",
    heroTitle: "Sie haben Fragen? Hier finden Sie Antworten.",
    heroDescription:
      "Informationen zu Produkten, Bestellungen, Lieferung und Unterstützung.",

    exploreQuestions: "Fragen entdecken",
    contactUs: "Kontakt",

    categoriesTitle: "Wie können wir Ihnen helfen?",
    categoriesDescription: "Wählen Sie eine Kategorie aus.",
    allQuestions: "Alle Fragen",

    helpTitle: "Benötigen Sie persönliche Hilfe?",
    helpDescription:
      "Bei Fragen zu einer Bestellung nennen Sie bitte Ihre Bestellnummer.",

    emailOrders: "Bestellanfragen",
    emailGeneral: "Allgemeine Fragen",
    whatsappGermany: "WhatsApp Deutschland",
    whatsappFrance: "WhatsApp Frankreich",

    contactPage: "Kontaktseite",
    customerService: "Kundenservice",
    usefulLinks: "Nützliche Informationen",

    linkDelivery: "Lieferung",
    linkReturns: "Rückgabe & Erstattung",
    linkGuides: "Tipps & Ratgeber",

    finalTitle: "Haben Sie weitere Fragen?",
    finalDescription:
      "Das CYCLORIVA-Team ist per E-Mail oder WhatsApp erreichbar.",

    disclaimer:
      "Diese Antworten sind allgemein. Produktangaben, anwendbare Verkaufsbedingungen und gesetzliche Rechte gehen vor.",

    categories: [
      {
        id: "orders",
        title: "Bestellungen",
        description: "Bestellen, prüfen und ändern.",
        questions: [
          {
            question: "Wie kann ich bei CYCLORIVA bestellen?",
            answer:
              "Wählen Sie Produkte aus und legen Sie sie in den Warenkorb. Prüfen Sie Mengen und geben Sie beim Bestellabschluss Ihre Kontakt- und Lieferdaten ein. Kontrollieren Sie alle Angaben und den Betrag vor dem Absenden.",
          },
          {
            question: "Woher weiß ich, dass meine Bestellung eingegangen ist?",
            answer:
              "Nach erfolgreicher Erfassung sollte eine Bestätigung an Ihre E-Mail-Adresse gesendet werden. Prüfen Sie gegebenenfalls den Spam-Ordner und kontaktieren Sie sell@cycloriva.com.",
          },
          {
            question: "Kann ich eine Bestellung ändern oder stornieren?",
            answer:
              "Kontaktieren Sie sell@cycloriva.com möglichst früh mit Ihrer Bestellnummer. Änderungen hängen vom Bearbeitungsstatus und den gesetzlichen Rechten ab.",
          },
        ],
      },
      {
        id: "delivery",
        title: "Lieferung",
        description: "Lieferländer, Kosten und Versand.",
        questions: [
          {
            question: "In welche Länder kann ich bestellen?",
            answer:
              "Vorgesehene Lieferländer sind Deutschland, Frankreich, Spanien, Italien, die Schweiz, Österreich, die Niederlande und Belgien. Verfügbarkeit und Bedingungen werden für jede Bestellung geprüft.",
          },
          {
            question: "Wie werden die Versandkosten berechnet?",
            answer:
              "Die Kosten können von Produkten, Mengen und Lieferland abhängen. Sie müssen vor der endgültigen Bestellung angezeigt werden. Kostenloser Versand wird nicht vorausgesetzt.",
          },
          {
            question: "Wie kann ich meine Lieferung verfolgen?",
            answer:
              "Kontaktieren Sie sell@cycloriva.com mit Ihrer Bestellnummer. Sendungsverfolgungsdaten werden mitgeteilt, wenn sie tatsächlich vorliegen.",
          },
        ],
      },
      {
        id: "payment",
        title: "Zahlung und Beträge",
        description: "Preise, Gesamtsumme und Zahlungsstatus.",
        questions: [
          {
            question: "Wo sehe ich meinen Gesamtbetrag?",
            answer:
              "Der Warenkorb zeigt die Zwischensumme. Versandkosten und endgültiger Betrag müssen beim Bestellabschluss überprüft werden.",
          },
          {
            question: "Welche Zahlungsmethoden werden akzeptiert?",
            answer:
              "Verfügbare Zahlungsarten müssen beim Bestellabschluss angezeigt werden, sobald sie aktiviert sind. Informationen erhalten Sie unter sell@cycloriva.com.",
          },
          {
            question: "Ist eine Bestellung automatisch bezahlt?",
            answer:
              "Nein. Bestellerfassung und erfolgreiche Zahlung sind getrennte Vorgänge. Ohne tatsächliche Zahlungsbestätigung gilt eine Bestellung nicht als bezahlt.",
          },
        ],
      },
      {
        id: "products",
        title: "Fahrräder und Produkte",
        description: "Auswahl, Eigenschaften und Pflege.",
        questions: [
          {
            question: "Wie finde ich das passende Fahrrad?",
            answer:
              "Achten Sie auf Einsatzzweck, Rahmengröße, Komfort und Ausstattung. Weitere Hinweise finden Sie auf der Seite Tipps & Ratgeber.",
          },
          {
            question: "Welche Reichweite hat ein E-Bike?",
            answer:
              "Die Reichweite hängt von Akku, Unterstützung, Gelände, Belastung und Fahrbedingungen ab. Entscheidend sind die Angaben zum jeweiligen Modell.",
          },
          {
            question: "Wie pflege ich mein Fahrrad?",
            answer:
              "Prüfen Sie Reifen, Bremsen und Antrieb regelmäßig. Beachten Sie die Herstelleranweisungen für Fahrrad und Akku. Bei Sicherheitsfragen hilft eine Fachwerkstatt.",
          },
        ],
      },
      {
        id: "returns",
        title: "Rückgabe und Erstattung",
        description: "Widerruf, Mängel und Reklamationen.",
        questions: [
          {
            question: "Kann ich einen Artikel zurückgeben?",
            answer:
              "Das hängt vom geltenden Recht, den Vertragsbedingungen und dem Rückgabegrund ab. Für entsprechende EU-Fernabsatzkäufe gilt grundsätzlich ein 14-tägiges Widerrufsrecht mit gesetzlichen Ausnahmen.",
          },
          {
            question: "Was mache ich bei einem beschädigten Produkt?",
            answer:
              "Schreiben Sie an contact@cycloriva.com mit Bestellnummer, Problembeschreibung und möglichst Fotos. Gesetzliche Rechte bleiben bestehen.",
          },
          {
            question: "Wie beantrage ich eine Erstattung?",
            answer:
              "Kontaktieren Sie CYCLORIVA mit Artikel und Bestellreferenz. Verfahren und Fristen richten sich nach dem Fall und geltendem Recht. Weitere Hinweise finden Sie auf unserer Rückgabe-Seite.",
          },
        ],
      },
      {
        id: "support",
        title: "Kundenservice",
        description: "Kontakt, WhatsApp und Unterstützung.",
        questions: [
          {
            question: "Wie erreiche ich den Kundenservice?",
            answer:
              "Für Bestellungen: sell@cycloriva.com. Allgemeine Fragen: contact@cycloriva.com oder das Kontaktformular.",
          },
          {
            question: "Ist CYCLORIVA über WhatsApp erreichbar?",
            answer:
              "Ja, unter +49 1573 0394552 für Deutschland und +33 6 58 69 41 78 für Frankreich.",
          },
          {
            question: "Welche Informationen sollte ich angeben?",
            answer:
              "Beschreiben Sie Ihr Anliegen. Bei Bestellungen nennen Sie die Bestellnummer, bei technischen Fragen das Produktmodell.",
          },
        ],
      },
    ],
  },

  // ==========================================================
  // ITALIANO
  // ==========================================================

  it: {
    title: "Domande frequenti",
    home: "Home",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    metaDescription:
      "Risposte CYCLORIVA su ordini, consegne, pagamenti, biciclette, resi e assistenza.",

    heroBadge: "CENTRO ASSISTENZA CYCLORIVA",
    heroTitle: "Hai una domanda? Trova la risposta.",
    heroDescription:
      "Informazioni utili su prodotti, ordini, consegne e assistenza clienti.",

    exploreQuestions: "Esplora le domande",
    contactUs: "Contattaci",

    categoriesTitle: "Come possiamo aiutarti?",
    categoriesDescription: "Scegli una categoria per trovare le risposte.",
    allQuestions: "Tutte le domande",

    helpTitle: "Hai bisogno di assistenza personale?",
    helpDescription:
      "Per domande relative a un ordine specifico, indica il numero di riferimento.",

    emailOrders: "Informazioni sugli ordini",
    emailGeneral: "Domande generali",
    whatsappGermany: "WhatsApp Germania",
    whatsappFrance: "WhatsApp Francia",

    contactPage: "Pagina Contatti",
    customerService: "Servizio clienti",
    usefulLinks: "Informazioni utili",

    linkDelivery: "Consegna",
    linkReturns: "Resi e rimborsi",
    linkGuides: "Consigli e guide",

    finalTitle: "Hai ancora domande?",
    finalDescription: "Il team CYCLORIVA è disponibile via e-mail e WhatsApp.",

    disclaimer:
      "Le risposte sono generali. Prevalgono le informazioni del prodotto, le condizioni applicabili e i diritti di legge.",

    categories: [
      {
        id: "orders",
        title: "Ordini",
        description: "Effettuare, verificare o modificare un ordine.",
        questions: [
          {
            question: "Come si effettua un ordine?",
            answer:
              "Scegli i prodotti, aggiungili al carrello e controlla le quantità. Prosegui inserendo i dati di contatto e consegna, poi verifica l'importo prima di confermare.",
          },
          {
            question: "Come so se il mio ordine è stato ricevuto?",
            answer:
              "Dopo la corretta registrazione dovrebbe essere inviata un'e-mail di conferma. Controlla anche la posta indesiderata e, se necessario, scrivi a sell@cycloriva.com.",
          },
          {
            question: "Posso modificare o annullare un ordine?",
            answer:
              "Contatta al più presto sell@cycloriva.com con il numero d'ordine. Le possibilità dipendono dallo stato di elaborazione e dai diritti applicabili.",
          },
        ],
      },
      {
        id: "delivery",
        title: "Consegna",
        description: "Destinazioni, costi e informazioni di spedizione.",
        questions: [
          {
            question: "In quali paesi posso ordinare?",
            answer:
              "Le destinazioni previste sono Germania, Francia, Spagna, Italia, Svizzera, Austria, Paesi Bassi e Belgio. Disponibilità e condizioni devono essere confermate per ogni ordine.",
          },
          {
            question: "Come vengono calcolati i costi di spedizione?",
            answer:
              "Dipendono da prodotti, quantità e destinazione. I costi applicabili devono essere indicati prima della conferma definitiva. La spedizione gratuita non è presunta.",
          },
          {
            question: "Come seguo la mia consegna?",
            answer:
              "Scrivi a sell@cycloriva.com indicando il numero d'ordine. Le informazioni di tracciamento saranno fornite quando disponibili.",
          },
        ],
      },
      {
        id: "payment",
        title: "Pagamento e importi",
        description: "Prezzi, totale e stato del pagamento.",
        questions: [
          {
            question: "Come conosco il totale del mio ordine?",
            answer:
              "Il carrello mostra il subtotale. Le spese di consegna e il totale definitivo devono essere verificati prima di confermare l'ordine.",
          },
          {
            question: "Quali metodi di pagamento sono accettati?",
            answer:
              "I metodi disponibili devono apparire nel percorso d'ordine una volta attivati. Puoi chiedere informazioni a sell@cycloriva.com.",
          },
          {
            question: "Un ordine inviato è già pagato?",
            answer:
              "No. La registrazione dell'ordine e la conferma del pagamento sono operazioni distinte. Senza conferma effettiva, il pagamento non è considerato completato.",
          },
        ],
      },
      {
        id: "products",
        title: "Biciclette e prodotti",
        description: "Scelta, caratteristiche e manutenzione.",
        questions: [
          {
            question: "Come scegliere la bicicletta giusta?",
            answer:
              "Considera l'uso previsto, la taglia del telaio, la comodità e le dotazioni. Consulta anche la pagina Consigli e guide.",
          },
          {
            question: "Qual è l'autonomia di una e-bike?",
            answer:
              "Dipende da batteria, assistenza, percorso, peso e condizioni di utilizzo. Controlla le caratteristiche del modello specifico.",
          },
          {
            question: "Come mantenere la bicicletta?",
            answer:
              "Controlla regolarmente pneumatici, freni e trasmissione. Segui le indicazioni del produttore e consulta un professionista quando necessario.",
          },
        ],
      },
      {
        id: "returns",
        title: "Resi e rimborsi",
        description: "Recesso, difetti e richieste.",
        questions: [
          {
            question: "Posso restituire un prodotto ricevuto?",
            answer:
              "Dipende dalla legge applicabile, dalle condizioni e dal motivo. Per gli acquisti a distanza soggetti alle norme UE, generalmente è previsto un recesso di 14 giorni, salvo eccezioni.",
          },
          {
            question: "Cosa fare se un prodotto arriva danneggiato?",
            answer:
              "Contatta contact@cycloriva.com con numero d'ordine, descrizione ed eventuali foto. I diritti di legge restano validi.",
          },
          {
            question: "Come chiedo un rimborso?",
            answer:
              "Contatta CYCLORIVA con riferimento e prodotto. La procedura dipende dalla situazione e dalla normativa. Consulta anche la pagina Resi e rimborsi.",
          },
        ],
      },
      {
        id: "support",
        title: "Servizio clienti",
        description: "E-mail, WhatsApp e assistenza.",
        questions: [
          {
            question: "Come contatto il servizio clienti?",
            answer:
              "Per gli ordini usa sell@cycloriva.com. Per domande generali scrivi a contact@cycloriva.com oppure usa il modulo Contatti.",
          },
          {
            question: "Posso scrivere su WhatsApp?",
            answer:
              "Sì, al +49 1573 0394552 per la Germania o al +33 6 58 69 41 78 per la Francia.",
          },
          {
            question: "Quali informazioni devo fornire?",
            answer:
              "Descrivi la richiesta e aggiungi il numero d'ordine se pertinente. Per problemi tecnici, indica il modello del prodotto.",
          },
        ],
      },
    ],
  },

  // ==========================================================
  // ESPAÑOL
  // ==========================================================

  es: {
    title: "Preguntas frecuentes",
    home: "Inicio",
    eyebrow: "BICICLETAS & MOVILIDAD ELÉCTRICA EN EUROPA",
    metaDescription:
      "Respuestas CYCLORIVA sobre pedidos, entregas, pagos, bicicletas, devoluciones y atención al cliente.",

    heroBadge: "CENTRO DE AYUDA CYCLORIVA",
    heroTitle: "¿Tienes alguna pregunta? Encuentra la respuesta.",
    heroDescription:
      "Consulta información útil sobre productos, pedidos, entregas y asistencia.",

    exploreQuestions: "Explorar preguntas",
    contactUs: "Contáctanos",

    categoriesTitle: "¿Cómo podemos ayudarte?",
    categoriesDescription:
      "Selecciona una categoría para consultar las respuestas.",
    allQuestions: "Todas las preguntas",

    helpTitle: "¿Necesitas atención personalizada?",
    helpDescription:
      "Si consultas un pedido específico, incluye su número de referencia.",

    emailOrders: "Consultas sobre pedidos",
    emailGeneral: "Preguntas generales",
    whatsappGermany: "WhatsApp Alemania",
    whatsappFrance: "WhatsApp Francia",

    contactPage: "Página de contacto",
    customerService: "Atención al cliente",
    usefulLinks: "Información útil",

    linkDelivery: "Entrega",
    linkReturns: "Devoluciones y reembolsos",
    linkGuides: "Consejos y guías",

    finalTitle: "¿Todavía tienes preguntas?",
    finalDescription:
      "Puedes contactar con CYCLORIVA por correo electrónico o WhatsApp.",

    disclaimer:
      "Estas respuestas son generales. Prevalecen los datos del producto, las condiciones aplicables y los derechos legales.",

    categories: [
      {
        id: "orders",
        title: "Pedidos",
        description: "Realizar, consultar o modificar pedidos.",
        questions: [
          {
            question: "¿Cómo hago un pedido en CYCLORIVA?",
            answer:
              "Selecciona los productos, añádelos al carrito y revisa las cantidades. Introduce tus datos de contacto y entrega, y comprueba el importe antes de confirmar.",
          },
          {
            question: "¿Cómo sé si se ha recibido mi pedido?",
            answer:
              "Después de registrar correctamente un pedido debería enviarse un correo de confirmación. Revisa el correo no deseado y contacta con sell@cycloriva.com si es necesario.",
          },
          {
            question: "¿Puedo modificar o cancelar un pedido?",
            answer:
              "Contacta cuanto antes con sell@cycloriva.com e indica el número de pedido. Las posibilidades dependen de su estado y de los derechos legales aplicables.",
          },
        ],
      },
      {
        id: "delivery",
        title: "Entrega",
        description: "Destinos, costes e información de envío.",
        questions: [
          {
            question: "¿A qué países se puede pedir?",
            answer:
              "Los destinos previstos son Alemania, Francia, España, Italia, Suiza, Austria, Países Bajos y Bélgica. Las condiciones se confirman para cada pedido.",
          },
          {
            question: "¿Cómo se calculan los gastos de envío?",
            answer:
              "Pueden depender de los productos, cantidades y destino. Los gastos aplicables deben mostrarse antes de la confirmación final. No se presupone envío gratuito.",
          },
          {
            question: "¿Cómo puedo seguir mi entrega?",
            answer:
              "Contacta con sell@cycloriva.com con tu número de pedido. Los datos de seguimiento se comunicarán cuando estén disponibles.",
          },
        ],
      },
      {
        id: "payment",
        title: "Pago e importes",
        description: "Precios, total y estado del pago.",
        questions: [
          {
            question: "¿Dónde veo el importe total?",
            answer:
              "El carrito muestra el subtotal. Los gastos de entrega y el total definitivo deben comprobarse antes de confirmar el pedido.",
          },
          {
            question: "¿Qué métodos de pago se aceptan?",
            answer:
              "Los métodos disponibles deben aparecer en el proceso de compra cuando estén habilitados. Puedes consultar a sell@cycloriva.com.",
          },
          {
            question: "¿Un pedido enviado ya está pagado?",
            answer:
              "No. Registrar un pedido y confirmar un pago son operaciones diferentes. Sin confirmación real, no se considera pagado.",
          },
        ],
      },
      {
        id: "products",
        title: "Bicicletas y productos",
        description: "Elección, características y mantenimiento.",
        questions: [
          {
            question: "¿Cómo elegir la bicicleta adecuada?",
            answer:
              "Considera el uso, la talla del cuadro, la comodidad y el equipamiento. Puedes consultar nuestra página Consejos y guías.",
          },
          {
            question: "¿Qué autonomía tiene una bicicleta eléctrica?",
            answer:
              "Depende de la batería, nivel de asistencia, terreno, peso y condiciones. Consulta las características del modelo concreto.",
          },
          {
            question: "¿Cómo cuidar mi bicicleta?",
            answer:
              "Revisa neumáticos, frenos y transmisión. Sigue las indicaciones del fabricante y acude a un profesional cuando sea necesario.",
          },
        ],
      },
      {
        id: "returns",
        title: "Devoluciones y reembolsos",
        description: "Desistimiento, defectos y solicitudes.",
        questions: [
          {
            question: "¿Puedo devolver un producto recibido?",
            answer:
              "Depende de la ley aplicable, las condiciones y el motivo. Las compras a distancia sujetas a normas de la UE suelen tener un derecho de desistimiento de 14 días, con excepciones legales.",
          },
          {
            question: "¿Qué hago si el producto llega dañado?",
            answer:
              "Escribe a contact@cycloriva.com con tu número de pedido, descripción y fotos si es posible. Se mantienen los derechos legales aplicables.",
          },
          {
            question: "¿Cómo solicito un reembolso?",
            answer:
              "Contacta con CYCLORIVA e indica el producto y número de pedido. El proceso depende del caso y la ley aplicable. Consulta también Devoluciones y reembolsos.",
          },
        ],
      },
      {
        id: "support",
        title: "Atención al cliente",
        description: "Correo, WhatsApp y asistencia.",
        questions: [
          {
            question: "¿Cómo contacto con atención al cliente?",
            answer:
              "Para pedidos: sell@cycloriva.com. Para consultas generales: contact@cycloriva.com o el formulario de contacto.",
          },
          {
            question: "¿Puedo escribir por WhatsApp?",
            answer:
              "Sí, al +49 1573 0394552 para Alemania o al +33 6 58 69 41 78 para Francia.",
          },
          {
            question: "¿Qué información debo proporcionar?",
            answer:
              "Describe tu consulta, incluye el número de pedido si corresponde y el modelo del producto en caso de dudas técnicas.",
          },
        ],
      },
    ],
  },
};

// ============================================================
// 4. ICONÔNES PAR CATÉGORIE
// ============================================================

const CATEGORY_ICONS = {
  orders: ShoppingBag,
  delivery: Truck,
  payment: CreditCard,
  products: Bike,
  returns: RotateCcw,
  support: Headphones,
} as const;

// ============================================================
// 5. STYLES
// ============================================================

const CONTAINER = "mx-auto w-full max-w-none " + "px-4 sm:px-6 lg:px-6 xl:px-8";

const CARD =
  "min-w-0 rounded-2xl border border-[#dce5eb] " +
  "bg-white shadow-[0_3px_15px_rgba(16,43,57,0.045)]";

const SECTION_TITLE =
  "text-[23px] font-black tracking-tight " +
  "text-[#102b39] sm:text-[29px] lg:text-[31px]";

const GREEN_BUTTON =
  "inline-flex min-h-12 items-center justify-center " +
  "gap-2 rounded-lg bg-[#078e1d] px-5 py-3 " +
  "text-center text-[13px] font-extrabold text-white " +
  "transition-colors hover:bg-[#067719] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
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
    title: `${t.title} | CYCLORIVA`,
    description: t.metaDescription,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      languages: {
        fr: "/fr/faq",
        en: "/en/faq",
        de: "/de/faq",
        it: "/it/faq",
        es: "/es/faq",
        "x-default": "/fr/faq",
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
// 7. BANDEAU PC
// ============================================================

function FAQBanner({ t }: { t: FAQTexts }) {
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
          FAQ — {t.title}
        </h1>
      </div>
    </section>
  );
}

// ============================================================
// 8. FIL D'ARIANE
// ============================================================

function FAQBreadcrumb({ locale, t }: { locale: Locale; t: FAQTexts }) {
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
        FAQ
      </span>
    </nav>
  );
}

// ============================================================
// 9. INTRODUCTION
// ============================================================

function FAQHero({ locale, t }: { locale: Locale; t: FAQTexts }) {
  return (
    <section className="grid min-w-0 items-center gap-3 py-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-3 lg:py-1">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-2 text-[11px] font-extrabold text-[#078d21]">
          <CircleHelp size={17} aria-hidden="true" />
          {t.heroBadge}
        </span>

        <h2 className="mt-2 max-w-187.5 text-[29px] leading-[1.13] font-black tracking-tight text-[#102b39] sm:text-[40px] lg:text-[46px]">
          {t.heroTitle}
        </h2>

        <p className="mt-2 max-w-155 text-[14px] leading-7 text-[#536c7b] sm:text-[15px]">
          {t.heroDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <a href="#questions" className={GREEN_BUTTON}>
            <CircleHelp size={18} />
            {t.exploreQuestions}
            <ArrowRight size={17} />
          </a>

          <Link
            href={`/${locale}/contact`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#b6c7d2] bg-white px-5 py-3 text-[13px] font-bold text-[#102b39] transition-colors hover:bg-[#f4f8fa] sm:text-sm"
          >
            <Mail size={18} />
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
            <CircleHelp
              size={30}
              className="shrink-0 text-[#8de87a]"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#a9e99d]">
                CYCLORIVA
              </p>

              <p className="mt-1 text-[15px] font-extrabold text-white">
                {t.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 10. NAVIGATION DES CATÉGORIES
// ============================================================

function FAQCategories({ t }: { t: FAQTexts }) {
  return (
    <section className="py-1 lg:py-1">
      <div className="mb-3">
        <h2 className={SECTION_TITLE}>{t.categoriesTitle}</h2>

        <p className="mt-2 text-[13px] leading-6 text-[#617586]">
          {t.categoriesDescription}
        </p>
      </div>

      <nav
        aria-label={t.categoriesTitle}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        {t.categories.map((category) => {
          const Icon = CATEGORY_ICONS[category.id];

          return (
            <a
              key={category.id}
              href={`#faq-${category.id}`}
              className={`${CARD} group flex min-h-29.5 min-w-0 flex-col items-center justify-center gap-3 p-3 text-center transition-colors hover:border-[#109b24] hover:bg-[#f6fcf6] focus-visible:outline-2 focus-visible:outline-[#109b24]`}
            >
              <Icon
                size={29}
                strokeWidth={1.8}
                className="text-[#109b24]"
                aria-hidden="true"
              />

              <span className="text-[12px] leading-5 font-extrabold text-[#102b39]">
                {category.title}
              </span>

              <ChevronRight
                size={16}
                className="text-[#819789] transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          );
        })}
      </nav>
    </section>
  );
}

// ============================================================
// 11. UNE QUESTION INTERACTIVE
// ============================================================

function FAQQuestionItem({
  question,
  index,
}: {
  question: FAQQuestion;
  index: number;
}) {
  return (
    <details
      className="group min-w-0 overflow-hidden rounded-xl border border-[#dce6ed] bg-white transition-colors open:border-[#b9dfb9]"
      open={index === 0}
    >
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-left text-[13px] leading-6 font-extrabold text-[#102b39] transition-colors hover:bg-[#f7fbf7] focus-visible:outline-2 focus-visible:outline-[#109b24] sm:px-5 sm:text-[14px] [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">{question.question}</span>

        <ChevronDown
          size={20}
          className="shrink-0 text-[#102b39] transition-transform group-open:rotate-180 group-open:text-[#109b24]"
          aria-hidden="true"
        />
      </summary>

      <div className="mx-3 mb-3 rounded-lg bg-[#edf9ea] px-4 py-1 sm:mx-4 sm:mb-2">
        <p className="text-[12px] leading-6 text-[#294b3a] sm:text-[13px]">
          {question.answer}
        </p>
      </div>
    </details>
  );
}

// ============================================================
// 12. UNE SECTION FAQ
// ============================================================

function FAQSection({ category }: { category: FAQCategory }) {
  const Icon = CATEGORY_ICONS[category.id];

  return (
    <section
      id={`faq-${category.id}`}
      className={`${CARD} scroll-mt-24 p-3 sm:p-4`}
    >
      <div className="mb-2 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
          <Icon size={26} aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <h3 className="text-[19px] font-black tracking-tight text-[#102b39] sm:text-[22px]">
            {category.title}
          </h3>

          <p className="mt-1 text-[12px] leading-5 text-[#617586]">
            {category.description}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {category.questions.map((question, index) => (
          <FAQQuestionItem
            key={`${category.id}-${index}`}
            question={question}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 13. TOUTES LES QUESTIONS
// ============================================================

function FAQQuestions({ t }: { t: FAQTexts }) {
  return (
    <section id="questions" className="scroll-mt-24 py-1 lg:py-1">
      <div className="mb-2 flex items-start gap-3">
        <CircleHelp
          size={32}
          className="mt-0.5 shrink-0 text-[#109b24]"
          aria-hidden="true"
        />

        <div>
          <h2 className={SECTION_TITLE}>{t.allQuestions}</h2>

          <p className="mt-2 text-[13px] leading-6 text-[#617586]">
            {t.categoriesDescription}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-2">
        {t.categories.map((category) => (
          <FAQSection key={category.id} category={category} />
        ))}
      </div>

      <p className="mt-3 flex items-start gap-2 rounded-xl border border-[#dce6ed] bg-[#f8fafb] p-3 text-[12px] leading-6 text-[#526879]">
        <ShieldCheck
          size={19}
          className="mt-0.5 shrink-0 text-[#109b24]"
          aria-hidden="true"
        />

        {t.disclaimer}
      </p>
    </section>
  );
}

// ============================================================
// 14. INFORMATIONS DE CONTACT
// ============================================================

function FAQContact({ locale, t }: { locale: Locale; t: FAQTexts }) {
  const contacts = [
    {
      label: t.emailOrders,
      value: EMAIL_ORDERS,
      href: `mailto:${EMAIL_ORDERS}`,
      icon: Mail,
    },
    {
      label: t.emailGeneral,
      value: EMAIL_GENERAL,
      href: `mailto:${EMAIL_GENERAL}`,
      icon: Mail,
    },
    {
      label: t.whatsappGermany,
      value: PHONE_DE,
      href: WHATSAPP_DE,
      icon: MessageCircle,
    },
    {
      label: t.whatsappFrance,
      value: PHONE_FR,
      href: WHATSAPP_FR,
      icon: MessageCircle,
    },
  ];

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
            <h2 className={SECTION_TITLE}>{t.helpTitle}</h2>

            <p className="mt-2 max-w-190 text-[13px] leading-6 text-[#617586]">
              {t.helpDescription}
            </p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {contacts.map((contact) => {
            const Icon = contact.icon;

            return (
              <a
                key={contact.value}
                href={contact.href}
                target={
                  contact.href.startsWith("https:") ? "_blank" : undefined
                }
                rel={
                  contact.href.startsWith("https:")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e0e9ed] bg-[#fbfcfd] p-3 transition-colors hover:border-[#109b24] hover:bg-[#f8fdf8]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eaf8e9] text-[#109b24]">
                  <Icon size={23} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-extrabold text-[#102b39]">
                    {contact.label}
                  </p>

                  <p className="mt-1 break-all text-[12px] font-medium text-[#52697b] sm:text-[13px]">
                    {contact.value}
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-[#109b24]"
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link href={`/${locale}/contact`} className={GREEN_BUTTON}>
            <Mail size={18} />
            {t.contactPage}
            <ArrowRight size={17} />
          </Link>

          <Link
            href={`/${locale}/service-client`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#b6c7d2] px-5 py-3 text-[13px] font-bold text-[#102b39] transition-colors hover:bg-[#f4f8fa] sm:text-sm"
          >
            <Headphones size={18} />
            {t.customerService}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 15. LIENS UTILES
// ============================================================

function FAQUsefulLinks({ locale, t }: { locale: Locale; t: FAQTexts }) {
  const links = [
    {
      href: `/${locale}/livraison`,
      label: t.linkDelivery,
      icon: Truck,
    },
    {
      href: `/${locale}/retours-remboursements`,
      label: t.linkReturns,
      icon: RotateCcw,
    },
    {
      href: `/${locale}/conseils-guides`,
      label: t.linkGuides,
      icon: Bike,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <h2 className={`${SECTION_TITLE} mb-3`}>{t.usefulLinks}</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`${CARD} group flex min-h-18 items-center gap-3 p-3 transition-colors hover:border-[#109b24] hover:bg-[#f8fcf8]`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
              <Icon size={23} aria-hidden="true" />
            </div>

            <span className="min-w-0 flex-1 text-[13px] font-extrabold text-[#102b39]">
              {label}
            </span>

            <ChevronRight
              size={18}
              className="shrink-0 text-[#109b24] transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 16. SECTION FINALE
// ============================================================

function FAQClosing({ locale, t }: { locale: Locale; t: FAQTexts }) {
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
          <Headphones
            size={38}
            className="mx-auto mb-2 text-[#8be975]"
            aria-hidden="true"
          />

          <h2 className="mx-auto max-w-187.5 text-[24px] font-black tracking-tight text-white sm:text-[31px]">
            {t.finalTitle}
          </h2>

          <p className="mx-auto mt-2 max-w-170 text-[13px] leading-6 text-[#d5e5eb] sm:text-[14px]">
            {t.finalDescription}
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#109b24] px-6 py-3 text-[13px] font-extrabold text-white transition-colors hover:bg-[#07861b] sm:text-sm"
          >
            <Mail size={18} />
            {t.contactUs}
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 17. PAGE PRINCIPALE
// ============================================================

async function FAQPageContent({ params }: PageProps) {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return (
    <main
      data-page="faq"
      className="info-page w-full min-w-0 bg-white pb-2 text-[#102b39] lg:pb-2"
    >
      {/* Header général géré par SiteChrome */}

      <FAQBanner t={t} />

      <div className={CONTAINER}>
        <FAQBreadcrumb locale={locale} t={t} />

        <FAQHero locale={locale} t={t} />

        <FAQCategories t={t} />

        <FAQQuestions t={t} />

        <FAQContact locale={locale} t={t} />

        <FAQUsefulLinks locale={locale} t={t} />

        <FAQClosing locale={locale} t={t} />
      </div>

      {/* Footer général géré par SiteChrome */}
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA FAQ
// ============================================================

export default function FAQPage(props: Parameters<typeof FAQPageContent>[0]) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <FAQPageContent {...props} />
    </Suspense>
  );
}
