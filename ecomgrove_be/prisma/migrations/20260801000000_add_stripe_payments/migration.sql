CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'EXPIRED', 'REFUNDED');
CREATE TYPE "WebhookEventStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'IGNORED', 'FAILED');
CREATE TYPE "ReconciliationResult" AS ENUM ('MATCHED', 'MISSING_PROVIDER', 'STATUS_MISMATCH');

CREATE TABLE "payment_intents" (
  "id" TEXT NOT NULL,
  "order_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "provider" "PaymentProvider" NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "provider_checkout_session_id" TEXT,
  "provider_payment_intent_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "payment_intents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payment_attempts" (
  "id" TEXT NOT NULL,
  "payment_intent_id" TEXT NOT NULL,
  "attempt_no" INTEGER NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "provider_session_id" TEXT,
  "checkout_url" TEXT,
  "failure_reason" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "payment_attempts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "webhook_events" (
  "id" TEXT NOT NULL,
  "provider" "PaymentProvider" NOT NULL,
  "provider_event_id" TEXT NOT NULL,
  "event_type" TEXT NOT NULL,
  "payload_hash" TEXT NOT NULL,
  "status" "WebhookEventStatus" NOT NULL DEFAULT 'RECEIVED',
  "processed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payment_events" (
  "id" TEXT NOT NULL,
  "payment_intent_id" TEXT NOT NULL,
  "event_name" TEXT NOT NULL,
  "from_status" "PaymentStatus",
  "to_status" "PaymentStatus",
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reconciliation_records" (
  "id" TEXT NOT NULL,
  "payment_intent_id" TEXT NOT NULL,
  "provider_reference" TEXT,
  "internal_status" "PaymentStatus" NOT NULL,
  "provider_status" TEXT,
  "result" "ReconciliationResult" NOT NULL,
  "details" JSONB,
  "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "reconciliation_records_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payment_intents_provider_checkout_session_id_key" ON "payment_intents"("provider_checkout_session_id");
CREATE UNIQUE INDEX "payment_intents_provider_payment_intent_id_key" ON "payment_intents"("provider_payment_intent_id");
CREATE UNIQUE INDEX "payment_intents_user_id_idempotency_key_key" ON "payment_intents"("user_id", "idempotency_key");
CREATE INDEX "payment_intents_order_id_status_idx" ON "payment_intents"("order_id", "status");
CREATE UNIQUE INDEX "payment_attempts_provider_session_id_key" ON "payment_attempts"("provider_session_id");
CREATE UNIQUE INDEX "payment_attempts_payment_intent_id_attempt_no_key" ON "payment_attempts"("payment_intent_id", "attempt_no");
CREATE UNIQUE INDEX "webhook_events_provider_event_id_key" ON "webhook_events"("provider_event_id");
CREATE INDEX "payment_events_payment_intent_id_created_at_idx" ON "payment_events"("payment_intent_id", "created_at");
CREATE INDEX "reconciliation_records_payment_intent_id_checked_at_idx" ON "reconciliation_records"("payment_intent_id", "checked_at");

ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_payment_intent_id_fkey" FOREIGN KEY ("payment_intent_id") REFERENCES "payment_intents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_payment_intent_id_fkey" FOREIGN KEY ("payment_intent_id") REFERENCES "payment_intents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reconciliation_records" ADD CONSTRAINT "reconciliation_records_payment_intent_id_fkey" FOREIGN KEY ("payment_intent_id") REFERENCES "payment_intents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
