import { EService } from "@/app/enums/EService";
import { EAdminService } from "@/app/enums/services/admin/EAdminService";
import { EProductService } from "@/app/enums/services/admin/EProductService";
import { ICreateProduct } from "@/app/features/products/types/create-product.interface";
import { instance } from "@/lib/axios";

export const productService = {
  findAllProduct: (
    page: number,
    limit: number,
    all: string,
    sort?: string,
    price?: number,
    categories?: string
  ) => {
    const params = new URLSearchParams();

    if (all === "true") {
      params.append("all", "true");
    } else {
      params.append("page", page.toString());
      params.append("limit", limit.toString());
    }

    if (typeof price === "number" && price > 0) {
      params.append("price", price.toString());
    }

    if (sort) {
      params.append("sort", sort.toString());
    }

    if (categories) {
      params.append("categories", categories.toString());
    }

    const url = `${EService.ADMIN_SERVICE}/${EAdminService.PRODUCT}/${
      EProductService.FIND_ALL_PRODUCTS
    }?${params.toString()}`;

    return instance.get(url);
  },

  findOneProduct: (id: string) => {
    const url = `${EService.PRODUCT_SERVICE}/${EProductService.FIND_ONE_PRODUCT}${id}`;
    return instance.get(url);
  },

  createProduct: (ICreateProduct: FormData) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.PRODUCT}/${EProductService.CREATE_PRODUCT}`;
    return instance.post(url, ICreateProduct);
  },

  updateProduct: (IUpdateProduct: FormData) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.PRODUCT}/${EProductService.UPDATE_PRODUCT}`;
    return instance.patch(url, IUpdateProduct);
  },

  deleteProduct: (id: string) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.PRODUCT}/${EProductService.DELETE_PRODUCT}/${id}`;
    return instance.delete(url);
  },
};
