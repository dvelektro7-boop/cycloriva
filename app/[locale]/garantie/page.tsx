import { accessibilityLabel } from "@/lib/accessibility-i18n";
import "@/components/site/InformationPages.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bike,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Headphones,
  House,
  Mail,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Wrench,
} from "lucide-react";

/**
 * ==========================================================
 * CYCLORIVA — PAGE GARANTIE
 * ==========================================================
 *
 * Fichier :
 * app/[locale]/garantie/page.tsx
 *
 * Next.js 16 — React — TypeScript
 * Tailwind CSS 4 — Lucide React
 *
 * UN SEUL FICHIER
 *
 * ROUTES :
 * /fr/garantie
 * /en/garantie
 * /de/garantie
 * /it/garantie
 * /es/garantie
 *
 * CONTENU :
 * - Bandeau CYCLORIVA
 * - Fil d'Ariane
 * - Présentation de la garantie
 * - Garantie légale
 * - Garantie commerciale éventuelle
 * - Règles propres aux pays
 * - Exemples de problèmes à signaler
 * - Procédure de demande
 * - FAQ interactive
 * - E-mail et WhatsApp
 * - Liens vers Contact et Retours
 *
 * IMPORTANT :
 * - Pas de garantie fabricant inventée
 * - Pas de durée commerciale inventée
 * - Pas de promesse de remboursement automatique
 * - Pas de formulaire de réclamation fictif
 * - Les droits légaux restent applicables
 *
 * ==========================================================
 */

// ==========================================================
// 1. TYPES
// ==========================================================

type Locale = "fr" | "en" | "de" | "it" | "es";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

