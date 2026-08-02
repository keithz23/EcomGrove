import { IProducts } from "../products/product.interface";

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: IProducts;
}

export interface IOrder {
  id: string;
  userId: string;
  status: string;
  total: number;
  note?: string | null;
  address?: string | null;
  items: IOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateOrder {
  note?: string;
  address?: string;
}
