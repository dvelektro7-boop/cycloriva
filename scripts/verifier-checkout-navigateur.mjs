import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const base = process.env.CHECKOUT_TEST_URL || "http://localhost:3000";
const browser = await chromium.launch({
  channel: process.env.CHECKOUT_BROWSER_CHANNEL || "chrome",
  headless: true,
});
await fs.mkdir(".image-work/checkout", { recursive: true });
try {
  for (const width of [1440, 1024, 390, 375]) {
    const context = await browser.newContext({
      viewport: { width, height: width > 1000 ? 1080 : 844 },
    });
    await context.addInitScript(() =>
      localStorage.setItem(
        "cycloriva-cart-v1",
        JSON.stringify([
          { productId: "826", quantity: 2 },
          { productId: "818", quantity: 1 },
        ]),
      ),
    );
    await context.route("https://ipapi.co/json/", route => route.abort());
    const page = await context.newPage();
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));
    await page.goto(base + "/fr/commande", {
      waitUntil: "networkidle",
      timeout: 120000,
    });
    await page.locator('[name="firstName"]').waitFor({ state: "visible" });
    assert.equal(await page.locator('[name="firstName"]').isEnabled(), true);
    await page.locator('select[name="country"]').selectOption("FR");
    await page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/checkout/quote") &&
        response.status() === 200,
    );
    await page
      .locator('[data-component="checkout-order-summary"]')
      .getByText("2 377,45")
      .first()
      .waitFor({ state: "visible" });
    await page.locator('[name="firstName"]').fill("Alice");
    await page.locator('[name="lastName"]').fill("Martin");
    await page.locator('[name="email"]').fill("customer@cycloriva.test");
    await page.locator('select[name="phoneCountry"]').selectOption("FR");
    await page.locator('[name="phoneNational"]').fill("0612345678");
    await page.locator('[name="city"]').fill("Paris");
    await page.locator('[name="addressLine1"]').fill("12 Test Street");
    await page.locator('[name="postalCode"]').fill("75000");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    assert.equal(overflow, false, "horizontal overflow at " + width);
    const summary = await page
      .locator('[data-component="checkout-order-summary"]')
      .boundingBox();
    const first = await page.locator('[name="firstName"]').boundingBox();
    assert.ok(summary && first);
    if (width >= 1024)
      assert.ok(summary.x > first.x, "summary stays to the right on desktop");
    else assert.ok(summary.y > first.y, "summary follows form on mobile");
    assert.deepEqual(failures, [], "browser runtime errors at " + width);
    const footer = page.locator('[data-component="site-main-footer"]');
    assert.equal(
      await footer.isVisible(),
      false,
      "footer matches the checkout layout",
    );
    await page.screenshot({
      path: ".image-work/checkout/checkout-" + width + ".png",
      fullPage: true,
    });
    const orderSummary = page.locator(
      '[data-component="checkout-order-summary"]',
    );
    if (width < 1024)
      await orderSummary.locator("button[aria-expanded]").click();
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().endsWith("/api/checkout/quote") &&
          response.status() === 200,
      ),
      orderSummary
        .getByRole("button", { name: /Augmenter/ })
        .first()
        .click(),
    ]);
    await orderSummary
      .getByText("3 099,10")
      .first()
      .waitFor({ state: "visible" });
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().endsWith("/api/checkout/quote") &&
          response.status() === 200,
      ),
      orderSummary
        .getByRole("button", { name: /Diminuer/ })
        .first()
        .click(),
    ]);
    await orderSummary
      .getByText("2 377,45")
      .first()
      .waitFor({ state: "visible" });
    // The submission is intercepted: no real order or email is created.
    let submissions = 0;
    await page.route("**/api/checkout", async (route) => {
      const payload = route.request().postDataJSON();
      assert.equal(payload.expectedTotalCents, 237745);
      assert.equal(payload.customer.phoneCountry, "FR");
      assert.equal(payload.customer.phoneNational, "0612345678");
      submissions++;
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ success: false, code: "SERVER_ERROR" }),
      });
    });
    await page
      .locator('#cycloriva-checkout-form button[type="submit"]:visible')
      .click();
    await page
      .locator('#cycloriva-checkout-form [role="alert"]')
      .first()
      .waitFor({ state: "visible" });
    assert.equal(submissions, 1);
    assert.equal(
      await page
        .locator('#cycloriva-checkout-form button[type="submit"]:visible')
        .isEnabled(),
      true,
    );
    assert.ok(
      await page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("cycloriva:cart:v1")).items.length ===
          2,
      ),
      "failed submission retains the basket",
    );
    console.log(
      "PASS checkout",
      width,
      "px: form, shared basket, server quote, layout and runtime",
    );
    await context.close();
  }
  for (const [locale,label] of [['fr','Prénom'],['en','First name'],['de','Vorname'],['it','Nome'],['es','Nombre']]) {
    const context=await browser.newContext({viewport:{width:375,height:844}});
    await context.addInitScript(()=>localStorage.setItem('cycloriva-cart-v1',JSON.stringify([{productId:'826',quantity:1}])));
    const page=await context.newPage();await page.goto(base+'/'+locale+'/commande',{waitUntil:'networkidle',timeout:120000});
    const actualLabel=await page.locator('[name="firstName"]').evaluate(input=>input.labels[0].innerText);
    assert.ok(actualLabel.includes(label),'localized customer form: '+locale);
    await page.locator('select[name="phoneCountry"]').selectOption('DE');
    await page.locator('select[name="country"]').selectOption('IT');
    assert.equal(await page.locator('select[name="phoneCountry"]').inputValue(),'DE','phone code stays independent');
    console.log('PASS checkout interface and independent phone country',locale);
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();await page.goto(base+'/es/produits/826',{waitUntil:'networkidle',timeout:120000});
  await page.locator('[data-component="product-order-actions"] input[type="number"]').fill('2');
  await page.locator('[data-component="product-order-actions"]').getByRole('button',{name:/Pedir en el sitio web/}).click();
  await page.waitForURL('**/es/commande');
  await page.locator('[name="firstName"]').waitFor({state:'visible'});
  assert.equal(await page.locator('[name="firstName"]').isEnabled(),true);
  assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('cycloriva:cart:v1')).items.some(item=>item.productId==='826' && item.quantity===2)));
  console.log('PASS real product button -> shared basket -> checkout');
  await context.close();
} finally {
  await browser.close();
}
