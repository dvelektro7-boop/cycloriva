"use client";
import { getCartSnapshot, subscribeToCart } from "@/lib/cart";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { parseCart, saveCart } from "@/lib/product-cart";
import { formatProductCurrency, getProductTranslations, productCommerceTexts } from "@/lib/product-i18n";
import { PRODUCT_ORDER_CONFIG } from "@/lib/product-order";
import type { SiteLocale } from "@/lib/site-i18n";

export type CartProduct = { id: string; name: string; sku: string; price: number | null; unavailable: boolean };
function subscribe(callback: () => void) { return subscribeToCart(callback); }
function snapshot() { return JSON.stringify(getCartSnapshot().items.map(item=>({productId:item.productId,quantity:item.quantity}))); }

export function ProductCart({ products, locale }: { products: CartProduct[]; locale: SiteLocale }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const entries = parseCart(raw);
  const [error, setError] = useState("");
  const t = productCommerceTexts[locale];
  const order = getProductTranslations(locale).order;
  const lines = entries.flatMap((entry) => {
    const product = products.find((item) => item.id === entry.productId);
    return product ? [{ ...product, quantity: entry.quantity }] : [];
  });
  const totalCents = lines.reduce((total, line) => total + Math.round((line.price ?? 0) * 100) * line.quantity, 0);
  const canOrder = lines.length > 0 && lines.every((line) => line.price !== null && !line.unavailable);
  function change(id: string, quantity: number) {
    try { saveCart(entries.flatMap((entry) => entry.productId === id ? quantity > 0 ? [{ ...entry, quantity }] : [] : [entry])); }
    catch { setError(t.storage); }
  }
  function whatsapp() {
    if (!canOrder) return;
    const message = [order.greeting, "", ...lines.flatMap((line) => [
      `${order.product} : ${line.name}`,
      `${order.reference} : ${line.sku || line.id}`,
      `${order.quantity} : ${line.quantity}`,
      `${t.unitPrice} : ${formatProductCurrency(line.price, locale)}`,
      `${t.lineTotal} : ${formatProductCurrency(Math.round((line.price ?? 0) * 100) * line.quantity / 100, locale)}`,
      `${order.link} : ${new URL(`/${locale}/produits/${line.id}`, window.location.origin).href}`, "",
    ]), `${t.total} : ${formatProductCurrency(totalCents / 100, locale)}`, "", t.pending, order.question].join("\n");
    window.open(`https://wa.me/${PRODUCT_ORDER_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }
  return <main className="mx-auto w-full max-w-5xl px-4 py-6 text-[#102b39]">
    <h1 className="mb-4 text-2xl font-bold">{t.cart}</h1>
    <p className="mb-5 rounded-lg bg-slate-50 p-3 text-sm">{t.pending}</p>
    {lines.length === 0 && <p className="mb-4">{t.empty}</p>}
    <div className="space-y-3">{lines.map((line) => <article key={line.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
      <div className="min-w-0 flex-1"><Link className="font-bold wrap-break-word" href={`/${locale}/produits/${line.id}`}>{line.name}</Link><p className="cycloriva-price text-[#b91c1c] mt-1 text-sm">{t.unitPrice} : {formatProductCurrency(line.price, locale)}</p>{line.unavailable && <p className="text-sm text-red-700">{order.unavailableProduct}</p>}</div>
      <label className="flex items-center gap-2 text-sm">{order.quantity}<input className="w-16 rounded border p-2" type="number" min={1} max={99} step={1} value={line.quantity} onChange={(event) => change(line.id, Math.max(1, Math.min(99, Math.floor(Number(event.target.value) || 1))))}/></label>
      <strong className="cycloriva-price text-[#b91c1c]">{formatProductCurrency(line.price === null ? null : Math.round(line.price * 100) * line.quantity / 100, locale)}</strong>
      <button className="text-sm underline" type="button" onClick={() => change(line.id, 0)}>{t.remove}</button>
    </article>)}</div>
    {lines.length > 0 && <div className="my-5 flex flex-wrap items-center justify-between gap-4"><strong className="cycloriva-price text-[#b91c1c] text-xl">{t.total} : {canOrder ? formatProductCurrency(totalCents / 100, locale) : getProductTranslations(locale).summary.priceUnavailable}</strong><Link className={"rounded-lg bg-[#102b39] px-5 py-3 font-bold text-white" + (!canOrder ? " pointer-events-none opacity-50" : "")} aria-disabled={!canOrder} tabIndex={canOrder?0:-1} href={"/"+locale+"/commande"}>{order.websiteTitle}</Link><button className="rounded-lg bg-green-700 px-5 py-3 font-bold text-white disabled:opacity-50" type="button" disabled={!canOrder} onClick={whatsapp}>{order.whatsappTitle}</button></div>}
    {error && <p role="alert">{error}</p>}
    <Link className="inline-block py-3 underline" href={`/${locale}/produits`}>{t.continue}</Link>
  </main>;
}
