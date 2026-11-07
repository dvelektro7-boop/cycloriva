-- Personal order data is accessed only through the server database connection.
ALTER TABLE "CheckoutOrder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CheckoutOrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CheckoutEmailNotification" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "CheckoutOrder" ADD CONSTRAINT "checkout_order_amounts_valid"
CHECK ("subtotalCents" >= 0 AND "shippingCents" >= 0 AND "totalCents"::bigint = "subtotalCents"::bigint + "shippingCents"::bigint AND "currency" = 'EUR');
ALTER TABLE "CheckoutOrderItem" ADD CONSTRAINT "checkout_line_amounts_valid"
CHECK ("quantity" BETWEEN 1 AND 99 AND "unitPriceCents" > 0 AND "lineTotalCents"::bigint = "quantity"::bigint * "unitPriceCents"::bigint AND "currency" = 'EUR');
