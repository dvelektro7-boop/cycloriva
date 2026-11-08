import Link from "next/link";
import { locale as getRootLocale } from "next/root-params";
import { resolveLocale, siteText } from "@/lib/site-i18n";

const messages = {
  fr: { title: "Page introuvable", description: "Cette page ou ce produit n’est pas disponible." },
  en: { title: "Page not found", description: "This page or product is not available." },
  de: { title: "Seite nicht gefunden", description: "Diese Seite oder dieses Produkt ist nicht verfügbar." },
  es: { title: "Página no encontrada", description: "Esta página o este producto no está disponible." },
  it: { title: "Pagina non trovata", description: "Questa pagina o questo prodotto non è disponibile." },
};

export default async function NotFound() {
  const locale = resolveLocale(await getRootLocale());
  const text = messages[locale];
  return <main className="mx-auto w-full max-w-3xl p-8 text-center"><h1 className="text-2xl font-bold">{text.title}</h1><p className="my-4">{text.description}</p><Link className="font-bold underline" href={`/${locale}`}>{siteText(locale, "home")}</Link></main>;
}
