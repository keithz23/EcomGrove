import { category } from "../interfaces";
import toast from "react-hot-toast";
import { categoryService } from "../services/categoryService";
import { useQuery } from "@tanstack/react-query";

export const useCategoryData = () => {
  const fetchCategories = async (): Promise<category[]> => {
    try {
      const response = await categoryService.findAll();

      return response.data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
    } catch (error: unknown) {
      toast.error(`Error while fetching categories data: ${String(error)}`);
      throw error;
    }
  };

  const {
    data: categoriesData = [],
    isLoading,
    error,
    refetch,
  } = useQuery<category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return { categoriesData, isLoading, error, refetch };
};
