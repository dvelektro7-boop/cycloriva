import { createElement } from "react";
import { descriptionSpecifications } from "@/lib/product-content";
import { catalogText } from "@/lib/catalog-translations";

import {
  BatteryCharging,
  Bike,
  Box,
  CircleGauge,
  Cog,
  Disc3,
  Hash,
  Lightbulb,
  Package,
  Ruler,
  Settings2,
  ShieldCheck,
  Tag,
  Weight,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { Product } from "@/lib/catalog";
import type { SiteLocale } from "@/lib/site-i18n";

// ============================================================
// CYCLORIVA — CARACTÉRISTIQUES TECHNIQUES
// ============================================================
//
// Next.js 16 — TypeScript — Tailwind CSS 4
//
// PC :
// - Titre de section
// - Deux tableaux côte à côte
// - Icône à gauche
// - Nom de caractéristique
// - Valeur issue du catalogue
//
// MOBILE :
// - Présentation compacte et responsive
// - Un tableau vertical
// - Compatible avec ProductDetailsTabs
// - Aucun débordement horizontal
//
// DONNÉES :
// - product.attributes
// - product.weightKg
// - product.dimensionsCm
// - product.sku
//
// Aucune caractéristique fictive.
// Aucun footer ni header.
//
// ============================================================

// ============================================================
// 1. TYPES PUBLICS
// ============================================================

export type ProductSpecificationItem = {
  label: string;
  value: string;
};

export type ProductSpecificationsProps = {
  product: Product;
  locale: SiteLocale;

  /**
   * Caractéristiques normalisées par le parent.
   *
   * Si fournies, elles remplacent l'extraction
   * automatique des attributs.
   */
  items?: readonly ProductSpecificationItem[];

  /**
   * Masquer le titre lorsque le composant est
   * affiché sous un titre déjà présent.
   */
  showTitle?: boolean;

  /**
   * Deux tableaux sur PC par défaut.
   */
  columns?: 1 | 2;

  /**
   * Nombre maximum de lignes.
   *
   * Par défaut : toutes les lignes réelles.
   */
  limit?: number;

  className?: string;
};

// ============================================================
// 2. TRADUCTIONS
// ============================================================

type SpecificationTranslations = {
  title: string;
  unavailable: string;
  reference: string;
  weight: string;
  dimensions: string;
  brand: string;
  model: string;
  bikeType: string;
  motor: string;
  battery: string;
  range: string;
  frame: string;
  fork: string;
  brakes: string;
  transmission: string;
  wheels: string;
  tires: string;
  maximumLoad: string;
  color: string;
  size: string;
  lighting: string;
  rack: string;
  mudguard: string;
  kickstand: string;
  yes: string;
  no: string;
};

const translations: Record<
  SiteLocale,
  SpecificationTranslations
> = {
  fr: {
    title: "Caractéristiques techniques",
    unavailable:
      "Aucune caractéristique technique n'est renseignée pour ce produit.",
    reference: "Référence",
    weight: "Poids",
    dimensions: "Dimensions",
    brand: "Marque",
    model: "Modèle",
    bikeType: "Type de vélo",
    motor: "Moteur",
    battery: "Batterie",
    range: "Autonomie",
    frame: "Cadre",
    fork: "Fourche",
    brakes: "Freins",
    transmission: "Transmission",
    wheels: "Roues",
    tires: "Pneus",
    maximumLoad: "Charge maximale",
    color: "Couleurs",
    size: "Tailles",
    lighting: "Éclairage",
    rack: "Porte-bagages",
    mudguard: "Garde-boue",
    kickstand: "Béquille",
    yes: "Oui",
    no: "Non",
  },

  en: {
    title: "Technical specifications",
    unavailable:
      "No technical specifications are available for this product.",
    reference: "Reference",
    weight: "Weight",
    dimensions: "Dimensions",
    brand: "Brand",
    model: "Model",
    bikeType: "Bike type",
    motor: "Motor",
    battery: "Battery",
    range: "Range",
    frame: "Frame",
    fork: "Fork",
    brakes: "Brakes",
    transmission: "Transmission",
    wheels: "Wheels",
    tires: "Tires",
    maximumLoad: "Maximum load",
    color: "Colors",
    size: "Sizes",
    lighting: "Lighting",
    rack: "Luggage rack",
    mudguard: "Mudguard",
    kickstand: "Kickstand",
    yes: "Yes",
    no: "No",
  },

  de: {
    title: "Technische Daten",
    unavailable:
      "Für dieses Produkt sind keine technischen Daten verfügbar.",
    reference: "Artikelnummer",
    weight: "Gewicht",
    dimensions: "Abmessungen",
    brand: "Marke",
    model: "Modell",
    bikeType: "Fahrradtyp",
    motor: "Motor",
    battery: "Akku",
    range: "Reichweite",
    frame: "Rahmen",
    fork: "Gabel",
    brakes: "Bremsen",
    transmission: "Schaltung",
    wheels: "Räder",
    tires: "Reifen",
    maximumLoad: "Maximale Belastung",
    color: "Farben",
    size: "Größen",
    lighting: "Beleuchtung",
    rack: "Gepäckträger",
    mudguard: "Schutzbleche",
    kickstand: "Ständer",
    yes: "Ja",
    no: "Nein",
  },

  it: {
    title: "Caratteristiche tecniche",
    unavailable:
      "Non sono disponibili caratteristiche tecniche per questo prodotto.",
    reference: "Riferimento",
    weight: "Peso",
    dimensions: "Dimensioni",
    brand: "Marca",
    model: "Modello",
    bikeType: "Tipo di bicicletta",
    motor: "Motore",
    battery: "Batteria",
    range: "Autonomia",
    frame: "Telaio",
    fork: "Forcella",
    brakes: "Freni",
    transmission: "Trasmissione",
    wheels: "Ruote",
    tires: "Pneumatici",
    maximumLoad: "Carico massimo",
    color: "Colori",
    size: "Taglie",
    lighting: "Illuminazione",
    rack: "Portapacchi",
    mudguard: "Parafanghi",
    kickstand: "Cavalletto",
    yes: "Sì",
    no: "No",
  },

  es: {
    title: "Características técnicas",
    unavailable:
      "No hay características técnicas disponibles para este producto.",
    reference: "Referencia",
    weight: "Peso",
    dimensions: "Dimensiones",
    brand: "Marca",
    model: "Modelo",
    bikeType: "Tipo de bicicleta",
    motor: "Motor",
    battery: "Batería",
    range: "Autonomía",
    frame: "Cuadro",
    fork: "Horquilla",
    brakes: "Frenos",
    transmission: "Transmisión",
    wheels: "Ruedas",
    tires: "Neumáticos",
    maximumLoad: "Carga máxima",
    color: "Colores",
    size: "Tallas",
    lighting: "Iluminación",
    rack: "Portaequipajes",
    mudguard: "Guardabarros",
    kickstand: "Pata de cabra",
    yes: "Sí",
    no: "No",
  },
};

// ============================================================
// 3. IDENTIFIANTS DES CARACTÉRISTIQUES
// ============================================================

type SpecificationKey =
  | "brand"
  | "model"
  | "bikeType"
  | "motor"
  | "battery"
  | "range"
  | "frame"
  | "fork"
  | "brakes"
  | "transmission"
  | "wheels"
  | "tires"
  | "weight"
  | "maximumLoad"
  | "color"
  | "size"
  | "lighting"
  | "rack"
  | "mudguard"
  | "kickstand"
  | "dimensions"
  | "reference";

// ============================================================
// 4. ORDRE D'AFFICHAGE
// ============================================================

const SPECIFICATION_ORDER: readonly SpecificationKey[] = [
  "brand",
  "model",
  "bikeType",
  "motor",
  "battery",
  "range",
  "frame",
  "fork",
  "brakes",
  "transmission",
  "wheels",
  "tires",
  "weight",
  "maximumLoad",
  "color",
  "size",
  "lighting",
  "rack",
  "mudguard",
  "kickstand",
  "dimensions",
  "reference",
];

// ============================================================
// 5. ICÔNES DES CARACTÉRISTIQUES
// ============================================================

const SPECIFICATION_ICONS: Record<
  SpecificationKey,
  LucideIcon
> = {
  brand: Tag,
  model: Settings2,
  bikeType: Bike,
  motor: Cog,
  battery: BatteryCharging,
  range: CircleGauge,
  frame: Wrench,
  fork: Wrench,
  brakes: Disc3,
  transmission: Settings2,
  wheels: CircleGauge,
  tires: Disc3,
  weight: Weight,
  maximumLoad: Weight,
  color: Tag,
  size: Ruler,
  lighting: Lightbulb,
  rack: Package,
  mudguard: ShieldCheck,
  kickstand: Wrench,
  dimensions: Box,
  reference: Hash,
};

// ============================================================
// 6. LANGUE
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
// 7. NETTOYAGE DES TEXTES
// ============================================================

function cleanText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeText(value: unknown): string {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function validValue(value: string): boolean {
  const normalized = normalizeText(value);

  if (!normalized) {
    return false;
  }

  return ![
    "null",
    "undefined",
    "n/a",
    "na",
    "unknown",
    "not available",
    "non renseigne",
    "non disponible",
    "non communique",
    "-",
  ].includes(normalized);
}

// ============================================================
// 8. RECONNAISSANCE DES NOMS D'ATTRIBUTS
// ============================================================

const ATTRIBUTE_ALIASES: Record<
  SpecificationKey,
  readonly string[]
> = {
  brand: [
    "marque",
    "brand",
    "marke",
    "marca",
    "fabricant",
    "manufacturer",
    "hersteller",
  ],

  model: [
    "modele",
    "model",
    "modell",
    "modello",
    "modelo",
  ],

  bikeType: [
    "type de velo",
    "type de bicyclette",
    "bike type",
    "bicycle type",
    "fahrradtyp",
    "tipo di bicicletta",
    "tipo de bicicleta",
  ],

  motor: [
    "moteur",
    "motor",
    "motore",
    "antrieb",
    "motorisation",
    "motorizzazione",
  ],

  battery: [
    "batterie",
    "battery",
    "batteria",
    "bateria",
    "akku",
    "capacite batterie",
    "battery capacity",
    "akkukapazitat",
  ],

  range: [
    "autonomie",
    "range",
    "portee",
    "reichweite",
    "autonomia",
    "autonomy",
  ],

  frame: [
    "cadre",
    "frame",
    "rahmen",
    "telaio",
    "cuadro",
    "materiau cadre",
    "frame material",
  ],

  fork: [
    "fourche",
    "fourche avant",
    "fork",
    "gabel",
    "forcella",
    "horquilla",
  ],

  brakes: [
    "freins",
    "frein",
    "brakes",
    "brake",
    "bremsen",
    "freni",
    "frenos",
  ],

  transmission: [
    "transmission",
    "changement de vitesse",
    "drivetrain",
    "gear system",
    "schaltung",
    "schaltwerk",
    "cambio",
    "cambios",
  ],

  wheels: [
    "roues",
    "roue",
    "wheels",
    "wheel size",
    "radgrosse",
    "rader",
    "ruote",
    "ruedas",
    "taille des roues",
    "taille de roue",
  ],

  tires: [
    "pneus",
    "pneu",
    "tires",
    "tyres",
    "reifen",
    "pneumatici",
    "neumaticos",
  ],

  weight: [
    "poids",
    "weight",
    "gewicht",
    "peso",
  ],

  maximumLoad: [
    "charge max",
    "charge maximale",
    "maximum load",
    "max load",
    "maximale belastung",
    "carico massimo",
    "carga maxima",
  ],

  color: [
    "couleur",
    "couleurs",
    "color",
    "colors",
    "colour",
    "colours",
    "farbe",
    "farben",
    "colore",
    "colori",
    "colores",
  ],

  size: [
    "taille",
    "tailles",
    "size",
    "sizes",
    "grosse",
    "groessen",
    "taglia",
    "taglie",
    "talla",
    "tallas",
  ],

  lighting: [
    "eclairage",
    "lighting",
    "lights",
    "beleuchtung",
    "illuminazione",
    "iluminacion",
  ],

  rack: [
    "porte bagages",
    "porte-bagages",
    "luggage rack",
    "rear rack",
    "gepacktrager",
    "portapacchi",
    "portaequipajes",
  ],

  mudguard: [
    "garde boue",
    "garde-boue",
    "mudguard",
    "fender",
    "schutzblech",
    "parafango",
    "guardabarros",
  ],

  kickstand: [
    "bequille",
    "kickstand",
    "stander",
    "seitenstander",
    "cavalletto",
    "pata de cabra",
  ],

  dimensions: [
    "dimensions",
    "dimension",
    "abmessungen",
    "dimensioni",
    "dimensiones",
  ],

  reference: [
    "reference",
    "sku",
    "ref",
    "artikelnummer",
    "article number",
  ],
};

function identifySpecification(
  label: string
): SpecificationKey | null {
  const normalized = normalizeText(label);

  if (!normalized) {
    return null;
  }

  for (const key of SPECIFICATION_ORDER) {
    if (
      ATTRIBUTE_ALIASES[key].some(
        (alias) =>
          normalizeText(alias) === normalized
      )
    ) {
      return key;
    }
  }

  return null;
}

// ============================================================
// 9. LECTURE DES VALEURS
// ============================================================

function readAttributeValue(
  value: unknown,
  locale: SiteLocale
): string {
  if (typeof value === "string") {
    return cleanText(value);
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value
      ? translations[locale].yes
      : translations[locale].no;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        readAttributeValue(item, locale)
      )
      .filter(validValue)
      .join(", ");
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return readAttributeValue(
      record.value ??
        record.values ??
        record.option ??
        record.options,
      locale
    );
  }

  return "";
}

// ============================================================
// 10. FORMATAGE DES DIMENSIONS
// ============================================================

function getDimensions(
  value: unknown,
  locale: SiteLocale
): string | null {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return null;
  }

  const record =
    value as Record<string, unknown>;

  const length = record.length;
  const width = record.width;
  const height = record.height;

  const values = [length, width, height];

  if (
    values.every(
      (entry) =>
        typeof entry === "number" &&
        Number.isFinite(entry) &&
        entry > 0
    )
  ) {
    const languageTags: Record<SiteLocale, string> = {
      fr: "fr-FR",
      en: "en-GB",
      de: "de-DE",
      it: "it-IT",
      es: "es-ES",
    };

    const formatted = values.map((entry) =>
      new Intl.NumberFormat(
        languageTags[locale],
        {
          maximumFractionDigits: 2,
        }
      ).format(entry as number)
    );

    return `${formatted.join(" × ")} cm`;
  }

  return null;
}

