import { productCommerceTexts } from "@/lib/product-i18n";
import "@/components/product/ProductDetail.css";
import "@/components/product/ProductRelatedRail.css";
import { PRODUCT_ORDER_CONFIG } from "@/lib/product-order";
import { productParagraphs } from "@/lib/product-content";

import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Check,
  Heart,
  Home,
  Search,
  ShoppingCart,
} from "lucide-react";

import {
  allProducts,
  localizedProduct,
  type Product,
} from "@/lib/catalog";

import {
  isSiteLocale,
  type SiteLocale,
} from "@/lib/site-i18n";

import {
  extractProductSpecifications,
} from "@/components/product/ProductSpecifications";

import { ProductBreadcrumb } from "@/components/product/ProductBreadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductSummary } from "@/components/product/ProductSummary";
import { ProductOrderActions } from "@/components/product/ProductOrderActions";
import { ProductHighlights } from "@/components/product/ProductHighlights";
import { ProductServiceStrip } from "@/components/product/ProductServiceStrip";
import { ProductDetailsTabs } from "@/components/product/ProductDetailsTabs";
import { ProductSpecifications } from "@/components/product/ProductSpecifications";
import { ProductAdventureCard } from "@/components/product/ProductAdventureCard";
import { ProductRelatedProducts } from "@/components/product/ProductRelatedProducts";

// ============================================================
// CYCLORIVA — FICHE PRODUIT
// ============================================================
//
// VERSION MISE À JOUR
//
// Next.js 16
// App Router
// TypeScript
// Tailwind CSS 4
//
// Architecture PC :
// - Header existant
// - Bannière catalogue
// - Fil d'Ariane
// - Galerie / informations sur deux colonnes
// - Prix immédiatement après l'introduction
// - Deux boutons de commande
// - Services
// - Onglets / caractéristiques / avantages
// - Carte aventure
// - Quatre produits similaires
// - Footer existant
//
// Architecture mobile :
// - Header existant
// - Fil d'Ariane
// - Galerie et miniatures
// - Informations courtes
// - Prix
// - Boutons superposés
// - Services
// - Onglets compacts / accordéons
// - Carte aventure
// - Deux produits similaires par ligne
// - Navigation inférieure fixe
// - Aucun footer traditionnel
//
// Données : lib/catalog.ts
//
// Ne crée aucune commande ou donnée fictive.
//
// ============================================================

// ============================================================
// 1. TYPES
// ============================================================

type ProductPageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

