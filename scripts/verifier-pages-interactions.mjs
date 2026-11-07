import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 375, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/fr/gestion-cookies", {
    waitUntil: "networkidle",
  });
  await page
    .getByRole("button", { name: "Tout accepter", exact: true })
    .click();
  let value = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("cycloriva_cookie_consent_v1")),
  );
  assert.deepEqual(value.preferences, {
    necessary: true,
    analytics: true,
    marketing: true,
  });
  await page.reload({ waitUntil: "networkidle" });
  const checks = page.locator('main input[type="checkbox"]');
  assert.equal(await checks.nth(1).isChecked(), true);
  assert.equal(await checks.nth(2).isChecked(), true);
  await page.getByRole("button", { name: "Tout refuser", exact: true }).click();
  value = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("cycloriva_cookie_consent_v1")),
  );
  assert.deepEqual(value.preferences, {
    necessary: true,
    analytics: false,
    marketing: false,
  });
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await checks.nth(1).isChecked(), false);
  assert.equal(await checks.nth(2).isChecked(), false);
  console.log("Cookies : acceptation, refus, persistance OK");
  await page.route("**/api/contact", (route) =>
    route.fulfill({ status: 503, json: { success: false } }),
  );
  await page.goto("http://localhost:3000/fr/contact", {
    waitUntil: "networkidle",
  });
  await page
    .getByRole("button", { name: "Envoyez-nous un message", exact: true })
    .click();
  const form = page.locator("#contact-form form");
  await form.waitFor();
  await form.locator('button[type="submit"]').click();
  assert.ok((await form.getByRole("alert").count()) > 0);
  const name = form.locator('input[name="lastName"]');
  await name.fill("Martin");
  assert.equal(await name.inputValue(), "Martin");
  await name.press("End");
  await name.press("a");
  assert.equal(await name.inputValue(), "Martina");
  console.log("Contact : ouverture mobile, validation, saisie stable OK");
  await context.close();
} finally {
  await browser.close();
}
