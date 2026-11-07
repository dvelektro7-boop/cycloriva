import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const [locale, width] of [
    ["fr", 1440],
    ["en", 1024],
    ["de", 390],
    ["it", 375],
    ["es", 390],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    await context.addInitScript(() =>
      localStorage.setItem(
        "cycloriva-cart-v1",
        JSON.stringify([{ productId: "818", quantity: 1 }]),
      ),
    );
    await context.route("https://ipapi.co/json/", (r) => r.abort());
    let payload;
    let count = 0;
    await context.route("**/api/checkout/address-suggestions", async (r) => {
      payload = r.request().postDataJSON();
      count++;
      await r.fulfill({
        json: {
          suggestions:
            payload.mode === "postal"
              ? [
                  {
                    label: "75004 Paris",
                    addressLine1: "",
                    city: "Paris",
                    postalCode: "75004",
                  },
                ]
              : [
                  {
                    label: "10 Rue de Rivoli, 75004 Paris",
                    addressLine1: "10 Rue de Rivoli",
                    city: "Paris",
                    postalCode: "75004",
                  },
                ],
        },
      });
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://localhost:3000/" + locale + "/commande", {
      waitUntil: "networkidle",
      timeout: 120000,
    });
    await page.locator('select[name="country"]').selectOption("FR");
    const street = page.locator('input[name="addressLine1"]');
    const postal = page.locator('input[name="postalCode"]');
    const city = page.locator('input[name="city"]');
    await postal.fill("75004");
    await page
      .getByRole("option", { name: "75004 Paris", exact: true })
      .click();
    assert.equal(await city.inputValue(), "Paris");
    assert.equal(await street.inputValue(), "");
    await street.fill("10 rue de ri");
    await page
      .getByRole("option", {
        name: "10 Rue de Rivoli, 75004 Paris",
        exact: true,
      })
      .waitFor();
    assert.equal(payload.country, "FR");
    assert.match(payload.query, /75004/);
    await page.screenshot({
      path: ".image-work/checkout/address-suggestions-" + locale + ".png",
      fullPage: true,
    });
    await street.press("ArrowDown");
    await street.press("Enter");
    assert.equal(await street.inputValue(), "10 Rue de Rivoli");
    assert.equal(await postal.inputValue(), "75004");
    await street.fill("Adresse manuelle 17");
    await street.press("Escape");
    await city.fill("Paris");
    assert.equal(await street.inputValue(), "Adresse manuelle 17");
    await street.fill("1");
    await page.waitForTimeout(700);
    const before = count;
    await street.fill("12");
    await page.waitForTimeout(700);
    assert.equal(count, before, "no lookup for <3 chars");
    await street.fill("Adresse libre");
    await page
      .getByRole("option", {
        name: "10 Rue de Rivoli, 75004 Paris",
        exact: true,
      })
      .waitFor();
    await page.locator('select[name="country"]').selectOption("DE");
    assert.equal(
      await page
        .getByRole("option", {
          name: "10 Rue de Rivoli, 75004 Paris",
          exact: true,
        })
        .count(),
      0,
      "old country results hidden",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      locale + " " + width + "px : suggestions, clavier, saisie manuelle OK",
    );
  }
  const context = await browser.newContext();
  await context.addInitScript(() =>
    localStorage.setItem(
      "cycloriva-cart-v1",
      JSON.stringify([{ productId: "818", quantity: 1 }]),
    ),
  );
  await context.route("https://ipapi.co/json/", (r) => r.abort());
  await context.route("**/api/checkout/address-suggestions", (r) =>
    r.fulfill({ status: 503, json: { suggestions: [] } }),
  );
  const page = await context.newPage();
  await page.goto("http://localhost:3000/fr/commande", {
    waitUntil: "networkidle",
  });
  await page.locator('select[name="country"]').selectOption("FR");
  await page
    .locator('input[name="addressLine1"]')
    .fill("27 adresse personnelle");
  await page
    .getByText("Suggestions indisponibles. Continuez la saisie manuelle.")
    .waitFor();
  assert.equal(
    await page.locator('input[name="addressLine1"]').inputValue(),
    "27 adresse personnelle",
  );
  await context.close();
  console.log("Panne fournisseur : saisie préservée OK");
} finally {
  await browser.close();
}
