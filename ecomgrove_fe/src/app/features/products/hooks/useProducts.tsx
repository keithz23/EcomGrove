import { productService } from "@/app/services/admin/product.service";
import { IProducts } from "@/app/types/products/product.interface";
import { getErrorMessage } from "@/app/utils/getMessageError.util";
import { useCallback, useEffect, useState } from "react";

export default function useProducts(
  page: number,
  limit: number,
  all: string,
  isAdmin: boolean,
  price?: number,
  sort?: string,
  categories?: string[]
) {
  const [products, setProducts] = useState<IProducts[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await productService.findAllProduct(
        page,
        limit,
        all,
        isAdmin,
        sort,
        price ?? undefined,
        categories
      );
      const resData = res.data;

      setTotalItems(resData.totalItems || 0);
      setProducts(resData.data || []);

      const calculatedTotalPages = Math.ceil((resData.totalItems || 0) / limit);
      setTotalPages(resData.totalPages || calculatedTotalPages);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, all, price, isAdmin, sort, categories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    totalPages,
    totalItems,
    loading,
    error,
    refetch: fetchProducts,
  };
}
