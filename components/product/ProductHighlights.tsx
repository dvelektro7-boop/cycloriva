import { getProductTranslations, PRODUCT_LOCALES } from "@/lib/product-i18n";
import { descriptionSpecifications } from "@/lib/product-content";

import {
  BatteryCharging,
  Cog,
  Disc3,
  Frame,
  type LucideIcon,
} from "lucide-react";

import type { Product } from "@/lib/catalog";
import type { SiteLocale } from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — CARACTÉRISTIQUES PRINCIPALES
// ============================================================
//
// Next.js 16 — TypeScript — Tailwind CSS 4
//
// PC :
// - Bandeau sous la grande image
// - 4 caractéristiques maximum
// - Icônes vertes
// - Libellé et valeur
//
// Mobile :
// - Masqué par défaut selon la maquette
// - Affichage facultatif via showOnMobile
//
// DONNÉES :
// - product.attributes
// - productSpecifications ou données normalisées
//   fournies explicitement par le parent
//
// Aucun moteur, batterie, frein ou matériau inventé.
//
// Aucun header ni footer.
//
// ============================================================

// ============================================================
// 1. TYPES PUBLICS
// ============================================================

export type ProductHighlightKey =
  | "motor"
  | "battery"
  | "brakes"
  | "frame";

export type ProductHighlightItem = {
  key: ProductHighlightKey;

  /**
   * Valeur réelle.
   *
   * Exemples :
   * "Bosch Performance Line"
   * "625 Wh"
   * "Freins hydrauliques"
   * "Aluminium"
   */
  value: string;

  /**
   * Libellé facultatif transmis par le parent.
   * Sinon, traduction automatique de la rubrique.
   */
  label?: string;
};

export type ProductHighlightsProps = {
  product: Product;
  locale: SiteLocale;

  /**
   * Caractéristiques déjà extraites
   * des véritables données du produit.
   *
   * Si fournies, elles remplacent l'extraction
   * automatique depuis product.attributes.
   */
  items?: readonly ProductHighlightItem[];

  /**
   * Maximum 4 éléments comme sur la maquette.
   */
  limit?: number;

  /**
   * La maquette mobile ne montre pas ce bandeau
   * sous la photo.
   */
  showOnMobile?: boolean;

  className?: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

type HighlightTranslations = {
  navigation: string;
  motor: string;
  battery: string;
  brakes: string;
  frame: string;
};

const translations = Object.fromEntries(PRODUCT_LOCALES.map((locale) => { const t = getProductTranslations(locale); return [locale, { navigation: t.highlights.title, motor: t.highlights.motor, battery: t.highlights.battery, brakes: t.highlights.brakes, frame: t.highlights.frame }]; })) as Record<
  SiteLocale,
  HighlightTranslations
>;

// ============================================================
// 3. CONFIGURATION DES ICÔNES
// ============================================================

const highlightIcons: Record<
  ProductHighlightKey,
  LucideIcon
> = {
  motor: Cog,
  battery: BatteryCharging,
  brakes: Disc3,
  frame: Frame,
};

const highlightOrder: readonly ProductHighlightKey[] = [
  "motor",
  "battery",
  "brakes",
  "frame",
];

// ============================================================
// 4. LANGUE
// ============================================================

function getValidLocale(
  locale: SiteLocale
): SiteLocale {
  return Object.prototype.hasOwnProperty.call(
    translations,
    locale
  )
    ? locale
    : "fr";
}

// ============================================================
// 5. NETTOYAGE DES VALEURS
// ============================================================

function cleanText(value: unknown): string {
  if (typeof value === "string") {
    return value
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return String(value);
  }

  return "";
}

function normalizeText(value: unknown): string {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\s_-]+/g, " ")
    .trim();
}

function isUsableValue(value: string): boolean {
  if (!value) return false;

  const normalized = normalizeText(value);

  return ![
    "n/a",
    "na",
    "null",
    "undefined",
    "non renseigne",
    "non disponible",
    "not available",
    "unknown",
    "-",
  ].includes(normalized);
}

