import { IProducts } from "../products/product.interface";

export interface IAddToCart {
  productId: string;
  quantity: number;
}

export interface IUpdateCart {
  cartItemId: string;
  newQuantity: number;
}

export interface ICart {
  id: string;
  quantity: number;
  product: IProducts;
}
