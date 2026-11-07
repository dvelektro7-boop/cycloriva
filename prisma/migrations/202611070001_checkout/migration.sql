-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CheckoutCountry" AS ENUM ('DE', 'FR', 'ES', 'IT', 'CH', 'AT', 'NL', 'BE');

-- CreateEnum
CREATE TYPE "CheckoutOrderStatus" AS ENUM ('RECEIVED', 'PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "CheckoutPaymentStatus" AS ENUM ('NOT_REQUESTED', 'PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "CheckoutEmailType" AS ENUM ('CUSTOMER_CONFIRMATION', 'ADMIN_NOTIFICATION');

-- CreateEnum
CREATE TYPE "CheckoutEmailStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "CheckoutOrder" (
    "id" TEXT NOT NULL,
    "orderNumber" VARCHAR(64) NOT NULL,
    "idempotencyKey" VARCHAR(128) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phoneDialCode" VARCHAR(8) NOT NULL,
    "phoneNational" VARCHAR(40) NOT NULL,
    "phoneE164" VARCHAR(20) NOT NULL,
    "country" "CheckoutCountry" NOT NULL,
    "city" VARCHAR(150) NOT NULL,
    "postalCode" VARCHAR(32) NOT NULL,
    "addressLine1" VARCHAR(255) NOT NULL,
    "addressLine2" VARCHAR(255),
    "locale" VARCHAR(5) NOT NULL DEFAULT 'fr',
    "detectedCountry" "CheckoutCountry",
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "subtotalCents" INTEGER NOT NULL,
    "shippingCents" INTEGER NOT NULL,
    "taxCents" INTEGER,
    "totalCents" INTEGER NOT NULL,
    "status" "CheckoutOrderStatus" NOT NULL DEFAULT 'RECEIVED',
    "paymentStatus" "CheckoutPaymentStatus" NOT NULL DEFAULT 'NOT_REQUESTED',
    "confirmedAt" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "paymentReference" VARCHAR(191),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckoutOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" VARCHAR(191) NOT NULL,
    "sku" VARCHAR(191),
    "productName" VARCHAR(500) NOT NULL,
    "productImage" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,
    "lineTotalCents" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckoutOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutEmailNotification" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" "CheckoutEmailType" NOT NULL,
    "recipientEmail" VARCHAR(254) NOT NULL,
    "locale" VARCHAR(5) NOT NULL DEFAULT 'fr',
    "status" "CheckoutEmailStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3),
    "lastError" TEXT,
    "providerMessageId" VARCHAR(191),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckoutEmailNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutOrder_orderNumber_key" ON "CheckoutOrder"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutOrder_idempotencyKey_key" ON "CheckoutOrder"("idempotencyKey");

-- CreateIndex
CREATE INDEX "CheckoutOrder_email_idx" ON "CheckoutOrder"("email");

-- CreateIndex
CREATE INDEX "CheckoutOrder_country_idx" ON "CheckoutOrder"("country");

-- CreateIndex
CREATE INDEX "CheckoutOrder_status_createdAt_idx" ON "CheckoutOrder"("status", "createdAt");

-- CreateIndex
CREATE INDEX "CheckoutOrder_paymentStatus_createdAt_idx" ON "CheckoutOrder"("paymentStatus", "createdAt");

-- CreateIndex
CREATE INDEX "CheckoutOrder_createdAt_idx" ON "CheckoutOrder"("createdAt");

-- CreateIndex
CREATE INDEX "CheckoutOrderItem_orderId_idx" ON "CheckoutOrderItem"("orderId");

-- CreateIndex
CREATE INDEX "CheckoutOrderItem_productId_idx" ON "CheckoutOrderItem"("productId");

-- CreateIndex
CREATE INDEX "CheckoutEmailNotification_status_nextAttemptAt_idx" ON "CheckoutEmailNotification"("status", "nextAttemptAt");

-- CreateIndex
CREATE INDEX "CheckoutEmailNotification_createdAt_idx" ON "CheckoutEmailNotification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutEmailNotification_orderId_type_key" ON "CheckoutEmailNotification"("orderId", "type");

-- AddForeignKey
ALTER TABLE "CheckoutOrderItem" ADD CONSTRAINT "CheckoutOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CheckoutOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutEmailNotification" ADD CONSTRAINT "CheckoutEmailNotification_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CheckoutOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
