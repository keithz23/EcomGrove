"use client";
import {
  Heart,
  SearchIcon,
  ShoppingBag,
  X,
  AlignRight,
  ChevronDown,
  AlignJustify,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import Cart from "../cart/Cart";
import { useCartStore } from "@/app/store/cart/useCartStore";
import { categoriesData, navItems } from "@/app/constants/headerData";

export default function SubHeader() {
  const [isActive, setIsActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropDown] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const { isCartOpen, closeCart, openCart } = useCartStore();

  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleDropdown = (dropdownKey: string) => {
    setOpenDropDown((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  const toggleSetIsActive = () => setIsActive(true);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (trimmed) {
      router.push(`/products?keyword=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/products");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      <div className="h-20 p-6 border-b border-gray-100 sticky top-0 bg-white z-40 shadow-md">
        <div className="container mx-auto grid grid-cols-3 items-center px-3">
          {/* Logo + Menu Button */}
          <div className="col-span-1 flex items-center justify-between">
            <Link href="/">
              <img
                src="https://shofy-svelte.vercel.app/img/logo/logo.svg"
                alt="Brand Logo"
                className="h-8"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex ml-3">
              <ul className="flex gap-4 text-lg text-mid-night">
                {navItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="hover:text-electric-blue transition-all duration-300"
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="hidden lg:flex"></div>

          {/* Icons & Search */}
          <div className="col-span-2 lg:col-span-1 flex items-center justify-end gap-x-3">
            <div
              ref={searchRef}
              className={`hidden lg:flex border h-10 bg-gray-100 items-center w-full max-w-xs transition ${
                isActive
                  ? "border-electric-blue"
                  : "border-gray-300"
              }`}
              onClick={toggleSetIsActive}
            >
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 px-4 bg-transparent text-sm focus:outline-none"
                placeholder="Search for Products..."
                onKeyDown={handleKeyDown}
              />
              <button onClick={handleSearch} className="px-3">
                <SearchIcon className="h-5 w-5" />
              </button>
            </div>

            <Heart className="h-6 w-6 text-gray-700 hidden lg:block cursor-pointer hover:text-electric-blue transition-all duration-300" />
            <ShoppingBag
              className="h-6 w-6 text-gray-700 cursor-pointer hover:text-electric-blue transition-all duration-300"
              onClick={openCart}
            />
            <button onClick={toggleMobileMenu} className="lg:hidden">
              <AlignRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 flex h-screen transition-all ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-black/70 w-full" onClick={toggleMobileMenu}></div>

        <div
          className={`min-w-[380px] bg-white shadow-lg h-full flex flex-col justify-between transition-transform ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-5">
            <div className="flex items-center justify-between">
              <Link href="/">
                <img
                  src="https://shofy-svelte.vercel.app/img/logo/logo.svg"
                  alt="Brand Logo"
                  className="h-9"
                />
              </Link>
              <button onClick={toggleMobileMenu}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Categories */}
            <button
              className="flex justify-between items-center h-12 mt-5 w-full bg-electric-blue text-white px-5 hover:bg-black"
              onClick={() => toggleDropdown("category")}
            >
              <span className="flex gap-x-2 items-center">
                <AlignJustify className="h-5 w-5" />
                All Categories
              </span>
              <ChevronDown
                className={`transform transition ${
                  openDropdown === "category" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "category" && (
              <ul className="bg-white p-4 space-y-3 mt-2 max-h-80 overflow-auto">
                {categoriesData.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="flex gap-x-3 items-center">
                      <div className="bg-blue-100 text-blue-700 w-12 h-12 flex justify-center items-center font-bold rounded">
                        {cat.name.slice(0, 3).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {cat.name}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </li>
                ))}
              </ul>
            )}

            {/* Mobile Nav */}
            <ul className="mt-6 space-y-4 text-md font-semibold text-gray-700">
              {navItems.map((item, idx) => (
                <li key={idx} className="hover:text-electric-blue">
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t p-4 text-sm flex flex-col justify-center gap-3">
            <div>
              <Link href={"/login"}>
                <Button variant={"black"} className="w-full py-6">
                  Login
                </Button>
              </Link>
            </div>

            <div className="flex justify-around">
              <button className="flex gap-x-2">
                Currency: USD <ChevronDown />
              </button>
              <button className="flex gap-x-2">
                English <ChevronDown />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
}