import Image from "next/image";

import Link from "next/link";

import { ArrowRight, ShoppingCart, ImageOff } from "lucide-react";

import {
  allProducts,
  currentPrice,
  formatPrice,
  localizedProduct,
  stripHtml,
  type Product,
} from "@/lib/catalog";

import { resolveLocale, type SiteLocale } from "@/lib/site-i18n";
import { catalogText } from "@/lib/catalog-translations";

// =====================================================
// CYCLORIVA — PRODUITS DE LA PAGE D'ACCUEIL
// =====================================================
//
// Responsive :
// - Mobile : 2 produits par ligne
// - Tablette : 2 produits par ligne
// - PC : 4 produits par ligne
//
// Données : data/products.json via lib/catalog.ts
//
// Les données commerciales ne sont pas inventées.
// Les produits sont affichés depuis le catalogue.
//
// Aucun panier fonctionnel n'est simulé.
//
// =====================================================

// =====================================================
// TYPES
// =====================================================

type HomeProductsVariant = "featured" | "new";

type HomeProductsProps = {
  locale: SiteLocale;
  variant?: HomeProductsVariant;
  limit?: number;
  products?: Product[];
  className?: string;
};

// =====================================================
// TRADUCTIONS
// =====================================================

const translations = {
  fr: {
    featured: "Produits phares",
    new: "Nouveautés",
    viewAll: "Voir tous les produits",
    viewNew: "Voir tous les produits",
    viewProduct: "Voir le produit",
    priceMissing: "Prix à confirmer",
    imageMissing: "Image indisponible",
    stock: "En stock",
    translation: "Traduction en préparation",
    empty: "Aucun produit à afficher pour le moment.",
    promotion: "Promotion",
  },

  en: {
    featured: "Featured products",
    new: "New arrivals",
    viewAll: "View all products",
    viewNew: "View all products",
    viewProduct: "View product",
    priceMissing: "Price to be confirmed",
    imageMissing: "Image unavailable",
    stock: "In stock",
    translation: "Translation in progress",
    empty: "No products to display at the moment.",
    promotion: "Sale",
  },

  de: {
    featured: "Ausgewählte Produkte",
    new: "Neuheiten",
    viewAll: "Alle Produkte ansehen",
    viewNew: "Alle Produkte ansehen",
    viewProduct: "Produkt ansehen",
    priceMissing: "Preis auf Anfrage",
    imageMissing: "Bild nicht verfügbar",
    stock: "Auf Lager",
    translation: "Übersetzung in Vorbereitung",
    empty: "Derzeit keine Produkte verfügbar.",
    promotion: "Angebot",
  },

  it: {
    featured: "Prodotti in evidenza",
    new: "Novità",
    viewAll: "Vedi tutti i prodotti",
    viewNew: "Vedi tutti i prodotti",
    viewProduct: "Vedi prodotto",
    priceMissing: "Prezzo da confermare",
    imageMissing: "Immagine non disponibile",
    stock: "Disponibile",
    translation: "Traduzione in preparazione",
    empty: "Nessun prodotto da visualizzare.",
    promotion: "Offerta",
  },

  es: {
    featured: "Productos destacados",
    new: "Novedades",
    viewAll: "Ver todos los productos",
    viewNew: "Ver todos los productos",
    viewProduct: "Ver producto",
    priceMissing: "Precio por confirmar",
    imageMissing: "Imagen no disponible",
    stock: "En stock",
    translation: "Traducción en preparación",
    empty: "No hay productos para mostrar.",
    promotion: "Oferta",
  },
} as const;

// =====================================================
// SÉLECTION DES PRODUITS
// =====================================================

/**
 * Sélectionne uniquement de vrais produits
 * présents dans le catalogue.
 *
 * La section "featured" utilise les premiers
 * produits exploitables.
 *
 * La section "new" utilise des produits différents,
 * mais leur ancienneté n'est pas garantie :
 * le JSON ne fournit pas de date fiable.
 */

