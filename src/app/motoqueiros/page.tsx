"use client";

import { AddMotorCurier } from "@/components/add-motor-curier";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { motorCurierService } from "@/services/motor-curier.service";

export default function MotorCuriers() {
  const { user } = useAuth();

  const { data } = useFetch({
    queryKey: ["motor-curiers"],
    queryFn: motorCurierService.getMotorCuriers,
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
        <AddMotorCurier />
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex items-start justify-start flex-wrap">
        {data &&
          data.map((motorCurier) => (
            <Card>
              <CardHeader className="flex justify-between gap-4 items-center">
                <CardTitle>{motorCurier.name}</CardTitle>
                <CardTitle>{motorCurier.code}</CardTitle>
              </CardHeader>
            </Card>
          ))}
      </div>
    </div>
  );
}
