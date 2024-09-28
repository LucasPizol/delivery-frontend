import { OrderModel } from "@/interfaces/Order";

import { useFetch } from "@/hooks/useFetch";

import { Separator } from "../ui/separator";
import { orderProductService } from "@/services/order-items.service";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

interface OrderDetailsProps {
  order: OrderModel | undefined;
  setOrder: (order: OrderModel | undefined) => void;
}

export const OrderDetails = ({ order, setOrder }: OrderDetailsProps) => {
  const { data } = useFetch({
    queryKey: [`order_products-${order?.id}`],
    queryFn: () => orderProductService.loadOrderItems(order?.id),
    retry: 0,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Sheet
      open={!!order}
      onOpenChange={(open) => {
        if (!open) setOrder(undefined);
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalhes do Pedido #{order?.id.slice(0, 6)}</SheetTitle>
          <SheetDescription>
            Detalhes do pedido feito pelo cliente
          </SheetDescription>
        </SheetHeader>
        <div className="py-8">
          <SheetTitle>Endereço de entrega</SheetTitle>
          <SheetDescription>{order?.address ?? ""}</SheetDescription>
          <Separator className="mt-4 mb-4" />

          <div className="flex items-center justify-start">
            {data?.map((orderProduct) => (
              <Alert className="max-w-md grow">
                <div className="flex items-center justify-between">
                  <AlertTitle className="font-semibold text-lg">
                    {orderProduct.quantity}x {orderProduct.product.name}
                  </AlertTitle>

                  <AlertTitle className="font-semibold text-lg">
                    {(
                      orderProduct.price * orderProduct.quantity
                    ).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </AlertTitle>
                </div>

                <Separator />

                <AlertDescription>
                  Total:{" "}
                  {(orderProduct.price * orderProduct.quantity).toLocaleString(
                    "pt-br",
                    {
                      style: "currency",
                      currency: "BRL",
                    }
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
