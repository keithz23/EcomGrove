import { IProducts } from "@/app/types/products/product.interface";

export interface ICategories {
  id: string;
  name: string;
  description: string;
  products: IProducts[];
}
