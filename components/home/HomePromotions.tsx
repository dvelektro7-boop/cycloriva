import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";
import { PromotionCountdown } from "./PromotionCountdown";
import type { SiteLocale } from "@/lib/site-i18n";
import { BLACK_FRIDAY } from "@/lib/promotions";

const copy = {
  fr: { heading: "Promotions", all: "sur tous les articles", shipping: "Livraison gratuite", cta: "Profiter de l’offre" },
  en: { heading: "Promotions", all: "off every item", shipping: "Free delivery", cta: "Shop the offer" },
  de: { heading: "Aktionen", all: "auf alle Artikel", shipping: "Kostenloser Versand", cta: "Angebot entdecken" },
  es: { heading: "Promociones", all: "en todos los artículos", shipping: "Envío gratuito", cta: "Aprovechar la oferta" },
  it: { heading: "Promozioni", all: "su tutti gli articoli", shipping: "Spedizione gratuita", cta: "Scopri l’offerta" },
};

export function HomePromotions({ locale, className = "" }: { locale: SiteLocale; className?: string }) {
  if (!BLACK_FRIDAY.active) return null;
  const text = copy[locale];
  return (
    <section aria-labelledby="home-promotions" className={className}>
      <h2 id="home-promotions" className="text-xl font-black tracking-tight text-[#102b39] sm:text-2xl">{text.heading}</h2>
      <div className="mb-3 mt-1 h-1 w-11 rounded-full bg-[#1fba13]" />
      <div className="relative isolate overflow-hidden rounded-2xl border border-[#274536] bg-[#102b39] p-6 text-white shadow-sm sm:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-[#1fba13]/20 blur-3xl" />
        <PromotionCountdown locale={locale} />
        <p className="mt-5 text-sm font-black uppercase tracking-[0.22em] text-lime-300">Black Friday</p>
        <p className="mt-1 text-7xl font-black leading-none tracking-tighter sm:text-8xl">−35<span className="ml-1 text-4xl">%</span></p>
        <p className="mt-2 text-lg font-semibold">{text.all}</p>
        <p className="mt-5 flex items-center gap-2 border-t border-white/15 pt-4 text-sm font-semibold text-lime-200"><Truck size={21} aria-hidden="true" />{text.shipping}</p>
        <Link href={`/${locale}/produits`} className="mt-5 flex min-h-12 items-center justify-between gap-3 rounded-xl bg-[#1fba13] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#159b0c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300">{text.cta}<ArrowRight size={19} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
