import "@/components/site/InformationPages.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronRight, House } from "lucide-react";

import ContactClient from "@/components/contact/ContactClient";

import {
  normalizeCheckoutLocale,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

/**
 * ============================================================
 * CYCLORIVA — PAGE CONTACT
 * ============================================================
 *
 * Fichier :
 * app/[locale]/contact/page.tsx
 *
 * Stack :
 * - Next.js 16 / App Router
 * - React 19
 * - TypeScript
 * - Tailwind CSS 4
 *
 * LANGUES :
 * /fr/contact
 * /en/contact
 * /de/contact
 * /it/contact
 * /es/contact
 *
 * ARCHITECTURE :
 *
 * SiteHeader / SiteChrome (déjà existant)
 * |
 * +-- Bandeau "Contactez-nous" sur PC
 * |
 * +-- Fil d'Ariane : Accueil > Contact
 * |
 * +-- ContactClient
 *      |
 *      +-- Nos coordonnées
 *      |    - sell@cycloriva.com
 *      |    - contact@cycloriva.com
 *      |    - WhatsApp Allemagne
 *      |    - WhatsApp France
 *      |
 *      +-- ContactForm
 *      |    - Nom
 *      |    - Prénom
 *      |    - E-mail
 *      |    - Sujet
 *      |    - Message
 *      |
 *      +-- ContactFAQ
 *           - Accordéon interactif
 *           - Questions fréquentes
 * |
 * SiteFooter / SiteChrome (déjà existant)
 *
 * DESIGN :
 * - Bleu marine : #102b39
 * - Vert CYCLORIVA : #109b24
 * - Blanc
 *
 * IMPORTANT :
 * - Aucun header général en double
 * - Aucun footer général en double
 * - Aucune coordonnée fictive
 * - Aucun horaire d'assistance inventé
 * - Aucun secret Resend exposé au navigateur
 * - Aucun envoi d'e-mail dans ce fichier
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

type ContactPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

type ContactPageTexts = {
  title: string;
  eyebrow: string;
  home: string;
  contact: string;
  description: string;
  breadcrumbLabel: string;
  mainContentLabel: string;
};

// ============================================================
// 2. LANGUES AUTORISÉES
// ============================================================

const SUPPORTED_LOCALES = ["fr", "en", "de", "it", "es"] as const;

function resolveContactLocale(rawLocale: string): CheckoutLocale {
  if (!SUPPORTED_LOCALES.some((locale) => locale === rawLocale)) {
    notFound();
  }

  return normalizeCheckoutLocale(rawLocale);
}

// ============================================================
// 3. TRADUCTIONS DE LA PAGE
// ============================================================

const CONTACT_PAGE_TEXTS: Record<CheckoutLocale, ContactPageTexts> = {
  // ----------------------------------------------------------
  // FRANÇAIS
  // ----------------------------------------------------------

  fr: {
    title: "Contactez-nous",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    home: "Accueil",
    contact: "Contact",
    description:
      "Contactez CYCLORIVA pour toute question concernant une commande, un produit, une livraison ou une demande d'assistance.",
    breadcrumbLabel: "Fil d'Ariane",
    mainContentLabel: "Informations de contact CYCLORIVA",
  },

  // ----------------------------------------------------------
  // ANGLAIS
  // ----------------------------------------------------------

  en: {
    title: "Contact us",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    home: "Home",
    contact: "Contact",
    description:
      "Contact CYCLORIVA with questions about orders, products, deliveries or customer support.",
    breadcrumbLabel: "Breadcrumb",
    mainContentLabel: "CYCLORIVA contact information",
  },

  // ----------------------------------------------------------
  // ALLEMAND
  // ----------------------------------------------------------

  de: {
    title: "Kontaktieren Sie uns",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    home: "Startseite",
    contact: "Kontakt",
    description:
      "Kontaktieren Sie CYCLORIVA bei Fragen zu Bestellungen, Produkten, Lieferungen oder unserem Kundenservice.",
    breadcrumbLabel: "Brotkrumennavigation",
    mainContentLabel: "CYCLORIVA Kontaktinformationen",
  },

  // ----------------------------------------------------------
  // ITALIEN
  // ----------------------------------------------------------

  it: {
    title: "Contattaci",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    home: "Home",
    contact: "Contatti",
    description:
      "Contatta CYCLORIVA per domande su ordini, prodotti, consegne o assistenza clienti.",
    breadcrumbLabel: "Percorso di navigazione",
    mainContentLabel: "Informazioni di contatto CYCLORIVA",
  },

  // ----------------------------------------------------------
  // ESPAGNOL
  // ----------------------------------------------------------

  es: {
    title: "Contáctanos",
    eyebrow: "BICICLETAS & E-MOVILIDAD EN EUROPA",
    home: "Inicio",
    contact: "Contacto",
    description:
      "Contacta con CYCLORIVA para consultas sobre pedidos, productos, entregas o atención al cliente.",
    breadcrumbLabel: "Ruta de navegación",
    mainContentLabel: "Información de contacto de CYCLORIVA",
  },
};

// ============================================================
// 4. STYLES PARTAGÉS
// ============================================================

const CONTAINER_CLASS = [
  "mx-auto",
  "w-full",
  "min-w-0",
  "max-w-none",
  "px-4",
  "sm:px-6",
  "lg:px-6",
  "xl:px-8",
].join(" ");

// ============================================================
// 5. MÉTADONNÉES SEO
// ============================================================

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const locale = resolveContactLocale(rawLocale);

  const texts = CONTACT_PAGE_TEXTS[locale];

  return {
    title: `${texts.title} | CYCLORIVA`,

    description: texts.description,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      languages: {
        fr: "/fr/contact",
        en: "/en/contact",
        de: "/de/contact",
        it: "/it/contact",
        es: "/es/contact",
        "x-default": "/fr/contact",
      },
    },

    openGraph: {
      images: [{ url: "/images/imager.png", width: 1536, height: 1024, alt: "CYCLORIVA" }],
      type: "website",
      title: `${texts.title} | CYCLORIVA`,
      description: texts.description,
    },
  };
}

// ============================================================
// 6. BANDEAU PC
// ============================================================

function ContactBanner({ locale }: { locale: CheckoutLocale }) {
  const texts = CONTACT_PAGE_TEXTS[locale];

  return (
    <section
      aria-label={texts.title}
      className={[
        "relative",
        "hidden",
        "min-h-27.5",
        "w-full",
        "overflow-hidden",
        "bg-[#082a3f]",
        "lg:block",
        "xl:min-h-30",
      ].join(" ")}
    >
      {/* ====================================================
          IMAGE DE COUVERTURE
      ==================================================== */}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/couverture.png')",
        }}
      />

      {/* ====================================================
          DÉGRADÉ BLEU MARINE
      ==================================================== */}

      <div
        aria-hidden="true"
        className={[
          "absolute",
          "inset-0",
          "bg-linear-to-r",
          "from-[#061f32]/95",
          "via-[#061f32]/80",
          "to-[#061f32]/10",
        ].join(" ")}
      />

      {/* ====================================================
          CONTENU DU BANDEAU
      ==================================================== */}

      <div
        className={[
          CONTAINER_CLASS,
          "relative",
          "z-10",
          "flex",
          "min-h-27.5",
          "flex-col",
          "justify-center",
          "py-5",
          "xl:min-h-30",
        ].join(" ")}
      >
        {/* PETIT TITRE */}

        <p
          className={[
            "mb-2",
            "flex",
            "items-center",
            "gap-2",
            "text-[10px]",
            "font-extrabold",
            "tracking-[0.08em]",
            "text-white",
            "xl:text-[11px]",
          ].join(" ")}
        >
          <span aria-hidden="true" className="h-0.75 w-6 bg-[#91df20]" />

          {texts.eyebrow}
        </p>

        {/* TITRE PRINCIPAL */}

        <h1
          className={[
            "max-w-200",
            "text-[31px]",
            "leading-tight",
            "font-black",
            "tracking-tight",
            "text-white",
            "xl:text-[36px]",
          ].join(" ")}
        >
          {texts.title}
        </h1>
      </div>
    </section>
  );
}

