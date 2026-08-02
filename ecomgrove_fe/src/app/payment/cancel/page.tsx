"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaymentCancel() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent_id");

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-mid-night">
      <section className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <XCircle className="h-12 w-12 text-red-600" />
        <div>
          <h1 className="text-3xl font-semibold">Payment Cancelled</h1>
          <p className="mt-2 text-sm text-neutral-gray">
            The payment is not marked as successful. You can retry with the same
            order and a new idempotency key.
          </p>
        </div>

        <div className="border-y py-5 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-neutral-gray">Payment Intent</span>
            <span className="break-all text-right">
              {paymentIntentId || "-"}
            </span>
          </div>
        </div>

        <Button variant="black" className="h-11" asChild>
          <Link href="/checkout">Back to Checkout</Link>
        </Button>
      </section>
    </main>
  );
}