type ContentCard = {
  title: string;
  description: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type WarrantyTexts = {
  home: string;
  pageTitle: string;
  eyebrow: string;
  metaDescription: string;

  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  contactButton: string;
  faqButton: string;

  rightsTitle: string;
  rightsDescription: string;
  legalWarranty: ContentCard;
  commercialWarranty: ContentCard;
  swissWarranty: ContentCard;
  rightsNotice: string;

  coverageTitle: string;
  coverageDescription: string;
  nonConforming: ContentCard;
  defective: ContentCard;
  accessories: ContentCard;
  battery: ContentCard;

  remediesTitle: string;
  remediesDescription: string;
  repair: ContentCard;
  replacement: ContentCard;
  refund: ContentCard;
  remediesNotice: string;

  claimTitle: string;
  claimDescription: string;
  claimSteps: ContentCard[];
  claimNotice: string;

  preparationTitle: string;
  preparationDescription: string;
  preparationPoints: string[];

  faqTitle: string;
  faqDescription: string;
  faq: FAQItem[];

  assistanceTitle: string;
  assistanceDescription: string;
  salesEmail: string;
  generalEmail: string;
  whatsappGermany: string;
  whatsappFrance: string;
  contactPage: string;
  returnsPage: string;

  closingTitle: string;
  closingDescription: string;
  closingButton: string;

  footerNotice: string;
};

// ==========================================================
// 2. CONFIGURATION
// ==========================================================

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

// ==========================================================
// 3. TRADUCTIONS — 5 LANGUES
// ==========================================================

const TEXTS: Record<Locale, WarrantyTexts> = {
  // ========================================================
  // FRANÇAIS
  // ========================================================

  fr: {
    home: "Accueil",
    pageTitle: "Garantie",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    metaDescription:
      "Informations CYCLORIVA sur la garantie légale, les garanties des fabricants et l'assistance concernant les vélos et accessoires.",

    heroBadge: "GARANTIES & ASSISTANCE",
    heroTitle: "Comprenez vos garanties et vos droits.",
    heroDescription:
      "Découvrez les informations essentielles concernant les garanties de vos vélos et accessoires, ainsi que les démarches à suivre en cas de problème.",
    contactButton: "Demander une assistance",
    faqButton: "Consulter la FAQ",

    rightsTitle: "Les différentes garanties",
    rightsDescription:
      "La garantie légale et les garanties commerciales sont distinctes. Leur application dépend notamment du vendeur, du produit et de la législation concernée.",

    legalWarranty: {
      title: "Garantie légale de conformité",
      description:
        "Dans l'Union européenne, les ventes concernées bénéficient en principe d'une garantie légale d'au moins deux ans à compter de la livraison. Elle protège le consommateur lorsque le produit présente un défaut de conformité relevant de la responsabilité du vendeur.",
    },

    commercialWarranty: {
      title: "Garantie commerciale du fabricant",
      description:
        "Un fabricant peut proposer une garantie commerciale complémentaire. Sa durée, les pièces couvertes et ses conditions dépendent de la garantie réellement fournie pour le modèle concerné. Elle ne remplace pas vos droits légaux.",
    },

    swissWarranty: {
      title: "Commandes vers la Suisse",
      description:
        "En droit suisse, les actions en garantie pour défauts des biens mobiliers sont en principe soumises à un délai de deux ans. Les modalités, les obligations de signalement et la loi applicable doivent être examinées pour chaque vente.",
    },

    rightsNotice:
      "CYCLORIVA ne fixe pas ici une durée de garantie commerciale identique pour tous les vélos. Les garanties supplémentaires doivent être vérifiées dans la documentation de chaque produit.",

    coverageTitle: "Quels problèmes peuvent être signalés ?",
    coverageDescription:
      "Voici des situations qui peuvent nécessiter une vérification de conformité ou une assistance technique.",

    nonConforming: {
      title: "Produit non conforme",
      description:
        "Le vélo ou l'accessoire reçu ne correspond pas aux caractéristiques convenues lors de la commande.",
    },

    defective: {
      title: "Défaut de fonctionnement",
      description:
        "Un composant présente un dysfonctionnement. La cause et les droits applicables doivent être examinés.",
    },

    accessories: {
      title: "Équipement ou accessoire",
      description:
        "Un équipement fourni avec le produit présente un problème ou ne correspond pas à la commande.",
    },

    battery: {
      title: "Batterie et assistance électrique",
      description:
        "Un problème touche la batterie, le moteur ou les composants électroniques. Toute intervention doit respecter les consignes de sécurité du fabricant.",
    },

    remediesTitle: "Quelles solutions sont possibles ?",
    remediesDescription:
      "Lorsqu'un défaut relève de la garantie légale, les solutions dépendent des circonstances et de la réglementation applicable.",

    repair: {
      title: "Réparation",
      description:
        "La réparation peut être une solution appropriée lorsque le défaut relève de la garantie. Les réparations couvertes par la garantie légale de l'UE doivent être réalisées sans frais pour le consommateur.",
    },

    replacement: {
      title: "Remplacement",
      description:
        "Le remplacement peut être envisagé selon le défaut, la possibilité de remplacer le produit et les règles applicables.",
    },

    refund: {
      title: "Réduction du prix ou remboursement",
      description:
        "Une réduction de prix ou un remboursement peut être dû dans les situations prévues par la loi, notamment lorsque les solutions de mise en conformité ne sont pas possibles ou appropriées.",
    },

    remediesNotice:
      "Un remboursement n'est pas automatiquement dû pour chaque problème signalé. Les droits exacts et l'ordre des solutions dépendent de la réglementation applicable.",

    claimTitle: "Comment demander une prise en charge ?",
    claimDescription:
      "Préparez les informations utiles pour permettre l'examen de votre demande.",

    claimSteps: [
      {
        title: "Identifiez votre commande",
        description:
          "Retrouvez votre numéro de commande, la date de réception et le modèle concerné.",
      },
      {
        title: "Décrivez le problème",
        description:
          "Précisez les symptômes et les circonstances dans lesquelles le problème est apparu.",
      },
      {
        title: "Joignez les éléments utiles",
        description:
          "Préparez votre preuve d'achat et, si possible, des photographies du problème.",
      },
      {
        title: "Contactez CYCLORIVA",
        description:
          "Envoyez votre demande à notre équipe pour connaître les modalités de traitement applicables.",
      },
    ],

    claimNotice:
      "N'effectuez pas de réparation dangereuse et n'expédiez pas une batterie endommagée sans instructions adaptées. Cela ne limite pas vos droits légaux.",

    preparationTitle: "Quelques conseils avant votre demande",
    preparationDescription:
      "Ces informations peuvent faciliter l'identification du produit et du défaut.",

    preparationPoints: [
      "Conservez la facture, la confirmation de commande ou une autre preuve d'achat.",
      "Notez le nom du modèle et, s'il existe, le numéro de série du produit.",
      "Photographiez le défaut lorsqu'il peut être montré visuellement.",
      "Cessez d'utiliser le vélo si le problème peut compromettre votre sécurité.",
    ],

    faqTitle: "Questions fréquentes sur la garantie",
    faqDescription: "Cliquez sur une question pour afficher sa réponse.",

    faq: [
      {
        question: "Tous les vélos ont-ils une garantie de deux ans ?",
        answer:
          "Pour les ventes à des consommateurs relevant du droit de l'Union européenne, la garantie légale de conformité est en principe d'au moins deux ans. Elle est distincte d'une éventuelle garantie commerciale du fabricant.",
      },
      {
        question: "La garantie couvre-t-elle la batterie ?",
        answer:
          "La batterie fait partie des éléments du produit susceptibles de bénéficier des protections légales applicables en cas de non-conformité. Une garantie commerciale spécifique peut aussi exister selon le fabricant. L'usure normale et les conditions particulières doivent être distinguées d'un défaut.",
      },
      {
        question: "Que faire si mon vélo tombe en panne ?",
        answer:
          "Cessez de l'utiliser si sa sécurité est compromise. Contactez contact@cycloriva.com en décrivant le problème, avec la référence de commande et le modèle du vélo.",
      },
      {
        question: "Dois-je contacter le fabricant ou CYCLORIVA ?",
        answer:
          "Pour les droits relevant de la garantie légale de conformité dans l'Union européenne, le vendeur est responsable envers le consommateur. Une garantie commerciale du fabricant peut prévoir une procédure supplémentaire.",
      },
      {
        question: "La réparation sous garantie est-elle payante ?",
        answer:
          "Lorsqu'une réparation est due au titre de la garantie légale de conformité de l'Union européenne, elle doit normalement être effectuée sans frais pour le consommateur, conformément aux règles applicables.",
      },
      {
        question: "Puis-je obtenir un vélo de remplacement ?",
        answer:
          "Le remplacement peut faire partie des solutions légales en cas de défaut de conformité. Sa mise en œuvre dépend des circonstances, de la proportionnalité et des règles applicables.",
      },
      {
        question: "La garantie couvre-t-elle les dommages accidentels ?",
        answer:
          "Un dommage provoqué par un accident ou une mauvaise utilisation n'est pas automatiquement un défaut de conformité. Il faut distinguer l'origine du problème et les éventuelles garanties commerciales particulières.",
      },
      {
        question: "Comment demander une assistance depuis la Suisse ?",
        answer:
          "Contactez CYCLORIVA avec votre preuve d'achat et une description du défaut. Les droits applicables dépendent notamment du contrat et du régime juridique concerné.",
      },
    ],

    assistanceTitle: "Besoin d'aide concernant une garantie ?",
    assistanceDescription:
      "Contactez notre équipe avec votre référence de commande et les informations sur le produit concerné.",

    salesEmail: "Informations sur les commandes",
    generalEmail: "Garanties et questions générales",
    whatsappGermany: "Allemagne",
    whatsappFrance: "France",
    contactPage: "Page Contact",
    returnsPage: "Retours & remboursements",

    closingTitle: "Une question sur votre vélo ?",
    closingDescription:
      "CYCLORIVA vous permet de contacter son équipe pour obtenir des informations sur les produits, les commandes et les garanties applicables.",
    closingButton: "Nous contacter",

    footerNotice:
      "Ces informations sont générales. Les droits légaux impératifs, les conditions contractuelles valables et les éventuelles garanties commerciales documentées s'appliquent.",
  },

  // ========================================================
  // ANGLAIS
  // ========================================================

  en: {
    home: "Home",
    pageTitle: "Warranty",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    metaDescription:
      "CYCLORIVA information about legal guarantees, manufacturer warranties and assistance for bicycles and accessories.",

    heroBadge: "WARRANTY & SUPPORT",
    heroTitle: "Understand your warranties and rights.",
    heroDescription:
      "Find essential information about bicycle and accessory warranties and how to request assistance.",
    contactButton: "Request assistance",
    faqButton: "Read FAQ",

    rightsTitle: "Types of warranty protection",
    rightsDescription:
      "Legal guarantees and commercial warranties are different. Their application depends on the seller, product and relevant law.",

    legalWarranty: {
      title: "Legal guarantee of conformity",
      description:
        "In the European Union, qualifying consumer sales generally carry a legal guarantee of at least two years from delivery. It protects consumers against non-conformity for which the seller is responsible.",
    },

    commercialWarranty: {
      title: "Manufacturer's commercial warranty",
      description:
        "A manufacturer may offer an additional commercial warranty. Its duration, covered components and conditions depend on the documented warranty for the specific model. It does not replace statutory rights.",
    },

    swissWarranty: {
      title: "Orders to Switzerland",
      description:
        "Under Swiss law, claims for defects in movable goods generally have a two-year limitation period. Reporting obligations, contractual terms and applicable law must be considered for each sale.",
    },

    rightsNotice:
      "CYCLORIVA does not claim that every bicycle has the same additional commercial warranty. Check each product's documentation.",

    coverageTitle: "What problems can be reported?",
    coverageDescription:
      "These situations may require a conformity review or technical assistance.",

    nonConforming: {
      title: "Product not as described",
      description:
        "The bicycle or accessory does not match the characteristics agreed when ordering.",
    },

    defective: {
      title: "Technical malfunction",
      description:
        "A component fails to work properly. The cause and applicable rights must be assessed.",
    },

    accessories: {
      title: "Equipment or accessories",
      description:
        "Equipment supplied with the product has a problem or does not match the order.",
    },

    battery: {
      title: "Battery and electric assistance",
      description:
        "A problem affects the battery, motor or electronics. Follow manufacturer safety instructions.",
    },

    remediesTitle: "What solutions may apply?",
    remediesDescription:
      "When a defect falls under a legal guarantee, remedies depend on the circumstances and applicable rules.",

    repair: {
      title: "Repair",
      description:
        "Repair may be appropriate for a covered defect. Under EU legal guarantee rules, required repairs must be free of charge to consumers.",
    },

    replacement: {
      title: "Replacement",
      description:
        "Replacement may be available depending on the defect, feasibility and relevant legal requirements.",
    },

    refund: {
      title: "Price reduction or refund",
      description:
        "A price reduction or refund may apply in legally defined circumstances, including when other remedies are unavailable or inadequate.",
    },

    remediesNotice:
      "A refund is not automatically due for every reported issue. The available remedies depend on the applicable law.",

    claimTitle: "How to request warranty support",
    claimDescription:
      "Prepare useful information so your request can be assessed.",

    claimSteps: [
      {
        title: "Identify your order",
        description: "Find your order number, delivery date and product model.",
      },
      {
        title: "Describe the problem",
        description: "Explain the symptoms and when the issue appeared.",
      },
      {
        title: "Gather supporting information",
        description: "Prepare proof of purchase and photographs where helpful.",
      },
      {
        title: "Contact CYCLORIVA",
        description:
          "Send your enquiry to our team for information about the applicable procedure.",
      },
    ],

    claimNotice:
      "Do not attempt unsafe repairs or ship a damaged battery without suitable instructions. Your statutory rights remain unaffected.",

    preparationTitle: "Before contacting us",
    preparationDescription:
      "These details can help identify the product and issue.",

    preparationPoints: [
      "Keep your invoice, order confirmation or other proof of purchase.",
      "Record the model and serial number when available.",
      "Photograph visible defects where useful.",
      "Stop riding if the issue could compromise safety.",
    ],

    faqTitle: "Warranty FAQ",
    faqDescription: "Select a question to view the answer.",

    faq: [
      {
        question: "Do all bicycles have a two-year guarantee?",
        answer:
          "Qualifying EU consumer sales generally benefit from a minimum two-year legal guarantee. This is separate from any manufacturer's commercial warranty.",
      },
      {
        question: "Is the battery covered?",
        answer:
          "A battery may benefit from applicable statutory protection against non-conformity. Specific manufacturer warranties may also apply. Normal wear must be distinguished from defects.",
      },
      {
        question: "What should I do if my bicycle breaks down?",
        answer:
          "Stop using it if safety is affected. Contact contact@cycloriva.com with the order reference, bicycle model and problem description.",
      },
      {
        question: "Should I contact the manufacturer or seller?",
        answer:
          "Under EU legal guarantee rules, the seller is responsible to the consumer. A separate manufacturer's commercial warranty may offer another process.",
      },
      {
        question: "Are covered warranty repairs free?",
        answer:
          "Repairs required under the EU legal guarantee of conformity must normally be provided free of charge, according to applicable rules.",
      },
      {
        question: "Can I request a replacement bicycle?",
        answer:
          "Replacement may be a statutory remedy for non-conforming goods, depending on the situation, feasibility and proportionality.",
      },
      {
        question: "Is accidental damage covered?",
        answer:
          "Accidental damage or misuse is not automatically a lack of conformity. The cause of the issue and any specific commercial warranty must be considered.",
      },
      {
        question: "How do I request support from Switzerland?",
        answer:
          "Contact CYCLORIVA with proof of purchase and details of the defect. Applicable rights depend on the contract and relevant legal rules.",
      },
    ],

    assistanceTitle: "Need warranty assistance?",
    assistanceDescription:
      "Contact our team with your order reference and product details.",

    salesEmail: "Order enquiries",
    generalEmail: "Warranty and general enquiries",
    whatsappGermany: "Germany",
    whatsappFrance: "France",
    contactPage: "Contact page",
    returnsPage: "Returns & refunds",

    closingTitle: "Questions about your bicycle?",
    closingDescription:
      "Contact CYCLORIVA for information about products, orders and applicable warranty rights.",
    closingButton: "Contact us",

    footerNotice:
      "This page provides general information. Mandatory consumer rights, valid contractual terms and documented commercial warranties apply.",
  },

  // ========================================================
  // ALLEMAND
  // ========================================================

  de: {
    home: "Startseite",
    pageTitle: "Garantie & Gewährleistung",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    metaDescription:
      "CYCLORIVA Informationen zu gesetzlicher Gewährleistung, Herstellergarantien und Unterstützung für Fahrräder und Zubehör.",

    heroBadge: "GARANTIE & KUNDENSERVICE",
    heroTitle: "Ihre Garantien und Rechte verstehen.",
    heroDescription:
      "Hier finden Sie Informationen zur gesetzlichen Gewährleistung, zu möglichen Herstellergarantien und zum Vorgehen bei Problemen.",
    contactButton: "Unterstützung anfordern",
    faqButton: "FAQ ansehen",

    rightsTitle: "Garantie und Gewährleistung",
    rightsDescription:
      "Gesetzliche Gewährleistung und freiwillige Garantien sind unterschiedliche Schutzmechanismen.",

    legalWarranty: {
      title: "Gesetzliche Gewährleistung",
      description:
        "Bei entsprechenden Verbraucherkäufen in der EU gilt grundsätzlich eine gesetzliche Gewährleistung von mindestens zwei Jahren ab Lieferung. Sie schützt bei vertragswidrigen Mängeln, für die der Verkäufer verantwortlich ist.",
    },

    commercialWarranty: {
      title: "Freiwillige Herstellergarantie",
      description:
        "Ein Hersteller kann eine zusätzliche Garantie gewähren. Dauer, abgedeckte Bauteile und Bedingungen ergeben sich aus der Garantieerklärung des jeweiligen Modells. Gesetzliche Ansprüche bleiben bestehen.",
    },

    swissWarranty: {
      title: "Bestellungen in die Schweiz",
      description:
        "Nach schweizerischem Recht gilt für Ansprüche wegen Mängeln beweglicher Waren grundsätzlich eine zweijährige Verjährungsfrist. Meldepflichten, Vertragsbedingungen und das anwendbare Recht sind zu beachten.",
    },

    rightsNotice:
      "CYCLORIVA behauptet nicht, dass alle Fahrräder dieselbe zusätzliche Herstellergarantie haben. Maßgeblich sind die jeweiligen Produktunterlagen.",

    coverageTitle: "Welche Probleme können Sie melden?",
    coverageDescription:
      "Diese Fälle können eine technische Prüfung oder die Prüfung gesetzlicher Ansprüche erfordern.",

    nonConforming: {
      title: "Nicht vertragsgemäßes Produkt",
      description:
        "Das Fahrrad oder Zubehör entspricht nicht den vereinbarten Eigenschaften.",
    },

    defective: {
      title: "Technischer Defekt",
      description:
        "Ein Bauteil funktioniert nicht ordnungsgemäß. Ursache und Ansprüche müssen geprüft werden.",
    },

    accessories: {
      title: "Ausstattung und Zubehör",
      description:
        "Mitgelieferte Ausstattung weist einen Defekt auf oder weicht von der Bestellung ab.",
    },

    battery: {
      title: "Akku und Elektroantrieb",
      description:
        "Ein Problem betrifft Akku, Motor oder Elektronik. Beachten Sie die Sicherheitshinweise des Herstellers.",
    },

    remediesTitle: "Welche Lösungen sind möglich?",
    remediesDescription:
      "Die gesetzlichen Ansprüche hängen vom Mangel und dem anwendbaren Recht ab.",

    repair: {
      title: "Reparatur",
      description:
        "Bei einem entsprechenden Gewährleistungsfall kann eine kostenlose Reparatur in Betracht kommen. Nach EU-Recht müssen geschuldete Nachbesserungen grundsätzlich kostenlos sein.",
    },

    replacement: {
      title: "Ersatzlieferung",
      description:
        "Eine Ersatzlieferung kann je nach Mangel, Durchführbarkeit und gesetzlichen Voraussetzungen möglich sein.",
    },

    refund: {
      title: "Preisminderung oder Erstattung",
      description:
        "Eine Minderung oder Rückerstattung kommt in den gesetzlich vorgesehenen Fällen in Betracht, etwa wenn andere Lösungen nicht möglich oder nicht angemessen sind.",
    },

    remediesNotice:
      "Nicht jeder gemeldete Fehler führt automatisch zu einer Rückerstattung. Die gesetzlichen Voraussetzungen sind entscheidend.",

    claimTitle: "So melden Sie einen Garantiefall",
    claimDescription:
      "Bereiten Sie die wichtigsten Informationen für die Prüfung vor.",

    claimSteps: [
      {
        title: "Bestellung identifizieren",
        description: "Notieren Sie Bestellnummer, Lieferdatum und Modell.",
      },
      {
        title: "Problem beschreiben",
        description: "Erläutern Sie den Fehler und wann er aufgetreten ist.",
      },
      {
        title: "Nachweise vorbereiten",
        description:
          "Halten Sie den Kaufnachweis und gegebenenfalls Fotos bereit.",
      },
      {
        title: "CYCLORIVA kontaktieren",
        description:
          "Senden Sie uns die Informationen, um das weitere Vorgehen zu klären.",
      },
    ],

    claimNotice:
      "Führen Sie keine gefährlichen Reparaturen durch und versenden Sie beschädigte Akkus nicht ohne geeignete Anweisungen. Gesetzliche Ansprüche bleiben unberührt.",

    preparationTitle: "Vor Ihrer Anfrage",
    preparationDescription:
      "Diese Angaben helfen bei der Zuordnung des Produkts.",

    preparationPoints: [
      "Bewahren Sie Rechnung oder Bestellbestätigung auf.",
      "Notieren Sie Modell und gegebenenfalls Seriennummer.",
      "Fotografieren Sie erkennbare Schäden.",
      "Fahren Sie nicht weiter, wenn ein Sicherheitsrisiko besteht.",
    ],

    faqTitle: "Häufige Fragen zur Garantie",
    faqDescription: "Klicken Sie auf eine Frage, um die Antwort zu lesen.",

    faq: [
      {
        question: "Haben alle Fahrräder zwei Jahre Gewährleistung?",
        answer:
          "Für entsprechende Verbraucherkäufe nach EU-Recht gilt grundsätzlich eine gesetzliche Gewährleistung von mindestens zwei Jahren. Eine freiwillige Herstellergarantie ist davon unabhängig.",
      },
      {
        question: "Ist der Akku abgedeckt?",
        answer:
          "Auch ein Akku kann bei Vertragswidrigkeit unter den gesetzlichen Schutz fallen. Zusätzliche Herstellergarantien hängen vom Modell ab. Normaler Verschleiß ist von einem Mangel zu unterscheiden.",
      },
      {
        question: "Was tun bei einem Defekt?",
        answer:
          "Bei Sicherheitsrisiken das Fahrrad nicht weiter verwenden. Schreiben Sie mit Modell, Bestellnummer und Fehlerbeschreibung an contact@cycloriva.com.",
      },
      {
        question: "Hersteller oder Verkäufer kontaktieren?",
        answer:
          "Für gesetzliche Gewährleistungsansprüche nach EU-Recht ist grundsätzlich der Verkäufer verantwortlich. Eine Herstellergarantie kann zusätzliche Möglichkeiten vorsehen.",
      },
      {
        question: "Ist eine Gewährleistungsreparatur kostenlos?",
        answer:
          "Eine nach EU-Gewährleistungsrecht geschuldete Reparatur muss grundsätzlich kostenlos erfolgen.",
      },
      {
        question: "Kann ich ein Ersatzfahrrad verlangen?",
        answer:
          "Ein Austausch kann bei Vertragswidrigkeit möglich sein. Die Voraussetzungen hängen unter anderem von Durchführbarkeit und Verhältnismäßigkeit ab.",
      },
      {
        question: "Sind Unfallschäden abgedeckt?",
        answer:
          "Unfallschäden oder unsachgemäße Nutzung sind nicht automatisch ein Sachmangel. Entscheidend sind Ursache und gegebenenfalls zusätzliche Garantiebedingungen.",
      },
      {
        question: "Wie erhalte ich Hilfe aus der Schweiz?",
        answer:
          "Kontaktieren Sie uns mit Kaufnachweis und Fehlerbeschreibung. Die Ansprüche hängen vom Vertrag und anwendbaren Recht ab.",
      },
    ],

    assistanceTitle: "Benötigen Sie Unterstützung?",
    assistanceDescription:
      "Senden Sie uns Ihre Bestellnummer und die Informationen zum betroffenen Fahrrad.",

    salesEmail: "Fragen zu Bestellungen",
    generalEmail: "Garantie und allgemeine Fragen",
    whatsappGermany: "Deutschland",
    whatsappFrance: "Frankreich",
    contactPage: "Kontaktseite",
    returnsPage: "Rückgabe & Erstattung",

    closingTitle: "Fragen zu Ihrem Fahrrad?",
    closingDescription:
      "Kontaktieren Sie CYCLORIVA für Informationen zu Produkten, Bestellungen und gesetzlichen Ansprüchen.",
    closingButton: "Kontakt aufnehmen",

    footerNotice:
      "Diese Seite bietet allgemeine Informationen. Gesetzliche Verbraucherrechte, wirksame Vertragsbedingungen und dokumentierte Garantiezusagen bleiben maßgeblich.",
  },

  // ========================================================
  // ITALIEN
  // ========================================================

  it: {
    home: "Home",
    pageTitle: "Garanzia",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    metaDescription:
      "Informazioni CYCLORIVA sulla garanzia legale, le garanzie dei produttori e l'assistenza per biciclette e accessori.",

    heroBadge: "GARANZIA E ASSISTENZA",
    heroTitle: "Scopri le garanzie e i tuoi diritti.",
    heroDescription:
      "Informazioni sulla garanzia delle biciclette, sugli accessori e su come richiedere assistenza.",
    contactButton: "Richiedi assistenza",
    faqButton: "Consulta le FAQ",

    rightsTitle: "Le diverse garanzie",
    rightsDescription:
      "La garanzia legale e quella commerciale sono distinte e dipendono dal prodotto e dalle norme applicabili.",

    legalWarranty: {
      title: "Garanzia legale di conformità",
      description:
        "Nell'Unione europea, per le vendite ai consumatori interessate si applica generalmente una garanzia legale di almeno due anni dalla consegna. Tutela contro i difetti di conformità imputabili al venditore.",
    },

    commercialWarranty: {
      title: "Garanzia commerciale del produttore",
      description:
        "Il produttore può offrire una garanzia aggiuntiva. Durata, componenti coperti e condizioni dipendono dalla documentazione del modello. Non sostituisce i diritti legali.",
    },

    swissWarranty: {
      title: "Ordini verso la Svizzera",
      description:
        "Nel diritto svizzero, le azioni per difetti dei beni mobili sono generalmente soggette a un termine di prescrizione di due anni. Vanno considerate le regole di segnalazione e la legge applicabile.",
    },

    rightsNotice:
      "CYCLORIVA non dichiara una garanzia commerciale identica per tutti i modelli. Le condizioni aggiuntive devono essere verificate.",

    coverageTitle: "Quali problemi possono essere segnalati?",
    coverageDescription:
      "Queste situazioni possono richiedere una verifica di conformità o assistenza tecnica.",

    nonConforming: {
      title: "Prodotto non conforme",
      description:
        "La bicicletta o l'accessorio non corrisponde alle caratteristiche concordate.",
    },

    defective: {
      title: "Malfunzionamento",
      description:
        "Un componente non funziona correttamente. Occorre verificare causa e diritti applicabili.",
    },

    accessories: {
      title: "Accessori e dotazioni",
      description:
        "Un elemento incluso presenta un difetto o non corrisponde all'ordine.",
    },

    battery: {
      title: "Batteria e assistenza elettrica",
      description:
        "Il problema interessa batteria, motore o elettronica. Segui le istruzioni di sicurezza del produttore.",
    },

    remediesTitle: "Quali soluzioni sono possibili?",
    remediesDescription:
      "I rimedi dipendono dal difetto e dalla normativa applicabile.",

    repair: {
      title: "Riparazione",
      description:
        "La riparazione può essere prevista quando il difetto è coperto. Nell'UE, le riparazioni dovute ai sensi della garanzia legale devono essere gratuite.",
    },

    replacement: {
      title: "Sostituzione",
      description:
        "La sostituzione può essere disponibile in base al difetto e alle condizioni previste dalla legge.",
    },

    refund: {
      title: "Riduzione del prezzo o rimborso",
      description:
        "Una riduzione o un rimborso può essere previsto quando gli altri rimedi non sono possibili o adeguati, secondo la legge.",
    },

    remediesNotice:
      "Non ogni segnalazione comporta automaticamente un rimborso. Si applicano le condizioni legali specifiche.",

    claimTitle: "Come richiedere assistenza",
    claimDescription:
      "Prepara le informazioni necessarie per esaminare la richiesta.",

    claimSteps: [
      {
        title: "Identifica l'ordine",
        description: "Trova numero d'ordine, data di consegna e modello.",
      },
      {
        title: "Descrivi il problema",
        description: "Spiega i sintomi e quando si sono verificati.",
      },
      {
        title: "Prepara i documenti",
        description:
          "Tieni a disposizione la prova d'acquisto e le foto utili.",
      },
      {
        title: "Contatta CYCLORIVA",
        description:
          "Invia le informazioni al nostro team per conoscere la procedura.",
      },
    ],

    claimNotice:
      "Non effettuare riparazioni pericolose e non spedire batterie danneggiate senza istruzioni appropriate. I diritti legali restano invariati.",

    preparationTitle: "Prima della richiesta",
    preparationDescription:
      "Alcuni dettagli facilitano l'identificazione del problema.",

    preparationPoints: [
      "Conserva fattura o conferma dell'ordine.",
      "Annota modello e numero di serie, se presente.",
      "Fotografa eventuali difetti visibili.",
      "Interrompi l'utilizzo se la sicurezza è compromessa.",
    ],

    faqTitle: "Domande frequenti sulla garanzia",
    faqDescription: "Seleziona una domanda per vedere la risposta.",

    faq: [
      {
        question: "Tutte le biciclette hanno una garanzia di due anni?",
        answer:
          "Le vendite ai consumatori soggette alle regole UE beneficiano generalmente di almeno due anni di garanzia legale. Le garanzie commerciali aggiuntive sono separate.",
      },
      {
        question: "La batteria è coperta?",
        answer:
          "Anche la batteria può essere coperta dalla tutela legale contro i difetti di conformità. Le garanzie commerciali dipendono dal produttore e occorre distinguere difetti e normale usura.",
      },
      {
        question: "Cosa faccio se la bicicletta si guasta?",
        answer:
          "Non usarla se può essere pericolosa. Scrivi a contact@cycloriva.com con numero d'ordine, modello e descrizione del problema.",
      },
      {
        question: "Devo contattare il produttore o il venditore?",
        answer:
          "Per la garanzia legale di conformità dell'UE, il venditore è responsabile nei confronti del consumatore. Una garanzia del produttore può prevedere ulteriori procedure.",
      },
      {
        question: "La riparazione in garanzia è gratuita?",
        answer:
          "Le riparazioni dovute in base alla garanzia legale dell'UE devono normalmente essere gratuite.",
      },
      {
        question: "Posso richiedere la sostituzione?",
        answer:
          "La sostituzione può essere un rimedio previsto dalla legge per prodotti non conformi, secondo le circostanze.",
      },
      {
        question: "I danni accidentali sono coperti?",
        answer:
          "Un danno accidentale non è automaticamente un difetto di conformità. Occorre valutare la causa e le eventuali condizioni commerciali.",
      },
      {
        question: "Come ricevere assistenza dalla Svizzera?",
        answer:
          "Contatta CYCLORIVA con prova d'acquisto e descrizione del difetto. Si applicano le regole pertinenti al contratto.",
      },
    ],

    assistanceTitle: "Hai bisogno di aiuto con la garanzia?",
    assistanceDescription:
      "Contatta il nostro team indicando il numero dell'ordine e il modello.",

    salesEmail: "Informazioni sugli ordini",
    generalEmail: "Garanzia e domande generali",
    whatsappGermany: "Germania",
    whatsappFrance: "Francia",
    contactPage: "Pagina Contatti",
    returnsPage: "Resi e rimborsi",

    closingTitle: "Hai domande sulla tua bicicletta?",
    closingDescription:
      "Contatta CYCLORIVA per informazioni sui prodotti, ordini e garanzie applicabili.",
    closingButton: "Contattaci",

    footerNotice:
      "Questa pagina fornisce informazioni generali. Si applicano i diritti di legge, le condizioni contrattuali valide e le garanzie commerciali documentate.",
  },

  // ========================================================
  // ESPAGNOL
  // ========================================================

  es: {
    home: "Inicio",
    pageTitle: "Garantía",
    eyebrow: "BICICLETAS & MOVILIDAD ELÉCTRICA EN EUROPA",
    metaDescription:
      "Información CYCLORIVA sobre garantía legal, garantías del fabricante y asistencia para bicicletas y accesorios.",

    heroBadge: "GARANTÍA Y ASISTENCIA",
    heroTitle: "Conoce tus garantías y derechos.",
    heroDescription:
      "Consulta información sobre garantías de bicicletas, accesorios y cómo solicitar asistencia.",
    contactButton: "Solicitar asistencia",
    faqButton: "Ver preguntas frecuentes",

    rightsTitle: "Tipos de garantías",
    rightsDescription:
      "La garantía legal y la garantía comercial son distintas. Se aplican según el producto y la legislación.",

    legalWarranty: {
      title: "Garantía legal de conformidad",
      description:
        "En la Unión Europea, las ventas a consumidores comprendidas en la normativa cuentan generalmente con una garantía legal mínima de dos años desde la entrega. Protege frente a defectos de conformidad que corresponden al vendedor.",
    },

    commercialWarranty: {
      title: "Garantía comercial del fabricante",
      description:
        "El fabricante puede ofrecer una garantía adicional. La duración, las piezas cubiertas y las condiciones dependen de la documentación del modelo. No sustituye los derechos legales.",
    },

    swissWarranty: {
      title: "Pedidos a Suiza",
      description:
        "En el derecho suizo, las acciones por defectos de bienes muebles generalmente tienen un plazo de prescripción de dos años. Deben considerarse las obligaciones de notificación y la ley aplicable.",
    },

    rightsNotice:
      "CYCLORIVA no afirma que todos los modelos tengan la misma garantía comercial. Deben comprobarse las condiciones documentadas.",

    coverageTitle: "¿Qué problemas puedes comunicar?",
    coverageDescription:
      "Estas situaciones pueden requerir una comprobación o asistencia técnica.",

    nonConforming: {
      title: "Producto no conforme",
      description:
        "La bicicleta o el accesorio no corresponde a las características acordadas.",
    },

    defective: {
      title: "Fallo de funcionamiento",
      description:
        "Un componente no funciona correctamente. Deben evaluarse la causa y los derechos aplicables.",
    },

    accessories: {
      title: "Equipamiento y accesorios",
      description:
        "Un elemento incluido presenta un defecto o no coincide con el pedido.",
    },

    battery: {
      title: "Batería y asistencia eléctrica",
      description:
        "El problema afecta a batería, motor o electrónica. Sigue las instrucciones de seguridad del fabricante.",
    },

    remediesTitle: "¿Qué soluciones son posibles?",
    remediesDescription: "Dependen del defecto y de la legislación aplicable.",

    repair: {
      title: "Reparación",
      description:
        "La reparación puede ser procedente cuando el defecto está cubierto. Bajo las normas de garantía legal de la UE, las reparaciones debidas deben ser gratuitas.",
    },

    replacement: {
      title: "Sustitución",
      description:
        "La sustitución puede corresponder según el defecto, la viabilidad y las normas aplicables.",
    },

    refund: {
      title: "Reducción del precio o reembolso",
      description:
        "Puede corresponder una reducción o reembolso en los supuestos legales, por ejemplo cuando las otras soluciones no son viables o adecuadas.",
    },

    remediesNotice:
      "No todos los problemas dan derecho automáticamente a un reembolso. Deben cumplirse los requisitos legales.",

    claimTitle: "Cómo solicitar asistencia",
    claimDescription:
      "Prepara la información necesaria para estudiar la solicitud.",

    claimSteps: [
      {
        title: "Identifica el pedido",
        description: "Localiza número de pedido, fecha de entrega y modelo.",
      },
      {
        title: "Describe el problema",
        description: "Explica qué ocurre y cuándo apareció el fallo.",
      },
      {
        title: "Reúne documentación",
        description: "Prepara prueba de compra y fotografías si son útiles.",
      },
      {
        title: "Contacta con CYCLORIVA",
        description:
          "Envía los datos a nuestro equipo para conocer los pasos aplicables.",
      },
    ],

    claimNotice:
      "No realices reparaciones peligrosas ni envíes baterías dañadas sin instrucciones adecuadas. Tus derechos legales se mantienen.",

    preparationTitle: "Antes de solicitar ayuda",
    preparationDescription:
      "Estos datos facilitan la identificación del problema.",

    preparationPoints: [
      "Conserva factura o confirmación del pedido.",
      "Anota el modelo y número de serie, si existe.",
      "Fotografía los defectos visibles.",
      "Deja de utilizar la bicicleta si existe un riesgo de seguridad.",
    ],

    faqTitle: "Preguntas frecuentes sobre garantías",
    faqDescription: "Selecciona una pregunta para ver la respuesta.",

    faq: [
      {
        question: "¿Todas las bicicletas tienen dos años de garantía?",
        answer:
          "Las ventas a consumidores sujetas a las normas de la UE suelen tener una garantía legal mínima de dos años. Esta es independiente de las garantías comerciales del fabricante.",
      },
      {
        question: "¿Está cubierta la batería?",
        answer:
          "La batería también puede beneficiarse de la protección legal frente a defectos de conformidad. Las garantías comerciales varían y debe distinguirse el desgaste normal de un defecto.",
      },
      {
        question: "¿Qué hago si mi bicicleta falla?",
        answer:
          "No la utilices si existe un riesgo de seguridad. Escribe a contact@cycloriva.com con el modelo, número de pedido y detalles del fallo.",
      },
      {
        question: "¿Contacto con el fabricante o el vendedor?",
        answer:
          "Para la garantía legal de conformidad de la UE, el responsable frente al consumidor es el vendedor. Una garantía del fabricante puede ofrecer un procedimiento adicional.",
      },
      {
        question: "¿La reparación en garantía es gratuita?",
        answer:
          "Las reparaciones debidas bajo la garantía legal de conformidad de la UE deben realizarse normalmente sin coste.",
      },
      {
        question: "¿Puedo solicitar un reemplazo?",
        answer:
          "La sustitución puede ser una solución legal para productos no conformes, según las circunstancias.",
      },
      {
        question: "¿Están cubiertos los daños accidentales?",
        answer:
          "Los daños por accidentes o uso incorrecto no son automáticamente defectos de conformidad. Deben revisarse su causa y las posibles garantías comerciales.",
      },
      {
        question: "¿Cómo pido ayuda desde Suiza?",
        answer:
          "Contacta con CYCLORIVA con la prueba de compra y la descripción del defecto. Se aplican las normas pertinentes al contrato.",
      },
    ],

    assistanceTitle: "¿Necesitas ayuda con una garantía?",
    assistanceDescription:
      "Contacta con nuestro equipo e indica número de pedido y modelo.",

    salesEmail: "Información sobre pedidos",
    generalEmail: "Garantías y consultas generales",
    whatsappGermany: "Alemania",
    whatsappFrance: "Francia",
    contactPage: "Página de contacto",
    returnsPage: "Devoluciones y reembolsos",

    closingTitle: "¿Tienes preguntas sobre tu bicicleta?",
    closingDescription:
      "Contacta con CYCLORIVA para obtener información sobre productos, pedidos y derechos de garantía.",
    closingButton: "Contáctanos",

    footerNotice:
      "Esta página ofrece información general. Se aplican los derechos legales, las condiciones contractuales válidas y las garantías comerciales documentadas.",
  },
};

// ==========================================================
// 4. STYLES PARTAGÉS
// ==========================================================

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
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[#109b24] sm:text-sm";

const OUTLINE_BUTTON =
  "inline-flex min-h-12 items-center justify-center " +
  "gap-2 rounded-lg border border-[#b6c7d2] " +
  "bg-white px-5 py-3 text-center text-[13px] " +
  "font-bold text-[#102b39] transition-colors " +
  "hover:bg-[#f4f8fa] sm:text-sm";

// ==========================================================
// 5. MÉTADONNÉES SEO
// ==========================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return {
    title: `${t.pageTitle} | CYCLORIVA`,
    description: t.metaDescription,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      languages: {
        fr: "/fr/garantie",
        en: "/en/garantie",
        de: "/de/garantie",
        it: "/it/garantie",
        es: "/es/garantie",
        "x-default": "/fr/garantie",
      },
    },

    openGraph: {
      images: [{ url: "/images/imager.png", width: 1536, height: 1024, alt: "CYCLORIVA" }],
      type: "website",
      title: `${t.pageTitle} | CYCLORIVA`,
      description: t.metaDescription,
    },
  };
}

