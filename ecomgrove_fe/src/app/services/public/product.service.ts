import { EService } from "@/app/enums/EService";
import { EProductsService } from "@/app/enums/services/products/EProductsService";
import { instance } from "@/lib/axios";

export const productService = {
  findAllProduct: (
    page: number,
    limit: number,
    all: string,
    isAdmin: boolean,
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

    if (isAdmin) {
      params.append("isAdmin", isAdmin.toString());
    }

    const url = `${EService.PRODUCT_SERVICE}/${
      EProductsService.FIND_ALL_PRODUCT
    }?${params.toString()}`;

    return instance.get(url);
  },

  findOneProduct: (id: string) => {
    const url = `${EService.PRODUCT_SERVICE}/${EProductsService.FIND_ONE_PRODUCT}/${id}`;
    return instance.get(url);
  },
};
