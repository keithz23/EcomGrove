import { useState } from "react";
import axios from "axios";
import { categoryService } from "@/app/services/admin/category.service";
import { ICategories } from "../types/category.interface";

export function useCategoryDetail() {
  const [category, setCategory] = useState<ICategories | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.findOneCategory(id);
      setCategory(response.data);
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

  return { category, fetchCategory, loading, error };
}
