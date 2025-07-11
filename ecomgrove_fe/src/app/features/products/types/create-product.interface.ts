export interface ICreateProduct {
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  description: string;
  isActive: boolean;
  picture: string;
}
