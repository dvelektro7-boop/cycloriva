import "server-only";
import { createHash } from "node:crypto";

const state = globalThis as unknown as {
  checkoutLimits?: Map<string, { count: number; expires: number }>;
};
const limits = (state.checkoutLimits ??= new Map());
/** Bounded per-instance protection; no raw IP is retained. */
export function allowCheckoutRequest(
  request: Request,
  kind: "quote" | "order" | "address",
) {
  const now = Date.now();
  for (const [key, value] of limits)
    if (value.expires <= now) limits.delete(key);
  const source =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const key = kind + createHash("sha256").update(source).digest("hex");
  const entry = limits.get(key);
  if (entry) {
    entry.count++;
    return (
      entry.count <= (kind === "order" ? 10 : kind === "address" ? 60 : 120)
    );
  }
  if (limits.size >= 5000) return false;
  limits.set(key, { count: 1, expires: now + 60000 });
  return true;
}
