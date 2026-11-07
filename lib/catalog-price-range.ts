export type PriceRangeBounds = { min: number; max: number };

const finite = (value: number | null, fallback: number) =>
  value !== null && Number.isFinite(value) ? value : fallback;
const cents = (value: number) => Math.round(value * 100) / 100;

export function normalizePriceRange(
  bounds: PriceRangeBounds,
  min: number | null,
  max: number | null,
  changed?: "min" | "max"
): PriceRangeBounds {
  const clamp = (value: number) => Math.min(bounds.max, Math.max(bounds.min, cents(value)));
  let lower = clamp(finite(min, bounds.min));
  let upper = clamp(finite(max, bounds.max));
  if (lower > upper) {
    if (changed === "min") lower = upper;
    else if (changed === "max") upper = lower;
    else [lower, upper] = [upper, lower];
  }
  return { min: lower, max: upper };
}
