"use client";
import Footer from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import Product from "./product/page";
import Banner from "@/components/common/Banner";
import AdSection from "@/components/common/AdSection";
import Subscribe from "@/components/common/Subscribe";
import TrendingProduct from "@/components/common/TrendingProduct";
import Deal from "@/components/common/Deal";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/auth/useAuthStore";
import { useEffect, useState } from "react";
import { getErrorMessage } from "./utils/getMessageError.util";
import { cartService } from "./services/public/cart.service";
import CartSyncModal from "@/components/modal/Modal";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckCart = () => {
    if (!isAuthenticated) return;

    const rawCart = localStorage.getItem("cart-storage");

    try {
      const parsed = JSON.parse(rawCart || "{}");

      if (parsed?.state?.cart && Array.isArray(parsed.state.cart)) {
        const cart = parsed.state.cart;
        if (cart.length > 0) {
          setCartItemsCount(cart.length);
          setShowCartModal(true);
        }
      }
    } catch (err) {
      console.error("Invalid cart data", err);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    const rawCart = localStorage.getItem("cart-storage");
    let cartItems: any[] = [];

    try {
      const parsed = JSON.parse(rawCart || "{}");
      if (parsed?.state?.cart && Array.isArray(parsed.state.cart)) {
        cartItems = parsed.state.cart;
      }
    } catch (err) {
      cartItems = [];
    }

    const payload = cartItems.map((item: any) => ({
      productId: item.id,
      quantity: item.quantity ?? 1, // fallback nếu không có quantity
    }));

    try {
      await cartService.syncCartFromLocal(payload);
      toast.success("Cart synced successfully");
      localStorage.removeItem("cart-storage");
      setShowCartModal(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowCartModal(false);
  };

  useEffect(() => {
    handleCheckCart();
  }, [isAuthenticated]);

  return (
    <div className="selection:bg-mid-night selection:text-white">
      <Header />
      <Banner />
      <AdSection />
      <TrendingProduct />
      <Deal />
      <Product />
      <Subscribe />
      <Footer />

      <CartSyncModal
        isOpen={showCartModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        cartItemsCount={cartItemsCount}
        isLoading={isLoading}
      />

      <Toaster />
    </div>
  );
}
