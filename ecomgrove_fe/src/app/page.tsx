"use client";
import Footer from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import Product from "./product/page";
import Banner from "@/components/common/Banner";
import AdSection from "@/components/common/AdSection";
import Subscribe from "@/components/common/Subscribe";
import TrendingProduct from "@/components/common/TrendingProduct";
import Deal from "@/components/common/Deal";
import { useAuthStore } from "./store/auth/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <div className="selection:bg-mid-night selection:text-white">
      {/* Header */}
      <Header />

      {/* Banner */}
      <Banner />

      <AdSection />

      <TrendingProduct />

      <Deal />

      {/* Products */}
      <Product />

      {/* Subscribe */}
      <Subscribe />

      {/* Footer */}
      <Footer />
      <Toaster />
    </div>
  );
}
