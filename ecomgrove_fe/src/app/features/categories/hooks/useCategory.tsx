import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/app/utils/getMessageError.util";
import { categoryService } from "@/app/services/public/category.service";
import { ICategories } from "../types/category.interface";

export default function useCategory(page: number, limit: number, all: string) {
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoryService.findAllCategories(page, limit, all);
      const resData = res.data;
      setCategories(resData.data);
      setTotalPages(resData.totalPages);
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  return { categories, totalPages, loading, error, refetch: fetchCategories };
}
