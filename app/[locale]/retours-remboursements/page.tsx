import "@/components/site/InformationPages.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AlertCircle,
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
  MessageCircle,
  Package,
  PackageCheck,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";

/**
 * ============================================================
 * CYCLORIVA — RETOURS & REMBOURSEMENTS
 * ============================================================
 *
 * Fichier :
 * app/[locale]/retours-remboursements/page.tsx
 *
 * Next.js 16 — App Router
 * TypeScript — Tailwind CSS 4 — Lucide React
 *
 * UN SEUL FICHIER
 *
 * ROUTES :
 * /fr/retours-remboursements
 * /en/retours-remboursements
 * /de/retours-remboursements
 * /it/retours-remboursements
 * /es/retours-remboursements
 *
 * ARCHITECTURE :
 * - Bandeau PC avec couverture
 * - Fil d'Ariane
 * - Introduction
 * - Informations sur les droits
 * - Procédure de demande de retour
 * - Produits endommagés ou non conformes
 * - Informations de remboursement
 * - FAQ interactive
 * - Coordonnées officielles
 * - Liens vers Contact et Service client
 *
 * IDENTITÉ :
 * Bleu marine #102b39
 * Vert       #109b24
 * Blanc
 *
 * IMPORTANT :
 * Cette page fournit des informations générales.
 * Elle ne remplace pas les CGV ni les informations
 * légales propres à chaque contrat.
 *
 * Aucun remboursement n'est lancé ici.
 * Aucune adresse de retour n'est inventée.
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

type InfoItem = {
  title: string;
  description: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type PageTexts = {
  home: string;
  pageTitle: string;
  eyebrow: string;
  metadataDescription: string;

  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  startRequest: string;
  seeFAQ: string;

  rightsTitle: string;
  rightsDescription: string;
  euTitle: string;
  euDescription: string;
  swissTitle: string;
  swissDescription: string;
  warrantyTitle: string;
  warrantyDescription: string;
  legalNote: string;

  reasonsTitle: string;
  reasonsDescription: string;
  changeMind: InfoItem;
  damaged: InfoItem;
  wrongItem: InfoItem;
  incomplete: InfoItem;

  stepsTitle: string;
  stepsDescription: string;
  steps: InfoItem[];
  returnAddressNotice: string;

  refundsTitle: string;
  refundsDescription: string;
  refundReview: InfoItem;
  refundMethod: InfoItem;
  refundTiming: InfoItem;

  guidanceTitle: string;
  guidanceDescription: string;
  guidancePoints: string[];

  faqTitle: string;
  faqDescription: string;
  faq: FAQItem[];

  helpTitle: string;
  helpDescription: string;
  salesEmailTitle: string;
  generalEmailTitle: string;
  whatsappTitle: string;
  whatsappGermany: string;
  whatsappFrance: string;
  contactButton: string;
  serviceButton: string;

  closingTitle: string;
  closingDescription: string;
  closingButton: string;

  footerNotice: string;
};

// ============================================================
// 2. CONFIGURATION
// ============================================================

const LOCALES: Locale[] = ["fr", "en", "de", "it", "es"];

function resolveLocale(raw: string): Locale {
  if (!LOCALES.includes(raw as Locale)) {
    notFound();
  }

  return raw as Locale;
}

const SALES_EMAIL = "sell@cycloriva.com";
const CONTACT_EMAIL = "contact@cycloriva.com";

const PHONE_DE = "+49 1573 0394552";
const PHONE_FR = "+33 6 58 69 41 78";

const WHATSAPP_DE = "https://wa.me/4915730394552";

const WHATSAPP_FR = "https://wa.me/33658694178";

// ============================================================
// 3. TRADUCTIONS
// ============================================================

const TEXTS: Record<Locale, PageTexts> = {
  // ==========================================================
  // FRANÇAIS
  // ==========================================================

  fr: {
    home: "Accueil",
    pageTitle: "Retours & remboursements",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    metadataDescription:
      "Informations CYCLORIVA sur la rétractation, les retours, les produits non conformes et les remboursements.",

    heroBadge: "ASSISTANCE APRÈS COMMANDE",
    heroTitle: "Un retour ou une question sur un remboursement ?",
    heroDescription:
      "Retrouvez les informations essentielles sur les demandes de retour, les droits applicables et les démarches pour contacter CYCLORIVA.",
    startRequest: "Contacter le service client",
    seeFAQ: "Consulter la FAQ",

    rightsTitle: "Comprendre vos droits",
    rightsDescription:
      "La rétractation et la prise en charge d'un produit défectueux sont deux situations différentes.",

    euTitle: "Rétractation dans l'Union européenne",
    euDescription:
      "Lorsque le droit européen de la consommation s'applique à une vente à distance, le consommateur bénéficie en principe de 14 jours après réception pour notifier sa rétractation, sans justification. Des exceptions légales existent. Les modalités et les éventuels frais directs de retour doivent être communiqués conformément au droit applicable.",

    swissTitle: "Commandes vers la Suisse",
    swissDescription:
      "Le droit suisse ne prévoit pas de droit général de rétractation pour les achats en ligne. Les droits éventuels dépendent notamment du contrat et de la loi applicable. Contactez-nous pour les informations relatives à votre commande.",

    warrantyTitle: "Produit défectueux ou non conforme",
    warrantyDescription:
      "Un produit présentant un défaut ou ne correspondant pas à la commande peut relever des garanties légales applicables. Dans l'Union européenne, une garantie légale de conformité d'au moins deux ans s'applique en principe aux ventes concernées.",

    legalNote:
      "Les règles applicables dépendent du contrat, du pays et de la nature de la demande. Les droits légaux du consommateur ne sont pas limités par cette page.",

    reasonsTitle: "Pour quelle raison nous contacter ?",
    reasonsDescription:
      "Sélectionnez la situation qui correspond à votre demande.",

    changeMind: {
      title: "Vous avez changé d'avis",
      description:
        "Consultez les conditions de rétractation applicables et informez-nous de votre décision dans les délais prévus.",
    },
    damaged: {
      title: "Produit endommagé",
      description:
        "Signalez le problème, décrivez l'état du produit et joignez des photos si cela peut aider à identifier le défaut.",
    },
    wrongItem: {
      title: "Produit non conforme",
      description:
        "Si l'article reçu ne correspond pas à la commande, communiquez-nous sa référence et les différences constatées.",
    },
    incomplete: {
      title: "Colis ou accessoires manquants",
      description:
        "Indiquez les éléments manquants et les informations figurant sur votre confirmation de commande.",
    },

    stepsTitle: "Comment effectuer une demande ?",
    stepsDescription:
      "Quatre étapes pour transmettre les informations nécessaires.",

    steps: [
      {
        title: "Préparez votre référence",
        description:
          "Retrouvez votre numéro de commande et le produit concerné.",
      },
      {
        title: "Expliquez votre demande",
        description:
          "Précisez s'il s'agit d'une rétractation, d'un défaut, d'une erreur de produit ou d'une autre difficulté.",
      },
      {
        title: "Contactez CYCLORIVA",
        description:
          "Écrivez à notre équipe en indiquant vos coordonnées et les informations utiles.",
      },
      {
        title: "Suivez les instructions adaptées",
        description:
          "Nous vous communiquerons les informations de traitement et, si nécessaire, les modalités de retour applicables.",
      },
    ],

    returnAddressNotice:
      "N'envoyez pas de produit à une adresse non confirmée. Demandez d'abord les coordonnées de retour applicables à votre dossier. Cette recommandation ne supprime aucun droit légal de rétractation.",

    refundsTitle: "Comment fonctionnent les remboursements ?",
    refundsDescription:
      "La procédure dépend du motif de retour et de la réglementation applicable.",

    refundReview: {
      title: "Examen de la demande",
      description:
        "Les informations de la commande et le motif du retour permettent de déterminer les droits et la procédure applicable.",
    },
    refundMethod: {
      title: "Mode de remboursement",
      description:
        "Lorsque la réglementation impose un remboursement, le mode de paiement initial est en principe utilisé, sauf accord valable sur un autre moyen.",
    },
    refundTiming: {
      title: "Délais de remboursement",
      description:
        "Les délais sont ceux prévus par la loi applicable. Dans le cadre du droit européen de rétractation, le remboursement doit en principe intervenir dans les 14 jours suivant la notification, sous réserve des conditions légales permettant de le différer jusqu'à la réception du bien ou de la preuve de son expédition.",
    },

    guidanceTitle: "Avant de retourner un produit",
    guidanceDescription:
      "Ces précautions facilitent l'identification et le traitement de votre demande.",

    guidancePoints: [
      "Conservez votre confirmation de commande et les informations du produit.",
      "Prenez des photos en cas de dommage ou de non-conformité.",
      "Conservez les accessoires et documents reçus avec le produit.",
      "Demandez les instructions appropriées avant toute expédition, sans laisser expirer vos délais légaux.",
    ],

    faqTitle: "Questions fréquentes",
    faqDescription: "Cliquez sur une question pour afficher sa réponse.",

    faq: [
      {
        question: "Puis-je retourner un vélo après sa réception ?",
        answer:
          "Cela dépend de la loi applicable et du motif de retour. Pour les achats à distance relevant du droit de l'Union européenne, un droit de rétractation de 14 jours s'applique généralement, sauf exceptions légales.",
      },
      {
        question: "Dois-je justifier une rétractation ?",
        answer:
          "Lorsque le droit européen de rétractation s'applique, aucune justification n'est en principe exigée. Il faut cependant notifier clairement sa décision dans le délai applicable.",
      },
      {
        question: "Qui paie les frais de retour ?",
        answer:
          "En cas de simple rétractation, les frais directs peuvent être à la charge du consommateur s'il en a été correctement informé. En cas de produit non conforme, les solutions relevant de la garantie légale doivent normalement être sans frais pour le consommateur.",
      },
      {
        question: "Que faire si mon vélo est endommagé ?",
        answer:
          "Contactez contact@cycloriva.com avec votre référence, une description du problème et, si possible, des photographies. Les droits légaux liés à la non-conformité restent applicables.",
      },
      {
        question: "Quand vais-je recevoir mon remboursement ?",
        answer:
          "Le délai dépend de la situation. Dans le cadre d'une rétractation relevant du droit de l'Union européenne, des délais légaux précis s'appliquent et un report peut être autorisé jusqu'à réception du bien ou d'une preuve de renvoi.",
      },
      {
        question: "Puis-je demander un retour depuis la Suisse ?",
        answer:
          "Vous pouvez toujours nous contacter. En Suisse, il n'existe pas de rétractation générale obligatoire pour un achat en ligne en droit interne. Le contrat et les règles éventuellement applicables à la vente déterminent vos droits.",
      },
      {
        question: "Où dois-je expédier mon produit ?",
        answer:
          "L'adresse de retour doit être communiquée pour votre dossier. Contactez CYCLORIVA avant l'envoi. Nous ne publions pas ici d'adresse logistique non confirmée.",
      },
      {
        question: "Comment contacter CYCLORIVA rapidement ?",
        answer:
          "Pour les commandes : sell@cycloriva.com. Pour les questions générales : contact@cycloriva.com. WhatsApp Allemagne : +49 1573 0394552 ; France : +33 6 58 69 41 78.",
      },
    ],

    helpTitle: "Besoin d'aide pour un retour ?",
    helpDescription:
      "Contactez notre équipe avec votre numéro de commande et une description de votre demande.",

    salesEmailTitle: "Questions sur les commandes",
    generalEmailTitle: "Retours et questions générales",
    whatsappTitle: "Nous joindre sur WhatsApp",
    whatsappGermany: "Allemagne",
    whatsappFrance: "France",
    contactButton: "Page Contact",
    serviceButton: "Service client",

    closingTitle: "CYCLORIVA vous accompagne",
    closingDescription:
      "Pour toute question sur votre commande ou sur la procédure applicable, notre page Contact reste à votre disposition.",
    closingButton: "Nous envoyer un message",

    footerNotice:
      "Cette page présente des informations générales et ne constitue pas des conditions générales de vente complètes. Les droits impératifs des consommateurs et les dispositions contractuelles valables s'appliquent.",
  },

  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    home: "Home",
    pageTitle: "Returns & Refunds",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    metadataDescription:
      "CYCLORIVA information about returns, withdrawal rights, faulty goods and refunds.",

    heroBadge: "AFTER-SALES SUPPORT",
    heroTitle: "Need to return an item or request a refund?",
    heroDescription:
      "Find practical information about return requests, applicable consumer rights and how to contact CYCLORIVA.",
    startRequest: "Contact customer service",
    seeFAQ: "Read the FAQ",

    rightsTitle: "Understanding your rights",
    rightsDescription:
      "Changing your mind and reporting a faulty product are different situations.",

    euTitle: "Withdrawal rights in the European Union",
    euDescription:
      "Where EU consumer rules apply to a distance sale, consumers generally have 14 days after receiving goods to notify the seller of withdrawal without giving a reason. Legal exceptions apply. Return procedures and any direct return costs must be disclosed as required by law.",

    swissTitle: "Orders to Switzerland",
    swissDescription:
      "Swiss domestic law does not provide a general right to withdraw from an online purchase. Rights may depend on the contract and applicable law. Contact us about your order.",

    warrantyTitle: "Faulty or non-conforming goods",
    warrantyDescription:
      "Faulty goods or goods that do not match the order may be covered by statutory remedies. EU law generally provides a minimum two-year legal guarantee of conformity for qualifying sales.",

    legalNote:
      "Applicable rules depend on the contract, country and claim. This page does not restrict mandatory consumer rights.",

    reasonsTitle: "What would you like help with?",
    reasonsDescription: "Choose the situation that matches your enquiry.",

    changeMind: {
      title: "Changed your mind",
      description:
        "Check the applicable withdrawal conditions and notify us within the relevant deadline.",
    },
    damaged: {
      title: "Damaged item",
      description: "Describe the damage and include photographs if helpful.",
    },
    wrongItem: {
      title: "Item not as described",
      description:
        "Share the product reference and explain how it differs from your order.",
    },
    incomplete: {
      title: "Missing items or accessories",
      description:
        "Tell us what is missing and include your order confirmation details.",
    },

    stepsTitle: "How to make a request",
    stepsDescription: "Four simple steps to provide the necessary information.",

    steps: [
      {
        title: "Find your order reference",
        description:
          "Locate your order number and identify the relevant product.",
      },
      {
        title: "Explain the issue",
        description:
          "Tell us whether it is withdrawal, damage, a wrong item or another concern.",
      },
      {
        title: "Contact CYCLORIVA",
        description:
          "Send your contact details and relevant information to our team.",
      },
      {
        title: "Follow the applicable instructions",
        description:
          "We will provide processing information and return arrangements where required.",
      },
    ],

    returnAddressNotice:
      "Do not send goods to an unconfirmed address. Request the appropriate return address first. This recommendation does not limit statutory withdrawal rights.",

    refundsTitle: "How refunds work",
    refundsDescription:
      "The process depends on the reason for the return and applicable law.",

    refundReview: {
      title: "Review of your request",
      description:
        "Order details and the reason for return help identify the relevant rights and procedure.",
    },
    refundMethod: {
      title: "Refund method",
      description:
        "Where legally required, refunds generally use the original payment method unless another method is validly agreed.",
    },
    refundTiming: {
      title: "Refund timing",
      description:
        "Legal deadlines depend on the situation. Under EU withdrawal rules, reimbursement is generally due within 14 days of notification, subject to lawful postponement until goods or proof of return are received.",
    },

    guidanceTitle: "Before returning an item",
    guidanceDescription: "These steps can make handling your request easier.",

    guidancePoints: [
      "Keep your order confirmation and product information.",
      "Take photographs if an item is damaged or incorrect.",
      "Keep the accessories and documents supplied with the item.",
      "Request appropriate return instructions without missing statutory deadlines.",
    ],

    faqTitle: "Frequently asked questions",
    faqDescription: "Select a question to reveal the answer.",

    faq: [
      {
        question: "Can I return a bicycle after receiving it?",
        answer:
          "It depends on the applicable law and reason. EU distance purchases generally carry a 14-day withdrawal right, subject to legal exceptions.",
      },
      {
        question: "Do I need to explain why I am withdrawing?",
        answer:
          "Where EU withdrawal rules apply, you generally do not need to give a reason, but you must clearly notify your decision within the relevant period.",
      },
      {
        question: "Who pays return shipping?",
        answer:
          "For a change-of-mind return, direct return costs may be borne by the consumer if properly disclosed. Statutory remedies for faulty goods should normally be provided without cost to the consumer.",
      },
      {
        question: "What if my bicycle arrives damaged?",
        answer:
          "Email contact@cycloriva.com with the order reference, details and photographs if possible. Your statutory rights remain applicable.",
      },
      {
        question: "When will I be refunded?",
        answer:
          "It depends on the claim. Under EU withdrawal rules, specific deadlines apply, with lawful postponement possible until goods or proof of dispatch are received.",
      },
      {
        question: "Can I request a return from Switzerland?",
        answer:
          "You can contact us. Swiss domestic law does not generally require withdrawal rights for online purchases; contract terms and other applicable law may affect your rights.",
      },
      {
        question: "Where should I send my return?",
        answer:
          "Contact CYCLORIVA for the correct return address for your case. No unverified warehouse address is published here.",
      },
      {
        question: "How can I contact CYCLORIVA?",
        answer:
          "Orders: sell@cycloriva.com. General enquiries: contact@cycloriva.com. WhatsApp Germany: +49 1573 0394552; France: +33 6 58 69 41 78.",
      },
    ],

    helpTitle: "Need help with a return?",
    helpDescription:
      "Contact our team with your order number and a description of your request.",

    salesEmailTitle: "Order enquiries",
    generalEmailTitle: "Returns and general enquiries",
    whatsappTitle: "WhatsApp contact",
    whatsappGermany: "Germany",
    whatsappFrance: "France",
    contactButton: "Contact page",
    serviceButton: "Customer service",

    closingTitle: "CYCLORIVA is here to help",
    closingDescription:
      "For questions about an order or applicable return procedure, contact our team.",
    closingButton: "Send us a message",

    footerNotice:
      "This page provides general information and is not a complete set of terms of sale. Mandatory consumer rights and valid contractual terms apply.",
  },

  // ==========================================================
  // DEUTSCH
  // ==========================================================

  de: {
    home: "Startseite",
    pageTitle: "Rückgabe & Erstattung",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    metadataDescription:
      "CYCLORIVA Informationen über Widerruf, Rückgaben, mangelhafte Waren und Erstattungen.",

    heroBadge: "KUNDENSERVICE NACH DEM KAUF",
    heroTitle: "Sie möchten einen Artikel zurückgeben?",
    heroDescription:
      "Hier finden Sie Informationen zu Rückgaben, gesetzlichen Rechten und Kontaktmöglichkeiten.",
    startRequest: "Kundenservice kontaktieren",
    seeFAQ: "FAQ ansehen",

    rightsTitle: "Ihre Rechte verstehen",
    rightsDescription:
      "Widerruf und Reklamation mangelhafter Waren sind unterschiedliche Vorgänge.",

    euTitle: "Widerrufsrecht in der Europäischen Union",
    euDescription:
      "Wenn EU-Verbraucherrecht auf einen Fernabsatzvertrag anwendbar ist, besteht grundsätzlich ein Widerrufsrecht von 14 Tagen ab Erhalt der Ware, ohne Angabe von Gründen. Gesetzliche Ausnahmen gelten. Rücksendebedingungen und gegebenenfalls direkte Rücksendekosten müssen gesetzeskonform mitgeteilt werden.",

    swissTitle: "Bestellungen in die Schweiz",
    swissDescription:
      "Das schweizerische Recht kennt kein allgemeines Widerrufsrecht für Online-Käufe. Vertrag und anwendbares Recht können weitere Rechte vorsehen. Fragen Sie uns zu Ihrer Bestellung.",

    warrantyTitle: "Mangelhafte oder nicht vertragsgemäße Ware",
    warrantyDescription:
      "Bei Mängeln oder Abweichungen von der Bestellung können gesetzliche Ansprüche bestehen. Nach EU-Recht gilt für entsprechende Verkäufe grundsätzlich eine gesetzliche Gewährleistung von mindestens zwei Jahren.",

    legalNote:
      "Die anwendbaren Regeln hängen von Vertrag, Land und Anliegen ab. Gesetzlich zwingende Verbraucherrechte bleiben unberührt.",

    reasonsTitle: "Wobei benötigen Sie Hilfe?",
    reasonsDescription: "Wählen Sie die passende Situation.",

    changeMind: {
      title: "Sie haben Ihre Meinung geändert",
      description:
        "Prüfen Sie das anwendbare Widerrufsrecht und informieren Sie uns fristgerecht.",
    },
    damaged: {
      title: "Beschädigter Artikel",
      description:
        "Beschreiben Sie den Schaden und fügen Sie möglichst Fotos hinzu.",
    },
    wrongItem: {
      title: "Falscher oder abweichender Artikel",
      description:
        "Nennen Sie die Produktreferenz und beschreiben Sie die Abweichung.",
    },
    incomplete: {
      title: "Fehlende Artikel oder Zubehörteile",
      description:
        "Teilen Sie uns mit, was fehlt, und nennen Sie Ihre Bestelldaten.",
    },

    stepsTitle: "So stellen Sie eine Anfrage",
    stepsDescription: "Vier Schritte zur Bearbeitung Ihres Anliegens.",

    steps: [
      {
        title: "Bestellnummer bereithalten",
        description:
          "Suchen Sie die Bestellnummer und das betroffene Produkt heraus.",
      },
      {
        title: "Anliegen beschreiben",
        description:
          "Geht es um Widerruf, Beschädigung, einen falschen Artikel oder ein anderes Problem?",
      },
      {
        title: "CYCLORIVA kontaktieren",
        description:
          "Senden Sie Ihre Kontaktdaten und die wichtigen Informationen.",
      },
      {
        title: "Anweisungen beachten",
        description:
          "Wir informieren über die Bearbeitung und erforderliche Rücksendemodalitäten.",
      },
    ],

    returnAddressNotice:
      "Senden Sie keine Ware an eine unbestätigte Adresse. Fragen Sie zunächst nach der richtigen Rücksendeadresse. Gesetzliche Widerrufsrechte bleiben unberührt.",

    refundsTitle: "So funktionieren Erstattungen",
    refundsDescription:
      "Das Verfahren hängt vom Rückgabegrund und geltendem Recht ab.",

    refundReview: {
      title: "Prüfung Ihrer Anfrage",
      description:
        "Bestelldaten und Rückgabegrund helfen bei der Klärung der Ansprüche.",
    },
    refundMethod: {
      title: "Erstattungsweg",
      description:
        "Soweit gesetzlich vorgeschrieben, erfolgt die Erstattung grundsätzlich über das ursprüngliche Zahlungsmittel, sofern nichts anderes wirksam vereinbart wurde.",
    },
    refundTiming: {
      title: "Erstattungsfristen",
      description:
        "Die gesetzlichen Fristen richten sich nach dem Fall. Beim EU-Widerruf muss grundsätzlich innerhalb von 14 Tagen nach der Mitteilung erstattet werden; ein gesetzlich zulässiger Aufschub bis zum Erhalt der Ware oder Rücksendenachweis ist möglich.",
    },

    guidanceTitle: "Vor der Rücksendung",
    guidanceDescription: "Diese Hinweise erleichtern die Bearbeitung.",

    guidancePoints: [
      "Bewahren Sie Bestellbestätigung und Produktdaten auf.",
      "Fotografieren Sie Beschädigungen oder Abweichungen.",
      "Bewahren Sie erhaltenes Zubehör und Unterlagen auf.",
      "Erfragen Sie Rücksendeinformationen rechtzeitig, ohne gesetzliche Fristen zu versäumen.",
    ],

    faqTitle: "Häufig gestellte Fragen",
    faqDescription: "Klicken Sie auf eine Frage, um die Antwort zu öffnen.",

    faq: [
      {
        question: "Kann ich ein Fahrrad zurückgeben?",
        answer:
          "Das hängt vom anwendbaren Recht und dem Grund ab. Bei Fernabsatzkäufen unter EU-Recht besteht grundsätzlich ein 14-tägiges Widerrufsrecht, vorbehaltlich gesetzlicher Ausnahmen.",
      },
      {
        question: "Muss ich meinen Widerruf begründen?",
        answer:
          "Wenn das EU-Widerrufsrecht anwendbar ist, müssen Sie grundsätzlich keinen Grund angeben. Die Erklärung muss aber rechtzeitig und eindeutig erfolgen.",
      },
      {
        question: "Wer trägt die Rücksendekosten?",
        answer:
          "Bei einem Widerruf können direkte Rücksendekosten bei ordnungsgemäßer Vorabinformation vom Verbraucher getragen werden. Gesetzliche Abhilfe bei Mängeln muss grundsätzlich kostenlos erfolgen.",
      },
      {
        question: "Was tun bei einem beschädigten Fahrrad?",
        answer:
          "Schreiben Sie mit Bestellnummer, Beschreibung und möglichst Fotos an contact@cycloriva.com. Gesetzliche Rechte bleiben bestehen.",
      },
      {
        question: "Wann wird der Betrag erstattet?",
        answer:
          "Das hängt vom Fall ab. Beim EU-Widerruf gelten gesetzliche Fristen und mögliche Aufschubregelungen bis zum Wareneingang oder Rücksendenachweis.",
      },
      {
        question: "Ist eine Rückgabe aus der Schweiz möglich?",
        answer:
          "Kontaktieren Sie uns. Das schweizerische Recht kennt für Online-Käufe kein allgemeines Widerrufsrecht. Vertragliche Regelungen und anderes anwendbares Recht können relevant sein.",
      },
      {
        question: "An welche Adresse soll ich zurücksenden?",
        answer:
          "Bitte fragen Sie CYCLORIVA nach der für Ihren Fall gültigen Rücksendeadresse.",
      },
      {
        question: "Wie erreiche ich CYCLORIVA?",
        answer:
          "Bestellungen: sell@cycloriva.com. Allgemeine Fragen: contact@cycloriva.com. WhatsApp: +49 1573 0394552 oder +33 6 58 69 41 78.",
      },
    ],

    helpTitle: "Hilfe bei einer Rückgabe?",
    helpDescription:
      "Kontaktieren Sie uns mit Ihrer Bestellnummer und einer Beschreibung.",

    salesEmailTitle: "Fragen zu Bestellungen",
    generalEmailTitle: "Rückgaben und allgemeine Fragen",
    whatsappTitle: "Kontakt über WhatsApp",
    whatsappGermany: "Deutschland",
    whatsappFrance: "Frankreich",
    contactButton: "Kontaktseite",
    serviceButton: "Kundenservice",

    closingTitle: "CYCLORIVA hilft Ihnen weiter",
    closingDescription:
      "Bei Fragen zur Bestellung oder Rückgabe erreichen Sie unser Team über die Kontaktseite.",
    closingButton: "Nachricht senden",

    footerNotice:
      "Diese Seite enthält allgemeine Informationen und keine vollständigen Verkaufsbedingungen. Zwingende Verbraucherrechte und wirksame Vertragsbedingungen gelten.",
  },

  // ==========================================================
  // ITALIANO
  // ==========================================================

  it: {
    home: "Home",
    pageTitle: "Resi e rimborsi",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    metadataDescription:
      "Informazioni CYCLORIVA sul recesso, sui resi, sui prodotti difettosi e sui rimborsi.",

    heroBadge: "ASSISTENZA POST-VENDITA",
    heroTitle: "Vuoi restituire un prodotto?",
    heroDescription:
      "Scopri come richiedere un reso, quali diritti possono applicarsi e come contattare CYCLORIVA.",
    startRequest: "Contatta l'assistenza",
    seeFAQ: "Consulta le FAQ",

    rightsTitle: "Conosci i tuoi diritti",
    rightsDescription:
      "Il ripensamento e la segnalazione di un difetto sono situazioni diverse.",

    euTitle: "Recesso nell'Unione europea",
    euDescription:
      "Quando si applicano le norme UE ai contratti a distanza, il consumatore dispone generalmente di 14 giorni dal ricevimento per comunicare il recesso senza motivazione. Esistono eccezioni previste dalla legge. Le condizioni e gli eventuali costi diretti del reso devono essere comunicati correttamente.",

    swissTitle: "Ordini destinati alla Svizzera",
    swissDescription:
      "La legge svizzera non riconosce un diritto generale di recesso per gli acquisti online. I diritti possono dipendere dal contratto e dalla legge applicabile.",

    warrantyTitle: "Prodotto difettoso o non conforme",
    warrantyDescription:
      "Per prodotti difettosi o diversi da quanto ordinato possono essere previsti rimedi legali. Nell'UE si applica generalmente una garanzia legale di conformità di almeno due anni per le vendite interessate.",

    legalNote:
      "Le regole dipendono dal contratto, dal paese e dal caso. I diritti inderogabili dei consumatori restano tutelati.",

    reasonsTitle: "Perché desideri contattarci?",
    reasonsDescription:
      "Scegli la situazione che corrisponde alla tua richiesta.",

    changeMind: {
      title: "Hai cambiato idea",
      description:
        "Verifica le condizioni di recesso applicabili e comunicaci la tua decisione entro i termini.",
    },
    damaged: {
      title: "Prodotto danneggiato",
      description: "Descrivi il danno e allega fotografie, se utili.",
    },
    wrongItem: {
      title: "Prodotto non conforme",
      description:
        "Indica il riferimento del prodotto e le differenze riscontrate.",
    },
    incomplete: {
      title: "Articoli o accessori mancanti",
      description:
        "Comunica gli elementi mancanti insieme ai dati dell'ordine.",
    },

    stepsTitle: "Come inviare una richiesta",
    stepsDescription:
      "Quattro passaggi per comunicare le informazioni necessarie.",

    steps: [
      {
        title: "Prepara il numero d'ordine",
        description:
          "Recupera il riferimento e identifica il prodotto interessato.",
      },
      {
        title: "Descrivi la richiesta",
        description:
          "Specifica se riguarda recesso, danni, prodotto errato o altro.",
      },
      {
        title: "Contatta CYCLORIVA",
        description: "Invia i tuoi recapiti e tutte le informazioni utili.",
      },
      {
        title: "Segui le indicazioni",
        description:
          "Ti forniremo informazioni sulla gestione e sulle modalità di reso applicabili.",
      },
    ],

    returnAddressNotice:
      "Non spedire prodotti a un indirizzo non confermato. Richiedi prima quello corretto. Questa indicazione non limita i diritti di recesso previsti dalla legge.",

    refundsTitle: "Come funzionano i rimborsi",
    refundsDescription:
      "La procedura dipende dal motivo del reso e dalla legge applicabile.",

    refundReview: {
      title: "Esame della richiesta",
      description:
        "I dati dell'ordine e il motivo del reso aiutano a determinare la procedura.",
    },
    refundMethod: {
      title: "Metodo di rimborso",
      description:
        "Quando previsto dalla legge, viene generalmente utilizzato il metodo di pagamento originale, salvo diverso accordo valido.",
    },
    refundTiming: {
      title: "Tempi di rimborso",
      description:
        "Dipendono dalle norme applicabili. Nel recesso UE, il rimborso è generalmente dovuto entro 14 giorni dalla comunicazione, salvo il rinvio consentito fino alla ricezione dei beni o della prova di spedizione.",
    },

    guidanceTitle: "Prima di restituire un prodotto",
    guidanceDescription: "Alcuni accorgimenti utili per la gestione.",

    guidancePoints: [
      "Conserva la conferma dell'ordine e i dettagli del prodotto.",
      "Scatta fotografie in caso di danni o non conformità.",
      "Conserva accessori e documenti ricevuti.",
      "Richiedi le istruzioni di reso senza superare i termini di legge.",
    ],

    faqTitle: "Domande frequenti",
    faqDescription: "Seleziona una domanda per vedere la risposta.",

    faq: [
      {
        question: "Posso restituire una bicicletta?",
        answer:
          "Dipende dalla legge applicabile e dal motivo. Per gli acquisti a distanza soggetti alle norme UE, generalmente si applica un diritto di recesso di 14 giorni, salvo eccezioni.",
      },
      {
        question: "Devo spiegare il motivo del recesso?",
        answer:
          "Quando si applica il diritto UE, generalmente non è richiesta una motivazione, ma occorre comunicare chiaramente la decisione entro il termine.",
      },
      {
        question: "Chi paga le spese di restituzione?",
        answer:
          "Nel recesso per ripensamento, i costi diretti possono essere a carico del consumatore se comunicati correttamente. I rimedi legali per difetti devono normalmente essere gratuiti.",
      },
      {
        question: "Cosa fare se la bicicletta arriva danneggiata?",
        answer:
          "Scrivi a contact@cycloriva.com con numero d'ordine, descrizione e, se possibile, foto. Restano validi i diritti di legge.",
      },
      {
        question: "Quando riceverò il rimborso?",
        answer:
          "Dipende dalla situazione. Per il recesso UE si applicano termini di legge e possibili rinvii fino alla ricezione dei beni o della prova di restituzione.",
      },
      {
        question: "Posso chiedere un reso dalla Svizzera?",
        answer:
          "Contattaci. La legge svizzera non prevede un diritto generale di recesso per gli acquisti online; possono rilevare il contratto e altre leggi applicabili.",
      },
      {
        question: "Dove devo spedire il prodotto?",
        answer:
          "Richiedi a CYCLORIVA l'indirizzo di reso corretto per il tuo caso.",
      },
      {
        question: "Come posso contattare CYCLORIVA?",
        answer:
          "Ordini: sell@cycloriva.com. Domande generali: contact@cycloriva.com. WhatsApp: +49 1573 0394552 o +33 6 58 69 41 78.",
      },
    ],

    helpTitle: "Hai bisogno di aiuto per un reso?",
    helpDescription:
      "Contattaci con il numero dell'ordine e una descrizione della richiesta.",

    salesEmailTitle: "Informazioni sugli ordini",
    generalEmailTitle: "Resi e domande generali",
    whatsappTitle: "Contatto WhatsApp",
    whatsappGermany: "Germania",
    whatsappFrance: "Francia",
    contactButton: "Pagina Contatti",
    serviceButton: "Servizio clienti",

    closingTitle: "CYCLORIVA è a tua disposizione",
    closingDescription:
      "Per informazioni sull'ordine o sui resi, puoi contattare il nostro team.",
    closingButton: "Invia un messaggio",

    footerNotice:
      "Questa pagina contiene informazioni generali e non costituisce condizioni di vendita complete. Restano validi i diritti inderogabili e le condizioni contrattuali applicabili.",
  },

  // ==========================================================
  // ESPAÑOL
  // ==========================================================

  es: {
    home: "Inicio",
    pageTitle: "Devoluciones y reembolsos",
    eyebrow: "BICICLETAS & MOVILIDAD ELÉCTRICA EN EUROPA",
    metadataDescription:
      "Información CYCLORIVA sobre desistimiento, devoluciones, productos defectuosos y reembolsos.",

    heroBadge: "ASISTENCIA POSVENTA",
    heroTitle: "¿Necesitas devolver un producto?",
    heroDescription:
      "Consulta cómo solicitar una devolución, tus posibles derechos y cómo contactar con CYCLORIVA.",
    startRequest: "Contactar con atención al cliente",
    seeFAQ: "Consultar preguntas frecuentes",

    rightsTitle: "Conoce tus derechos",
    rightsDescription:
      "Cambiar de opinión y reclamar por un defecto son situaciones diferentes.",

    euTitle: "Desistimiento en la Unión Europea",
    euDescription:
      "Cuando las normas de consumo de la UE se aplican a una compra a distancia, el consumidor dispone generalmente de 14 días desde la recepción para comunicar el desistimiento sin justificarlo. Existen excepciones legales. Las condiciones y los posibles costes directos de devolución deben informarse conforme a la ley.",

    swissTitle: "Pedidos a Suiza",
    swissDescription:
      "El derecho suizo no establece un derecho general de desistimiento en compras online. Los derechos pueden depender del contrato y de la legislación aplicable.",

    warrantyTitle: "Producto defectuoso o no conforme",
    warrantyDescription:
      "Los productos defectuosos o distintos de lo pedido pueden estar protegidos por garantías legales. En la UE suele aplicarse una garantía legal de conformidad mínima de dos años para las ventas correspondientes.",

    legalNote:
      "Las reglas dependen del contrato, el país y la reclamación. Esta página no limita los derechos obligatorios del consumidor.",

    reasonsTitle: "¿Por qué deseas contactar?",
    reasonsDescription: "Elige la situación que corresponde a tu consulta.",

    changeMind: {
      title: "Has cambiado de opinión",
      description:
        "Consulta las condiciones de desistimiento aplicables y comunica tu decisión dentro del plazo.",
    },
    damaged: {
      title: "Producto dañado",
      description: "Describe el daño y adjunta fotografías si pueden ayudar.",
    },
    wrongItem: {
      title: "Producto no conforme",
      description:
        "Indica la referencia y las diferencias respecto a tu pedido.",
    },
    incomplete: {
      title: "Faltan productos o accesorios",
      description:
        "Indica qué elementos faltan e incluye los datos del pedido.",
    },

    stepsTitle: "Cómo enviar una solicitud",
    stepsDescription: "Cuatro pasos para facilitar los datos necesarios.",

    steps: [
      {
        title: "Prepara la referencia",
        description: "Busca tu número de pedido e identifica el producto.",
      },
      {
        title: "Explica el motivo",
        description:
          "Indica si es desistimiento, daño, error de producto u otro problema.",
      },
      {
        title: "Contacta con CYCLORIVA",
        description: "Envía tus datos de contacto y la información relevante.",
      },
      {
        title: "Sigue las instrucciones",
        description:
          "Te informaremos sobre la gestión y las condiciones de devolución aplicables.",
      },
    ],

    returnAddressNotice:
      "No envíes productos a una dirección no confirmada. Solicita primero la dirección correcta. Esta recomendación no limita los derechos legales de desistimiento.",

    refundsTitle: "Cómo funcionan los reembolsos",
    refundsDescription:
      "El procedimiento depende del motivo y de la ley aplicable.",

    refundReview: {
      title: "Revisión de la solicitud",
      description:
        "Los datos del pedido y el motivo ayudan a determinar el procedimiento.",
    },
    refundMethod: {
      title: "Método de reembolso",
      description:
        "Cuando la ley lo exige, generalmente se utiliza el método de pago original, salvo acuerdo válido en contrario.",
    },
    refundTiming: {
      title: "Plazos de reembolso",
      description:
        "Dependen de la normativa aplicable. Bajo las reglas de desistimiento de la UE, generalmente se reembolsa en 14 días desde la notificación, con posibles aplazamientos legales hasta recibir los bienes o una prueba de devolución.",
    },

    guidanceTitle: "Antes de devolver un producto",
    guidanceDescription: "Recomendaciones para facilitar la gestión.",

    guidancePoints: [
      "Conserva la confirmación del pedido y los datos del producto.",
      "Haz fotografías en caso de daño o falta de conformidad.",
      "Conserva los accesorios y documentos recibidos.",
      "Solicita instrucciones de devolución sin dejar pasar los plazos legales.",
    ],

    faqTitle: "Preguntas frecuentes",
    faqDescription: "Selecciona una pregunta para ver su respuesta.",

    faq: [
      {
        question: "¿Puedo devolver una bicicleta?",
        answer:
          "Depende de la ley aplicable y el motivo. Las compras a distancia sujetas a las normas de la UE suelen contar con 14 días de desistimiento, salvo excepciones.",
      },
      {
        question: "¿Debo justificar el desistimiento?",
        answer:
          "Cuando se aplican las normas de la UE, generalmente no es necesario justificarlo, pero debes comunicar claramente tu decisión dentro del plazo.",
      },
      {
        question: "¿Quién paga los gastos de devolución?",
        answer:
          "En devoluciones por cambio de opinión, los costes directos pueden corresponder al consumidor si se informaron correctamente. Los remedios legales por defectos normalmente deben ser gratuitos.",
      },
      {
        question: "¿Qué hago si la bicicleta llega dañada?",
        answer:
          "Escribe a contact@cycloriva.com con número de pedido, descripción y fotos si es posible. Tus derechos legales siguen siendo aplicables.",
      },
      {
        question: "¿Cuándo recibiré el reembolso?",
        answer:
          "Depende del caso. Para desistimientos de la UE existen plazos legales y posibles aplazamientos hasta recibir los bienes o la prueba de envío.",
      },
      {
        question: "¿Puedo solicitar una devolución desde Suiza?",
        answer:
          "Puedes consultarnos. La ley suiza no establece un desistimiento general para compras online; pueden resultar relevantes el contrato y otras leyes aplicables.",
      },
      {
        question: "¿A qué dirección envío el producto?",
        answer:
          "Solicita a CYCLORIVA la dirección de devolución correspondiente a tu caso.",
      },
      {
        question: "¿Cómo contacto con CYCLORIVA?",
        answer:
          "Pedidos: sell@cycloriva.com. Consultas generales: contact@cycloriva.com. WhatsApp: +49 1573 0394552 o +33 6 58 69 41 78.",
      },
    ],

    helpTitle: "¿Necesitas ayuda con una devolución?",
    helpDescription:
      "Contacta con nuestro equipo e indica el número de pedido y tu solicitud.",

    salesEmailTitle: "Consultas sobre pedidos",
    generalEmailTitle: "Devoluciones y consultas generales",
    whatsappTitle: "Contacto WhatsApp",
    whatsappGermany: "Alemania",
    whatsappFrance: "Francia",
    contactButton: "Página de contacto",
    serviceButton: "Atención al cliente",

    closingTitle: "CYCLORIVA está para ayudarte",
    closingDescription:
      "Para dudas sobre pedidos o devoluciones, contacta con nuestro equipo.",
    closingButton: "Enviar un mensaje",

    footerNotice:
      "Esta página ofrece información general y no constituye condiciones de venta completas. Se aplican los derechos obligatorios del consumidor y las condiciones contractuales válidas.",
  },
};

// ============================================================
// 4. STYLES COMMUNS
// ============================================================

const CONTAINER = "mx-auto w-full max-w-none " + "px-4 sm:px-6 lg:px-6 xl:px-8";

const CARD =
  "min-w-0 rounded-2xl border border-[#dce5eb] " +
  "bg-white shadow-[0_3px_15px_rgba(16,43,57,0.045)]";

const SECTION_TITLE =
  "text-[23px] font-black tracking-tight " +
  "text-[#102b39] sm:text-[29px] lg:text-[31px]";

const BUTTON_GREEN =
  "inline-flex min-h-12 items-center justify-center " +
  "gap-2 rounded-lg bg-[#078e1d] px-5 py-3 " +
  "text-center text-[13px] font-extrabold text-white " +
  "transition-colors hover:bg-[#067719] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[#109b24] sm:text-sm";

const BUTTON_OUTLINE =
  "inline-flex min-h-12 items-center justify-center " +
  "gap-2 rounded-lg border border-[#b4c5cf] " +
  "bg-white px-5 py-3 text-center text-[13px] " +
  "font-bold text-[#102b39] transition-colors " +
  "hover:bg-[#f4f8fa] sm:text-sm";

// ============================================================
// 5. MÉTADONNÉES SEO
// ============================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return {
    title: `${t.pageTitle} | CYCLORIVA`,
    description: t.metadataDescription,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      languages: {
        fr: "/fr/retours-remboursements",
        en: "/en/retours-remboursements",
        de: "/de/retours-remboursements",
        it: "/it/retours-remboursements",
        es: "/es/retours-remboursements",
        "x-default": "/fr/retours-remboursements",
      },
    },

    openGraph: {
      images: [{ url: "/images/imager.png", width: 1536, height: 1024, alt: "CYCLORIVA" }],
      type: "website",
      title: `${t.pageTitle} | CYCLORIVA`,
      description: t.metadataDescription,
    },
  };
}

// ============================================================
// 6. BANDEAU PC
// ============================================================

function ReturnsBanner({ t }: { t: PageTexts }) {
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
// 7. FIL D'ARIANE
// ============================================================

function ReturnsBreadcrumb({ locale, t }: { locale: Locale; t: PageTexts }) {
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
        {t.pageTitle}
      </span>
    </nav>
  );
}

// ============================================================
// 8. INTRODUCTION
// ============================================================

function ReturnsHero({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <section className="grid min-w-0 items-center gap-3 py-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-3 lg:py-1">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-2 text-[11px] font-extrabold text-[#078d21]">
          <RotateCcw size={17} aria-hidden="true" />
          {t.heroBadge}
        </span>

        <h2 className="mt-2 max-w-180 text-[30px] leading-[1.13] font-black tracking-tight text-[#102b39] sm:text-[40px] lg:text-[45px]">
          {t.heroTitle}
        </h2>

        <p className="mt-2 max-w-157.5 text-[14px] leading-7 text-[#536c7b] sm:text-[15px]">
          {t.heroDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link href={`/${locale}/contact`} className={BUTTON_GREEN}>
            <Mail size={18} />
            {t.startRequest}
            <ArrowRight size={17} />
          </Link>

          <a href="#faq" className={BUTTON_OUTLINE}>
            <CircleHelp size={18} />
            {t.seeFAQ}
          </a>
        </div>
      </div>

      <div className={`${CARD} overflow-hidden`}>
        <div
          className="relative min-h-44 bg-[#0b3044] bg-cover bg-center sm:min-h-72.5 lg:min-h-64"
          style={{
            backgroundImage: "url('/images/accueil.png')",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-[#092639]/85 via-transparent to-transparent"
          />

          <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-xl border border-white/20 bg-[#102b39]/85 p-3 backdrop-blur-sm">
            <RotateCcw
              size={29}
              className="shrink-0 text-[#8de87a]"
              aria-hidden="true"
            />

            <div>
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
// 9. INFORMATIONS SUR LES DROITS
// ============================================================

function ReturnsRights({ t }: { t: PageTexts }) {
  const rights = [
    {
      icon: Clock3,
      title: t.euTitle,
      description: t.euDescription,
    },
    {
      icon: FileText,
      title: t.swissTitle,
      description: t.swissDescription,
    },
    {
      icon: ShieldCheck,
      title: t.warrantyTitle,
      description: t.warrantyDescription,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2">
        <h2 className={SECTION_TITLE}>{t.rightsTitle}</h2>

        <p className="mt-2 max-w-190 text-[13px] leading-6 text-[#617586]">
          {t.rightsDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {rights.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className={`${CARD} p-3 sm:p-4`}>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                <Icon size={27} strokeWidth={1.8} aria-hidden="true" />
              </div>

              <h3 className="text-[16px] font-extrabold leading-6 text-[#102b39]">
                {item.title}
              </h3>

              <p className="mt-3 text-[12px] leading-6 text-[#526979] sm:text-[13px]">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>

      <p className="mt-2 flex items-start gap-2 rounded-xl border border-[#dae7ee] bg-[#f7fafc] p-3 text-[12px] leading-6 text-[#536a7a]">
        <BadgeCheck
          size={20}
          className="mt-0.5 shrink-0 text-[#109b24]"
          aria-hidden="true"
        />
        {t.legalNote}
      </p>
    </section>
  );
}

// ============================================================
// 10. MOTIFS DE CONTACT
// ============================================================

function ReturnsReasons({ t }: { t: PageTexts }) {
  const items = [
    {
      icon: RefreshCcw,
      content: t.changeMind,
    },
    {
      icon: Package,
      content: t.damaged,
    },
    {
      icon: ClipboardList,
      content: t.wrongItem,
    },
    {
      icon: PackageCheck,
      content: t.incomplete,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2">
        <h2 className={SECTION_TITLE}>{t.reasonsTitle}</h2>

        <p className="mt-2 text-[13px] leading-6 text-[#617586]">
          {t.reasonsDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.content.title} className={`${CARD} p-3`}>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                <Icon size={26} aria-hidden="true" />
              </div>

              <h3 className="text-[15px] font-extrabold text-[#102b39]">
                {item.content.title}
              </h3>

              <p className="mt-3 text-[12px] leading-6 text-[#607383]">
                {item.content.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// 11. PROCÉDURE DE DEMANDE
// ============================================================

function ReturnsSteps({ t }: { t: PageTexts }) {
  const icons = [ClipboardList, FileText, Mail, Truck];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2 text-center">
        <h2 className={SECTION_TITLE}>{t.stepsTitle}</h2>

        <p className="mx-auto mt-2 max-w-187.5 text-[13px] leading-6 text-[#617586]">
          {t.stepsDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {t.steps.map((step, index) => {
          const Icon = icons[index];

          return (
            <article key={index} className={`${CARD} p-3`}>
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

      <div className="mt-2 flex items-start gap-3 rounded-xl border border-[#e8dcc5] bg-[#fffaf0] p-3">
        <AlertCircle
          size={21}
          className="mt-0.5 shrink-0 text-[#a66b15]"
          aria-hidden="true"
        />

        <p className="text-[12px] leading-6 text-[#705329]">
          {t.returnAddressNotice}
        </p>
      </div>
    </section>
  );
}

// ============================================================
// 12. REMBOURSEMENTS
// ============================================================

function ReturnsRefunds({ t }: { t: PageTexts }) {
  const items = [
    {
      icon: ClipboardList,
      content: t.refundReview,
    },
    {
      icon: Wallet,
      content: t.refundMethod,
    },
    {
      icon: Clock3,
      content: t.refundTiming,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2">
        <h2 className={SECTION_TITLE}>{t.refundsTitle}</h2>

        <p className="mt-2 text-[13px] leading-6 text-[#617586]">
          {t.refundsDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {items.map(({ icon: Icon, content }) => (
          <article key={content.title} className={`${CARD} p-3 sm:p-4`}>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
              <Icon size={26} aria-hidden="true" />
            </div>

            <h3 className="text-[16px] font-extrabold text-[#102b39]">
              {content.title}
            </h3>

            <p className="mt-3 text-[12px] leading-6 text-[#607383] sm:text-[13px]">
              {content.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 13. RECOMMANDATIONS
// ============================================================

function ReturnsGuidance({ t }: { t: PageTexts }) {
  return (
    <section className="py-1 lg:py-1">
      <div
        className={`${CARD} grid items-start gap-3 p-3 sm:p-3 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:gap-3 lg:p-3`}
      >
        <div>
          <ShieldCheck
            size={35}
            className="mb-2 text-[#109b24]"
            aria-hidden="true"
          />

          <h2 className={SECTION_TITLE}>{t.guidanceTitle}</h2>

          <p className="mt-3 text-[13px] leading-6 text-[#617586]">
            {t.guidanceDescription}
          </p>
        </div>

        <div className="space-y-3">
          {t.guidancePoints.map((point, index) => (
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
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 14. FAQ INTERACTIVE
// ============================================================

function ReturnsFAQ({ t }: { t: PageTexts }) {
  return (
    <section id="faq" className="scroll-mt-24 py-1 lg:py-1">
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
// 15. CONTACTS
// ============================================================

function ReturnsContacts({ locale, t }: { locale: Locale; t: PageTexts }) {
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
            <h2 className={SECTION_TITLE}>{t.helpTitle}</h2>

            <p className="mt-2 max-w-190 text-[13px] leading-6 text-[#617586]">
              {t.helpDescription}
            </p>
          </div>
        </div>

        {/* E-MAILS */}

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <a
            href={`mailto:${SALES_EMAIL}`}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e0e9ed] bg-[#fbfcfd] p-3 transition-colors hover:border-[#109b24]"
          >
            <Mail
              size={25}
              className="shrink-0 text-[#109b24]"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-[12px] font-extrabold text-[#102b39]">
                {t.salesEmailTitle}
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
              size={25}
              className="shrink-0 text-[#109b24]"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-[12px] font-extrabold text-[#102b39]">
                {t.generalEmailTitle}
              </p>

              <p className="mt-1 break-all text-[13px] text-[#52697b]">
                {CONTACT_EMAIL}
              </p>
            </div>
          </a>
        </div>

        {/* WHATSAPP */}

        <div className="mt-2">
          <h3 className="mb-3 flex items-center gap-2 text-[14px] font-extrabold text-[#102b39]">
            <MessageCircle
              size={20}
              className="text-[#109b24]"
              aria-hidden="true"
            />

            {t.whatsappTitle}
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={WHATSAPP_DE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#dce8df] bg-[#f6fcf6] px-4 py-3 transition-colors hover:border-[#109b24]"
            >
              <span className="min-w-0">
                <span className="block text-[12px] font-bold text-[#102b39]">
                  🇩🇪 {t.whatsappGermany}
                </span>

                <span className="mt-1 block text-[13px] font-extrabold text-[#078d21]">
                  {PHONE_DE}
                </span>
              </span>

              <ArrowRight
                size={19}
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
              <span className="min-w-0">
                <span className="block text-[12px] font-bold text-[#102b39]">
                  🇫🇷 {t.whatsappFrance}
                </span>

                <span className="mt-1 block text-[13px] font-extrabold text-[#078d21]">
                  {PHONE_FR}
                </span>
              </span>

              <ArrowRight
                size={19}
                className="shrink-0 text-[#109b24]"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        {/* NAVIGATION */}

        <div className="mt-3 flex flex-wrap gap-3">
          <Link href={`/${locale}/contact`} className={BUTTON_GREEN}>
            <Mail size={18} />
            {t.contactButton}
            <ArrowRight size={17} />
          </Link>

          <Link href={`/${locale}/service-client`} className={BUTTON_OUTLINE}>
            <Headphones size={18} />
            {t.serviceButton}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 16. APPEL À L'ACTION FINAL
// ============================================================

function ReturnsClosing({ locale, t }: { locale: Locale; t: PageTexts }) {
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
          <RotateCcw
            size={38}
            className="mx-auto mb-2 text-[#8be975]"
            aria-hidden="true"
          />

          <h2 className="mx-auto max-w-187.5 text-[24px] font-black tracking-tight text-white sm:text-[31px]">
            {t.closingTitle}
          </h2>

          <p className="mx-auto mt-2 max-w-170 text-[13px] leading-6 text-[#d5e5eb] sm:text-[14px]">
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
// 17. PAGE PRINCIPALE
// ============================================================

async function ReturnsPageContent({ params }: PageProps) {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return (
    <main
      data-page="returns-refunds"
      className="info-page w-full min-w-0 bg-white pb-2 text-[#102b39] lg:pb-2"
    >
      {/* Header général géré par SiteChrome */}

      <ReturnsBanner t={t} />

      <div className={CONTAINER}>
        <ReturnsBreadcrumb locale={locale} t={t} />

        <ReturnsHero locale={locale} t={t} />

        <ReturnsRights t={t} />

        <ReturnsReasons t={t} />

        <ReturnsSteps t={t} />

        <ReturnsRefunds t={t} />

        <ReturnsGuidance t={t} />

        <ReturnsFAQ t={t} />

        <ReturnsContacts locale={locale} t={t} />

        <ReturnsClosing locale={locale} t={t} />

        <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#6a7c88]">
          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          {t.footerNotice}
        </p>
      </div>

      {/* Footer général géré par SiteChrome */}
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA RETOURS & REMBOURSEMENTS
// ============================================================

export default function ReturnsPage(
  props: Parameters<typeof ReturnsPageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <ReturnsPageContent {...props} />
    </Suspense>
  );
}
