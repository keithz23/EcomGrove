import { X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function Cart({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Cart header*/}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-lg p-5 flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <div>
            <X
              onClick={onClose}
              size={25}
              className="hover:rotate-90 transition-transform duration-500 ease-in-out cursor-pointer"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-1"></div>

        {/* Cart body & Cart footer */}
        <div className="flex flex-col h-full py-5">
          {/* Scrollable Cart Items */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index}>
                <div className="flex items-center gap-x-3">
                  <div>
                    <Image
                      className="w-16 h-16 object-cover border p-1"
                      src="https://spotify-clone-uploads.s3.ap-southeast-2.amazonaws.com/product/2a4a674e-ae70-450d-aae6-b84e146faa3d.jpg"
                      alt="Cart thumb"
                      width={64}
                      height={64}
                    />
                  </div>

                  {/* Cart Description */}
                  <div className="flex-1 cursor-pointer">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-mid-night hover:text-electric-blue transition-all duration-300">
                        Tea Tree Lemon For Fine Hair
                      </h3>
                      <X
                        size={25}
                        className="text-neutral-gray hover:text-electric-blue transition-all duration-300 ease-in-out cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-electric-blue font-semibold">
                        $100
                      </span>
                      <span className="ml-1 text-sm">x 1</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t my-3" />
              </div>
            ))}
          </div>

          {/* Footer fixed below */}
          <div className="border-t py-10 flex flex-col gap-3">
            <div className="flex justify-between font-semibold text-mid-night">
              <span>Subtotal:</span>
              <span>$100</span>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant={"black"} className="py-6">
                View Cart
              </Button>
              <Button variant={"border"} className="py-6">
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
