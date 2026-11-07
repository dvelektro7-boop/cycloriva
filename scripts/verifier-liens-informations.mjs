import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const slugs = [
  "a-propos",
  "conseils-guides",
  "service-client",
  "livraison",
  "retours-remboursements",
  "faq",
  "garantie",
  "paiements-securises",
  "suivi-commande",
  "contact",
  "mentions-legales",
  "politique-confidentialite",
  "conditions-generales-vente",
  "gestion-cookies",
];
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const width of [1440, 375]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const locale of ["fr", "en", "de", "it", "es"]) {
      await page.goto("http://localhost:3000/" + locale, {
        waitUntil: "networkidle",
        timeout: 120000,
      });
      const footer = page.locator("footer").last();
      await footer.waitFor();
      for (const slug of slugs) {
        const href = "/" + locale + "/" + slug;
        const link = footer.locator('a[href="' + href + '"]');
        assert.equal(await link.count(), 1, href + " linked exactly once");
        assert.equal(await link.isVisible(), true, href + " visible");
        assert.ok((await link.innerText()).trim().length > 0);
        if (width === 1440) {
          const response = await context.request.get(
            "http://localhost:3000" + href,
          );
          assert.equal(response.status(), 200, href + " available");
        }
      }
      const serviceLinks = page.locator(
        'main a[href="/' + locale + '/livraison"]',
      );
      assert.ok((await serviceLinks.count()) > 0, "home service route");
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await footer.locator('a[href="/' + locale + '/gestion-cookies"]').click();
      await page.waitForURL("**/" + locale + "/gestion-cookies");
      await page.locator('main[data-page="cookie-management"]').waitFor();
      console.log(
        width + "px " + locale + " : 14 liens footer et navigation OK",
      );
    }
    await page.goto("http://localhost:3000/fr/produits/826", {
      waitUntil: "networkidle",
    });
    const strip = page.locator('[data-component="product-service-strip"]');
    for (const slug of [
      "livraison",
      "paiements-securises",
      "retours-remboursements",
      "service-client",
    ])
      assert.equal(
        await strip.locator('a[href="/fr/' + slug + '"]').count(),
        1,
      );
    await strip.locator('a[href="/fr/livraison"]').click();
    await page.waitForURL("**/fr/livraison");
    console.log(width + "px : navigation services produit OK");
    assert.deepEqual(errors, []);
    await context.close();
  }
} finally {
  await browser.close();
}
