import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateCheckoutPricing,
  CheckoutPricingError,
} from "./checkout-pricing";
import { safeValidateCheckout } from "./checkout-validation";
import {
  CHECKOUT_COUNTRIES,
  validateCheckoutPostalCode,
} from "./checkout-countries";
import {
  createConfirmationCookie,
  verifyConfirmationCookie,
} from "./checkout-confirmation";
import {
  buildCustomerOrderEmail,
  buildAdminOrderEmail,
  sendCustomerOrderEmail,
  getCheckoutEmailConfiguration,
  type CheckoutEmailOrder,
} from "./checkout-emails";
import { getCheckoutTranslations } from "./checkout-i18n";

export const checkoutFixture = {
  idempotencyKey: "checkout-test-00000000000000001",
  locale: "fr",
  customer: {
    firstName: "Alice",
    lastName: "Martin",
    email: "customer@cycloriva.test",
    phoneCountry: "FR",
    phoneNational: "0612345678",
  },
  delivery: {
    country: "DE",
    city: "Berlin",
    postalCode: "10115",
    addressLine1: "Teststrasse 12",
    addressLine2: null,
  },
  items: [
    { productId: "826", quantity: 2, variantId: null },
    { productId: "818", quantity: 1, variantId: null },
  ],
  sameBillingAddress: true,
  expectedTotalCents: 237745,
};

test("validation accepts independent phone/delivery countries and carries the reviewed total", () => {
  const result = safeValidateCheckout(checkoutFixture);
  assert.ok(result.success);
  assert.equal(result.data.customer.phoneE164, "+33612345678");
  assert.equal(result.data.delivery.country, "DE");
  assert.equal(result.data.expectedTotalCents, 237745);
  assert.equal(
    safeValidateCheckout({
      ...checkoutFixture,
      delivery: { ...checkoutFixture.delivery, country: "US" },
    }).success,
    false,
  );
  assert.equal(
    safeValidateCheckout({
      ...checkoutFixture,
      items: [{ productId: "826", quantity: 0 }],
    }).success,
    false,
  );
  assert.equal(
    safeValidateCheckout({
      ...checkoutFixture,
      items: [...checkoutFixture.items, checkoutFixture.items[0]],
    }).success,
    false,
  );
  assert.equal(
    safeValidateCheckout({
      ...checkoutFixture,
      customer: { ...checkoutFixture.customer, email: "bad-address" },
    }).success,
    false,
  );
  assert.equal(
    safeValidateCheckout({ ...checkoutFixture, sameBillingAddress: false })
      .success,
    false,
  );
  assert.equal(
    safeValidateCheckout({ ...checkoutFixture, totalCents: 1 }).success,
    false,
  );
});

test("real catalogue prices are recalculated in cents, with free delivery for eight configured countries", async () => {
  for (const country of CHECKOUT_COUNTRIES) {
    const pricing = await calculateCheckoutPricing({
      country,
      items: checkoutFixture.items,
    });
    assert.equal(pricing.subtotalCents, 237745);
    assert.equal(pricing.shippingCents, 0);
    assert.equal(pricing.totalCents, 237745);
    assert.equal(pricing.items[0].unitPriceCents, 72165);
  }
  await assert.rejects(
    calculateCheckoutPricing({
      country: "FR",
      items: [{ productId: "missing", quantity: 1 }],
    }),
    CheckoutPricingError,
  );
  await assert.rejects(
    calculateCheckoutPricing({
      country: "FR",
      items: [{ productId: "826", quantity: NaN }],
    }),
    CheckoutPricingError,
  );
});

test("postal validation matches the eight supported countries", () => {
  const examples = {
    FR: "75000",
    DE: "10115",
    ES: "28001",
    IT: "00100",
    CH: "8001",
    AT: "1010",
    NL: "1012 AB",
    BE: "1000",
  };
  for (const country of CHECKOUT_COUNTRIES) {
    assert.equal(
      validateCheckoutPostalCode(examples[country], country).valid,
      true,
    );
    assert.equal(validateCheckoutPostalCode("!", country).valid, false);
  }
});