function selectHomeProducts(
  variant: HomeProductsVariant,
  limit: number,
): Product[] {
  const eligibleProducts = allProducts.filter(
    (product) =>
      product.id.length > 0 &&
      product.name.trim().length > 0 &&
      product.images.length > 0,
  );

  if (variant === "featured") {
    return eligibleProducts.slice(0, limit);
  }

  return eligibleProducts.slice(limit, limit * 2);
}

// =====================================================
// VÉRIFICATION DU PRIX PROMOTIONNEL
// =====================================================

function getPromotion(product: Product): number | null {
  const regular = product.regularPrice;
  const sale = product.salePrice;

  if (
    regular === null ||
    sale === null ||
    !Number.isFinite(regular) ||
    !Number.isFinite(sale) ||
    regular <= 0 ||
    sale < 0 ||
    sale >= regular
  ) {
    return null;
  }

  const percentage = ((regular - sale) / regular) * 100;

  return Math.round(percentage);
}

// =====================================================
// DESCRIPTION COURTE
// =====================================================

function getShortDescription(product: Product, locale: SiteLocale): string {
  const localized = localizedProduct(product, locale);

  const raw = localized.shortDescription || localized.description || "";

  const text = stripHtml(raw);

  return text.length > 110 ? `${text.slice(0, 107).trimEnd()}…` : text;
}

// =====================================================
// CARTE D'UN PRODUIT
// =====================================================

