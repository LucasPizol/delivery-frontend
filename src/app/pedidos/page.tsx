"use client";

import { AddOrderDialog } from "@/components/add-order";
import { OrderCard } from "@/components/order-card";
import { OrderDetails } from "@/components/order-details";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { OrderModel, } from "@/interfaces/Order";
import { orderService } from "@/services/order.service";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();

  const [selectedOrder, setSelectedOrder] = useState<OrderModel>();

  const { data } = useFetch({
    queryKey: ["orders"],
    queryFn: orderService.getCompanyOrders,
    retry: 0,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div>
      <div className="pb-6 flex items-end gap-8">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Pedidos</h1>
          <p>Olá, {user?.name}</p>
        </div>
        <AddOrderDialog />
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex items-start justify-start flex-wrap">
        {data &&
          data.map((order) => (
            <OrderCard order={order} setSelectedOrder={setSelectedOrder} />
          ))}
      </div>
      <OrderDetails order={selectedOrder} setOrder={setSelectedOrder} />
    </div>
  );
}
