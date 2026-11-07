
import { Suspense, type ReactNode } from "react";

import { SiteChrome } from "@/components/site/SiteChrome";

import {
  siteLocales,
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
};

// LAYOUT PUBLIC

export default function LocaleLayout({
  children,
}: LocaleLayoutProps) {
  return (
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
  );
}
