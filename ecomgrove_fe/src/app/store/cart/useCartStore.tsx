import { cartService } from "@/app/services/public/cart.service";
import { IProducts } from "@/app/types/products/product.interface";
import toast from "react-hot-toast";
import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
  product?: IProducts;
}

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;

  openCart: () => void;
  closeCart: () => void;

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  loadCartFromServer: () => Promise<void>;
  syncGuestCartToServer: (guestCart: CartItem[]) => Promise<void>;

  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: [],
  isCartOpen: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  addToCart: (item) => {
    const cart = get().cart;
    const exists = cart.find((p) => p.id === item.id);
    let updatedCart: CartItem[];

    if (exists) {
      updatedCart = cart.map((p) =>
        p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
      );
      toast.success("Product quantity updated");
    } else {
      updatedCart = [...cart, { ...item, quantity: 1 }];
      toast.success("Product added to cart");
    }

    set({ cart: updatedCart });

    cartService.addToCart({
      productId: item.id,
      quantity: 1,
    });
  },

  removeFromCart: (id) => {
    const updated = get().cart.filter((item) => item.id !== id);
    set({ cart: updated });

    cartService.removeFromCart(id);
    toast.success("Item removed from cart");
  },

  clearCart: () => {
    set({ cart: [] });
    fetch("/api/cart/clear", { method: "DELETE" });
    toast.success("Cart cleared");
  },

  getTotalPrice: () => {
    return get().cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  loadCartFromServer: async () => {
    try {
      const res = await cartService.getCartByUser();
      const serverCart = await res.data;

      const normalized = serverCart.map((item: any) => ({
        id: item.productId,
        name: item.product.name,
        price: item.product.price,
        stock: item.product.stock,
        image: item.product.image,
        quantity: item.quantity,
      }));

      set({ cart: normalized });
      toast.success("Cart loaded from server");
    } catch (err) {
      console.error("Failed to load cart", err);
      toast.error("Failed to load cart");
    }
  },

  syncGuestCartToServer: async (guestCart) => {
    try {
      if (guestCart.length === 0) return;

      const cartToSync = guestCart.map((item) => ({
        productId: String(item.id),
        quantity: Number(item.quantity),
      }));

      await cartService.syncCartFromLocal(cartToSync);
      localStorage.removeItem("cart-storage");

      toast.success("Cart synced to server");
    } catch (err) {
      console.error("Failed to sync guest cart", err);
      toast.error("Failed to sync cart");
    }
  },
}));
