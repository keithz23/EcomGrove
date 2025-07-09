import { EService } from "@/app/enums/EService";
import { ECategoryService } from "@/app/enums/services/categories/ECategoryService";
import { instance } from "@/lib/axios";

export const categoryService = {
  findAllCategories: (page: number, limit: number, all: string) => {
    const query = all === "true" ? "all=true" : `page=${page}&limit=${limit}`;
    const url = `${EService.CATEGORY_SERVICE}/${ECategoryService.FIND_ALL}?${query}`;
    return instance.get(url);
  },
};
