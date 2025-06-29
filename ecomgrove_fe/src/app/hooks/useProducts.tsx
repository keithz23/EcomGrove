import { useCallback, useEffect, useState } from "react";
import { IProducts } from "../types/products/product.interface";
import { getErrorMessage } from "../utils/getMessageError.util";
import { productService } from "../services/public/product.service";

export default function useProducts(page: number, limit: number, all: string) {
  const [products, setProducts] = useState<IProducts[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await productService.findAllProduct(page, limit, all);
      const resData = res.data;
      setProducts(resData.data);
      setTotalPages(resData.totalPages);
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  return { products, totalPages, loading, error, refetch: fetchProducts };
}
