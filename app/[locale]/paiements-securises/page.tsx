import "@/components/site/InformationPages.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  ClipboardList,
  Eye,
  FileCheck2,
  Headphones,
  House,
  LockKeyhole,
  Mail,
  MessageCircle,
  ReceiptText,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Wallet,
} from "lucide-react";

/**
 * ==========================================================
 * CYCLORIVA — PAIEMENTS SÉCURISÉS
 * ==========================================================
 *
 * Fichier :
 * app/[locale]/paiements-securises/page.tsx
 *
 * Next.js 16 — App Router
 * TypeScript — React — Tailwind CSS 4
 * Lucide React
 *
 * UN SEUL FICHIER
 *
 * LANGUES :
 * /fr/paiements-securises
 * /en/paiements-securises
 * /de/paiements-securises
 * /it/paiements-securises
 * /es/paiements-securises
 *
 * DESIGN :
 * Bleu marine : #102b39
 * Vert : #109b24
 * Blanc : #ffffff
 *
 * SECTIONS :
 * - Bandeau desktop
 * - Fil d'Ariane
 * - Introduction
 * - Informations de sécurité
 * - Vérifications avant paiement
 * - Parcours de commande
 * - Précautions contre la fraude
 * - FAQ interactive
 * - Contacts officiels
 * - Appel à l'action
 *
 * IMPORTANT :
 * Cette page est informative.
 *
 * Elle ne prétend pas que Stripe,
 * PayPal, une banque ou un autre
 * prestataire est déjà intégré.
 *
 * Elle ne traite aucune carte bancaire.
 * Elle ne conserve aucune donnée bancaire.
 * Elle ne confirme aucun paiement.
 *
 * Ces actions doivent être assurées par
 * un prestataire et des API réellement
 * intégrés et testés côté serveur.
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

type Information = {
  title: string;
  description: string;
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
  heroContact: string;
  heroFAQ: string;

  trustTitle: string;
  trustDescription: string;
  trustCards: [Information, Information, Information, Information];

  methodsTitle: string;
  methodsDescription: string;
  methodsNotice: string;
  methodsContact: string;

  stepsTitle: string;
  stepsDescription: string;
  steps: [Information, Information, Information, Information];

  safetyTitle: string;
  safetyDescription: string;
  safetyPoints: string[];

  warningTitle: string;
  warningDescription: string;

  faqTitle: string;
  faqDescription: string;
  faq: FAQItem[];

  contactTitle: string;
  contactDescription: string;
  ordersLabel: string;
  questionsLabel: string;
  whatsappGermany: string;
  whatsappFrance: string;
  contactButton: string;
  customerServiceButton: string;

  closingTitle: string;
  closingDescription: string;
  closingButton: string;

  footerNotice: string;
};

// ==========================================================
// 2. CONFIGURATION
// ==========================================================

const SUPPORTED_LOCALES: Locale[] = ["fr", "en", "de", "it", "es"];

function resolveLocale(value: string): Locale {
  if (!SUPPORTED_LOCALES.includes(value as Locale)) {
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
// 3. TRADUCTIONS
// ==========================================================

const TEXTS: Record<Locale, Translations> = {
  // ========================================================
  // FRANÇAIS
  // ========================================================

  fr: {
    home: "Accueil",
    pageTitle: "Paiements sécurisés",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    metaDescription:
      "Conseils de sécurité et informations sur la vérification des paiements et des commandes CYCLORIVA.",

    heroBadge: "INFORMATIONS SUR LES PAIEMENTS",
    heroTitle: "Achetez en toute vigilance, avec des informations claires.",
    heroDescription:
      "Découvrez les précautions essentielles avant un paiement, les étapes de vérification d'une commande et les moyens de contacter CYCLORIVA pour toute question.",
    heroContact: "Contacter CYCLORIVA",
    heroFAQ: "Questions fréquentes",

    trustTitle: "Les points essentiels à vérifier",
    trustDescription:
      "Pour payer en ligne, il est important de comprendre comment les informations et les transactions sont traitées.",

    trustCards: [
      {
        title: "Connexion sécurisée",
        description:
          "Vérifiez que le site de paiement utilise HTTPS et une connexion valide. Le chiffrement de la connexion protège les données pendant leur transmission, mais ne garantit pas à lui seul la fiabilité d'un commerçant.",
      },
      {
        title: "Prestataire de paiement",
        description:
          "Lorsqu'un prestataire externe est utilisé, son identité et ses conditions doivent être indiquées dans le parcours réel de paiement. Aucun prestataire n'est annoncé comme actif ici.",
      },
      {
        title: "Montant à vérifier",
        description:
          "Contrôlez les produits, les quantités, les éventuels frais de livraison et le montant final avant d'autoriser une transaction.",
      },
      {
        title: "Confirmation vérifiable",
        description:
          "Une commande enregistrée n'est pas nécessairement payée. Le paiement doit être confirmé par le système de paiement concerné.",
      },
    ],

    methodsTitle: "Quels moyens de paiement utiliser ?",
    methodsDescription:
      "Les moyens acceptés doivent être présentés au moment du paiement, uniquement lorsqu'ils sont réellement activés dans la boutique.",
    methodsNotice:
      "CYCLORIVA ne publie pas ici de liste non vérifiée de cartes, banques ou portefeuilles électroniques. Avant tout paiement, vérifiez les moyens effectivement proposés dans le parcours de commande.",
    methodsContact: "Demander des informations",

    stepsTitle: "Les étapes avant de payer",
    stepsDescription: "Quatre vérifications utiles pendant votre commande.",

    steps: [
      {
        title: "Choisissez vos articles",
        description:
          "Consultez les caractéristiques, le prix et la quantité de chaque produit.",
      },
      {
        title: "Vérifiez votre panier",
        description:
          "Assurez-vous que les articles et les montants correspondent à votre sélection.",
      },
      {
        title: "Examinez le total",
        description:
          "Vérifiez l'adresse de livraison, les frais applicables et les modalités de paiement affichées.",
      },
      {
        title: "Confirmez uniquement si tout est correct",
        description:
          "Utilisez le parcours de paiement officiel lorsqu'il est disponible et conservez les confirmations reçues.",
      },
    ],

    safetyTitle: "Nos conseils pour éviter les fraudes",
    safetyDescription:
      "Quelques réflexes importants pour protéger vos données et votre argent.",

    safetyPoints: [
      "Vérifiez l'adresse du site avant de saisir des informations sensibles.",
      "Ne communiquez jamais votre mot de passe, votre code PIN ou un code de validation bancaire par e-mail ou WhatsApp.",
      "Méfiez-vous des messages qui vous imposent un paiement urgent vers un compte inattendu.",
      "Vérifiez le bénéficiaire et le montant avant de confirmer un virement.",
      "Conservez vos confirmations et signalez toute demande inhabituelle.",
    ],

    warningTitle: "Attention aux demandes suspectes",
    warningDescription:
      "Ne transmettez pas les données complètes de votre carte, votre cryptogramme ou un code bancaire à un interlocuteur par messagerie. En cas de doute, contactez CYCLORIVA par les coordonnées officielles affichées sur cette page.",

    faqTitle: "Questions fréquentes sur les paiements",
    faqDescription: "Cliquez sur une question pour consulter sa réponse.",

    faq: [
      {
        question: "Quels moyens de paiement CYCLORIVA accepte-t-il ?",
        answer:
          "Les moyens de paiement réellement disponibles doivent apparaître dans le parcours de commande lorsqu'ils sont activés. Pour connaître les modalités actuelles, contactez sell@cycloriva.com.",
      },
      {
        question: "Comment savoir si mon paiement a été accepté ?",
        answer:
          "Un paiement n'est confirmé que lorsque le prestataire ou la banque concernée confirme réellement la transaction. Une simple commande enregistrée ne prouve pas qu'elle a été payée.",
      },
      {
        question: "Puis-je envoyer les informations de ma carte par WhatsApp ?",
        answer:
          "Non. Ne transmettez jamais le numéro complet de votre carte avec sa date d'expiration, son cryptogramme ou des codes de validation par WhatsApp ou par e-mail.",
      },
      {
        question: "Que faire si une transaction semble avoir échoué ?",
        answer:
          "Vérifiez d'abord l'état de la transaction auprès de votre banque ou du prestataire utilisé. Évitez de répéter le paiement sans vérification, puis contactez sell@cycloriva.com avec votre référence de commande, sans transmettre vos données bancaires sensibles.",
      },
      {
        question: "Les frais de livraison sont-ils inclus dans le prix ?",
        answer:
          "Cela dépend du panier et de la destination. Les frais applicables doivent être clairement présentés avant la confirmation finale de la commande.",
      },
      {
        question: "Puis-je demander un remboursement ?",
        answer:
          "Les remboursements éventuels dépendent du motif de la demande, des conditions contractuelles valables et des droits légaux applicables. Consultez la page Retours & remboursements ou contactez notre équipe.",
      },
      {
        question: "Est-ce que HTTPS garantit qu'un site est fiable ?",
        answer:
          "Non. HTTPS protège les communications avec le site, mais il ne garantit ni l'identité ni l'honnêteté de son exploitant. Vérifiez également les coordonnées du vendeur et les informations commerciales.",
      },
    ],

    contactTitle: "Des questions sur un paiement ?",
    contactDescription:
      "Contactez CYCLORIVA en indiquant votre numéro de commande, si vous en possédez un. N'envoyez aucune donnée bancaire confidentielle.",

    ordersLabel: "Questions sur les commandes",
    questionsLabel: "Questions générales",
    whatsappGermany: "Allemagne",
    whatsappFrance: "France",
    contactButton: "Page Contact",
    customerServiceButton: "Service client",

    closingTitle: "Un doute avant de confirmer ?",
    closingDescription:
      "Vérifiez les informations de commande et contactez notre équipe si vous souhaitez obtenir des précisions.",
    closingButton: "Nous contacter",

    footerNotice:
      "Cette page fournit des conseils de sécurité et des informations générales. Elle ne certifie pas l'intégration d'un prestataire de paiement, la conformité PCI DSS ou l'activation d'une authentification bancaire particulière.",
  },

  // ========================================================
  // ENGLISH
  // ========================================================

  en: {
    home: "Home",
    pageTitle: "Secure Payments",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    metaDescription:
      "CYCLORIVA payment safety guidance and information about orders, transactions and payment verification.",

    heroBadge: "PAYMENT INFORMATION",
    heroTitle: "Shop carefully with clear payment information.",
    heroDescription:
      "Learn how to check your order, review payment details and contact CYCLORIVA if you need assistance.",
    heroContact: "Contact CYCLORIVA",
    heroFAQ: "Frequently asked questions",

    trustTitle: "Important checks before paying",
    trustDescription:
      "Understanding how online payments work helps you make informed decisions.",

    trustCards: [
      {
        title: "Secure connection",
        description:
          "Check that the payment website uses HTTPS and a valid connection. Encryption protects data in transit but does not by itself prove that a merchant is trustworthy.",
      },
      {
        title: "Payment provider",
        description:
          "If an external payment provider is used, its identity and conditions should be presented in the actual checkout process. No provider is claimed to be active here.",
      },
      {
        title: "Review the amount",
        description:
          "Check products, quantities, delivery costs and the final total before authorising any transaction.",
      },
      {
        title: "Verified confirmation",
        description:
          "A recorded order is not necessarily a paid order. Actual payment confirmation must come from the relevant payment system.",
      },
    ],

    methodsTitle: "Which payment methods are available?",
    methodsDescription:
      "Accepted methods should appear during checkout only when they are genuinely enabled.",
    methodsNotice:
      "CYCLORIVA does not publish an unverified list of cards, banks or digital wallets. Check the options shown in the actual checkout process before paying.",
    methodsContact: "Ask about payments",

    stepsTitle: "Steps before paying",
    stepsDescription: "Four useful checks during the ordering process.",

    steps: [
      {
        title: "Select your products",
        description: "Review specifications, prices and quantities.",
      },
      {
        title: "Check your cart",
        description: "Make sure the selected products and amounts are correct.",
      },
      {
        title: "Review the total",
        description:
          "Check your delivery address, applicable costs and displayed payment arrangements.",
      },
      {
        title: "Confirm only when ready",
        description:
          "Use the official payment process if available and keep your confirmations.",
      },
    ],

    safetyTitle: "How to avoid payment scams",
    safetyDescription:
      "Simple precautions to protect your information and money.",

    safetyPoints: [
      "Check the website address before entering sensitive information.",
      "Never share passwords, PINs or bank verification codes through email or WhatsApp.",
      "Be cautious of urgent payment requests to unfamiliar accounts.",
      "Verify the recipient and amount before authorising a transfer.",
      "Keep confirmations and report unusual requests.",
    ],

    warningTitle: "Watch out for suspicious requests",
    warningDescription:
      "Never send your complete card details, security code or bank verification codes through messaging apps. If unsure, use the official CYCLORIVA contact details on this page.",

    faqTitle: "Payment FAQ",
    faqDescription: "Select a question to read the answer.",

    faq: [
      {
        question: "Which payment methods does CYCLORIVA accept?",
        answer:
          "Payment methods should appear at checkout when actually enabled. For current arrangements, contact sell@cycloriva.com.",
      },
      {
        question: "How do I know my payment succeeded?",
        answer:
          "Payment is confirmed only when the relevant bank or provider verifies the transaction. A recorded order alone does not prove payment.",
      },
      {
        question: "Can I send card details over WhatsApp?",
        answer:
          "No. Never send full card details, expiry dates, security codes or bank authentication codes through WhatsApp or email.",
      },
      {
        question: "What if a transaction appears to fail?",
        answer:
          "Check with your bank or payment provider first. Avoid repeating payment without verifying its status, then contact sell@cycloriva.com without sharing sensitive card details.",
      },
      {
        question: "Are shipping fees included?",
        answer:
          "This depends on the products and destination. Applicable shipping charges must be presented before final confirmation.",
      },
      {
        question: "Can I request a refund?",
        answer:
          "Refund rights depend on the circumstances, valid contractual terms and applicable consumer law. See our Returns & Refunds page.",
      },
      {
        question: "Does HTTPS mean a website is trustworthy?",
        answer:
          "No. HTTPS protects communications, but does not guarantee the merchant's identity or reliability. Check business and contact information too.",
      },
    ],

    contactTitle: "Questions about a payment?",
    contactDescription:
      "Contact CYCLORIVA with your order number if available. Never share confidential payment information.",

    ordersLabel: "Order enquiries",
    questionsLabel: "General questions",
    whatsappGermany: "Germany",
    whatsappFrance: "France",
    contactButton: "Contact page",
    customerServiceButton: "Customer service",

    closingTitle: "Need clarification before paying?",
    closingDescription:
      "Review your order and contact our team if you have any questions.",
    closingButton: "Contact us",

    footerNotice:
      "This page provides safety guidance. It does not certify payment-provider integration, PCI DSS compliance or activation of any particular bank authentication service.",
  },

  // ========================================================
  // DEUTSCH
  // ========================================================

  de: {
    home: "Startseite",
    pageTitle: "Sichere Zahlungen",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    metaDescription:
      "CYCLORIVA Informationen zu sicherem Bezahlen, Bestellungen und Zahlungsprüfung.",

    heroBadge: "INFORMATIONEN ZUR ZAHLUNG",
    heroTitle: "Sicherheitsbewusst und informiert einkaufen.",
    heroDescription:
      "Hier erfahren Sie, wie Sie Zahlungsangaben und Bestellungen prüfen und CYCLORIVA kontaktieren können.",
    heroContact: "CYCLORIVA kontaktieren",
    heroFAQ: "Häufige Fragen",

    trustTitle: "Wichtige Sicherheitsprüfungen",
    trustDescription:
      "Bei Online-Zahlungen sollten Übertragung, Zahlungsanbieter und Beträge geprüft werden.",

    trustCards: [
      {
        title: "Geschützte Verbindung",
        description:
          "Prüfen Sie, ob die Zahlungsseite HTTPS verwendet. Die Verschlüsselung schützt Daten bei der Übertragung, garantiert aber nicht die Vertrauenswürdigkeit des Anbieters.",
      },
      {
        title: "Zahlungsdienstleister",
        description:
          "Falls ein externer Dienstleister genutzt wird, müssen Identität und Bedingungen im tatsächlichen Zahlungsvorgang erkennbar sein. Hier wird kein Anbieter als aktiv behauptet.",
      },
      {
        title: "Beträge kontrollieren",
        description:
          "Überprüfen Sie Produkte, Mengen, Versandkosten und Gesamtsumme vor der Freigabe einer Zahlung.",
      },
      {
        title: "Bestätigten Zahlungsstatus prüfen",
        description:
          "Eine erfasste Bestellung ist nicht automatisch bezahlt. Die Zahlung muss durch das zuständige Zahlungssystem bestätigt werden.",
      },
    ],

    methodsTitle: "Welche Zahlungsarten sind verfügbar?",
    methodsDescription:
      "Akzeptierte Zahlungsarten werden beim Bestellabschluss angezeigt, sofern sie tatsächlich aktiviert sind.",
    methodsNotice:
      "CYCLORIVA nennt keine unbestätigten Kartenanbieter, Banken oder Wallets. Prüfen Sie die tatsächlich angebotenen Möglichkeiten im Bestellvorgang.",
    methodsContact: "Zahlungsinformationen anfragen",

    stepsTitle: "Schritte vor der Zahlung",
    stepsDescription: "Vier wichtige Kontrollen bei der Bestellung.",

    steps: [
      {
        title: "Produkte auswählen",
        description: "Prüfen Sie Eigenschaften, Preise und Mengen.",
      },
      {
        title: "Warenkorb kontrollieren",
        description: "Vergewissern Sie sich, dass Artikel und Beträge stimmen.",
      },
      {
        title: "Gesamtbetrag prüfen",
        description:
          "Kontrollieren Sie Lieferadresse, Versandkosten und Zahlungsbedingungen.",
      },
      {
        title: "Erst nach Prüfung bestätigen",
        description:
          "Nutzen Sie den offiziellen Zahlungsweg, falls verfügbar, und bewahren Sie Bestätigungen auf.",
      },
    ],

    safetyTitle: "Tipps gegen Zahlungsbetrug",
    safetyDescription:
      "Mit einigen Vorsichtsmaßnahmen schützen Sie Ihre Daten.",

    safetyPoints: [
      "Überprüfen Sie die Website-Adresse vor der Eingabe sensibler Angaben.",
      "Geben Sie niemals Passwörter, PINs oder Bankbestätigungscodes per E-Mail oder WhatsApp weiter.",
      "Seien Sie vorsichtig bei dringenden Überweisungsaufforderungen auf unbekannte Konten.",
      "Kontrollieren Sie Empfänger und Betrag vor einer Überweisung.",
      "Bewahren Sie Zahlungsbelege auf und melden Sie ungewöhnliche Anfragen.",
    ],

    warningTitle: "Vorsicht bei verdächtigen Nachrichten",
    warningDescription:
      "Senden Sie vollständige Kartendaten, Prüfziffern oder Bankbestätigungscodes niemals über Messenger. Nutzen Sie bei Zweifeln die offiziellen CYCLORIVA-Kontaktdaten.",

    faqTitle: "Häufige Fragen zur Zahlung",
    faqDescription: "Klicken Sie auf eine Frage, um die Antwort zu sehen.",

    faq: [
      {
        question: "Welche Zahlungsarten akzeptiert CYCLORIVA?",
        answer:
          "Die tatsächlich aktivierten Zahlungsmethoden müssen beim Bestellabschluss angezeigt werden. Informationen erhalten Sie unter sell@cycloriva.com.",
      },
      {
        question: "Wie erkenne ich eine erfolgreiche Zahlung?",
        answer:
          "Eine Zahlung gilt erst als bestätigt, wenn die Bank oder der Zahlungsanbieter die Transaktion tatsächlich bestätigt. Eine erfasste Bestellung reicht nicht aus.",
      },
      {
        question: "Darf ich Kartendaten über WhatsApp senden?",
        answer:
          "Nein. Senden Sie niemals vollständige Kartennummern, Ablaufdaten, Prüfziffern oder Bankbestätigungscodes über WhatsApp oder E-Mail.",
      },
      {
        question: "Was tun, wenn eine Zahlung fehlschlägt?",
        answer:
          "Prüfen Sie zunächst bei Ihrer Bank oder dem Zahlungsanbieter den Status. Vermeiden Sie doppelte Zahlungen und wenden Sie sich an sell@cycloriva.com ohne vertrauliche Kartendaten.",
      },
      {
        question: "Sind Versandkosten enthalten?",
        answer:
          "Das hängt von der Bestellung ab. Anfallende Versandkosten müssen vor der endgültigen Bestätigung angezeigt werden.",
      },
      {
        question: "Kann ich eine Erstattung beantragen?",
        answer:
          "Das hängt vom Fall, geltenden Vertragsbedingungen und Verbraucherrechten ab. Weitere Informationen finden Sie auf der Seite Rückgabe & Erstattung.",
      },
      {
        question: "Ist jede HTTPS-Website vertrauenswürdig?",
        answer:
          "Nein. HTTPS schützt die Verbindung, bestätigt aber nicht die Zuverlässigkeit des Händlers. Prüfen Sie auch Unternehmens- und Kontaktdaten.",
      },
    ],

    contactTitle: "Fragen zu einer Zahlung?",
    contactDescription:
      "Kontaktieren Sie CYCLORIVA mit Ihrer Bestellnummer, sofern vorhanden. Teilen Sie keine vertraulichen Zahlungsdaten.",

    ordersLabel: "Fragen zu Bestellungen",
    questionsLabel: "Allgemeine Fragen",
    whatsappGermany: "Deutschland",
    whatsappFrance: "Frankreich",
    contactButton: "Kontaktseite",
    customerServiceButton: "Kundenservice",

    closingTitle: "Noch unsicher vor der Zahlung?",
    closingDescription:
      "Überprüfen Sie Ihre Bestellangaben und kontaktieren Sie unser Team bei Fragen.",
    closingButton: "Kontakt aufnehmen",

    footerNotice:
      "Diese Seite enthält allgemeine Sicherheitshinweise. Sie bestätigt weder eine Zahlungsintegration noch PCI-DSS-Konformität oder ein aktiviertes Bankauthentifizierungsverfahren.",
  },

  // ========================================================
  // ITALIANO
  // ========================================================

  it: {
    home: "Home",
    pageTitle: "Pagamenti sicuri",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    metaDescription:
      "Consigli CYCLORIVA sulla sicurezza dei pagamenti, la verifica degli ordini e delle transazioni.",

    heroBadge: "INFORMAZIONI SUI PAGAMENTI",
    heroTitle: "Acquista con attenzione e informazioni chiare.",
    heroDescription:
      "Scopri come verificare un pagamento, controllare il tuo ordine e contattare CYCLORIVA.",
    heroContact: "Contatta CYCLORIVA",
    heroFAQ: "Domande frequenti",

    trustTitle: "Cosa verificare prima di pagare",
    trustDescription:
      "È importante comprendere le modalità delle transazioni online.",

    trustCards: [
      {
        title: "Connessione protetta",
        description:
          "Verifica che il sito utilizzi HTTPS. La crittografia protegge i dati trasmessi ma non garantisce da sola l'affidabilità del venditore.",
      },
      {
        title: "Fornitore di pagamento",
        description:
          "Se viene utilizzato un fornitore esterno, nome e condizioni devono apparire nel percorso di pagamento. Nessun fornitore viene dichiarato attivo in questa pagina.",
      },
      {
        title: "Controllo degli importi",
        description:
          "Verifica prodotti, quantità, costi di consegna e totale prima di autorizzare la transazione.",
      },
      {
        title: "Conferma verificata",
        description:
          "Un ordine registrato non è necessariamente pagato. La conferma deve provenire dal sistema di pagamento effettivo.",
      },
    ],

    methodsTitle: "Quali metodi di pagamento sono disponibili?",
    methodsDescription:
      "I metodi accettati devono essere mostrati durante l'ordine solo quando effettivamente attivati.",
    methodsNotice:
      "CYCLORIVA non pubblica un elenco non verificato di carte, banche o portafogli digitali. Controlla le opzioni realmente disponibili.",
    methodsContact: "Richiedi informazioni",

    stepsTitle: "I passaggi prima di pagare",
    stepsDescription: "Quattro verifiche importanti.",

    steps: [
      {
        title: "Scegli i prodotti",
        description: "Controlla caratteristiche, prezzi e quantità.",
      },
      {
        title: "Verifica il carrello",
        description: "Assicurati che articoli e importi siano corretti.",
      },
      {
        title: "Controlla il totale",
        description:
          "Verifica indirizzo, spese di consegna e modalità di pagamento.",
      },
      {
        title: "Conferma dopo la verifica",
        description:
          "Usa il percorso di pagamento ufficiale, se disponibile, e conserva le conferme.",
      },
    ],

    safetyTitle: "Come evitare le frodi",
    safetyDescription: "Precauzioni per proteggere dati e denaro.",

    safetyPoints: [
      "Controlla l'indirizzo del sito prima di inserire dati sensibili.",
      "Non comunicare password, PIN o codici bancari tramite e-mail o WhatsApp.",
      "Diffida di richieste urgenti verso conti sconosciuti.",
      "Verifica destinatario e importo prima di un bonifico.",
      "Conserva le ricevute e segnala richieste sospette.",
    ],

    warningTitle: "Attenzione alle richieste sospette",
    warningDescription:
      "Non inviare dati completi della carta, codici di sicurezza o codici bancari tramite messaggi. In caso di dubbi, contatta CYCLORIVA ai recapiti ufficiali.",

    faqTitle: "Domande frequenti sui pagamenti",
    faqDescription: "Seleziona una domanda per vedere la risposta.",

    faq: [
      {
        question: "Quali metodi accetta CYCLORIVA?",
        answer:
          "I metodi realmente disponibili devono essere mostrati al momento dell'ordine. Per le informazioni attuali, scrivi a sell@cycloriva.com.",
      },
      {
        question: "Come so se il pagamento è riuscito?",
        answer:
          "Solo una conferma effettiva della banca o del fornitore dimostra che la transazione è stata accettata. Un ordine registrato non è una prova di pagamento.",
      },
      {
        question: "Posso inviare dati della carta su WhatsApp?",
        answer:
          "No. Non inviare numeri completi, date di scadenza, codici di sicurezza o codici di autenticazione bancaria via WhatsApp o e-mail.",
      },
      {
        question: "Cosa fare se il pagamento sembra fallito?",
        answer:
          "Verifica prima lo stato presso la banca o il fornitore. Evita pagamenti duplicati e contatta sell@cycloriva.com senza condividere dati bancari sensibili.",
      },
      {
        question: "Le spese di consegna sono incluse?",
        answer:
          "Dipende dal prodotto e dalla destinazione. Le spese applicabili devono essere mostrate prima della conferma finale.",
      },
      {
        question: "Posso richiedere un rimborso?",
        answer:
          "Dipende dalle circostanze, dalle condizioni valide e dai diritti di legge. Consulta la pagina Resi e rimborsi.",
      },
      {
        question: "HTTPS garantisce che un sito sia affidabile?",
        answer:
          "No. HTTPS protegge la connessione ma non garantisce l'identità o l'affidabilità del venditore.",
      },
    ],

    contactTitle: "Domande su un pagamento?",
    contactDescription:
      "Contatta CYCLORIVA con il numero d'ordine, se disponibile. Non condividere informazioni bancarie riservate.",

    ordersLabel: "Informazioni sugli ordini",
    questionsLabel: "Domande generali",
    whatsappGermany: "Germania",
    whatsappFrance: "Francia",
    contactButton: "Pagina Contatti",
    customerServiceButton: "Servizio clienti",

    closingTitle: "Hai dubbi prima di pagare?",
    closingDescription:
      "Controlla i dati dell'ordine e contattaci per ulteriori informazioni.",
    closingButton: "Contattaci",

    footerNotice:
      "Questa pagina fornisce indicazioni generali. Non certifica integrazioni di pagamento, conformità PCI DSS o specifici sistemi di autenticazione bancaria.",
  },

  // ========================================================
  // ESPAÑOL
  // ========================================================

  es: {
    home: "Inicio",
    pageTitle: "Pagos seguros",
    eyebrow: "BICICLETAS & MOVILIDAD ELÉCTRICA EN EUROPA",
    metaDescription:
      "Consejos CYCLORIVA sobre pagos seguros, verificación de pedidos y transacciones.",

    heroBadge: "INFORMACIÓN SOBRE PAGOS",
    heroTitle: "Compra con atención y datos claros.",
    heroDescription:
      "Descubre cómo comprobar los pagos, revisar tu pedido y contactar con CYCLORIVA.",
    heroContact: "Contactar con CYCLORIVA",
    heroFAQ: "Preguntas frecuentes",

    trustTitle: "Qué debes comprobar antes de pagar",
    trustDescription:
      "Es importante entender las condiciones de una transacción online.",

    trustCards: [
      {
        title: "Conexión protegida",
        description:
          "Comprueba que el sitio de pago utilice HTTPS. El cifrado protege los datos transmitidos, pero no garantiza por sí solo que un vendedor sea fiable.",
      },
      {
        title: "Proveedor de pagos",
        description:
          "Si se utiliza un proveedor externo, su identidad y condiciones deben mostrarse durante el pago. Aquí no se afirma que ningún proveedor esté activo.",
      },
      {
        title: "Revisión del importe",
        description:
          "Comprueba productos, cantidades, gastos de entrega y total antes de autorizar una transacción.",
      },
      {
        title: "Confirmación verificada",
        description:
          "Registrar un pedido no significa que esté pagado. El pago debe confirmarse mediante el sistema correspondiente.",
      },
    ],

    methodsTitle: "¿Qué métodos de pago están disponibles?",
    methodsDescription:
      "Los métodos aceptados deben mostrarse durante la compra únicamente cuando estén habilitados.",
    methodsNotice:
      "CYCLORIVA no publica una lista no verificada de tarjetas, bancos o monederos digitales. Comprueba las opciones disponibles en el proceso real.",
    methodsContact: "Solicitar información",

    stepsTitle: "Pasos antes de pagar",
    stepsDescription: "Cuatro comprobaciones útiles durante la compra.",

    steps: [
      {
        title: "Elige tus productos",
        description: "Revisa características, precios y cantidades.",
      },
      {
        title: "Comprueba el carrito",
        description: "Verifica que los productos e importes sean correctos.",
      },
      {
        title: "Revisa el total",
        description:
          "Comprueba dirección, gastos de envío y condiciones de pago.",
      },
      {
        title: "Confirma solo cuando todo esté correcto",
        description:
          "Utiliza el sistema oficial de pago cuando esté disponible y conserva las confirmaciones.",
      },
    ],

    safetyTitle: "Consejos para evitar fraudes",
    safetyDescription: "Precauciones para proteger tus datos y tu dinero.",

    safetyPoints: [
      "Comprueba la dirección web antes de introducir información sensible.",
      "Nunca compartas contraseñas, PIN ni códigos bancarios por correo o WhatsApp.",
      "Desconfía de las peticiones urgentes a cuentas desconocidas.",
      "Verifica destinatario e importe antes de realizar una transferencia.",
      "Conserva las confirmaciones y comunica las solicitudes sospechosas.",
    ],

    warningTitle: "Cuidado con los mensajes sospechosos",
    warningDescription:
      "No envíes datos completos de tarjetas, códigos de seguridad ni códigos bancarios por mensajería. Si tienes dudas, utiliza los contactos oficiales de CYCLORIVA.",

    faqTitle: "Preguntas frecuentes sobre pagos",
    faqDescription: "Selecciona una pregunta para ver su respuesta.",

    faq: [
      {
        question: "¿Qué métodos acepta CYCLORIVA?",
        answer:
          "Los métodos realmente habilitados deben mostrarse durante la compra. Para conocer las opciones actuales, contacta con sell@cycloriva.com.",
      },
      {
        question: "¿Cómo sé si se ha aceptado mi pago?",
        answer:
          "La confirmación debe proceder de la entidad bancaria o proveedor correspondiente. Registrar un pedido no demuestra que el pago se haya completado.",
      },
      {
        question: "¿Puedo enviar datos de mi tarjeta por WhatsApp?",
        answer:
          "No. Nunca envíes el número completo, la fecha de caducidad, el código de seguridad ni códigos bancarios por WhatsApp o correo.",
      },
      {
        question: "¿Qué hago si una transacción parece fallar?",
        answer:
          "Comprueba primero el estado con tu banco o proveedor. Evita repetir pagos sin verificar y contacta con sell@cycloriva.com sin compartir datos sensibles.",
      },
      {
        question: "¿Están incluidos los gastos de envío?",
        answer:
          "Depende de los productos y el destino. Los gastos aplicables deben mostrarse antes de la confirmación final.",
      },
      {
        question: "¿Puedo solicitar un reembolso?",
        answer:
          "Depende de las circunstancias, las condiciones contractuales válidas y los derechos legales. Consulta Devoluciones y reembolsos.",
      },
      {
        question: "¿HTTPS garantiza que una tienda es fiable?",
        answer:
          "No. HTTPS protege la comunicación, pero no garantiza la identidad ni la fiabilidad del vendedor.",
      },
    ],

    contactTitle: "¿Tienes preguntas sobre un pago?",
    contactDescription:
      "Contacta con CYCLORIVA e indica el número de pedido, si lo tienes. Nunca compartas datos bancarios confidenciales.",

    ordersLabel: "Consultas sobre pedidos",
    questionsLabel: "Consultas generales",
    whatsappGermany: "Alemania",
    whatsappFrance: "Francia",
    contactButton: "Página de contacto",
    customerServiceButton: "Atención al cliente",

    closingTitle: "¿Tienes dudas antes de confirmar?",
    closingDescription:
      "Revisa los datos de tu pedido y contacta con nuestro equipo si necesitas información.",
    closingButton: "Contáctanos",

    footerNotice:
      "Esta página ofrece recomendaciones generales. No certifica integraciones de pago, conformidad PCI DSS ni ningún sistema específico de autenticación bancaria.",
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
        fr: "/fr/paiements-securises",
        en: "/en/paiements-securises",
        de: "/de/paiements-securises",
        it: "/it/paiements-securises",
        es: "/es/paiements-securises",
        "x-default": "/fr/paiements-securises",
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

function PaymentsBanner({ t }: { t: Translations }) {
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

// ==========================================================
// 7. FIL D'ARIANE
// ==========================================================

function PaymentsBreadcrumb({
  locale,
  t,
}: {
  locale: Locale;
  t: Translations;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 flex-wrap items-center gap-2 py-1 text-xs text-[#425969]"
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

function PaymentsHero({ locale, t }: { locale: Locale; t: Translations }) {
  return (
    <section className="grid min-w-0 items-center gap-3 py-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-3 lg:py-1">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-2 text-[11px] font-extrabold text-[#078d21]">
          <ShieldCheck size={17} aria-hidden="true" />
          {t.heroBadge}
        </span>

        <h2 className="mt-2 max-w-182.5 text-[29px] leading-[1.13] font-black tracking-tight text-[#102b39] sm:text-[40px] lg:text-[46px]">
          {t.heroTitle}
        </h2>

        <p className="mt-2 max-w-162.5 text-[14px] leading-7 text-[#536c7b] sm:text-[15px]">
          {t.heroDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link href={`/${locale}/contact`} className={GREEN_BUTTON}>
            <Mail size={18} />
            {t.heroContact}
            <ArrowRight size={17} />
          </Link>

          <a href="#faq-paiements" className={OUTLINE_BUTTON}>
            <CircleHelp size={18} />
            {t.heroFAQ}
          </a>
        </div>
      </div>

      {/* Illustration CSS : aucune fausse
          marque bancaire ni faux certificat */}

      <div
        className={`${CARD} relative overflow-hidden bg-[#082b3e] p-3 sm:p-3`}
      >
        <div
          aria-hidden="true"
          className="absolute -right-14 -top-14 h-52 w-52 rounded-full border-35 border-[#109b24]/15"
        />

        <div className="relative mx-auto flex min-h-62.5 max-w-112.5 flex-col justify-center sm:min-h-80">
          <div className="mb-2 flex items-center gap-3 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#109b24]">
              <LockKeyhole size={26} aria-hidden="true" />
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-[#a8efb2]">
                CYCLORIVA
              </p>

              <p className="mt-1 text-base font-extrabold">{t.pageTitle}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <CreditCard size={35} className="text-white" aria-hidden="true" />

              <ShieldCheck
                size={28}
                className="text-[#8be975]"
                aria-hidden="true"
              />
            </div>

            <div className="mt-2 flex items-center gap-3">
              {[0, 1, 2, 3].map((item) => (
                <span
                  key={item}
                  aria-hidden="true"
                  className="h-2 w-10 rounded-full bg-white/65 sm:w-14"
                />
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="h-2 w-24 rounded-full bg-white/40" />
              <div className="h-2 w-12 rounded-full bg-[#8be975]/80" />
            </div>
          </div>

          <p className="mt-2 flex items-center gap-2 text-xs leading-5 text-[#d3e4eb]">
            <ShieldCheck
              size={18}
              className="shrink-0 text-[#8be975]"
              aria-hidden="true"
            />

            {t.heroBadge}
          </p>
        </div>
      </div>
    </section>
  );
}

// ==========================================================
// 9. INFORMATIONS DE SÉCURITÉ
// ==========================================================

function PaymentsTrust({ t }: { t: Translations }) {
  const icons = [LockKeyhole, CreditCard, ReceiptText, BadgeCheck] as const;

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2">
        <h2 className={SECTION_TITLE}>{t.trustTitle}</h2>

        <p className="mt-2 max-w-197.5 text-[13px] leading-6 text-[#617586]">
          {t.trustDescription}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {t.trustCards.map((item, index) => {
          const Icon = icons[index];

          return (
            <article key={index} className={`${CARD} p-3`}>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
              </div>

              <h3 className="text-[15px] font-extrabold leading-6 text-[#102b39]">
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

// ==========================================================
// 10. MOYENS DE PAIEMENT
// ==========================================================

function PaymentsMethods({ locale, t }: { locale: Locale; t: Translations }) {
  return (
    <section className="py-1 lg:py-1">
      <div
        className={`${CARD} grid items-center gap-3 p-3 sm:p-3 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:p-3`}
      >
        <div>
          <div className="mb-2 flex h-13 w-13 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
            <Wallet size={29} aria-hidden="true" />
          </div>

          <h2 className={SECTION_TITLE}>{t.methodsTitle}</h2>

          <p className="mt-3 text-[13px] leading-6 text-[#607383]">
            {t.methodsDescription}
          </p>
        </div>

        <div className="rounded-xl border border-[#d7e7d7] bg-[#f3fbf2] p-3">
          <div className="flex items-start gap-3">
            <FileCheck2
              size={24}
              className="mt-0.5 shrink-0 text-[#109b24]"
              aria-hidden="true"
            />

            <p className="text-[13px] leading-7 text-[#315242]">
              {t.methodsNotice}
            </p>
          </div>

          <Link
            href={`/${locale}/contact`}
            className="mt-2 inline-flex items-center gap-2 text-[13px] font-extrabold text-[#078d21] hover:underline"
          >
            {t.methodsContact}
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ==========================================================
// 11. PARCOURS AVANT LE PAIEMENT
// ==========================================================

function PaymentsSteps({ t }: { t: Translations }) {
  const icons = [ShoppingCart, ClipboardList, Eye, CheckCircle2] as const;

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2 text-center">
        <h2 className={SECTION_TITLE}>{t.stepsTitle}</h2>

        <p className="mx-auto mt-2 max-w-180 text-[13px] leading-6 text-[#617586]">
          {t.stepsDescription}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {t.steps.map((item, index) => {
          const Icon = icons[index];

          return (
            <article key={index} className={`${CARD} p-3`}>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                  <Icon size={25} aria-hidden="true" />
                </div>

                <span className="text-[30px] font-black text-[#e1eee5]">
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
    </section>
  );
}

// ==========================================================
// 12. CONSEILS DE SÉCURITÉ
// ==========================================================

function PaymentsSafety({ t }: { t: Translations }) {
  return (
    <section className="py-1 lg:py-1">
      <div
        className={`${CARD} grid items-start gap-3 p-3 sm:p-3 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:p-3`}
      >
        <div>
          <ShieldCheck
            size={37}
            className="mb-2 text-[#109b24]"
            aria-hidden="true"
          />

          <h2 className={SECTION_TITLE}>{t.safetyTitle}</h2>

          <p className="mt-3 text-[13px] leading-6 text-[#617586]">
            {t.safetyDescription}
          </p>
        </div>

        <div className="space-y-3">
          {t.safetyPoints.map((point, index) => (
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

      <div className="mt-2 flex items-start gap-3 rounded-xl border border-[#ecd9b3] bg-[#fffaf0] p-3 sm:p-3">
        <AlertTriangle
          size={23}
          className="mt-0.5 shrink-0 text-[#a66b15]"
          aria-hidden="true"
        />

        <div>
          <h3 className="text-[14px] font-extrabold text-[#76511a]">
            {t.warningTitle}
          </h3>

          <p className="mt-2 text-[12px] leading-6 text-[#71552d] sm:text-[13px]">
            {t.warningDescription}
          </p>
        </div>
      </div>
    </section>
  );
}

// ==========================================================
// 13. FAQ INTERACTIVE
// ==========================================================

function PaymentsFAQ({ t }: { t: Translations }) {
  return (
    <section id="faq-paiements" className="scroll-mt-24 py-1 lg:py-1">
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

// ==========================================================
// 14. COORDONNÉES OFFICIELLES
// ==========================================================

function PaymentsContacts({ locale, t }: { locale: Locale; t: Translations }) {
  return (
    <section className="py-1 lg:py-1">
      <div className={`${CARD} p-3 sm:p-3 lg:p-3`}>
        <div className="flex items-start gap-3">
          <Headphones
            size={32}
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

        {/* ADRESSES E-MAIL */}

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <a
            href={`mailto:${SALES_EMAIL}`}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e0e9ed] bg-[#fbfcfd] p-3 transition-colors hover:border-[#109b24]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eaf8e9] text-[#109b24]">
              <Mail size={23} aria-hidden="true" />
            </div>

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
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eaf8e9] text-[#109b24]">
              <Mail size={23} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <p className="text-[12px] font-bold text-[#102b39]">
                {t.questionsLabel}
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
            {t.contactButton}
            <ArrowRight size={17} />
          </Link>

          <Link href={`/${locale}/service-client`} className={OUTLINE_BUTTON}>
            <Headphones size={18} />
            {t.customerServiceButton}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ==========================================================
// 15. SECTION FINALE
// ==========================================================

function PaymentsClosing({ locale, t }: { locale: Locale; t: Translations }) {
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

          <h2 className="mx-auto max-w-190 text-[24px] font-black tracking-tight text-white sm:text-[31px]">
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
// 16. PAGE PRINCIPALE
// ==========================================================

async function SecurePaymentsPageContent({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const t = TEXTS[locale];

  return (
    <main
      data-page="secure-payments"
      className="info-page w-full min-w-0 bg-white pb-2 text-[#102b39] lg:pb-2"
    >
      {/* Header général existant */}

      <PaymentsBanner t={t} />

      <div className={CONTAINER}>
        <PaymentsBreadcrumb locale={locale} t={t} />

        <PaymentsHero locale={locale} t={t} />

        <PaymentsTrust t={t} />

        <PaymentsMethods locale={locale} t={t} />

        <PaymentsSteps t={t} />

        <PaymentsSafety t={t} />

        <PaymentsFAQ t={t} />

        <PaymentsContacts locale={locale} t={t} />

        <PaymentsClosing locale={locale} t={t} />

        <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#6a7c88]">
          <ShieldAlert
            size={16}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          {t.footerNotice}
        </p>
      </div>

      {/* Footer général existant */}
    </main>
  );
}

// ==========================================================
// FIN — CYCLORIVA PAIEMENTS SÉCURISÉS
// ==========================================================

export default function SecurePaymentsPage(
  props: Parameters<typeof SecurePaymentsPageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <SecurePaymentsPageContent {...props} />
    </Suspense>
  );
}