type PageTranslation = {
  catalogTitle: string;
  catalogEyebrow: string;
  notFound: string;
  navigation: string;
  home: string;
  search: string;
  favorites: string;
  cart: string;
  disabled: string;
  features: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

const pageTranslations: Record<
  SiteLocale,
  PageTranslation
> = {
  fr: {
    catalogTitle: "Tous les produits",
    catalogEyebrow: "VÉLOS & E-MOBILITÉ EN EUROPE",
    notFound: "Produit introuvable",
    navigation: "Navigation mobile",
    home: "Accueil",
    search: "Recherche",
    favorites: "Favoris",
    cart: "Panier",
    disabled: "Fonctionnalité non disponible",
    features: "Points clés du produit",
  },

  en: {
    catalogTitle: "All products",
    catalogEyebrow: "BIKES & E-MOBILITY IN EUROPE",
    notFound: "Product not found",
    navigation: "Mobile navigation",
    home: "Home",
    search: "Search",
    favorites: "Wishlist",
    cart: "Cart",
    disabled: "Feature unavailable",
    features: "Key product specifications",
  },

  de: {
    catalogTitle: "Alle Produkte",
    catalogEyebrow: "FAHRRÄDER & E-MOBILITÄT IN EUROPA",
    notFound: "Produkt nicht gefunden",
    navigation: "Mobile Navigation",
    home: "Startseite",
    search: "Suche",
    favorites: "Merkliste",
    cart: "Warenkorb",
    disabled: "Funktion nicht verfügbar",
    features: "Wichtige Produktmerkmale",
  },

  it: {
    catalogTitle: "Tutti i prodotti",
    catalogEyebrow: "BICICLETTE & E-MOBILITÀ IN EUROPA",
    notFound: "Prodotto non trovato",
    navigation: "Navigazione mobile",
    home: "Home",
    search: "Cerca",
    favorites: "Preferiti",
    cart: "Carrello",
    disabled: "Funzione non disponibile",
    features: "Caratteristiche principali",
  },

  es: {
    catalogTitle: "Todos los productos",
    catalogEyebrow: "BICICLETAS & E-MOVILIDAD EN EUROPA",
    notFound: "Producto no encontrado",
    navigation: "Navegación móvil",
    home: "Inicio",
    search: "Buscar",
    favorites: "Favoritos",
    cart: "Carrito",
    disabled: "Función no disponible",
    features: "Características principales",
  },
};

// ============================================================
// 3. LECTURE DU CATALOGUE
// ============================================================

function findProduct(id: string): Product | null {
  const normalizedId = id.trim();

  if (!normalizedId) {
    return null;
  }

  return (
    allProducts.find(
      (item) => String(item.id) === normalizedId
    ) ?? null
  );
}

// ============================================================
// 4. NETTOYAGE DES MÉTADONNÉES
// ============================================================

function cleanText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(
      /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      " "
    )
    .replace(
      /<style\b[^>]*>[\s\S]*?<\/style>/gi,
      " "
    )
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// 5. MÉTADONNÉES MULTILINGUES
// ============================================================

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, id } = await params;

  if (!isSiteLocale(locale)) {
    return {
      title: "CYCLORIVA",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const sourceProduct = findProduct(id);
  const product = sourceProduct ? { ...sourceProduct, ...localizedProduct(sourceProduct, locale) } : null;

  if (!product) {
    return {
      title: pageTranslations[locale].notFound,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const productName =
    cleanText(product.name) || String(product.id);

  const productDescription =
    cleanText(product.shortDescription) ||
    cleanText(product.description) ||
    productName;

  const encodedId = encodeURIComponent(
    String(product.id)
  );

  const path = (language: SiteLocale) =>
    `/${language}/produits/${encodedId}`;

  return {
    title: productName,
    description: productDescription.slice(0, 160),

    alternates: {
      canonical: path(locale),
      languages: {
        fr: path("fr"),
        en: path("en"),
        de: path("de"),
        it: path("it"),
        es: path("es"),
        "x-default": path("fr"),
      },
    },

    openGraph: {
      type: "website",
      siteName: "CYCLORIVA",
      title: productName,
      description: productDescription.slice(0, 160),
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
      title: productName,
      description: productDescription.slice(0, 160),
      images: ["/images/resaux.png"],
    },
  };
}

// ============================================================
// 6. BANNIÈRE PC
// ============================================================

function ProductBanner({
  locale,
}: {
  locale: SiteLocale;
}) {
  const t = pageTranslations[locale];

  return (
    <section
      aria-label={t.catalogTitle}
      className="relative hidden h-32 w-full overflow-hidden bg-[#102b39] lg:block xl:h-36"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/couverture.png')",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-[#071c2c]/95 via-[#071c2c]/60 to-transparent"
      />

      <div className="cycloriva-container relative z-10 flex h-full flex-col justify-center">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-wide text-white">
          <span className="h-0.75 w-7 bg-[#8ce900]" />
          {t.catalogEyebrow}
        </div>

        <h2 className="text-[30px] leading-tight font-black tracking-tight text-white xl:text-4xl">
          {t.catalogTitle}
        </h2>

        <span
          aria-hidden="true"
          className="mt-2 h-1 w-16 bg-[#8ce900]"
        />
      </div>
    </section>
  );
}

// ============================================================
// 7. POINTS CLÉS ISSUS DU PRODUIT
// ============================================================
//
// Ne présente pas des caractéristiques
// comme des avantages commerciaux inventés.
//
// ============================================================

function ProductFacts({
  product,
  locale,
}: {
  product: Product;
  locale: SiteLocale;
}) {
  const specifications =
    extractProductSpecifications(product, locale);

  // Écarter les champs essentiellement administratifs.
  const usefulSpecifications =
    specifications
      .filter((item) => {
        const label = item.label
          .trim()
          .toLowerCase();

        return (
          item.value.trim().length > 0 &&
          ![
            "référence",
            "reference",
            "artikelnummer",
            "riferimento",
            "sku",
          ].includes(label)
        );
      })
      .slice(0, 5);

  if (usefulSpecifications.length === 0) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      {usefulSpecifications.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex min-w-0 items-start gap-2"
        >
          <Check
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-[#24b715]"
            strokeWidth={2.4}
          />

          <p className="min-w-0 text-[11px] leading-relaxed text-[#102b39] sm:text-xs">
            <span className="font-semibold">
              {item.label} :
            </span>{" "}
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 8. NAVIGATION FIXE MOBILE
// ============================================================
//
// Ce n'est pas le footer du site.
//
// Accueil et catalogue sont fonctionnels.
// Les favoris et le panier utilisent les routes locales de la boutique.
//
// ============================================================

function ProductMobileNavigation({
  locale,
}: {
  locale: SiteLocale;
}) {
  const t = pageTranslations[locale];

  const enabledItemClass =
    "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[#102b39] transition-colors hover:text-[#24b715] focus-visible:outline-2 focus-visible:outline-[#24b715]";


  return (
    <nav
      data-component="product-mobile-navigation"
      aria-label={t.navigation}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white shadow-[0_-4px_18px_rgba(0,0,0,0.06)] lg:hidden"
    >
      <div className="grid grid-cols-4 items-center px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        <Link
          href={`/${locale}`}
          className={enabledItemClass}
        >
          <Home
            aria-hidden="true"
            className="h-5 w-5"
            strokeWidth={1.8}
          />
          <span className="text-[10px] font-semibold">
            {t.home}
          </span>
        </Link>

        <Link
          href={`/${locale}/produits`}
          className={enabledItemClass}
        >
          <Search
            aria-hidden="true"
            className="h-5 w-5"
            strokeWidth={1.8}
          />
          <span className="text-[10px] font-semibold">
            {t.search}
          </span>
        </Link>

        <Link href={`/${locale}/favoris`} className={enabledItemClass}><Heart aria-hidden="true" className="h-5 w-5"/><span className="text-[10px] font-semibold">{t.favorites}</span></Link>

        <Link href={`/${locale}/panier`} aria-label={t.cart} className={enabledItemClass}>
          <ShoppingCart
            aria-hidden="true"
            className="h-5 w-5"
            strokeWidth={1.8}
          />
          <span className="text-[10px] font-semibold">
            {t.cart}
          </span>
        </Link>
      </div>
    </nav>
  );
}

// ============================================================
// 9. CONTENU DE LA FICHE PRODUIT
// ============================================================

async function ProductContent({
  params,
}: ProductPageProps) {
  const { locale, id } = await params;

  if (!isSiteLocale(locale)) {
    notFound();
  }

  const sourceProduct = findProduct(id);
  const product = sourceProduct ? { ...sourceProduct, ...localizedProduct(sourceProduct, locale) } : null;

  if (!product) {
    notFound();
  }

  const whatsappNumber = PRODUCT_ORDER_CONFIG.whatsappNumber;

  const siteOrderHref = `/${locale}/commande`;

  const technicalSpecifications =
    extractProductSpecifications(product, locale);

  const hasFacts = technicalSpecifications.some(
    (item) =>
      item.label.trim().length > 0 &&
      item.value.trim().length > 0
  );

  return (
    <>
      {/* ====================================================
          MASQUER LE FOOTER CLASSIQUE UNIQUEMENT
          SUR LES FICHES PRODUIT EN MOBILE
      ==================================================== */}

<main
        id="cycloriva-product-detail"
        data-page="product-detail"
        data-locale={locale}
        data-product-id={String(product.id)}
        className="min-h-screen w-full min-w-0 overflow-x-clip bg-white pb-24 text-[#102b39] lg:pb-0"
      >
        {/* ==================================================
            1. BANNIÈRE PC
        ================================================== */}

        <ProductBanner locale={locale} />

        {/* ==================================================
            2. FIL D'ARIANE
        ================================================== */}

        <ProductBreadcrumb
          locale={locale}
          productName={product.name}
        />

        {/* ==================================================
            3. CORPS DE LA PAGE
        ================================================== */}

        <div className="cycloriva-container min-w-0 pt-2 pb-2 sm:pt-3 lg:pt-4 lg:pb-4">
          {/* ==================================================
              4. GALERIE + INFORMATIONS
          ================================================== */}

          <div
            className="
              grid min-w-0 grid-cols-1
              items-start gap-4
              lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]
              lg:gap-5
              xl:gap-7
            "
          >
            {/* ================================================
                COLONNE PHOTO
            ================================================ */}

            <div className="min-w-0">
              <ProductGallery
                key={String(product.id)}
                product={product}
                locale={locale}
              />

              {/* Les points techniques sous la photo
                  ne figurent que sur PC. */}

              <div className="mt-3 hidden lg:block">
                <ProductHighlights
                  product={product}
                  locale={locale}
                  className="rounded-xl border border-slate-200"
                />
              </div>
            </div>

            {/* ================================================
                COLONNE INFORMATIONS
            ================================================ */}

            <div className="flex min-w-0 flex-col">
              {/* ----------------------------------------------
                  NOM
                  COURTE DESCRIPTION
                  AVIS RÉELS
                  PRIX
                  DISPONIBILITÉ
                  PRÉSENTATION COURTE
              ---------------------------------------------- */}

              <ProductSummary
                product={product}
                locale={locale}
              />
              {!product.translated && <p className="mt-2 text-[10px] text-slate-500">{productCommerceTexts[locale].source}</p>}

              {/* ----------------------------------------------
                  LES DEUX COMMANDES SONT IMMÉDIATEMENT
                  APRÈS LE RÉSUMÉ, SANS DESCRIPTION LONGUE.
              ---------------------------------------------- */}

              <div className="mt-4 sm:mt-5">
                <ProductOrderActions
                  product={product}
                  locale={locale}
                  whatsappNumber={whatsappNumber}
                  siteOrderHref={siteOrderHref}
                />
              </div>

              {/* ----------------------------------------------
                  SERVICES SOUS LES COMMANDES
              ---------------------------------------------- */}

              <div className="mt-4">
                <ProductServiceStrip
                  locale={locale}
                />
              </div>
            </div>
          </div>

          {/* ==================================================
              5. DESCRIPTION ET CARACTÉRISTIQUES
          ================================================== */}

          <section
            aria-label={
              pageTranslations[locale].features
            }
            className="mt-6 min-w-0 lg:mt-8"
          >
            <ProductDetailsTabs
              key={String(product.id)}
              product={product}
              locale={locale}
              defaultDesktopTab="specifications"
              defaultMobileTab="specifications"
              descriptionContent={<div className="space-y-3 text-sm leading-relaxed">{productParagraphs(product.description || product.shortDescription).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>}
              specificationsContent={
                <ProductSpecifications
                  product={product}
                  locale={locale}
                  showTitle={false}
                />
              }
              benefitsContent={
                hasFacts ? (
                  <div className="flex min-w-0 flex-col gap-4">
                    <ProductFacts
                      product={product}
                      locale={locale}
                    />

                    {/* Carte aventure intégrée
                        au panneau de droite sur PC */}

                    <div className="hidden lg:block">
                      <ProductAdventureCard
                        locale={locale}
                        variant="compact"
                      />
                    </div>
                  </div>
                ) : undefined
              }
            />
          </section>

          {/* ==================================================
              6. CARTE AVENTURE SUR MOBILE
          ================================================== */}

          <div className="mt-3 lg:hidden">
            <ProductAdventureCard
              locale={locale}
              variant="wide"
            />
          </div>

          {/* ==================================================
              7. PRODUITS SIMILAIRES
          ================================================== */}

          <div className="mt-6 min-w-0 lg:mt-7">
            <ProductRelatedProducts
              product={product}
              locale={locale}
              limit={8}
            />
          </div>
        </div>
      </main>

      {/* ====================================================
          8. NAVIGATION INFÉRIEURE MOBILE
      ==================================================== */}

      <ProductMobileNavigation locale={locale} />
    </>
  );
}

// ============================================================
// 10. CHARGEMENT DE LA PAGE
// ============================================================

function ProductPageSkeleton() {
  return (
    <main
      aria-busy="true"
      className="min-h-screen w-full bg-white"
    >
      <div className="hidden h-32 animate-pulse bg-[#102b39] lg:block" />

      <div className="cycloriva-container py-5">
        <div className="mb-5 h-4 w-52 animate-pulse rounded bg-slate-100" />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="aspect-4/3 animate-pulse rounded-xl bg-slate-100" />

          <div className="space-y-4">
            <div className="h-7 w-4/5 animate-pulse rounded bg-slate-100" />

            <div className="h-4 w-3/5 animate-pulse rounded bg-slate-100" />

            <div className="h-9 w-40 animate-pulse rounded bg-slate-100" />

            <div className="h-16 animate-pulse rounded bg-slate-100" />

            <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// 11. PAGE OFFICIELLE
// ============================================================

export default function ProductDetailPage({
  params,
}: ProductPageProps) {
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

// ============================================================
// FIN — CYCLORIVA PRODUCT DETAIL
// ============================================================
