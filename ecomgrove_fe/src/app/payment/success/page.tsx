"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  PaymentResponse,
  paymentService,
} from "@/app/services/public/payment.service";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent_id");
  const sessionId = searchParams.get("session_id");
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPayment = useCallback(async () => {
    if (!paymentIntentId) {
      setError("Missing payment_intent_id in redirect URL");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await paymentService.findOne(paymentIntentId);
      setPayment(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to load payment status");
    } finally {
      setIsLoading(false);
    }
  }, [paymentIntentId]);

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  useEffect(() => {
    if (!paymentIntentId || payment?.status === "SUCCEEDED") return;

    const interval = window.setInterval(fetchPayment, 3000);
    return () => window.clearInterval(interval);
  }, [fetchPayment, payment?.status, paymentIntentId]);

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-mid-night">
      <section className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <div>
          <h1 className="text-3xl font-semibold">Stripe Redirect Received</h1>
          <p className="mt-2 text-sm text-neutral-gray">
            The final payment result below is loaded from your backend.
          </p>
        </div>

        <div className="space-y-3 border-y py-5 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-neutral-gray">Payment Intent</span>
            <span className="break-all text-right">
              {paymentIntentId || "-"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-gray">Stripe Session</span>
            <span className="break-all text-right">{sessionId || "-"}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-gray">Backend Status</span>
            <span className="font-semibold">
              {payment?.status || "Loading"}
            </span>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {payment?.status === "PENDING" ? (
          <p className="text-sm text-neutral-gray">
            Webhook may still be processing. This page will refresh the backend
            status automatically.
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="black"
            className="h-11"
            onClick={fetchPayment}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            Refresh Status
          </Button>
          <Button variant="border" className="h-11" asChild>
            <Link href="/checkout">Back to Checkout</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
