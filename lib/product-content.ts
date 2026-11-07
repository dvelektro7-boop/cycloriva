import { localizedProduct, stripHtml, type Product, type Locale } from "./catalog";

/** Preserve block boundaries, without rendering imported HTML or its links. */
export function productParagraphs(html: string): string[] {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(?:p|div|li|tr|h[1-6])\s*>|<br\s*\/?\s*>/gi, "\n")
    .split(/\n+/).map((line) => stripHtml(line).trim()).filter(Boolean);
}

/** Explicit label/value pairs only: never infer a specification from prose. */
export function descriptionSpecifications(product: Product, locale: Locale) {
  const html = localizedProduct(product, locale).description;
  const rows: { label: string; value: string }[] = [];
  for (const match of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...match[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)]
      .map((cell) => stripHtml(cell[1]).trim());
    if (cells.length >= 2 && cells[0] && cells[1]) rows.push({ label: cells[0], value: cells.slice(1).join(" · ") });
  }
  for (const line of productParagraphs(html)) {
    const pair = line.match(/^([^:：]{2,55})\s*[:：]\s*(.{1,500})$/);
    if (pair) rows.push({ label: pair[1].trim(), value: pair[2].trim() });
  }
  return rows;
}

export function productIntroduction(html: string): string {
  return productParagraphs(html).find((line) => line.length > 60 && line !== line.toUpperCase() && !/^[^:]{2,55}:/.test(line)) || "";
}
