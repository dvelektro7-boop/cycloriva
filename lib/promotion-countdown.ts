export const PROMOTION_CYCLE_SECONDS = 78 * 60 * 60;
// One shared cycle for every visitor; refreshing does not reset the clock.
export const PROMOTION_CYCLE_START = Date.UTC(2026, 10, 8);

export function promotionTimeRemaining(now: number) {
  const elapsed = Math.max(0, Math.floor((now - PROMOTION_CYCLE_START) / 1000));
  const remaining = PROMOTION_CYCLE_SECONDS - elapsed % PROMOTION_CYCLE_SECONDS;
  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor(remaining % 86400 / 3600),
    minutes: Math.floor(remaining % 3600 / 60),
    seconds: remaining % 60,
  };
}