// ============================================================
// 11. EXTRACTION DES CARACTÉRISTIQUES DU PRODUIT
// ============================================================

export function extractProductSpecifications(
  product: Product,
  locale: SiteLocale
): ProductSpecificationItem[] {
  const language = getValidLocale(locale);

  const text = translations[language];

  const recognized = new Map<
    SpecificationKey,
    string
  >();

  const additional: ProductSpecificationItem[] = [];

  const seenAdditional = new Set<string>();

  function addAttribute(
    name: unknown,
    rawValue: unknown
  ) {
    const label = cleanText(name);

    const value = readAttributeValue(
      rawValue,
      language
    );

    if (
      !label ||
      !validValue(value)
    ) {
      return;
    }

    const key = identifySpecification(label);

    if (key) {
      if (!recognized.has(key)) {
        recognized.set(key, catalogText(value, language));
      }

      return;
    }

    const normalizedLabel =
      normalizeText(label);

    if (seenAdditional.has(normalizedLabel)) {
      return;
    }

    seenAdditional.add(normalizedLabel);

    additional.push({
      label: catalogText(label, language),
      value: catalogText(value, language),
    });
  }

  // ==========================================================
  // ATTRIBUTS SOUS FORME DE TABLEAU
  // ==========================================================

  const attributes: unknown = product.attributes;

  if (Array.isArray(attributes)) {
    for (const entry of attributes) {
      if (
        !entry ||
        typeof entry !== "object" ||
        Array.isArray(entry)
      ) {
        continue;
      }

      const record =
        entry as Record<string, unknown>;

      addAttribute(
        record.name ??
          record.label ??
          record.key,
        record.value ??
          record.values ??
          record.option ??
          record.options
      );
    }
  }

  // ==========================================================
  // ATTRIBUTS SOUS FORME D'OBJET
  // ==========================================================

  else if (
    attributes &&
    typeof attributes === "object"
  ) {
    for (const [name, value] of Object.entries(
      attributes as Record<string, unknown>
    )) {
      addAttribute(name, value);
    }
  }

  for (const row of descriptionSpecifications(product, language)) addAttribute(row.label, row.value);

  // ==========================================================
  // POIDS RÉEL
  // ==========================================================

  if (
    typeof product.weightKg === "number" &&
    Number.isFinite(product.weightKg) &&
    product.weightKg > 0 &&
    !recognized.has("weight")
  ) {
    recognized.set(
      "weight",
      `${new Intl.NumberFormat(
        language,
        {
          maximumFractionDigits: 2,
        }
      ).format(product.weightKg)} kg`
    );
  }

  // ==========================================================
  // DIMENSIONS RÉELLES
  // ==========================================================

  const dimensions = getDimensions(
    product.dimensionsCm,
    language
  );

  if (
    dimensions &&
    !recognized.has("dimensions")
  ) {
    recognized.set(
      "dimensions",
      dimensions
    );
  }

  // ==========================================================
  // RÉFÉRENCE
  // ==========================================================

  if (
    typeof product.sku === "string" &&
    product.sku.trim() &&
    !recognized.has("reference")
  ) {
    recognized.set(
      "reference",
      product.sku.trim()
    );
  }

  // ==========================================================
  // ORDRE DE LA MAQUETTE
  // ==========================================================

  const sorted: ProductSpecificationItem[] =
    SPECIFICATION_ORDER.flatMap((key) => {
      const value = recognized.get(key);

      if (!value) {
        return [];
      }

      return [
        {
          label: text[key],
          value,
        },
      ];
    });

  return [...sorted, ...additional];
}

