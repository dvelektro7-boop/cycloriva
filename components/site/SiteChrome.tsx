
"use client";

import {
  Suspense,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import {
  resolveLocale,
  isSiteLocale,
  type SiteLocale,
} from "@/lib/site-i18n";

import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

// =====================================================
// CYCLORIVA — CONFIGURATION
// =====================================================

type SiteChromeProps = {
  children: ReactNode;
};

// =====================================================
// GESTION DES URLS MULTILINGUES
// =====================================================

/**
 * Conserve la page actuelle lors d'un changement
 * de langue.
 *
 * Exemples :
 *
 * /fr                 -> /de
 * /fr/produits        -> /en/produits
 * /fr/produits/123    -> /it/produits/123
 * /fr/produits?q=velo -> /es/produits?q=velo
 *
 * Les paramètres de recherche sont conservés.
 */
function buildLanguageUrl(
  pathname: string,
  nextLocale: SiteLocale,
  queryString: string,
  hash: string
): string {
  const segments = pathname.split("/");

  // URL racine
  if (pathname === "/" || pathname === "") {
    return `/${nextLocale}${
      queryString ? `?${queryString}` : ""
    }${hash}`;
  }

  // Remplacer la langue existante.
  if (isSiteLocale(segments[1])) {
    segments[1] = nextLocale;
  } else {
    // Ajouter la langue si elle n'existe pas.
    segments.splice(1, 0, nextLocale);
  }

  const nextPath = segments.join("/");

  return `${nextPath}${
    queryString ? `?${queryString}` : ""
  }${hash}`;
}

function subscribeHashChange(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

// =====================================================
// CONTENU PRINCIPAL
// =====================================================

function SiteChromeContent({
  children,
}: SiteChromeProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPathname = pathname || "/fr";

  // Détection de la langue à partir de l'URL.
  const locale = resolveLocale(
    currentPathname.split("/")[1]
  );

  // Conserver les paramètres de recherche.
  const currentQuery = searchParams?.toString() ?? "";
  const currentHash = useSyncExternalStore(subscribeHashChange, () => window.location.hash, () => "");

  // Générer le lien vers une autre langue.
  const languageUrl = (nextLocale: string): string => {
    const targetLocale = resolveLocale(nextLocale);

    return buildLanguageUrl(
      currentPathname,
      targetLocale,
      currentQuery,
      currentHash
    );
  };

  // ===================================================
  // ADMINISTRATION
  // ===================================================

  // L'administration possède son propre design.
  // Elle ne doit pas afficher le header ou le footer
  // de la boutique publique.
  if (
    currentPathname === "/admin" ||
    currentPathname.startsWith("/admin/")
  ) {
    return <>{children}</>;
  }

  // ===================================================
  // STRUCTURE PUBLIQUE
  // ===================================================

  return (
    <div
      data-site="cycloriva"
      data-locale={locale}
      className="flex min-h-screen w-full flex-col bg-white text-[#102b39]"
    >
      {/* EN-TÊTE GLOBAL PC ET MOBILE */}
      <SiteHeader
        locale={locale}
        languageUrl={languageUrl}
      />

      {/* CONTENU DE LA PAGE ACTIVE */}
      <div
        id="main-content"
        className="min-w-0 w-full flex-1"
      >
        {children}
      </div>

      {/* FOOTER GLOBAL PC ET MOBILE */}
      <div data-component="site-main-footer" className={/^\/(fr|en|de|it|es)\/(?:panier|commande(?:\/confirmation\/[^/]+)?)\/?$/.test(currentPathname) ? "hidden" : /^\/(fr|en|de|it|es)\/produits\/[^/]+\/?$/.test(currentPathname) ? "hidden lg:block" : ""}><SiteFooter locale={locale} /></div>
    </div>
  );
}

// =====================================================
// CHARGEMENT TEMPORAIRE
// =====================================================

function SiteChromeFallback({
  children,
}: SiteChromeProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* Réserve l'espace du header */}
      <div
        aria-hidden="true"
        className="h-28.25 shrink-0 border-b border-slate-200 bg-white lg:h-32.25"
      />

      {/* Préserve le contenu de la page */}
      <div className="min-w-0 w-full flex-1">
        {children}
      </div>

      {/* Réserve l'espace du footer */}
      <div
        aria-hidden="true"
        className="min-h-40 bg-[#102b39]"
      />
    </div>
  );
}

// =====================================================
// COMPOSANT PRINCIPAL CYCLORIVA
// =====================================================

export function SiteChrome({
  children,
}: SiteChromeProps) {
  return (
    <Suspense
      fallback={
        <SiteChromeFallback>
          {children}
        </SiteChromeFallback>
      }
    >
      <SiteChromeContent>
        {children}
      </SiteChromeContent>
    </Suspense>
  );
}
