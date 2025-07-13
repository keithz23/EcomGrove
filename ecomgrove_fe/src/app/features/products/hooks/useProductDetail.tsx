import { useState } from "react";
import axios from "axios";
import { IProducts } from "@/app/types/products/product.interface";
import { productService } from "@/app/services/admin/product.service";

export function useProductDetail() {
  const [product, setProduct] = useState<IProducts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.findOneProduct(id);
      setProduct(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Server error");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return { product, fetchProduct, loading, error };
}