// ============================================================
// 6. RECONNAISSANCE DES ATTRIBUTS
// ============================================================
//
// Les champs peuvent varier selon le catalogue.
//
// Exemple 1 :
//
// {
//   "Moteur": "Bosch Performance Line",
//   "Batterie": "625 Wh"
// }
//
// Exemple 2 :
//
// [
//   { "name": "Moteur", "value": "Bosch" },
//   { "name": "Batterie", "value": "625 Wh" }
// ]
//
// Les exemples ci-dessus décrivent seulement
// des formats pris en charge.
// Ils ne sont jamais affichés comme données.
//
// ============================================================

function getHighlightKey(
  attributeName: string
): ProductHighlightKey | null {
  const name = normalizeText(attributeName);

  if (!name) return null;

  // MOTEUR
  if (
    /^(moteur|motor|motore|motorizzazione|motores|antrieb|motorisation)$/.test(
      name
    ) ||
    /^moteur\b/.test(name) ||
    /^motor\b/.test(name)
  ) {
    return "motor";
  }

  // BATTERIE
  if (
    /^(batterie|battery|akku|bateria|batteria|battery capacity|capacite batterie|akkukapazitat|capacidad bateria)$/.test(
      name
    ) ||
    /^batterie\b/.test(name) ||
    /^battery\b/.test(name)
  ) {
    return "battery";
  }

  // FREINS
  if (
    /^(frein|freins|brake|brakes|bremsen|bremse|freni|freno|frenos|systeme de freinage|braking system)$/.test(
      name
    ) ||
    /^freins?\b/.test(name) ||
    /^brakes?\b/.test(name)
  ) {
    return "brakes";
  }

  // CADRE
  if (
    /^(cadre|frame|rahmen|telaio|cuadro|materiau cadre|frame material|rahmenmaterial|material del cuadro)$/.test(
      name
    ) ||
    /^cadre\b/.test(name) ||
    /^frame\b/.test(name)
  ) {
    return "frame";
  }

  return null;
}

// ============================================================
// 7. LECTURE DES VALEURS DES ATTRIBUTS
// ============================================================

function readAttributeValue(
  value: unknown
): string {
  const directValue = cleanText(value);

  if (directValue) {
    return directValue;
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => cleanText(entry))
      .filter(isUsableValue)
      .join(", ");
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      readSimpleValue(record.value) ||
      readSimpleValue(record.values) ||
      readSimpleValue(record.option)
    );
  }

  return "";
}

function readSimpleValue(
  value: unknown
): string {
  if (Array.isArray(value)) {
    return value
      .map((entry) => cleanText(entry))
      .filter(isUsableValue)
      .join(", ");
  }

  return cleanText(value);
}

// ============================================================
// 8. EXTRACTION DES CARACTÉRISTIQUES
// ============================================================

export function getProductHighlightItems(
  product: Product
): ProductHighlightItem[] {
  const attributes: unknown = product.attributes;

  const found = new Map<
    ProductHighlightKey,
    ProductHighlightItem
  >();

  function addAttribute(
    name: unknown,
    rawValue: unknown
  ) {
    const key = getHighlightKey(
      cleanText(name)
    );

    if (!key || found.has(key)) {
      return;
    }

    const value =
      readAttributeValue(rawValue);

    if (!isUsableValue(value)) {
      return;
    }

    found.set(key, {
      key,
      value,
    });
  }

  for (const row of descriptionSpecifications(product, "fr")) addAttribute(row.label, row.value);

  // ==========================================================
  // ATTRIBUTS SOUS FORME DE TABLEAU
  // ==========================================================

  if (Array.isArray(attributes)) {
    for (const entry of attributes) {
      if (
        entry === null ||
        typeof entry !== "object" ||
        Array.isArray(entry)
      ) {
        continue;
      }

      const record =
        entry as Record<string, unknown>;

      const attributeName =
        record.name ??
        record.label ??
        record.key;

      const attributeValue =
        record.value ??
        record.values ??
        record.option;

      addAttribute(
        attributeName,
        attributeValue
      );
    }
  }

  // ==========================================================
  // ATTRIBUTS SOUS FORME D'OBJET
  // ==========================================================

  else if (
    attributes !== null &&
    typeof attributes === "object"
  ) {
    const record =
      attributes as Record<string, unknown>;

    for (const [name, value] of Object.entries(record)) {
      addAttribute(name, value);
    }
  }

  // ==========================================================
  // ORDRE CONFORME À L'ARCHITECTURE
  // ==========================================================

  return highlightOrder.flatMap(
    (key) => {
      const item = found.get(key);

      return item ? [item] : [];
    }
  );
}

