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
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock3,
  CreditCard,
  FileCheck2,
  FileText,
  Globe2,
  Headphones,
  House,
  Mail,
  MessageCircle,
  Package,
  RotateCcw,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

/**
 * ============================================================
 * CYCLORIVA — CONDITIONS GÉNÉRALES DE VENTE (CGV)
 * ============================================================
 *
 * FICHIER
 * app/[locale]/conditions-generales-vente/page.tsx
 *
 * Next.js 16 — App Router
 * React — TypeScript — Tailwind CSS 4
 *
 * UN SEUL FICHIER
 *
 * LANGUES :
 * FR / EN / DE / IT / ES
 *
 * COMPOSANTS INTERNES :
 * - Banner
 * - Breadcrumb
 * - Hero
 * - Overview
 * - LegalNotice
 * - TableOfContents
 * - TermsSections
 * - WithdrawalTemplate
 * - FAQ
 * - Contacts
 * - Closing
 *
 * AUCUN HEADER OU FOOTER DUPLIQUÉ.
 *
 * IMPORTANT :
 * - Les coordonnées légales sont à compléter.
 * - Les conditions commerciales doivent être vérifiées.
 * - La page n'encaisse pas de paiement.
 * - Elle ne crée pas de commande.
 * - Elle ne remplace pas une revue juridique.
 * - L'indexation SEO est désactivée
 *   jusqu'à finalisation des CGV.
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

type SectionId =
  | "seller"
  | "scope"
  | "products"
  | "availability"
  | "prices"
  | "orders"
  | "payments"
  | "delivery"
  | "withdrawal"
  | "refunds"
  | "warranty"
  | "responsibility"
  | "privacy"
  | "disputes"
  | "law"
  | "updates";

type LegalSection = {
  id: SectionId;
  title: string;
  paragraphs: string[];
  points?: string[];
};

type FAQItem = {
  question: string;
  answer: string;
};

type Translations = {
  home: string;
  pageTitle: string;
  eyebrow: string;
  metaDescription: string;

  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  readTerms: string;
  contactUs: string;

  overviewTitle: string;
  overviewDescription: string;
  overviewCards: {
    title: string;
    description: string;
  }[];

  noticeTitle: string;
  noticeDescription: string;

  contentsTitle: string;
  contentsDescription: string;

  sections: LegalSection[];

  withdrawalTitle: string;
  withdrawalDescription: string;
  withdrawalText: string[];

  faqTitle: string;
  faqDescription: string;
  faq: FAQItem[];

  helpTitle: string;
  helpDescription: string;
  ordersLabel: string;
  generalLabel: string;
  germany: string;
  france: string;
  contactPage: string;
  servicePage: string;

  closingTitle: string;
  closingDescription: string;
  closingButton: string;

  footerNotice: string;
};

// ============================================================
// 2. CONFIGURATION
// ============================================================

const SUPPORTED_LOCALES: Locale[] = ["fr", "en", "de", "it", "es"];

function resolveLocale(raw: string): Locale {
  if (!SUPPORTED_LOCALES.includes(raw as Locale)) {
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

const TERMS_PATH = "conditions-generales-vente";

const CONTAINER = "mx-auto w-full max-w-none " + "px-4 sm:px-6 lg:px-6 xl:px-8";

const CARD =
  "min-w-0 rounded-2xl border border-[#dce5ec] " +
  "bg-white shadow-[0_3px_15px_rgba(16,43,57,0.045)]";

const SECTION_TITLE =
  "text-[23px] font-black tracking-tight " +
  "text-[#102b39] sm:text-[29px] lg:text-[31px]";

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
  "transition-colors hover:bg-[#f4f8fa] sm:text-sm";

const SECTION_ICONS = {
  seller: Building2,
  scope: FileText,
  products: Bike,
  availability: Package,
  prices: CreditCard,
  orders: ShoppingBag,
  payments: ShieldCheck,
  delivery: Truck,
  withdrawal: RotateCcw,
  refunds: Clock3,
  warranty: BadgeCheck,
  responsibility: Scale,
  privacy: ShieldCheck,
  disputes: MessageCircle,
  law: Globe2,
  updates: FileCheck2,
} as const;

// ============================================================
// 3. TEXTES MULTILINGUES
// ============================================================

const TEXTS: Record<Locale, Translations> = {
  // ==========================================================
  // FRANÇAIS
  // ==========================================================

  fr: {
    home: "Accueil",
    pageTitle: "Conditions générales de vente",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    metaDescription:
      "Conditions générales de vente CYCLORIVA : commandes, prix, paiements, livraison, rétractation, retours et garanties.",

    heroBadge: "INFORMATIONS CONTRACTUELLES",
    heroTitle: "Des conditions de vente claires pour vos achats.",
    heroDescription:
      "Retrouvez les informations concernant les commandes de vélos et d'accessoires, les paiements, les livraisons et les droits des consommateurs.",
    readTerms: "Lire les conditions",
    contactUs: "Nous contacter",

    overviewTitle: "Les informations essentielles",
    overviewDescription:
      "Comprendre les principales étapes de votre achat et les protections applicables.",

    overviewCards: [
      {
        title: "Commande",
        description:
          "Consultez les caractéristiques, les quantités et le montant final avant de commander.",
      },
      {
        title: "Livraison",
        description:
          "Vérifiez la destination, les frais et le délai communiqué pour votre commande.",
      },
      {
        title: "Rétractation",
        description:
          "Les consommateurs peuvent bénéficier d'un droit légal de rétractation selon le droit applicable.",
      },
      {
        title: "Garantie",
        description:
          "Les droits légaux relatifs aux produits non conformes restent applicables.",
      },
    ],

    noticeTitle: "Informations obligatoires à compléter avant publication",
    noticeDescription:
      "L'identité juridique du vendeur, son adresse, son immatriculation éventuelle, les moyens de paiement actifs, les modalités de livraison, les frais de retour des vélos volumineux et les mécanismes de règlement des litiges doivent être confirmés. Ce document est un projet de CGV et non une version contractuelle définitivement validée.",

    contentsTitle: "Sommaire des conditions",
    contentsDescription: "Accédez directement à chaque article.",

    sections: [
      {
        id: "seller",
        title: "1. Identification du vendeur",
        paragraphs: [
          "CYCLORIVA est le nom commercial utilisé pour la boutique en ligne de vélos et d'accessoires.",
          "À compléter avant publication : dénomination sociale ou identité légale du vendeur, forme juridique, adresse géographique, pays d'établissement, numéro d'immatriculation, identifiant fiscal ou TVA lorsque applicable, et toute autre mention légalement requise.",
          "Contacts communiqués : sell@cycloriva.com pour les commandes et contact@cycloriva.com pour les demandes générales. Les coordonnées téléphoniques sont présentées dans la section Assistance.",
        ],
      },
      {
        id: "scope",
        title: "2. Objet et champ d'application",
        paragraphs: [
          "Les présentes conditions ont vocation à encadrer les ventes de vélos, vélos électriques, accessoires et produits associés proposés sur CYCLORIVA, lorsque les conditions définitives sont publiées et acceptées dans le processus de commande.",
          "Les règles impératives de protection des consommateurs applicables à la vente priment toute clause qui y serait contraire. Des modalités spécifiques peuvent concerner certains produits, destinations ou catégories d'acheteurs.",
        ],
      },
      {
        id: "products",
        title: "3. Produits et caractéristiques",
        paragraphs: [
          "Les caractéristiques essentielles, la marque, le modèle, la taille, les équipements et les informations techniques doivent être indiqués sur la fiche produit correspondante.",
          "Pour les vélos électriques, l'autonomie dépend notamment de la batterie, du terrain, de l'assistance et des conditions d'utilisation. Les spécifications doivent provenir de données produit fiables.",
          "Les images servent à présenter les produits. Les caractéristiques contractuelles communiquées lors de la commande font foi dans les limites du droit applicable.",
        ],
      },
      {
        id: "availability",
        title: "4. Disponibilité et stocks",
        paragraphs: [
          "La possibilité de commander un produit dépend de sa disponibilité réelle et des conditions applicables.",
          "Les stocks et les délais affichés doivent être fondés sur des données à jour. Si un produit ne peut être fourni après l'enregistrement d'une commande, le client doit être informé et les suites appropriées doivent être appliquées conformément au contrat et à la loi.",
        ],
      },
      {
        id: "prices",
        title: "5. Prix, taxes et frais supplémentaires",
        paragraphs: [
          "Le prix du produit, les taxes applicables et les frais supplémentaires doivent être présentés clairement avant l'engagement définitif du client.",
          "Le montant total dépend notamment des articles, des quantités, de la destination et des frais de livraison. Aucun supplément ne doit être facturé sans respecter les exigences légales d'information et de consentement.",
          "Pour une livraison vers la Suisse, les éventuelles formalités douanières, taxes à l'importation et responsabilités de paiement doivent être clairement précisées avant la conclusion du contrat.",
        ],
      },
      {
        id: "orders",
        title: "6. Commande et conclusion du contrat",
        paragraphs: [
          "Le client sélectionne les produits, vérifie son panier, renseigne ses informations de livraison et prend connaissance du récapitulatif avant confirmation.",
          "Lorsque la commande entraîne une obligation de paiement, le bouton final doit le signaler explicitement et le client doit disposer des informations essentielles avant son activation.",
          "Une commande enregistrée n'est pas automatiquement une commande payée. La conclusion du contrat, la confirmation envoyée au client et les modalités d'acceptation doivent être définies dans le processus réel de la boutique.",
          "Le client doit recevoir les informations contractuelles pertinentes sur un support durable lorsque la réglementation l'exige.",
        ],
      },
      {
        id: "payments",
        title: "7. Modalités de paiement",
        paragraphs: [
          "Les moyens de paiement disponibles doivent être affichés pendant la commande, uniquement lorsqu'ils sont réellement activés.",
          "Le règlement est considéré comme effectué lorsque le système de paiement concerné confirme la transaction conformément aux conditions applicables.",
          "CYCLORIVA ne demande pas au client de transmettre les données complètes de sa carte bancaire, son cryptogramme ou ses codes d'authentification par e-mail ou WhatsApp.",
          "À compléter : prestataires de paiement réellement utilisés, devises, calendrier d'encaissement et éventuelles modalités particulières.",
        ],
      },
      {
        id: "delivery",
        title: "8. Livraison et transfert des risques",
        paragraphs: [
          "Les destinations prévues sont l'Allemagne, la France, l'Espagne, l'Italie, la Suisse, l'Autriche, les Pays-Bas et la Belgique. La disponibilité doit être confirmée pour l'adresse et les articles commandés.",
          "Les frais et les délais de livraison doivent être portés à la connaissance du client avant la validation de la commande. En droit européen de la consommation, lorsque le contrat ne prévoit pas un autre délai, la livraison doit en principe intervenir sans retard injustifié et au plus tard dans les 30 jours.",
          "Pour les ventes couvertes par les règles européennes pertinentes, le risque de perte ou de dommage est généralement transféré au consommateur lorsqu'il prend physiquement possession du bien, sous réserve des exceptions légales.",
          "Les conditions applicables à un vélo volumineux, à sa manutention et à sa livraison doivent être précisées en fonction du transport réellement proposé.",
        ],
      },
      {
        id: "withdrawal",
        title: "9. Droit de rétractation",
        paragraphs: [
          "Pour les contrats à distance soumis au droit européen de la consommation, le consommateur dispose en principe de 14 jours à compter de la réception du bien pour communiquer clairement sa décision de se rétracter sans devoir la justifier. Des exceptions légales peuvent s'appliquer.",
          "Après notification, les biens doivent en principe être renvoyés dans les 14 jours suivants, selon les règles applicables.",
          "Les frais directs de renvoi peuvent être à la charge du consommateur si celui-ci en a été correctement informé avant l'achat. Pour un vélo qui ne peut pas être renvoyé normalement par la poste, une estimation ou les informations requises sur le coût de retour doivent être communiquées à l'avance.",
          "Le droit suisse interne ne prévoit pas un droit général de rétractation pour les achats en ligne ; le contrat et l'éventuelle application d'autres règles doivent être examinés.",
          "La procédure détaillée et un modèle de déclaration de rétractation figurent plus bas sur cette page.",
        ],
      },
      {
        id: "refunds",
        title: "10. Retours et remboursements",
        paragraphs: [
          "Dans le cadre d'une rétractation relevant des règles européennes, les sommes devant être remboursées le sont en principe dans les 14 jours suivant la notification. Le remboursement peut être différé, lorsque la loi le permet, jusqu'à réception du produit ou d'une preuve de son renvoi.",
          "Le remboursement utilise généralement le moyen de paiement initial, sauf accord valable sur un autre moyen.",
          "Les recours pour défaut de conformité sont distincts de la rétractation. Les frais et les modalités de retour dépendent de la situation et de la loi applicable.",
          "L'adresse de retour et les instructions logistiques doivent être communiquées sur la base de l'organisation réelle de CYCLORIVA. Aucun entrepôt fictif n'est indiqué ici.",
        ],
      },
      {
        id: "warranty",
        title: "11. Garanties légales et commerciales",
        paragraphs: [
          "Les consommateurs bénéficiant du droit européen disposent en principe d'une garantie légale de conformité d'au moins deux ans pour les biens concernés.",
          "Selon les conditions légales, un défaut de conformité peut ouvrir droit à une réparation, un remplacement, une réduction du prix ou une résolution du contrat.",
          "Une garantie commerciale du fabricant peut exister, mais sa durée et son étendue doivent être précisées dans la documentation du produit. Elle ne remplace pas la garantie légale.",
          "Les règles applicables aux ventes vers la Suisse doivent être examinées séparément.",
        ],
      },
      {
        id: "responsibility",
        title: "12. Obligations et responsabilités",
        paragraphs: [
          "Le vendeur reste tenu des obligations contractuelles et légales applicables, notamment en matière de livraison, de conformité et de sécurité des produits.",
          "Le client doit fournir des informations de livraison exactes et utiliser les produits conformément aux consignes de sécurité et d'entretien.",
          "Aucune clause des CGV ne peut exclure ou limiter des droits impératifs du consommateur lorsque cela est interdit par la loi.",
        ],
      },
      {
        id: "privacy",
        title: "13. Données personnelles",
        paragraphs: [
          "Les données nécessaires aux commandes et à l'assistance doivent être traitées conformément aux règles de protection des données applicables.",
          "Les finalités, les destinataires, les durées de conservation et les droits des personnes doivent être décrits dans une politique de confidentialité exacte et adaptée au fonctionnement réel de CYCLORIVA.",
          "Les détails complémentaires sont accessibles dans la page Politique de confidentialité de la boutique.",
        ],
      },
      {
        id: "disputes",
        title: "14. Réclamations et règlement des litiges",
        paragraphs: [
          "Pour toute réclamation relative à une commande, le client peut écrire à sell@cycloriva.com ou à contact@cycloriva.com.",
          "À compléter : procédure de traitement des réclamations et, lorsque la loi applicable l'exige, identité et coordonnées de l'organisme de médiation ou du dispositif de règlement extrajudiciaire compétent.",
          "Le consommateur conserve les voies de recours prévues par la réglementation applicable.",
        ],
      },
      {
        id: "law",
        title: "15. Loi applicable et juridiction",
        paragraphs: [
          "La loi applicable et les juridictions compétentes ne peuvent pas être définitivement désignées sans connaître le pays d'établissement du vendeur et les conditions des ventes transfrontalières.",
          "Une clause de choix de loi ne doit pas priver un consommateur des protections impératives qui lui sont applicables selon les règles de droit international privé pertinentes.",
          "À compléter après confirmation de l'identité juridique et du siège du vendeur.",
        ],
      },
      {
        id: "updates",
        title: "16. Publication et modification des CGV",
        paragraphs: [
          "La version contractuelle des CGV et sa date de prise d'effet doivent être clairement identifiables.",
          "Les modifications futures ne doivent pas altérer rétroactivement les droits acquis au titre d'un contrat déjà conclu, sauf dans les conditions légalement autorisées.",
          "CYCLORIVA doit conserver une version des conditions applicables à chaque commande lorsque cela est nécessaire pour établir les engagements contractuels.",
        ],
      },
    ],

    withdrawalTitle: "Modèle de déclaration de rétractation",
    withdrawalDescription:
      "Ce modèle facultatif peut être utilisé lorsque le droit de rétractation est applicable. Toute autre déclaration claire de rétractation est également possible.",

    withdrawalText: [
      "À l'attention du vendeur CYCLORIVA : [nom et adresse juridique à compléter].",
      "E-mail : contact@cycloriva.com",
      "Je vous notifie par la présente ma rétractation du contrat portant sur le bien suivant : [produit].",
      "Numéro de commande : [référence].",
      "Commandé le : [date]. Reçu le : [date].",
      "Nom du consommateur : [nom].",
      "Adresse du consommateur : [adresse].",
      "Date : [date de la déclaration].",
      "Signature : [uniquement si formulaire papier].",
    ],

    faqTitle: "Questions fréquentes sur les CGV",
    faqDescription: "Cliquez sur une question pour consulter sa réponse.",

    faq: [
      {
        question: "Les CGV s'appliquent-elles à toutes les commandes ?",
        answer:
          "Les conditions applicables sont celles qui ont été valablement communiquées et intégrées au contrat au moment de l'achat, sous réserve des droits impératifs du consommateur.",
      },
      {
        question: "Puis-je retourner un vélo après réception ?",
        answer:
          "Lorsque les règles européennes de vente à distance s'appliquent, le consommateur bénéficie généralement d'un délai de rétractation de 14 jours, sous réserve des exceptions légales. Les règles suisses diffèrent.",
      },
      {
        question: "Qui paie les frais de retour d'un vélo ?",
        answer:
          "Cela dépend du motif de retour et des informations précontractuelles. Les frais directs de retour en cas de rétractation peuvent incomber au consommateur si celui-ci en a été correctement informé. Les retours liés à une non-conformité suivent d'autres règles.",
      },
      {
        question: "Comment connaître le prix final ?",
        answer:
          "Le prix total, y compris les frais applicables, doit être présenté avant la confirmation définitive de la commande.",
      },
      {
        question: "Quels sont les moyens de paiement ?",
        answer:
          "Les moyens réellement activés doivent apparaître au moment de la commande. Aucun prestataire non confirmé n'est annoncé dans ces CGV.",
      },
      {
        question: "Que faire si mon vélo présente un défaut ?",
        answer:
          "Contactez contact@cycloriva.com avec votre référence de commande et une description du problème. Les garanties légales applicables restent en vigueur.",
      },
      {
        question: "Où envoyer une réclamation ?",
        answer:
          "Pour les commandes : sell@cycloriva.com. Pour les questions générales et les réclamations : contact@cycloriva.com.",
      },
    ],

    helpTitle: "Une question sur les conditions de vente ?",
    helpDescription:
      "Notre équipe est joignable pour vos questions sur les commandes et les informations commerciales.",

    ordersLabel: "Questions concernant les commandes",
    generalLabel: "Questions générales et réclamations",
    germany: "Allemagne",
    france: "France",
    contactPage: "Page Contact",
    servicePage: "Service client",

    closingTitle: "Besoin d'une précision avant de commander ?",
    closingDescription:
      "Contactez CYCLORIVA pour obtenir des informations sur les produits, les conditions de livraison et les modalités commerciales applicables.",
    closingButton: "Nous contacter",

    footerNotice:
      "Ce document est un projet de CGV à compléter et valider avant son utilisation contractuelle. Les dispositions impératives de protection des consommateurs prévalent.",
  },

  // ==========================================================
  // ENGLISH
  // ==========================================================

  en: {
    home: "Home",
    pageTitle: "Terms and Conditions of Sale",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    metaDescription:
      "CYCLORIVA terms of sale covering orders, prices, payments, delivery, withdrawal, returns and warranties.",

    heroBadge: "SALES INFORMATION",
    heroTitle: "Clear terms for your purchases.",
    heroDescription:
      "Read information about bicycle orders, payments, deliveries and consumer rights.",
    readTerms: "Read the terms",
    contactUs: "Contact us",

    overviewTitle: "Essential information",
    overviewDescription:
      "Understand the purchase process and the protections that may apply.",

    overviewCards: [
      {
        title: "Orders",
        description:
          "Review products, quantities and final costs before ordering.",
      },
      {
        title: "Delivery",
        description:
          "Check destinations, charges and applicable delivery estimates.",
      },
      {
        title: "Withdrawal",
        description:
          "Consumers may have statutory withdrawal rights under applicable law.",
      },
      {
        title: "Warranty",
        description:
          "Statutory rights for non-conforming goods remain applicable.",
      },
    ],

    noticeTitle: "Mandatory details to complete before publication",
    noticeDescription:
      "The seller's legal identity and address, registration details, active payment methods, delivery arrangements, bulky bicycle return costs and dispute resolution information require confirmation. This is a draft, not final legally approved contractual terms.",

    contentsTitle: "Contents",
    contentsDescription: "Navigate directly to a section.",

    sections: [
      {
        id: "seller",
        title: "1. Seller identification",
        paragraphs: [
          "CYCLORIVA is the trading name used for the online bicycle and accessories store.",
          "Before publication, insert the legal seller's name, legal form, geographical address, country of establishment, relevant registration and tax details, and all other legally required information.",
          "Order enquiries: sell@cycloriva.com. General enquiries: contact@cycloriva.com.",
        ],
      },
      {
        id: "scope",
        title: "2. Scope of these terms",
        paragraphs: [
          "These terms are intended to govern qualifying purchases of bicycles, e-bikes and related accessories after the definitive contractual terms are published and properly incorporated into checkout.",
          "Mandatory consumer protections take precedence over conflicting contractual clauses.",
        ],
      },
      {
        id: "products",
        title: "3. Products and specifications",
        paragraphs: [
          "Essential characteristics, brand, model, size, equipment and technical information should appear on the relevant product page.",
          "E-bike range depends on factors including battery, terrain, assistance level and use.",
          "Product descriptions must be based on accurate information. Contractually agreed characteristics remain relevant under applicable law.",
        ],
      },
      {
        id: "availability",
        title: "4. Availability",
        paragraphs: [
          "Purchases depend on actual stock and applicable ordering conditions.",
          "If an item cannot be supplied, the customer must be informed and the situation handled in accordance with the contract and law.",
        ],
      },
      {
        id: "prices",
        title: "5. Prices, taxes and charges",
        paragraphs: [
          "Product prices, applicable taxes and additional charges must be clearly disclosed before the final purchase commitment.",
          "Final totals may depend on quantities, shipping destination and delivery charges.",
          "Any Swiss customs duties, import charges and responsibility for payment must be clarified before purchase.",
        ],
      },
      {
        id: "orders",
        title: "6. Orders and contract formation",
        paragraphs: [
          "Customers select products, review the cart, enter delivery details and check the final summary.",
          "Where placing an order creates a payment obligation, the final button must clearly communicate that obligation.",
          "A recorded order is not necessarily paid. The actual rules for contract acceptance and confirmation must match the live checkout system.",
          "Relevant contract information must be supplied on a durable medium where required.",
        ],
      },
      {
        id: "payments",
        title: "7. Payment terms",
        paragraphs: [
          "Only genuinely enabled payment methods should be displayed at checkout.",
          "Payment is confirmed through the relevant payment service, not merely by recording an order.",
          "Never send full card details or bank authentication codes through email or WhatsApp.",
          "Before publication, specify actual providers, accepted currencies and collection arrangements.",
        ],
      },
      {
        id: "delivery",
        title: "8. Delivery and risk",
        paragraphs: [
          "Proposed destinations include Germany, France, Spain, Italy, Switzerland, Austria, the Netherlands and Belgium, subject to product and address availability.",
          "Charges and expected timing must be communicated before purchase. Under EU consumer rules, delivery is generally due without undue delay and within 30 days unless otherwise agreed.",
          "For qualifying EU consumer sales, the risk of loss generally passes when the consumer physically receives the goods, subject to legal exceptions.",
          "Bulky bicycle handling and delivery arrangements must reflect the services actually offered.",
        ],
      },
      {
        id: "withdrawal",
        title: "9. Right of withdrawal",
        paragraphs: [
          "For qualifying EU distance purchases, consumers generally have 14 days from receipt to notify withdrawal without giving a reason, subject to statutory exceptions.",
          "Goods generally must be returned within 14 days following the withdrawal notification.",
          "Direct return costs may be borne by the consumer if correctly disclosed before purchase. Bulky goods require appropriate advance information about return costs.",
          "Swiss domestic law provides no general withdrawal right for online purchases. Contractual terms and other applicable laws may affect individual cases.",
          "A withdrawal declaration template appears below.",
        ],
      },
      {
        id: "refunds",
        title: "10. Returns and refunds",
        paragraphs: [
          "Under qualifying EU withdrawal rules, reimbursement is generally due within 14 days from notice, subject to lawful postponement until the goods or evidence of return are received.",
          "Refunds generally use the original payment method unless another method is validly agreed.",
          "Remedies for non-conforming goods are distinct from change-of-mind withdrawals.",
          "Return addresses and instructions must reflect actual arrangements; no unverified warehouse address is stated.",
        ],
      },
      {
        id: "warranty",
        title: "11. Legal and commercial warranties",
        paragraphs: [
          "Qualifying EU consumer sales generally benefit from a legal guarantee of at least two years.",
          "Depending on the law and circumstances, available remedies may include repair, replacement, price reduction or contract termination.",
          "Any manufacturer's commercial warranty is separate and must be supported by product documentation.",
          "Swiss rules require separate consideration.",
        ],
      },
      {
        id: "responsibility",
        title: "12. Responsibilities",
        paragraphs: [
          "The seller remains responsible for applicable contractual and statutory obligations, including delivery, product conformity and safety.",
          "Customers should provide correct delivery information and follow product safety instructions.",
          "Nothing in these terms overrides mandatory consumer rights.",
        ],
      },
      {
        id: "privacy",
        title: "13. Personal data",
        paragraphs: [
          "Order and support data must be handled according to applicable privacy laws.",
          "The actual purposes, recipients, retention periods and individual rights must be accurately documented in CYCLORIVA's Privacy Policy.",
        ],
      },
      {
        id: "disputes",
        title: "14. Complaints and dispute resolution",
        paragraphs: [
          "Order complaints may be sent to sell@cycloriva.com or contact@cycloriva.com.",
          "Complete before publication: complaint handling procedures and details of any mandatory or available consumer mediation or alternative dispute resolution service.",
          "Consumers retain their applicable statutory remedies.",
        ],
      },
      {
        id: "law",
        title: "15. Governing law and jurisdiction",
        paragraphs: [
          "Governing law and competent courts cannot be definitively specified without confirming the seller's place of establishment and cross-border selling arrangements.",
          "A choice of law must not deprive consumers of mandatory protection where applicable.",
        ],
      },
      {
        id: "updates",
        title: "16. Effective date and changes",
        paragraphs: [
          "The contractual version and effective date must be clearly identified.",
          "Subsequent updates must respect rights arising from existing contracts and any applicable legal requirements.",
          "The terms applicable to each order should be retained where necessary.",
        ],
      },
    ],

    withdrawalTitle: "Model withdrawal declaration",
    withdrawalDescription:
      "This optional template may be used where the right of withdrawal applies. Any other unambiguous statement may also be used.",

    withdrawalText: [
      "To the CYCLORIVA seller: [legal name and postal address to be completed].",
      "Email: contact@cycloriva.com",
      "I hereby give notice that I withdraw from my contract for the following goods: [product].",
      "Order number: [reference].",
      "Ordered on: [date]. Received on: [date].",
      "Consumer name: [name].",
      "Consumer address: [address].",
      "Date: [date].",
      "Signature: [only if submitted on paper].",
    ],

    faqTitle: "Terms of sale FAQ",
    faqDescription: "Select a question to read the answer.",

    faq: [
      {
        question: "Which terms apply to an order?",
        answer:
          "The contractual terms properly disclosed and incorporated at the time of purchase apply, subject to mandatory consumer law.",
      },
      {
        question: "Can I return a bicycle?",
        answer:
          "For qualifying EU distance purchases, a 14-day withdrawal right generally applies, subject to legal exceptions. Swiss rules differ.",
      },
      {
        question: "Who pays bicycle return costs?",
        answer:
          "This depends on the reason and advance disclosures. Change-of-mind return costs may be borne by the consumer if properly disclosed; faulty goods are subject to separate rules.",
      },
      {
        question: "Where is the final price shown?",
        answer:
          "The total, including applicable charges, must appear before final order confirmation.",
      },
      {
        question: "Which payment methods are available?",
        answer:
          "Only payment methods actually activated should be displayed during checkout.",
      },
      {
        question: "What if my bicycle is faulty?",
        answer:
          "Contact contact@cycloriva.com with the order reference and issue details. Statutory remedies remain applicable.",
      },
      {
        question: "How can I complain?",
        answer:
          "Use sell@cycloriva.com for orders or contact@cycloriva.com for general complaints.",
      },
    ],

    helpTitle: "Questions about these terms?",
    helpDescription:
      "Contact us about order conditions and commercial information.",
    ordersLabel: "Order enquiries",
    generalLabel: "General enquiries and complaints",
    germany: "Germany",
    france: "France",
    contactPage: "Contact page",
    servicePage: "Customer service",

    closingTitle: "Need clarification before ordering?",
    closingDescription:
      "Contact CYCLORIVA for product, delivery and sales information.",
    closingButton: "Contact us",

    footerNotice:
      "This document is a draft requiring completion and review before contractual use. Mandatory consumer protections take precedence.",
  },

  // ==========================================================
  // DEUTSCH
  // ==========================================================

  de: {
    home: "Startseite",
    pageTitle: "Allgemeine Geschäftsbedingungen",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    metaDescription:
      "CYCLORIVA AGB zu Bestellungen, Preisen, Zahlung, Lieferung, Widerruf und Gewährleistung.",

    heroBadge: "VERKAUFSBEDINGUNGEN",
    heroTitle: "Klare Bedingungen für Ihren Einkauf.",
    heroDescription:
      "Informieren Sie sich über Bestellungen, Zahlungen, Lieferungen und Verbraucherrechte.",
    readTerms: "AGB lesen",
    contactUs: "Kontakt",

    overviewTitle: "Die wichtigsten Informationen",
    overviewDescription:
      "Wissenswertes zu Bestellung, Lieferung und Ihren Rechten.",

    overviewCards: [
      {
        title: "Bestellung",
        description:
          "Produkte, Mengen und Gesamtbetrag vor der Bestellung prüfen.",
      },
      {
        title: "Lieferung",
        description:
          "Lieferland, Versandkosten und zugesagte Fristen beachten.",
      },
      {
        title: "Widerruf",
        description:
          "Je nach anwendbarem Recht kann ein Widerrufsrecht bestehen.",
      },
      {
        title: "Gewährleistung",
        description:
          "Gesetzliche Ansprüche bei mangelhaften Waren bleiben bestehen.",
      },
    ],

    noticeTitle: "Vor Veröffentlichung unbedingt ergänzen",
    noticeDescription:
      "Rechtliche Identität und Anschrift des Verkäufers, Registrierung, aktive Zahlungsarten, tatsächliche Lieferbedingungen, Rücksendekosten für sperrige Fahrräder und die zuständigen Streitbeilegungsstellen müssen bestätigt werden. Dies ist ein Entwurf und keine abschließend geprüfte Vertragsfassung.",

    contentsTitle: "Inhaltsverzeichnis",
    contentsDescription: "Wählen Sie einen Abschnitt aus.",

    sections: [
      {
        id: "seller",
        title: "1. Angaben zum Verkäufer",
        paragraphs: [
          "CYCLORIVA ist die Geschäftsbezeichnung des Online-Shops für Fahrräder und Zubehör.",
          "Vor Veröffentlichung ergänzen: rechtlicher Firmenname, Rechtsform, geografische Anschrift, Sitzland, Handelsregister- und Steuerangaben, soweit erforderlich.",
          "Bestellungen: sell@cycloriva.com. Allgemeine Fragen: contact@cycloriva.com.",
        ],
      },
      {
        id: "scope",
        title: "2. Geltungsbereich",
        paragraphs: [
          "Diese AGB sollen nach endgültiger Veröffentlichung und wirksamer Einbeziehung in den Bestellvorgang die entsprechenden Verkäufe von Fahrrädern, E-Bikes und Zubehör regeln.",
          "Zwingende Verbraucherrechte gehen entgegenstehenden Regelungen vor.",
        ],
      },
      {
        id: "products",
        title: "3. Produkte und Eigenschaften",
        paragraphs: [
          "Wesentliche Eigenschaften, Marke, Modell, Größe und Ausstattung müssen in der jeweiligen Produktbeschreibung angegeben werden.",
          "Die Reichweite eines E-Bikes hängt unter anderem von Akku, Unterstützungsstufe, Gelände und Nutzung ab.",
          "Produktangaben müssen zutreffend sein. Die vereinbarten Eigenschaften bleiben maßgeblich.",
        ],
      },
      {
        id: "availability",
        title: "4. Verfügbarkeit",
        paragraphs: [
          "Die Bestellbarkeit hängt vom tatsächlichen Bestand und den jeweiligen Bedingungen ab.",
          "Ist eine Lieferung nicht möglich, ist der Kunde zu informieren und der Vorgang entsprechend Vertrag und Gesetz abzuwickeln.",
        ],
      },
      {
        id: "prices",
        title: "5. Preise, Steuern und Zusatzkosten",
        paragraphs: [
          "Produktpreise, anfallende Steuern und zusätzliche Gebühren müssen vor der verbindlichen Bestellung klar mitgeteilt werden.",
          "Der Gesamtbetrag kann von Artikelmenge, Lieferland und Versandkosten abhängen.",
          "Bei Lieferungen in die Schweiz müssen mögliche Zoll- und Einfuhrkosten sowie die Kostentragung vor Vertragsschluss geklärt werden.",
        ],
      },
      {
        id: "orders",
        title: "6. Bestellung und Vertragsschluss",
        paragraphs: [
          "Der Kunde wählt Artikel, prüft den Warenkorb und gibt die erforderlichen Lieferdaten ein.",
          "Eine zahlungspflichtige Bestellung muss durch eine entsprechend eindeutig beschriftete Schaltfläche ausgelöst werden.",
          "Eine erfasste Bestellung ist nicht automatisch bezahlt. Vertragsschluss, Annahme und Bestätigung müssen mit dem tatsächlichen Bestellprozess übereinstimmen.",
          "Vertragsinformationen sind gegebenenfalls auf einem dauerhaften Datenträger bereitzustellen.",
        ],
      },
      {
        id: "payments",
        title: "7. Zahlung",
        paragraphs: [
          "Es dürfen nur tatsächlich aktivierte Zahlungsmethoden angeboten werden.",
          "Die Zahlung gilt erst nach Bestätigung durch das zuständige Zahlungssystem als erfolgt.",
          "Vollständige Kartendaten und Bankbestätigungscodes dürfen nicht per E-Mail oder WhatsApp übermittelt werden.",
          "Vor Veröffentlichung sind Zahlungsanbieter, Währungen und Einzugsmodalitäten zu ergänzen.",
        ],
      },
      {
        id: "delivery",
        title: "8. Lieferung und Gefahrübergang",
        paragraphs: [
          "Vorgesehene Lieferländer sind Deutschland, Frankreich, Spanien, Italien, die Schweiz, Österreich, die Niederlande und Belgien. Die konkrete Lieferbarkeit ist zu prüfen.",
          "Versandkosten und Lieferfristen müssen vor der Bestellung mitgeteilt werden. Nach EU-Verbraucherrecht muss die Lieferung grundsätzlich ohne unangemessene Verzögerung, spätestens innerhalb von 30 Tagen erfolgen, sofern nichts anderes vereinbart wurde.",
          "Bei entsprechenden EU-Verbraucherkäufen geht das Transportrisiko grundsätzlich erst mit der tatsächlichen Übernahme durch den Verbraucher über, vorbehaltlich gesetzlicher Ausnahmen.",
          "Besondere Lieferbedingungen für sperrige Fahrräder müssen entsprechend dem tatsächlichen Transportangebot beschrieben werden.",
        ],
      },
      {
        id: "withdrawal",
        title: "9. Widerrufsrecht",
        paragraphs: [
          "Bei entsprechenden EU-Fernabsatzverträgen können Verbraucher grundsätzlich innerhalb von 14 Tagen nach Erhalt ohne Angabe von Gründen widerrufen. Gesetzliche Ausnahmen gelten.",
          "Nach dem Widerruf sind die Waren grundsätzlich innerhalb weiterer 14 Tage zurückzusenden.",
          "Direkte Rücksendekosten können bei ordnungsgemäßer Vorabinformation dem Verbraucher auferlegt werden. Bei sperrigen Waren sind die gesetzlichen Informationspflichten zu Rücksendekosten zu beachten.",
          "Das schweizerische Recht kennt für Online-Käufe kein allgemeines Widerrufsrecht. Vertrag und sonstiges anwendbares Recht können entscheidend sein.",
          "Ein Muster für die Widerrufserklärung steht weiter unten.",
        ],
      },
      {
        id: "refunds",
        title: "10. Rückgabe und Erstattung",
        paragraphs: [
          "Beim EU-Widerruf muss grundsätzlich innerhalb von 14 Tagen nach Erklärung erstattet werden, wobei ein gesetzlich zulässiger Aufschub bis zum Wareneingang oder Rücksendenachweis möglich ist.",
          "Grundsätzlich wird dasselbe Zahlungsmittel genutzt, sofern nichts anderes wirksam vereinbart wurde.",
          "Rechte wegen Mängeln sind vom Widerruf zu unterscheiden.",
          "Eine gültige Rücksendeadresse ist im konkreten Vorgang mitzuteilen.",
        ],
      },
      {
        id: "warranty",
        title: "11. Gewährleistung und Garantien",
        paragraphs: [
          "Für entsprechende EU-Verbraucherkäufe gilt grundsätzlich eine gesetzliche Gewährleistung von mindestens zwei Jahren.",
          "Mögliche gesetzliche Ansprüche sind je nach Fall Nachbesserung, Ersatzlieferung, Minderung oder Vertragsauflösung.",
          "Freiwillige Herstellergarantien gelten nur im dokumentierten Umfang und ersetzen keine gesetzlichen Rechte.",
          "Für Verkäufe in die Schweiz können abweichende Regeln gelten.",
        ],
      },
      {
        id: "responsibility",
        title: "12. Pflichten und Haftung",
        paragraphs: [
          "Der Verkäufer muss seine gesetzlichen und vertraglichen Pflichten erfüllen, insbesondere zu Lieferung, Konformität und Produktsicherheit.",
          "Kunden sollen korrekte Lieferdaten angeben und Sicherheitshinweise beachten.",
          "Gesetzlich zwingende Verbraucherrechte dürfen nicht unzulässig ausgeschlossen werden.",
        ],
      },
      {
        id: "privacy",
        title: "13. Personenbezogene Daten",
        paragraphs: [
          "Bestell- und Servicedaten müssen nach den geltenden Datenschutzregeln verarbeitet werden.",
          "Die konkreten Zwecke, Empfänger, Speicherfristen und Betroffenenrechte müssen in der Datenschutzerklärung zutreffend beschrieben werden.",
        ],
      },
      {
        id: "disputes",
        title: "14. Beschwerden und Streitbeilegung",
        paragraphs: [
          "Beschwerden können an sell@cycloriva.com oder contact@cycloriva.com gesendet werden.",
          "Vor Veröffentlichung ergänzen: Beschwerdeverfahren und gegebenenfalls zuständige Verbraucherschlichtungsstelle oder andere Streitbeilegungsmöglichkeiten.",
          "Gesetzliche Rechtsschutzmöglichkeiten bleiben bestehen.",
        ],
      },
      {
        id: "law",
        title: "15. Anwendbares Recht und Gerichtsstand",
        paragraphs: [
          "Ohne den tatsächlichen Unternehmenssitz kann das anwendbare Recht nicht abschließend bestimmt werden.",
          "Eine Rechtswahl darf zwingende Verbraucherschutzvorschriften nicht unzulässig ausschließen.",
          "Nach Bestätigung des Unternehmenssitzes rechtlich vervollständigen.",
        ],
      },
      {
        id: "updates",
        title: "16. Gültigkeit und Änderungen",
        paragraphs: [
          "Die verbindliche Fassung und ihr Gültigkeitsdatum müssen klar erkennbar sein.",
          "Spätere Änderungen müssen bestehende vertragliche Rechte berücksichtigen.",
          "Die für eine Bestellung geltende Fassung ist bei Bedarf nachweisbar aufzubewahren.",
        ],
      },
    ],

    withdrawalTitle: "Muster-Widerrufserklärung",
    withdrawalDescription:
      "Dieses Muster ist freiwillig und kann verwendet werden, soweit ein Widerrufsrecht besteht. Eine andere eindeutige Erklärung ist ebenfalls möglich.",

    withdrawalText: [
      "An den Verkäufer CYCLORIVA: [rechtlicher Name und Postanschrift ergänzen].",
      "E-Mail: contact@cycloriva.com",
      "Hiermit widerrufe ich den Vertrag über folgende Ware: [Produkt].",
      "Bestellnummer: [Referenz].",
      "Bestellt am: [Datum]. Erhalten am: [Datum].",
      "Name des Verbrauchers: [Name].",
      "Anschrift des Verbrauchers: [Anschrift].",
      "Datum: [Datum].",
      "Unterschrift: [nur bei Papiererklärung].",
    ],

    faqTitle: "Häufige Fragen zu den AGB",
    faqDescription: "Klicken Sie auf eine Frage.",

    faq: [
      {
        question: "Welche Bedingungen gelten für eine Bestellung?",
        answer:
          "Maßgeblich sind die wirksam einbezogenen Bedingungen zum Zeitpunkt des Vertragsschlusses und die zwingenden gesetzlichen Bestimmungen.",
      },
      {
        question: "Kann ich ein Fahrrad zurückgeben?",
        answer:
          "Bei entsprechenden EU-Fernabsatzkäufen besteht grundsätzlich ein 14-tägiges Widerrufsrecht. Für die Schweiz gelten andere Regeln.",
      },
      {
        question: "Wer zahlt die Rücksendung?",
        answer:
          "Das hängt von Rückgabegrund und ordnungsgemäßer Vorabinformation ab. Bei mangelhaften Waren gelten andere gesetzliche Regeln als bei einem Widerruf.",
      },
      {
        question: "Wo steht der Gesamtpreis?",
        answer:
          "Der Gesamtpreis einschließlich anfallender Kosten muss vor der verbindlichen Bestellung angezeigt werden.",
      },
      {
        question: "Welche Zahlungsarten gibt es?",
        answer:
          "Die tatsächlich aktivierten Zahlungsarten müssen beim Bestellabschluss angezeigt werden.",
      },
      {
        question: "Was tun bei einem Defekt?",
        answer:
          "Kontaktieren Sie contact@cycloriva.com mit Bestellnummer und Fehlerbeschreibung.",
      },
      {
        question: "Wie reiche ich eine Beschwerde ein?",
        answer: "Per E-Mail an sell@cycloriva.com oder contact@cycloriva.com.",
      },
    ],

    helpTitle: "Fragen zu den Verkaufsbedingungen?",
    helpDescription:
      "Unser Team informiert Sie über Bestellungen und Verkaufsmodalitäten.",
    ordersLabel: "Bestellanfragen",
    generalLabel: "Allgemeine Fragen und Beschwerden",
    germany: "Deutschland",
    france: "Frankreich",
    contactPage: "Kontaktseite",
    servicePage: "Kundenservice",

    closingTitle: "Fragen vor der Bestellung?",
    closingDescription:
      "Kontaktieren Sie CYCLORIVA für Informationen zu Produkten, Lieferung und Verkaufsbedingungen.",
    closingButton: "Kontakt aufnehmen",

    footerNotice:
      "Dieser Entwurf muss vor seiner vertraglichen Verwendung ergänzt und geprüft werden. Zwingende Verbraucherrechte bleiben maßgeblich.",
  },

  // ==========================================================
  // ITALIANO
  // ==========================================================

  it: {
    home: "Home",
    pageTitle: "Condizioni generali di vendita",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    metaDescription:
      "Condizioni CYCLORIVA su ordini, prezzi, pagamenti, consegne, recesso, resi e garanzie.",

    heroBadge: "CONDIZIONI DI VENDITA",
    heroTitle: "Condizioni chiare per i tuoi acquisti.",
    heroDescription:
      "Informazioni su acquisti di biciclette e accessori, pagamenti, consegne e diritti dei consumatori.",
    readTerms: "Leggi le condizioni",
    contactUs: "Contattaci",

    overviewTitle: "Informazioni essenziali",
    overviewDescription:
      "Comprendi le fasi di acquisto e le tutele applicabili.",

    overviewCards: [
      {
        title: "Ordini",
        description: "Verifica prodotti, quantità e importo prima di ordinare.",
      },
      {
        title: "Consegna",
        description: "Controlla destinazione, spese e tempi comunicati.",
      },
      {
        title: "Recesso",
        description: "Possono applicarsi diritti legali di recesso.",
      },
      {
        title: "Garanzia",
        description: "Restano validi i diritti per prodotti non conformi.",
      },
    ],

    noticeTitle: "Informazioni da completare prima della pubblicazione",
    noticeDescription:
      "Identità e indirizzo legale del venditore, registrazione, pagamenti attivi, condizioni di consegna, costi di reso di biciclette ingombranti e procedure di risoluzione delle controversie devono essere confermati. Questo documento è una bozza.",

    contentsTitle: "Indice",
    contentsDescription: "Seleziona una sezione.",

    sections: [
      {
        id: "seller",
        title: "1. Identificazione del venditore",
        paragraphs: [
          "CYCLORIVA è il nome commerciale del negozio online di biciclette e accessori.",
          "Da completare: ragione sociale, forma giuridica, indirizzo, paese, registrazione, dati fiscali e altre informazioni obbligatorie.",
          "Ordini: sell@cycloriva.com. Domande generali: contact@cycloriva.com.",
        ],
      },
      {
        id: "scope",
        title: "2. Ambito di applicazione",
        paragraphs: [
          "Le presenti condizioni sono destinate a disciplinare le vendite di biciclette, e-bike e accessori dopo la pubblicazione della versione definitiva e la corretta integrazione nel processo d'ordine.",
          "Le norme inderogabili a tutela del consumatore prevalgono su clausole incompatibili.",
        ],
      },
      {
        id: "products",
        title: "3. Prodotti e caratteristiche",
        paragraphs: [
          "Le caratteristiche essenziali, marca, modello, taglia e dotazioni devono essere indicate nelle schede prodotto.",
          "L'autonomia delle e-bike dipende da batteria, percorso, assistenza e condizioni d'uso.",
          "Le descrizioni devono essere corrette e conformi alle caratteristiche contrattualmente concordate.",
        ],
      },
      {
        id: "availability",
        title: "4. Disponibilità",
        paragraphs: [
          "La possibilità di ordinare dipende dalle scorte effettive.",
          "Se un prodotto non può essere fornito, il cliente deve essere informato e la situazione gestita secondo contratto e legge.",
        ],
      },
      {
        id: "prices",
        title: "5. Prezzi, imposte e spese",
        paragraphs: [
          "Il prezzo totale e le spese applicabili devono essere presentati prima dell'impegno definitivo.",
          "Il totale dipende da prodotti, quantità e destinazione.",
          "Per la Svizzera, eventuali costi doganali e fiscali devono essere chiariti prima dell'acquisto.",
        ],
      },
      {
        id: "orders",
        title: "6. Ordini e conclusione del contratto",
        paragraphs: [
          "Il cliente seleziona gli articoli, verifica il carrello, inserisce i dati e controlla il riepilogo.",
          "Il pulsante finale deve indicare chiaramente l'obbligo di pagamento quando esiste.",
          "Un ordine registrato non equivale a un pagamento confermato. Accettazione e conferma devono corrispondere alla procedura effettiva.",
          "Le informazioni contrattuali devono essere fornite su supporto durevole quando richiesto.",
        ],
      },
      {
        id: "payments",
        title: "7. Pagamenti",
        paragraphs: [
          "Sono disponibili solo i metodi effettivamente attivati e mostrati durante l'ordine.",
          "Il pagamento è confermato dal sistema di pagamento pertinente.",
          "Non inviare i dati completi della carta o codici bancari via email o WhatsApp.",
          "Da completare: prestatori, valute e condizioni effettive di pagamento.",
        ],
      },
      {
        id: "delivery",
        title: "8. Consegna e trasferimento del rischio",
        paragraphs: [
          "Le destinazioni previste sono Germania, Francia, Spagna, Italia, Svizzera, Austria, Paesi Bassi e Belgio, secondo la disponibilità reale.",
          "Spese e tempi devono essere comunicati prima dell'acquisto. Secondo le regole UE, salvo diverso accordo, la consegna deve normalmente avvenire senza ritardo ingiustificato ed entro 30 giorni.",
          "Per le vendite UE interessate, il rischio passa generalmente quando il consumatore riceve fisicamente il bene, salvo eccezioni.",
          "Le condizioni particolari per biciclette ingombranti devono essere precisate.",
        ],
      },
      {
        id: "withdrawal",
        title: "9. Diritto di recesso",
        paragraphs: [
          "Per gli acquisti a distanza soggetti alle norme UE, il consumatore dispone generalmente di 14 giorni dal ricevimento per comunicare il recesso senza motivazione, salvo eccezioni.",
          "La restituzione deve generalmente avvenire entro i 14 giorni successivi alla comunicazione.",
          "I costi diretti di restituzione possono spettare al consumatore se correttamente comunicati prima dell'acquisto. Per beni voluminosi occorrono informazioni appropriate sui costi.",
          "La legge svizzera non prevede un recesso generale per gli acquisti online; contratto e legge applicabile possono incidere.",
          "Un modello di dichiarazione è disponibile più sotto.",
        ],
      },
      {
        id: "refunds",
        title: "10. Resi e rimborsi",
        paragraphs: [
          "Nel recesso UE, il rimborso è generalmente dovuto entro 14 giorni dalla comunicazione, con possibile rinvio legale fino alla ricezione dei beni o della prova di restituzione.",
          "Si utilizza generalmente il mezzo di pagamento originale, salvo accordo valido.",
          "I rimedi per difetti di conformità sono distinti dal recesso.",
          "L'indirizzo di restituzione deve essere comunicato in base all'organizzazione reale.",
        ],
      },
      {
        id: "warranty",
        title: "11. Garanzie",
        paragraphs: [
          "Le vendite ai consumatori soggette alle norme UE beneficiano generalmente di una garanzia legale minima di due anni.",
          "I rimedi possono comprendere riparazione, sostituzione, riduzione del prezzo o risoluzione del contratto secondo la legge.",
          "Le garanzie commerciali del produttore sono separate e devono essere documentate.",
          "Per la Svizzera possono applicarsi regole differenti.",
        ],
      },
      {
        id: "responsibility",
        title: "12. Responsabilità",
        paragraphs: [
          "Il venditore mantiene gli obblighi legali e contrattuali relativi a consegna, conformità e sicurezza.",
          "Il cliente deve fornire dati corretti e rispettare le istruzioni di sicurezza.",
          "Nessuna clausola può escludere illegittimamente i diritti inderogabili.",
        ],
      },
      {
        id: "privacy",
        title: "13. Dati personali",
        paragraphs: [
          "I dati degli ordini e dell'assistenza devono essere trattati secondo la normativa applicabile.",
          "Finalità, destinatari, conservazione e diritti devono essere descritti nella politica privacy effettiva.",
        ],
      },
      {
        id: "disputes",
        title: "14. Reclami e controversie",
        paragraphs: [
          "Le richieste possono essere inviate a sell@cycloriva.com o contact@cycloriva.com.",
          "Da completare: procedura dei reclami e, dove obbligatorio, organismo di mediazione o sistema alternativo competente.",
          "Restano validi i rimedi legali del consumatore.",
        ],
      },
      {
        id: "law",
        title: "15. Legge applicabile",
        paragraphs: [
          "La legge applicabile e il foro non possono essere determinati definitivamente senza conoscere la sede legale del venditore.",
          "La scelta della legge non può privare il consumatore di protezioni inderogabili applicabili.",
        ],
      },
      {
        id: "updates",
        title: "16. Entrata in vigore e modifiche",
        paragraphs: [
          "La versione contrattuale e la data effettiva devono essere identificabili.",
          "Modifiche successive devono rispettare i diritti sorti dai contratti esistenti.",
          "Le condizioni applicabili a ogni ordine dovrebbero essere conservate quando necessario.",
        ],
      },
    ],

    withdrawalTitle: "Modello di dichiarazione di recesso",
    withdrawalDescription:
      "Modello facoltativo da utilizzare quando il diritto di recesso è applicabile. È valida anche un'altra dichiarazione inequivocabile.",

    withdrawalText: [
      "Al venditore CYCLORIVA: [ragione sociale e indirizzo da completare].",
      "E-mail: contact@cycloriva.com",
      "Comunico il recesso dal contratto relativo al seguente prodotto: [prodotto].",
      "Numero d'ordine: [riferimento].",
      "Ordinato il: [data]. Ricevuto il: [data].",
      "Nome del consumatore: [nome].",
      "Indirizzo del consumatore: [indirizzo].",
      "Data: [data].",
      "Firma: [solo per il modulo cartaceo].",
    ],

    faqTitle: "Domande frequenti sulle condizioni",
    faqDescription: "Seleziona una domanda.",

    faq: [
      {
        question: "Quali condizioni valgono per un ordine?",
        answer:
          "Si applicano le condizioni validamente comunicate e incorporate al momento dell'acquisto, insieme ai diritti obbligatori.",
      },
      {
        question: "Posso restituire una bicicletta?",
        answer:
          "Per gli acquisti UE a distanza interessati, generalmente è previsto un recesso di 14 giorni, salvo eccezioni. Le norme svizzere sono diverse.",
      },
      {
        question: "Chi paga la restituzione?",
        answer:
          "Dipende dalla causa e dalle informazioni precontrattuali. I prodotti difettosi sono disciplinati da norme diverse dal semplice ripensamento.",
      },
      {
        question: "Dove trovo il prezzo finale?",
        answer:
          "Il totale, comprese le spese applicabili, deve essere mostrato prima della conferma definitiva.",
      },
      {
        question: "Quali metodi di pagamento ci sono?",
        answer:
          "I metodi effettivamente attivati devono essere mostrati durante l'acquisto.",
      },
      {
        question: "Cosa fare se la bici è difettosa?",
        answer:
          "Contatta contact@cycloriva.com con numero d'ordine e descrizione del difetto.",
      },
      {
        question: "Come presento un reclamo?",
        answer: "Scrivi a sell@cycloriva.com oppure a contact@cycloriva.com.",
      },
    ],

    helpTitle: "Domande sulle condizioni di vendita?",
    helpDescription:
      "Contatta il team per informazioni su ordini e condizioni commerciali.",
    ordersLabel: "Informazioni sugli ordini",
    generalLabel: "Domande generali e reclami",
    germany: "Germania",
    france: "Francia",
    contactPage: "Pagina Contatti",
    servicePage: "Servizio clienti",

    closingTitle: "Hai dubbi prima di ordinare?",
    closingDescription:
      "Contatta CYCLORIVA per informazioni su prodotti, consegne e condizioni commerciali.",
    closingButton: "Contattaci",

    footerNotice:
      "Questa bozza richiede completamento e verifica prima dell'utilizzo contrattuale. Prevalgono i diritti inderogabili dei consumatori.",
  },

  // ==========================================================
  // ESPAÑOL
  // ==========================================================

  es: {
    home: "Inicio",
    pageTitle: "Condiciones generales de venta",
    eyebrow: "BICICLETAS & MOVILIDAD ELÉCTRICA EN EUROPA",
    metaDescription:
      "Condiciones CYCLORIVA sobre pedidos, precios, pagos, entregas, desistimiento, devoluciones y garantías.",

    heroBadge: "CONDICIONES DE VENTA",
    heroTitle: "Condiciones claras para tus compras.",
    heroDescription:
      "Información sobre pedidos de bicicletas, pagos, entregas y derechos de los consumidores.",
    readTerms: "Leer las condiciones",
    contactUs: "Contáctanos",

    overviewTitle: "Información esencial",
    overviewDescription:
      "Conoce las etapas de compra y las protecciones aplicables.",

    overviewCards: [
      {
        title: "Pedidos",
        description: "Revisa artículos, cantidades e importe final.",
      },
      {
        title: "Entrega",
        description: "Comprueba destinos, gastos y plazos.",
      },
      {
        title: "Desistimiento",
        description: "Pueden aplicarse derechos legales de desistimiento.",
      },
      {
        title: "Garantía",
        description:
          "Se mantienen los derechos relativos a productos no conformes.",
      },
    ],

    noticeTitle: "Datos obligatorios pendientes de completar",
    noticeDescription:
      "Deben confirmarse la identidad y dirección legal del vendedor, registro, métodos de pago activos, condiciones de entrega, costes de devolución de bicicletas voluminosas y procedimientos de resolución de controversias. Este documento es un borrador.",

    contentsTitle: "Índice de condiciones",
    contentsDescription: "Accede a cada sección.",

    sections: [
      {
        id: "seller",
        title: "1. Identificación del vendedor",
        paragraphs: [
          "CYCLORIVA es el nombre comercial de la tienda online de bicicletas y accesorios.",
          "Por completar: razón social, forma jurídica, domicilio, país, registros, datos fiscales y demás información legal obligatoria.",
          "Pedidos: sell@cycloriva.com. Consultas generales: contact@cycloriva.com.",
        ],
      },
      {
        id: "scope",
        title: "2. Ámbito de aplicación",
        paragraphs: [
          "Estas condiciones se destinan a regular las ventas de bicicletas, bicicletas eléctricas y accesorios tras la publicación definitiva y su incorporación válida en el proceso de compra.",
          "Los derechos obligatorios de los consumidores prevalecen sobre cláusulas incompatibles.",
        ],
      },
      {
        id: "products",
        title: "3. Productos y características",
        paragraphs: [
          "Las características esenciales, marca, modelo, talla y equipamiento deben aparecer en la ficha de producto.",
          "La autonomía de una bicicleta eléctrica depende de la batería, el terreno, la asistencia y el uso.",
          "La información del producto debe ser exacta y corresponder a las características acordadas.",
        ],
      },
      {
        id: "availability",
        title: "4. Disponibilidad",
        paragraphs: [
          "Los pedidos dependen de la disponibilidad real.",
          "Si un artículo no puede suministrarse, debe informarse al cliente y aplicarse las soluciones contractuales y legales correspondientes.",
        ],
      },
      {
        id: "prices",
        title: "5. Precios, impuestos y gastos",
        paragraphs: [
          "El precio total, los impuestos y los gastos adicionales deben mostrarse claramente antes de la compra definitiva.",
          "El total puede depender de productos, cantidades y destino.",
          "Para Suiza, los posibles aranceles, gastos de importación y responsables de pagarlos deben aclararse antes de comprar.",
        ],
      },
      {
        id: "orders",
        title: "6. Pedidos y formación del contrato",
        paragraphs: [
          "El cliente selecciona productos, revisa el carrito, introduce sus datos y comprueba el resumen.",
          "El botón final debe informar claramente de la obligación de pago cuando corresponda.",
          "Un pedido registrado no equivale a un pago confirmado. La aceptación y confirmación deben corresponder al sistema real de la tienda.",
          "La información contractual debe facilitarse en soporte duradero cuando sea obligatorio.",
        ],
      },
      {
        id: "payments",
        title: "7. Pagos",
        paragraphs: [
          "Solo deben mostrarse los métodos de pago realmente habilitados.",
          "El pago se considera confirmado mediante el sistema de pago correspondiente.",
          "Nunca envíes datos completos de tarjeta ni códigos bancarios por correo o WhatsApp.",
          "Por completar: proveedores activos, monedas y condiciones de cobro.",
        ],
      },
      {
        id: "delivery",
        title: "8. Entrega y transmisión del riesgo",
        paragraphs: [
          "Los destinos previstos son Alemania, Francia, España, Italia, Suiza, Austria, Países Bajos y Bélgica, sujetos a disponibilidad.",
          "Los gastos y plazos deben informarse antes de comprar. Según las reglas de consumo de la UE, salvo otro acuerdo, generalmente debe entregarse sin demora indebida y dentro de 30 días.",
          "Para las ventas UE correspondientes, el riesgo suele transmitirse cuando el consumidor recibe físicamente el bien, salvo excepciones.",
          "Las condiciones específicas para bicicletas voluminosas deben informarse de acuerdo con el transporte ofrecido.",
        ],
      },
      {
        id: "withdrawal",
        title: "9. Derecho de desistimiento",
        paragraphs: [
          "En las compras a distancia sujetas a normas de la UE, el consumidor dispone generalmente de 14 días desde la recepción para comunicar el desistimiento sin justificarlo, salvo excepciones.",
          "Los bienes normalmente deben devolverse dentro de los 14 días siguientes a la comunicación.",
          "Los gastos directos de devolución pueden corresponder al consumidor si se informaron correctamente antes de la compra. Para productos voluminosos deben facilitarse los datos de costes legalmente exigidos.",
          "El derecho suizo no contempla un desistimiento general para compras online; pueden influir el contrato y otras leyes aplicables.",
          "Más abajo se ofrece un modelo de declaración.",
        ],
      },
      {
        id: "refunds",
        title: "10. Devoluciones y reembolsos",
        paragraphs: [
          "Para desistimientos de la UE, el reembolso normalmente debe realizarse dentro de 14 días desde la comunicación, con los posibles aplazamientos legales hasta recibir los bienes o prueba de devolución.",
          "Generalmente se utiliza el método de pago original, salvo acuerdo válido.",
          "Los derechos por falta de conformidad son distintos del desistimiento.",
          "La dirección de devolución debe corresponder a la organización logística real.",
        ],
      },
      {
        id: "warranty",
        title: "11. Garantías",
        paragraphs: [
          "Las ventas a consumidores comprendidas en las normas UE suelen tener una garantía legal mínima de dos años.",
          "Los remedios pueden incluir reparación, sustitución, reducción del precio o resolución del contrato según la ley.",
          "Las garantías comerciales del fabricante son independientes y deben estar documentadas.",
          "Para Suiza pueden aplicarse otras normas.",
        ],
      },
      {
        id: "responsibility",
        title: "12. Obligaciones y responsabilidad",
        paragraphs: [
          "El vendedor mantiene sus obligaciones contractuales y legales, incluidas entrega, conformidad y seguridad.",
          "El comprador debe facilitar datos correctos y seguir las instrucciones de seguridad.",
          "No pueden excluirse de forma ilícita los derechos obligatorios de los consumidores.",
        ],
      },
      {
        id: "privacy",
        title: "13. Datos personales",
        paragraphs: [
          "Los datos de pedidos y asistencia deben tratarse conforme a la normativa aplicable.",
          "Las finalidades, destinatarios, conservación y derechos deben reflejarse correctamente en la Política de privacidad.",
        ],
      },
      {
        id: "disputes",
        title: "14. Reclamaciones y controversias",
        paragraphs: [
          "Las reclamaciones pueden dirigirse a sell@cycloriva.com o contact@cycloriva.com.",
          "Por completar: procedimiento y, cuando proceda, organismo de mediación o sistema alternativo de resolución de conflictos.",
          "Los consumidores conservan los recursos legales que les correspondan.",
        ],
      },
      {
        id: "law",
        title: "15. Ley aplicable y jurisdicción",
        paragraphs: [
          "La ley y los tribunales competentes no pueden determinarse definitivamente sin conocer el domicilio legal del vendedor.",
          "La elección de ley no puede privar al consumidor de protecciones imperativas aplicables.",
        ],
      },
      {
        id: "updates",
        title: "16. Vigencia y modificaciones",
        paragraphs: [
          "La versión contractual y su fecha de entrada en vigor deben identificarse claramente.",
          "Las modificaciones posteriores deben respetar los derechos de contratos existentes.",
          "La versión aplicable a cada pedido debe conservarse cuando corresponda.",
        ],
      },
    ],

    withdrawalTitle: "Modelo de declaración de desistimiento",
    withdrawalDescription:
      "Este modelo es opcional y puede utilizarse cuando existe un derecho de desistimiento. También es válida otra declaración inequívoca.",

    withdrawalText: [
      "Al vendedor CYCLORIVA: [nombre legal y dirección por completar].",
      "Correo: contact@cycloriva.com",
      "Por la presente comunico mi desistimiento del contrato relativo al siguiente producto: [producto].",
      "Número de pedido: [referencia].",
      "Pedido el: [fecha]. Recibido el: [fecha].",
      "Nombre del consumidor: [nombre].",
      "Dirección del consumidor: [dirección].",
      "Fecha: [fecha].",
      "Firma: [solo si se presenta en papel].",
    ],

    faqTitle: "Preguntas frecuentes sobre las condiciones",
    faqDescription: "Selecciona una pregunta para ver la respuesta.",

    faq: [
      {
        question: "¿Qué condiciones se aplican a mi pedido?",
        answer:
          "Las condiciones comunicadas e incorporadas válidamente al contrato al comprar, junto con las protecciones obligatorias.",
      },
      {
        question: "¿Puedo devolver una bicicleta?",
        answer:
          "En las compras a distancia sujetas a normas UE normalmente existe un plazo de desistimiento de 14 días, salvo excepciones. Suiza tiene reglas distintas.",
      },
      {
        question: "¿Quién paga la devolución?",
        answer:
          "Depende del motivo y de la información previa. Las devoluciones por defectos siguen normas diferentes al cambio de opinión.",
      },
      {
        question: "¿Dónde veo el precio final?",
        answer:
          "El precio total, incluidos los cargos aplicables, debe mostrarse antes de la confirmación definitiva.",
      },
      {
        question: "¿Qué métodos de pago se aceptan?",
        answer:
          "Los medios realmente habilitados deben aparecer durante el proceso de compra.",
      },
      {
        question: "¿Qué hago si mi bicicleta tiene un defecto?",
        answer:
          "Contacta con contact@cycloriva.com e indica la referencia y el problema.",
      },
      {
        question: "¿Dónde puedo reclamar?",
        answer: "Escribe a sell@cycloriva.com o contact@cycloriva.com.",
      },
    ],

    helpTitle: "¿Dudas sobre las condiciones?",
    helpDescription:
      "Contacta con nuestro equipo para información sobre pedidos y ventas.",
    ordersLabel: "Consultas sobre pedidos",
    generalLabel: "Consultas generales y reclamaciones",
    germany: "Alemania",
    france: "Francia",
    contactPage: "Página de contacto",
    servicePage: "Atención al cliente",

    closingTitle: "¿Necesitas información antes de comprar?",
    closingDescription:
      "Contacta con CYCLORIVA sobre productos, entregas y condiciones comerciales.",
    closingButton: "Contáctanos",

    footerNotice:
      "Este borrador debe completarse y revisarse antes de su utilización contractual. Prevalecen los derechos obligatorios de los consumidores.",
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

    // CGV encore incomplètes :
    // ne pas indexer avant validation.
    robots: {
      index: false,
      follow: true,
    },

    alternates: {
      canonical: `/${locale}/${TERMS_PATH}`,
      languages: {
        fr: `/fr/${TERMS_PATH}`,
        en: `/en/${TERMS_PATH}`,
        de: `/de/${TERMS_PATH}`,
        it: `/it/${TERMS_PATH}`,
        es: `/es/${TERMS_PATH}`,
        "x-default": `/fr/${TERMS_PATH}`,
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

// ============================================================
// 5. BANDEAU
// ============================================================

function TermsBanner({ t }: { t: Translations }) {
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

function TermsBreadcrumb({ locale, t }: { locale: Locale; t: Translations }) {
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
// 7. INTRODUCTION
// ============================================================

function TermsHero({ locale, t }: { locale: Locale; t: Translations }) {
  return (
    <section className="grid items-center gap-3 py-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-3 lg:py-1">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-2 text-[11px] font-extrabold text-[#078d21]">
          <FileCheck2 size={17} aria-hidden="true" />
          {t.heroBadge}
        </span>

        <h2 className="mt-2 max-w-190 text-[29px] leading-[1.13] font-black tracking-tight text-[#102b39] sm:text-[40px] lg:text-[45px]">
          {t.heroTitle}
        </h2>

        <p className="mt-2 max-w-162.5 text-[14px] leading-7 text-[#536c7b] sm:text-[15px]">
          {t.heroDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <a href="#conditions" className={GREEN_BUTTON}>
            <FileText size={18} aria-hidden="true" />
            {t.readTerms}
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
              <FileText size={43} aria-hidden="true" />
            </div>

            <p className="mt-3 text-[12px] font-extrabold tracking-[0.13em] text-[#a8efb2]">
              CYCLORIVA
            </p>

            <h3 className="mt-2 text-[19px] font-black text-white">
              {t.pageTitle}
            </h3>

            <div className="mt-3 flex items-center gap-3 text-white/80">
              <ShoppingBag size={24} />
              <Scale size={24} />
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 8. INFORMATIONS ESSENTIELLES
// ============================================================

function TermsOverview({ t }: { t: Translations }) {
  const icons = [ShoppingBag, Truck, RotateCcw, ShieldCheck] as const;

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
// 9. AVERTISSEMENT JURIDIQUE
// ============================================================

function TermsNotice({ t }: { t: Translations }) {
  return (
    <aside className="rounded-xl border border-[#ead9b5] bg-[#fffaf0] p-3 sm:p-3">
      <div className="flex items-start gap-3">
        <AlertTriangle
          size={23}
          className="mt-0.5 shrink-0 text-[#a77924]"
          aria-hidden="true"
        />

        <div>
          <h2 className="text-[14px] font-extrabold text-[#75531d] sm:text-[15px]">
            {t.noticeTitle}
          </h2>

          <p className="mt-2 text-[12px] leading-6 text-[#735b35] sm:text-[13px]">
            {t.noticeDescription}
          </p>
        </div>
      </div>
    </aside>
  );
}

// ============================================================
// 10. SOMMAIRE
// ============================================================

function TermsContents({ t }: { t: Translations }) {
  return (
    <nav aria-label={t.contentsTitle} className={`${CARD} p-3 sm:p-3`}>
      <div className="flex items-start gap-3">
        <ClipboardList
          size={30}
          className="shrink-0 text-[#109b24]"
          aria-hidden="true"
        />

        <div>
          <h2 className={SECTION_TITLE}>{t.contentsTitle}</h2>

          <p className="mt-2 text-[13px] text-[#607383]">
            {t.contentsDescription}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {t.sections.map((section) => (
          <a
            key={section.id}
            href={`#cgv-${section.id}`}
            className="group flex min-w-0 items-center justify-between gap-3 rounded-lg border border-[#e0e8ed] bg-[#fafcfd] px-3 py-3 text-[12px] font-bold text-[#314b5c] transition-colors hover:border-[#109b24] hover:bg-[#f1faf0] sm:text-[13px]"
          >
            <span className="min-w-0">{section.title}</span>

            <ChevronRight
              size={16}
              className="shrink-0 text-[#109b24] transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>
    </nav>
  );
}

// ============================================================
// 11. UN ARTICLE DES CGV
// ============================================================

function TermsArticle({
  section,
  locale,
}: {
  section: LegalSection;
  locale: Locale;
}) {
  const Icon = SECTION_ICONS[section.id];

  return (
    <article
      id={`cgv-${section.id}`}
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

        {section.points && (
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

        {section.id === "withdrawal" && (
          <Link
            href={`/${locale}/retours-remboursements`}
            className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#078d21] hover:underline"
          >
            <RotateCcw size={17} />
            {TEXTS[locale].overviewCards[2].title}
            <ArrowRight size={16} />
          </Link>
        )}

        {section.id === "warranty" && (
          <Link
            href={`/${locale}/garantie`}
            className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#078d21] hover:underline"
          >
            <ShieldCheck size={17} />
            {TEXTS[locale].overviewCards[3].title}
            <ArrowRight size={16} />
          </Link>
        )}

        {section.id === "privacy" && (
          <Link
            href={`/${locale}/politique-confidentialite`}
            className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#078d21] hover:underline"
          >
            <FileText size={17} />
            {
              TEXTS[locale].sections.find((item) => item.id === "privacy")
                ?.title
            }
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </article>
  );
}

// ============================================================
// 12. DOCUMENT DES CGV
// ============================================================

function TermsDocument({ locale, t }: { locale: Locale; t: Translations }) {
  return (
    <section id="conditions" className="scroll-mt-24 space-y-5 py-1 lg:py-1">
      <TermsNotice t={t} />

      <TermsContents t={t} />

      <div className="grid gap-3">
        {t.sections.map((section) => (
          <TermsArticle key={section.id} locale={locale} section={section} />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 13. MODÈLE DE RÉTRACTATION
// ============================================================

function TermsWithdrawal({ t }: { t: Translations }) {
  return (
    <section id="modele-retractation" className="scroll-mt-24 py-1 lg:py-1">
      <div className="mb-2 flex items-start gap-3">
        <RotateCcw
          size={30}
          className="mt-0.5 shrink-0 text-[#109b24]"
          aria-hidden="true"
        />

        <div>
          <h2 className={SECTION_TITLE}>{t.withdrawalTitle}</h2>

          <p className="mt-2 max-w-205 text-[13px] leading-6 text-[#617586]">
            {t.withdrawalDescription}
          </p>
        </div>
      </div>

      <div className={`${CARD} p-3 sm:p-3`}>
        <div className="mb-2 flex items-center gap-2 border-b border-[#e0e9ed] pb-4">
          <FileText size={23} className="text-[#109b24]" aria-hidden="true" />

          <span className="text-[13px] font-extrabold text-[#102b39]">
            {t.withdrawalTitle}
          </span>
        </div>

        <div className="space-y-3">
          {t.withdrawalText.map((line, index) => (
            <p key={index} className="text-[13px] leading-7 text-[#435e6f]">
              {line}
            </p>
          ))}
        </div>

        <a href={`mailto:${CONTACT_EMAIL}`} className={`mt-3 ${GREEN_BUTTON}`}>
          <Mail size={18} />
          {CONTACT_EMAIL}
          <ArrowRight size={17} />
        </a>
      </div>
    </section>
  );
}

// ============================================================
// 14. FAQ
// ============================================================

function TermsFAQ({ t }: { t: Translations }) {
  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2 flex items-start gap-3">
        <CircleHelp
          size={31}
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

      <div className={`${CARD} space-y-2 p-3 sm:p-3`}>
        {t.faq.map((item, index) => (
          <details
            key={index}
            className="group overflow-hidden rounded-xl border border-[#dce6ed] bg-white open:border-[#b9dfb9]"
          >
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13px] font-extrabold leading-6 text-[#102b39] transition-colors hover:bg-[#f7fbf7] focus-visible:outline-2 focus-visible:outline-[#109b24] sm:px-5 sm:text-[14px] [&::-webkit-details-marker]:hidden">
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
// 15. CONTACTS
// ============================================================

function TermsContacts({ locale, t }: { locale: Locale; t: Translations }) {
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

            <p className="mt-2 text-[13px] leading-6 text-[#617586]">
              {t.helpDescription}
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
                {t.ordersLabel}
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
                {t.generalLabel}
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
                  🇩🇪 {t.germany}
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
                  🇫🇷 {t.france}
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

          <Link href={`/${locale}/service-client`} className={OUTLINE_BUTTON}>
            <Headphones size={18} />
            {t.servicePage}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 16. SECTION FINALE
// ============================================================

function TermsClosing({ locale, t }: { locale: Locale; t: Translations }) {
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
          <Scale
            size={39}
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
// 17. PAGE PRINCIPALE
// ============================================================

async function TermsPageContent({ params }: PageProps) {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return (
    <main
      data-page="terms-and-conditions"
      className="info-page w-full min-w-0 bg-white pb-2 text-[#102b39] lg:pb-2"
    >
      {/* Header général fourni par le layout */}

      <TermsBanner t={t} />

      <div className={CONTAINER}>
        <TermsBreadcrumb locale={locale} t={t} />

        <TermsHero locale={locale} t={t} />

        <TermsOverview t={t} />

        <TermsDocument locale={locale} t={t} />

        <TermsWithdrawal t={t} />

        <TermsFAQ t={t} />

        <TermsContacts locale={locale} t={t} />

        <TermsClosing locale={locale} t={t} />

        <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#6a7c88]">
          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          {t.footerNotice}
        </p>
      </div>

      {/* Footer général fourni par le layout */}
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA CONDITIONS GÉNÉRALES DE VENTE
// ============================================================

export default function TermsPage(
  props: Parameters<typeof TermsPageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <TermsPageContent {...props} />
    </Suspense>
  );
}