// ============================================================
// 7. FIL D'ARIANE
// ============================================================

function ContactBreadcrumb({ locale }: { locale: CheckoutLocale }) {
  const texts = CONTACT_PAGE_TEXTS[locale];

  return (
    <nav
      aria-label={texts.breadcrumbLabel}
      className={[
        "flex",
        "min-w-0",
        "flex-wrap",
        "items-center",
        "gap-x-2",
        "gap-y-1",
        "py-3",
        "text-[11px]",
        "leading-5",
        "text-[#385267]",
        "sm:py-4",
        "sm:text-[12px]",
      ].join(" ")}
    >
      {/* ACCUEIL */}

      <Link
        href={`/${locale}`}
        className={[
          "inline-flex",
          "items-center",
          "gap-2",
          "transition-colors",
          "hover:text-[#109b24]",
          "focus-visible:outline-2",
          "focus-visible:outline-offset-2",
          "focus-visible:outline-[#109b24]",
        ].join(" ")}
      >
        <House
          size={17}
          strokeWidth={1.9}
          className="text-[#109b24]"
          aria-hidden="true"
        />

        <span>{texts.home}</span>
      </Link>

      {/* SÉPARATEUR */}

      <ChevronRight
        size={14}
        strokeWidth={2}
        className="text-[#109b24]"
        aria-hidden="true"
      />

      {/* PAGE ACTUELLE */}

      <span aria-current="page" className="font-semibold text-[#102b39]">
        {texts.contact}
      </span>
    </nav>
  );
}

// ============================================================
// 8. PAGE PRINCIPALE
// ============================================================

async function ContactPageContent({ params }: ContactPageProps) {
  // ----------------------------------------------------------
  // LANGUE
  // ----------------------------------------------------------

  const { locale: rawLocale } = await params;

  const locale = resolveContactLocale(rawLocale);

  const texts = CONTACT_PAGE_TEXTS[locale];

  // ----------------------------------------------------------
  // RENDU
  // ----------------------------------------------------------

  return (
    <main
      data-page="contact"
      className={[
        "info-page",
        "w-full",
        "min-w-0",
        "bg-white",
        "text-[#102b39]",
        "pb-5",
        "sm:pb-5",
        "lg:pb-6",
      ].join(" ")}
    >
      {/* ====================================================
          BANDEAU PC
      ==================================================== */}

      <ContactBanner locale={locale} />

      {/* ====================================================
          CONTENU CENTRAL
      ==================================================== */}

      <div className={CONTAINER_CLASS}>
        {/* FIL D'ARIANE */}

        <ContactBreadcrumb locale={locale} />

        {/* ==================================================
            SECTION CONTACT
        ================================================== */}

        <section
          aria-label={texts.mainContentLabel}
          className="min-w-0 pt-1 sm:pt-2 lg:pt-1"
        >
          <ContactClient locale={locale} />
        </section>
      </div>
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA CONTACT PAGE
// ============================================================

export default function ContactPage(
  props: Parameters<typeof ContactPageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <ContactPageContent {...props} />
    </Suspense>
  );
}
