import { AddressModel } from "./Address";

export enum OrderStatus {
  PENDING = "pending",
  DELIVERED = "delivered",
  CANCELED = "canceled",
  NOT_ATTENDED = "not_attended",
}

export interface OrderModel {
  id: string;
  created_at: string;
  updated_at: string;
  status: OrderStatus;
  address: string;
  lat: string;
  lng: string;
  payment_method: string;
  observation?: string;
}

export type AddOrderModel = Omit<
  OrderModel,
  "id" | "created_at" | "updated_at"
> & {
  product_ids: string[];
};
