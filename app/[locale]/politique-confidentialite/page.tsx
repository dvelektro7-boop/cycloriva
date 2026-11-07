import "@/components/site/InformationPages.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Cookie,
  Database,
  FileText,
  Globe2,
  Headphones,
  House,
  LockKeyhole,
  Mail,
  Scale,
  Server,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

/**
 * ============================================================
 * CYCLORIVA — POLITIQUE DE CONFIDENTIALITÉ
 * ============================================================
 *
 * FICHIER :
 * app/[locale]/politique-confidentialite/page.tsx
 *
 * Next.js 16 — App Router
 * React — TypeScript — Tailwind CSS 4
 * Lucide React
 *
 * UN SEUL FICHIER
 *
 * ROUTES :
 * /fr/politique-confidentialite
 * /en/politique-confidentialite
 * /de/politique-confidentialite
 * /it/politique-confidentialite
 * /es/politique-confidentialite
 *
 * La page contient :
 * - SEO multilingue
 * - Bandeau desktop
 * - Fil d'Ariane
 * - Présentation de la confidentialité
 * - Sommaire avec navigation
 * - Rubriques relatives au RGPD
 * - FAQ interactive sans JS client
 * - Contact
 * - Responsive PC / tablette / mobile
 *
 * IMPORTANT :
 * Les éléments qui dépendent de la configuration
 * réelle de CYCLORIVA doivent être vérifiés
 * avant publication.
 *
 * Cette page ne configure PAS :
 * - La gestion des cookies
 * - Le consentement analytique / marketing
 * - Les règles de suppression en base de données
 * - Les accès aux données
 * - Les contrats avec les sous-traitants
 *
 * Le header et le footer sont déjà fournis
 * par le layout du projet.
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

type Locale = "fr" | "en" | "de" | "it" | "es";

type PageProps = {
  params: Promise<{ locale: string }>;
};

type SectionId =
  | "controller"
  | "data"
  | "purposes"
  | "legal"
  | "recipients"
  | "retention"
  | "security"
  | "cookies"
  | "transfers"
  | "rights"
  | "complaints"
  | "changes";

type PrivacySection = {
  id: SectionId;
  title: string;
  paragraphs: string[];
  points?: string[];
};

type FAQItem = {
  question: string;
  answer: string;
};

type PageTexts = {
  home: string;
  pageTitle: string;
  eyebrow: string;
  metaDescription: string;

  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  readPolicy: string;
  contactUs: string;

  summaryTitle: string;
  summaryDescription: string;

  overviewTitle: string;
  overviewDescription: string;
  overviewCards: {
    title: string;
    description: string;
  }[];

  importantTitle: string;
  importantDescription: string;

  sections: PrivacySection[];

  faqTitle: string;
  faqDescription: string;
  faq: FAQItem[];

  contactTitle: string;
  contactDescription: string;
  contactEmailLabel: string;
  ordersEmailLabel: string;
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

const CONTACT_EMAIL = "contact@cycloriva.com";
const ORDERS_EMAIL = "sell@cycloriva.com";

const SECTION_ICONS = {
  controller: Building2,
  data: Database,
  purposes: FileText,
  legal: Scale,
  recipients: Server,
  retention: Clock3,
  security: LockKeyhole,
  cookies: Cookie,
  transfers: Globe2,
  rights: UserRoundCheck,
  complaints: ShieldCheck,
  changes: FileText,
} as const;

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
  "rounded-lg border border-[#b6c7d2] bg-white px-5 py-3 " +
  "text-[13px] font-bold text-[#102b39] " +
  "hover:bg-[#f4f8fa] sm:text-sm";

// ============================================================
// 3. TRADUCTIONS
// ============================================================

const TEXTS: Record<Locale, PageTexts> = {
  // ==========================================================
  // FRANÇAIS
  // ==========================================================

  fr: {
    home: "Accueil",
    pageTitle: "Politique de confidentialité",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    metaDescription:
      "Informations CYCLORIVA sur les données personnelles, leur utilisation, les cookies, la conservation et les droits des utilisateurs.",

    heroBadge: "PROTECTION DES DONNÉES",
    heroTitle: "Vos données personnelles et votre confidentialité.",
    heroDescription:
      "Découvrez les informations relatives aux données collectées lors de l'utilisation de CYCLORIVA, aux finalités des traitements et aux droits des utilisateurs.",
    readPolicy: "Lire la politique",
    contactUs: "Nous contacter",

    summaryTitle: "Sommaire",
    summaryDescription: "Accédez directement à la rubrique qui vous intéresse.",

    overviewTitle: "La protection des données en pratique",
    overviewDescription:
      "Les principes qui doivent guider le traitement des informations personnelles.",

    overviewCards: [
      {
        title: "Transparence",
        description:
          "Informer les visiteurs des données utilisées et des raisons de leur traitement.",
      },
      {
        title: "Données nécessaires",
        description:
          "Limiter chaque collecte aux informations nécessaires à une finalité déterminée.",
      },
      {
        title: "Accès maîtrisés",
        description:
          "Mettre en place des contrôles adaptés pour protéger les informations personnelles.",
      },
      {
        title: "Droits des utilisateurs",
        description:
          "Permettre l'exercice des droits prévus par la réglementation applicable.",
      },
    ],

    importantTitle: "Informations à compléter avant publication",
    importantDescription:
      "La raison sociale, l'adresse du responsable du traitement, les durées de conservation exactes, les prestataires, les éventuels transferts hors EEE et les outils de cookies doivent être vérifiés à partir de l'exploitation réelle de CYCLORIVA. Une politique publique définitive ne doit pas laisser ces éléments indéterminés.",

    sections: [
      {
        id: "controller",
        title: "1. Responsable du traitement",
        paragraphs: [
          "CYCLORIVA est le nom de la boutique en ligne. L'identité juridique complète de l'entreprise qui détermine les finalités et moyens du traitement doit être indiquée ici avant publication définitive.",
          "À compléter : dénomination légale, forme juridique, adresse postale, pays d'établissement et, le cas échéant, coordonnées du représentant dans l'Union européenne et du délégué à la protection des données.",
          "Pour toute question concernant la confidentialité : contact@cycloriva.com.",
        ],
      },
      {
        id: "data",
        title: "2. Données personnelles concernées",
        paragraphs: [
          "Selon les fonctionnalités effectivement utilisées, une boutique en ligne peut traiter les informations communiquées dans les formulaires de commande, de contact et d'assistance.",
          "La liste exacte doit être rapprochée des champs réellement collectés par le site, de sa base de données et de ses journaux techniques.",
        ],
        points: [
          "Identité et coordonnées : nom, prénom, adresse e-mail et téléphone, lorsque demandés.",
          "Informations de livraison : pays, ville, code postal et adresse.",
          "Informations relatives aux commandes : références, produits, quantités et statut.",
          "Messages et échanges avec l'assistance.",
          "Données techniques nécessaires au fonctionnement et à la sécurité du service, selon la configuration réelle.",
        ],
      },
      {
        id: "purposes",
        title: "3. Finalités de traitement",
        paragraphs: [
          "Les traitements mis en œuvre doivent répondre à des objectifs précis, légitimes et communiqués aux personnes concernées.",
        ],
        points: [
          "Enregistrer et gérer les commandes et les demandes des clients.",
          "Préparer les livraisons lorsqu'une commande est effectivement prise en charge.",
          "Répondre aux demandes envoyées au service client.",
          "Gérer les obligations comptables et légales applicables.",
          "Protéger le site contre les accès non autorisés et les abus.",
          "Effectuer d'éventuelles actions marketing uniquement lorsque leur base légale et les exigences de consentement applicables sont respectées.",
        ],
      },
      {
        id: "legal",
        title: "4. Bases juridiques",
        paragraphs: [
          "Chaque traitement doit reposer sur une base juridique identifiée. La base appropriée varie selon la finalité et le fonctionnement réel du service.",
        ],
        points: [
          "Exécution d'un contrat ou mesures précontractuelles : traitement nécessaire des commandes et demandes liées à un achat.",
          "Obligation légale : conservation de certaines informations lorsqu'une règle applicable l'impose.",
          "Intérêt légitime : certains traitements de sécurité, sous réserve d'une évaluation appropriée.",
          "Consentement : lorsque nécessaire, notamment pour certains cookies ou messages commerciaux.",
        ],
      },
      {
        id: "recipients",
        title: "5. Destinataires et sous-traitants",
        paragraphs: [
          "Certaines données peuvent devoir être communiquées à des prestataires intervenant effectivement dans l'hébergement, le stockage, les e-mails, le paiement ou la livraison.",
          "Leur liste, leur rôle et les catégories de données auxquelles ils accèdent doivent être vérifiés. La présence d'une bibliothèque logicielle dans le code ne prouve pas qu'un prestataire traite effectivement des données de clients.",
          "Les contrats et garanties appropriés doivent être mis en place lorsque la réglementation le prévoit.",
        ],
      },
      {
        id: "retention",
        title: "6. Durée de conservation",
        paragraphs: [
          "Les données personnelles doivent être conservées pendant une durée limitée, déterminée par leur finalité et les obligations légales applicables.",
          "À compléter avant publication : durée ou critères précis de conservation des commandes, échanges de contact, documents comptables, journaux techniques et éventuelles données marketing.",
          "Une demande de suppression peut être soumise aux exceptions légales, notamment lorsque certaines informations doivent être conservées.",
        ],
      },
      {
        id: "security",
        title: "7. Sécurité des données",
        paragraphs: [
          "La sécurité doit reposer sur des mesures techniques et organisationnelles adaptées aux risques : gestion des accès, protection des identifiants, sauvegardes et surveillance des incidents lorsque cela est pertinent.",
          "Le fait d'afficher cette page ne garantit pas à lui seul que toutes les mesures de sécurité sont en place. Les protections doivent être effectivement configurées, maintenues et testées.",
          "Ne transmettez jamais votre mot de passe, vos codes bancaires ou des données de carte sensibles dans un message d'assistance.",
        ],
      },
      {
        id: "cookies",
        title: "8. Cookies et technologies similaires",
        paragraphs: [
          "Un site peut utiliser des cookies ou technologies similaires nécessaires à des fonctions comme la session, la sécurité ou les préférences.",
          "Les cookies de mesure d'audience ou de publicité, lorsqu'ils sont utilisés, peuvent nécessiter un consentement préalable selon la réglementation applicable.",
          "À compléter : inventaire réel des cookies et autres traceurs, leurs finalités, durées, fournisseurs et mécanisme permettant d'accepter, refuser ou modifier les choix lorsque nécessaire.",
          "Cette page ne constitue pas, à elle seule, une plateforme de gestion du consentement.",
        ],
      },
      {
        id: "transfers",
        title: "9. Transferts internationaux",
        paragraphs: [
          "L'utilisation de certains services techniques peut entraîner un traitement ou un accès aux données depuis un pays situé hors de l'Espace économique européen.",
          "À vérifier : lieux réels de traitement, prestataires concernés et garanties légales applicables, notamment les décisions d'adéquation ou mécanismes de transfert appropriés.",
          "Aucun transfert international particulier n'est affirmé sans vérification de l'architecture déployée.",
        ],
      },
      {
        id: "rights",
        title: "10. Vos droits",
        paragraphs: [
          "Lorsque le RGPD s'applique, les personnes concernées disposent de droits selon les conditions fixées par la réglementation.",
          "Pour exercer un droit ou poser une question sur les données personnelles, écrivez à contact@cycloriva.com. Une vérification proportionnée de votre identité peut être nécessaire avant la communication de données.",
        ],
        points: [
          "Droit d'accès aux données vous concernant.",
          "Droit de rectification des données inexactes.",
          "Droit à l'effacement lorsque les conditions sont réunies.",
          "Droit à la limitation de certains traitements.",
          "Droit d'opposition dans les cas prévus par la loi.",
          "Droit à la portabilité lorsque les conditions s'appliquent.",
          "Droit de retirer un consentement sans effet rétroactif sur les traitements antérieurs licites.",
          "Droits relatifs aux décisions exclusivement automatisées, lorsque ces traitements existent.",
        ],
      },
      {
        id: "complaints",
        title: "11. Réclamations",
        paragraphs: [
          "Si le RGPD s'applique et que vous estimez qu'un traitement de vos données viole vos droits, vous pouvez déposer une réclamation auprès d'une autorité de contrôle compétente.",
          "Vous pouvez également contacter CYCLORIVA à contact@cycloriva.com pour demander des précisions sur un traitement.",
        ],
      },
      {
        id: "changes",
        title: "12. Modifications de cette politique",
        paragraphs: [
          "Cette page peut être mise à jour pour tenir compte des changements de fonctionnement du site, des prestataires et des obligations légales.",
          "Avant publication définitive, CYCLORIVA doit définir une date de prise d'effet réelle et une procédure appropriée pour informer les personnes des modifications importantes.",
        ],
      },
    ],

    faqTitle: "Questions fréquentes sur les données",
    faqDescription: "Cliquez sur une question pour lire sa réponse.",

    faq: [
      {
        question: "Pourquoi demandez-vous mes coordonnées ?",
        answer:
          "Les coordonnées demandées lors d'une commande servent notamment à gérer celle-ci et à communiquer les informations nécessaires. Les informations recueillies dans un formulaire de contact servent à traiter votre demande.",
      },
      {
        question: "Puis-je demander la suppression de mes données ?",
        answer:
          "Oui, lorsque le droit applicable le permet. Certaines données peuvent cependant devoir être conservées pour respecter une obligation légale ou défendre des droits.",
      },
      {
        question: "Comment exercer mes droits ?",
        answer:
          "Écrivez à contact@cycloriva.com en précisant votre demande. CYCLORIVA doit appliquer la procédure et les délais prévus par la réglementation applicable.",
      },
      {
        question: "CYCLORIVA utilise-t-il des cookies publicitaires ?",
        answer:
          "Cela doit être confirmé par un audit des technologies réellement activées. Aucun outil publicitaire ne doit être déclaré absent ou présent sans vérification.",
      },
      {
        question: "Les données sont-elles transmises à d'autres sociétés ?",
        answer:
          "Des prestataires peuvent intervenir dans le traitement des commandes et le fonctionnement du site. Leur identité et leur rôle doivent être documentés dans la politique définitive.",
      },
    ],

    contactTitle: "Contacter CYCLORIVA",
    contactDescription:
      "Pour toute question concernant vos données personnelles, utilisez notre adresse de contact.",
    contactEmailLabel: "Confidentialité et questions générales",
    ordersEmailLabel: "Questions concernant les commandes",
    contactButton: "Page Contact",
    serviceButton: "Service client",

    closingTitle: "Une question sur vos données personnelles ?",
    closingDescription:
      "Contactez CYCLORIVA pour demander des informations ou exercer un droit prévu par la réglementation applicable.",
    closingButton: "Nous envoyer un message",

    footerNotice:
      "Cette version constitue une structure de politique de confidentialité à compléter et à valider avant publication définitive. Les informations spécifiques à l'entreprise et à ses traitements doivent être exactes.",
  },

  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    home: "Home",
    pageTitle: "Privacy Policy",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    metaDescription:
      "CYCLORIVA information about personal data, privacy, cookies, data retention and user rights.",

    heroBadge: "DATA PROTECTION",
    heroTitle: "Your personal data and privacy.",
    heroDescription:
      "Find information about the handling of personal data, the purposes of processing and your rights when using CYCLORIVA.",
    readPolicy: "Read the policy",
    contactUs: "Contact us",

    summaryTitle: "Contents",
    summaryDescription: "Go directly to a specific section.",

    overviewTitle: "Data protection principles",
    overviewDescription:
      "Principles that should guide the processing of personal information.",
    overviewCards: [
      {
        title: "Transparency",
        description: "Explain what data is used and why.",
      },
      {
        title: "Data minimisation",
        description: "Collect only information needed for defined purposes.",
      },
      {
        title: "Controlled access",
        description: "Apply appropriate safeguards to personal data.",
      },
      {
        title: "Individual rights",
        description: "Provide ways to exercise applicable privacy rights.",
      },
    ],

    importantTitle: "Details required before publication",
    importantDescription:
      "The legal entity's identity and address, exact retention periods, processors, international transfers and cookie technologies must be verified against CYCLORIVA's actual operations before the definitive policy is published.",

    sections: [
      {
        id: "controller",
        title: "1. Data controller",
        paragraphs: [
          "CYCLORIVA is the online store's name. The legal entity determining the purposes and means of processing must be identified before final publication.",
          "To complete: legal name, company form, postal address, country of establishment and, where required, the EU representative and data protection officer.",
          "Privacy enquiries: contact@cycloriva.com.",
        ],
      },
      {
        id: "data",
        title: "2. Categories of personal data",
        paragraphs: [
          "Depending on the features actually used, an online store may process data submitted through checkout, contact and customer service forms.",
          "The exact categories must be checked against the live forms, database and technical logs.",
        ],
        points: [
          "Name and contact details, where requested.",
          "Delivery address and destination.",
          "Order references, products and status.",
          "Customer support messages.",
          "Technical and security data, depending on configuration.",
        ],
      },
      {
        id: "purposes",
        title: "3. Purposes of processing",
        paragraphs: [
          "Personal data must only be processed for defined and legitimate purposes.",
        ],
        points: [
          "Record and manage orders.",
          "Arrange delivery where applicable.",
          "Respond to support enquiries.",
          "Meet applicable legal and accounting duties.",
          "Protect the website and prevent abuse.",
          "Carry out marketing only when a valid legal basis and any required consent are in place.",
        ],
      },
      {
        id: "legal",
        title: "4. Legal bases",
        paragraphs: [
          "Each processing activity needs an identified lawful basis appropriate to its purpose.",
        ],
        points: [
          "Contract or pre-contractual steps for orders.",
          "Legal obligations for records required by law.",
          "Legitimate interests for certain security activities, subject to appropriate assessment.",
          "Consent where required, including certain cookies or promotional communications.",
        ],
      },
      {
        id: "recipients",
        title: "5. Recipients and processors",
        paragraphs: [
          "Actual providers involved in hosting, storage, email, payment or delivery may process relevant data.",
          "Their identities and roles must be verified. The presence of a software library alone does not establish actual processing by a provider.",
          "Appropriate data processing agreements and safeguards are required where applicable.",
        ],
      },
      {
        id: "retention",
        title: "6. Data retention",
        paragraphs: [
          "Personal data should not be kept longer than necessary for the purposes of processing or applicable legal obligations.",
          "To complete: actual retention periods or criteria for orders, messages, accounting documents, logs and any marketing data.",
          "Certain legal retention obligations may prevent immediate deletion.",
        ],
      },
      {
        id: "security",
        title: "7. Data security",
        paragraphs: [
          "Suitable technical and organisational security measures should protect personal data, including access controls, credential protection and relevant incident procedures.",
          "Publishing this page does not itself establish that every security control is implemented.",
          "Never provide passwords or sensitive banking credentials through customer support messages.",
        ],
      },
      {
        id: "cookies",
        title: "8. Cookies and similar technologies",
        paragraphs: [
          "Some cookies may support essential site functions, including sessions or security.",
          "Analytics and advertising technologies may require prior consent under applicable rules.",
          "To complete: actual cookie inventory, providers, purposes, lifetimes and appropriate consent controls.",
          "This page does not itself implement a cookie consent mechanism.",
        ],
      },
      {
        id: "transfers",
        title: "9. International transfers",
        paragraphs: [
          "Certain service providers may process or access data outside the European Economic Area.",
          "Actual processing locations, providers and applicable safeguards, including adequacy decisions or appropriate transfer mechanisms, must be checked.",
          "No specific transfer is claimed without verification.",
        ],
      },
      {
        id: "rights",
        title: "10. Your rights",
        paragraphs: [
          "Where the GDPR applies, individuals may exercise their rights subject to the relevant legal conditions.",
          "Contact contact@cycloriva.com to make a request. Proportionate identity verification may be required.",
        ],
        points: [
          "Access to personal data.",
          "Correction of inaccurate data.",
          "Erasure where applicable.",
          "Restriction of processing.",
          "Objection to certain processing.",
          "Data portability where applicable.",
          "Withdrawal of consent without affecting prior lawful processing.",
          "Protection regarding solely automated decisions where applicable.",
        ],
      },
      {
        id: "complaints",
        title: "11. Complaints",
        paragraphs: [
          "Where the GDPR applies, individuals may complain to a competent supervisory authority if they consider that their rights have been violated.",
          "You can also contact CYCLORIVA at contact@cycloriva.com.",
        ],
      },
      {
        id: "changes",
        title: "12. Changes to this policy",
        paragraphs: [
          "This policy may be updated as website operations, providers or legal requirements change.",
          "A real effective date and appropriate notification procedures must be established before definitive publication.",
        ],
      },
    ],

    faqTitle: "Privacy FAQ",
    faqDescription: "Select a question to see the answer.",
    faq: [
      {
        question: "Why are my contact details requested?",
        answer:
          "Order contact details are used for relevant ordering processes. Contact form information is used to handle your enquiry.",
      },
      {
        question: "Can I request data deletion?",
        answer:
          "Yes, where applicable law allows it. Some information may need to be retained for legal obligations or legal claims.",
      },
      {
        question: "How can I exercise my privacy rights?",
        answer:
          "Email contact@cycloriva.com with your request. The appropriate statutory procedures and deadlines apply.",
      },
      {
        question: "Does CYCLORIVA use advertising cookies?",
        answer:
          "This must be determined through an audit of the technologies actually enabled. Their use or absence should not be assumed.",
      },
      {
        question: "Is my data shared with service providers?",
        answer:
          "Providers may support store operations. Their identities and processing roles must be documented in the final policy.",
      },
    ],

    contactTitle: "Contact CYCLORIVA",
    contactDescription:
      "For questions about personal data, use our contact address.",
    contactEmailLabel: "Privacy and general questions",
    ordersEmailLabel: "Order enquiries",
    contactButton: "Contact page",
    serviceButton: "Customer service",

    closingTitle: "Questions about your personal data?",
    closingDescription:
      "Contact CYCLORIVA for information or to make a privacy rights request.",
    closingButton: "Send a message",

    footerNotice:
      "This policy structure requires completion and verification before definitive publication. Company-specific processing details must be accurate.",
  },

  // ==========================================================
  // DEUTSCH
  // ==========================================================

  de: {
    home: "Startseite",
    pageTitle: "Datenschutzerklärung",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    metaDescription:
      "CYCLORIVA Informationen zu personenbezogenen Daten, Cookies, Aufbewahrung und Datenschutzrechten.",

    heroBadge: "DATENSCHUTZ",
    heroTitle: "Ihre persönlichen Daten und Ihre Privatsphäre.",
    heroDescription:
      "Erfahren Sie mehr über mögliche Datenverarbeitungen, deren Zwecke und Ihre Rechte bei CYCLORIVA.",
    readPolicy: "Erklärung lesen",
    contactUs: "Kontakt",

    summaryTitle: "Inhaltsverzeichnis",
    summaryDescription: "Direkt zu einem Abschnitt wechseln.",

    overviewTitle: "Grundsätze des Datenschutzes",
    overviewDescription:
      "Grundsätze für den Umgang mit personenbezogenen Daten.",
    overviewCards: [
      {
        title: "Transparenz",
        description: "Verarbeitung und Zwecke verständlich erklären.",
      },
      {
        title: "Datenminimierung",
        description: "Nur erforderliche Informationen erheben.",
      },
      {
        title: "Zugriffsschutz",
        description: "Geeignete Schutzmaßnahmen einsetzen.",
      },
      {
        title: "Betroffenenrechte",
        description: "Die Ausübung gesetzlicher Rechte ermöglichen.",
      },
    ],

    importantTitle: "Vor Veröffentlichung zu ergänzen",
    importantDescription:
      "Die rechtliche Identität und Anschrift des Verantwortlichen, tatsächliche Speicherfristen, Dienstleister, internationale Datenübermittlungen und Cookies müssen anhand des produktiven CYCLORIVA-Systems überprüft werden.",

    sections: [
      {
        id: "controller",
        title: "1. Verantwortlicher",
        paragraphs: [
          "CYCLORIVA ist die Bezeichnung des Online-Shops. Die rechtlich verantwortliche Stelle ist vor der endgültigen Veröffentlichung vollständig anzugeben.",
          "Zu ergänzen: Firmenname, Rechtsform, Postanschrift, Sitzland sowie gegebenenfalls EU-Vertreter und Datenschutzbeauftragter.",
          "Datenschutzanfragen: contact@cycloriva.com.",
        ],
      },
      {
        id: "data",
        title: "2. Kategorien personenbezogener Daten",
        paragraphs: [
          "Je nach tatsächlich genutzten Funktionen können Daten aus Bestell-, Kontakt- und Supportformularen verarbeitet werden.",
          "Die genauen Datenkategorien müssen mit Formularen, Datenbank und technischen Protokollen abgeglichen werden.",
        ],
        points: [
          "Name und Kontaktdaten, soweit abgefragt.",
          "Lieferanschrift und Lieferland.",
          "Bestellnummern, Artikel und Status.",
          "Nachrichten an den Kundenservice.",
          "Technische und sicherheitsbezogene Daten je nach Konfiguration.",
        ],
      },
      {
        id: "purposes",
        title: "3. Zwecke der Verarbeitung",
        paragraphs: [
          "Jede Verarbeitung muss einem festgelegten und rechtmäßigen Zweck dienen.",
        ],
        points: [
          "Bestellungen erfassen und bearbeiten.",
          "Lieferungen gegebenenfalls organisieren.",
          "Kundenanfragen beantworten.",
          "Gesetzliche und buchhalterische Pflichten erfüllen.",
          "Website schützen und Missbrauch verhindern.",
          "Marketing nur mit geeigneter Rechtsgrundlage und erforderlicher Einwilligung durchführen.",
        ],
      },
      {
        id: "legal",
        title: "4. Rechtsgrundlagen",
        paragraphs: [
          "Für jeden Verarbeitungsvorgang muss eine passende Rechtsgrundlage bestimmt werden.",
        ],
        points: [
          "Vertragserfüllung oder vorvertragliche Maßnahmen bei Bestellungen.",
          "Rechtliche Verpflichtungen bei gesetzlich vorgeschriebenen Aufzeichnungen.",
          "Berechtigte Interessen bei bestimmten Sicherheitsmaßnahmen nach Interessenabwägung.",
          "Einwilligung, soweit für Cookies oder Werbung erforderlich.",
        ],
      },
      {
        id: "recipients",
        title: "5. Empfänger und Auftragsverarbeiter",
        paragraphs: [
          "Tatsächlich eingesetzte Dienstleister für Hosting, Datenspeicherung, E-Mail, Zahlung oder Lieferung können Daten verarbeiten.",
          "Anbieter, Rollen und Datenkategorien müssen geprüft werden. Eine installierte Bibliothek beweist keine aktive Datenverarbeitung.",
          "Erforderliche Datenschutzvereinbarungen und Garantien sind umzusetzen.",
        ],
      },
      {
        id: "retention",
        title: "6. Speicherdauer",
        paragraphs: [
          "Personenbezogene Daten dürfen nur so lange gespeichert werden, wie dies für die Zwecke oder gesetzliche Verpflichtungen erforderlich ist.",
          "Zu ergänzen: konkrete Fristen oder Kriterien für Bestellungen, Nachrichten, Buchhaltung, Protokolle und gegebenenfalls Marketing.",
          "Gesetzliche Aufbewahrungspflichten können einer sofortigen Löschung entgegenstehen.",
        ],
      },
      {
        id: "security",
        title: "7. Datensicherheit",
        paragraphs: [
          "Geeignete technische und organisatorische Maßnahmen sollten Daten schützen, darunter Zugriffssteuerung und sichere Verwaltung von Zugangsdaten.",
          "Die Veröffentlichung dieser Erklärung ersetzt keine tatsächlich implementierten Sicherheitsmaßnahmen.",
          "Senden Sie keine Passwörter oder vertraulichen Bankdaten an den Kundenservice.",
        ],
      },
      {
        id: "cookies",
        title: "8. Cookies und ähnliche Technologien",
        paragraphs: [
          "Technisch erforderliche Cookies können für Sitzungen, Sicherheit oder Einstellungen genutzt werden.",
          "Analyse- oder Werbetechnologien können eine vorherige Einwilligung erfordern.",
          "Zu ergänzen: tatsächliche Cookies, Anbieter, Zwecke, Laufzeiten und erforderliche Einwilligungssteuerung.",
          "Diese Seite implementiert keinen Cookie-Consent-Manager.",
        ],
      },
      {
        id: "transfers",
        title: "9. Internationale Datenübermittlungen",
        paragraphs: [
          "Bei bestimmten Dienstleistern kann eine Verarbeitung außerhalb des Europäischen Wirtschaftsraums stattfinden.",
          "Die tatsächlichen Speicherorte und geeigneten rechtlichen Garantien müssen geprüft werden.",
          "Ungeprüfte internationale Datenübermittlungen werden hier nicht behauptet.",
        ],
      },
      {
        id: "rights",
        title: "10. Ihre Rechte",
        paragraphs: [
          "Soweit die DSGVO anwendbar ist, bestehen gesetzliche Betroffenenrechte unter den jeweiligen Voraussetzungen.",
          "Richten Sie Ihre Anfrage an contact@cycloriva.com. Eine angemessene Identitätsprüfung kann erforderlich sein.",
        ],
        points: [
          "Auskunft über gespeicherte Daten.",
          "Berichtigung unrichtiger Angaben.",
          "Löschung unter gesetzlichen Voraussetzungen.",
          "Einschränkung der Verarbeitung.",
          "Widerspruch gegen bestimmte Verarbeitungen.",
          "Datenübertragbarkeit, soweit anwendbar.",
          "Widerruf einer Einwilligung ohne rückwirkende Auswirkung.",
          "Rechte bei ausschließlich automatisierten Entscheidungen, soweit relevant.",
        ],
      },
      {
        id: "complaints",
        title: "11. Beschwerden",
        paragraphs: [
          "Soweit die DSGVO gilt, können Betroffene sich bei einer zuständigen Datenschutzaufsichtsbehörde beschweren.",
          "Sie können sich auch an contact@cycloriva.com wenden.",
        ],
      },
      {
        id: "changes",
        title: "12. Änderungen der Erklärung",
        paragraphs: [
          "Diese Erklärung kann bei Änderungen der Website, Dienstleister oder Rechtslage angepasst werden.",
          "Vor der endgültigen Veröffentlichung sind ein tatsächliches Gültigkeitsdatum und geeignete Informationsverfahren festzulegen.",
        ],
      },
    ],

    faqTitle: "Häufige Datenschutzfragen",
    faqDescription: "Klicken Sie auf eine Frage.",
    faq: [
      {
        question: "Warum werden meine Kontaktdaten benötigt?",
        answer:
          "Bestellangaben dienen der Bearbeitung von Bestellungen. Kontaktformulardaten werden zur Beantwortung Ihrer Anfrage verwendet.",
      },
      {
        question: "Kann ich die Löschung verlangen?",
        answer:
          "Ja, soweit die rechtlichen Voraussetzungen vorliegen. Bestimmte gesetzliche Aufbewahrungspflichten können eine Löschung begrenzen.",
      },
      {
        question: "Wie kann ich meine Rechte ausüben?",
        answer:
          "Schreiben Sie an contact@cycloriva.com. Es gelten die einschlägigen gesetzlichen Verfahren und Fristen.",
      },
      {
        question: "Verwendet CYCLORIVA Werbe-Cookies?",
        answer:
          "Dies muss anhand der tatsächlich aktivierten Technologien geprüft werden.",
      },
      {
        question: "Erhalten Dienstleister meine Daten?",
        answer:
          "Dienstleister können an der Shopverwaltung beteiligt sein. Ihre tatsächlichen Rollen müssen in der endgültigen Erklärung dokumentiert werden.",
      },
    ],

    contactTitle: "CYCLORIVA kontaktieren",
    contactDescription:
      "Bei Datenschutzfragen nutzen Sie bitte unsere Kontaktadresse.",
    contactEmailLabel: "Datenschutz und allgemeine Fragen",
    ordersEmailLabel: "Fragen zu Bestellungen",
    contactButton: "Kontaktseite",
    serviceButton: "Kundenservice",

    closingTitle: "Fragen zu Ihren Daten?",
    closingDescription:
      "Kontaktieren Sie CYCLORIVA für Informationen oder Datenschutzanfragen.",
    closingButton: "Nachricht senden",

    footerNotice:
      "Dieser Entwurf muss vor der endgültigen Veröffentlichung ergänzt und überprüft werden. Unternehmens- und verarbeitungsspezifische Angaben müssen korrekt sein.",
  },

  // ==========================================================
  // ITALIANO
  // ==========================================================

  it: {
    home: "Home",
    pageTitle: "Informativa sulla privacy",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    metaDescription:
      "Informazioni CYCLORIVA sui dati personali, cookie, conservazione e diritti degli utenti.",

    heroBadge: "PROTEZIONE DEI DATI",
    heroTitle: "I tuoi dati personali e la tua privacy.",
    heroDescription:
      "Scopri come possono essere trattati i dati personali, per quali finalità e quali diritti possono essere esercitati.",
    readPolicy: "Leggi l'informativa",
    contactUs: "Contattaci",

    summaryTitle: "Indice",
    summaryDescription: "Vai direttamente alla sezione desiderata.",

    overviewTitle: "Principi di protezione dei dati",
    overviewDescription:
      "Principi fondamentali per il trattamento delle informazioni personali.",
    overviewCards: [
      {
        title: "Trasparenza",
        description: "Spiegare i trattamenti e le relative finalità.",
      },
      {
        title: "Minimizzazione",
        description: "Raccogliere solo le informazioni necessarie.",
      },
      {
        title: "Accessi controllati",
        description: "Adottare protezioni appropriate.",
      },
      {
        title: "Diritti degli utenti",
        description: "Consentire l'esercizio dei diritti applicabili.",
      },
    ],

    importantTitle: "Informazioni da completare",
    importantDescription:
      "Prima della pubblicazione definitiva, verificare l'identità giuridica e l'indirizzo del titolare, i tempi di conservazione, i fornitori, gli eventuali trasferimenti internazionali e i cookie realmente utilizzati.",

    sections: [
      {
        id: "controller",
        title: "1. Titolare del trattamento",
        paragraphs: [
          "CYCLORIVA è il nome del negozio online. La persona giuridica responsabile delle finalità e dei mezzi del trattamento deve essere identificata prima della pubblicazione definitiva.",
          "Da completare: denominazione legale, forma giuridica, sede, paese e, se richiesto, rappresentante UE o responsabile della protezione dei dati.",
          "Contatto privacy: contact@cycloriva.com.",
        ],
      },
      {
        id: "data",
        title: "2. Categorie di dati personali",
        paragraphs: [
          "Secondo le funzionalità effettive, possono essere trattati i dati forniti durante acquisti e richieste di assistenza.",
          "La lista esatta deve essere verificata con moduli, database e registri tecnici.",
        ],
        points: [
          "Nome e recapiti, quando richiesti.",
          "Indirizzo di consegna.",
          "Riferimenti, prodotti e stato degli ordini.",
          "Messaggi all'assistenza.",
          "Dati tecnici e di sicurezza secondo la configurazione.",
        ],
      },
      {
        id: "purposes",
        title: "3. Finalità del trattamento",
        paragraphs: [
          "Ogni trattamento deve perseguire finalità specifiche e legittime.",
        ],
        points: [
          "Registrare e gestire gli ordini.",
          "Organizzare eventuali consegne.",
          "Rispondere alle richieste dei clienti.",
          "Rispettare obblighi legali e contabili.",
          "Proteggere il sito e prevenire abusi.",
          "Effettuare marketing solo con una base giuridica valida e gli eventuali consensi necessari.",
        ],
      },
      {
        id: "legal",
        title: "4. Basi giuridiche",
        paragraphs: [
          "Ogni attività deve essere associata alla base giuridica appropriata.",
        ],
        points: [
          "Esecuzione del contratto o misure precontrattuali.",
          "Obblighi legali per determinate registrazioni.",
          "Legittimo interesse per alcune misure di sicurezza, previa valutazione.",
          "Consenso quando necessario per cookie o comunicazioni promozionali.",
        ],
      },
      {
        id: "recipients",
        title: "5. Destinatari e responsabili",
        paragraphs: [
          "I fornitori realmente coinvolti in hosting, archiviazione, email, pagamenti o consegne possono trattare dati pertinenti.",
          "Identità e ruoli devono essere verificati. Una libreria installata non dimostra l'effettivo utilizzo di un servizio.",
          "Devono essere predisposti accordi e garanzie adeguati, ove richiesti.",
        ],
      },
      {
        id: "retention",
        title: "6. Conservazione dei dati",
        paragraphs: [
          "I dati devono essere conservati solo per il tempo necessario alle finalità e agli obblighi applicabili.",
          "Da completare: tempi effettivi o criteri per ordini, messaggi, documenti contabili, registri e dati marketing.",
          "Gli obblighi di legge possono impedire una cancellazione immediata.",
        ],
      },
      {
        id: "security",
        title: "7. Sicurezza",
        paragraphs: [
          "Sono necessarie misure tecniche e organizzative adeguate ai rischi, inclusi controlli di accesso e protezione delle credenziali.",
          "La pubblicazione di questa pagina non dimostra da sola l'implementazione delle protezioni.",
          "Non inviare password o dati bancari sensibili tramite i messaggi di assistenza.",
        ],
      },
      {
        id: "cookies",
        title: "8. Cookie e tecnologie simili",
        paragraphs: [
          "Alcuni cookie possono essere necessari per sessioni e sicurezza.",
          "Analisi e pubblicità possono richiedere consenso preventivo.",
          "Da completare: cookie reali, fornitori, finalità, durata e strumenti di scelta.",
          "Questa pagina non implementa un sistema di consenso.",
        ],
      },
      {
        id: "transfers",
        title: "9. Trasferimenti internazionali",
        paragraphs: [
          "Alcuni fornitori potrebbero trattare dati al di fuori dello Spazio economico europeo.",
          "Occorre verificare luoghi di trattamento e garanzie giuridiche applicabili.",
          "Non viene affermato alcun trasferimento specifico senza verifica.",
        ],
      },
      {
        id: "rights",
        title: "10. Diritti degli interessati",
        paragraphs: [
          "Quando si applica il GDPR, gli interessati possono esercitare i diritti previsti dalla legge.",
          "Per richieste scrivere a contact@cycloriva.com. Potrebbe essere richiesta una verifica proporzionata dell'identità.",
        ],
        points: [
          "Accesso ai dati personali.",
          "Rettifica dei dati inesatti.",
          "Cancellazione nei casi previsti.",
          "Limitazione del trattamento.",
          "Opposizione a determinati trattamenti.",
          "Portabilità dei dati se applicabile.",
          "Revoca del consenso senza effetti retroattivi.",
          "Diritti relativi a decisioni esclusivamente automatizzate, ove pertinenti.",
        ],
      },
      {
        id: "complaints",
        title: "11. Reclami",
        paragraphs: [
          "Quando si applica il GDPR, è possibile presentare un reclamo a un'autorità di controllo competente.",
          "È inoltre possibile scrivere a contact@cycloriva.com.",
        ],
      },
      {
        id: "changes",
        title: "12. Modifiche all'informativa",
        paragraphs: [
          "L'informativa può essere aggiornata in seguito a modifiche dei servizi o delle norme.",
          "Prima della pubblicazione definitiva occorre stabilire una data di efficacia reale.",
        ],
      },
    ],

    faqTitle: "Domande frequenti sulla privacy",
    faqDescription: "Seleziona una domanda per leggere la risposta.",
    faq: [
      {
        question: "Perché chiedete i miei recapiti?",
        answer:
          "I dati degli ordini servono alla gestione dell'acquisto; quelli dei moduli di contatto a rispondere alla richiesta.",
      },
      {
        question: "Posso chiedere la cancellazione?",
        answer:
          "Sì, quando previsto dalla legge. Alcuni dati possono dover essere conservati per obblighi legali.",
      },
      {
        question: "Come esercito i miei diritti?",
        answer:
          "Scrivi a contact@cycloriva.com. Si applicano le procedure e i termini previsti dalla legge.",
      },
      {
        question: "Utilizzate cookie pubblicitari?",
        answer:
          "È necessario verificare le tecnologie effettivamente attive sul sito.",
      },
      {
        question: "Condividete dati con fornitori?",
        answer:
          "Alcuni fornitori possono supportare le operazioni del negozio. I ruoli effettivi devono essere documentati.",
      },
    ],

    contactTitle: "Contatta CYCLORIVA",
    contactDescription:
      "Per domande sui dati personali utilizza il nostro indirizzo e-mail.",
    contactEmailLabel: "Privacy e domande generali",
    ordersEmailLabel: "Informazioni sugli ordini",
    contactButton: "Pagina Contatti",
    serviceButton: "Servizio clienti",

    closingTitle: "Hai domande sui tuoi dati?",
    closingDescription:
      "Contatta CYCLORIVA per informazioni o richieste relative alla privacy.",
    closingButton: "Invia un messaggio",

    footerNotice:
      "Questa struttura deve essere completata e verificata prima della pubblicazione definitiva. Le informazioni sui trattamenti reali devono essere corrette.",
  },

  // ==========================================================
  // ESPAÑOL
  // ==========================================================

  es: {
    home: "Inicio",
    pageTitle: "Política de privacidad",
    eyebrow: "BICICLETAS & MOVILIDAD ELÉCTRICA EN EUROPA",
    metaDescription:
      "Información CYCLORIVA sobre datos personales, cookies, conservación y derechos de privacidad.",

    heroBadge: "PROTECCIÓN DE DATOS",
    heroTitle: "Tus datos personales y tu privacidad.",
    heroDescription:
      "Consulta información sobre los posibles tratamientos de datos, sus finalidades y tus derechos.",
    readPolicy: "Leer la política",
    contactUs: "Contáctanos",

    summaryTitle: "Índice",
    summaryDescription: "Accede directamente a cada sección.",

    overviewTitle: "Principios de protección de datos",
    overviewDescription:
      "Principios fundamentales para el tratamiento de información personal.",
    overviewCards: [
      {
        title: "Transparencia",
        description: "Explicar qué datos se utilizan y por qué.",
      },
      {
        title: "Minimización",
        description: "Recopilar solo los datos necesarios.",
      },
      {
        title: "Acceso controlado",
        description: "Aplicar medidas de protección adecuadas.",
      },
      {
        title: "Derechos del usuario",
        description: "Facilitar el ejercicio de derechos aplicables.",
      },
    ],

    importantTitle: "Información pendiente antes de publicar",
    importantDescription:
      "Deben verificarse la identidad y dirección legal del responsable, los períodos de conservación, los proveedores, las transferencias internacionales y los sistemas de cookies realmente utilizados por CYCLORIVA.",

    sections: [
      {
        id: "controller",
        title: "1. Responsable del tratamiento",
        paragraphs: [
          "CYCLORIVA es el nombre de la tienda. La entidad jurídica responsable de determinar los fines y medios del tratamiento debe identificarse antes de publicar la política definitiva.",
          "Por completar: denominación legal, forma jurídica, domicilio, país y, cuando corresponda, representante en la UE o delegado de protección de datos.",
          "Consultas de privacidad: contact@cycloriva.com.",
        ],
      },
      {
        id: "data",
        title: "2. Categorías de datos personales",
        paragraphs: [
          "Según las funciones utilizadas, pueden tratarse datos facilitados en pedidos, formularios de contacto y atención al cliente.",
          "La lista exacta debe verificarse mediante los formularios, bases de datos y registros técnicos.",
        ],
        points: [
          "Nombre y datos de contacto cuando se soliciten.",
          "Dirección y destino de entrega.",
          "Referencias, artículos y estado de pedidos.",
          "Mensajes de asistencia.",
          "Datos técnicos y de seguridad según la configuración.",
        ],
      },
      {
        id: "purposes",
        title: "3. Finalidades del tratamiento",
        paragraphs: [
          "Cada tratamiento debe tener una finalidad definida y legítima.",
        ],
        points: [
          "Registrar y gestionar pedidos.",
          "Organizar entregas cuando corresponda.",
          "Responder a solicitudes de clientes.",
          "Cumplir obligaciones legales y contables.",
          "Proteger el sitio y evitar abusos.",
          "Realizar marketing únicamente con base legal válida y el consentimiento requerido.",
        ],
      },
      {
        id: "legal",
        title: "4. Bases jurídicas",
        paragraphs: [
          "Cada tratamiento requiere la base legal que corresponda a su finalidad.",
        ],
        points: [
          "Contrato o medidas precontractuales para pedidos.",
          "Obligaciones legales de conservación cuando correspondan.",
          "Interés legítimo para ciertas medidas de seguridad previa evaluación.",
          "Consentimiento cuando sea exigible para cookies o publicidad.",
        ],
      },
      {
        id: "recipients",
        title: "5. Destinatarios y encargados",
        paragraphs: [
          "Los proveedores efectivos de alojamiento, almacenamiento, correo, pagos o entregas pueden tratar datos.",
          "Es necesario verificar su identidad y funciones. Una biblioteca instalada no demuestra que el proveedor esté activo.",
          "Deben establecerse los acuerdos y garantías exigidos por la legislación aplicable.",
        ],
      },
      {
        id: "retention",
        title: "6. Conservación de datos",
        paragraphs: [
          "Los datos solo deben conservarse durante el tiempo necesario para sus finalidades y obligaciones legales.",
          "Por completar: períodos o criterios precisos para pedidos, mensajes, documentos contables, registros y marketing.",
          "Las obligaciones legales pueden impedir determinadas eliminaciones inmediatas.",
        ],
      },
      {
        id: "security",
        title: "7. Seguridad",
        paragraphs: [
          "Deben aplicarse medidas técnicas y organizativas apropiadas, como controles de acceso y protección de credenciales.",
          "Publicar esta página no demuestra por sí solo que todas las medidas estén implementadas.",
          "No compartas contraseñas ni datos bancarios sensibles por mensajes de asistencia.",
        ],
      },
      {
        id: "cookies",
        title: "8. Cookies y tecnologías similares",
        paragraphs: [
          "Algunas cookies pueden ser necesarias para sesiones o seguridad.",
          "Las tecnologías analíticas y publicitarias pueden requerir consentimiento previo.",
          "Por completar: inventario real de cookies, proveedores, finalidades, duración y controles de consentimiento.",
          "Esta página no implementa por sí sola una herramienta de consentimiento.",
        ],
      },
      {
        id: "transfers",
        title: "9. Transferencias internacionales",
        paragraphs: [
          "Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo.",
          "Es necesario comprobar las ubicaciones reales y las garantías jurídicas aplicables.",
          "No se afirma ninguna transferencia específica sin verificación.",
        ],
      },
      {
        id: "rights",
        title: "10. Tus derechos",
        paragraphs: [
          "Cuando se aplica el RGPD, las personas disponen de derechos con los requisitos previstos por la ley.",
          "Para ejercerlos, escribe a contact@cycloriva.com. Puede ser necesaria una verificación proporcionada de identidad.",
        ],
        points: [
          "Acceso a datos personales.",
          "Rectificación de datos incorrectos.",
          "Supresión cuando corresponda.",
          "Limitación del tratamiento.",
          "Oposición a determinados tratamientos.",
          "Portabilidad cuando sea aplicable.",
          "Retirada del consentimiento sin efecto retroactivo.",
          "Derechos relativos a decisiones exclusivamente automatizadas, cuando existan.",
        ],
      },
      {
        id: "complaints",
        title: "11. Reclamaciones",
        paragraphs: [
          "Cuando se aplica el RGPD, puedes reclamar ante una autoridad de protección de datos competente.",
          "También puedes escribir a contact@cycloriva.com.",
        ],
      },
      {
        id: "changes",
        title: "12. Cambios en la política",
        paragraphs: [
          "La política puede actualizarse cuando cambien las operaciones o los requisitos legales.",
          "Debe establecerse una fecha real de entrada en vigor antes de la publicación definitiva.",
        ],
      },
    ],

    faqTitle: "Preguntas frecuentes sobre privacidad",
    faqDescription: "Selecciona una pregunta para leer la respuesta.",
    faq: [
      {
        question: "¿Por qué solicitan mis datos?",
        answer:
          "Los datos de pedidos sirven para gestionar compras y los del formulario de contacto para responder consultas.",
      },
      {
        question: "¿Puedo solicitar la eliminación?",
        answer:
          "Sí, cuando la ley lo permita. Puede existir obligación legal de conservar determinados datos.",
      },
      {
        question: "¿Cómo ejerzo mis derechos?",
        answer:
          "Escribe a contact@cycloriva.com. Se aplicarán los procedimientos y plazos legales.",
      },
      {
        question: "¿CYCLORIVA utiliza cookies publicitarias?",
        answer: "Es necesario comprobar las tecnologías realmente habilitadas.",
      },
      {
        question: "¿Se comparten datos con proveedores?",
        answer:
          "Pueden intervenir proveedores de servicios. Sus funciones reales deben documentarse en la política definitiva.",
      },
    ],

    contactTitle: "Contacta con CYCLORIVA",
    contactDescription:
      "Para consultas sobre datos personales utiliza nuestro correo.",
    contactEmailLabel: "Privacidad y consultas generales",
    ordersEmailLabel: "Consultas sobre pedidos",
    contactButton: "Página de contacto",
    serviceButton: "Atención al cliente",

    closingTitle: "¿Tienes preguntas sobre tus datos?",
    closingDescription:
      "Contacta con CYCLORIVA para solicitar información o ejercer tus derechos.",
    closingButton: "Enviar un mensaje",

    footerNotice:
      "Esta estructura debe completarse y verificarse antes de su publicación definitiva. Los detalles de los tratamientos deben ser exactos.",
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
    title: `${t.pageTitle} | CYCLORIVA`,
    description: t.metaDescription,

    // Désactivé pendant que la politique est incomplète.
    // Passer à index:true après validation juridique.
    robots: {
      index: false,
      follow: true,
    },

    alternates: {
      canonical: `/${locale}/politique-confidentialite`,
      languages: {
        fr: "/fr/politique-confidentialite",
        en: "/en/politique-confidentialite",
        de: "/de/politique-confidentialite",
        it: "/it/politique-confidentialite",
        es: "/es/politique-confidentialite",
        "x-default": "/fr/politique-confidentialite",
      },
    },

    openGraph: {
      type: "website",
      title: `${t.pageTitle} | CYCLORIVA`,
      description: t.metaDescription,
    },
  };
}

// ============================================================
// 5. BANDEAU DESKTOP
// ============================================================

function PrivacyBanner({ t }: { t: PageTexts }) {
  return (
    <section className="relative hidden min-h-31.25 overflow-hidden bg-[#082a3f] lg:block">
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

        <h1 className="text-[30px] font-black tracking-tight text-white xl:text-[38px]">
          {t.pageTitle}
        </h1>
      </div>
    </section>
  );
}

// ============================================================
// 6. FIL D'ARIANE
// ============================================================

function PrivacyBreadcrumb({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 py-1 text-xs text-[#425969]"
    >
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 hover:text-[#109b24]"
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
// 7. HERO
// ============================================================

function PrivacyHero({ locale, t }: { locale: Locale; t: PageTexts }) {
  return (
    <section className="grid items-center gap-3 py-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-3 lg:py-1">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-2 text-[11px] font-extrabold text-[#078d21]">
          <ShieldCheck size={17} />
          {t.heroBadge}
        </span>

        <h2 className="mt-2 max-w-180 text-[29px] leading-[1.13] font-black tracking-tight text-[#102b39] sm:text-[40px] lg:text-[45px]">
          {t.heroTitle}
        </h2>

        <p className="mt-2 max-w-160 text-[14px] leading-7 text-[#536c7b] sm:text-[15px]">
          {t.heroDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <a href="#politique" className={GREEN_BUTTON}>
            <FileText size={18} />
            {t.readPolicy}
            <ArrowRight size={17} />
          </a>

          <Link href={`/${locale}/contact`} className={OUTLINE_BUTTON}>
            <Mail size={18} />
            {t.contactUs}
          </Link>
        </div>
      </div>

      <div className={`${CARD} overflow-hidden`}>
        <div className="relative flex min-h-57.5 items-center justify-center overflow-hidden bg-[#082b3e] p-3 sm:min-h-80">
          <div
            aria-hidden="true"
            className="absolute -right-14 -top-14 h-56 w-56 rounded-full border-40 border-[#109b24]/15"
          />

          <div className="relative flex w-full max-w-87.5 flex-col items-center rounded-2xl border border-white/20 bg-white/10 px-6 py-1 text-center backdrop-blur-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#109b24] text-white">
              <LockKeyhole size={43} />
            </div>

            <p className="mt-3 text-[12px] font-extrabold tracking-[0.13em] text-[#a8efb2]">
              CYCLORIVA
            </p>

            <h3 className="mt-2 text-[21px] font-black text-white">
              {t.heroBadge}
            </h3>

            <div className="mt-3 flex items-center gap-3 text-white/80">
              <ShieldCheck size={24} />
              <Database size={24} />
              <UserRoundCheck size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 8. CARTES DE PRINCIPES
// ============================================================

function PrivacyOverview({ t }: { t: PageTexts }) {
  const icons = [FileText, Database, LockKeyhole, UserRoundCheck] as const;

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2">
        <h2 className={SECTION_TITLE}>{t.overviewTitle}</h2>

        <p className="mt-2 text-[13px] leading-6 text-[#617586]">
          {t.overviewDescription}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {t.overviewCards.map((item, index) => {
          const Icon = icons[index];

          return (
            <article key={index} className={`${CARD} p-3`}>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                <Icon size={26} aria-hidden="true" />
              </div>

              <h3 className="text-[15px] font-extrabold text-[#102b39]">
                {item.title}
              </h3>

              <p className="mt-3 text-[12px] leading-6 text-[#607383]">
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
// 9. SOMMAIRE
// ============================================================

function PrivacySummary({ t }: { t: PageTexts }) {
  return (
    <nav aria-label={t.summaryTitle} className={`${CARD} p-3 sm:p-3`}>
      <div className="flex items-start gap-3">
        <FileText size={29} className="shrink-0 text-[#109b24]" />

        <div>
          <h2 className={SECTION_TITLE}>{t.summaryTitle}</h2>

          <p className="mt-2 text-[13px] text-[#607383]">
            {t.summaryDescription}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {t.sections.map((section) => (
          <a
            key={section.id}
            href={`#privacy-${section.id}`}
            className="group flex items-center justify-between gap-3 rounded-lg border border-[#e0e8ed] bg-[#fafcfd] px-3 py-3 text-[12px] font-bold text-[#314b5c] transition-colors hover:border-[#109b24] hover:bg-[#f1faf0] sm:text-[13px]"
          >
            <span className="min-w-0">{section.title}</span>

            <ChevronRight
              size={16}
              className="shrink-0 text-[#109b24] transition-transform group-hover:translate-x-1"
            />
          </a>
        ))}
      </div>
    </nav>
  );
}

// ============================================================
// 10. NOTICE DE VALIDATION
// ============================================================

function PrivacyNotice({ t }: { t: PageTexts }) {
  return (
    <aside className="rounded-xl border border-[#ead9b5] bg-[#fffaf0] p-3 sm:p-3">
      <div className="flex items-start gap-3">
        <CircleHelp size={23} className="mt-0.5 shrink-0 text-[#a77924]" />

        <div>
          <h2 className="text-[14px] font-extrabold text-[#75531d] sm:text-[15px]">
            {t.importantTitle}
          </h2>

          <p className="mt-2 text-[12px] leading-6 text-[#735b35] sm:text-[13px]">
            {t.importantDescription}
          </p>
        </div>
      </div>
    </aside>
  );
}

// ============================================================
// 11. UNE RUBRIQUE
// ============================================================

function PrivacyArticle({ section }: { section: PrivacySection }) {
  const Icon = SECTION_ICONS[section.id];

  return (
    <article
      id={`privacy-${section.id}`}
      className={`${CARD} scroll-mt-24 p-3 sm:p-3`}
    >
      <div className="mb-2 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
          <Icon size={24} aria-hidden="true" />
        </div>

        <h2 className="min-w-0 pt-1 text-[19px] font-black leading-7 tracking-tight text-[#102b39] sm:text-[22px]">
          {section.title}
        </h2>
      </div>

      <div className="space-y-4">
        {section.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-[13px] leading-7 text-[#50697b] sm:text-[14px]"
          >
            {paragraph}
          </p>
        ))}

        {section.points && section.points.length > 0 && (
          <ul className="space-y-3 pt-1">
            {section.points.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-1 shrink-0 text-[#109b24]"
                  aria-hidden="true"
                />

                <span className="text-[12px] leading-6 text-[#405b6d] sm:text-[13px]">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

// ============================================================
// 12. DOCUMENT DE CONFIDENTIALITÉ
// ============================================================

function PrivacyDocument({ t }: { t: PageTexts }) {
  return (
    <section id="politique" className="scroll-mt-24 space-y-5 py-1 lg:py-1">
      <PrivacyNotice t={t} />

      <PrivacySummary t={t} />

      <div className="grid gap-3">
        {t.sections.map((section) => (
          <PrivacyArticle key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 13. FAQ INTERACTIVE
// ============================================================

function PrivacyFAQ({ t }: { t: PageTexts }) {
  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2 flex items-start gap-3">
        <CircleHelp size={31} className="mt-0.5 shrink-0 text-[#109b24]" />

        <div>
          <h2 className={SECTION_TITLE}>{t.faqTitle}</h2>

          <p className="mt-2 text-[13px] text-[#617586]">{t.faqDescription}</p>
        </div>
      </div>

      <div className={`${CARD} space-y-2 p-3 sm:p-3`}>
        {t.faq.map((item, index) => (
          <details
            key={index}
            className="group overflow-hidden rounded-xl border border-[#dce6ed] bg-white open:border-[#b9dfb9]"
          >
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13px] font-extrabold leading-6 text-[#102b39] hover:bg-[#f7fbf7] focus-visible:outline-2 focus-visible:outline-[#109b24] sm:px-5 sm:text-[14px] [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">{item.question}</span>

              <ChevronDown
                size={19}
                className="shrink-0 text-[#109b24] transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>

            <div className="mx-3 mb-3 rounded-lg bg-[#ecf9e9] p-3 sm:mx-4 sm:mb-2">
              <p className="text-[12px] leading-6 text-[#234334] sm:text-[13px]">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 14. CONTACTS
// ============================================================

function PrivacyContacts({ locale, t }: { locale: Locale; t: PageTexts }) {
  const contacts = [
    {
      title: t.contactEmailLabel,
      address: CONTACT_EMAIL,
    },
    {
      title: t.ordersEmailLabel,
      address: ORDERS_EMAIL,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className={`${CARD} p-3 sm:p-3 lg:p-3`}>
        <div className="flex items-start gap-3">
          <Headphones size={31} className="shrink-0 text-[#109b24]" />

          <div>
            <h2 className={SECTION_TITLE}>{t.contactTitle}</h2>

            <p className="mt-2 text-[13px] leading-6 text-[#617586]">
              {t.contactDescription}
            </p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {contacts.map((contact) => (
            <a
              key={contact.address}
              href={`mailto:${contact.address}`}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e0e9ed] bg-[#fbfcfd] p-3 hover:border-[#109b24]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                <Mail size={23} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <h3 className="text-[12px] font-extrabold text-[#102b39]">
                  {contact.title}
                </h3>

                <p className="mt-1 break-all text-[13px] text-[#52697b]">
                  {contact.address}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link href={`/${locale}/contact`} className={GREEN_BUTTON}>
            <Mail size={18} />
            {t.contactButton}
            <ArrowRight size={17} />
          </Link>

          <Link href={`/${locale}/service-client`} className={OUTLINE_BUTTON}>
            <Headphones size={18} />
            {t.serviceButton}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 15. SECTION FINALE
// ============================================================

function PrivacyClosing({ locale, t }: { locale: Locale; t: PageTexts }) {
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
            size={39}
            className="mx-auto mb-2 text-[#8be975]"
            aria-hidden="true"
          />

          <h2 className="mx-auto max-w-187.5 text-[24px] font-black tracking-tight text-white sm:text-[31px]">
            {t.closingTitle}
          </h2>

          <p className="mx-auto mt-2 max-w-172.5 text-[13px] leading-6 text-[#d5e5eb] sm:text-[14px]">
            {t.closingDescription}
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#109b24] px-6 py-3 text-[13px] font-extrabold text-white hover:bg-[#07861b] sm:text-sm"
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

async function PrivacyPolicyPageContent({ params }: PageProps) {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return (
    <main
      data-page="privacy-policy"
      className="info-page w-full min-w-0 bg-white pb-2 text-[#102b39] lg:pb-2"
    >
      {/* Header du site : déjà présent dans le layout */}

      <PrivacyBanner t={t} />

      <div className={CONTAINER}>
        <PrivacyBreadcrumb locale={locale} t={t} />

        <PrivacyHero locale={locale} t={t} />

        <PrivacyOverview t={t} />

        <PrivacyDocument t={t} />

        <PrivacyFAQ t={t} />

        <PrivacyContacts locale={locale} t={t} />

        <PrivacyClosing locale={locale} t={t} />

        <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#6a7c88]">
          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />
          {t.footerNotice}
        </p>
      </div>

      {/* Footer du site : déjà présent dans le layout */}
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA POLITIQUE DE CONFIDENTIALITÉ
// ============================================================

export default function PrivacyPolicyPage(
  props: Parameters<typeof PrivacyPolicyPageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <PrivacyPolicyPageContent {...props} />
    </Suspense>
  );
}
