"use client";
import { AlignJustify, ChevronDown, LayoutGrid } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import useProducts from "@/app/hooks/useProducts";
import { ProductSortingType } from "@/app/constants/ProductData";
import ProductCard from "./ProductCard";
import { Toaster } from "react-hot-toast";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import useDropdown from "@/app/hooks/useDropdown";
import { getUpdatedUrl } from "@/app/utils/urlParams.util";
import useCategory from "@/app/features/categories/hooks/useCategory";

export default function Products() {
  const limit = 9;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toggle, isOpen } = useDropdown();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortingType, setSortingType] = useState<string>("null");
  const [price, setPrice] = useState<number[]>([100]);
  const [tempPrice, setTempPrice] = useState<number[]>([100]);
  const [appliedPrice, setAppliedPrice] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const parsedUrlParams = useMemo(() => {
    const priceParam = searchParams.get("price");
    const sortParam = searchParams.get("sort");

    return {
      price: priceParam ? Number(priceParam) : null,
      sort: sortParam || "null",
    };
  }, [searchParams]);

  useEffect(() => {
    const { price: urlPrice, sort: urlSort } = parsedUrlParams;

    if (!isNaN(urlPrice!) && urlPrice !== null && urlPrice !== appliedPrice) {
      setPrice([urlPrice]);
      setTempPrice([urlPrice]);
      setAppliedPrice(urlPrice);
    }

    if ((urlPrice === null || isNaN(urlPrice)) && appliedPrice !== null) {
      setPrice([100]);
      setTempPrice([100]);
      setAppliedPrice(null);
    }

    if (urlSort !== sortingType) {
      setSortingType(urlSort);
    }
  }, [parsedUrlParams]);

  const {
    products: productData,
    totalItems,
    totalPages,
    loading,
    error,
  } = useProducts(
    currentPage,
    limit,
    "false",
    appliedPrice ?? undefined,
    sortingType,
    activeCategory ?? undefined
  );

  const { categories: categoryData } = useCategory(1, 10, "false");

  const handleSelectSortingType = (type: string) => {
    setSortingType(type);
    toggle("sorting");

    const newUrl = getUpdatedUrl(searchParams, {
      sort: type,
    });

    router.replace(newUrl);
  };

  const handleFilter = () => {
    const newPrice = tempPrice[0];
    if (newPrice !== price[0]) {
      setPrice([newPrice]);
      setAppliedPrice(newPrice);
      setCurrentPage(1);

      const newUrl = getUpdatedUrl(searchParams, {
        price: newPrice.toString(),
      });

      router.replace(newUrl);
    }
  };

  const handleClearFilter = () => {
    setPrice([100]);
    setTempPrice([100]);
    setAppliedPrice(null);
    setCurrentPage(1);
    setActiveCategory(null);

    const newUrl = getUpdatedUrl(searchParams, {
      price: null,
      categories: null,
      sort: null,
    });

    router.replace(newUrl);
  };

  const handleSliderChange = (value: number[]) => {
    setTempPrice(value);
  };

  const handleCategorySelect = (name: string) => {
    setActiveCategory(name);
    const newUrl = getUpdatedUrl(searchParams, {
      categories: name.toLowerCase(),
    });
    router.replace(newUrl);
  };

  const isFilterApplied = appliedPrice !== null;
  const hasFilterChanged = tempPrice[0] !== price[0];

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <>
      <div className="px-4 py-8 mx-auto md:px-8 lg:px-16 md:py-12 max-w-7xl">
        <div className="flex items-center justify-center gap-6 mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-800 md:text-4xl">
            Discover Our Products
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 shadow-sm border">
              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="text-mid-night font-semibold text-xl mb-4">
                  Price Filter
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Price Range</label>
                    <span className="text-sm text-gray-600">
                      ${tempPrice[0]}
                    </span>
                  </div>

                  <Slider
                    value={tempPrice}
                    max={1000}
                    min={0}
                    step={50}
                    onValueChange={handleSliderChange}
                    className="w-full"
                  />

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>$0</span>
                    <span>$1000</span>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-600 mb-3">
                      {isFilterApplied ? (
                        <>
                          Showing products under{" "}
                          <strong>${appliedPrice}</strong>
                        </>
                      ) : (
                        "No price filter applied"
                      )}
                    </p>

                    <Button
                      variant="black"
                      onClick={handleFilter}
                      className="w-full"
                      disabled={!hasFilterChanged}
                    >
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </div>

              <hr className="my-5 border-gray-200" />

              {/* Categories Filter */}
              <div>
                <h3 className="text-xl text-mid-night font-semibold mb-4">
                  Categories
                </h3>

                <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {categoryData.map((item) => {
                    const isActive = activeCategory === item.name;

                    return (
                      <li
                        key={item.id}
                        className={`flex items-center justify-between group cursor-pointer transition-colors ${
                          isActive
                            ? "text-electric-blue font-medium"
                            : "hover:text-electric-blue"
                        }`}
                        onClick={() => handleCategorySelect(item.name)}
                      >
                        <p className="truncate">{item.name}</p>
                        <span
                          className={`text-xs border rounded-md px-2 py-0.5 min-w-[24px] h-5
            flex items-center justify-center transition
            ${
              isActive
                ? "bg-electric-blue text-white border-electric-blue"
                : "group-hover:bg-electric-blue group-hover:text-white"
            }`}
                        >
                          {item.productCount}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>

          {/* Product + Controls */}
          <section className="lg:col-span-3 space-y-8">
            {/* Active Filters */}
            {isFilterApplied && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Active Filters:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Price: Under ${appliedPrice}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilter}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            )}

            {/* Layout & Sorting */}
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLayout("grid")}
                  className={`p-2 border transition-colors cursor-pointer ${
                    layout === "grid"
                      ? "border-mid-night bg-gray-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={`p-2 border transition-colors cursor-pointer ${
                    layout === "list"
                      ? "border-mid-night bg-gray-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <AlignJustify className="w-5 h-5" />
                </button>
                <p className="text-sm text-gray-600 ml-2">
                  Showing {startItem} - {endItem} of {totalItems} products
                </p>
              </div>

              {/* Sorting Dropdown */}
              <div className="relative">
                <div
                  className="px-5 py-3 bg-gray-100 border border-gray-200 shadow-sm cursor-pointer min-w-40 transition-colors hover:bg-gray-50"
                  onClick={() => toggle("sorting")}
                >
                  <div className="flex justify-center items-center gap-x-3">
                    <span className="text-sm text-gray-900">
                      {ProductSortingType.find(
                        (pt) => pt.lowerName === sortingType
                      )?.name || "Default Sorting"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isOpen("sorting") ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Dropdown */}
                <ul
                  className={`absolute bg-white mt-2 w-full z-50 border border-gray-200 rounded-md shadow-lg transition-all transform origin-top
                  ${
                    isOpen("sorting")
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  {ProductSortingType.map((pt) => (
                    <li
                      key={pt.id}
                      className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors ${
                        sortingType === pt.lowerName
                          ? "font-semibold bg-gray-50"
                          : ""
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
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading products...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">Error loading products: {error}</p>
              </div>
            ) : (
              <ProductCard
                layout={layout}
                product={productData}
                currentPage={currentPage}
                limit={limit}
                totalPages={totalPages}
              />
            )}
          </section>
        </div>
      </div>

      <Toaster />
    </>
  );
}