function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: SiteLocale;
}) {
  const tr = translations[locale];

  const localized = localizedProduct(product, locale);

  const price = currentPrice(product);

  const promotion = getPromotion(product);

  const image =
    product.images.find(
      (value) => typeof value === "string" && value.trim().length > 0,
    ) ?? null;

  const description = getShortDescription(product, locale);

  const href = `/${locale}/produits/${encodeURIComponent(product.id)}`;

  return (
    <article
      className="
        group relative flex h-full min-w-0 flex-col
        overflow-hidden rounded-xl
        border border-slate-200
        bg-white
        transition-colors duration-200
        hover:border-[#24b715]
        hover:shadow-md
      "
    >
      {/* IMAGE ET BADGE */}
      <div className="relative bg-white px-2 pt-3 sm:px-3">
        {/* PROMOTION UNIQUEMENT SI PRÉSENTE */}
        {promotion !== null && (
          <span
            className="
              absolute left-2 top-2 z-10
              rounded-full bg-[#24b715]
              px-2.5 py-1
              text-[10px] font-bold
              text-white sm:left-3
            "
          >
            -{promotion} %
          </span>
        )}

        {/* IMAGE PRINCIPALE */}
        <Link
          href={href}
          aria-label={`${tr.viewProduct} : ${localized.name}`}
          className="relative 
            flex h-32 w-full items-center
            justify-center overflow-hidden
            sm:h-44 lg:h-48
          "
        >
          {image ? (
            <Image
              fill
              sizes="(max-width: 1023px) 50vw, 25vw"
              unoptimized={!image.startsWith("/") || image.startsWith("//")}
              src={image}
              alt={localized.name}
              loading="lazy"
              decoding="async"
              className="
                h-full w-full object-contain
                transition-transform duration-300
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex h-full w-full flex-col
                items-center justify-center
                gap-2 text-slate-400
              "
            >
              <ImageOff size={30} strokeWidth={1.5} aria-hidden="true" />

              <span className="text-center text-xs">{tr.imageMissing}</span>
            </div>
          )}
        </Link>
      </div>

      {/* INFORMATIONS */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
        {/* CATÉGORIE */}
        {product.categories.length > 0 && (
          <p
            className="
              mb-1 truncate text-[10px]
              text-slate-500 sm:text-xs
            "
          >
            {catalogText(product.categories[0], locale)}
          </p>
        )}

        {/* NOM DU PRODUIT */}
        <Link href={href}>
          <h3
            className="
              line-clamp-2 min-h-10
              text-xs font-extrabold leading-5
              text-[#102b39]
              transition-colors
              group-hover:text-[#168e0a]
              sm:min-h-12 sm:text-sm
            "
          >
            {localized.name}
          </h3>
        </Link>

        {/* DESCRIPTION */}
        {description && (
          <p
            className="
              mt-1 line-clamp-2
              text-[10px] leading-4
              text-slate-500 sm:text-xs
            "
          >
            {description}
          </p>
        )}

        {/* PRIX */}
        <div
          className="
            mt-auto flex items-end
            justify-between gap-2 pt-3
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-sm font-extrabold cycloriva-price
                text-[#b91c1c]
                sm:text-lg
              "
            >
              {price !== null ? formatPrice(price, locale) : tr.priceMissing}
            </p>

            {/* ANCIEN PRIX UNIQUEMENT EN PROMOTION */}
            {promotion !== null && product.regularPrice !== null && (
              <p
                className="
                    text-[10px] text-slate-400
                    line-through sm:text-xs
                  "
              >
                {formatPrice(product.regularPrice, locale)}
              </p>
            )}
          </div>

          {/* LIEN VERS LA FICHE PRODUIT */}
          <Link
            href={href}
            aria-label={`${tr.viewProduct} : ${localized.name}`}
            title={tr.viewProduct}
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg bg-[#24b715]
              text-white
              transition-colors
              hover:bg-[#168e0a]
              sm:h-9 sm:w-9
            "
          >
            <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>

        {/* TRADUCTION INCOMPLÈTE */}
        {!localized.translated && (
          <p
            className="
              mt-2 text-[10px]
              leading-4 text-slate-500
            "
          >
            {tr.translation}
          </p>
        )}

        {/* DISPONIBILITÉ NON CONFIRMÉE */}
        {!product.stockConfirmed && (
          <p className="mt-1 text-[10px] text-amber-700">{tr.stock}</p>
        )}
      </div>
    </article>
  );
}

// =====================================================
// COMPOSANT PRINCIPAL
// =====================================================

export function HomeProducts({
  locale,
  variant = "featured",
  limit = 4,
  products,
  className = "",
}: HomeProductsProps) {
  const currentLocale = resolveLocale(locale);

  const tr = translations[currentLocale];

  const safeLimit = Math.max(0, Math.floor(Number.isFinite(limit) ? limit : 4));

  const selectedProducts = products
    ? products.slice(0, safeLimit)
    : selectHomeProducts(variant, safeLimit);

  const title = variant === "featured" ? tr.featured : tr.new;

  const viewAllLabel = variant === "featured" ? tr.viewAll : tr.viewNew;

  const sectionId =
    variant === "featured" ? "home-featured-products" : "home-new-products";

  return (
    <section
      id={sectionId}
      aria-labelledby={`${sectionId}-title`}
      className={`w-full bg-white py-5 sm:py-7 ${className}`}
    >
      <div className="cycloriva-container">
        {/* EN-TÊTE DE SECTION */}
        <div
          className="
            mb-4 flex flex-wrap
            items-end justify-between
            gap-2 sm:mb-5
          "
        >
          <div>
            <h2
              id={`${sectionId}-title`}
              className="
                text-xl font-extrabold
                tracking-tight text-[#102b39]
                sm:text-2xl
              "
            >
              {title}
            </h2>

            <div
              aria-hidden="true"
              className="
                mt-1.5 h-0.75 w-9
                rounded-full bg-[#24b715]
              "
            />
          </div>

          {/* VOIR TOUS LES PRODUITS */}
          <Link
            href={`/${currentLocale}/produits`}
            className="
              inline-flex items-center
              gap-1.5 text-[11px]
              font-bold text-[#168e0a]
              transition-colors
              hover:text-[#102b39]
              sm:text-sm
            "
          >
            {viewAllLabel}

            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* GRILLE DES PRODUITS */}
        {selectedProducts.length > 0 ? (
          <div
            className="
              grid grid-cols-2 gap-2.5
              sm:gap-4
              lg:grid-cols-4
            "
          >
            {selectedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={currentLocale}
              />
            ))}
          </div>
        ) : (
          <div
            className="
              rounded-xl border
              border-slate-200 bg-slate-50
              px-5 py-10 text-center
            "
          >
            <ShoppingCart
              size={28}
              className="mx-auto mb-3 text-slate-400"
              aria-hidden="true"
            />

            <p className="text-sm text-slate-600">{tr.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default HomeProducts;
