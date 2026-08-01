import { cartService } from "@/app/services/public/cart.service";
import { IProducts } from "@/app/types/products/product.interface";
import toast from "react-hot-toast";
import { create } from "zustand";

interface CartItem {
  id: string;
  cartItemId?: string;
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
  loading: boolean;
  error: string | null;

  openCart: () => void;
  closeCart: () => void;

  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  fetchCart: () => Promise<void>;
  syncGuestCartToServer: (guestCart: CartItem[]) => Promise<void>;

  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: [],
  isCartOpen: false,
  loading: false,
  error: null,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  addToCart: async (item) => {
    const cart = get().cart;
    const exists = cart.find((p) => p.id === item.id);
    let updatedCart: CartItem[];

    if (exists) {
      updatedCart = cart.map((p) =>
        p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
      );
      toast.success("Product quantity updated");
    } else {
      updatedCart = [...cart, { ...item, quantity: item.quantity }];
      toast.success("Product added to cart");
    }

    try {
      await cartService.addToCart({
        productId: item.id,
        quantity: item.quantity,
      });
      set({ cart: updatedCart });
      await get().fetchCart();
    } catch (err) {
      console.error("Failed to sync addToCart", err);
      toast.error("Failed to add to cart");
    }
  },

  removeFromCart: async (id) => {
    const item = get().cart.find((cartItem) => cartItem.id === id);
    if (!item?.cartItemId) return;

    const updated = get().cart.filter((item) => item.id !== id);
    try {
      await cartService.removeFromCart(item.cartItemId);
      set({ cart: updated });
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove cart item", error);
      toast.error("Failed to remove cart item");
    }
  },

  clearCart: async () => {
    try {
      await cartService.clearCart();
      set({ cart: [] });
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Failed to clear cart", error);
      toast.error("Failed to clear cart");
    }
  },

  getTotalPrice: () => {
    return get().cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await cartService.getCartByUser();
      const serverCart = res?.data ?? [];

      const normalized = serverCart.map((item: any) => ({
        id: item.productId,
        cartItemId: item.id,
        name: item.product.name,
        price: item.product.price,
        stock: item.product.stock,
        image: item.product.image,
        quantity: item.quantity,
      }));

      set({ cart: normalized });
    } catch (err: any) {
      console.error("Failed to fetch cart", err);
      set({ error: err?.message || "Failed to fetch cart" });
      toast.error("Failed to fetch cart");
    } finally {
      set({ loading: false });
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
