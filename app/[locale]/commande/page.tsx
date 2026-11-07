import "@/components/checkout/Checkout.css";

import "server-only";
import { Suspense } from "react";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutClient from "@/components/checkout/CheckoutClient";

import {
  getCheckoutGeo,
} from "@/lib/checkout-geo";

import {
  getCheckoutTranslations,
  normalizeCheckoutLocale,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

/**
 * ============================================================
 * CYCLORIVA — PAGE PRINCIPALE DE COMMANDE
 * ============================================================
 *
 * Fichier :
 * app/[locale]/commande/page.tsx
 *
 * Next.js 16 — App Router
 * React 19 — TypeScript — Tailwind CSS 4
 *
 * LANGUES :
 * /fr/commande
 * /en/commande
 * /de/commande
 * /it/commande
 * /es/commande
 *
 * ARCHITECTURE :
 *
 * SiteHeader / SiteChrome
 *   |
 *   +-- CheckoutHeader
 *   |     |
 *   |     +-- Bannière sur PC
 *   |     +-- Fil d'Ariane
 *   |     +-- Progression : 1 / 2 / 3
 *   |
 *   +-- CheckoutClient
 *   |     |
 *   |     +-- CheckoutCustomerForm
 *   |     |     +-- CheckoutPhoneInput
 *   |     |
 *   |     +-- CheckoutAddressForm
 *   |     |
 *   |     +-- CheckoutOrderSummary
 *   |     |
 *   |     +-- CheckoutSubmit
 *   |
 * SiteFooter / SiteChrome
 *
 * RESPONSABILITÉS :
 *
 * - Vérifier la langue du site
 * - Préparer les traductions
 * - Obtenir la suggestion géographique
 * - Transmettre le pays détecté au formulaire
 * - Afficher les composants du checkout
 * - Définir les métadonnées de la page
 * - Empêcher l'indexation de cette page
 *
 * SÉCURITÉ :
 *
 * - Aucune adresse IP brute dans les props
 * - Aucun montant fictif
 * - Aucune commande créée côté serveur ici
 * - Aucune clé privée envoyée au navigateur
 * - Calcul des prix effectué dans l'API
 * - Validation définitive dans POST /api/checkout
 *
 * ============================================================
 */

// ============================================================
// 1. CONFIGURATION NEXT.JS
// ============================================================




// ============================================================
// 2. TYPES
// ============================================================

type CheckoutPageParams = {
  locale: string;
};

type CheckoutPageProps = {
  params: Promise<CheckoutPageParams>;
};

// ============================================================
// 3. LANGUES AUTORISÉES
// ============================================================

const SUPPORTED_LOCALES = new Set<string>([
  "fr",
  "en",
  "de",
  "it",
  "es",
]);

function resolveCheckoutLocale(
  value: string
): CheckoutLocale {
  /**
   * Contrairement à une normalisation silencieuse,
   * nous refusons les segments inconnus.
   *
   * Exemple :
   * /xx/commande -> 404
   *
   * Cela évite d'afficher une page française
   * sous une URL correspondant à une langue
   * qui n'existe pas.
   */
  if (!SUPPORTED_LOCALES.has(value)) {
    notFound();
  }

  return normalizeCheckoutLocale(value);
}

// ============================================================
// 4. MÉTADONNÉES
// ============================================================

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const locale =
    resolveCheckoutLocale(rawLocale);

  const t =
    getCheckoutTranslations(locale);

  return {
    title: `${t.page.title} | CYCLORIVA`,

    description:
      t.page.description,

    robots: {
      index: false,
      follow: false,
      noarchive: true,
    },

    referrer: "strict-origin-when-cross-origin",
  };
}

// ============================================================
// 5. PAGE PRINCIPALE
// ============================================================

async function CheckoutPageContent({
  params,
}: CheckoutPageProps) {
  // ----------------------------------------------------------
  // ÉTAPE 1 : LANGUE
  // ----------------------------------------------------------

  const { locale: rawLocale } =
    await params;

  const locale =
    resolveCheckoutLocale(rawLocale);

  // ----------------------------------------------------------
  // ÉTAPE 2 : GÉOLOCALISATION SERVEUR
  // ----------------------------------------------------------
  //
  // Détection approximative selon l'hébergeur.
  //
  // Valeurs possibles :
  //
  // FR, DE, ES, IT, CH, AT, NL, BE, null
  //
  // Si la détection ne fonctionne pas,
  // le formulaire laissera le pays vide.
  //
  // ----------------------------------------------------------

  const geo =
    await getCheckoutGeo(locale);

  // ----------------------------------------------------------
  // ÉTAPE 3 : PRÉPARATION DES PROPS
  // ----------------------------------------------------------

  const suggestedCountry =
    geo.suggestedCountry;

  const detectedCountry =
    geo.detectedCountry;

  // ----------------------------------------------------------
  // ÉTAPE 4 : CHEMINS LOCALISÉS
  // ----------------------------------------------------------

  const cartHref =
    `/${locale}/panier`;

  // ----------------------------------------------------------
  // ÉTAPE 5 : RENDU
  // ----------------------------------------------------------

  return (
    <main
      data-page="checkout"
      className={[
        "w-full",
        "min-w-0",
        "bg-white",
        "text-[#102b39]",
        "pb-6",
        "sm:pb-8",
        "lg:pb-10",
      ].join(" ")}
    >
      {/* ====================================================
          EN-TÊTE DE COMMANDE
      ==================================================== */}

      <CheckoutHeader
        locale={locale}
        currentStep={2}
        showBanner={true}
        bannerImage="/images/couverture.png"
        cartHref={cartHref}
      />

      {/* ====================================================
          FORMULAIRE ET RÉCAPITULATIF
      ==================================================== */}

      <section
        aria-label="Checkout"
        className="checkout-container pt-3 sm:pt-4 lg:pt-2"
      >
        <CheckoutClient
          locale={locale}
          suggestedCountry={
            suggestedCountry
          }
          detectedCountry={
            detectedCountry
          }
        />
      </section>
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA CHECKOUT PAGE
// ============================================================

export default function CheckoutPage(props: CheckoutPageProps) { return <Suspense fallback={<main aria-busy="true" className="min-h-80"/>}><CheckoutPageContent {...props}/></Suspense>; }
