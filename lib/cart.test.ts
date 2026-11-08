import test from "node:test";
import assert from "node:assert/strict";
import {
  getCartSnapshot,
  clearCart,
  CART_STORAGE_KEY,
  subscribeToCart,
} from "./cart";
import { addCartProduct, saveCart } from "./product-cart";

test("product, header, cart and checkout share one basket; legacy migration, updates and clearing are preserved", () => {
  const storage = new Map<string, string>();
  const events = new EventTarget();
  const windowStub = {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
    dispatchEvent: events.dispatchEvent.bind(events),
  };
  Object.defineProperty(globalThis, "window", {
    value: windowStub,
    configurable: true,
  });
  try {
    storage.set(
      "cycloriva-cart-v1",
      JSON.stringify([{ productId: "826", quantity: 2 }]),
    );
    assert.equal(getCartSnapshot().items[0].quantity, 2);
    assert.equal(getCartSnapshot().items[0].unitPriceCents, 46907);
    assert.ok(storage.has(CART_STORAGE_KEY));
    let updates = 0;
    const unsubscribe = subscribeToCart(() => updates++);
    addCartProduct("826", 1);
    assert.equal(getCartSnapshot().items[0].quantity, 3);
    assert.equal(updates, 1);
    saveCart([{ productId: "818", quantity: 2 }]);
    assert.equal(getCartSnapshot().items[0].productId, "818");
    const poisoned = JSON.parse(storage.get(CART_STORAGE_KEY)!);
    poisoned.items[0].unitPriceCents = 1;
    storage.set(CART_STORAGE_KEY, JSON.stringify(poisoned));
    assert.equal(getCartSnapshot().items[0].unitPriceCents, 60720);
    clearCart();
    assert.equal(getCartSnapshot().items.length, 0);
    assert.equal(getCartSnapshot().items.length, 0);
    unsubscribe();
  } finally {
    Reflect.deleteProperty(globalThis, "window");
  }
});
