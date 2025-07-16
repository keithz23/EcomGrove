import { IProducts } from "@/app/types/products/product.interface";

export interface ICategories {
  id: string;
  name: string;
  description: string;
  productCount: number;
  products: IProducts[];
}
