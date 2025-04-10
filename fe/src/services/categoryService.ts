import { EService } from "../enums/services";
import { ECategoryService } from "../enums/services/category/ECategoryService";
import { instance } from "../lib/axios";

export const categoryService = {
  findAll: () => {
    const url = `${EService.CATEGORY_SERVICE}/${ECategoryService.FIND_ALL}`;
    return instance.get(url);
  },
};
