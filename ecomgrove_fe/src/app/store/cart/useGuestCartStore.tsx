import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

interface GuestCartItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
}

interface GuestCartState {
  cart: GuestCartItem[];
  isCartOpen: boolean;

  openCart: () => void;
  closeCart: () => void;

  addToCart: (item: GuestCartItem) => void;
  removeFromCart: (id: string) => void;
  clearGuestCart: () => void;
  getTotalPrice: () => number;
}

export const useGuestCartStore = create<GuestCartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addToCart: (item) => {
        const cart = get().cart;
        const exists = cart.find((p) => p.id === item.id);
        let updatedCart: GuestCartItem[];

        if (exists) {
          updatedCart = cart.map((p) =>
            p.id === item.id
              ? { ...p, quantity: p.quantity + item.quantity }
              : p
          );
          toast.success("Product quantity updated");
        } else {
          updatedCart = [...cart, { ...item }];
          toast.success("Product added to cart");
        }

        set({ cart: updatedCart });
      },

      removeFromCart: (id) => {
        const updated = get().cart.filter((item) => item.id !== id);
        set({ cart: updated });
        toast.success("Item removed from cart");
      },

      clearGuestCart: () => {
        set({ cart: [] });
        toast.success("Cart cleared");
      },

      getTotalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