// ==========================================================
// 6. BANDEAU DESKTOP
// ==========================================================

function WarrantyBanner({ t }: { t: WarrantyTexts }) {
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
          <span className="h-0.75 w-6 bg-[#91df20]" />
          {t.eyebrow}
        </p>

        <h1 className="text-[32px] font-black tracking-tight text-white xl:text-[38px]">
          {t.pageTitle}
        </h1>
      </div>
    </section>
  );
}

// ==========================================================
// 7. FIL D'ARIANE
// ==========================================================

function WarrantyBreadcrumb({
  locale,
  t,
}: {
  locale: Locale;
  t: WarrantyTexts;
}) {
  return (
    <nav
      aria-label={accessibilityLabel(locale, "breadcrumb")}
      className="flex min-w-0 flex-wrap items-center gap-2 py-1 text-[12px] text-[#425969]"
    >
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 hover:text-[#109b24]"
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

// ==========================================================
// 8. INTRODUCTION
// ==========================================================

function WarrantyHero({ locale, t }: { locale: Locale; t: WarrantyTexts }) {
  return (
    <section className="grid min-w-0 items-center gap-3 py-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-3 lg:py-1">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-2 text-[11px] font-extrabold text-[#078d21]">
          <ShieldCheck size={17} aria-hidden="true" />
          {t.heroBadge}
        </span>

        <h2 className="mt-2 max-w-180 text-[29px] leading-[1.13] font-black tracking-tight text-[#102b39] sm:text-[40px] lg:text-[45px]">
          {t.heroTitle}
        </h2>

        <p className="mt-2 max-w-157.5 text-[14px] leading-7 text-[#536c7b] sm:text-[15px]">
          {t.heroDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link href={`/${locale}/contact`} className={GREEN_BUTTON}>
            <Headphones size={18} />
            {t.contactButton}
            <ArrowRight size={17} />
          </Link>

          <a href="#faq-garantie" className={OUTLINE_BUTTON}>
            <CircleHelp size={18} />
            {t.faqButton}
          </a>
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
            <ShieldCheck
              size={30}
              className="shrink-0 text-[#8de87a]"
              aria-hidden="true"
            />

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

// ==========================================================
// 9. GARANTIES APPLICABLES
// ==========================================================

function WarrantyRights({ t }: { t: WarrantyTexts }) {
  const items = [
    {
      icon: ShieldCheck,
      content: t.legalWarranty,
    },
    {
      icon: BadgeCheck,
      content: t.commercialWarranty,
    },
    {
      icon: FileText,
      content: t.swissWarranty,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2">
        <h2 className={SECTION_TITLE}>{t.rightsTitle}</h2>

        <p className="mt-2 max-w-195 text-[13px] leading-6 text-[#617586]">
          {t.rightsDescription}
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {items.map(({ icon: Icon, content }) => (
          <article key={content.title} className={`${CARD} p-3 sm:p-4`}>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
              <Icon size={27} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <h3 className="text-[16px] font-extrabold leading-6 text-[#102b39]">
              {content.title}
            </h3>

            <p className="mt-3 text-[12px] leading-6 text-[#536c7b] sm:text-[13px]">
              {content.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-2 flex items-start gap-3 rounded-xl border border-[#dbe8ee] bg-[#f7fafc] p-3">
        <FileCheck2
          size={21}
          className="mt-0.5 shrink-0 text-[#109b24]"
          aria-hidden="true"
        />

        <p className="text-[12px] leading-6 text-[#526979]">{t.rightsNotice}</p>
      </div>
    </section>
  );
}

// ==========================================================
// 10. PROBLÈMES POUVANT ÊTRE SIGNALÉS
// ==========================================================

function WarrantyCoverage({ t }: { t: WarrantyTexts }) {
  const items = [
    {
      icon: PackageCheck,
      content: t.nonConforming,
    },
    {
      icon: Wrench,
      content: t.defective,
    },
    {
      icon: Bike,
      content: t.accessories,
    },
    {
      icon: ShieldCheck,
      content: t.battery,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2">
        <h2 className={SECTION_TITLE}>{t.coverageTitle}</h2>

        <p className="mt-2 text-[13px] leading-6 text-[#617586]">
          {t.coverageDescription}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, content }) => (
          <article key={content.title} className={`${CARD} p-3`}>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
              <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <h3 className="text-[15px] font-extrabold leading-6 text-[#102b39]">
              {content.title}
            </h3>

            <p className="mt-3 text-[12px] leading-6 text-[#607383]">
              {content.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

// ==========================================================
// 11. SOLUTIONS POSSIBLES
// ==========================================================

function WarrantyRemedies({ t }: { t: WarrantyTexts }) {
  const items = [
    {
      icon: Wrench,
      content: t.repair,
    },
    {
      icon: RotateCcw,
      content: t.replacement,
    },
    {
      icon: CheckCircle2,
      content: t.refund,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2">
        <h2 className={SECTION_TITLE}>{t.remediesTitle}</h2>

        <p className="mt-2 max-w-190 text-[13px] leading-6 text-[#617586]">
          {t.remediesDescription}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
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

      <div className="mt-2 flex items-start gap-3 rounded-xl border border-[#dce7ec] bg-[#f8fafc] p-3">
        <CircleHelp
          size={20}
          className="mt-0.5 shrink-0 text-[#109b24]"
          aria-hidden="true"
        />

        <p className="text-[12px] leading-6 text-[#536879]">
          {t.remediesNotice}
        </p>
      </div>
    </section>
  );
}

// ==========================================================
// 12. PROCÉDURE DE RÉCLAMATION
// ==========================================================

function WarrantyProcess({ t }: { t: WarrantyTexts }) {
  const icons = [ClipboardCheck, Wrench, FileCheck2, Mail];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2 text-center">
        <h2 className={SECTION_TITLE}>{t.claimTitle}</h2>

        <p className="mx-auto mt-2 max-w-185 text-[13px] leading-6 text-[#617586]">
          {t.claimDescription}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {t.claimSteps.map((step, index) => {
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

              <h3 className="mt-2 text-[15px] font-extrabold leading-6 text-[#102b39]">
                {step.title}
              </h3>

              <p className="mt-3 text-[12px] leading-6 text-[#607383]">
                {step.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-2 flex items-start gap-3 rounded-xl border border-[#ecd9b3] bg-[#fffaf0] p-3">
        <AlertTriangle
          size={21}
          className="mt-0.5 shrink-0 text-[#a66b15]"
          aria-hidden="true"
        />

        <p className="text-[12px] leading-6 text-[#71532d]">{t.claimNotice}</p>
      </div>
    </section>
  );
}

// ==========================================================
// 13. PRÉPARATION DE LA DEMANDE
// ==========================================================

function WarrantyPreparation({ t }: { t: WarrantyTexts }) {
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

          <h2 className={SECTION_TITLE}>{t.preparationTitle}</h2>

          <p className="mt-3 text-[13px] leading-6 text-[#617586]">
            {t.preparationDescription}
          </p>
        </div>

        <div className="space-y-3">
          {t.preparationPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-[#e0e9ed] bg-[#f9fcf9] p-3"
            >
              <CheckCircle2
                size={21}
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

// ==========================================================
// 14. FAQ INTERACTIVE
// ==========================================================

function WarrantyFAQ({ t }: { t: WarrantyTexts }) {
  return (
    <section id="faq-garantie" className="scroll-mt-24 py-1 lg:py-1">
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

// ==========================================================
// 15. CONTACTS OFFICIELS
// ==========================================================

function WarrantyContacts({ locale, t }: { locale: Locale; t: WarrantyTexts }) {
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
            <h2 className={SECTION_TITLE}>{t.assistanceTitle}</h2>

            <p className="mt-2 max-w-190 text-[13px] leading-6 text-[#617586]">
              {t.assistanceDescription}
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

        {/* WHATSAPP */}

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

              <div className="min-w-0">
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

              <div className="min-w-0">
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

        {/* LIENS */}

        <div className="mt-3 flex flex-wrap gap-3">
          <Link href={`/${locale}/contact`} className={GREEN_BUTTON}>
            <Mail size={18} />
            {t.contactPage}
            <ArrowRight size={17} />
          </Link>

          <Link
            href={`/${locale}/retours-remboursements`}
            className={OUTLINE_BUTTON}
          >
            <RotateCcw size={18} />
            {t.returnsPage}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ==========================================================
// 16. SECTION FINALE
// ==========================================================

function WarrantyClosing({ locale, t }: { locale: Locale; t: WarrantyTexts }) {
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
          <ShieldCheck
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

// ==========================================================
// 17. PAGE PRINCIPALE
// ==========================================================

async function WarrantyPageContent({ params }: PageProps) {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return (
    <main
      data-page="warranty"
      className="info-page w-full min-w-0 bg-white pb-2 text-[#102b39] lg:pb-2"
    >
      {/* Header existant géré par SiteChrome */}

      <WarrantyBanner t={t} />

      <div className={CONTAINER}>
        <WarrantyBreadcrumb locale={locale} t={t} />

        <WarrantyHero locale={locale} t={t} />

        <WarrantyRights t={t} />

        <WarrantyCoverage t={t} />

        <WarrantyRemedies t={t} />

        <WarrantyProcess t={t} />

        <WarrantyPreparation t={t} />

        <WarrantyFAQ t={t} />

        <WarrantyContacts locale={locale} t={t} />

        <WarrantyClosing locale={locale} t={t} />

        <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#6a7c88]">
          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          {t.footerNotice}
        </p>
      </div>

      {/* Footer existant géré par SiteChrome */}
    </main>
  );
}

// ==========================================================
// FIN — CYCLORIVA GARANTIE
// ==========================================================

export default function WarrantyPage(
  props: Parameters<typeof WarrantyPageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <WarrantyPageContent {...props} />
    </Suspense>
  );
}
