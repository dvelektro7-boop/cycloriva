
"use client";

import { getProductTranslations, PRODUCT_LOCALES } from "@/lib/product-i18n";


import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import Image from "next/image";
import { ProductFavoriteButton } from "./ProductFavorites";

import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Maximize2,
  X,
} from "lucide-react";

import type { Product } from "@/lib/catalog";
import type { SiteLocale } from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — GALERIE OFFICIELLE DE LA FICHE PRODUIT
// ============================================================
//
// Next.js 16 — TypeScript — React — Tailwind CSS 4
//
// VERSION PC :
// - Miniatures verticales à gauche
// - Grande photographie à droite
// - Sélection d'une image
// - Zoom plein écran
// - Navigation entre les photographies
//
// VERSION MOBILE :
// - Grande photographie en premier
// - Miniatures horizontales sous la photographie
// - Boutons de navigation adaptés
// - Zoom au clic
//
// DONNÉES :
// - Utilise product.images
// - Aucun visuel fictif
// - Aucune information commerciale inventée
//
// Header et footer non inclus.
//
// ============================================================

// ============================================================
// 1. TYPES
// ============================================================

export type ProductGalleryProps = {
  product: Product;
  locale: SiteLocale;

  /**
   * Nom traduit du produit, si disponible.
   * Sinon, utilise product.name.
   */
  productName?: string;

  /**
   * Images fournies explicitement par le parent.
   * Sinon, utilise product.images.
   */
  images?: readonly string[];

  /**
   * Nombre de miniatures initialement visibles.
   */
  initialThumbnailCount?: number;

  className?: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

type GalleryText = {
  gallery: string;
  image: string;
  of: string;
  previous: string;
  next: string;
  zoom: string;
  close: string;
  moreImages: string;
  showAllImages: string;
  showLessImages: string;
  unavailable: string;
  noImages: string;
  wishlistUnavailable: string;
};

const translations = Object.fromEntries(PRODUCT_LOCALES.map((locale) => { const t = getProductTranslations(locale); return [locale, { gallery: t.gallery.title, image: t.gallery.image, of: t.gallery.of, previous: t.gallery.previous, next: t.gallery.next, zoom: t.gallery.zoom, close: t.gallery.close, moreImages: t.gallery.moreImages, showAllImages: t.gallery.showAll, showLessImages: t.gallery.showLess, unavailable: t.gallery.imageUnavailable, noImages: t.gallery.noImages, wishlistUnavailable: t.gallery.wishlistUnavailable }]; })) as Record<SiteLocale, GalleryText>;

// ============================================================
// 3. UTILITAIRES
// ============================================================

function getValidLocale(locale: SiteLocale): SiteLocale {
  return Object.prototype.hasOwnProperty.call(
    translations,
    locale
  )
    ? locale
    : "fr";
}

/**
 * Accepte uniquement :
 * - les chemins publics locaux
 * - les URL HTTPS / HTTP
 *
 * Rejette les protocoles non autorisés.
 */
function normalizeImageSource(
  value: unknown
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const source = value.trim();

  if (!source) {
    return null;
  }

  if (
    source.startsWith("https://") ||
    source.startsWith("http://")
  ) {
    try {
      const url = new URL(source);

      if (
        url.protocol === "https:" ||
        url.protocol === "http:"
      ) {
        return url.href;
      }
    } catch {
      return null;
    }

    return null;
  }

  if (
    source.startsWith("//") ||
    source.startsWith("\\") ||
    source.includes("\\")
  ) {
    return null;
  }

  const normalized = source.startsWith("/")
    ? source
    : `/${source}`;

  const path = normalized.split(/[?#]/, 1)[0];

  if (
    path.split("/").includes("..") ||
    path.split("/").includes(".")
  ) {
    return null;
  }

  return normalized;
}

function getGalleryImages(
  source: readonly string[] | undefined
): string[] {
  if (!Array.isArray(source)) {
    return [];
  }

  const images: string[] = [];
  const seen = new Set<string>();

  for (const value of source) {
    const image = normalizeImageSource(value);

    if (!image || seen.has(image)) {
      continue;
    }

    seen.add(image);
    images.push(image);
  }

  return images;
}

function normalizeThumbnailCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 5;
  }

  return Math.max(1, Math.min(12, Math.floor(value)));
}

// ============================================================
// 4. IMAGE AVEC SOLUTION DE SECOURS
// ============================================================

type GalleryImageProps = {
  src: string | null;
  alt: string;
  fallback: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

function GalleryImage({
  src,
  alt,
  fallback,
  sizes,
  priority = false,
  className = "",
}: GalleryImageProps) {
  const [failedSource, setFailedSource] =
    useState<string | null>(null);

  const isAvailable =
    src !== null && failedSource !== src;

  return (
    <div
      className={[
        "relative h-full w-full",
        "overflow-hidden bg-white",
        className,
      ].join(" ")}
    >
      {isAvailable && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          sizes={sizes}
          className="object-contain"
          onError={() => setFailedSource(src)}
        />
      ) : (
        <div
          className={[
            "flex h-full w-full",
            "flex-col items-center",
            "justify-center gap-2",
            "p-3 text-center",
            "text-slate-400",
          ].join(" ")}
        >
          <ImageOff
            aria-hidden="true"
            className="h-8 w-8"
            strokeWidth={1.5}
          />

          <span className="max-w-48 text-xs leading-relaxed">
            {fallback}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 5. COMPOSANT PRINCIPAL
// ============================================================

export function ProductGallery({
  product,
  locale,
  productName,
  images,
  initialThumbnailCount = 4,
  className = "",
}: ProductGalleryProps) {
  const currentLocale = getValidLocale(locale);

  const text = translations[currentLocale];

  const galleryId = useId();

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [showAllThumbnails, setShowAllThumbnails] =
    useState(false);

  const [zoomOpen, setZoomOpen] =
    useState(false);

  const zoomCloseButtonRef =
    useRef<HTMLButtonElement>(null);

  const zoomTriggerRef =
    useRef<HTMLButtonElement>(null);

  // ==========================================================
  // NOM RÉEL DU PRODUIT
  // ==========================================================

  const name =
    typeof productName === "string" &&
    productName.trim()
      ? productName.trim()
      : product.name;

  // ==========================================================
  // PHOTOGRAPHIES DU PRODUIT
  // ==========================================================

  const galleryImages = useMemo(
    () =>
      getGalleryImages(
        images ?? product.images
      ),
    [images, product.images]
  );

  const imageCount = galleryImages.length;

  const activeIndex =
    imageCount > 0
      ? Math.min(
          Math.max(0, selectedIndex),
          imageCount - 1
        )
      : 0;

  const activeImage =
    galleryImages[activeIndex] ?? null;

  const thumbnailLimit =
    normalizeThumbnailCount(initialThumbnailCount);

  const visibleThumbnails = imageCount <= 1 ? [] : showAllThumbnails
    ? galleryImages
    : galleryImages.slice(0, thumbnailLimit);

  const remainingCount = Math.max(
    0,
    imageCount - thumbnailLimit
  );

  const hasMultipleImages = imageCount > 1;

  // ==========================================================
  // NAVIGATION ENTRE LES PHOTOGRAPHIES
  // ==========================================================

  function selectImage(index: number) {
    if (
      index < 0 ||
      index >= imageCount
    ) {
      return;
    }

    setSelectedIndex(index);
  }

  function goToNextImage() {
    if (imageCount <= 1) {
      return;
    }

    setSelectedIndex(
      (previous) =>
        ((Math.min(previous, imageCount - 1) + 1) %
          imageCount)
    );
  }

  function goToPreviousImage() {
    if (imageCount <= 1) {
      return;
    }

    setSelectedIndex(
      (previous) =>
        (Math.min(previous, imageCount - 1) -
          1 +
          imageCount) %
        imageCount
    );
  }

  function openZoom() {
    if (!activeImage) {
      return;
    }

    setZoomOpen(true);
  }

  function closeZoom() {
    setZoomOpen(false);
  }

  // ==========================================================
  // ZOOM : CLAVIER, FOCUS ET DÉFILEMENT
  // ==========================================================

  useEffect(() => {
    if (!zoomOpen) {
      return;
    }

    const zoomTrigger = zoomTriggerRef.current;
    const previousOverflow =
      document.body.style.overflow;

    const previousFocus =
      document.activeElement;

    document.body.style.overflow = "hidden";

    zoomCloseButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setZoomOpen(false);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedIndex(
          (previous) =>
            imageCount > 0
              ? (Math.min(previous, imageCount - 1) + 1) %
                imageCount
              : 0
        );
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedIndex(
          (previous) =>
            imageCount > 0
              ? (Math.min(previous, imageCount - 1) -
                  1 +
                  imageCount) %
                imageCount
              : 0
        );
        return;
      }

      if (event.key === "Tab") {
        const dialog = document.getElementById(
          `${galleryId}-zoom`
        );

        if (!dialog) {
          return;
        }

        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
          )
        );

        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (
          event.shiftKey &&
          (active === first || !dialog.contains(active))
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (active === last || !dialog.contains(active))
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus();
      } else {
        zoomTrigger?.focus();
      }
    };
  }, [zoomOpen, imageCount, galleryId]);

  // ==========================================================
  // STYLES DES MINIATURES
  // ==========================================================

  const thumbnailBase = [
    "relative shrink-0",
    "overflow-hidden rounded-lg",
    "border-2 bg-white",
    "transition-colors",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-[#24b715]",
    "h-14 w-14",
    "sm:h-16 sm:w-16",
    "lg:h-15 lg:w-15",
  ].join(" ");

  // ==========================================================
  // RENDU
  // ==========================================================

  return (
    <section
      data-component="product-gallery"
      aria-label={`${text.gallery} : ${name}`}
      className={[
        "w-full min-w-0",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "grid min-w-0",
          "grid-cols-1",
          "gap-3",
          hasMultipleImages ? "lg:grid-cols-[64px_minmax(0,1fr)]" : "lg:grid-cols-1",
          "lg:gap-3",
        ].join(" ")}
      >
        {/* ==================================================
            MINIATURES
            PC : VERTICALES À GAUCHE
            MOBILE : HORIZONTALES SOUS LA PHOTO
        ================================================== */}

        <div
          className={[
            hasMultipleImages ? "order-2 min-w-0" : "hidden",
            "lg:order-1",
          ].join(" ")}
        >
          <div
            role="group"
            aria-label={text.gallery}
            className={[
              "flex min-w-0 gap-2",
              "overflow-x-auto pb-1",
              "lg:flex-col",
              "lg:items-center",
              "lg:overflow-visible",
              "lg:pb-0",
            ].join(" ")}
          >
            {visibleThumbnails.map(
              (image, index) => {
                const selected =
                  activeIndex === index;

                return (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    aria-label={`${text.image} ${index + 1} ${text.of} ${imageCount}`}
                    aria-pressed={selected}
                    onClick={() => selectImage(index)}
                    className={[
                      thumbnailBase,
                      selected
                        ? "border-[#24b715] shadow-sm"
                        : "border-slate-200 hover:border-[#24b715]",
                    ].join(" ")}
                  >
                    <GalleryImage
                      src={image}
                      alt={`${name} — ${text.image} ${index + 1}`}
                      fallback={text.unavailable}
                      sizes="64px"
                      className="p-1"
                    />
                  </button>
                );
              }
            )}

            {/* PHOTOS SUPPLÉMENTAIRES */}

            {remainingCount > 0 && (
              <button
                type="button"
                aria-label={
                  showAllThumbnails
                    ? text.showLessImages
                    : `${remainingCount} ${text.moreImages}`
                }
                aria-expanded={showAllThumbnails}
                onClick={() =>
                  setShowAllThumbnails(
                    (previous) => !previous
                  )
                }
                className={[
                  thumbnailBase,
                  "flex items-center justify-center",
                  "border-slate-200",
                  "bg-slate-100",
                  "text-xs font-bold",
                  "text-[#102b39]",
                  "hover:border-[#24b715]",
                  "hover:bg-[#edf9e8]",
                ].join(" ")}
              >
                {showAllThumbnails
                  ? "−"
                  : `+${remainingCount}`}
              </button>
            )}

            {imageCount === 0 && (
              <span className="text-xs text-slate-500">
                {text.noImages}
              </span>
            )}
          </div>
        </div>

        {/* ==================================================
            GRANDE PHOTO DU PRODUIT
        ================================================== */}

        <div
          className={[
            "relative order-1",
            "min-w-0 overflow-hidden",
            "rounded-xl",
            "border border-slate-200",
            "bg-white",
            "lg:order-2",
          ].join(" ")}
        >
          {/* ZONE IMAGE */}

          <div
            className={[
              "relative w-full max-h-120",
              "aspect-4/3",
              "sm:aspect-5/4",
              "lg:aspect-4/3",
            ].join(" ")}
          >
            {/* PHOTO PRINCIPALE */}

            <button
              ref={zoomTriggerRef}
              type="button"
              disabled={!activeImage}
              aria-label={text.zoom}
              onClick={openZoom}
              className={[
                "absolute inset-0",
                "block h-full w-full",
                "bg-white",
                "disabled:cursor-default",
                "focus-visible:outline-2",
                "focus-visible:-outline-offset-4",
                "focus-visible:outline-[#24b715]",
              ].join(" ")}
            >
              <GalleryImage
                src={activeImage}
                alt={`${name} — ${text.image} ${activeIndex + 1}`}
                fallback={
                  imageCount === 0
                    ? text.noImages
                    : text.unavailable
                }
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="p-2 sm:p-3 lg:p-4"
              />
            </button>

            {/* FAVORIS : NON CONNECTÉS */}

            <ProductFavoriteButton id={product.id} locale={locale} />

            {/* BOUTON ZOOM */}

            {activeImage && (
              <button
                type="button"
                aria-label={text.zoom}
                title={text.zoom}
                onClick={openZoom}
                className={[
                  "absolute bottom-3 right-3",
                  "z-10",
                  "flex h-9 w-9",
                  "items-center justify-center",
                  "rounded-lg",
                  "border border-slate-200",
                  "bg-white/95",
                  "text-[#102b39]",
                  "shadow-sm",
                  "transition-colors",
                  "hover:text-[#24b715]",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[#24b715]",
                ].join(" ")}
              >
                <Maximize2
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </button>
            )}

            {/* NAVIGATION ENTRE LES PHOTOS */}

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  aria-label={text.previous}
                  onClick={goToPreviousImage}
                  className={[
                    "absolute top-1/2 left-2",
                    "z-10",
                    "flex h-9 w-9",
                    "-translate-y-1/2",
                    "items-center justify-center",
                    "rounded-full",
                    "border border-slate-200",
                    "bg-white/95",
                    "text-[#102b39]",
                    "shadow-sm",
                    "transition-colors",
                    "hover:border-[#24b715]",
                    "hover:text-[#24b715]",
                    "focus-visible:outline-2",
                    "focus-visible:outline-[#24b715]",
                    "sm:left-3",
                  ].join(" ")}
                >
                  <ChevronLeft
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </button>

                <button
                  type="button"
                  aria-label={text.next}
                  onClick={goToNextImage}
                  className={[
                    "absolute top-1/2 right-2",
                    "z-10",
                    "flex h-9 w-9",
                    "-translate-y-1/2",
                    "items-center justify-center",
                    "rounded-full",
                    "border border-slate-200",
                    "bg-white/95",
                    "text-[#102b39]",
                    "shadow-sm",
                    "transition-colors",
                    "hover:border-[#24b715]",
                    "hover:text-[#24b715]",
                    "focus-visible:outline-2",
                    "focus-visible:outline-[#24b715]",
                    "sm:right-3",
                  ].join(" ")}
                >
                  <ChevronRight
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </button>
              </>
            )}
          </div>

          {/* COMPTEUR D'IMAGES */}

          {hasMultipleImages && (
            <div
              className={[
                "flex items-center justify-center",
                "gap-1.5",
                "border-t border-slate-100",
                "px-3 py-2",
              ].join(" ")}
            >
              {galleryImages.length <= 8 ? (
                galleryImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`${text.image} ${index + 1}`}
                    aria-pressed={activeIndex === index}
                    onClick={() => selectImage(index)}
                    className={[
                      "h-1.5 rounded-full",
                      "transition-all",
                      activeIndex === index
                        ? "w-5 bg-[#24b715]"
                        : "w-1.5 bg-slate-300 hover:bg-[#24b715]",
                    ].join(" ")}
                  />
                ))
              ) : (
                <span className="text-[11px] font-semibold text-slate-500">
                  {activeIndex + 1} / {imageCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ====================================================
          ZOOM PLEIN ÉCRAN
      ==================================================== */}

      {zoomOpen && activeImage && (
        <div
          id={`${galleryId}-zoom`}
          role="dialog"
          aria-modal="true"
          aria-label={`${text.gallery} : ${name}`}
          className={[
            "fixed inset-0 z-200",
            "flex flex-col",
            "bg-[#071824]/95",
            "text-white",
          ].join(" ")}
        >
          {/* EN-TÊTE DU ZOOM */}

          <div
            className={[
              "flex shrink-0",
              "items-center justify-between",
              "gap-3",
              "border-b border-white/15",
              "px-4 py-3",
              "sm:px-6",
            ].join(" ")}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {name}
              </p>

              <p className="mt-0.5 text-xs text-white/70">
                {text.image} {activeIndex + 1} {text.of} {imageCount}
              </p>
            </div>

            <button
              ref={zoomCloseButtonRef}
              type="button"
              aria-label={text.close}
              onClick={closeZoom}
              className={[
                "flex h-10 w-10",
                "shrink-0 items-center justify-center",
                "rounded-lg",
                "border border-white/20",
                "bg-white/10",
                "transition-colors",
                "hover:bg-white/20",
                "focus-visible:outline-2",
                "focus-visible:outline-white",
              ].join(" ")}
            >
              <X
                aria-hidden="true"
                className="h-5 w-5"
              />
            </button>
          </div>

          {/* IMAGE AGRANDIE */}

          <div className="relative min-h-0 flex-1">
            <div className="absolute inset-4 sm:inset-8">
              <GalleryImage
                src={activeImage}
                alt={`${name} — ${text.image} ${activeIndex + 1}`}
                fallback={text.unavailable}
                sizes="100vw"
                className="rounded-lg bg-white p-3"
              />
            </div>

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  aria-label={text.previous}
                  onClick={goToPreviousImage}
                  className={[
                    "absolute top-1/2 left-2",
                    "flex h-11 w-11",
                    "-translate-y-1/2",
                    "items-center justify-center",
                    "rounded-full",
                    "bg-[#102b39]/85",
                    "text-white",
                    "transition-colors",
                    "hover:bg-[#24b715]",
                    "focus-visible:outline-2",
                    "focus-visible:outline-white",
                    "sm:left-5",
                  ].join(" ")}
                >
                  <ChevronLeft
                    aria-hidden="true"
                    className="h-6 w-6"
                  />
                </button>

                <button
                  type="button"
                  aria-label={text.next}
                  onClick={goToNextImage}
                  className={[
                    "absolute top-1/2 right-2",
                    "flex h-11 w-11",
                    "-translate-y-1/2",
                    "items-center justify-center",
                    "rounded-full",
                    "bg-[#102b39]/85",
                    "text-white",
                    "transition-colors",
                    "hover:bg-[#24b715]",
                    "focus-visible:outline-2",
                    "focus-visible:outline-white",
                    "sm:right-5",
                  ].join(" ")}
                >
                  <ChevronRight
                    aria-hidden="true"
                    className="h-6 w-6"
                  />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductGallery;
