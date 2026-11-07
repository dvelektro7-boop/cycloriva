import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  safeValidateCheckout,
  buildValidatedOrderInput,
} from "./checkout-validation";
import { calculateCheckoutPricing } from "./checkout-pricing";
import {
  createCheckoutOrder,
  processCheckoutOrderEmails,
  type CheckoutOrderDatabase,
} from "./checkout-orders";

test(
  "PostgreSQL: atomic creation, idempotency, failed email retry and rollback leave no test order",
  { skip: process.env.CHECKOUT_DATABASE_TESTS !== "1" },
  async () => {
    const db = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 6000,
      }),
    });
    const key = randomUUID();
    const rollback = new Error("TEST_ROLLBACK");
    const originalFetch = global.fetch;
    const previous = {
      from: process.env.CYCLORIVA_MAIL_FROM,
      admin: process.env.CYCLORIVA_ADMIN_EMAIL,
    };
    process.env.CYCLORIVA_MAIL_FROM = "CYCLORIVA <orders@cycloriva.test>";
    process.env.CYCLORIVA_ADMIN_EMAIL = "admin@cycloriva.test";
    let calls = 0;
    const keys: string[] = [];
    global.fetch = async (_url, init) => {
      calls++;
      keys.push((init?.headers as Record<string, string>)["Idempotency-Key"]);
      return calls === 1
        ? Response.json({ error: "simulated" }, { status: 429 })
        : Response.json({ id: "simulated-" + calls });
    };
    try {
      const validated = safeValidateCheckout({
        idempotencyKey: key,
        locale: "es",
        customer: {
          firstName: "Test",
          lastName: "Checkout",
          email: "customer@cycloriva.test",
          phoneCountry: "FR",
          phoneNational: "0612345678",
        },
        delivery: {
          country: "FR",
          city: "Paris",
          postalCode: "75000",
          addressLine1: "12 Test Street",
        },
        items: [{ productId: "826", quantity: 2 }],
        sameBillingAddress: true,
      });
      assert.ok(validated.success);
      const pricing = await calculateCheckoutPricing({
        country: "FR",
        items: validated.data.cartItems,
      });
      const input = { ...buildValidatedOrderInput(validated.data), pricing };
      try {
        await db.$transaction(
          async (tx) => {
            const store = tx as unknown as CheckoutOrderDatabase;
            const first = await createCheckoutOrder(store, input);
            assert.equal(first.created, true);
            assert.equal(first.totalCents, 144330);
            const order = await tx.checkoutOrder.findUniqueOrThrow({
              where: { id: first.orderId },
              include: { items: true, emailNotifications: true },
            });
            assert.equal(order.items.length, 1);
            assert.equal(order.emailNotifications.length, 2);
            assert.equal(order.paymentStatus, "NOT_REQUESTED");
            assert.equal(
              (await createCheckoutOrder(store, input)).created,
              false,
            );
            await assert.rejects(
              createCheckoutOrder(store, {
                ...input,
                customer: { ...input.customer, firstName: "Changed" },
              }),
              /IDEMPOTENCY_CONFLICT/,
            );
            await processCheckoutOrderEmails(store, first.orderId);
            const failed = await tx.checkoutEmailNotification.findFirstOrThrow({
              where: { orderId: first.orderId, type: "CUSTOMER_CONFIRMATION" },
            });
            assert.equal(failed.status, "FAILED");
            assert.ok(failed.nextAttemptAt);
            assert.equal(
              (
                await tx.checkoutOrder.findUniqueOrThrow({
                  where: { id: first.orderId },
                })
              ).status,
              "RECEIVED",
            );
            await tx.checkoutEmailNotification.update({
              where: { id: failed.id },
              data: { nextAttemptAt: new Date(0) },
            });
            await processCheckoutOrderEmails(store, first.orderId);
            await processCheckoutOrderEmails(store, first.orderId);
            assert.equal(calls, 3);
            assert.equal(keys[0], keys[2]);
            assert.equal(
              await tx.checkoutEmailNotification.count({
                where: { orderId: first.orderId, status: "SENT" },
              }),
              2,
            );
            throw rollback;
          },
          { timeout: 30000 },
        );
      } catch (error) {
        if (error !== rollback) throw error;
      }
      assert.equal(
        await db.checkoutOrder.findUnique({ where: { idempotencyKey: key } }),
        null,
      );
    } finally {
      global.fetch = originalFetch;
      if (previous.from === undefined) delete process.env.CYCLORIVA_MAIL_FROM;
      else process.env.CYCLORIVA_MAIL_FROM = previous.from;
      if (previous.admin === undefined)
        delete process.env.CYCLORIVA_ADMIN_EMAIL;
      else process.env.CYCLORIVA_ADMIN_EMAIL = previous.admin;
      await db.$disconnect();
    }
  },
);
