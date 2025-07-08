"use client";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useCartStore } from "@/app/store/cart/useCartStore";
import { useGuestCartStore } from "@/app/store/cart/useGuestCartStore";
import { useAuthStore } from "@/app/store/auth/useAuthStore";
import { useRouter } from "next/navigation";

export default function Cart({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const cartData = useCartStore((s) => s.cart);
  const guestCartData = useGuestCartStore((s) => s.cart);
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const total = isAuthenticated
    ? useCartStore((s) => s.getTotalPrice())
    : useGuestCartStore((s) =>
        s.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      );

  const removeGuestItem = useGuestCartStore((s) => s.removeFromCart);
  const removeItem = useCartStore((s) => s.removeFromCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [fetchCart]);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Cart drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-lg p-5 flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <X
            onClick={onClose}
            size={25}
            className="hover:rotate-90 transition-transform duration-500 ease-in-out cursor-pointer"
          />
        </div>

        <div className="border-t"></div>

        {/* Cart body */}
        <div className="flex flex-col h-full py-5">
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {(!isAuthenticated && guestCartData?.length === 0) ||
            (isAuthenticated && cartData?.length === 0) ? (
              <p className="text-sm text-gray-500 text-center mt-10">
                Your cart is empty.
              </p>
            ) : (
              (isAuthenticated ? cartData : guestCartData).map((item) => (
                <div key={item.id}>
                  <div className="flex items-center gap-x-3">
                    <Image
                      className="w-16 h-16 object-cover border p-1"
                      src={item.image}
                      alt="Cart thumb"
                      width={64}
                      height={64}
                    />
                    <div className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-mid-night hover:text-electric-blue transition-all duration-300">
                          {item.name}
                        </h3>
                        <X
                          size={20}
                          className="text-neutral-gray hover:text-electric-blue cursor-pointer"
                          onClick={() =>
                            isAuthenticated
                              ? removeItem(item.id)
                              : removeGuestItem(item.id)
                          }
                        />
                      </div>
                      <div>
                        <span className="text-electric-blue font-semibold">
                          ${item.price}
                        </span>
                        <span className="ml-1 text-sm">x {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t my-3" />
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t py-10 flex flex-col gap-3">
            <div className="flex justify-between font-semibold text-mid-night">
              <span>Subtotal:</span>
              <div>{Number.isFinite(total) ? total.toFixed(2) : "0.00"}</div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="black"
                className="py-6"
                onClick={() => {
                  onClose();
                  router.push("/cart");
                }}
              >
                View Cart
              </Button>
              <Button
                variant="border"
                className="py-6"
                onClick={() => {
                  onClose();
                  router.push("/checkout");
                }}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
