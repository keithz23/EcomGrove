"use client";
import { ChevronDown, Eye, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  categoriesData,
  productData,
  ProductSortingType,
} from "../constants/ProductData";
import Image from "next/image";

export default function Product() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropDown] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [sortingType, setSortingType] = useState<string>("null");
  const router = useRouter();
  // const { productData, total } = useProductData({
  //   page: currentPage,
  //   categoryId: activeCategory === "" ? undefined : Number(activeCategory),
  //   keyword: "",
  //   sort: sortingType,
  // });

  const handleShowProductDetails = (id: number) => {
    router.push(`/product/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDropdown = (dropdownKey: string) => {
    setOpenDropDown((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  const handleSelectSortingType = (type: string) => {
    setSortingType(type);
  };

  return (
    <div className="px-4 py-8 mx-auto md:px-8 lg:px-16 md:py-12 max-w-7xl">
      {/* Header */}
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
              onClick={() => {
                setActiveCategory("");
                setCurrentPage(1);
              }}
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
                onClick={() => {
                  setActiveCategory(String(item.id));
                  setCurrentPage(1);
                }}
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
                onClick={() => {
                  toggleDropdown("sorting");
                }}
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

                {/* Sorting dropdown */}
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
                      onClick={() => {
                        handleSelectSortingType(pt.lowerName);
                      }}
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
      <section className="grid grid-cols-1 gap-6 cursor-pointer sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
        {productData?.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden transition-all duration-300 bg-white shadow-sm group rounded hover:shadow-lg"
          >
            <div className="relative w-full aspect-[2/3]">
              <Image
                src={item.imagePath?.[0]?.url || ""}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-t"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="p-5 border-t-2">
              <span className="block mb-2 text-sm text-mid-night font-semibold line-clamp-2">
                {item.categories}
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
                <ShoppingCart className="w-5 h-5 hover:text-green-400 transition" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Pagination */}
      {/* {productData.length > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={Number(total.totalPages)}
          />
        </div>
      )} */}
      <Pagination className="mt-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
