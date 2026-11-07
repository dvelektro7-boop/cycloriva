"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { localizedProduct, type Product } from "@/lib/catalog";
import type { SiteLocale } from "@/lib/site-i18n";
import { getProductTranslations, productCommerceTexts } from "@/lib/product-i18n";
import { createProductCartDraft, createProductWhatsAppOrder, PRODUCT_ORDER_CONFIG } from "@/lib/product-order";
import { addCartProduct } from "@/lib/product-cart";

export type ProductOrderActionsProps = {
  product: Product; locale: SiteLocale; whatsappNumber?: string | null;
  productName?: string; productUrl?: string;
  onOrderOnSite?: (product: Product) => void | Promise<void>;
  siteOrderHref?: string; disabled?: boolean; loading?: boolean; className?: string;
};

export function ProductOrderActions({ product, locale, whatsappNumber = PRODUCT_ORDER_CONFIG.whatsappNumber, productName, productUrl, onOrderOnSite, siteOrderHref, disabled = false, loading = false, className = "" }: ProductOrderActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const t = getProductTranslations(locale).order;
  const name = productName || localizedProduct(product, locale).name;
  const draft = createProductCartDraft(product, quantity, name);
  const blocked = disabled || loading || busy || !draft.success;
  function whatsapp() {
    const result = createProductWhatsAppOrder({ product, locale, whatsappNumber: whatsappNumber || "", productName: name, quantity, productUrl: productUrl || new URL('/' + locale + '/produits/' + encodeURIComponent(product.id), window.location.origin).href });
    if (result.success) window.open(result.url, "_blank", "noopener,noreferrer");
    else setError(t.error);
  }
  async function orderOnSite() {
    if (blocked) return;
    setBusy(true); setError("");
    try {
      addCartProduct(product.id, quantity);
      if (onOrderOnSite) await onOrderOnSite(product);
      else router.push(siteOrderHref && /^\/(?!\/)/.test(siteOrderHref) ? siteOrderHref : '/' + locale + '/commande');
    } catch { setError(productCommerceTexts[locale].storage); }
    finally { setBusy(false); }
  }
  return <section data-component="product-order-actions" className={className} aria-label={t.websiteTitle}>
    <label className="product-quantity">{t.quantity}<input type="number" min={1} max={99} step={1} value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(99, Math.floor(Number(event.target.value) || 1))))} /></label>
    <div className="product-order-buttons">
      <button type="button" className="product-order-button" disabled={blocked || !whatsappNumber} onClick={whatsapp}><FaWhatsapp size={23} aria-hidden="true"/><span>{t.whatsappTitle}<small>{t.whatsappSubtitle}</small></span></button>
      <button type="button" className="product-order-button" disabled={blocked} aria-busy={busy} onClick={orderOnSite}><ShoppingCart size={23} aria-hidden="true"/><span>{busy ? t.processing : t.websiteTitle}<small>{t.websiteSubtitle}</small></span></button>
    </div>
    {!draft.success && <p className="mt-2 text-xs text-slate-600">{t.unavailableProduct}</p>}
    {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
  </section>;
}
export default ProductOrderActions;
