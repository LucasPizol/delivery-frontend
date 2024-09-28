import { OrderItem } from "@/interfaces/OrderProducts";
import { ApiService } from "./api.service";

class OrderItemsService {
  async loadOrderItems(orderId?: string): Promise<OrderItem[]> {
    return await ApiService.get(`/order_items/${orderId}`);
  }
}

export const orderProductService = new OrderItemsService();
