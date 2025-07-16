"use client";

import ProductCard from "./ProductCard";
import useProducts from "@/app/hooks/useProducts";
import { Button } from "../ui/button";
import Link from "next/link";

export default function HomeProductPreview() {
  const { products, loading, error } = useProducts(1, 6, "false", false);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <section className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

      <ProductCard
        layout="grid"
        product={products}
        currentPage={1}
        limit={6}
        totalPages={1}
        onPageChange={() => {}}
      />

      <div className="mt-6 text-center">
        <Link href="/products">
          <Button variant={"border"}>View All Products</Button>
        </Link>
      </div>
    </section>
  );
}
