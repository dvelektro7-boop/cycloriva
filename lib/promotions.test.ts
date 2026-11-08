import test from "node:test";
import assert from "node:assert/strict";
import source from "../data/products.json";
import { allProducts, currentPrice } from "./catalog";
import { calculateCheckoutPricing } from "./checkout-pricing";
import { promotionPrices } from "./promotions";

test("Black Friday applies exactly 35% once across the complete catalogue", () => {
  for (const raw of source) {
    const product = allProducts.find(item => item.id === String(raw.id));
    assert.ok(product);
    if (raw.price === null) {
      assert.equal(currentPrice(product), null);
      continue;
    }
    const expected = Math.round(Math.round(raw.price * 100) * 65 / 100);
    assert.equal(Math.round(currentPrice(product)! * 100), expected, `product ${raw.id}`);
    assert.equal(product.regularPrice, raw.price);
  }
  assert.equal(promotionPrices(null, null, null).price, null);
  assert.equal(promotionPrices(100, 100, 80).price, 52);
});

test("checkout applies the campaign and free delivery without trusting client prices", async () => {
  const previous = process.env.CYCLORIVA_SHIPPING_FR_CENTS;
  process.env.CYCLORIVA_SHIPPING_FR_CENTS = "1500";
  try {
    const result = await calculateCheckoutPricing({ country: "FR", items: [{ productId: "818", quantity: 2 }] });
    assert.equal(result.items[0].unitPriceCents, 60720);
    assert.equal(result.totalCents, 121440);
    assert.equal(result.shippingCents, 0);
  } finally {
    if (previous === undefined) delete process.env.CYCLORIVA_SHIPPING_FR_CENTS;
    else process.env.CYCLORIVA_SHIPPING_FR_CENTS = previous;
  }
});
