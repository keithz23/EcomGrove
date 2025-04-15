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
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useCategoryData } from "../../hooks/useCategoryData";
import { navItems } from "../../utils";

export default function SubHeader() {
  const [isActive, setIsActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { categoriesData } = useCategoryData();
  const [openDropdown, setOpenDropDown] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (dropdownKey: string) => {
    setOpenDropDown((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  const toggleSetIsActive = () => {
    setIsActive(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

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
                {navItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="hover:text-[#0989ff] cursor-pointer flex gap-2 items-center"
                  >
                    <a href={item.href}>{item.name}</a>
                  </li>
                ))}
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
                <AlignRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`fixed inset-0 z-50 flex transform transition-all duration-300 h-[100vh] ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100 overflow-y-hidden"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`bg-black/70 bg-opacity-50 w-full transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMobileMenu}
        ></div>

        {/* Sidebar */}
        <div
          className={`min-w-[380px] bg-white h-full shadow-lg flex flex-col justify-between transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col justify-center gap-y-5 p-5">
            {/* Logo + Close button */}
            <div className="flex items-center">
              <Link to="/">
                <img
                  src="https://shofy-svelte.vercel.app/img/logo/logo.svg"
                  alt="Brand Logo"
                  className="h-9"
                />
              </Link>

              <button
                className="absolute right-4 text-gray-700 border border-gray-300 p-1 bg-gray-200"
                onClick={toggleMobileMenu}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category section */}
            <div className="flex flex-col w-full">
              <button
                className="flex items-center justify-between h-12 px-5 border text-white border-[#0989ff] w-full bg-[#0989ff] hover:bg-black transition-all duration-300 gap-2 hover:border-black hover:cursor-pointer"
                onClick={() => toggleDropdown("category")}
              >
                <div className="flex items-center gap-x-2">
                  <AlignJustify className="h-5 w-5 font-semibold" />
                  <span>All Categories</span>
                </div>
                <div className="flex justify-end items-center -rotate-90">
                  <ChevronDown
                    className={`transform transition-all duration-200 ${
                      openDropdown === "category" ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </button>

              {openDropdown === "category" && (
                <div className="w-full bg-white rounded-md mt-2 overflow-auto max-h-80">
                  <ul className="p-4 space-y-3">
                    {categoriesData.map((category) => (
                      <li
                        key={category.id}
                        className="p-2 rounded-md cursor-pointer transition border-b border-gray-300 mb-3"
                      >
                        <div className="flex items-center justify-between gap-x-4 group">
                          <div className="flex items-center gap-x-4">
                            <div className="w-12 h-12 rounded-md bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                              {category.name.slice(0, 3).toUpperCase()}
                            </div>

                            <span className="text-sm font-medium text-gray-800 transition-all duration-200">
                              {category.name}
                            </span>
                          </div>

                          <ChevronRight className="h-5 w-5 text-gray-500 border border-gray-300" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Menu */}
            <div className="p-6">
              <ul className="flex flex-col gap-4 text-md font-semibold text-gray-700">
                {navItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="hover:text-[#0989ff] cursor-pointer flex gap-2 items-center justify-between"
                  >
                    <a href={item.href}>{item.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 p-2 text-sm">
            <div className="flex items-center justify-around">
              {/* Currency */}
              <button className="flex gap-x-3">
                Currency: USD <ChevronDown />
              </button>

              {/* Language */}
              <button className="flex gap-x-3">
                English <ChevronDown />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
