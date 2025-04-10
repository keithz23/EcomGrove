import {
  ChevronDown,
  ChevronRight,
  CircleUserIcon,
  Heart,
  ShoppingBag,
  LogOut,
  Menu,
  PhoneCall,
  AlignLeft,
} from "lucide-react";
import { useState, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import SubHeader from "./SubHeader";
import { useWindowEvents } from "../../hooks/useWindowsEvent";

interface HeaderColor {
  color?: string;
}

export const Header: React.FC<HeaderColor> = ({ color = "bg-black" }) => {
  const [openDropdown, setOpenDropDown] = useState<string | null>(null);
  const { isAuthenticated, logout, user } = useAuthStore();
  const { isScrolled, isMobile } = useWindowEvents();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (dropdownKey: string) => {
    setOpenDropDown((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Top Header */}
      <div className={`hidden lg:block h-9 ${color}`}>
        <div className="container mx-auto h-full flex justify-end items-center text-white text-sm px-5">
          <div ref={dropdownRef} className="flex gap-x-4 items-center">
            {/* Language Selector */}
            <div className="relative">
              <button
                aria-expanded={openDropdown === "language"}
                aria-controls="language-dropdown"
                className="flex items-center cursor-pointer bg-transparent text-white focus:outline-none"
                onClick={() => {
                  toggleDropdown("language");
                }}
              >
                English <ChevronDown className="ml-1" size={16} />
              </button>
              <ul
                id="language-dropdown"
                className={`absolute bg-white text-black shadow-lg mt-2 z-30 text-sm rounded transition-all duration-200 ${
                  openDropdown === "language"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                {["English", "Spanish", "French"].map((lang) => (
                  <li
                    key={lang}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l border-gray-300 h-4"></div>

            {/* Settings */}
            <div className="relative">
              <button
                aria-expanded={openDropdown === "setting"}
                aria-controls="setting-dropdown"
                className="flex items-center cursor-pointer text-white focus:outline-none"
                onClick={() => {
                  toggleDropdown("setting");
                }}
              >
                Settings <ChevronDown className="ml-1" size={16} />
              </button>
              <ul
                id="setting-dropdown"
                className={`absolute bg-white text-black shadow-lg mt-2 min-w-max text-sm rounded transition-all duration-200 z-10 ${
                  openDropdown === "setting"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/profile">My Profile</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Wishlist
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/cart-details">Cart</Link>
                </li>
                {isAuthenticated ? (
                  <button
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer w-full text-left flex items-center gap-1"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-1"
                  >
                    Login
                  </Link>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Header */}
      {isScrolled || isMobile ? (
        <div className="fixed top-0 z-50 bg-white w-full transform transition-all duration-300 shadow-lg">
          <SubHeader />
        </div>
      ) : (
        <div className="lg:h-24 py-6 border-b border-gray-300 transform transition-all duration-200">
          <div className="container mx-auto grid grid-cols-3 items-center px-4">
            {/* Logo */}
            <div className="col-span-1">
              <Link to="/">
                <img
                  src="https://shofy-svelte.vercel.app/img/logo/logo.svg"
                  alt="Brand Logo"
                  className="h-8"
                />
              </Link>
            </div>

            {/* Search */}
            <div className="hidden lg:flex col-span-1 border-2 border-[#0989ff] h-12">
              <input
                type="text"
                className="flex-1 px-4 focus:outline-none"
                placeholder="Search for Products..."
              />
              <div className="relative flex items-center px-4 border-l z-30">
                <button
                  aria-expanded={openDropdown === "select category"}
                  aria-controls="category-dropdown"
                  className="flex items-center cursor-pointer bg-transparent focus:outline-none"
                  onClick={() => toggleDropdown("select category")}
                >
                  Select Category
                  <ChevronDown
                    className={`ml-2 transition-transform ${
                      openDropdown === "select category" ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>
                <div
                  id="category-dropdown"
                  className={`absolute left-0 top-full bg-white shadow-md mt-2 w-48 text-sm p-3 rounded transition-all duration-200 z-50 ${
                    openDropdown === "select category"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <ul className="space-y-2">
                    <li className="font-semibold text-gray-600">
                      Select Category
                    </li>
                    {["Electronics", "Fashion", "Beauty", "Jewelry"].map(
                      (cat) => (
                        <li
                          key={cat}
                          className="hover:cursor-pointer hover:text-[#0989ff]"
                        >
                          {cat}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Icons */}
            <div className="col-span-2 lg:col-span-1 flex items-center justify-end gap-x-4">
              <Link to="/profile" className="hidden lg:flex items-center">
                <CircleUserIcon className="h-8 w-8 text-gray-700 mr-2" />
                <div>
                  <span className="text-sm text-gray-500 font-medium">
                    {isAuthenticated
                      ? `Hi, ${user?.name ?? "User"}`
                      : "Sign In"}
                  </span>
                  <h5 className="text-md font-bold text-gray-700">
                    Your Account
                  </h5>
                </div>
              </Link>
              <Heart className="hidden lg:block h-8 w-8 text-gray-700 hover:text-[#0989ff] cursor-pointer" />
              <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-[#0989ff] cursor-pointer" />
              <button className="lg:hidden">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Menu */}
      <div className="h-12 hidden lg:block mt-0.5">
        <div className="container lg:grid grid-cols-3 items-center mx-auto px-4 hidden">
          <div className="flex items-center col-span-2 gap-x-10 relative">
            <button
              aria-expanded={openDropdown === "all category"}
              aria-controls="all-category-dropdown"
              className="flex items-center justify-center h-12 border text-white border-[#0989ff] w-1/3 bg-[#0989ff] hover:bg-black transition-all duration-300 gap-2 hover:border-black hover:cursor-pointer"
              onClick={() => {
                toggleDropdown("all category");
              }}
            >
              <AlignLeft className="h-5 w-5" />
              <span>All Categories</span>
              <ChevronDown
                className={`transform transition-all duration-200 ${
                  openDropdown === "all category" ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Category Dropdown */}
            <div
              id="all-category-dropdown"
              className={`absolute bg-white top-full z-50 min-w-[334px] left-0 border border-gray-200 shadow-lg transition-all duration-500 ${
                openDropdown === "all category"
                  ? "opacity-100 visible"
                  : "opacity-0 invisible"
              }`}
            >
              <ul className="p-4 space-y-3">
                {["Headphones", "Smartphones", "Laptops", "Accessories"].map(
                  (category) => (
                    <li
                      key={category}
                      className="p-2 rounded-md cursor-pointer transition"
                    >
                      <div className="flex items-center justify-between gap-x-4 group">
                        <div className="flex items-center gap-x-4">
                          <img
                            src="https://i.ibb.co/sVxYFDY/product-cat-1.png"
                            alt={category}
                            className="w-12 h-12 object-contain"
                          />
                          <span className="text-sm font-medium text-gray-800 group-hover:text-[#0989ff] transition-all duration-200">
                            {category}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-[#0989ff] transition-all duration-200" />
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <ul className="flex gap-4 text-md text-gray-700">
                {["Home", "Shop", "Products", "Blog", "Coupons", "Contact"].map(
                  (item) => (
                    <li
                      key={item}
                      className="hover:text-[#0989ff] cursor-pointer flex gap-2 items-center"
                    >
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Hotline */}
          <div className="flex items-center justify-end gap-x-3">
            <PhoneCall className="text-[#0989ff]" />
            <div>
              <span className="text-sm text-gray-600">Hotline:</span>
              <p className="hover:text-[#0989ff] hover:cursor-pointer transition-all duration-200">
                +(402) 763 282 46
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
