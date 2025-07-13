import { ICreateProduct } from "./create-product.interface";

export interface IUpdateProduct {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  description: string;
  isActive: string;
  picture: string;
  status: string;
}