test("confirmation cookie cannot be reused for another order or modified", () => {
  const old = process.env.CYCLORIVA_ORDER_CONFIRMATION_SECRET;
  process.env.CYCLORIVA_ORDER_CONFIRMATION_SECRET =
    "test-only-secret-123456789012345678901234";
  try {
    const cookie = createConfirmationCookie("order-test");
    assert.equal(verifyConfirmationCookie(cookie, "order-test"), true);
    assert.equal(verifyConfirmationCookie(cookie, "another-order"), false);
    assert.equal(
      verifyConfirmationCookie(cookie.slice(0, -2) + "ff", "order-test"),
      false,
    );
    assert.equal(verifyConfirmationCookie(undefined, "order-test"), false);
  } finally {
    process.env.CYCLORIVA_ORDER_CONFIRMATION_SECRET = old;
  }
});

export const emailFixture: CheckoutEmailOrder = {
  id: "order-test",
  orderNumber: "CY-TEST-0001",
  firstName: "Alice",
  lastName: "Martin",
  email: "customer@cycloriva.test",
  phoneDialCode: "+33",
  phoneNational: "0612345678",
  phoneE164: "+33612345678",
  country: "DE",
  city: "Berlin",
  postalCode: "10115",
  addressLine1: "Teststrasse 12",
  addressLine2: null,
  locale: "fr",
  currency: "EUR",
  subtotalCents: 72165,
  shippingCents: 0,
  taxCents: null,
  totalCents: 72165,
  status: "RECEIVED",
  paymentStatus: "NOT_REQUESTED",
  createdAt: new Date("2026-11-07T10:00:00Z"),
  items: [
    {
      productId: "826",
      productName: "SIGNAL-S <script>alert(1)</script>",
      sku: null,
      quantity: 1,
      unitPriceCents: 72165,
      lineTotalCents: 72165,
      currency: "EUR",
    },
  ],
};
test("customer mail uses five languages, real totals and escaped content; admin mail includes the order", () => {
  for (const locale of ["fr", "en", "de", "it", "es"]) {
    const message = buildCustomerOrderEmail({ ...emailFixture, locale });
    assert.equal(message.to, emailFixture.email);
    assert.ok(message.html.includes('lang="' + locale + '"'));
    assert.ok(message.text.includes("CY-TEST-0001"));
    assert.ok(!message.html.includes("<script>"));
    assert.ok(message.html.includes("&lt;script&gt;"));
    assert.ok(getCheckoutTranslations(locale).submit.button);
  }
  assert.ok(
    buildAdminOrderEmail(emailFixture, "admin@cycloriva.test").text.includes(
      "customer@cycloriva.test",
    ),
  );
});

test("mail transport sends the expected payload and idempotency key through a simulated provider", async (t) => {
  const old = { ...process.env };
  process.env.RESEND_API_KEY = "test-key";
  process.env.CYCLORIVA_MAIL_FROM = "CYCLORIVA <orders@cycloriva.test>";
  process.env.CYCLORIVA_ADMIN_EMAIL = "admin@cycloriva.test";
  const original = global.fetch;
  t.after(() => {
    global.fetch = original;
    for (const key of [
      "RESEND_API_KEY",
      "CYCLORIVA_MAIL_FROM",
      "CYCLORIVA_ADMIN_EMAIL",
    ]) {
      if (old[key] === undefined) delete process.env[key];
      else process.env[key] = old[key];
    }
  });
  let sent = 0;
  global.fetch = async (input, init) => {
    assert.equal(input, "https://api.resend.com/emails");
    const headers = init?.headers as Record<string, string>;
    assert.equal(
      headers["Idempotency-Key"],
      "cycloriva/customer_confirmation/order-test",
    );
    const body = JSON.parse(String(init?.body));
    assert.equal(body.to[0], emailFixture.email);
    assert.ok(body.html && body.text);
    sent++;
    return Response.json({ id: "simulated-provider-id" });
  };
  const result = await sendCustomerOrderEmail(emailFixture);
  assert.equal(result.providerMessageId, "simulated-provider-id");
  assert.equal(sent, 1);
  delete process.env.CYCLORIVA_ADMIN_EMAIL;
  assert.equal(getCheckoutEmailConfiguration().adminConfigured, false);
  await sendCustomerOrderEmail(emailFixture);
  assert.equal(sent, 2);
  process.env.CYCLORIVA_MAIL_FROM = "orders@votre-domaine-verifie.com";
  assert.equal(getCheckoutEmailConfiguration().senderConfigured, false);
  await assert.rejects(sendCustomerOrderEmail(emailFixture), /MAIL_FROM_INVALID/);
  assert.equal(sent, 2);
});
