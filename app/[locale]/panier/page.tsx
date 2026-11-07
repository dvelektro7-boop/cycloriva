import "@/components/cart/Cart.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ChevronRight,
  Home,
} from "lucide-react";

import CartClient from "@/components/cart/CartClient";

import {
  normalizeCheckoutLocale,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

/**
 * ============================================================
 * CYCLORIVA — PAGE PANIER
 * ============================================================
 *
 * Fichier :
 * app/[locale]/panier/page.tsx
 *
 * Next.js 16 — App Router
 * React 19 — TypeScript — Tailwind CSS 4
 *
 * ARCHITECTURE :
 *
 * SiteHeader — déjà géré par SiteChrome
 * |
 * +-- Bandeau "Mon panier" sur PC
 * |
 * +-- Fil d'Ariane : Accueil > Panier
 * |
 * +-- CartClient
 *      |
 *      +-- Liste des produits
 *      +-- Quantités + / -
 *      +-- Suppression des articles
 *      +-- CartSummary
 *      +-- Continuer mes achats
 *      +-- Avantages CYCLORIVA
 * |
 * SiteFooter — déjà géré par SiteChrome
 *
 * RESPONSABILITÉS :
 * - Gérer la route localisée du panier
 * - Vérifier les cinq langues autorisées
 * - Afficher les métadonnées
 * - Afficher le bandeau PC
 * - Afficher le fil d'Ariane
 * - Intégrer CartClient
 * - Conserver l'architecture responsive
 *
 * IMPORTANT :
 * - Aucun produit fictif
 * - Aucun prix fictif
 * - Aucune commande créée ici
 * - Aucun nouveau header général
 * - Aucun nouveau footer général
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

type CartPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

type CartPageTexts = {
  eyebrow: string;
  title: string;
  home: string;
  cart: string;
  description: string;
};

// ============================================================
// 2. LANGUES AUTORISÉES
// ============================================================

const SUPPORTED_LOCALES = new Set<string>([
  "fr",
  "en",
  "de",
  "it",
  "es",
]);

function resolveCartLocale(
  value: string
): CheckoutLocale {
  if (!SUPPORTED_LOCALES.has(value)) {
    notFound();
  }

  return normalizeCheckoutLocale(value);
}

// ============================================================
// 3. TRADUCTIONS DE LA PAGE
// ============================================================

const CART_PAGE_TEXTS: Record<
  CheckoutLocale,
  CartPageTexts
> = {
  fr: {
    eyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    title: "Mon panier",
    home: "Accueil",
    cart: "Panier",
    description:
      "Consultez les produits de votre panier, ajustez les quantités et continuez vers votre commande.",
  },

  en: {
    eyebrow: "BIKES & E-MOBILITY IN EUROPE",
    title: "My cart",
    home: "Home",
    cart: "Cart",
    description:
      "Review the items in your cart, adjust quantities and proceed to checkout.",
  },

  de: {
    eyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    title: "Mein Warenkorb",
    home: "Startseite",
    cart: "Warenkorb",
    description:
      "Prüfen Sie Ihre Warenkorbartikel, ändern Sie Mengen und fahren Sie mit der Bestellung fort.",
  },

  it: {
    eyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    title: "Il mio carrello",
    home: "Home",
    cart: "Carrello",
    description:
      "Controlla i prodotti nel carrello, modifica le quantità e procedi all'ordine.",
  },

  es: {
    eyebrow: "BICICLETAS & E-MOVILIDAD EN EUROPA",
    title: "Mi carrito",
    home: "Inicio",
    cart: "Carrito",
    description:
      "Revisa los productos del carrito, modifica las cantidades y continúa con el pedido.",
  },
};

// ============================================================
// 4. CONFIGURATION DE LA PAGE
// ============================================================


// ============================================================
// 5. MÉTADONNÉES
// ============================================================

export async function generateMetadata({
  params,
}: CartPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const locale = resolveCartLocale(rawLocale);

  const texts = CART_PAGE_TEXTS[locale];

  return {
    title: `${texts.title} | CYCLORIVA`,

    description: texts.description,

    robots: {
      index: false,
      follow: false,
      noarchive: true,
    },
  };
}

// ============================================================
// 6. BANDEAU PC
// ============================================================

function CartBanner({
  locale,
}: {
  locale: CheckoutLocale;
}) {
  const texts = CART_PAGE_TEXTS[locale];

  return (
    <section
      aria-label={texts.title}
      className="relative hidden min-h-31.5 overflow-hidden bg-[#082a3f] lg:block"
    >
      {/* PHOTO DE COUVERTURE EXISTANTE */}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/couverture.png')",
        }}
      />

      {/* DÉGRADÉ POUR LA LISIBILITÉ */}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-[#061f32]/95 via-[#061f32]/80 to-[#061f32]/10"
      />

      {/* CONTENU */}

      <div
        className={[
          "relative",
          "z-10",
          "mx-auto",
          "flex",
          "min-h-31.5",
          "w-full",
          
          "flex-col",
          "justify-center",
          "px-4",
          "py-5",
          "sm:px-6",
          "lg:px-6",
          
        ].join(" ")}
      >
        <p
          className="mb-2 flex items-center gap-2 text-[10px] font-extrabold tracking-[0.08em] text-white sm:text-xs"
        >
          <span
            aria-hidden="true"
            className="h-0.75 w-6 bg-[#91df20]"
          />

          {texts.eyebrow}
        </p>

        <h1
          className="text-[34px] leading-tight font-black tracking-tight text-white xl:text-[40px]"
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

function CartBreadcrumb({
  locale,
}: {
  locale: CheckoutLocale;
}) {
  const texts = CART_PAGE_TEXTS[locale];

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 flex-wrap items-center gap-2 py-4 text-[11px] leading-5 text-[#344e60] sm:py-5 sm:text-[12px]"
    >
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 transition-colors hover:text-[#109b24]"
      >
        <Home
          size={18}
          strokeWidth={1.9}
          className="text-[#109b24]"
          aria-hidden="true"
        />

        <span>{texts.home}</span>
      </Link>

      <ChevronRight
        size={15}
        className="text-[#109b24]"
        aria-hidden="true"
      />

      <span
        aria-current="page"
        className="font-semibold text-[#102b39]"
      >
        {texts.cart}
      </span>
    </nav>
  );
}

// ============================================================
// 8. PAGE PRINCIPALE
// ============================================================

async function CartPageContent({
  params,
}: CartPageProps) {
  // ----------------------------------------------------------
  // LANGUE
  // ----------------------------------------------------------

  const { locale: rawLocale } = await params;

  const locale = resolveCartLocale(rawLocale);

  // ----------------------------------------------------------
  // CHEMINS
  // ----------------------------------------------------------

  const productsHref = `/${locale}/produits`;

  const checkoutHref = `/${locale}/commande`;

  // ----------------------------------------------------------
  // RENDU
  // ----------------------------------------------------------

  return (
    <main
      data-page="cart"
      className="w-full min-w-0 bg-white pb-5 text-[#102b39] lg:pb-6"
    >
      {/* ====================================================
          BANDEAU DESKTOP
      ==================================================== */}

      <CartBanner locale={locale} />

      {/* ====================================================
          CONTENEUR PRINCIPAL
      ==================================================== */}

      <div
        className={[
          "mx-auto",
          "w-full",
          "min-w-0",
          
          "px-4",
          "sm:px-6",
          "lg:px-6",
          
        ].join(" ")}
      >
        {/* FIL D'ARIANE */}

        <CartBreadcrumb locale={locale} />

        {/* ==================================================
            PANIER RÉEL
        ================================================== */}

        <section
          aria-label={CART_PAGE_TEXTS[locale].title}
          className="min-w-0 pt-1 lg:pt-2"
        >
          <CartClient
            locale={locale}
            productsHref={productsHref}
            checkoutHref={checkoutHref}
          />
        </section>
      </div>
    </main>
  );
}

// ============================================================
// FIN — CYCLORIVA CART PAGE
// ============================================================

export default function CartPage(props:CartPageProps) { return <Suspense fallback={<main aria-busy="true" className="min-h-80"/>}><CartPageContent {...props}/></Suspense>; }
