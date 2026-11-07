import {
  addCatalogProductToCart,
  replaceProductCart,
  CART_STORAGE_KEY as SHARED_CART_KEY,
} from "./cart";
/** Store only identifiers and quantities. Prices are always read from the catalogue. */
export const CART_STORAGE_KEY = SHARED_CART_KEY;
export type CartEntry = { productId: string; quantity: number };
export function parseCart(raw: string | null): CartEntry[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(value)) return [];
    const entries = new Map<string, number>();
    for (const item of value.slice(0, 401)) {
      if (
        item &&
        typeof item.productId === "string" &&
        /^\d+$/.test(item.productId) &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= 99
      ) {
        entries.set(
          item.productId,
          Math.min(99, (entries.get(item.productId) || 0) + item.quantity),
        );
      }
    }
    return [...entries].map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
  } catch {
    return [];
  }
}
export function saveCart(entries: CartEntry[]) {
  const result = replaceProductCart(entries);
  if (!result.success) throw new Error(result.error);
}
export function addCartProduct(productId: string, quantity: number) {
  const result = addCatalogProductToCart(productId, quantity);
  if (!result.success) throw new Error(result.error);
}
