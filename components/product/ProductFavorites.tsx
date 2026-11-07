"use client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getProductTranslations, formatProductCurrency } from "@/lib/product-i18n";
import type { SiteLocale } from "@/lib/site-i18n";

const KEY = "cycloriva-favorites-v1";
function snapshot() { try { return localStorage.getItem(KEY) || "[]"; } catch { return "[]"; } }
function parse(raw: string): string[] { try { const value: unknown = JSON.parse(raw); return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string" && /^\d+$/.test(id)))] : []; } catch { return []; } }
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback); window.addEventListener("cycloriva-favorites-change", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("cycloriva-favorites-change", callback); };
}
export function ProductFavoriteButton({ id, locale }: { id: string; locale: SiteLocale }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const [error, setError] = useState(false);
  const ids = parse(raw); const selected = ids.includes(id);
  const t = getProductTranslations(locale);
  return <button type="button" aria-label={t.mobileNavigation.favorites} aria-pressed={selected} title={error ? t.order.error : t.mobileNavigation.favorites} onClick={() => {
    try { localStorage.setItem(KEY, JSON.stringify(selected ? ids.filter((item) => item !== id) : [...ids, id])); window.dispatchEvent(new Event("cycloriva-favorites-change")); setError(false); } catch { setError(true); }
  }} className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#102b39] shadow-sm"><Heart aria-hidden="true" size={20} fill={selected ? "currentColor" : "none"}/>{error && <span className="absolute top-0 right-0 text-red-700" aria-live="polite">!</span>}</button>;
}
export function ProductFavorites({ products, locale }: { products: { id: string; name: string; price: number | null }[]; locale: SiteLocale }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const ids = parse(raw); const t = getProductTranslations(locale);
  return <main className="w-full p-4 sm:p-8"><h1 className="mb-4 text-2xl font-bold">{t.mobileNavigation.favorites}</h1><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{products.filter((product) => ids.includes(product.id)).map((product) => <article key={product.id} className="relative rounded-lg border border-slate-200 p-4 pt-14"><ProductFavoriteButton id={product.id} locale={locale}/><Link href={`/${locale}/produits/${product.id}`} className="font-bold">{product.name}</Link><p className="cycloriva-price text-[#b91c1c] mt-2">{formatProductCurrency(product.price, locale)}</p></article>)}</div><Link className="mt-5 inline-block underline" href={`/${locale}/produits`}>{t.breadcrumb.products}</Link></main>;
}
