import { EService } from "../enums/services";
import { EOdersService } from "../enums/services/orders/EOrdersService";
import { instance } from "../lib/axios";

export const ordersService = {
  createOrders: () => {
    const url = `${EService.ORDER_SERVICE}/${EOdersService.CREATE}`;

    return instance.post(url, {}, { withCredentials: true });
  },
};
