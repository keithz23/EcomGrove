import { EService } from "@/app/enums/EService";
import { ECartService } from "@/app/enums/services/cart/ECartService";
import { IAddToCart, IUpdateCart } from "@/app/types/cart/cart.interface";
import { instance } from "@/lib/axios";

export const cartService = {
  getCartByUser() {
    const url = `${EService.CART_SERVICE}/${ECartService.GET_CART_BY_USER}`;
    return instance.get(url);
  },

  addToCart: (addToCart: IAddToCart) => {
    const url = `${EService.CART_SERVICE}/${ECartService.ADD_TO_CART}`;
    return instance.post(url, addToCart);
  },

  updateCartItem: (updateCart: IUpdateCart) => {
    const url = `${EService.CART_SERVICE}/${ECartService.UPDATE_CART}`;
    return instance.patch(url, updateCart);
  },

  removeFromCart: (cartItemId: string) => {
    const url = `${EService.CART_SERVICE}/${ECartService.REMOVE_FROM_CART}`;
    return instance.delete(url, { data: { cartItemId } });
  },

  clearCart: () => {
    const url = `${EService.CART_SERVICE}/${ECartService.CLEAR_CART}`;
    return instance.delete(url);
  },

  syncCartFromLocal: (data: IAddToCart[]) => {
    const url = `${EService.CART_SERVICE}/${ECartService.SYNC_CART}`;
    return instance.post(url, data);
  },
};
