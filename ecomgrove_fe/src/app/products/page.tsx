"use client";
import TopHeader from "@/components/about/TopHeader";
import SubHeader from "@/components/Header/SubHeader";
import { useWindowEvents } from "../hooks/useWindowsEvent";
import Footer from "@/components/Footer/Footer";
import Products from "@/components/products/Products";

export default function ProductsPage() {
  const { isScrolledY } = useWindowEvents();

  return (
    <>
      {/* Header */}
      <TopHeader />
      <div
        className={`sticky top-0 w-full z-20 bg-white transition-all duration-300 ease-in-out ${
          isScrolledY ? "shadow-md opacity-100" : "shadow-sm opacity-95"
        }`}
      >
        <SubHeader />
      </div>
      {/* Product component */}
      <Products />

      {/* Footer */}
      <Footer />
    </>
  );
}
