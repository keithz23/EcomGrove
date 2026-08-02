import { ICreateOrder, IOrder } from "@/app/types/orders/order.interface";
import { instance } from "@/lib/axios";

export const orderService = {
  create: (data: ICreateOrder) => instance.post<IOrder>("/orders", data),

  findOne: (orderId: string) => instance.get<IOrder>(`/orders/${orderId}`),
};
