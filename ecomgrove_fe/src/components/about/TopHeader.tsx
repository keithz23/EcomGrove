import { LanguagesData, SettingsData } from "@/app/constants/SettingsData";
import useDropdown from "@/app/hooks/useDropdown";
import { useAuthStore } from "@/app/store/auth/useAuthStore";
import { ChevronDown, Facebook, LogOut, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

export default function TopHeader() {
  const router = useRouter();
  const { toggle, isOpen } = useDropdown();
  const { isAuthenticated, logout } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownItemClass = "px-4 py-2 cursor-pointer hover:bg-gray-100";
  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <div className="w-full px-3 sm:px-5 mx-auto text-xs sm:text-sm bg-white shadow-sm mb-1 hidden lg:block">
      <div className="max-w-7xl flex flex-col sm:flex-row items-center justify-between mx-auto py-2 sm:py-0 gap-2 sm:gap-0">
        {/* Social */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <span className="flex items-center gap-1 sm:gap-2">
            <Facebook className="text-electric-blue w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hover:text-electric-blue transition-all duration-300 cursor-pointer text-xs sm:text-sm">
              7500k Followers
            </span>
          </span>
          <div className="hidden sm:block border-l-2 h-10" />
          <span className="flex items-center gap-1 sm:gap-2">
            <PhoneCall className="text-electric-blue w-4 h-4 sm:w-5 sm:h-5" />
            <a
              href="tel:+(402) 763 282 46"
              className="hover:text-electric-blue transition-all duration-300 text-xs sm:text-sm"
            >
              +(402) 763 282 46
            </a>
          </span>
        </div>

        <div
          ref={dropdownRef}
          className="flex items-center gap-x-2 sm:gap-x-4 w-full sm:w-auto justify-center sm:justify-end"
        >
          {/* Language Selector */}
          <div className="relative">
            <button
              aria-haspopup="true"
              aria-expanded={isOpen("language")}
              aria-controls="language-dropdown"
              className="flex items-center text-black bg-transparent cursor-pointer focus:outline-none text-xs sm:text-sm"
              onClick={() => toggle("language")}
            >
              English <ChevronDown className="ml-1" size={14} />
            </button>
            <ul
              id="language-dropdown"
              role="menu"
              className={`absolute right-0 sm:left-0 bg-white text-black shadow-lg mt-2 z-50 text-xs sm:text-sm rounded transition-all duration-200 min-w-max ${
                isOpen("language")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              {LanguagesData.map((lang) => (
                <li key={lang.id} role="menuitem">
                  <button className={dropdownItemClass}>{lang.name}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-4 border-l border-gray-300" />

          {/* Settings */}
          <div className="relative">
            <button
              aria-haspopup="true"
              aria-expanded={isOpen("setting")}
              aria-controls="setting-dropdown"
              onClick={() => toggle("setting")}
              className="flex items-center text-black cursor-pointer focus:outline-none text-xs sm:text-sm"
            >
              Settings <ChevronDown className="ml-1" size={14} />
            </button>
            <ul
              id="setting-dropdown"
              role="menu"
              className={`absolute right-0 bg-white text-black shadow-lg mt-2 min-w-max text-xs sm:text-sm rounded transition-all duration-200 z-50 ${
                isOpen("setting")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              {SettingsData.map((si) => (
                <li role="menuitem" className={dropdownItemClass} key={si.id}>
                  <Link href={si.name}>{si.name}</Link>
                </li>
              ))}
              {isAuthenticated ? (
                <button
                  className="flex items-center w-full gap-1 px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  Login
                </Link>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
