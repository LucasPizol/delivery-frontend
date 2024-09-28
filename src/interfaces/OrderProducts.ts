import { ProductModel } from "./Product";

export interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  product_id: string;
  order_id: string;
  product: ProductModel;
}
