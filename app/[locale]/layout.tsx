
import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";
import "../globals.css";
import { RootDocument } from "@/components/site/RootDocument";
import { metadata } from "@/lib/site-metadata";
export { viewport } from "@/lib/site-metadata";

import { SiteChrome } from "@/components/site/SiteChrome";

import {
  siteLocales,
  isSiteLocale,
  siteIntlLocales,
  type SiteLocale,
} from "@/lib/site-i18n";

// =====================================================
// CYCLORIVA — LAYOUT PUBLIC MULTILINGUE
// =====================================================
//
// Ce layout est commun à toutes les pages publiques.
//
// Il utilise :
// - SiteChrome pour le header et le footer
// - SiteHeader pour les menus PC et mobile
// - SiteFooter pour les informations et paiements
// - site-i18n pour les cinq langues
//
// Les métadonnées générales sont déjà définies dans
// app/layout.tsx et ne sont pas dupliquées ici.
//
// Compatible avec Next.js 16 et cacheComponents.
//
// =====================================================

// LANGUES OFFICIELLES DU SITE

export function generateStaticParams(): {
  locale: SiteLocale;
}[] {
  return siteLocales.map((locale) => ({
    locale,
  }));
}

// PROPRIÉTÉS DU LAYOUT

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const descriptions: Record<SiteLocale, string> = {
  fr: "Découvrez CYCLORIVA, votre boutique spécialisée dans les vélos électriques, VTT, vélos cargo, vélos de ville et accessoires de mobilité en Europe.",
  en: "Discover CYCLORIVA, your shop for electric bikes, mountain bikes, cargo bikes, city bikes and mobility accessories in Europe.",
  de: "Entdecken Sie CYCLORIVA, Ihren Shop für E-Bikes, Mountainbikes, Lastenräder, Citybikes und Mobilitätszubehör in Europa.",
  es: "Descubre CYCLORIVA, tu tienda de bicicletas eléctricas, de montaña, de carga, urbanas y accesorios de movilidad en Europa.",
  it: "Scopri CYCLORIVA, il tuo negozio di biciclette elettriche, mountain bike, cargo bike, biciclette da città e accessori per la mobilità in Europa.",
};

export async function generateMetadata({ params }: Pick<LocaleLayoutProps, "params">) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  const description = descriptions[locale];
  return { ...metadata, description, openGraph: { ...metadata.openGraph, description, locale: siteIntlLocales[locale].replace("-", "_"), images: [{ url: "/images/imager.png", width: 1536, height: 1024, alt: description }] }, twitter: { ...metadata.twitter, description } };
}

// LAYOUT PUBLIC

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  return (
    <RootDocument locale={locale}>
    <Suspense
      fallback={
        <div
          className="flex min-h-screen flex-col bg-white"
          aria-busy="true"
        >
          {/* En-tête temporaire */}
          <div className="h-28.25 border-b border-slate-200 bg-white lg:h-32.25" />

          {/* Espace principal */}
          <div className="flex-1 bg-white" />

          {/* Footer temporaire */}
          <div className="min-h-40 bg-[#102b39]" />
        </div>
      }
    >
      <SiteChrome>
        {children}
      </SiteChrome>
    </Suspense>
    </RootDocument>
  );
}
