import { Suspense } from "react";
import { notFound } from "next/navigation";
import { allProducts, localizedProduct } from "@/lib/catalog";
import { isSiteLocale } from "@/lib/site-i18n";
import { getProductOrderPrice } from "@/lib/product-order";
import { ProductFavorites } from "@/components/product/ProductFavorites";

export const metadata = { robots: { index: false, follow: false } };
async function FavoritesContent({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  return <ProductFavorites locale={locale} products={allProducts.map((product) => ({ id: product.id, name: localizedProduct(product, locale).name, price: getProductOrderPrice(product) }))}/>;
}
export default function FavoritesPage({ params }: { params: Promise<{ locale: string }> }) {
  return <Suspense fallback={<main aria-busy="true" className="min-h-60"/>}><FavoritesContent params={params}/></Suspense>;
}
