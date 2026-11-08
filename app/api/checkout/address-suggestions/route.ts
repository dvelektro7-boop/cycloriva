import { isAllowedCheckoutOrigin } from "@/lib/checkout-origin";
﻿import { NextRequest, NextResponse } from "next/server";
import { isCheckoutCountry } from "@/lib/checkout-countries";
import { parsePhotonSuggestions } from "@/lib/checkout-address-suggestions";
import { allowCheckoutRequest } from "@/lib/checkout-rate-limit";

const reply = (body: object, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: NextRequest) {
  if (!isAllowedCheckoutOrigin(request.headers.get("origin"), request.nextUrl.origin))
    return reply({ suggestions: [] }, 403);
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json")
    return reply({ suggestions: [] }, 415);
  if (!allowCheckoutRequest(request, "address"))
    return reply({ suggestions: [] }, 429);
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ suggestions: [] }, 400);
    let bodyText = "";
    let bytes = 0;
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 2048) {
          await reader.cancel();
          return reply({ suggestions: [] }, 413);
        }
        bodyText += decoder.decode(value, { stream: true });
      }
      bodyText += decoder.decode();
    } finally {
      reader.releaseLock();
    }
    let body: unknown;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return reply({ suggestions: [] }, 400);
    }
    if (
      !body ||
      typeof body !== "object" ||
      !("country" in body) ||
      !isCheckoutCountry(body.country) ||
      !("query" in body) ||
      typeof body.query !== "string" ||
      !("mode" in body) ||
      !["street", "postal"].includes(String(body.mode))
    )
      return reply({ suggestions: [] }, 422);
    const query = body.query.trim();
    if (query.length < 3 || query.length > 255 || /[\u0000-\u001f]/.test(query))
      return reply({ suggestions: [] }, 422);
    const locale =
      "locale" in body &&
      ["fr", "en", "de", "it", "es"].includes(String(body.locale))
        ? String(body.locale)
        : "en";
    const url = new URL("https://photon.komoot.io/api/");
    url.search = new URLSearchParams({
      q: query,
      countrycode: body.country,
      limit: "8",
    }).toString();
    // The public instance supports en/de/fr; otherwise keep the local address names.
    if (["fr", "en", "de"].includes(locale))
      url.searchParams.set("lang", locale);
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(4000)]),
      headers: {
        Accept: "application/json",
        "User-Agent": "CYCLORIVA checkout address suggestions",
      },
    });
    if (!response.ok) return reply({ suggestions: [] }, 503);
    return reply({
      suggestions: parsePhotonSuggestions(
        await response.json(),
        body.country,
        body.mode === "postal" ? query : "",
      ),
    });
  } catch {
    return reply({ suggestions: [] }, 503);
  }
}
