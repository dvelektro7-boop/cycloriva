/** Campaign switch shared by catalogue rendering and server checkout. */
export const BLACK_FRIDAY = { active: true, discountPercent: 35, freeShipping: true } as const;

export function promotionPrices(price: number | null, regular: number | null, sale: number | null) {
  const base = sale !== null && regular !== null && sale < regular ? sale : price ?? regular ?? sale;
  if (!BLACK_FRIDAY.active || base === null || !Number.isFinite(base) || base <= 0) {
    return { price, regularPrice: regular, salePrice: sale };
  }
  // Round in cents once; never stack the campaign on normalized products.
  const discounted = Math.round(Math.round(base * 100) * (100 - BLACK_FRIDAY.discountPercent) / 100) / 100;
  return { price: discounted, regularPrice: base, salePrice: discounted };
}
