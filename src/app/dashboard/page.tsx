"use client";

import { Bar, BarChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useFetch } from "@/hooks/useFetch";
import { orderService } from "@/services/order.service";
import { OrderModel } from "@/interfaces/Order";
import { useMemo } from "react";

export default function Component() {
  const { data } = useFetch({
    queryKey: ["orders"],
    queryFn: orderService.getCompanyOrders,
    retry: 0,
    staleTime: 1000 * 60 * 5,
  });

  const getPaymentMethodCount = useMemo(() => {
    const newData = data?.reduce((acc, order) => {
      const find = acc.find(
        (item) => item.month === new Date(order.created_at).getMonth()
      );

      if (find) {
        find[order.payment_method]
          ? (find[order.payment_method] += 1)
          : (find[order.payment_method] = 1);
        return acc;
      }

      acc.push({
        [order.payment_method]: 1,
        month: new Date(order.created_at).getMonth(),
      });
      return acc;
    }, [] as any[]);

    const config = newData
      ?.map((item) => {
        return Object.keys(item).filter((key) => key !== "month");
      })
      .flat();

    const noDuplicated = Array.from(new Set(config));

    const obj: ChartConfig = {};

    for (let i = 0; i < noDuplicated.length; i++) {
      obj[noDuplicated[i] as any] = {
        color: "#2563eb",
        label: noDuplicated[i],
      };
    }

    return {
      data: newData,
      config: obj,
    };
  }, [data]);

  return (
    <ChartContainer
      config={getPaymentMethodCount?.config}
      className="min-h-[200px] w-full"
    >
      <BarChart accessibilityLayer data={getPaymentMethodCount?.data}>
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        {Object.keys(getPaymentMethodCount?.config).map((key) => (
          <Bar dataKey={key} radius={4} />
        ))}
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}
