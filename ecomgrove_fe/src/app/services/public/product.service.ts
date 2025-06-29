import { EService } from "@/app/enums/EService";
import { EProductsService } from "@/app/enums/services/products/EProductsService";
import { instance } from "@/lib/axios";

export const productService = {
  findAllProduct: (page: number, limit: number, all: string) => {
    const query = all === "true" ? "all=true" : `page=${page}&limit=${limit}`;
    const url = `${EService.PRODUCT_SERVICE}/${EProductsService.FIND_ALL_PRODUCT}?${query}`;
    return instance.get(url);
  },

  findOneProduct: (id: string) => {
    const url = `${EService.PRODUCT_SERVICE}/${EProductsService.FIND_ONE_PRODUCT}/${id}`;
    return instance.get(url);
  },
};
