import Link from "next/link";
import {
  informationPagePath,
  serviceInformationRoutes,
} from "@/lib/site-routes";
import { getProductTranslations, PRODUCT_LOCALES } from "@/lib/product-i18n";

import {
  Headset,
  RefreshCw,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

import type { SiteLocale } from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — BANDEAU DES SERVICES PRODUIT
// ============================================================
//
// Next.js 16 — React — TypeScript — Tailwind CSS 4
//
// VERSION PC :
// - 4 services sur une ligne
// - Icône verte à gauche
// - Titre en bleu marine
// - Description sous le titre
// - Séparateurs discrets
//
// VERSION MOBILE :
// - 4 services sur une ligne
// - Icônes et textes compacts
// - Aucune barre de défilement horizontale
//
// SERVICES :
// - Livraison
// - Paiement
// - Retours
// - Assistance client
//
// Les engagements commerciaux précis
// sont fournis uniquement lorsqu'ils sont
// effectivement confirmés par CYCLORIVA.
//
// Ce composant ne contient ni header ni footer.
//
// ============================================================

// ============================================================
// 1. TYPES PUBLICS
// ============================================================

export type ProductServiceKey = "delivery" | "payment" | "returns" | "support";

export type ProductServiceItem = {
  /**
   * Identifiant du service.
   */
  key: ProductServiceKey;

  /**
   * Afficher ou masquer ce service.
   * true par défaut.
   */
  enabled?: boolean;

  /**
   * Titre personnalisé facultatif.
   */
  title?: string;

  /**
   * Description commerciale vérifiée.
   *
   * Par exemple, un délai de livraison
   * officiellement confirmé.
   *
   * Aucun délai ou engagement ne sera
   * inventé par le composant.
   */
  description?: string;

  /**
   * Description courte pour mobile.
   */
  mobileDescription?: string;
};

export type ProductServiceStripProps = {
  locale: SiteLocale;

  /**
   * Configuration des services.
   *
   * Sans configuration, seuls les titres
   * génériques sont affichés.
   */
  services?: readonly ProductServiceItem[];

  /**
   * Afficher les séparateurs.
   */
  showDividers?: boolean;

  /**
   * Afficher un fond vert très clair.
   * false par défaut pour la fiche produit.
   */
  softBackground?: boolean;

  className?: string;
};

// ============================================================
// 2. TRADUCTIONS OFFICIELLES
// ============================================================

type ServiceTranslations = {
  sectionLabel: string;
  delivery: string;
  payment: string;
  returns: string;
  support: string;
};

const translations = Object.fromEntries(
  PRODUCT_LOCALES.map((locale) => {
    const t = getProductTranslations(locale);
    return [
      locale,
      {
        sectionLabel: t.services.title,
        delivery: t.services.delivery,
        payment: t.services.payment,
        returns: t.services.returns,
        support: t.services.support,
      },
    ];
  }),
) as Record<SiteLocale, ServiceTranslations>;

// ============================================================
// 3. ORDRE DES SERVICES
// ============================================================

const SERVICE_ORDER: readonly ProductServiceKey[] = [
  "delivery",
  "payment",
  "returns",
  "support",
];

// ============================================================
// 4. ICÔNES
// ============================================================

const SERVICE_ICONS: Record<ProductServiceKey, LucideIcon> = {
  delivery: Truck,
  payment: ShieldCheck,
  returns: RefreshCw,
  support: Headset,
};

// ============================================================
// 5. VALIDATION DE LA LANGUE
// ============================================================

function getValidLocale(locale: SiteLocale): SiteLocale {
  return Object.prototype.hasOwnProperty.call(translations, locale)
    ? locale
    : "fr";
}

// ============================================================
// 6. NETTOYAGE DU TEXTE
// ============================================================

function cleanText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
}

// ============================================================
// 7. NORMALISATION DES SERVICES
// ============================================================

type NormalizedService = {
  key: ProductServiceKey;
  title: string;
  description: string;
  mobileDescription: string;
  icon: LucideIcon;
};

function normalizeServices(
  locale: SiteLocale,
  services?: readonly ProductServiceItem[],
): NormalizedService[] {
  const text = translations[locale];

  const configurations = new Map<ProductServiceKey, ProductServiceItem>();

  if (services) {
    for (const service of services) {
      if (
        service &&
        SERVICE_ORDER.includes(service.key) &&
        !configurations.has(service.key)
      ) {
        configurations.set(service.key, service);
      }
    }
  }

  return SERVICE_ORDER.flatMap((key) => {
    const configuration = configurations.get(key);

    // Si le service est explicitement désactivé,
    // il ne doit pas être affiché.
    if (configuration?.enabled === false) {
      return [];
    }

    const description = cleanText(configuration?.description);

    const mobileDescription =
      cleanText(configuration?.mobileDescription) || description;

    return [
      {
        key,
        title: cleanText(configuration?.title) || text[key],
        description,
        mobileDescription,
        icon: SERVICE_ICONS[key],
      },
    ];
  });
}

