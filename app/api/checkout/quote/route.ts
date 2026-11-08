import { isAllowedCheckoutOrigin } from "@/lib/checkout-origin";
import { allowCheckoutRequest } from "@/lib/checkout-rate-limit";
import { isSiteLocale } from "@/lib/site-i18n";
import { NextRequest, NextResponse } from "next/server";
import {
  calculateCheckoutPricing,
  CheckoutPricingError,
} from "@/lib/checkout-pricing";
import {
  checkoutCartSchema,
  checkoutCountrySchema,
} from "@/lib/checkout-validation";

export async function POST(request: NextRequest) {
  if (!isAllowedCheckoutOrigin(request.headers.get("origin"), request.nextUrl.origin))
    return NextResponse.json(
      { success: false, code: "FORBIDDEN_ORIGIN" },
      { status: 403 },
    );
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json")
    return NextResponse.json(
      { success: false, code: "UNSUPPORTED_CONTENT_TYPE" },
      { status: 415 },
    );
  if (!allowCheckoutRequest(request, "quote"))
    return NextResponse.json(
      { success: false, code: "TOO_MANY_REQUESTS" },
      { status: 429 },
    );
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("EMPTY");
    let text = "";
    let bytes = 0;
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 65536) {
          await reader.cancel();
          return NextResponse.json(
            { success: false, code: "REQUEST_TOO_LARGE" },
            { status: 413 },
          );
        }
        text += decoder.decode(value, { stream: true });
      }
      text += decoder.decode();
    } finally {
      reader.releaseLock();
    }
    const body = JSON.parse(text);
    const country = checkoutCountrySchema.safeParse(body?.country);
    const items = checkoutCartSchema.safeParse(body?.items);
    if (!country.success || !items.success)
      return NextResponse.json(
        { success: false, code: "CHECKOUT_VALIDATION_FAILED" },
        { status: 422 },
      );
    const pricing = await calculateCheckoutPricing({
      locale: isSiteLocale(body?.locale) ? body.locale : "fr",
      country: country.data,
      items: items.data,
    });
    return NextResponse.json(
      { success: true, pricing },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof CheckoutPricingError)
      return NextResponse.json(
        { success: false, code: error.code },
        { status: error.code === "SHIPPING_NOT_CONFIGURED" ? 503 : 422 },
      );
    return NextResponse.json(
      { success: false, code: "CHECKOUT_VALIDATION_FAILED" },
      { status: 400 },
    );
  }
}
