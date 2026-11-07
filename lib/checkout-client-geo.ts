import { isCheckoutCountry, type CheckoutCountryCode } from "./checkout-countries";

/** IP-based suggestion only; no contact/address data is sent to the provider. */
export async function detectBrowserCheckoutCountry(signal: AbortSignal): Promise<CheckoutCountryCode | null> {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.any([signal, AbortSignal.timeout(4000)]),
      credentials: "omit",
      referrerPolicy: "no-referrer",
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("country_code" in data) || ("error" in data && data.error)) return null;
    const code = typeof data.country_code === "string" ? data.country_code.toUpperCase() : "";
    return isCheckoutCountry(code) ? code : null;
  } catch {
    // Timeouts, blocked lookups and unsupported countries leave manual selection available.
    return null;
  }
}
