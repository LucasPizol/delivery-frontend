"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useFetch } from "@/hooks/useFetch";
import { orderService } from "@/services/order.service";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { OrderModel, OrderStatus } from "@/interfaces/Order";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderDetails } from "@/components/order-details";

export default function Page() {
  const [selectedOrder, setSelectedOrder] = useState<OrderModel>();

  const { data: orders } = useFetch({
    queryKey: ["orders"],
    queryFn: orderService.getCompanyOrders,
    retry: 0,
    refetchOnWindowFocus: true,
  });

  const [filters, setFilters] = useState<{
    status?: OrderStatus;
  }>({
    status: undefined,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    mapRef.current?.getDiv()?.requestFullscreen();
  }, []);

  const markers = useMemo(() => {
    const orderStatus: Record<OrderStatus, string> = {
      [OrderStatus.NOT_ATTENDED]: "black",
      [OrderStatus.PENDING]: "orange",
      [OrderStatus.DELIVERED]: "green",
      [OrderStatus.CANCELED]: "red",
    };

    return (
      orders
        ?.filter((order) => order.status === filters.status || !filters.status)
        .map((order) => {
          return {
            path: "M12,2a8,8,0,0,0-7.992,8A12.816,12.816,0,0,0,12,22v0H12v0a12.816,12.816,0,0,0,7.988-12A8,8,0,0,0,12,2Zm0,11a3,3,0,1,1,3-3A3,3,0,0,1,12,13Z",
            fillOpacity: 1,
            strokeWeight: 0.5,
            scale: 1.2,
            fillColor: orderStatus[order.status],
            id: order.id,
            position: {
              lat: Number(order.lat),
              lng: Number(order.lng),
            },
          };
        }) ?? []
    );
  }, [orders, filters]);

  const ordersCount = useMemo(() => {
    const reduced = orders?.reduce((acc, order) => {
      if (!acc[order.status]) {
        acc[order.status] = 0;
      }

      acc[order.status] += 1;

      return acc;
    }, {} as Record<OrderStatus, number>);

    return {
      ...reduced,
      all: orders?.length,
    };
  }, [orders]);

  return (
    <div className="w-full h-full flex flex-col">
      <OrderDetails order={selectedOrder} setOrder={setSelectedOrder} />
      <div className="w-full pb-6">
        <Select
          defaultValue="all"
          onValueChange={(value) => {
            if (value === "all") {
              setFilters({
                ...filters,
                status: undefined,
              });
              return;
            }

            setFilters({
              ...filters,
              status: value as OrderStatus,
            });
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue>
              {filters.status === OrderStatus.NOT_ATTENDED
                ? "Não atendido"
                : filters.status === OrderStatus.PENDING
                ? "Em preparo"
                : filters.status === OrderStatus.DELIVERED
                ? "Entregue"
                : filters.status
                ? "Cancelado"
                : "Todos"}{" "}
              ( {ordersCount?.[filters.status ?? "all"] ?? 0} )
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>Todos ( {orders?.length} )</SelectItem>
            <SelectItem value={OrderStatus.NOT_ATTENDED}>
              Não atendido ( {ordersCount?.[OrderStatus.NOT_ATTENDED] ?? 0} )
            </SelectItem>
            <SelectItem value={OrderStatus.PENDING}>
              Em preparo ( {ordersCount?.[OrderStatus.PENDING] ?? 0} )
            </SelectItem>
            <SelectItem value={OrderStatus.DELIVERED}>
              Entregue ( {ordersCount?.[OrderStatus.DELIVERED] ?? 0} )
            </SelectItem>
            <SelectItem value={OrderStatus.CANCELED}>
              Cancelado ( {ordersCount?.[OrderStatus.CANCELED] ?? 0} )
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
        zoom={13}
        center={{
          lat: -21.813658,
          lng: -46.546944,
        }}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {markers?.map(({ id, position, ...marker }) => (
          <Marker
            key={id}
            position={{
              lat: Number(position.lat),
              lng: Number(position.lng),
            }}
            icon={marker}
            onClick={() => {
              setSelectedOrder(orders?.find((order) => order.id === id));
            }}
          />
        ))}

        <div className="absolute top-0 left-0 p-8 m-8 bg-white rounded-lg">
          <h1 className="text-lg font-bold">Legenda</h1>
          <Separator className="my-4" />
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black rounded-md"></div>
            <span>Não atendido</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-md"></div>
            <span>Em preparo</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-md"></div>
            <span>Entregue</span>
          </div>
        </div>
      </GoogleMap>
    </div>
  );
}
