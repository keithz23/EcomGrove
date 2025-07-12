import { EService } from "@/app/enums/EService";
import { EAdminService } from "@/app/enums/services/admin/EAdminService";
import { ECategoryService } from "@/app/enums/services/admin/ECategoryService";
import { ICreateCategory } from "@/app/features/categories/types/create-category.interface";
import { IUpdateCategory } from "@/app/features/categories/types/update-category.interface";
import { instance } from "@/lib/axios";

export const categoryService = {
  findAllCategories: (page: number, limit: number, all: string) => {
    const query = all === "true" ? "all=true" : `page=${page}&limit=${limit}`;
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.CATEGORIES}/${ECategoryService.FIND_ALL}?${query}`;
    return instance.get(url);
  },

  findOneCategory: (id: string) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.CATEGORIES}/${ECategoryService.FIND_ONE}${id}`;
    return instance.get(url);
  },

  createCategory: (data: ICreateCategory) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.CATEGORIES}/${ECategoryService.CREATE_CATEGORY}`;
    return instance.post(url, data);
  },

  updateCategory: (data: IUpdateCategory) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.CATEGORIES}/${ECategoryService.UPDATE_CATEGORY}`;
    return instance.patch(url, data);
  },

  deleteCategory: (id: string) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.CATEGORIES}/${id}`;
    return instance.delete(url);
  },
};
