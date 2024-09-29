import { OrderModel, OrderStatus } from "@/interfaces/Order";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { orderStatusConfig } from "@/utils/order-status";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { orderService } from "@/services/order.service";
import { useUpdate } from "@/hooks/useUpdate";
import { toast } from "sonner";
interface OrderProps {
  order: OrderModel;
  setSelectedOrder: (order: OrderModel) => void;
}

export const OrderCard = ({ order, setSelectedOrder }: OrderProps) => {
  const orderNum = order.id.substring(0, 5);
  const orderStatus = orderStatusConfig[order.status];

  const updateStatus = async (data: Partial<OrderModel>) => {
    try {
      return await orderService.updateOrder(order.id, { status: data.status });
    } catch (error) {
      toast.error("Erro ao atualizar o pedido");
    }
  };

  const { update } = useUpdate(updateStatus, "orders");
  const date = new Date(order.created_at);

  const createdAt = `${date.toLocaleDateString(
    "pt-br"
  )} - ${date.toLocaleTimeString("pt-br")}`;

  const isNewerThanTwoMinutes = () => {
    const now = new Date();
    const createdAtDate = new Date(order.created_at);
    const diff = now.getTime() - createdAtDate.getTime();
    return diff < 2 * 60 * 1000 && order.status === OrderStatus.NOT_ATTENDED;
  };

  return (
    <Card key={order.id} className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Pedido #{orderNum}
          {isNewerThanTwoMinutes() && (
            <Badge style={{ background: "red" }}>Novo</Badge>
          )}
        </CardTitle>
        <CardDescription className="flex flex-col items-start gap-1">
          {createdAt}
          <Badge style={{ background: orderStatus?.color }}>
            {orderStatus?.text}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between gap-4 flex-wrap">
        <Select
          defaultValue={order.status}
          onValueChange={(value) => {
            update({ status: value as OrderStatus });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Altere a situação" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Situação</SelectLabel>
              <SelectItem value={OrderStatus.CANCELED}>Cancelado</SelectItem>
              <SelectItem value={OrderStatus.NOT_ATTENDED}>
                Não atendido
              </SelectItem>
              <SelectItem value={OrderStatus.PENDING}>Em preparo</SelectItem>
              <SelectItem value={OrderStatus.DELIVERED}>Entregue</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={() => setSelectedOrder(order)}>Ver detalhes</Button>
      </CardFooter>
    </Card>
  );
};
