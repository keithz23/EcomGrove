"use client";

import { AlignJustify, ChevronDown, LayoutGrid } from "lucide-react";
import { useState } from "react";
import useProducts from "@/app/hooks/useProducts";
import { ProductSortingType } from "@/app/constants/ProductData";
import ProductCard from "./ProductCard";
import { Toaster } from "react-hot-toast";
import { Slider } from "../ui/slider";

export default function Products() {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sortingType, setSortingType] = useState<string>("null");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const page = 1;
  const limit = 12;

  const { products: productData, totalItems } = useProducts(page, limit, "false");

  const toggleDropdown = (dropdownKey: string) => {
    setOpenDropdown((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  const handleSelectSortingType = (type: string) => {
    setSortingType(type);
    setOpenDropdown(null);
  };

  return (
    <>
      <div className="px-4 py-8 mx-auto md:px-8 lg:px-16 md:py-12 max-w-7xl">
        <div className="flex items-center justify-center gap-6 mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-800 md:text-4xl">
            Discover Our Products
          </h2>
        </div>

        {/* Grid layout with filter left + product right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-1">
            <p className="text-mid-night font-semibold text-xl my-2">Price Filter</p>
            <Slider />
          </aside>

          {/* Product + Controls */}
          <section className="lg:col-span-3 space-y-8">
            {/* Layout & Sorting */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Layout Switcher & Count */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLayout("grid")}
                  className={`p-2 border ${layout === "grid" ? "border-mid-night" : ""}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={`p-2 border ${layout === "list" ? "border-mid-night" : ""}`}
                >
                  <AlignJustify className="w-5 h-5" />
                </button>
                <p className="text-sm text-gray-600">
                  Showing 1 - {limit} of {totalItems}
                </p>
              </div>

              {/* Sorting Dropdown */}
              <div className="relative w-full md:w-auto">
                <div
                  className="px-5 py-3 bg-gray-100 border border-gray-200 shadow-sm cursor-pointer"
                  onClick={() => toggleDropdown("sorting")}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-900">
                      {ProductSortingType.find((pt) => pt.lowerName === sortingType)?.name || "Default Sorting"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                        openDropdown === "sorting" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Dropdown */}
                <ul
                  className={`absolute bg-white mt-2 w-full z-50 border border-gray-200 rounded-md shadow-md transition-all transform origin-top
                  ${
                    openDropdown === "sorting"
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  {ProductSortingType.map((pt) => (
                    <li
                      key={pt.id}
                      className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                        sortingType === pt.lowerName ? "font-semibold" : ""
                      }`}
                      onClick={() => handleSelectSortingType(pt.lowerName)}
                    >
                      {pt.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Product Grid/List */}
            <ProductCard layout={layout} product={productData} />
          </section>
        </div>
      </div>

      <Toaster />
    </>
  );
}
