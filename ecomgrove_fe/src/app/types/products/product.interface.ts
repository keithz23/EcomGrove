import { ICategories } from "../categories/categories.interface";

export interface IProducts {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  createdAt: string;
  status?: string;
  isActive?: boolean;
  category: ICategories;
}
