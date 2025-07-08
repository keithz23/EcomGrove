"use client";
import { ChevronDown, Eye, Heart, ShoppingCart } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import { useAuthStore } from "@/app/store/auth/useAuthStore";
import { useCartStore } from "@/app/store/cart/useCartStore";
import { useGuestCartStore } from "@/app/store/cart/useGuestCartStore";
import useProducts from "@/app/hooks/useProducts";
import { ProductSortingType } from "@/app/constants/ProductData";
import { categoriesData } from "@/app/constants/headerData";

export default function Products() {
  const [openDropdown, setOpenDropDown] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [sortingType, setSortingType] = useState<string>("null");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const router = useRouter();
  const productRef = useRef<HTMLDivElement | null>(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Dynamic store access
  const addItem = isAuthenticated
    ? useCartStore((s) => s.addToCart)
    : useGuestCartStore((s) => s.addToCart);

  const {
    products: productData,
    totalPages,
    loading,
    refetch,
  } = useProducts(page, limit, "false");

  const toggleDropdown = (dropdownKey: string) => {
    setOpenDropDown((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  const handleSelectSortingType = (type: string) => {
    setSortingType(type);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      productRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <>
      <div className="px-4 py-8 mx-auto md:px-8 lg:px-16 md:py-12 max-w-7xl">
        <div className="flex items-center justify-center gap-6 mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-800 md:text-4xl">
            Discover Our Products
          </h2>
        </div>

        {/* Categories & Filter */}
        <div className="mb-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <ul className="flex flex-wrap gap-3">
              <li
                onClick={() => setActiveCategory("")}
                className={`border px-4 py-2 text-sm cursor-pointer transition-all duration-300 ${
                  activeCategory === ""
                    ? "bg-electric-blue text-white shadow-md"
                    : "text-mid-night hover:bg-electric-blue hover:text-white"
                }`}
              >
                All
              </li>
              {categoriesData?.map((item) => (
                <li
                  key={item.id}
                  onClick={() => setActiveCategory(String(item.id))}
                  className={`border px-4 py-2 text-sm cursor-pointer transition-all duration-300 ${
                    activeCategory === String(item.id)
                      ? "bg-electric-blue text-white shadow-md"
                      : "text-mid-night hover:bg-electric-blue hover:text-white"
                  }`}
                >
                  {item.name}
                </li>
              ))}
            </ul>

            {/* Filter section */}
            <section className="flex flex-col justify-between md:flex-row">
              <div>
                <div
                  className="relative px-5 py-3 bg-gray-100 border border-gray-200 shadow-sm cursor-pointer min-w-42"
                  onClick={() => toggleDropdown("sorting")}
                >
                  <div className="flex justify-between">
                    <h1 className="text-sm text-gray-900">
                      {ProductSortingType.find(
                        (pt) => pt.lowerName === sortingType
                      )?.name || "Default Sorting"}
                    </h1>
                    <ChevronDown
                      className={`w-5 h-5 transition-all duration-200 ${
                        openDropdown == "sorting" ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <ul
                    className={`absolute bg-white mt-3.5 left-0 w-full z-50 border border-gray-200 origin-top transition-transform duration-300 ease-out
                    ${
                      openDropdown === "sorting"
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    {ProductSortingType.map((pt) => (
                      <li
                        key={pt.id}
                        className={`text-left px-4 py-2 text-sm ${
                          sortingType == pt.lowerName ? "font-bold" : ""
                        }`}
                        onClick={() => handleSelectSortingType(pt.lowerName)}
                      >
                        {pt.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Product Grid */}
        <section
          ref={productRef}
          className="grid grid-cols-1 gap-6 cursor-pointer sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8"
        >
          {productData?.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden transition-all duration-300 bg-white shadow-sm group rounded hover:shadow-lg"
            >
              <div className="relative w-full aspect-[2/3]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-t"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="p-5 border-t-2">
                <span className="block mb-2 text-sm text-mid-night font-semibold line-clamp-2">
                  {item.category.name}
                </span>
                <span className="block mb-2 text-md text-mid-night font-semibold line-clamp-2">
                  {item.name}
                </span>
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-electric-blue">
                    ${item.price}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 absolute right-4 bottom-32 p-3 bg-black/70 text-white rounded-md opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer z-10 shadow-lg">
                <div className="relative group">
                  <Heart className="w-5 h-5 hover:text-red-500 transition" />
                </div>
                <div className="relative group">
                  <Eye className="w-5 h-5 hover:text-blue-400 transition" />
                </div>
                <div className="relative group">
                  <button
                    onClick={() =>
                      addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        stock: item.stock,
                        image: item.image,
                        quantity: 1,
                      })
                    }
                  >
                    <ShoppingCart className="w-5 h-5 hover:text-green-400 transition cursor-pointer" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) handlePageChange(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) handlePageChange(page + 1);
                  }}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}
