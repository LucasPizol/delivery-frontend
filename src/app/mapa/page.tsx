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
import { motorCurierService } from "@/services/motor-curier.service";

export default function Page() {
  const [selectedOrder, setSelectedOrder] = useState<OrderModel>();

  const { data: orders } = useFetch({
    queryKey: ["orders"],
    queryFn: orderService.getCompanyOrders,
    retry: 0,
    refetchOnWindowFocus: true,
  });

  const { data: motorCuriers } = useFetch({
    queryKey: ["motor-curiers"],
    queryFn: motorCurierService.getMotorCuriers,
    retry: 0,
    staleTime: 1000 * 60 * 5,
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

        {motorCuriers?.map((motorCurier) => (
          <Marker
            key={motorCurier.id}
            position={{
              lat: Number(motorCurier.lat),
              lng: Number(motorCurier.lng),
            }}
            icon={{
              path: `M17.668,5.734c-0.16-1.202-3.851-1.091-3.684-0.452s-1.252,1.131-1.252,1.131l-2.04,0.397
		C9.451,5.824,8.89,5.515,8.46,5.239C6.789,4.168,5.037,6.375,5.037,6.375S3.415,6.177,5.336,4.256
		C-1.349,7.688,1.833,8.26,1.833,8.26h1.879l-0.3,0.485C3.115,8.614,2.785,8.54,2.437,8.54C1.091,8.54,0,9.632,0,10.977
		c0,1.346,1.091,2.438,2.437,2.438s2.437-1.092,2.437-2.438c0-0.755-0.344-1.429-0.884-1.876l0.258-0.418l2.599,2.896l0,0h0.226
		h4.713h0.584c0.268,1.054,1.222,1.836,2.359,1.836c1.346,0,2.436-1.092,2.436-2.438c0-1.345-1.09-2.437-2.436-2.437
		c-1.23,0-2.244,0.912-2.411,2.096h-0.023c0,0-0.213-0.783-0.592-1.753C12.969,8.46,17.807,6.779,17.668,5.734z M2.438,12.509
		c-0.845,0-1.531-0.687-1.531-1.532c0-0.845,0.687-1.531,1.531-1.531c0.173,0,0.338,0.029,0.493,0.083l-0.528,0.856
		c-0.004,0.006-0.011,0.01-0.015,0.017l-0.221,0.363c-0.001,0.004,0,0.006-0.002,0.008l-0.016,0.026l0.005,0.004
		c-0.07,0.154-0.021,0.34,0.128,0.431c0.148,0.09,0.333,0.049,0.438-0.083l0.007,0.005l0.02-0.032
		c0.001-0.002,0.003-0.003,0.004-0.004l0.099-0.162l0.66-1.073c0.284,0.278,0.46,0.665,0.46,1.093
		C3.969,11.822,3.282,12.509,2.438,12.509z M14.73,9.445c0.844,0,1.531,0.687,1.531,1.531c0,0.846-0.688,1.532-1.531,1.532
		c-0.632,0-1.176-0.385-1.409-0.931h1.859v-0.008h0.043c0.259,0.004,0.472-0.2,0.475-0.46c0.005-0.258-0.202-0.47-0.46-0.475
		l-0.583-0.007c-0.03-0.001-0.059,0.002-0.088,0.007h-1.329C13.392,9.955,14.001,9.445,14.73,9.445z`,
              fillOpacity: 1,
              strokeWeight: 0.5,
              scale: 1.2,
              fillColor: "blue",
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
