"use client";
import { getCartSnapshot, subscribeToCart } from "@/lib/cart";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ShoppingCart } from "lucide-react";
import type { SiteLocale } from "@/lib/site-i18n";
import { productCommerceTexts } from "@/lib/product-i18n";

function subscribe(callback: () => void) { return subscribeToCart(callback); }
function snapshot() { return getCartSnapshot().items.reduce((sum,item)=>sum+item.quantity,0); }
export function ProductCartLink({ locale, size = 25 }: { locale: SiteLocale; size?: number }) {
  const count = useSyncExternalStore(subscribe, snapshot, () => 0);
  return <Link href={`/${locale}/panier`} aria-label={`${productCommerceTexts[locale].cart} (${count})`} className="relative"><ShoppingCart size={size} aria-hidden="true"/><span className="absolute -top-2 -right-2 rounded-full bg-[#23b815] px-1.5 text-[10px] font-bold text-white">{count}</span></Link>;
}
