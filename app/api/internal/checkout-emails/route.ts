import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processCheckoutOrderEmails } from "@/lib/checkout-orders";

/** Protected scheduler endpoint. Only counts are returned; no customer data. */
export async function POST(request: NextRequest) {
  const secret = process.env.CYCLORIVA_CHECKOUT_JOB_SECRET;
  const provided =
    request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  if (
    !secret ||
    secret.length < 32 ||
    Buffer.byteLength(secret) !== Buffer.byteLength(provided) ||
    !timingSafeEqual(Buffer.from(secret), Buffer.from(provided))
  )
    return NextResponse.json({ success: false }, { status: 403 });
  try {
    const now = new Date();
    const notifications = await prisma.checkoutEmailNotification.findMany({
      where: {
        attempts: { lt: 5 },
        OR: [
          {
            status: { in: ["PENDING", "FAILED"] },
            OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }],
          },
          {
            status: "PROCESSING",
            updatedAt: { lt: new Date(Date.now() - 5 * 60 * 1000) },
          },
        ],
      },
      distinct: ["orderId"],
      select: { orderId: true },
      take: 10,
      orderBy: { createdAt: "asc" },
    });
    let processed = 0;
    for (const { orderId } of notifications) {
      await processCheckoutOrderEmails(prisma, orderId);
      processed++;
    }
    return NextResponse.json(
      { success: true, processed },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ success: false }, { status: 503 });
  }
}
