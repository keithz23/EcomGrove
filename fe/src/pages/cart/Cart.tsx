import { useEffect } from "react";
import { cartService } from "../../services/cartService";
import { X, Trash } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import useCartData from "../../hooks/useCartData";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Cart({ onClose }: { onClose: () => void }) {
  const { cart = [], isLoading, error, refetch } = useCartData();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  /** Removes item from cart */
  const removeCartMutation = useMutation<number, Error, number>({
    mutationFn: async (id: number) => {
      if (isAuthenticated) {
        // Remove from server
        const response = await cartService.removeItem(id);
        if (response.status !== 200) throw new Error("Failed to delete item");
        return id;
      } else {
        // Remove from local storage
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const updatedCart = localCart.filter(
          (item: { id: number }) => item.id !== id
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return id;
      }
    },
    onSuccess: () => {
      toast.success("Deleted item successfully");
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["cartData"] });
      } else {
        refetch();
      }
    },
    onError: () => {
      toast.error("Failed to delete item. Please try again.");
    },
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Cart Sidebar */}
      <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-lg p-5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* isLoading & Error Handling */}
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error.message}</p>
        ) : cart.length > 0 ? (
          cart.map((item) => (
            <div
              key={item.cart.id || item.product.id}
              className="flex items-center gap-4 border-b pb-3 last:border-none mt-2"
            >
              <img
                src={item.product.imagePath[0]?.url || "/default.png"}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-md border"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-gray-500">
                  ${Number(item.product.price).toFixed(2)}
                </p>
              </div>
              <span className="text-sm font-semibold text-gray-600">
                x{item.cart.quantity}
              </span>
              <button
                className="text-red-500 hover:text-red-600 p-2 rounded transition"
                onClick={() => removeCartMutation.mutate(Number(item.cart.id))}
              >
                <Trash size={20} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center">Your cart is empty.</p>
        )}

        {/* Checkout Button */}
        {cart.length > 0 && (
          <div className="mt-4">
            <span className="text-lg font-semibold">
              Total: $
              {cart
                .reduce(
                  (acc, item) =>
                    acc + item.cart.quantity * Number(item.product.price),
                  0
                )
                .toFixed(2)}
            </span>
            <button className="mt-4 p-3 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Link to="/cart-details">View Cart Details</Link>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
