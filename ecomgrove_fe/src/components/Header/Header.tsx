"use client";
import {
  CircleUserIcon,
  Heart,
  ShoppingBag,
  Menu,
  SearchIcon,
} from "lucide-react";
import SubHeader from "./SubHeader";
import Link from "next/link";
import { useAuthStore } from "@/app/store/auth/useAuthStore";
import { useWindowEvents } from "@/app/hooks/useWindowsEvent";
import Cart from "../cart/Cart";
import TopHeader from "./TopHeader";
import { useCartStore } from "@/app/store/cart/useCartStore";
import CategoriesMenu from "./CategoriesMenu";
import useDisableScroll from "@/app/hooks/useDisableScroll";

interface HeaderColor {
  color?: string;
}

export const Header: React.FC<HeaderColor> = ({ color = "bg-black" }) => {
  const { isScrolledY, isMobile } = useWindowEvents();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isCartOpen, closeCart, openCart } = useCartStore();
  useDisableScroll(isCartOpen);

  return (
    <>
      <div className={`hidden lg:block h-9 ${color}`}>
        <div className="container flex items-center justify-end h-full px-5 mx-auto text-sm text-white">
          {/* Top Header */}
          <TopHeader />
        </div>
      </div>

      {/* Middle Header */}
      <div
        className={`fixed top-0 w-full z-20 bg-white shadow-md transition-all duration-300 ease-in-out ${
          isScrolledY || isMobile
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <SubHeader />
      </div>

      <div
        className={`lg:h-24 py-6 border-b border-gray-300 transform transition-all duration-200 ${
          isScrolledY || isMobile
            ? "opacity-0 -translate-y-2 pointer-events-none"
            : "opacity-100 translate-y-0 pointer-events-auto"
        }`}
      >
        <div className="container grid items-center grid-cols-3 px-4 mx-auto">
          {/* Logo */}
          <div className="col-span-1">
            <Link href="/">
              <img
                src="https://shofy-svelte.vercel.app/img/logo/logo.svg"
                alt="Brand Logo"
                className="h-8"
              />
            </Link>
          </div>

          {/* Search */}
          <div className="hidden lg:flex col-span-1 border-2 border-electric-blue h-12 relative z-50 items-center p-3">
            {/* Search Input */}
            <input
              type="text"
              className="flex-1 focus:outline-none"
              placeholder="Search for Products..."
            />
            <button type="submit">
              <SearchIcon className="w-5 h-5 cursor-pointer" />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center justify-end col-span-2 lg:col-span-1 gap-x-4">
            <Link href="/profile" className="items-center hidden lg:flex">
              <CircleUserIcon className="w-8 h-8 mr-2 text-gray-700" />
              <div>
                <span className="text-sm font-medium text-gray-500">
                  {isAuthenticated ? `Hi, ${user?.username}` : "Sign In"}
                </span>
                <h5 className="font-bold text-gray-700 text-md">
                  Your Account
                </h5>
              </div>
            </Link>
            <Heart className="hidden lg:block h-6 w-6 text-gray-700 hover:text-electric-blue cursor-pointer" />
            <ShoppingBag
              className="h-6 w-6 text-gray-700 hover:text-electric-blue cursor-pointer"
              onClick={openCart}
            />
            <button className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Menu */}
      <div className="h-12 hidden lg:block mt-0.5">
        <CategoriesMenu />
      </div>

      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};
