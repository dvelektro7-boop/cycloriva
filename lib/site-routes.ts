import type { SiteLocale } from "./site-i18n";

/** Existing information pages. Keep navigation paths identical in every site language. */
export const informationRoutes = {
  about: "a-propos",
  guides: "conseils-guides",
  customers: "service-client",
  delivery: "livraison",
  returns: "retours-remboursements",
  faq: "faq",
  warranty: "garantie",
  payments: "paiements-securises",
  track: "suivi-commande",
  contact: "contact",
  legal: "mentions-legales",
  privacy: "politique-confidentialite",
  terms: "conditions-generales-vente",
  cookies: "gestion-cookies",
} as const;
export type InformationRouteKey = keyof typeof informationRoutes;
export function informationPagePath(
  locale: SiteLocale,
  key: InformationRouteKey,
) {
  return `/${locale}/${informationRoutes[key]}`;
}
export const serviceInformationRoutes = {
  delivery: "delivery",
  payment: "payments",
  returns: "returns",
  warranty: "warranty",
  support: "customers",
} as const satisfies Record<string, InformationRouteKey>;