// ============================================================
// 9. VALIDATION DES CARACTÉRISTIQUES FOURNIES
// ============================================================

function normalizeItems(
  items: readonly ProductHighlightItem[],
  limit: number
): ProductHighlightItem[] {
  const unique = new Map<
    ProductHighlightKey,
    ProductHighlightItem
  >();

  for (const item of items) {
    if (
      !item ||
      !highlightOrder.includes(item.key)
    ) {
      continue;
    }

    const value = cleanText(item.value);

    if (
      !isUsableValue(value) ||
      unique.has(item.key)
    ) {
      continue;
    }

    unique.set(item.key, {
      key: item.key,
      value,
      label: cleanText(item.label) || undefined,
    });
  }

  return highlightOrder
    .flatMap((key) => {
      const item = unique.get(key);

      return item ? [item] : [];
    })
    .slice(0, limit);
}

// ============================================================
// 10. CARTE D'UNE CARACTÉRISTIQUE
// ============================================================

type HighlightCardProps = {
  item: ProductHighlightItem;
  locale: SiteLocale;
};

function HighlightCard({
  item,
  locale,
}: HighlightCardProps) {
  const Icon = highlightIcons[item.key];

  const text = translations[locale];

  const label =
    item.label || text[item.key];

  return (
    <div
      className={[
        "flex min-w-0",
        "items-center gap-2",
        "px-1 py-2",
        "sm:gap-2.5",
        "lg:px-1.5",
      ].join(" ")}
    >
      {/* ICÔNE */}

      <div
        className={[
          "flex h-8 w-8",
          "shrink-0 items-center",
          "justify-center",
          "rounded-lg",
          "bg-[#edf9e8]",
          "text-[#20a918]",
        ].join(" ")}
      >
        <Icon
          aria-hidden="true"
          className="h-4.5 w-4.5"
          strokeWidth={1.9}
        />
      </div>

      {/* INFORMATIONS */}

      <div className="min-w-0 flex-1">
        <p
          className={[
            "truncate",
            "text-[10px]",
            "font-extrabold",
            "leading-tight",
            "text-[#102b39]",
            "xl:text-[11px]",
          ].join(" ")}
          title={label}
        >
          {label}
        </p>

        <p
          className={[
            "mt-0.5",
            "line-clamp-2",
            "text-[10px]",
            "leading-tight",
            "text-slate-600",
            "xl:text-[11px]",
          ].join(" ")}
          title={item.value}
        >
          {item.value}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// 11. COMPOSANT PRINCIPAL
// ============================================================

export function ProductHighlights({
  product,
  locale,
  items,
  limit = 4,
  showOnMobile = false,
  className = "",
}: ProductHighlightsProps) {
  const currentLocale =
    getValidLocale(locale);

  const text =
    translations[currentLocale];

  const safeLimit = Number.isFinite(limit)
    ? Math.max(1, Math.min(4, Math.floor(limit)))
    : 4;

  // ==========================================================
  // DONNÉES RÉELLES
  // ==========================================================

  const rawItems =
    items !== undefined
      ? items
      : getProductHighlightItems(product);

  const visibleItems = normalizeItems(
    rawItems,
    safeLimit
  );

  // ==========================================================
  // AUCUNE CARACTÉRISTIQUE
  // ==========================================================

  if (visibleItems.length === 0) {
    return null;
  }

  // ==========================================================
  // AFFICHAGE
  // ==========================================================

  return (
    <section
      data-component="product-highlights"
      aria-label={text.navigation}
      className={[
        "w-full min-w-0",
        "border-t border-slate-100",
        "bg-white",
        showOnMobile
          ? "block"
          : "hidden lg:block",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "grid min-w-0",
          "grid-cols-2",
          "gap-x-2",
          "gap-y-1",
          "p-2",
          "sm:p-3",
          "lg:grid-cols-4",
          "lg:gap-1",
        ].join(" ")}
      >
        {visibleItems.map(
          (item) => (
            <HighlightCard
              key={item.key}
              item={item}
              locale={currentLocale}
            />
          )
        )}
      </div>
    </section>
  );
}

export default ProductHighlights;
