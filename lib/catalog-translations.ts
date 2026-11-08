import dictionaries from "@/data/catalog-translations.json";
import overrides from "@/data/catalog-translation-overrides.json";
import type { SiteLocale } from "@/lib/site-i18n";

const translations = dictionaries as Record<string, Record<string, string>>;
const reviewedTerms = overrides as Record<string, Record<string, string>>;

export function catalogTranslation(source: string, locale: SiteLocale): string | undefined {
  if (locale === "fr") return source;
  return reviewedTerms[locale]?.[source] ?? reviewedTerms[locale]?.[source.trim().toLocaleLowerCase("fr")] ?? translations[locale]?.[source] ?? translations[locale]?.[source.trim()];
}

export function catalogText(source: string, locale: SiteLocale): string {
  return catalogTranslation(source, locale) ?? source;
}
