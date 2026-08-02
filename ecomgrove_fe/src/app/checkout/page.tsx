"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { paymentService } from "@/app/services/public/payment.service";
import { useAuthStore } from "@/app/store/auth/useAuthStore";
import { useCartStore } from "@/app/store/cart/useCartStore";
import { orderService } from "@/app/services/public/order.service";
import { IOrder } from "@/app/types/orders/order.interface";

function createIdempotencyKey(orderId: string) {
  const safeOrderId = orderId.trim().replace(/[^A-Za-z0-9_-]/g, "_");
  return `idem_${safeOrderId}_stripe_checkout`;
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function Checkout() {
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [pendingOrder, setPendingOrder] = useState<IOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const cart = useCartStore((s) => s.cart);
  const cartLoading = useCartStore((s) => s.loading);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const cartTotal = useCartStore((s) => s.getTotalPrice());

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [fetchCart, isAuthenticated]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingOrder && cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const order =
        pendingOrder ??
        (
          await orderService.create({
            note: note.trim() || undefined,
            address: address.trim() || undefined,
          })
        ).data;

      setPendingOrder(order);

      if (!pendingOrder) {
        useCartStore.setState({ cart: [] });
      }

      const response = await paymentService.create(
        order.id,
        createIdempotencyKey(order.id),
      );
      const payment = response.data;

      if (payment.checkoutUrl) {
        window.location.assign(payment.checkoutUrl);
        return;
      }

      toast.error(`Payment is ${payment.status}, but no checkout URL returned`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Unable to start Stripe Checkout",
      );
      if (!pendingOrder) {
        fetchCart();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-mid-night">
      <section className="mx-auto flex w-full max-w-xl flex-col gap-8">
        <div>
          <h1 className="text-3xl font-semibold">Checkout</h1>
          <p className="mt-2 text-sm text-neutral-gray">
            Review your cart, create an order, then continue to Stripe.
          </p>
        </div>

        <div className="space-y-4 border-y py-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Order Summary</h2>
            {cartLoading ? <Loader2 className="animate-spin" /> : null}
          </div>

          {pendingOrder ? (
            <div className="text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-neutral-gray">Order ID</span>
                <span className="break-all text-right font-medium">
                  {pendingOrder.id}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-neutral-gray">Total</span>
                <span className="font-semibold">
                  {formatUsd(pendingOrder.total)}
                </span>
              </div>
            </div>
          ) : cart.length > 0 ? (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.cartItemId || item.id}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-neutral-gray">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    {formatUsd(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between border-t pt-3 font-semibold">
                <span>Total</span>
                <span>{formatUsd(cartTotal)}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-neutral-gray">
              <ShoppingBag />
              Your cart is empty.
            </div>
          )}
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Input
            id="checkout-address"
            label="Shipping Address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            autoComplete="off"
            disabled={Boolean(pendingOrder)}
          />

          <Input
            id="checkout-note"
            label="Order Note"
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            autoComplete="off"
            disabled={Boolean(pendingOrder)}
          />

          {!isAuthenticated && (
            <p className="text-sm text-red-600">
              You must be logged in before creating a payment.
            </p>
          )}

          <Button
            type="submit"
            variant="black"
            className="h-12"
            disabled={
              isSubmitting ||
              !isAuthenticated ||
              (!pendingOrder && cart.length === 0)
            }
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            {pendingOrder ? "Continue to Stripe" : "Create Order and Pay"}
          </Button>
        </form>

        <div className="border-t pt-5 text-sm text-neutral-gray">
          Stripe test card: 4242 4242 4242 4242, any future expiry, any CVC.
        </div>
      </section>
    </main>
  );
}
