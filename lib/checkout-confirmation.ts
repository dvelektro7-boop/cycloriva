import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const CONFIRMATION_COOKIE = "cycloriva_checkout_confirmation";
export const CONFIRMATION_MAX_AGE = 60 * 60;
function secret() {
  const value = process.env.CYCLORIVA_ORDER_CONFIRMATION_SECRET;
  if (!value || value.length < 32)
    throw new Error("CHECKOUT_CONFIRMATION_NOT_CONFIGURED");
  return value;
}
export function createConfirmationCookie(orderId: string) {
  const payload = `${orderId}.${Math.floor(Date.now() / 1000) + CONFIRMATION_MAX_AGE}`;
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("hex")}`;
}
export function verifyConfirmationCookie(
  value: string | undefined,
  orderId: string,
) {
  if (!value) return false;
  try {
    const [id, expiry, signature, extra] = value.split(".");
    const expires = Number(expiry);
    const now = Math.floor(Date.now() / 1000);
    if (
      extra ||
      id !== orderId ||
      !/^\d+$/.test(expiry) ||
      !/^[a-f0-9]{64}$/.test(signature) ||
      !Number.isSafeInteger(expires) ||
      expires <= now ||
      expires > now + CONFIRMATION_MAX_AGE
    )
      return false;
    return timingSafeEqual(
      Buffer.from(signature, "hex"),
      createHmac("sha256", secret()).update(`${id}.${expiry}`).digest(),
    );
  } catch {
    return false;
  }
}
