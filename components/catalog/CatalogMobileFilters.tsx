"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { createPortal } from "react-dom";

import { ArrowRight, SlidersHorizontal, X } from "lucide-react";

import {
  CatalogSidebar,
  type CatalogFilterOption,
  type CatalogFilterValues,
  type CatalogPriceBounds,
} from "@/components/catalog/CatalogSidebar";

import type { SiteLocale } from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — FILTRES DU CATALOGUE MOBILE
// ============================================================
//
// Next.js 16 — React — TypeScript — Tailwind CSS 4
//
// Architecture :
// - Bouton Filtres (nombre de filtres actifs)
// - Panneau coulissant mobile
// - Fond assombri
// - Catégories
// - Prix minimum / maximum
// - Marques
// - Disponibilité
// - Réinitialisation
// - Bouton Voir les produits
//
// Réutilise CatalogSidebar en mode "mobile".
//
// Aucun produit, prix ou stock fictif.
//
// ============================================================

// ============================================================
// TYPES
// ============================================================

export type CatalogMobileFiltersProps = {
  locale: SiteLocale;

  filters: CatalogFilterValues;

  onChange: (filters: CatalogFilterValues) => void;

  categories: CatalogFilterOption[];
  brands: CatalogFilterOption[];
  availability: CatalogFilterOption[];

  priceBounds: CatalogPriceBounds;

  resultCount?: number;

  className?: string;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  showTrigger?: boolean;
};

// ============================================================
// TRADUCTIONS
// ============================================================

type MobileFiltersText = {
  filters: string;
  close: string;
  reset: string;
  showProducts: string;
  showProduct: string;
  activeFilters: string;
  noActiveFilters: string;
};

const translations: Record<SiteLocale, MobileFiltersText> = {
  fr: {
    filters: "Filtres",
    close: "Fermer les filtres",
    reset: "Tout effacer",
    showProducts: "Voir les produits",
    showProduct: "Voir le produit",
    activeFilters: "filtres actifs",
    noActiveFilters: "Aucun filtre actif",
  },

  en: {
    filters: "Filters",
    close: "Close filters",
    reset: "Clear all",
    showProducts: "View products",
    showProduct: "View product",
    activeFilters: "active filters",
    noActiveFilters: "No active filters",
  },

  de: {
    filters: "Filter",
    close: "Filter schließen",
    reset: "Alle löschen",
    showProducts: "Produkte anzeigen",
    showProduct: "Produkt anzeigen",
    activeFilters: "aktive Filter",
    noActiveFilters: "Keine aktiven Filter",
  },

  it: {
    filters: "Filtri",
    close: "Chiudi filtri",
    reset: "Cancella tutto",
    showProducts: "Mostra prodotti",
    showProduct: "Mostra prodotto",
    activeFilters: "filtri attivi",
    noActiveFilters: "Nessun filtro attivo",
  },

  es: {
    filters: "Filtros",
    close: "Cerrar filtros",
    reset: "Borrar todo",
    showProducts: "Ver productos",
    showProduct: "Ver producto",
    activeFilters: "filtros activos",
    noActiveFilters: "No hay filtros activos",
  },
};

// ============================================================
// UTILITAIRES
// ============================================================

function countActiveFilters(filters: CatalogFilterValues): number {
  let count = 0;

  count += filters.categories.length;
  count += filters.brands.length;
  count += filters.availability.length;

  if (filters.minPrice !== null) {
    count += 1;
  }

  if (filters.maxPrice !== null) {
    count += 1;
  }

  return count;
}

function formatCount(value: number, locale: SiteLocale): string {
  return new Intl.NumberFormat(locale).format(Math.max(0, Math.floor(value)));
}

