import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ordersService } from "../../services/order";

export default function Checkout() {
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    environment: "sandbox" as "sandbox",
    currency: "USD",
    intent: "capture",
  };

  //Add a checkout page including product information, address, payment method, and coupon.

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
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: "vertical", shape: "rect" }}
        createOrder={(data, actions) => {
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
            if (details.payer) {
              console.log(
                "Transaction completed by:",
                details.payer.name?.given_name
              );
            } else {
              console.log(
                "Transaction completed, but payer details are unavailable."
              );
            }
          });
        }}
        onError={(err) => {
          console.error("An error occurred:", err);
        }}
      />
    </PayPalScriptProvider>
  );
}
