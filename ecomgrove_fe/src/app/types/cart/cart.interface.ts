export interface IAddToCart {
  productId: string;
  quantity: number;
}

export interface IUpdateCart {
  cartItemId: string;
  newQuantity: number;
}
