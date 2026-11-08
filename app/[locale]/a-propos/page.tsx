import { accessibilityLabel } from "@/lib/accessibility-i18n";
import "@/components/site/InformationPages.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRight,
  BadgeCheck,
  Bike,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Headphones,
  HeartHandshake,
  House,
  Leaf,
  Mail,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

/**
 * ============================================================
 * CYCLORIVA — PAGE À PROPOS
 * ============================================================
 *
 * Fichier :
 * app/[locale]/a-propos/page.tsx
 *
 * Next.js 16 / App Router
 * React / TypeScript / Tailwind CSS 4
 *
 * Un seul fichier.
 *
 * Compatible avec :
 * /fr/a-propos
 * /en/a-propos
 * /de/a-propos
 * /it/a-propos
 * /es/a-propos
 *
 * Design :
 * - Bleu marine : #102b39
 * - Vert : #109b24
 * - Blanc
 *
 * Responsive :
 * - Ordinateur
 * - Tablette
 * - Téléphone
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
  params: Promise<{
    locale: string;
  }>;
};

type AboutTexts = {
  pageTitle: string;
  eyebrow: string;
  breadcrumbHome: string;
  breadcrumbAbout: string;

  heroLabel: string;
  heroTitle: string;
  heroDescription: string;
  exploreProducts: string;
  contactUs: string;

  whoTitle: string;
  whoParagraph1: string;
  whoParagraph2: string;

  valuesTitle: string;
  valuesDescription: string;

  valueSelection: string;
  valueSelectionDescription: string;
  valueClarity: string;
  valueClarityDescription: string;
  valueSupport: string;
  valueSupportDescription: string;
  valueMobility: string;
  valueMobilityDescription: string;

  categoriesTitle: string;
  categoriesDescription: string;
  electricBikes: string;
  mountainBikes: string;
  cargoBikes: string;
  cityBikes: string;
  accessories: string;
  discoverCatalogue: string;

  countriesTitle: string;
  countriesDescription: string;

  howTitle: string;
  howDescription: string;

  stepOneTitle: string;
  stepOneDescription: string;
  stepTwoTitle: string;
  stepTwoDescription: string;
  stepThreeTitle: string;
  stepThreeDescription: string;

  contactTitle: string;
  contactDescription: string;
  salesEmailLabel: string;
  supportEmailLabel: string;
  contactButton: string;

  closingTitle: string;
  closingDescription: string;

  metadataDescription: string;
};

type Country = {
  code: string;
  flag: string;
  names: Record<Locale, string>;
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
// 3. TRADUCTIONS
// ============================================================

const TEXTS: Record<Locale, AboutTexts> = {
  fr: {
    pageTitle: "À propos de CYCLORIVA",
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    breadcrumbHome: "Accueil",
    breadcrumbAbout: "À propos",

    heroLabel: "DÉCOUVREZ CYCLORIVA",
    heroTitle: "La mobilité à vélo, tout simplement.",
    heroDescription:
      "Découvrez CYCLORIVA, une boutique en ligne consacrée aux vélos, à la mobilité électrique et aux accessoires pour vos déplacements.",
    exploreProducts: "Découvrir nos produits",
    contactUs: "Nous contacter",

    whoTitle: "Qui sommes-nous ?",
    whoParagraph1:
      "CYCLORIVA est une boutique en ligne spécialisée dans l'univers du vélo et de l'e-mobilité. Notre catalogue rassemble différentes catégories de vélos et d'accessoires destinés aux déplacements quotidiens, aux loisirs et aux aventures.",
    whoParagraph2:
      "Notre objectif est de proposer une expérience d'achat claire et pratique : découvrir les produits, consulter leurs caractéristiques, sélectionner les articles souhaités et transmettre une commande avec les informations de livraison nécessaires.",

    valuesTitle: "Nos engagements",
    valuesDescription:
      "Une expérience d'achat pensée pour être simple, transparente et accessible.",

    valueSelection: "Un catalogue varié",
    valueSelectionDescription:
      "Différentes catégories de vélos et d'accessoires pour répondre à plusieurs usages.",

    valueClarity: "Des informations claires",
    valueClarityDescription:
      "Les caractéristiques des produits, les quantités et les montants sont présentés avant la validation de la commande.",

    valueSupport: "Une équipe joignable",
    valueSupportDescription:
      "Des contacts dédiés aux questions générales et aux demandes concernant les commandes.",

    valueMobility: "La mobilité à vélo",
    valueMobilityDescription:
      "Un univers consacré au vélo classique et électrique, pour la ville comme pour les loisirs.",

    categoriesTitle: "Découvrez notre univers",
    categoriesDescription:
      "Explorez les grandes catégories disponibles dans la boutique CYCLORIVA.",

    electricBikes: "Vélos électriques",
    mountainBikes: "VTT",
    cargoBikes: "Vélos cargo",
    cityBikes: "Vélos de ville",
    accessories: "Accessoires",
    discoverCatalogue: "Voir le catalogue",

    countriesTitle: "Les pays desservis",
    countriesDescription:
      "CYCLORIVA propose la prise de commande à destination de huit pays européens. La disponibilité des produits et les conditions de livraison sont à confirmer lors de la commande.",

    howTitle: "Comment commander ?",
    howDescription:
      "Un parcours simple, de la découverte des produits à l'enregistrement de votre commande.",

    stepOneTitle: "Choisissez vos produits",
    stepOneDescription:
      "Parcourez le catalogue, consultez les informations des produits et ajoutez les articles souhaités à votre panier.",

    stepTwoTitle: "Vérifiez votre panier",
    stepTwoDescription:
      "Contrôlez les quantités et le sous-total, puis poursuivez vers la page de commande.",

    stepThreeTitle: "Finalisez votre demande",
    stepThreeDescription:
      "Renseignez vos coordonnées et votre adresse de livraison, puis validez la commande après vérification du montant présenté.",

    contactTitle: "Nous sommes à votre écoute",
    contactDescription:
      "Une question sur un produit ou une commande ? Vous pouvez contacter CYCLORIVA par e-mail ou depuis notre page Contact.",

    salesEmailLabel: "Informations sur les commandes",
    supportEmailLabel: "Questions générales",
    contactButton: "Accéder à la page Contact",

    closingTitle: "Prêt à découvrir CYCLORIVA ?",
    closingDescription:
      "Parcourez notre catalogue et trouvez les produits adaptés à vos envies et à vos déplacements.",

    metadataDescription:
      "Découvrez CYCLORIVA, notre boutique dédiée aux vélos, à l'e-mobilité et aux accessoires, ainsi que nos services et pays de livraison.",
  },

  en: {
    pageTitle: "About CYCLORIVA",
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    breadcrumbHome: "Home",
    breadcrumbAbout: "About us",

    heroLabel: "DISCOVER CYCLORIVA",
    heroTitle: "Cycling mobility, made simple.",
    heroDescription:
      "Discover CYCLORIVA, an online store dedicated to bicycles, electric mobility and accessories for your journeys.",
    exploreProducts: "Explore our products",
    contactUs: "Contact us",

    whoTitle: "Who are we?",
    whoParagraph1:
      "CYCLORIVA is an online store focused on bicycles and e-mobility. Our catalogue brings together different types of bikes and accessories for everyday travel, leisure and adventures.",
    whoParagraph2:
      "Our goal is to offer a clear and practical shopping experience: discover products, review their features, select items and submit an order with the necessary delivery information.",

    valuesTitle: "Our commitments",
    valuesDescription:
      "A shopping experience designed to be simple, transparent and accessible.",

    valueSelection: "A varied catalogue",
    valueSelectionDescription:
      "Different types of bicycles and accessories for different needs.",

    valueClarity: "Clear information",
    valueClarityDescription:
      "Product specifications, quantities and amounts are presented before order submission.",

    valueSupport: "Accessible support",
    valueSupportDescription:
      "Dedicated contacts for general questions and order enquiries.",

    valueMobility: "Cycling mobility",
    valueMobilityDescription:
      "A world dedicated to conventional and electric bikes, for city journeys and leisure.",

    categoriesTitle: "Explore our range",
    categoriesDescription:
      "Discover the main categories available at CYCLORIVA.",

    electricBikes: "Electric bikes",
    mountainBikes: "Mountain bikes",
    cargoBikes: "Cargo bikes",
    cityBikes: "City bikes",
    accessories: "Accessories",
    discoverCatalogue: "View catalogue",

    countriesTitle: "Countries served",
    countriesDescription:
      "CYCLORIVA accepts orders for delivery to eight European countries. Product availability and delivery conditions must be confirmed during checkout.",

    howTitle: "How to order",
    howDescription:
      "A straightforward journey from choosing products to submitting your order.",

    stepOneTitle: "Choose your products",
    stepOneDescription:
      "Browse the catalogue, review product details and add your chosen items to your cart.",

    stepTwoTitle: "Review your cart",
    stepTwoDescription:
      "Check quantities and the subtotal, then continue to checkout.",

    stepThreeTitle: "Submit your order",
    stepThreeDescription:
      "Enter your contact and delivery details, then confirm the order after reviewing the displayed amount.",

    contactTitle: "We're here to help",
    contactDescription:
      "Questions about a product or order? Contact CYCLORIVA by email or through our Contact page.",

    salesEmailLabel: "Order enquiries",
    supportEmailLabel: "General questions",
    contactButton: "Go to Contact",

    closingTitle: "Ready to explore CYCLORIVA?",
    closingDescription:
      "Browse our catalogue and find products suited to your journeys.",

    metadataDescription:
      "Learn about CYCLORIVA, our bicycles, e-mobility products, accessories, customer contacts and delivery countries.",
  },

  de: {
    pageTitle: "Über CYCLORIVA",
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    breadcrumbHome: "Startseite",
    breadcrumbAbout: "Über uns",

    heroLabel: "CYCLORIVA ENTDECKEN",
    heroTitle: "Mobilität auf zwei Rädern. Ganz einfach.",
    heroDescription:
      "Entdecken Sie CYCLORIVA, einen Online-Shop für Fahrräder, Elektromobilität und Zubehör.",

    exploreProducts: "Produkte entdecken",
    contactUs: "Kontakt",

    whoTitle: "Wer sind wir?",
    whoParagraph1:
      "CYCLORIVA ist ein Online-Shop rund um Fahrräder und E-Mobilität. Unser Sortiment umfasst unterschiedliche Fahrräder und Zubehör für den Alltag, die Freizeit und Ausflüge.",
    whoParagraph2:
      "Unser Ziel ist ein übersichtliches Einkaufserlebnis: Produkte entdecken, Eigenschaften vergleichen, Artikel auswählen und eine Bestellung mit den erforderlichen Lieferdaten aufgeben.",

    valuesTitle: "Unsere Grundsätze",
    valuesDescription:
      "Ein einfaches, transparentes und zugängliches Einkaufserlebnis.",

    valueSelection: "Vielfältiges Sortiment",
    valueSelectionDescription:
      "Verschiedene Fahrradkategorien und Zubehör für unterschiedliche Anforderungen.",

    valueClarity: "Klare Informationen",
    valueClarityDescription:
      "Produkteigenschaften, Mengen und Beträge werden vor dem Absenden der Bestellung angezeigt.",

    valueSupport: "Erreichbarer Kontakt",
    valueSupportDescription:
      "Kontaktmöglichkeiten für allgemeine Fragen und Bestellanfragen.",

    valueMobility: "Mobilität mit dem Fahrrad",
    valueMobilityDescription:
      "Klassische und elektrische Fahrräder für Stadt und Freizeit.",

    categoriesTitle: "Unser Sortiment",
    categoriesDescription:
      "Entdecken Sie die wichtigsten Kategorien bei CYCLORIVA.",

    electricBikes: "E-Bikes",
    mountainBikes: "Mountainbikes",
    cargoBikes: "Lastenräder",
    cityBikes: "Citybikes",
    accessories: "Zubehör",
    discoverCatalogue: "Zum Sortiment",

    countriesTitle: "Lieferländer",
    countriesDescription:
      "CYCLORIVA nimmt Bestellungen für acht europäische Lieferländer entgegen. Produktverfügbarkeit und Lieferbedingungen werden beim Bestellvorgang bestätigt.",

    howTitle: "So bestellen Sie",
    howDescription:
      "In wenigen Schritten von der Produktauswahl zur Bestellung.",

    stepOneTitle: "Produkte auswählen",
    stepOneDescription:
      "Durchsuchen Sie das Sortiment, lesen Sie die Produktinformationen und legen Sie Artikel in den Warenkorb.",

    stepTwoTitle: "Warenkorb prüfen",
    stepTwoDescription:
      "Überprüfen Sie Mengen und Zwischensumme und gehen Sie zur Kasse.",

    stepThreeTitle: "Bestellung absenden",
    stepThreeDescription:
      "Geben Sie Ihre Kontakt- und Lieferdaten ein und prüfen Sie den angezeigten Betrag vor dem Absenden.",

    contactTitle: "Wir sind für Sie da",
    contactDescription:
      "Fragen zu einem Produkt oder einer Bestellung? Kontaktieren Sie CYCLORIVA per E-Mail oder über unsere Kontaktseite.",

    salesEmailLabel: "Fragen zu Bestellungen",
    supportEmailLabel: "Allgemeine Fragen",
    contactButton: "Zur Kontaktseite",

    closingTitle: "CYCLORIVA entdecken",
    closingDescription:
      "Stöbern Sie in unserem Sortiment und finden Sie Produkte für Ihre Mobilität.",

    metadataDescription:
      "Erfahren Sie mehr über CYCLORIVA, unser Fahrrad- und E-Mobilitätsangebot, Kontaktmöglichkeiten und Lieferländer.",
  },

  it: {
    pageTitle: "Chi siamo — CYCLORIVA",
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    breadcrumbHome: "Home",
    breadcrumbAbout: "Chi siamo",

    heroLabel: "SCOPRI CYCLORIVA",
    heroTitle: "La mobilità in bicicletta, semplicemente.",
    heroDescription:
      "Scopri CYCLORIVA, il negozio online dedicato alle biciclette, alla mobilità elettrica e agli accessori.",

    exploreProducts: "Scopri i prodotti",
    contactUs: "Contattaci",

    whoTitle: "Chi siamo?",
    whoParagraph1:
      "CYCLORIVA è un negozio online dedicato al mondo della bicicletta e dell'e-mobility. Il catalogo comprende diverse tipologie di biciclette e accessori per gli spostamenti quotidiani e il tempo libero.",
    whoParagraph2:
      "Il nostro obiettivo è offrire un'esperienza d'acquisto semplice: scoprire i prodotti, consultarne le caratteristiche, selezionare gli articoli e inviare un ordine con i dati di consegna necessari.",

    valuesTitle: "I nostri impegni",
    valuesDescription:
      "Un'esperienza d'acquisto semplice, trasparente e accessibile.",

    valueSelection: "Catalogo vario",
    valueSelectionDescription:
      "Diverse tipologie di biciclette e accessori per esigenze differenti.",

    valueClarity: "Informazioni chiare",
    valueClarityDescription:
      "Caratteristiche, quantità e importi sono presentati prima della conferma dell'ordine.",

    valueSupport: "Contatti disponibili",
    valueSupportDescription:
      "Canali dedicati alle domande generali e alle richieste sugli ordini.",

    valueMobility: "Mobilità in bicicletta",
    valueMobilityDescription:
      "Biciclette tradizionali ed elettriche per la città e il tempo libero.",

    categoriesTitle: "Esplora il nostro mondo",
    categoriesDescription: "Scopri le principali categorie CYCLORIVA.",

    electricBikes: "Biciclette elettriche",
    mountainBikes: "Mountain bike",
    cargoBikes: "Cargo bike",
    cityBikes: "Biciclette da città",
    accessories: "Accessori",
    discoverCatalogue: "Vedi catalogo",

    countriesTitle: "Paesi serviti",
    countriesDescription:
      "CYCLORIVA accetta ordini per otto paesi europei. La disponibilità dei prodotti e le condizioni di consegna devono essere confermate durante l'ordine.",

    howTitle: "Come ordinare",
    howDescription:
      "Un percorso semplice dalla scelta dei prodotti all'invio dell'ordine.",

    stepOneTitle: "Scegli i prodotti",
    stepOneDescription:
      "Esplora il catalogo, consulta i dettagli e aggiungi i prodotti al carrello.",

    stepTwoTitle: "Controlla il carrello",
    stepTwoDescription: "Verifica quantità e subtotale prima di proseguire.",

    stepThreeTitle: "Completa l'ordine",
    stepThreeDescription:
      "Inserisci i dati di contatto e consegna, poi conferma dopo aver controllato l'importo.",

    contactTitle: "Siamo a tua disposizione",
    contactDescription:
      "Hai domande su un prodotto o un ordine? Contatta CYCLORIVA via e-mail o attraverso la pagina Contatti.",

    salesEmailLabel: "Informazioni sugli ordini",
    supportEmailLabel: "Domande generali",
    contactButton: "Pagina Contatti",

    closingTitle: "Pronto a scoprire CYCLORIVA?",
    closingDescription:
      "Esplora il catalogo e trova i prodotti adatti ai tuoi spostamenti.",

    metadataDescription:
      "Scopri CYCLORIVA, il catalogo di biciclette, e-mobility, accessori, i contatti e i paesi di consegna.",
  },

  es: {
    pageTitle: "Sobre CYCLORIVA",
    eyebrow: "BICICLETAS & MOVILIDAD ELÉCTRICA EN EUROPA",
    breadcrumbHome: "Inicio",
    breadcrumbAbout: "Sobre nosotros",

    heroLabel: "DESCUBRE CYCLORIVA",
    heroTitle: "La movilidad en bicicleta, más sencilla.",
    heroDescription:
      "Descubre CYCLORIVA, una tienda en línea dedicada a las bicicletas, la movilidad eléctrica y los accesorios.",

    exploreProducts: "Descubrir productos",
    contactUs: "Contáctanos",

    whoTitle: "¿Quiénes somos?",
    whoParagraph1:
      "CYCLORIVA es una tienda en línea centrada en las bicicletas y la movilidad eléctrica. Nuestro catálogo reúne distintos tipos de bicicletas y accesorios para los desplazamientos diarios y el tiempo libre.",
    whoParagraph2:
      "Nuestro objetivo es ofrecer una experiencia de compra clara: descubrir productos, consultar sus características, elegir artículos y enviar un pedido con los datos de entrega necesarios.",

    valuesTitle: "Nuestros compromisos",
    valuesDescription:
      "Una experiencia de compra sencilla, transparente y accesible.",

    valueSelection: "Catálogo variado",
    valueSelectionDescription:
      "Distintos tipos de bicicletas y accesorios para diferentes necesidades.",

    valueClarity: "Información clara",
    valueClarityDescription:
      "Las características, cantidades e importes se muestran antes de confirmar el pedido.",

    valueSupport: "Contacto disponible",
    valueSupportDescription:
      "Canales de contacto para consultas generales y preguntas sobre pedidos.",

    valueMobility: "Movilidad en bicicleta",
    valueMobilityDescription:
      "Bicicletas tradicionales y eléctricas para la ciudad y el ocio.",

    categoriesTitle: "Descubre nuestro catálogo",
    categoriesDescription: "Explora las principales categorías de CYCLORIVA.",

    electricBikes: "Bicicletas eléctricas",
    mountainBikes: "Bicicletas de montaña",
    cargoBikes: "Bicicletas de carga",
    cityBikes: "Bicicletas urbanas",
    accessories: "Accesorios",
    discoverCatalogue: "Ver catálogo",

    countriesTitle: "Países disponibles",
    countriesDescription:
      "CYCLORIVA acepta pedidos para ocho países europeos. La disponibilidad de los productos y las condiciones de entrega deben confirmarse al realizar el pedido.",

    howTitle: "Cómo realizar un pedido",
    howDescription:
      "Un proceso sencillo desde la selección de productos hasta el registro del pedido.",

    stepOneTitle: "Elige tus productos",
    stepOneDescription:
      "Explora el catálogo, consulta las características y añade productos al carrito.",

    stepTwoTitle: "Revisa tu carrito",
    stepTwoDescription:
      "Comprueba las cantidades y el subtotal antes de continuar.",

    stepThreeTitle: "Finaliza el pedido",
    stepThreeDescription:
      "Introduce tus datos de contacto y entrega, y confirma el pedido después de revisar el importe.",

    contactTitle: "Estamos para ayudarte",
    contactDescription:
      "¿Tienes dudas sobre un producto o un pedido? Contacta con CYCLORIVA por correo o desde nuestra página de contacto.",

    salesEmailLabel: "Información sobre pedidos",
    supportEmailLabel: "Consultas generales",
    contactButton: "Ir a Contacto",

    closingTitle: "¿Listo para descubrir CYCLORIVA?",
    closingDescription:
      "Explora el catálogo y encuentra productos para tus desplazamientos.",

    metadataDescription:
      "Conoce CYCLORIVA, nuestras bicicletas, movilidad eléctrica, accesorios, contactos y países de entrega.",
  },
};

// ============================================================
// 4. PAYS PROPOSÉS À LA COMMANDE
// ============================================================

const COUNTRIES: Country[] = [
  {
    code: "DE",
    flag: "🇩🇪",
    names: {
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
    names: {
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
    names: {
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
    names: {
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
    names: {
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
    names: {
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
    names: {
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
    names: {
      fr: "Belgique",
      en: "Belgium",
      de: "Belgien",
      it: "Belgio",
      es: "Bélgica",
    },
  },
];

// ============================================================
// 5. DESIGN
// ============================================================

const CONTAINER = "mx-auto w-full max-w-none px-4 sm:px-6 lg:px-6 xl:px-8";

const CARD =
  "rounded-2xl border border-[#dce5eb] bg-white " +
  "shadow-[0_3px_15px_rgba(16,43,57,0.04)]";

const SECTION_TITLE =
  "text-[23px] font-black tracking-tight text-[#102b39] " +
  "sm:text-[28px] lg:text-[31px]";

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
    description: t.metadataDescription,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      languages: {
        fr: "/fr/a-propos",
        en: "/en/a-propos",
        de: "/de/a-propos",
        it: "/it/a-propos",
        es: "/es/a-propos",
        "x-default": "/fr/a-propos",
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
// 7. BANDEAU DESKTOP
// ============================================================

function AboutBanner({ t }: { t: AboutTexts }) {
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
        className="absolute inset-0 bg-linear-to-r from-[#061f32]/95 via-[#061f32]/75 to-[#061f32]/10"
      />

      <div
        className={`${CONTAINER} relative z-10 flex min-h-31.25 flex-col justify-center py-1`}
      >
        <p className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-wide text-white">
          <span className="h-0.75 w-6 bg-[#91df20]" />
          {t.eyebrow}
        </p>

        <h1 className="text-[33px] font-black tracking-tight text-white xl:text-[38px]">
          {t.pageTitle}
        </h1>
      </div>
    </section>
  );
}

// ============================================================
// 8. FIL D'ARIANE
// ============================================================

function AboutBreadcrumb({ locale, t }: { locale: Locale; t: AboutTexts }) {
  return (
    <nav
      aria-label={accessibilityLabel(locale, "breadcrumb")}
      className="flex items-center gap-2 py-1 text-xs text-[#40576a]"
    >
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 hover:text-[#109b24]"
      >
        <House size={17} className="text-[#109b24]" />
        {t.breadcrumbHome}
      </Link>

      <ChevronRight size={15} className="text-[#109b24]" />

      <span aria-current="page" className="font-semibold text-[#102b39]">
        {t.breadcrumbAbout}
      </span>
    </nav>
  );
}

// ============================================================
// 9. INTRODUCTION
// ============================================================

function AboutHero({ locale, t }: { locale: Locale; t: AboutTexts }) {
  return (
    <section className="grid items-center gap-3 py-1 lg:grid-cols-2 lg:gap-3 lg:py-1">
      <div className="min-w-0">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#eaf8e9] px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-[#078d21]">
          <Bike size={16} />
          {t.heroLabel}
        </div>

        <h2 className="max-w-167.5 text-[30px] leading-[1.13] font-black tracking-tight text-[#102b39] sm:text-[40px] lg:text-[46px]">
          {t.heroTitle}
        </h2>

        <p className="mt-2 max-w-147.5 text-[14px] leading-7 text-[#536879] sm:text-[15px]">
          {t.heroDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/produits`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#078f1d] px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#067918]"
          >
            <ShoppingCart size={18} />
            {t.exploreProducts}
            <ArrowRight size={17} />
          </Link>

          <Link
            href={`/${locale}/contact`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#a8bbc7] bg-white px-5 py-3 text-sm font-bold text-[#102b39] hover:bg-slate-50"
          >
            <Mail size={18} />
            {t.contactUs}
          </Link>
        </div>
      </div>

      <div className={`${CARD} overflow-hidden`}>
        {/* Visuel réel du projet déjà présent
            dans le dossier public/images. */}

        <div
          className="relative min-h-44 bg-[#0b3046] bg-cover bg-center sm:min-h-52 lg:min-h-92.5"
          style={{
            backgroundImage: "url('/images/accueil.png')",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-[#062435]/65 via-transparent to-transparent"
          />

          <div className="absolute right-4 bottom-4 left-4 flex items-center gap-2 rounded-xl border border-white/20 bg-[#102b39]/80 p-3 text-sm font-bold text-white backdrop-blur-sm">
            <CheckCircle2 size={21} className="shrink-0 text-[#83e86b]" />
            CYCLORIVA — {t.eyebrow}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 10. QUI SOMMES-NOUS
// ============================================================

function AboutIdentity({ t }: { t: AboutTexts }) {
  return (
    <section className="py-2 lg:py-1">
      <div
        className={`${CARD} grid items-start gap-3 p-3 sm:p-3 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] lg:gap-3 lg:p-3`}
      >
        <div>
          <div className="mb-2 flex h-13 w-13 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
            <Bike size={30} />
          </div>

          <h2 className={SECTION_TITLE}>{t.whoTitle}</h2>

          <div className="mt-2 h-1 w-16 rounded-full bg-[#109b24]" />
        </div>

        <div className="space-y-4 text-[14px] leading-7 text-[#435d6d] sm:text-[15px]">
          <p>{t.whoParagraph1}</p>
          <p>{t.whoParagraph2}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 11. ENGAGEMENTS
// ============================================================

function AboutValues({ t }: { t: AboutTexts }) {
  const values = [
    {
      icon: BadgeCheck,
      title: t.valueSelection,
      description: t.valueSelectionDescription,
    },
    {
      icon: ShieldCheck,
      title: t.valueClarity,
      description: t.valueClarityDescription,
    },
    {
      icon: Headphones,
      title: t.valueSupport,
      description: t.valueSupportDescription,
    },
    {
      icon: Leaf,
      title: t.valueMobility,
      description: t.valueMobilityDescription,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2 text-center">
        <h2 className={SECTION_TITLE}>{t.valuesTitle}</h2>

        <p className="mx-auto mt-3 max-w-162.5 text-sm leading-6 text-[#617586]">
          {t.valuesDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value) => {
          const Icon = value.icon;

          return (
            <article
              key={value.title}
              className={`${CARD} p-3 transition-shadow hover:shadow-md`}
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                <Icon size={25} />
              </div>

              <h3 className="text-[15px] font-extrabold text-[#102b39]">
                {value.title}
              </h3>

              <p className="mt-2 text-[12px] leading-6 text-[#627686]">
                {value.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// 12. CATÉGORIES
// ============================================================

function AboutCategories({ locale, t }: { locale: Locale; t: AboutTexts }) {
  const categories = [
    { label: t.electricBikes, icon: Bike },
    { label: t.mountainBikes, icon: Bike },
    { label: t.cargoBikes, icon: PackageCheck },
    { label: t.cityBikes, icon: Bike },
    { label: t.accessories, icon: ShoppingCart },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-3">
        <h2 className={SECTION_TITLE}>{t.categoriesTitle}</h2>

        <p className="mt-2 text-sm leading-6 text-[#617586]">
          {t.categoriesDescription}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.label}
              href={`/${locale}/produits`}
              className={`${CARD} group flex min-h-33 flex-col items-center justify-center gap-3 p-3 text-center transition-colors hover:border-[#109b24] hover:bg-[#f7fcf6]`}
            >
              <Icon size={32} strokeWidth={1.65} className="text-[#109b24]" />

              <span className="text-[12px] font-extrabold text-[#102b39] sm:text-[13px]">
                {category.label}
              </span>

              <ArrowRight
                size={16}
                className="text-[#709385] transition-transform group-hover:translate-x-1"
              />
            </Link>
          );
        })}
      </div>

      <div className="mt-2 text-center">
        <Link
          href={`/${locale}/produits`}
          className="inline-flex items-center gap-2 text-sm font-extrabold text-[#078d21] hover:underline"
        >
          {t.discoverCatalogue}
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

// ============================================================
// 13. PAYS
// ============================================================

function AboutCountries({ locale, t }: { locale: Locale; t: AboutTexts }) {
  return (
    <section className="py-1 lg:py-1">
      <div className={`${CARD} p-3 sm:p-3 lg:p-3`}>
        <div className="flex items-start gap-3">
          <Globe2 size={29} className="shrink-0 text-[#109b24]" />

          <div>
            <h2 className={SECTION_TITLE}>{t.countriesTitle}</h2>

            <p className="mt-2 max-w-212.5 text-[13px] leading-6 text-[#617586]">
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
                aria-label={country.names[locale]}
                className="shrink-0 text-[25px]"
              >
                {country.flag}
              </span>

              <div className="min-w-0">
                <p className="text-[12px] font-extrabold text-[#102b39] sm:text-[13px]">
                  {country.names[locale]}
                </p>

                <p className="text-[10px] font-medium text-[#708493]">
                  {country.code}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 14. COMMENT COMMANDER
// ============================================================

function AboutProcess({ t }: { t: AboutTexts }) {
  const steps = [
    {
      number: "01",
      icon: Bike,
      title: t.stepOneTitle,
      description: t.stepOneDescription,
    },
    {
      number: "02",
      icon: ShoppingCart,
      title: t.stepTwoTitle,
      description: t.stepTwoDescription,
    },
    {
      number: "03",
      icon: PackageCheck,
      title: t.stepThreeTitle,
      description: t.stepThreeDescription,
    },
  ];

  return (
    <section className="py-1 lg:py-1">
      <div className="mb-2 text-center">
        <h2 className={SECTION_TITLE}>{t.howTitle}</h2>

        <p className="mx-auto mt-2 max-w-162.5 text-sm leading-6 text-[#617586]">
          {t.howDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <article
              key={step.number}
              className={`${CARD} relative p-3 sm:p-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
                  <Icon size={26} />
                </div>

                <span className="text-[32px] font-black text-[#e1eee5]">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-2 text-[16px] font-extrabold text-[#102b39]">
                {step.title}
              </h3>

              <p className="mt-2 text-[13px] leading-6 text-[#607383]">
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
// 15. CONTACT
// ============================================================

function AboutContact({ locale, t }: { locale: Locale; t: AboutTexts }) {
  return (
    <section className="py-1 lg:py-1">
      <div
        className={`${CARD} grid items-center gap-3 p-3 sm:p-3 lg:grid-cols-2 lg:p-3`}
      >
        <div>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8e9] text-[#109b24]">
            <HeartHandshake size={27} />
          </div>

          <h2 className={SECTION_TITLE}>{t.contactTitle}</h2>

          <p className="mt-3 max-w-140 text-[13px] leading-6 text-[#5b7180]">
            {t.contactDescription}
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#078e1d] px-5 text-sm font-bold text-white hover:bg-[#067718]"
          >
            {t.contactButton}
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="space-y-3">
          <a
            href="mailto:sell@cycloriva.com"
            className="flex min-w-0 items-center gap-3 rounded-xl border border-[#dfe7ed] bg-[#fbfcfd] p-3 hover:border-[#109b24]"
          >
            <Mail size={23} className="shrink-0 text-[#109b24]" />

            <div className="min-w-0">
              <p className="text-xs font-bold text-[#102b39]">
                {t.salesEmailLabel}
              </p>
              <p className="mt-1 break-all text-[13px] text-[#536879]">
                sell@cycloriva.com
              </p>
            </div>
          </a>

          <a
            href="mailto:contact@cycloriva.com"
            className="flex min-w-0 items-center gap-3 rounded-xl border border-[#dfe7ed] bg-[#fbfcfd] p-3 hover:border-[#109b24]"
          >
            <Mail size={23} className="shrink-0 text-[#109b24]" />

            <div className="min-w-0">
              <p className="text-xs font-bold text-[#102b39]">
                {t.supportEmailLabel}
              </p>
              <p className="mt-1 break-all text-[13px] text-[#536879]">
                contact@cycloriva.com
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 16. APPEL À L'ACTION FINAL
// ============================================================

function AboutClosing({ locale, t }: { locale: Locale; t: AboutTexts }) {
  return (
    <section className="py-1 lg:py-1">
      <div className="relative overflow-hidden rounded-2xl bg-[#082c40] px-5 py-1 text-center sm:px-8 lg:py-2">
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 h-60 w-60 rounded-full border-45 border-[#109b24]/20"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-24 h-60 w-60 rounded-full border-45 border-[#109b24]/20"
        />

        <div className="relative z-10">
          <Bike size={36} className="mx-auto mb-2 text-[#85e86c]" />

          <h2 className="mx-auto max-w-175 text-[25px] font-black text-white sm:text-[32px]">
            {t.closingTitle}
          </h2>

          <p className="mx-auto mt-3 max-w-160 text-[13px] leading-6 text-[#d4e0e7] sm:text-[14px]">
            {t.closingDescription}
          </p>

          <Link
            href={`/${locale}/produits`}
            className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#109b24] px-6 py-3 text-sm font-extrabold text-white hover:bg-[#07851b]"
          >
            {t.exploreProducts}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 17. PAGE PRINCIPALE
// ============================================================

async function AboutPageContent({ params }: PageProps) {
  const { locale: rawLocale } = await params;

  const locale = resolveLocale(rawLocale);

  const t = TEXTS[locale];

  return (
    <main
      data-page="about"
      className="info-page w-full min-w-0 bg-white pb-2 text-[#102b39] lg:pb-2"
    >
      {/* Bandeau PC */}
      <AboutBanner t={t} />

      <div className={CONTAINER}>
        {/* Fil d'Ariane */}
        <AboutBreadcrumb locale={locale} t={t} />

        {/* Présentation */}
        <AboutHero locale={locale} t={t} />

        {/* Qui sommes-nous */}
        <AboutIdentity t={t} />

        {/* Engagements */}
        <AboutValues t={t} />

        {/* Catégories */}
        <AboutCategories locale={locale} t={t} />

        {/* Pays */}
        <AboutCountries locale={locale} t={t} />

        {/* Parcours de commande */}
        <AboutProcess t={t} />

        {/* Coordonnées */}
        <AboutContact locale={locale} t={t} />

        {/* Conclusion */}
        <AboutClosing locale={locale} t={t} />
      </div>
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA À PROPOS
// ============================================================

export default function AboutPage(
  props: Parameters<typeof AboutPageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <AboutPageContent {...props} />
    </Suspense>
  );
}
