"use client";
import { accessibilityLabel } from "@/lib/accessibility-i18n";

import "@/components/site/InformationPages.css";
import { Suspense, use } from "react";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Cookie,
  FileText,
  Headphones,
  House,
  LockKeyhole,
  Mail,
  Megaphone,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
} from "lucide-react";

/**
 * ===========================================================
 * CYCLORIVA — GESTION DES COOKIES
 * ===========================================================
 *
 * Fichier :
 * app/[locale]/gestion-cookies/page.tsx
 *
 * Next.js 16 — React — TypeScript
 * Tailwind CSS 4 — Lucide React
 *
 * UN SEUL FICHIER
 *
 * /fr/gestion-cookies
 * /en/gestion-cookies
 * /de/gestion-cookies
 * /it/gestion-cookies
 * /es/gestion-cookies
 *
 * FONCTIONNALITÉS :
 * - Page responsive
 * - Cinq langues
 * - Accepter tout
 * - Refuser tout
 * - Préférences personnalisées
 * - Catégories de cookies
 * - Mémorisation du choix
 * - Expiration des préférences
 * - Modification du consentement
 * - Événement pour les intégrations
 * - FAQ
 *
 * IMPORTANT :
 * Ce gestionnaire ne charge aucun traceur.
 *
 * Les scripts statistiques et marketing doivent
 * être conditionnés au consentement AVANT
 * tout chargement dans le layout et les services.
 *
 * Aucun cookie tiers existant n'est supprimé
 * automatiquement par cette page.
 *
 * ===========================================================
 */

// ===========================================================
// 1. TYPES
// ===========================================================

type Locale = "fr" | "en" | "de" | "it" | "es";

type Preferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

type StoredConsent = {
  version: number;
  savedAt: number;
  preferences: Preferences;
};

type CategoryText = {
  title: string;
  description: string;
};

type Translations = {
  home: string;
  title: string;
  eyebrow: string;

  heroBadge: string;
  heroTitle: string;
  heroDescription: string;

  overviewTitle: string;
  overviewDescription: string;

  necessary: CategoryText;
  analytics: CategoryText;
  marketing: CategoryText;

  required: string;
  optional: string;

  preferencesTitle: string;
  preferencesDescription: string;
  notSelected: string;
  savedStatus: string;
  savedDate: string;

  acceptAll: string;
  rejectAll: string;
  saveChoices: string;

  successTitle: string;
  successDescription: string;

  informationTitle: string;
  informationDescription: string;
  informationItems: string[];

  faqTitle: string;
  faqDescription: string;
  faqs: {
    question: string;
    answer: string;
  }[];

  contactTitle: string;
  contactDescription: string;
  privacyLink: string;
  contactLink: string;
  customerService: string;

  finalTitle: string;
  finalDescription: string;

  notice: string;
};

// ===========================================================
// 2. CONFIGURATION
// ===========================================================

const STORAGE_KEY = "cycloriva_cookie_consent_v1";
const CONSENT_VERSION = 1;

// Durée technique de validité du choix : 6 mois.
// À réévaluer selon le cadre réglementaire
// applicable et les outils réellement installés.

const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

const DEFAULT_PREFERENCES: Preferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const LOCALES: Locale[] = ["fr", "en", "de", "it", "es"];

function normalizeLocale(value: string): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : "fr";
}

function clonePreferences(value: Preferences): Preferences {
  return {
    necessary: true,
    analytics: value.analytics,
    marketing: value.marketing,
  };
}

function isStoredConsent(value: unknown): value is StoredConsent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<StoredConsent>;
  const preferences = record.preferences;

  return (
    record.version === CONSENT_VERSION &&
    typeof record.savedAt === "number" &&
    Number.isFinite(record.savedAt) &&
    record.savedAt <= Date.now() &&
    Date.now() - record.savedAt < CONSENT_MAX_AGE_MS &&
    !!preferences &&
    preferences.necessary === true &&
    typeof preferences.analytics === "boolean" &&
    typeof preferences.marketing === "boolean"
  );
}

function loadConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (!isStoredConsent(parsed)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function storeConsent(value: StoredConsent): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Événement émis pour les autres composants.
 *
 * window.addEventListener(
 *   "cycloriva:cookie-consent",
 *   (event) => {
 *     // À utiliser dans une vraie intégration
 *     // analytics / marketing côté client.
 *   }
 * );
 *
 * Le consentement doit aussi être vérifié
 * AVANT de charger un script non essentiel.
 */

function notifyConsent(preferences: Preferences): void {
  window.dispatchEvent(
    new CustomEvent<Preferences>("cycloriva:cookie-consent", {
      detail: clonePreferences(preferences),
    }),
  );
}

// ===========================================================
// 3. TRADUCTIONS
// ===========================================================

const TEXTS: Record<Locale, Translations> = {
  fr: {
    home: "Accueil",
    title: "Gestion des cookies",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",

    heroBadge: "CONFIDENTIALITÉ & PRÉFÉRENCES",
    heroTitle: "Vous gardez le contrôle de vos préférences.",
    heroDescription:
      "Choisissez les catégories de cookies auxquelles vous consentez. Vous pouvez accepter, refuser ou modifier vos choix à tout moment sur cette page.",

    overviewTitle: "Quels types de cookies ?",
    overviewDescription:
      "Découvrez les différentes catégories qui peuvent être utilisées sur un site de commerce électronique.",

    necessary: {
      title: "Cookies strictement nécessaires",
      description:
        "Ils permettent les fonctions essentielles, comme la sécurité, les sessions et certaines étapes de commande. Seuls les cookies réellement indispensables peuvent être exemptés de consentement.",
    },

    analytics: {
      title: "Cookies de mesure d'audience",
      description:
        "Ils peuvent mesurer les visites et l'utilisation du site. Certains outils strictement configurés peuvent bénéficier d'une exemption, mais cette catégorie optionnelle reste désactivée tant que vous ne l'autorisez pas.",
    },

    marketing: {
      title: "Cookies publicitaires",
      description:
        "Ils peuvent servir à mesurer les campagnes publicitaires ou à personnaliser des publicités. Leur utilisation doit respecter les règles de consentement applicables.",
    },

    required: "Nécessaires",
    optional: "Facultatifs",

    preferencesTitle: "Vos préférences de cookies",
    preferencesDescription:
      "Activez uniquement les catégories facultatives que vous souhaitez autoriser.",
    notSelected: "Aucun choix enregistré",
    savedStatus: "Préférences enregistrées",
    savedDate: "Date du dernier choix",

    acceptAll: "Tout accepter",
    rejectAll: "Tout refuser",
    saveChoices: "Enregistrer mes choix",

    successTitle: "Préférences mises à jour",
    successDescription:
      "Votre choix a été pris en compte par ce gestionnaire. Les services facultatifs doivent être reliés à ces préférences pour les appliquer effectivement.",

    informationTitle: "Comment fonctionne ce gestionnaire ?",
    informationDescription:
      "Ces règles encadrent l'enregistrement et la modification de vos choix.",

    informationItems: [
      "Les catégories facultatives sont désactivées par défaut.",
      "L'acceptation et le refus sont accessibles en un clic.",
      "Le choix est mémorisé localement dans votre navigateur lorsque son stockage est disponible.",
      "Vous pouvez modifier votre choix depuis cette page.",
      "Les scripts tiers doivent être raccordés à ce consentement avant d'être activés.",
    ],

    faqTitle: "Questions fréquentes",
    faqDescription: "Réponses sur les cookies et vos choix.",

    faqs: [
      {
        question: "Qu'est-ce qu'un cookie ?",
        answer:
          "Un cookie est une information qu'un site peut enregistrer sur votre appareil pour permettre certaines fonctions ou reconnaître un navigateur.",
      },
      {
        question: "Puis-je refuser les cookies publicitaires ?",
        answer:
          "Oui. Vous pouvez refuser les catégories facultatives sans devoir les accepter pour consulter cette page.",
      },
      {
        question: "Pourquoi les cookies nécessaires restent-ils activés ?",
        answer:
          "Les traceurs strictement indispensables au service demandé peuvent être utilisés sans consentement préalable lorsqu'ils remplissent les conditions de l'exemption légale.",
      },
      {
        question: "Puis-je changer d'avis plus tard ?",
        answer:
          "Oui. Revenez sur cette page pour enregistrer une nouvelle sélection. Les services intégrés doivent respecter le changement, y compris en arrêtant les traitements concernés après un retrait.",
      },
      {
        question: "Le refus supprime-t-il tous les cookies existants ?",
        answer:
          "Non. Ce gestionnaire enregistre votre choix. L'arrêt et la suppression des cookies non essentiels déjà déposés doivent être prévus dans l'intégration des services concernés.",
      },
    ],

    contactTitle: "Une question sur vos données ?",
    contactDescription:
      "Pour les questions sur la confidentialité et l'utilisation des données personnelles, contactez CYCLORIVA.",
    privacyLink: "Politique de confidentialité",
    contactLink: "Page Contact",
    customerService: "Service client",

    finalTitle: "Votre confidentialité compte",
    finalDescription:
      "Consultez et modifiez vos préférences à tout moment. Les choix facultatifs restent sous votre contrôle.",

    notice:
      "Cette page permet de recueillir des préférences. L'inventaire des cookies, les fournisseurs, leurs durées, ainsi que le blocage et l'effacement effectifs des traceurs doivent être vérifiés et configurés avant la mise en production.",
  },

  en: {
    home: "Home",
    title: "Cookie Management",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",

    heroBadge: "PRIVACY & PREFERENCES",
    heroTitle: "Stay in control of your cookie preferences.",
    heroDescription:
      "Choose which optional cookie categories you allow. You can accept, reject or change your choices at any time.",

    overviewTitle: "Cookie categories",
    overviewDescription:
      "Learn about the categories that may be used by an online store.",

    necessary: {
      title: "Strictly necessary cookies",
      description:
        "Support essential services such as security, sessions and certain checkout functions. Only genuinely essential cookies may qualify for consent exemptions.",
    },

    analytics: {
      title: "Analytics cookies",
      description:
        "May measure traffic and website usage. Some narrowly configured analytics may qualify for an exemption, but this optional category remains off until enabled.",
    },

    marketing: {
      title: "Marketing cookies",
      description:
        "May be used for advertising measurement or personalised advertising, subject to applicable consent requirements.",
    },

    required: "Required",
    optional: "Optional",

    preferencesTitle: "Your cookie preferences",
    preferencesDescription:
      "Enable only the optional categories you wish to allow.",
    notSelected: "No choice saved",
    savedStatus: "Preferences saved",
    savedDate: "Last choice",

    acceptAll: "Accept all",
    rejectAll: "Reject all",
    saveChoices: "Save my choices",

    successTitle: "Preferences updated",
    successDescription:
      "Your choice has been saved by this manager. Optional services must be connected to these preferences for enforcement.",

    informationTitle: "How this manager works",
    informationDescription: "How preferences are stored and changed.",

    informationItems: [
      "Optional categories are disabled by default.",
      "Accept and reject are both one-click actions.",
      "Choices are saved in the browser when storage is available.",
      "You can return here to change your preferences.",
      "Third-party scripts must respect consent before activation.",
    ],

    faqTitle: "Frequently asked questions",
    faqDescription: "Answers about cookies and consent.",

    faqs: [
      {
        question: "What is a cookie?",
        answer:
          "A cookie is information that a website may store on your device to support functionality or recognise a browser.",
      },
      {
        question: "Can I reject marketing cookies?",
        answer:
          "Yes. Optional categories can be rejected without agreeing to them to view this page.",
      },
      {
        question: "Why are necessary cookies always enabled?",
        answer:
          "Strictly necessary technologies may be exempt from prior consent when they meet the applicable legal conditions.",
      },
      {
        question: "Can I change my mind?",
        answer:
          "Yes. Return to this page to save another choice. Connected services must respect withdrawal and stop the relevant processing.",
      },
      {
        question: "Does rejection remove existing cookies?",
        answer:
          "Not automatically. Services must separately implement stopping and deleting non-essential cookies they have already set.",
      },
    ],

    contactTitle: "Questions about your data?",
    contactDescription:
      "Contact CYCLORIVA for questions about privacy and personal information.",
    privacyLink: "Privacy Policy",
    contactLink: "Contact page",
    customerService: "Customer service",

    finalTitle: "Your privacy matters",
    finalDescription: "Review and change your preferences whenever you wish.",

    notice:
      "This page collects preferences. Actual cookie providers, lifetimes, script blocking and removal must be audited and configured before production.",
  },

  de: {
    home: "Startseite",
    title: "Cookie-Einstellungen",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",

    heroBadge: "DATENSCHUTZ & EINSTELLUNGEN",
    heroTitle: "Sie entscheiden über Ihre Cookie-Einstellungen.",
    heroDescription:
      "Wählen Sie aus, welche optionalen Cookie-Kategorien Sie erlauben. Sie können Ihre Entscheidung jederzeit ändern.",

    overviewTitle: "Cookie-Kategorien",
    overviewDescription:
      "Informationen zu möglichen Cookie-Arten im Online-Shop.",

    necessary: {
      title: "Unbedingt erforderliche Cookies",
      description:
        "Sie unterstützen wesentliche Funktionen wie Sicherheit, Sitzungen und Bestellabläufe. Nur tatsächlich notwendige Cookies können von der Einwilligung ausgenommen sein.",
    },

    analytics: {
      title: "Analyse-Cookies",
      description:
        "Sie können Besuche und Nutzung messen. Bestimmte eng begrenzte Analysen können ausgenommen sein; diese optionale Kategorie bleibt zunächst deaktiviert.",
    },

    marketing: {
      title: "Marketing-Cookies",
      description:
        "Sie können der Werbemessung und personalisierten Werbung dienen und unterliegen den jeweiligen Einwilligungsregeln.",
    },

    required: "Erforderlich",
    optional: "Optional",

    preferencesTitle: "Ihre Cookie-Einstellungen",
    preferencesDescription:
      "Aktivieren Sie nur die gewünschten optionalen Kategorien.",
    notSelected: "Keine Entscheidung gespeichert",
    savedStatus: "Einstellungen gespeichert",
    savedDate: "Letzte Entscheidung",

    acceptAll: "Alle akzeptieren",
    rejectAll: "Alle ablehnen",
    saveChoices: "Auswahl speichern",

    successTitle: "Einstellungen aktualisiert",
    successDescription:
      "Ihre Auswahl wurde im Manager gespeichert. Zusätzliche Dienste müssen technisch daran angebunden werden.",

    informationTitle: "So funktioniert die Verwaltung",
    informationDescription:
      "Hinweise zur Speicherung und Änderung Ihrer Auswahl.",

    informationItems: [
      "Optionale Kategorien sind standardmäßig deaktiviert.",
      "Akzeptieren und Ablehnen sind mit einem Klick möglich.",
      "Die Auswahl wird nach Möglichkeit im Browser gespeichert.",
      "Sie können die Einstellung jederzeit hier ändern.",
      "Externe Skripte müssen die Einwilligung vor dem Laden prüfen.",
    ],

    faqTitle: "Häufige Fragen",
    faqDescription: "Informationen zu Cookies und Einwilligung.",

    faqs: [
      {
        question: "Was ist ein Cookie?",
        answer:
          "Ein Cookie ist eine Information, die eine Website auf Ihrem Gerät speichern kann, etwa für Funktionen oder zur Wiedererkennung eines Browsers.",
      },
      {
        question: "Kann ich Marketing-Cookies ablehnen?",
        answer:
          "Ja. Optionale Cookies können abgelehnt werden, ohne sie für den Zugriff auf diese Seite akzeptieren zu müssen.",
      },
      {
        question: "Warum bleiben notwendige Cookies aktiv?",
        answer:
          "Technologien, die für den angeforderten Dienst unbedingt erforderlich sind, können unter den gesetzlichen Voraussetzungen ohne Einwilligung verwendet werden.",
      },
      {
        question: "Kann ich später etwas ändern?",
        answer:
          "Ja. Speichern Sie hier eine neue Auswahl. Eingebundene Dienste müssen den Widerruf technisch berücksichtigen.",
      },
      {
        question: "Werden vorhandene Cookies gelöscht?",
        answer:
          "Nicht automatisch. Die jeweiligen Dienste müssen das Stoppen und gegebenenfalls Löschen bestehender optionaler Cookies umsetzen.",
      },
    ],

    contactTitle: "Fragen zu Ihren Daten?",
    contactDescription:
      "Bei Datenschutzfragen können Sie CYCLORIVA kontaktieren.",
    privacyLink: "Datenschutzerklärung",
    contactLink: "Kontaktseite",
    customerService: "Kundenservice",

    finalTitle: "Ihre Privatsphäre ist wichtig",
    finalDescription: "Überprüfen und ändern Sie Ihre Einstellungen jederzeit.",

    notice:
      "Diese Seite speichert Cookie-Präferenzen. Tatsächliche Anbieter, Laufzeiten, Skriptsperren und Löschmechanismen müssen vor dem Produktivstart geprüft werden.",
  },

  it: {
    home: "Home",
    title: "Gestione dei cookie",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",

    heroBadge: "PRIVACY E PREFERENZE",
    heroTitle: "Mantieni il controllo delle tue preferenze.",
    heroDescription:
      "Scegli le categorie facoltative di cookie da autorizzare. Puoi modificare la tua decisione in qualsiasi momento.",

    overviewTitle: "Categorie di cookie",
    overviewDescription:
      "Informazioni sulle categorie che possono essere utilizzate da un negozio online.",

    necessary: {
      title: "Cookie strettamente necessari",
      description:
        "Supportano funzioni essenziali come sicurezza, sessioni e acquisti. Solo i cookie realmente indispensabili possono beneficiare delle esenzioni.",
    },

    analytics: {
      title: "Cookie analitici",
      description:
        "Possono misurare visite e utilizzo. Alcuni strumenti limitati possono essere esenti, ma questa categoria facoltativa rimane disattivata fino al consenso.",
    },

    marketing: {
      title: "Cookie di marketing",
      description:
        "Possono essere utilizzati per pubblicità personalizzata o misurazione delle campagne, secondo le regole applicabili.",
    },

    required: "Necessari",
    optional: "Facoltativi",

    preferencesTitle: "Le tue preferenze",
    preferencesDescription: "Attiva solo le categorie facoltative desiderate.",
    notSelected: "Nessuna scelta salvata",
    savedStatus: "Preferenze salvate",
    savedDate: "Ultima scelta",

    acceptAll: "Accetta tutti",
    rejectAll: "Rifiuta tutti",
    saveChoices: "Salva le preferenze",

    successTitle: "Preferenze aggiornate",
    successDescription:
      "La scelta è stata registrata dal gestore. Gli eventuali servizi devono essere collegati tecnicamente alle preferenze.",

    informationTitle: "Come funziona",
    informationDescription:
      "Informazioni sulla registrazione e modifica del consenso.",

    informationItems: [
      "Le categorie facoltative sono disattivate inizialmente.",
      "Accettazione e rifiuto richiedono un solo clic.",
      "Le scelte vengono salvate nel browser quando possibile.",
      "Puoi modificare le preferenze su questa pagina.",
      "Gli script esterni devono verificare il consenso prima di attivarsi.",
    ],

    faqTitle: "Domande frequenti",
    faqDescription: "Risposte su cookie e consenso.",

    faqs: [
      {
        question: "Che cos'è un cookie?",
        answer:
          "È un'informazione che un sito può memorizzare sul dispositivo per funzionalità o riconoscimento del browser.",
      },
      {
        question: "Posso rifiutare i cookie pubblicitari?",
        answer:
          "Sì. Puoi rifiutare le categorie facoltative senza doverle accettare per visitare questa pagina.",
      },
      {
        question: "Perché quelli necessari restano attivi?",
        answer:
          "I cookie strettamente necessari possono essere esenti da consenso quando soddisfano le condizioni di legge.",
      },
      {
        question: "Posso cambiare idea?",
        answer:
          "Sì. Torna su questa pagina e salva una nuova scelta. I servizi collegati devono rispettare la revoca.",
      },
      {
        question: "Il rifiuto elimina i cookie esistenti?",
        answer:
          "Non automaticamente. Gli strumenti collegati devono implementare separatamente l'interruzione e la rimozione dei cookie facoltativi.",
      },
    ],

    contactTitle: "Domande sui tuoi dati?",
    contactDescription: "Contatta CYCLORIVA per informazioni sulla privacy.",
    privacyLink: "Informativa sulla privacy",
    contactLink: "Pagina Contatti",
    customerService: "Servizio clienti",

    finalTitle: "La tua privacy conta",
    finalDescription: "Controlla e modifica le preferenze quando desideri.",

    notice:
      "Questa pagina registra preferenze. Fornitori, durata dei cookie, blocco degli script e cancellazione devono essere verificati prima della pubblicazione.",
  },

  es: {
    home: "Inicio",
    title: "Gestión de cookies",
    eyebrow: "BICICLETAS & MOVILIDAD ELÉCTRICA EN EUROPA",

    heroBadge: "PRIVACIDAD Y PREFERENCIAS",
    heroTitle: "Tú controlas tus preferencias de cookies.",
    heroDescription:
      "Elige qué categorías opcionales quieres permitir. Puedes aceptar, rechazar o modificar tu elección cuando quieras.",

    overviewTitle: "Categorías de cookies",
    overviewDescription:
      "Información sobre las categorías que puede utilizar una tienda online.",

    necessary: {
      title: "Cookies estrictamente necesarias",
      description:
        "Permiten funciones esenciales como seguridad, sesiones y pedidos. Solo las realmente necesarias pueden estar exentas de consentimiento.",
    },

    analytics: {
      title: "Cookies de análisis",
      description:
        "Pueden medir visitas y uso. Algunas herramientas limitadas pueden estar exentas, pero esta categoría opcional permanece desactivada hasta que se autorice.",
    },

    marketing: {
      title: "Cookies publicitarias",
      description:
        "Pueden utilizarse para medir campañas y personalizar publicidad conforme a las normas aplicables.",
    },

    required: "Necesarias",
    optional: "Opcionales",

    preferencesTitle: "Tus preferencias",
    preferencesDescription:
      "Activa solo las categorías opcionales que quieras permitir.",
    notSelected: "Ninguna elección guardada",
    savedStatus: "Preferencias guardadas",
    savedDate: "Última elección",

    acceptAll: "Aceptar todas",
    rejectAll: "Rechazar todas",
    saveChoices: "Guardar mis opciones",

    successTitle: "Preferencias actualizadas",
    successDescription:
      "El administrador ha registrado tu elección. Los servicios opcionales deben conectarse técnicamente a estas preferencias.",

    informationTitle: "Cómo funciona",
    informationDescription:
      "Información sobre el almacenamiento y la modificación del consentimiento.",

    informationItems: [
      "Las categorías opcionales están desactivadas por defecto.",
      "Aceptar y rechazar requieren un solo clic.",
      "Las elecciones se guardan en el navegador cuando es posible.",
      "Puedes volver a esta página para cambiarlas.",
      "Los scripts externos deben comprobar el consentimiento antes de activarse.",
    ],

    faqTitle: "Preguntas frecuentes",
    faqDescription: "Respuestas sobre cookies y consentimiento.",

    faqs: [
      {
        question: "¿Qué es una cookie?",
        answer:
          "Es información que una web puede almacenar en tu dispositivo para funciones del sitio o reconocimiento del navegador.",
      },
      {
        question: "¿Puedo rechazar las cookies publicitarias?",
        answer:
          "Sí. Puedes rechazar las categorías opcionales sin tener que aceptarlas para acceder a esta página.",
      },
      {
        question: "¿Por qué siguen activas las necesarias?",
        answer:
          "Las tecnologías estrictamente necesarias pueden estar exentas de consentimiento cuando cumplen los requisitos legales.",
      },
      {
        question: "¿Puedo cambiar de opinión?",
        answer:
          "Sí. Guarda una nueva selección en esta página. Los servicios conectados deben respetar la retirada del consentimiento.",
      },
      {
        question: "¿Se eliminan todas las cookies existentes?",
        answer:
          "No automáticamente. Cada servicio debe implementar el bloqueo y la eliminación de sus cookies opcionales.",
      },
    ],

    contactTitle: "¿Preguntas sobre tus datos?",
    contactDescription: "Contacta con CYCLORIVA para cuestiones de privacidad.",
    privacyLink: "Política de privacidad",
    contactLink: "Página de contacto",
    customerService: "Atención al cliente",

    finalTitle: "Tu privacidad importa",
    finalDescription: "Revisa y modifica tus preferencias siempre que quieras.",

    notice:
      "Esta página registra preferencias. Los proveedores, la duración, el bloqueo y la eliminación de cookies deben verificarse y configurarse antes de producción.",
  },
};

// ===========================================================
// 4. COMPOSANTS VISUELS
// ===========================================================

const CONTAINER = "mx-auto w-full max-w-none px-4 sm:px-6 lg:px-6 xl:px-8";

const CARD =
  "rounded-2xl border border-[#dce5ec] bg-white " +
  "shadow-[0_3px_15px_rgba(16,43,57,0.045)]";

const BUTTON =
  "inline-flex min-h-12 items-center justify-center " +
  "gap-2 rounded-xl px-5 py-3 text-sm font-extrabold " +
  "transition-colors focus-visible:outline-2 " +
  "focus-visible:outline-offset-2";

function CategoryCard({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: typeof Cookie;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <article className={`${CARD} p-3 sm:p-4`}>
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
        <Icon size={26} aria-hidden="true" />
      </div>

      <span className="inline-block rounded-full bg-[#f0f7f2] px-3 py-1 text-[11px] font-bold text-[#27833b]">
        {badge}
      </span>

      <h3 className="mt-2 text-base font-black text-[#102b39]">{title}</h3>

      <p className="mt-3 text-[13px] leading-6 text-[#526979]">{description}</p>
    </article>
  );
}

// ===========================================================
// 5. PAGE PRINCIPALE
// ===========================================================

function CookieManagementPageContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // React 19 / Next.js 16 : lecture d'une
  // promesse de params dans un composant client.
  const resolvedParams = use(params);

  const locale = normalizeLocale(resolvedParams.locale);

  const t = TEXTS[locale];

  const [preferences, setPreferences] = useState<Preferences>(
    clonePreferences(DEFAULT_PREFERENCES),
  );

  const [saved, setSaved] = useState<StoredConsent | null>(null);

  const [ready, setReady] = useState(false);
  const [updated, setUpdated] = useState(false);

  // Chargement du choix uniquement dans le navigateur.
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const previous = loadConsent();

      if (previous) {
        setPreferences(clonePreferences(previous.preferences));
        setSaved(previous);
      }

      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function savePreferences(selection: Preferences) {
    const normalized = clonePreferences(selection);

    const nextConsent: StoredConsent = {
      version: CONSENT_VERSION,
      savedAt: Date.now(),
      preferences: normalized,
    };

    const persisted = storeConsent(nextConsent);

    setPreferences(normalized);
    setSaved(persisted ? nextConsent : null);
    setUpdated(persisted);

    notifyConsent(normalized);
  }

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const saveCustom = () => {
    savePreferences(preferences);
  };

  const lastSaved = saved
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(saved.savedAt))
    : null;

  return (
    <main
      data-page="cookie-management"
      className="info-page w-full min-w-0  bg-white pb-2 text-[#102b39]"
    >
      {/* Bandeau PC */}

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
          <p className="mb-2 text-[11px] font-extrabold tracking-wider text-[#a8efb2]">
            {t.eyebrow}
          </p>

          <h1 className="text-[32px] font-black text-white xl:text-[38px]">
            {t.title}
          </h1>
        </div>
      </section>

      <div className={CONTAINER}>
        {/* Fil d'Ariane */}

        <nav
          aria-label={accessibilityLabel(locale, "breadcrumb")}
          className="flex flex-wrap items-center gap-2 py-1 text-xs"
        >
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-[#536c7b] hover:text-[#109b24]"
          >
            <House size={17} className="text-[#109b24]" />
            {t.home}
          </Link>

          <ChevronRight size={15} className="text-[#109b24]" />

          <span aria-current="page" className="font-bold text-[#102b39]">
            {t.title}
          </span>
        </nav>

        {/* Introduction */}

        <section className="grid items-center gap-3 py-2 lg:grid-cols-2 lg:py-1">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-2 text-[11px] font-extrabold text-[#078d21]">
              <Cookie size={17} />
              {t.heroBadge}
            </span>

            <h2 className="mt-2 max-w-175 text-[30px] leading-tight font-black tracking-tight sm:text-[43px]">
              {t.heroTitle}
            </h2>

            <p className="mt-2 max-w-162.5 text-sm leading-7 text-[#536c7b] sm:text-[15px]">
              {t.heroDescription}
            </p>

            <a
              href="#preferences"
              className={`${BUTTON} mt-3 bg-[#109b24] text-white hover:bg-[#08791b]`}
            >
              <Settings2 size={19} />
              {t.preferencesTitle}
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="relative flex min-h-60 items-center justify-center overflow-hidden rounded-2xl bg-[#082b3e] p-3 sm:min-h-82.5">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-40 border-[#109b24]/20" />

            <div className="relative flex w-full max-w-95 flex-col items-center rounded-2xl border border-white/20 bg-white/10 px-6 py-1 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#109b24] text-white">
                <Cookie size={43} />
              </div>

              <p className="mt-2 text-xs font-extrabold tracking-[0.14em] text-[#a8efb2]">
                CYCLORIVA
              </p>

              <h3 className="mt-2 text-xl font-black text-white">{t.title}</h3>

              <div className="mt-3 flex gap-3 text-[#a8efb2]">
                <LockKeyhole size={24} />
                <Settings2 size={24} />
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>
        </section>

        {/* Catégories */}

        <section className="py-1 lg:py-1">
          <h2 className="text-[25px] font-black sm:text-[31px]">
            {t.overviewTitle}
          </h2>

          <p className="mt-2 max-w-197.5 text-sm leading-7 text-[#617586]">
            {t.overviewDescription}
          </p>

          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            <CategoryCard
              icon={LockKeyhole}
              title={t.necessary.title}
              description={t.necessary.description}
              badge={t.required}
            />

            <CategoryCard
              icon={BarChart3}
              title={t.analytics.title}
              description={t.analytics.description}
              badge={t.optional}
            />

            <CategoryCard
              icon={Megaphone}
              title={t.marketing.title}
              description={t.marketing.description}
              badge={t.optional}
            />
          </div>
        </section>

        {/* Gestionnaire */}

        <section id="preferences" className="scroll-mt-24 py-1 lg:py-1">
          <div className={`${CARD} overflow-hidden`}>
            <div className="bg-[#102b39] px-5 py-2 sm:px-8">
              <div className="flex items-center gap-3">
                <Settings2 size={29} className="text-[#9bea8b]" />

                <h2 className="text-[22px] font-black text-white sm:text-[27px]">
                  {t.preferencesTitle}
                </h2>
              </div>

              <p className="mt-3 max-w-187.5 text-[13px] leading-6 text-[#d2e3e9]">
                {t.preferencesDescription}
              </p>
            </div>

            <div className="p-3 sm:p-3">
              <div className="mb-3 flex flex-wrap items-center gap-3 text-[12px]">
                <span className="flex items-center gap-2 font-bold text-[#476174]">
                  {saved ? (
                    <CheckCircle2 size={18} className="text-[#109b24]" />
                  ) : (
                    <Cookie size={18} className="text-[#8193a0]" />
                  )}

                  {!ready ? "..." : saved ? t.savedStatus : t.notSelected}
                </span>

                {lastSaved && (
                  <span className="text-[#718591]">
                    {t.savedDate}: {lastSaved}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {/* Nécessaires */}

                <div className="flex items-start justify-between gap-3 rounded-xl border border-[#dce7ed] bg-[#fafcfd] p-3 sm:p-3">
                  <div className="flex min-w-0 gap-3">
                    <LockKeyhole
                      size={22}
                      className="mt-0.5 shrink-0 text-[#109b24]"
                    />

                    <div>
                      <h3 className="text-sm font-extrabold">
                        {t.necessary.title}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-[#647987]">
                        {t.necessary.description}
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked
                    disabled
                    aria-label={t.necessary.title}
                    className="mt-1 h-5 w-5 shrink-0 accent-[#109b24]"
                  />
                </div>

                {/* Statistiques */}

                <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-[#dce7ed] bg-white p-3 transition-colors hover:bg-[#f7fbf7] sm:p-3">
                  <div className="flex min-w-0 gap-3">
                    <BarChart3
                      size={22}
                      className="mt-0.5 shrink-0 text-[#109b24]"
                    />

                    <div>
                      <h3 className="text-sm font-extrabold">
                        {t.analytics.title}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-[#647987]">
                        {t.analytics.description}
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    disabled={!ready}
                    onChange={(event) => {
                      setPreferences((current) => ({
                        ...current,
                        analytics: event.target.checked,
                      }));
                      setUpdated(false);
                    }}
                    className="mt-1 h-5 w-5 shrink-0 accent-[#109b24]"
                  />
                </label>

                {/* Publicité */}

                <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-[#dce7ed] bg-white p-3 transition-colors hover:bg-[#f7fbf7] sm:p-3">
                  <div className="flex min-w-0 gap-3">
                    <Megaphone
                      size={22}
                      className="mt-0.5 shrink-0 text-[#109b24]"
                    />

                    <div>
                      <h3 className="text-sm font-extrabold">
                        {t.marketing.title}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-[#647987]">
                        {t.marketing.description}
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    disabled={!ready}
                    onChange={(event) => {
                      setPreferences((current) => ({
                        ...current,
                        marketing: event.target.checked,
                      }));
                      setUpdated(false);
                    }}
                    className="mt-1 h-5 w-5 shrink-0 accent-[#109b24]"
                  />
                </label>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  disabled={!ready}
                  onClick={rejectAll}
                  className={`${BUTTON} border border-[#b9cad2] bg-white text-[#102b39] hover:bg-[#f0f5f7] disabled:opacity-50`}
                >
                  {t.rejectAll}
                </button>

                <button
                  type="button"
                  disabled={!ready}
                  onClick={acceptAll}
                  className={`${BUTTON} bg-[#109b24] text-white hover:bg-[#08791b] disabled:opacity-50`}
                >
                  {t.acceptAll}
                </button>

                <button
                  type="button"
                  disabled={!ready}
                  onClick={saveCustom}
                  className={`${BUTTON} border border-[#102b39] bg-[#102b39] text-white hover:bg-[#21475a] disabled:opacity-50`}
                >
                  <Save size={18} />
                  {t.saveChoices}
                </button>
              </div>

              {updated && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-3 rounded-xl border border-[#cce8c9] bg-[#f1fbef] p-3"
                >
                  <p className="flex items-center gap-2 text-sm font-extrabold text-[#167c2a]">
                    <CheckCircle2 size={20} />
                    {t.successTitle}
                  </p>

                  <p className="mt-2 text-xs leading-6 text-[#3f6550]">
                    {t.successDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Fonctionnement */}

        <section className="py-1 lg:py-1">
          <div className={`${CARD} grid gap-3 p-3 sm:p-3 lg:grid-cols-2`}>
            <div>
              <ShieldCheck size={36} className="text-[#109b24]" />

              <h2 className="mt-2 text-[24px] font-black sm:text-[29px]">
                {t.informationTitle}
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#617586]">
                {t.informationDescription}
              </p>
            </div>

            <div className="space-y-3">
              {t.informationItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-[#e0e9ed] bg-[#f8fcf8] p-3"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-[#109b24]"
                  />

                  <p className="text-[13px] leading-6 text-[#415b6b]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}

        <section className="py-1 lg:py-1">
          <div className="mb-3 flex items-center gap-3">
            <Cookie size={29} className="text-[#109b24]" />

            <div>
              <h2 className="text-[24px] font-black sm:text-[30px]">
                {t.faqTitle}
              </h2>

              <p className="mt-1 text-sm text-[#617586]">{t.faqDescription}</p>
            </div>
          </div>

          <div className={`${CARD} space-y-2 p-3 sm:p-3`}>
            {t.faqs.map((item, index) => (
              <details
                key={index}
                className="group overflow-hidden rounded-xl border border-[#dce6ed] open:border-[#b9dfb9]"
              >
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13px] font-extrabold text-[#102b39] hover:bg-[#f7fbf7] [&::-webkit-details-marker]:hidden">
                  {item.question}

                  <ChevronDown
                    size={19}
                    className="shrink-0 text-[#109b24] transition-transform group-open:rotate-180"
                  />
                </summary>

                <div className="mx-3 mb-3 rounded-lg bg-[#ecf9e9] p-3">
                  <p className="text-[13px] leading-6 text-[#234334]">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Contacts */}

        <section className="py-1 lg:py-1">
          <div className={`${CARD} p-3 sm:p-3`}>
            <div className="flex items-start gap-3">
              <Headphones size={30} className="shrink-0 text-[#109b24]" />

              <div>
                <h2 className="text-[23px] font-black sm:text-[29px]">
                  {t.contactTitle}
                </h2>

                <p className="mt-2 text-sm leading-7 text-[#617586]">
                  {t.contactDescription}
                </p>
              </div>
            </div>

            <a
              href="mailto:contact@cycloriva.com"
              className="mt-3 flex items-center gap-3 rounded-xl border border-[#dce7ed] bg-[#f9fcfd] p-3 hover:border-[#109b24]"
            >
              <Mail size={23} className="text-[#109b24]" />

              <span className="break-all text-sm font-bold">
                contact@cycloriva.com
              </span>
            </a>

            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/politique-confidentialite`}
                className={`${BUTTON} border border-[#b9cad2] text-[#102b39] hover:bg-[#f4f8fa]`}
              >
                <FileText size={18} />
                {t.privacyLink}
              </Link>

              <Link
                href={`/${locale}/contact`}
                className={`${BUTTON} bg-[#109b24] text-white hover:bg-[#08791b]`}
              >
                <Mail size={18} />
                {t.contactLink}
              </Link>

              <Link
                href={`/${locale}/service-client`}
                className={`${BUTTON} border border-[#b9cad2] text-[#102b39] hover:bg-[#f4f8fa]`}
              >
                <Headphones size={18} />
                {t.customerService}
              </Link>
            </div>
          </div>
        </section>

        {/* Section finale */}

        <section className="py-1 lg:py-1">
          <div className="rounded-2xl bg-[#082b3e] px-5 py-11 text-center sm:px-8">
            <Cookie size={40} className="mx-auto text-[#8be975]" />

            <h2 className="mt-2 text-[24px] font-black text-white sm:text-[31px]">
              {t.finalTitle}
            </h2>

            <p className="mx-auto mt-2 max-w-167.5 text-sm leading-7 text-[#d5e5eb]">
              {t.finalDescription}
            </p>

            <a
              href="#preferences"
              className={`${BUTTON} mt-3 bg-[#109b24] text-white hover:bg-[#08791b]`}
            >
              <RotateCcw size={18} />
              {t.preferencesTitle}
            </a>
          </div>
        </section>

        <p className="mt-2 flex items-start gap-2 text-xs leading-6 text-[#6a7c88]">
          <ShieldCheck size={17} className="mt-1 shrink-0 text-[#109b24]" />
          {t.notice}
        </p>
      </div>
    </main>
  );
}

// ===========================================================
// FIN — CYCLORIVA GESTION DES COOKIES
// ===========================================================

export default function CookieManagementPage(
  props: Parameters<typeof CookieManagementPageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <CookieManagementPageContent {...props} />
    </Suspense>
  );
}