// ============================================================
// 8. ÉLÉMENT DE SERVICE
// ============================================================

type ServiceCardProps = {
  service: NormalizedService;
  locale: SiteLocale;
  showDivider: boolean;
};

function ServiceCard({ locale, service, showDivider }: ServiceCardProps) {
  const Icon = service.icon;

  const hasDesktopDescription = service.description.length > 0;

  const hasMobileDescription = service.mobileDescription.length > 0;

  return (
    <Link
      href={informationPagePath(locale, serviceInformationRoutes[service.key])}
      className={[
        "relative flex h-full min-w-0",
        "flex-col items-center",
        "justify-center",
        "gap-1 px-1 py-2",
        "text-center",
        "sm:flex-row",
        "sm:gap-2",
        "sm:px-2",
        "sm:text-left",
        "lg:gap-2.5",
        "lg:px-3",
      ].join(" ")}
    >
      {/* ================================================
          SÉPARATEUR
      ================================================ */}

      {showDivider && (
        <span
          aria-hidden="true"
          className={[
            "absolute top-2 bottom-2 left-0",
            "w-px bg-slate-200",
          ].join(" ")}
        />
      )}

      {/* ================================================
          ICÔNE DU SERVICE
      ================================================ */}

      <div
        className={[
          "flex shrink-0",
          "items-center justify-center",
          "text-[#24b715]",
        ].join(" ")}
      >
        <Icon
          aria-hidden="true"
          strokeWidth={1.8}
          className={["h-4.5 w-4.5", "sm:h-5 sm:w-5", "lg:h-6 lg:w-6"].join(
            " ",
          )}
        />
      </div>

      {/* ================================================
          TITRE ET DESCRIPTION
      ================================================ */}

      <div
        className={[
          "flex min-w-0 flex-1",
          "flex-col justify-center",
          "gap-0.5",
        ].join(" ")}
      >
        <p
          className={[
            "wrap-break-word",
            "text-[9px]",
            "font-extrabold",
            "leading-tight",
            "text-[#102b39]",
            "sm:text-[10px]",
            "lg:text-[11px]",
            "xl:text-xs",
          ].join(" ")}
        >
          {service.title}
        </p>

        {/* DESCRIPTION MOBILE */}

        {hasMobileDescription && (
          <p
            className={[
              "wrap-break-word",
              "text-[8px]",
              "leading-tight",
              "text-slate-600",
              "sm:hidden",
            ].join(" ")}
          >
            {service.mobileDescription}
          </p>
        )}

        {/* DESCRIPTION TABLETTE ET PC */}

        {hasDesktopDescription && (
          <p
            className={[
              "hidden",
              "wrap-break-word",
              "text-[9px]",
              "leading-snug",
              "text-slate-600",
              "sm:block",
              "lg:text-[10px]",
              "xl:text-[11px]",
            ].join(" ")}
          >
            {service.description}
          </p>
        )}
      </div>
    </Link>
  );
}

// ============================================================
// 9. COMPOSANT PRINCIPAL
// ============================================================

export function ProductServiceStrip({
  locale,
  services,
  showDividers = true,
  softBackground = false,
  className = "",
}: ProductServiceStripProps) {
  const currentLocale = getValidLocale(locale);

  const text = translations[currentLocale];

  const normalizedServices = normalizeServices(currentLocale, services);

  // ==========================================================
  // AUCUN SERVICE À AFFICHER
  // ==========================================================

  if (normalizedServices.length === 0) {
    return null;
  }

  // ==========================================================
  // DISPOSITION RESPONSIVE
  // ==========================================================

  return (
    <section
      data-component="product-service-strip"
      aria-label={text.sectionLabel}
      className={[
        "w-full min-w-0",
        "overflow-hidden",
        "rounded-lg",
        "border border-slate-100",
        softBackground ? "bg-[#f0f9ed]" : "bg-white",
        className,
      ].join(" ")}
    >
      <div
        className={["grid w-full min-w-0", "grid-cols-4", "items-stretch"].join(
          " ",
        )}
      >
        {normalizedServices.map((service, index) => (
          <ServiceCard
            locale={currentLocale}
            key={service.key}
            service={service}
            showDivider={showDividers && index > 0}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductServiceStrip;
