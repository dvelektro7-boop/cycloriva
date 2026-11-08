import test from "node:test";
import assert from "node:assert/strict";
import { PROMOTION_CYCLE_SECONDS, PROMOTION_CYCLE_START, promotionTimeRemaining } from "./promotion-countdown";

test("78-hour cycle counts down and starts its next cycle at zero", () => {
  assert.deepEqual(promotionTimeRemaining(PROMOTION_CYCLE_START), { days: 3, hours: 6, minutes: 0, seconds: 0 });
  assert.deepEqual(promotionTimeRemaining(PROMOTION_CYCLE_START + 1000), { days: 3, hours: 5, minutes: 59, seconds: 59 });
  assert.deepEqual(promotionTimeRemaining(PROMOTION_CYCLE_START + (PROMOTION_CYCLE_SECONDS - 1) * 1000), { days: 0, hours: 0, minutes: 0, seconds: 1 });
  assert.deepEqual(promotionTimeRemaining(PROMOTION_CYCLE_START + PROMOTION_CYCLE_SECONDS * 1000), { days: 3, hours: 6, minutes: 0, seconds: 0 });
  const now = PROMOTION_CYCLE_START + 12345678;
  assert.deepEqual(promotionTimeRemaining(now), promotionTimeRemaining(now + 2 * PROMOTION_CYCLE_SECONDS * 1000));
});
