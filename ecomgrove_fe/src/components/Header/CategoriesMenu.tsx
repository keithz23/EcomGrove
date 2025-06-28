import { categoriesData, navItems } from "@/app/constants/headerData";
import useDropdown from "@/app/hooks/useDropdown";
import { AlignLeft, ChevronDown, ChevronRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function CategoriesMenu() {
  const { isOpen, toggle } = useDropdown();
  return (
    <div className="container items-center hidden grid-cols-3 px-4 mx-auto lg:grid">
      <div className="relative flex items-center col-span-2 gap-x-10">
        <button
          aria-expanded={isOpen("all category")}
          aria-controls="all-category-dropdown"
          className="flex items-center justify-center h-12 border text-white border-electric-blue w-1/3 bg-electric-blue hover:bg-black transition-all duration-300 gap-2 hover:border-black hover:cursor-pointer"
          onClick={() => {
            toggle("all category");
          }}
        >
          <AlignLeft className="w-5 h-5" />
          <span>All Categories</span>
          <ChevronDown
            className={`transform transition-all duration-200 ${
              isOpen("all category") ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Category Dropdown */}
        <div
          id="all-category-dropdown"
          className={`absolute bg-white top-full z-50 min-w-[334px] left-0 border border-gray-200 shadow-lg transition-all duration-500 max-h-52 overflow-auto ${
            isOpen("all category")
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }`}
        >
          <ul className="p-4 space-y-3">
            {categoriesData.map((category) => (
              <li
                key={category.id}
                className="p-2 transition rounded-md cursor-pointer"
              >
                <div className="flex items-center justify-between gap-x-4 group">
                  <div className="flex items-center gap-x-4">
                    <div className="flex items-center justify-center w-10 h-10 font-bold text-blue-700 bg-blue-100 rounded-md">
                      {category.name.slice(0, 3).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-800 group-hover:text-electric-blue transition-all duration-200">
                      {category.name}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-electric-blue transition-all duration-200" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul className="flex gap-4 text-gray-700 text-md">
            {navItems.map((item, idx) => (
              <li
                key={idx}
                className="hover:text-electric-blue cursor-pointer flex gap-2 items-center"
              >
                <Link href={item.href}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hotline */}
      <div className="flex items-center justify-end gap-x-3">
        <PhoneCall className="text-electric-blue" />
        <div>
          <span className="text-sm text-gray-600">Hotline:</span>
          <p className="hover:text-electric-blue hover:cursor-pointer transition-all duration-200">
            +(402) 763 282 46
          </p>
        </div>
      </div>
    </div>
  );
}