function getLocale(locale: SiteLocale): SiteLocale {
  return Object.prototype.hasOwnProperty.call(translations, locale)
    ? locale
    : "fr";
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function CatalogMobileFilters({
  locale,
  filters,
  onChange,
  categories,
  brands,
  availability,
  priceBounds,
  resultCount,
  className = "",
  open,
  onOpenChange,
  showTrigger = true,
}: CatalogMobileFiltersProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const mounted = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot,
  );

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const dialogRef = useRef<HTMLDivElement>(null);

  const titleId = useId();
  const descriptionId = useId();

  const currentLocale = getLocale(locale);
  const text = translations[currentLocale];

  // Accepte un fonctionnement contrôlé ou autonome.
  const isControlled = open !== undefined;

  const isOpen = isControlled ? open : internalOpen;

  const activeCount = countActiveFilters(filters);

  const safeResultCount =
    typeof resultCount === "number" &&
    Number.isFinite(resultCount) &&
    resultCount >= 0
      ? Math.floor(resultCount)
      : null;

  // ==========================================================
  // MONTAGE CÔTÉ NAVIGATEUR
  // ==========================================================

  // ==========================================================
  // OUVERTURE / FERMETURE
  // ==========================================================

  function changeOpen(nextOpen: boolean) {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  }

  function closeFilters() {
    changeOpen(false);
  }

  function openFilters() {
    changeOpen(true);
  }

  // ==========================================================
  // GESTION DE LA FENÊTRE MODALE
  // ==========================================================

  useEffect(() => {
    if (!isOpen || !mounted) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const previousFocus = document.activeElement;
    const triggerButton = triggerButtonRef.current;

    document.body.style.overflow = "hidden";

    // Placer le focus dans le panneau.
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        changeOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = dialogRef.current;

      if (!panel) {
        return;
      }

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);

      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      const active = document.activeElement;

      if (!panel.contains(active) || (event.shiftKey && active === first)) {
        if (event.shiftKey) {
          event.preventDefault();
          last.focus();
        } else if (!panel.contains(active)) {
          event.preventDefault();
          first.focus();
        }

        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleKeyDown);

      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      } else {
        triggerButton?.focus();
      }
    };

    // L'état de la fenêtre est la seule dépendance
    // fonctionnelle de cet effet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mounted]);

  // ==========================================================
  // RÉINITIALISATION
  // ==========================================================

  function resetFilters() {
    onChange({
      categories: [],
      brands: [],
      availability: [],
      minPrice: null,
      maxPrice: null,
    });
  }

  // ==========================================================
  // TEXTE DU BOUTON DE VALIDATION
  // ==========================================================

  const showProductsLabel =
    safeResultCount === null
      ? text.showProducts
      : `${
          safeResultCount === 1 ? text.showProduct : text.showProducts
        } (${formatCount(safeResultCount, currentLocale)})`;

  // ==========================================================
  // RENDU
  // ==========================================================

  return (
    <>
      {/* ====================================================
          BOUTON FILTRES — MOBILE
      ==================================================== */}

      {showTrigger && (
        <button
          ref={triggerButtonRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? titleId : undefined}
          onClick={openFilters}
          className={[
            "relative inline-flex min-h-11",
            "w-full min-w-0 items-center",
            "justify-between gap-2",
            "rounded-xl",
            "border border-slate-300",
            "bg-white px-3 py-2.5",
            "text-[#102b39]",
            "shadow-sm",
            "transition-colors",
            "hover:border-[#24b715]",
            "focus-visible:outline-2",
            "focus-visible:outline-offset-2",
            "focus-visible:outline-[#24b715]",
            "lg:hidden",
            className,
          ].join(" ")}
        >
          <span className="flex min-w-0 items-center gap-2">
            <SlidersHorizontal
              aria-hidden="true"
              className="h-5 w-5 shrink-0"
              strokeWidth={2}
            />

            <span className="truncate text-sm font-bold">
              {text.filters}
              {activeCount > 0 ? ` (${activeCount})` : ""}
            </span>
          </span>

          {activeCount > 0 && (
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#24b715]"
            />
          )}
        </button>
      )}

      {/* ====================================================
          PANNEAU MODAL
      ==================================================== */}

      {mounted &&
        isOpen &&
        createPortal(
          <div
            data-component="catalog-mobile-filters"
            className="fixed inset-0 z-100 lg:hidden"
          >
            {/* FOND ASSOMBRI */}

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[#061725]/65"
              onClick={closeFilters}
            />

            {/* FENÊTRE DES FILTRES */}

            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              className={[
                "absolute inset-y-0 left-0",
                "flex h-full w-full max-w-105",
                "flex-col overflow-hidden",
                "bg-white text-[#102b39]",
                "shadow-2xl",
                "sm:w-[90%]",
              ].join(" ")}
            >
              {/* ==========================================
                  EN-TÊTE FIXE
              ========================================== */}

              <div
                className={[
                  "flex shrink-0 items-center",
                  "justify-between gap-3",
                  "border-b border-slate-200",
                  "bg-white px-4 py-4",
                ].join(" ")}
              >
                <div className="min-w-0">
                  <h2
                    id={titleId}
                    className="flex items-center gap-2 text-lg font-extrabold"
                  >
                    <SlidersHorizontal
                      aria-hidden="true"
                      className="h-5 w-5 text-[#24b715]"
                    />

                    {text.filters}

                    {activeCount > 0 && (
                      <span
                        className={[
                          "rounded-full",
                          "bg-[#edf9e8]",
                          "px-2 py-0.5",
                          "text-xs font-bold",
                          "text-[#187c13]",
                        ].join(" ")}
                      >
                        {activeCount}
                      </span>
                    )}
                  </h2>

                  <p id={descriptionId} className="mt-1 text-xs text-slate-500">
                    {activeCount > 0
                      ? `${activeCount} ${text.activeFilters}`
                      : text.noActiveFilters}
                  </p>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label={text.close}
                  onClick={closeFilters}
                  className={[
                    "inline-flex h-10 w-10",
                    "shrink-0 items-center",
                    "justify-center rounded-lg",
                    "border border-slate-200",
                    "bg-white",
                    "transition-colors",
                    "hover:bg-slate-100",
                    "focus-visible:outline-2",
                    "focus-visible:outline-offset-2",
                    "focus-visible:outline-[#24b715]",
                  ].join(" ")}
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              {/* ==========================================
                  CONTENU DÉFILANT
              ========================================== */}

              <div
                className={[
                  "min-h-0 flex-1",
                  "overflow-y-auto overscroll-contain",
                  "px-4 py-2",
                ].join(" ")}
              >
                <CatalogSidebar
                  locale={currentLocale}
                  filters={filters}
                  onChange={onChange}
                  categories={categories}
                  brands={brands}
                  availability={availability}
                  priceBounds={priceBounds}
                  mode="mobile"
                />
              </div>

              {/* ==========================================
                  BARRE D'ACTIONS FIXE
              ========================================== */}

              <div
                className={[
                  "shrink-0",
                  "border-t border-slate-200",
                  "bg-white px-4 py-3",
                  "pb-[max(12px,env(safe-area-inset-bottom))]",
                  "shadow-[0_-4px_16px_rgba(0,0,0,0.04)]",
                ].join(" ")}
              >
                <div className="grid grid-cols-[1fr_1.55fr] gap-2.5">
                  {/* TOUT EFFACER */}

                  <button
                    type="button"
                    disabled={activeCount === 0}
                    onClick={resetFilters}
                    className={[
                      "min-h-11 rounded-lg",
                      "border border-slate-300",
                      "bg-white px-3 py-2.5",
                      "text-xs font-bold",
                      "text-[#102b39]",
                      "transition-colors",
                      "hover:border-[#24b715]",
                      "hover:bg-[#edf9e8]",
                      "disabled:cursor-not-allowed",
                      "disabled:opacity-45",
                    ].join(" ")}
                  >
                    {text.reset}
                  </button>

                  {/* AFFICHER LES PRODUITS */}

                  <button
                    type="button"
                    onClick={closeFilters}
                    className={[
                      "inline-flex min-h-11",
                      "items-center justify-center",
                      "gap-2 rounded-lg",
                      "bg-[#24b715]",
                      "px-3 py-2.5",
                      "text-center text-xs",
                      "font-extrabold text-white",
                      "transition-colors",
                      "hover:bg-[#1d9611]",
                      "focus-visible:outline-2",
                      "focus-visible:outline-offset-2",
                      "focus-visible:outline-[#24b715]",
                    ].join(" ")}
                  >
                    <span>{showProductsLabel}</span>

                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0"
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default CatalogMobileFilters;
