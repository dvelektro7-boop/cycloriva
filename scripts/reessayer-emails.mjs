import "dotenv/config";
const secret = process.env.CYCLORIVA_CHECKOUT_JOB_SECRET;
if (!secret) throw new Error("CYCLORIVA_CHECKOUT_JOB_SECRET is required");
const response = await fetch(
  new URL(
    "/api/internal/checkout-emails",
    process.env.CYCLORIVA_SITE_URL || "http://localhost:3000",
  ),
  {
    method: "POST",
    headers: { Authorization: "Bearer " + secret },
    signal: AbortSignal.timeout(180000),
  },
);
if (!response.ok)
  throw new Error("Checkout email retry failed (HTTP " + response.status + ")");
console.log(JSON.stringify(await response.json()));
