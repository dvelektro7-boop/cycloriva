import { resolveLocale } from "@/lib/site-i18n";

const labels = {
  fr: { breadcrumb: "Fil d’Ariane", checkout: "Finaliser la commande" },
  en: { breadcrumb: "Breadcrumb", checkout: "Checkout" },
  de: { breadcrumb: "Brotkrümelnavigation", checkout: "Bestellung abschließen" },
  es: { breadcrumb: "Ruta de navegación", checkout: "Finalizar el pedido" },
  it: { breadcrumb: "Percorso di navigazione", checkout: "Completa l’ordine" },
};

export function accessibilityLabel(locale: string | undefined, key: "breadcrumb" | "checkout"): string {
  return labels[resolveLocale(locale)][key];
}
