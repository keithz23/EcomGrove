import { IProducts } from "../types/products/product.interface";
import { getErrorMessage } from "../utils/getMessageError.util";
import { productService } from "../services/public/product.service";
import { useCallback, useEffect, useState } from "react";

export default function useProducts(
  page: number,
  limit: number,
  all: string,
  price?: number,
  sort?: string
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
        sort,
        price ?? undefined
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
  }, [page, limit, all, price, sort]);

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
