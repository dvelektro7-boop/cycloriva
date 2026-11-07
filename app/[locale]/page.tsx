
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "./HomePage.css";

import { HomeHero } from "@/components/home/HomeHero";
import { HomeCategories } from "@/components/home/HomeCategories";
import { HomeProducts } from "@/components/home/HomeProducts";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeWhyChoose } from "@/components/home/HomeWhyChoose";
import { HomeReviews } from "@/components/home/HomeReviews";
import { HomeNewsletter } from "@/components/home/HomeNewsletter";

import {
  isSiteLocale,
  type SiteLocale,
} from "@/lib/site-i18n";

// =====================================================
// CYCLORIVA — PAGE D'ACCUEIL OFFICIELLE
// =====================================================
//
// Compatible Next.js 16, TypeScript et Tailwind CSS 4.
//
// Langues : FR, EN, DE, IT, ES
//
// Sections :
// 1. Couverture
// 2. Catégories
// 3. Produits phares
// 4. Services
// 5. Pourquoi choisir CYCLORIVA
// 6. Nouveautés
// 7. Avis clients
// 8. Newsletter
//
// Header et footer : gérés par SiteChrome.
//
// Produits : data/products.json via lib/catalog.ts.
//
// =====================================================

// =====================================================
// TYPES
// =====================================================

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

// =====================================================
// MÉTADONNÉES MULTILINGUES
// =====================================================

const homeMetadata: Record<
  SiteLocale,
  {
    title: string;
    description: string;
  }
> = {
  fr: {
    title: "Accueil",
    description:
      "Découvrez CYCLORIVA : vélos électriques, VTT, vélos cargo, vélos de ville et accessoires pour vos déplacements en Europe.",
  },

  en: {
    title: "Home",
    description:
      "Discover CYCLORIVA: electric bikes, mountain bikes, cargo bikes, city bikes and cycling accessories in Europe.",
  },

  de: {
    title: "Startseite",
    description:
      "Entdecken Sie CYCLORIVA: E-Bikes, Mountainbikes, Lastenräder, Citybikes und Fahrradzubehör in Europa.",
  },

  it: {
    title: "Home",
    description:
      "Scopri CYCLORIVA: biciclette elettriche, mountain bike, bici cargo, bici da città e accessori in Europa.",
  },

  es: {
    title: "Inicio",
    description:
      "Descubre CYCLORIVA: bicicletas eléctricas, de montaña, de carga, urbanas y accesorios de ciclismo en Europa.",
  },
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isSiteLocale(locale)) {
    return {
      title: "CYCLORIVA",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const content = homeMetadata[locale];

  return {
    title: content.title,
    description: content.description,

    alternates: {
      canonical: `/${locale}`,

      languages: {
        fr: "/fr",
        en: "/en",
        de: "/de",
        it: "/it",
        es: "/es",
        "x-default": "/fr",
      },
    },

    openGraph: {
      type: "website",
      siteName: "CYCLORIVA",
      title: `${content.title} | CYCLORIVA`,
      description: content.description,
      locale:
        {
          fr: "fr_FR",
          en: "en_GB",
          de: "de_DE",
          it: "it_IT",
          es: "es_ES",
        }[locale],

      images: [
        {
          url: "/images/resaux.png",
          width: 1200,
          height: 630,
          alt: "CYCLORIVA",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${content.title} | CYCLORIVA`,
      description: content.description,
      images: ["/images/resaux.png"],
    },
  };
}

// =====================================================
// CONTENU DE LA PAGE D'ACCUEIL
// =====================================================

async function HomePageContent({
  params,
}: HomePageProps) {
  const { locale } = await params;

  if (!isSiteLocale(locale)) {
    notFound();
  }

  return (
    <main
      id="cycloriva-home"
      data-page="home"
      data-locale={locale}
      className={`w-full overflow-x-clip bg-white text-[#102b39] `}
    >
      {/* ================================================
          1. COUVERTURE PRINCIPALE
      ================================================= */}

      <HomeHero locale={locale} />

      {/* ================================================
          2. CATÉGORIES
      ================================================= */}

      <HomeCategories locale={locale} />

      {/* ================================================
          3. PRODUITS PHARES
      ================================================= */}

      <HomeProducts
        locale={locale}
        variant="featured"
        limit={4}
      />

      {/* ================================================
          4. BANDEAU DES SERVICES
      ================================================= */}

      <HomeServices locale={locale} />

      {/* ================================================
          5. POURQUOI CHOISIR CYCLORIVA
      ================================================= */}

      <HomeWhyChoose locale={locale} />

      {/* ================================================
          6. NOUVEAUTÉS, AVIS ET NEWSLETTER
          
          PC :
          - Nouveautés à gauche
          - Avis clients au centre
          - Newsletter à droite

          Mobile :
          - Nouveautés
          - Avis clients
          - Newsletter
      ================================================= */}

      <div className={`cycloriva-container pb-6 sm:pb-9 cycloriva-home-bottom`}>
        <div
          className="
            grid grid-cols-1
            items-start gap-5
            lg:grid-cols-2
            xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,0.95fr)]
            xl:gap-4
          "
        >
          {/* NOUVEAUTÉS */}
          <div className="min-w-0 lg:col-span-2 xl:col-span-1">
            <HomeProducts
              locale={locale}
              variant="new"
              limit={4}
              className="py-0 sm:py-0"
            />
          </div>

          {/* AVIS CLIENTS */}
          <div className="min-w-0">
            <HomeReviews
              locale={locale}
              className="py-0 sm:py-0"
            />
          </div>

          {/* NEWSLETTER */}
          <div className="min-w-0">
            <HomeNewsletter locale={locale} />
          </div>
        </div>
      </div>
    </main>
  );
}

// =====================================================
// PAGE D'ACCUEIL
// =====================================================
//
// Suspense encadre la lecture des paramètres de route
// dans HomePageContent.
//
// Aucun force-dynamic n'est utilisé.
//
// =====================================================

export default function HomePage({
  params,
}: HomePageProps) {
  return (
    <Suspense
      fallback={
        <main
          aria-busy="true"
          className="min-h-screen w-full bg-white"
        >
          <div className="h-72 w-full animate-pulse bg-[#102b39] sm:h-80" />

          <div className="cycloriva-container py-8">
            <div className="mb-5 h-6 w-48 animate-pulse rounded bg-slate-100" />

            <div className="grid grid-cols-3 gap-3 lg:grid-cols-5">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <HomePageContent params={params} />
    </Suspense>
  );
}
