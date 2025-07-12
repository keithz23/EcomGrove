import { IProducts } from "@/app/types/products/product.interface";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useAuthStore } from "@/app/store/auth/useAuthStore";
import { useCartStore } from "@/app/store/cart/useCartStore";
import { useGuestCartStore } from "@/app/store/cart/useGuestCartStore";
import { useRouter } from "next/navigation";
import ProductDetailModal from "./ProductDetailModal";

type ProductCardProps = {
  layout: "grid" | "list";
  product: IProducts[];
  currentPage: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function ProductCard({
  layout,
  product,
  currentPage,
  limit,
  totalPages,
  onPageChange,
}: ProductCardProps) {
  const router = useRouter();
  const productRef = useRef<HTMLDivElement | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProducts | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addItem = isAuthenticated
    ? useCartStore((s) => s.addToCart)
    : useGuestCartStore((s) => s.addToCart);

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    setTimeout(() => {
      productRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleViewProductDetail = (id: string) => {
    router.push(`/products/${id}`);
  };

  const handleViewProductDetailModal = (product: IProducts) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <>
      <section
        ref={productRef}
        className={
          layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 cursor-pointer"
            : "flex flex-col gap-6 cursor-pointer"
        }
      >
        {product.map((item) => {
          const isGrid = layout === "grid";

          return (
            <div
              key={item.id}
              className={`relative overflow-hidden transition-all duration-300 bg-white shadow-sm group rounded hover:shadow-lg ${
                isGrid ? "" : "flex items-stretch"
              }`}
            >
              {/* Image */}
              <div
                onClick={() => {
                  handleViewProductDetail(item.id);
                }}
                className={
                  isGrid
                    ? "relative w-full aspect-[2/3]"
                    : "relative w-1/3 min-w-[150px] h-auto"
                }
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-t sm:rounded-l"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between p-5 w-full border-t-2 sm:border-t-0 sm:border-l">
                <div>
                  <span className="block mb-2 text-sm text-mid-night font-semibold line-clamp-2">
                    {item.category.name}
                  </span>
                  <span className="block mb-2 text-md text-mid-night font-semibold line-clamp-2">
                    {item.name}
                  </span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold text-electric-blue">
                      ${item.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 mt-4">
                  <Heart className="w-5 h-5 hover:text-red-500 transition cursor-pointer" />
                  <Eye
                    className="w-5 h-5 hover:text-blue-400 transition cursor-pointer"
                    onClick={() => {
                      handleViewProductDetailModal(item);
                    }}
                  />
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
          );
        })}
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
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
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
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <ProductDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </>
  );
}
