import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ordersService } from "../../services/order";
import { DeliveryItems, PaymentItems } from "../../utils/checkout";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import useCartData from "../../hooks/useCartData";
import BackToHome from "../common/BackToHome";

export default function Checkout() {
  const { cart } = useCartData();

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedPayment, setSelectedPayment] = useState("");

  useEffect(() => {
    if (cart.length > 0) {
      const initialQuantities: { [key: string]: number } = {};
      cart.forEach((item) => {
        initialQuantities[Number(item.cart.id)] = item.cart.quantity || 1;
      });
      setQuantities(initialQuantities);
    }
  }, [cart]);

  const handleInputChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= 50) {
      setQuantities((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleQuantityChange = (
    id: string,
    action: "increase" | "decrease"
  ) => {
    setQuantities((prev) => {
      if (prev[id] === undefined) return prev;
      const newQuantity =
        action === "increase"
          ? Math.min(prev[id] + 1)
          : Math.max(prev[id] - 1, 1);
      return { ...prev, [id]: newQuantity };
    });
  };
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    environment: "sandbox" as "sandbox",
    currency: "USD",
    intent: "capture",
  };

  const handleApprove = async (orderId: string) => {
    try {
      const response = await ordersService.createOrders();

      if (response && response.data?.message) {
        toast.success(response.data.message);
      }
      console.log(`Approve id:: ${orderId}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        toast.error(errorMessage);
        console.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred");
        console.error(error);
      }
    }
  };

  return (
    <>
      <BackToHome textColor="text-black" backTo="cart-details" />
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-10">
            {/* Delivery Info */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Delivery Information
              </h2>
              {DeliveryItems.map((row) => (
                <div
                  key={row.id}
                  className={`grid gap-4 mb-4 ${
                    row.inputs.length === 3
                      ? "grid-cols-1 md:grid-cols-3"
                      : row.inputs.length === 2
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  {row.inputs.map((input) => (
                    <div key={input.id} className="flex flex-col gap-1">
                      <label
                        htmlFor={input.id}
                        className="text-sm font-medium text-gray-700"
                      >
                        {input.label}
                      </label>
                      <input
                        type={input.type}
                        name={input.name}
                        id={input.id}
                        placeholder={input.placeHolder}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </section>

            {/* Payment Method */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PaymentItems.map((pi, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition border ${
                      selectedPayment === pi.inputs.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 hover:border-indigo-500"
                    }`}
                  >
                    <input
                      type={pi.inputs.type}
                      name={pi.inputs.name}
                      value={pi.inputs.value}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="h-5 w-5 text-indigo-600"
                    />
                    <span className="text-sm text-gray-800">
                      {pi.inputs.label}
                    </span>
                  </label>
                ))}
              </div>

              {selectedPayment === "online" && (
                <div className="mt-6">
                  <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                      style={{ layout: "vertical", shape: "rect" }}
                      createOrder={(_, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: {
                                currency_code: "USD",
                                value: "0.1",
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          handleApprove(data.orderID);
                          console.log(
                            "Transaction completed by:",
                            details.payer?.name?.given_name ?? "Unknown"
                          );
                        });
                      }}
                      onError={(err) => console.error("PayPal error:", err)}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {selectedPayment === "code" && (
                <p className="mt-6 text-sm text-gray-600">
                  You will pay in cash upon delivery.
                </p>
              )}
            </section>
          </div>

          {/* Right Column */}
          <aside className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.cart.id}
                    className="flex gap-4 border border-gray-200 rounded-lg p-4"
                  >
                    <img
                      src={item.product.imagePath[0]?.url}
                      alt={item.product.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold text-gray-800">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.product.desc}
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-semibold text-gray-900">
                          ${item.product.price} USD
                        </span>
                        <div className="flex items-center border rounded-md overflow-hidden">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                String(item.cart.id),
                                "decrease"
                              )
                            }
                            className="p-2 bg-gray-100 hover:bg-gray-200"
                            disabled={quantities[String(item.cart.id)] <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={
                              quantities[String(item.cart.id)] ??
                              item.cart.quantity
                            }
                            onChange={(e) =>
                              handleInputChange(String(item.cart.id), e)
                            }
                            className="w-12 text-center border-x text-gray-800 font-semibold outline-none"
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                String(item.cart.id),
                                "increase"
                              )
                            }
                            className="p-2 bg-gray-100 hover:bg-gray-200"
                            disabled={
                              quantities[String(item.cart.id)] >=
                              item.product.stock
                            }
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="pt-4 mt-4 border-t border-gray-300 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>
                    $
                    {cart
                      .reduce(
                        (total, item) =>
                          total +
                          (quantities[Number(item.cart.id)] ??
                            item.cart.quantity) *
                            Number(item.product.price),
                        0
                      )
                      .toLocaleString()}{" "}
                    USD
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 border-t pt-3">
                  <span>Total</span>
                  <span>
                    $
                    {cart
                      .reduce(
                        (total, item) =>
                          total +
                          (quantities[Number(item.cart.id)] ??
                            item.cart.quantity) *
                            Number(item.product.price),
                        0
                      )
                      .toLocaleString()}{" "}
                    USD
                  </span>
                </div>
                <button className="w-full mt-4 py-3 hover:text-white border border-indigo-500 text-indigo-500 hover:bg-indigo-600 hover:cursor-pointer font-medium rounded-lg transition-all duration-300">
                  Confirm Order
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
