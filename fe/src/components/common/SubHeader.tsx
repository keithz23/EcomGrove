import { Heart, SearchIcon, ShoppingBag, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function SubHeader() {
  const [isActive, setIsActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const toggleSetIsActive = () => {
    setIsActive(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="h-20 p-6 border-b border-gray-100 transition-all duration-300 transform sticky top-0 bg-white z-50">
        <div className="container mx-auto grid grid-cols-3 items-center px-3">
          {/* Logo + Menu Button */}
          <div className="col-span-1 w-full flex items-center justify-between">
            <Link to="/">
              <img
                src="https://shofy-svelte.vercel.app/img/logo/logo.svg"
                alt="Brand Logo"
                className="h-8"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex ml-3">
              <ul className="flex gap-4 text-sm text-gray-700">
                <li className="hover:text-[#0989ff] cursor-pointer">Home</li>
                <li className="hover:text-[#0989ff] cursor-pointer">Shop</li>
                <li className="hover:text-[#0989ff] cursor-pointer">
                  Products
                </li>
                <li className="hover:text-[#0989ff] cursor-pointer">Contact</li>
                <li className="hover:text-[#0989ff] cursor-pointer">Coupons</li>
                <li className="hover:text-[#0989ff] cursor-pointer">Blog</li>
              </ul>
            </div>
          </div>

          <div className="hidden lg:flex"></div>

          {/* Icons & Search */}
          <div className="col-span-2 lg:col-span-1 flex items-center justify-end gap-x-3">
            {/* Search Bar - visible on lg+ */}
            <div
              ref={searchRef}
              className={`hidden lg:flex col-span-1 border h-10 bg-gray-100 items-center transition-all duration-200 w-full max-w-xs ${
                isActive ? "border-[#0989ff]" : "border-gray-300"
              }`}
              onClick={toggleSetIsActive}
            >
              <input
                type="text"
                className="flex-1 px-4 focus:outline-none bg-transparent text-sm"
                placeholder="Search for Products..."
              />
              <div className="flex items-center px-3">
                <SearchIcon className="h-5 w-5 hover:text-[#0989ff] hover:cursor-pointer" />
              </div>
            </div>

            <div className="flex justify-end gap-x-3">
              <Heart className="h-6 w-6 text-gray-700 hover:text-[#0989ff] cursor-pointer hidden lg:block" />
              {/* Hamburger Menu for mobile */}
              <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-[#0989ff] cursor-pointer" />
              <button
                className="lg:hidden text-gray-700"
                onClick={toggleMobileMenu}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md px-5 py-4">
          <ul className="flex flex-col gap-4 text-sm text-gray-700">
            <li className="hover:text-[#0989ff] cursor-pointer">Home</li>
            <li className="hover:text-[#0989ff] cursor-pointer">Shop</li>
            <li className="hover:text-[#0989ff] cursor-pointer">Products</li>
            <li className="hover:text-[#0989ff] cursor-pointer">Contact</li>
            <li className="hover:text-[#0989ff] cursor-pointer">Coupons</li>
            <li className="hover:text-[#0989ff] cursor-pointer">Blog</li>
          </ul>
        </div>
      )}
    </div>
  );
}
