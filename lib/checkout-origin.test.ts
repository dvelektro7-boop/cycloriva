import test from "node:test";
import assert from "node:assert/strict";
import { isAllowedCheckoutOrigin } from "./checkout-origin";

test("checkout accepts its configured public origin behind a reverse proxy", () => {
  const site = 'https://ivory-turkey-921271.hostingersite.com';
  assert.equal(isAllowedCheckoutOrigin(site, 'http://localhost:3000', site), true);
  assert.equal(isAllowedCheckoutOrigin('http://localhost:3100', 'http://localhost:3100', site), true);
  assert.equal(isAllowedCheckoutOrigin('https://shop.example', 'http://internal:3000', 'https://shop.example/fr'), true);
  for (const origin of [null, 'null', 'https://evil.example', site + '.evil.example', site + '/path', 'invalid']) {
    assert.equal(isAllowedCheckoutOrigin(origin, 'http://internal:3000', site), false);
  }
});