// ============================================================
// 12. NORMALISATION DES DONNÉES DU PARENT
// ============================================================

function normalizeProvidedItems(
  items: readonly ProductSpecificationItem[]
): ProductSpecificationItem[] {
  const result: ProductSpecificationItem[] = [];

  const seen = new Set<string>();

  for (const item of items) {
    if (!item) {
      continue;
    }

    const label = cleanText(item.label);
    const value = cleanText(item.value);

    if (!label || !validValue(value)) {
      continue;
    }

    const key = normalizeText(label);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    result.push({
      label,
      value,
    });
  }

  return result;
}

// ============================================================
// 13. ICÔNE ASSOCIÉE À CHAQUE LIGNE
// ============================================================

function getRowIcon(
  label: string
): LucideIcon {
  const key = identifySpecification(label);

  if (!key) {
    return Settings2;
  }

  return SPECIFICATION_ICONS[key];
}

// ============================================================
// 14. LIGNE TECHNIQUE
// ============================================================

function SpecificationRow({
  item,
}: {
  item: ProductSpecificationItem;
}) {

  return (
    <div
      className={[
        "grid min-w-0",
        "grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]",
        "items-start gap-2",
        "border-b border-slate-100",
        "px-2.5 py-2.5",
        "last:border-b-0",
        "sm:gap-3 sm:px-3",
        "lg:px-3.5",
      ].join(" ")}
    >
      {/* NOM ET ICÔNE */}

      <div
        className={[
          "flex min-w-0 items-start",
          "gap-2",
        ].join(" ")}
      >
        {createElement(getRowIcon(item.label), { "aria-hidden": true, className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-[#102b39] sm:h-4 sm:w-4", strokeWidth: 1.8 })}

        <dt
          className={[
            "min-w-0 wrap-break-word",
            "text-[10px]",
            "font-medium",
            "leading-relaxed",
            "text-slate-600",
            "sm:text-xs",
          ].join(" ")}
        >
          {item.label}
        </dt>
      </div>

      {/* VALEUR RÉELLE */}

      <dd
        className={[
          "min-w-0 wrap-break-word",
          "text-[10px]",
          "font-semibold",
          "leading-relaxed",
          "text-[#244660]",
          "sm:text-xs",
        ].join(" ")}
      >
        {item.value}
      </dd>
    </div>
  );
}

// ============================================================
// 15. TABLEAU TECHNIQUE
// ============================================================

function SpecificationTable({
  items,
}: {
  items: readonly ProductSpecificationItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <dl
      className={[
        "min-w-0 overflow-hidden",
        "rounded-xl",
        "border border-slate-200",
        "bg-white",
      ].join(" ")}
    >
      {items.map((item, index) => (
        <SpecificationRow
          key={`${normalizeText(item.label)}-${index}`}
          item={item}
        />
      ))}
    </dl>
  );
}

// ============================================================
// 16. COMPOSANT PRINCIPAL
// ============================================================

export function ProductSpecifications({
  product,
  locale,
  items,
  showTitle = true,
  columns = 2,
  limit,
  className = "",
}: ProductSpecificationsProps) {
  const language = getValidLocale(locale);

  const text = translations[language];

  // ==========================================================
  // SOURCE DES DONNÉES
  // ==========================================================

  const rawItems =
    items !== undefined
      ? normalizeProvidedItems(items)
      : extractProductSpecifications(
          product,
          language
        );

  // ==========================================================
  // LIMITE FACULTATIVE
  // ==========================================================

  const normalizedLimit =
    typeof limit === "number" &&
    Number.isFinite(limit)
      ? Math.max(0, Math.floor(limit))
      : rawItems.length;

  const visibleItems = rawItems.slice(
    0,
    normalizedLimit
  );

  // ==========================================================
  // DEUX COLONNES PC
  // ==========================================================

  const midpoint = Math.ceil(
    visibleItems.length / 2
  );

  const firstColumn =
    columns === 2
      ? visibleItems.slice(0, midpoint)
      : visibleItems;

  const secondColumn =
    columns === 2
      ? visibleItems.slice(midpoint)
      : [];

  // ==========================================================
  // RENDU
  // ==========================================================

  return (
    <section
      data-component="product-specifications"
      aria-label={text.title}
      className={[
        "w-full min-w-0",
        "text-[#102b39]",
        className,
      ].join(" ")}
    >
      {/* ==================================================
          TITRE
      ================================================== */}

      {showTitle && (
        <h2
          className={[
            "mb-3",
            "text-sm font-extrabold",
            "text-[#102b39]",
            "sm:mb-4",
            "sm:text-base",
            "lg:text-lg",
          ].join(" ")}
        >
          {text.title}
        </h2>
      )}

      {/* ==================================================
          AUCUNE CARACTÉRISTIQUE
      ================================================== */}

      {visibleItems.length === 0 ? (
        <div
          className={[
            "flex min-h-24",
            "items-center gap-3",
            "rounded-xl",
            "border border-slate-200",
            "bg-slate-50",
            "p-4",
          ].join(" ")}
        >
          <Settings2
            aria-hidden="true"
            className="h-6 w-6 shrink-0 text-[#24b715]"
          />

          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
            {text.unavailable}
          </p>
        </div>
      ) : (
        <>
          {/* ================================================
              MOBILE : UN TABLEAU
          ================================================ */}

          <div className="lg:hidden">
            <SpecificationTable
              items={visibleItems}
            />
          </div>

          {/* ================================================
              PC : UN OU DEUX TABLEAUX
          ================================================ */}

          <div
            className={[
              "hidden min-w-0",
              "lg:grid",
              "lg:items-start",
              "lg:gap-3",
              columns === 2 &&
              secondColumn.length > 0
                ? "lg:grid-cols-2"
                : "lg:grid-cols-1",
            ].join(" ")}
          >
            <SpecificationTable
              items={firstColumn}
            />

            {columns === 2 &&
              secondColumn.length > 0 && (
                <SpecificationTable
                  items={secondColumn}
                />
              )}
          </div>
        </>
      )}
    </section>
  );
}

export default ProductSpecifications;
