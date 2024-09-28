import { OrderStatus } from "@/interfaces/Order";

export const orderStatusConfig: Record<
  OrderStatus,
  { color?: string; text: string }
> = {
  [OrderStatus.PENDING]: {
    color: "blue",
    text: "Pendente",
  },
  [OrderStatus.DELIVERED]: {
    color: "green",
    text: "Entregue",
  },
  [OrderStatus.CANCELED]: {
    color: "red",
    text: "Cancelado",
  },
  [OrderStatus.NOT_ATTENDED]: {
    color: undefined,
    text: "Não atendido",
  },
};
