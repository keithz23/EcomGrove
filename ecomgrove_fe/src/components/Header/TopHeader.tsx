import useDropdown from "@/app/hooks/useDropdown";
import { useAuthStore } from "@/app/store/auth/useAuthStore";
import { ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { LanguagesData, SettingsData } from "@/app/constants/SettingsData";

export default function TopHeader() {
  const router = useRouter();
  const { toggle, isOpen } = useDropdown();
  const { isAuthenticated, logout } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="container flex items-center justify-end h-full px-5 mx-auto text-sm text-white">
      <div ref={dropdownRef} className="flex items-center gap-x-4">
        {/* Language Selector */}
        <div className="relative">
          <button
            aria-expanded={isOpen("language")}
            aria-controls="language-dropdown"
            className="flex items-center text-white bg-transparent cursor-pointer focus:outline-none"
            onClick={() => {
              toggle("language");
            }}
          >
            English <ChevronDown className="ml-1" size={16} />
          </button>
          <ul
            id="language-dropdown"
            className={`absolute bg-white text-black shadow-lg mt-2 z-30 text-sm rounded transition-all duration-200 ${
              isOpen("language")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            {LanguagesData.map((lang) => (
              <li
                key={lang.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {lang.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="h-4 border-l border-gray-300"></div>

        {/* Settings */}
        <div className="relative">
          <button
            aria-expanded={isOpen("setting")}
            aria-controls="setting-dropdown"
            className="flex items-center text-white cursor-pointer focus:outline-none"
            onClick={() => {
              toggle("setting");
            }}
          >
            Settings <ChevronDown className="ml-1" size={16} />
          </button>
          <ul
            id="setting-dropdown"
            className={`absolute bg-white text-black shadow-lg mt-2 min-w-max text-sm rounded transition-all duration-200 z-10 ${
              isOpen("setting")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            {SettingsData.map((si) => (
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                key={si.id}
              >
                <Link href={si.href}>{si.name}</Link>
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
  );
}
