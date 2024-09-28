import { AddOrderModel, OrderModel } from "@/interfaces/Order";
import { ApiService } from "./api.service";

export class OrderService {
  async getCompanyOrders() {
    return await ApiService.get<OrderModel[]>("/orders");
  }

  async updateOrder(id: string, order: Partial<OrderModel>) {
    return await ApiService.put<OrderModel>(`/orders/${id}`, order);
  }

  async createOrder(order: AddOrderModel) {
    return await ApiService.post<OrderModel>("/orders", order);
  }
}

export const orderService = new OrderService();
