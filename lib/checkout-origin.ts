/** Compare against a configured public origin, never untrusted forwarded headers. */
export function isAllowedCheckoutOrigin(
  origin: string | null,
  requestOrigin: string,
  publicUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ivory-turkey-921271.hostingersite.com",
): boolean {
  if (!origin || origin === "null") return false;
  try {
    const parsed = new URL(origin);
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.origin !== origin) return false;
    return origin === requestOrigin || origin === new URL(publicUrl).origin;
  } catch {
    return false;
  }
}
