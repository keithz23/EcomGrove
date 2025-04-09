import {
  ChevronDown,
  CircleUserIcon,
  Heart,
  ShoppingBag,
  LogOut,
  LogIn,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import SubHeader from "./SubHeader";

interface HeaderColor {
  color?: string;
}

export const Header: React.FC<HeaderColor> = ({ color = "bg-black" }) => {
  const [languageClicked, setLanguageClicked] = useState(false);
  const [settingClicked, setSettingClicked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectCategoryClicked, setSelectCategoryClicked] = useState(false);
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(user);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setLanguageClicked(false);
        setSettingClicked(false);
        setSelectCategoryClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Top Header */}
      <div className={`h-9 ${color}`}>
        <div className="container mx-auto h-full flex justify-end items-center text-white text-sm px-5">
          <div ref={dropdownRef} className="flex gap-x-4 items-center">
            {/* Language Selector */}
            <div className="relative">
              <button
                className="flex items-center cursor-pointer bg-transparent text-white focus:outline-none"
                onClick={() => {
                  setLanguageClicked((prev) => !prev);
                  setSettingClicked(false);
                }}
              >
                English <ChevronDown className="ml-1" size={16} />
              </button>
              <ul
                className={`absolute bg-white text-black shadow-lg mt-2 text-sm rounded transition-all duration-200 ${
                  languageClicked
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

            {/* Divider */}
            <div className="border-l border-gray-300 h-4"></div>

            {/* Settings */}
            <div className="relative">
              <button
                className="flex items-center cursor-pointer  text-white focus:outline-none"
                onClick={() => {
                  setSettingClicked((prev) => !prev);
                  setLanguageClicked(false);
                }}
              >
                Settings <ChevronDown className="ml-1" size={16} />
              </button>
              <ul
                className={`absolute bg-white text-black shadow-lg mt-2 min-w-max text-sm rounded transition-all duration-200 z-10 ${
                  settingClicked
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
                    <LogIn size={16} />
                    Login
                  </Link>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Header */}
      {isScrolled ? (
        <div className="lg:fixed sticky top-0 z-50 bg-white w-full transform transition-all -translate-y-2 duration-300 shadow-lg">
          <SubHeader />
        </div>
      ) : (
        <div className="h-24 py-6 border-b border-gray-100">
          <div className="container mx-auto grid grid-cols-3 items-center px-4">
            {/* Logo */}
            <div className="col-span-1">
              <Link to="/">
                <img
                  src="https://shofy-svelte.vercel.app/img/logo/logo.svg"
                  alt="Brand Logo"
                  className="h-10"
                />
              </Link>
            </div>

            {/* Search + Category Dropdown */}
            <div className="hidden lg:flex col-span-1 border-2 border-[#0989ff] h-12">
              <input
                type="text"
                className="flex-1 px-4 focus:outline-none"
                placeholder="Search for Products..."
              />
              <div className="relative flex items-center px-4 border-l z-30">
                <button
                  className="flex items-center cursor-pointer bg-transparent focus:outline-none"
                  onClick={() => setSelectCategoryClicked((prev) => !prev)}
                >
                  Select Category
                  <ChevronDown
                    className={`ml-2 transition-transform ${
                      selectCategoryClicked ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute left-0 top-full bg-white shadow-md mt-2 w-48 text-sm p-3 rounded transition-all duration-200 z-50 ${
                    selectCategoryClicked
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
              <Heart className="h-8 w-8 md:h-6 md:w-10 text-gray-700 hover:text-[#0989ff] cursor-pointer" />
              <ShoppingBag className="h-8 w-8 md:h-6 md:w-6 text-gray-700 hover:text-[#0989ff] cursor-pointer" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
