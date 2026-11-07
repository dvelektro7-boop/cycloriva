import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const routes = [
  "contact",
  "a-propos",
  "conseils-guides",
  "service-client",
  "livraison",
  "retours-remboursements",
  "faq",
  "garantie",
  "paiements-securises",
  "suivi-commande",
  "politique-confidentialite",
  "conditions-generales-vente",
  "gestion-cookies",
  "mentions-legales",
];
const browser = await chromium.launch({ channel: "chrome", headless: true });
await fs.mkdir(".image-work/information", { recursive: true });
try {
  for (const width of [1440, 1024, 390, 375]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    const page = await context.newPage();
    for (const route of routes) {
      const errors = [];
      const listener = (e) => errors.push(e.message);
      page.on("pageerror", listener);
      const response = await page.goto("http://localhost:3000/fr/" + route, {
        waitUntil: "networkidle",
        timeout: 120000,
      });
      assert.equal(response.status(), 200, route);
      const main = page.locator("main.info-page");
      await main.waitFor();
      assert.equal(await main.count(), 1, route + " one main");
      const bounds = await main.boundingBox();
      assert.ok(bounds.width >= width - 2, route + " full width");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      assert.equal(overflow, false, route + " overflow " + width);
      assert.ok(
        (await main.innerText()).trim().length > 100,
        route + " content",
      );
      assert.deepEqual(errors, [], route + " runtime");
      if (route === "faq") {
        const first = main.locator("details").first();
        await first.locator("summary").click();
        assert.equal(await first.getAttribute("open"), null);
        await first.locator("summary").click();
        assert.notEqual(await first.getAttribute("open"), null);
      }
      if (width === 1440 || width === 375)
        await page.screenshot({
          path: ".image-work/information/" + route + "-" + width + ".png",
          fullPage: true,
        });
      page.off("pageerror", listener);
      console.log(width + "px " + route + " OK");
    }
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const locale of ["en", "de", "it", "es"]) {
    for (const route of routes) {
      const response = await page.goto(
        "http://localhost:3000/" + locale + "/" + route,
        { waitUntil: "networkidle", timeout: 120000 },
      );
      assert.equal(response.status(), 200, locale + "/" + route);
      await page.locator("main.info-page").waitFor();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        locale + "/" + route,
      );
    }
    console.log(locale + " : 14 pages OK");
  }
  await context.close();
} finally {
  await browser.close();
}
