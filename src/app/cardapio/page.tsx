"use client";

import { MenuPDF } from "@/components/generate-pdf/menu";
import { OrderCard } from "@/components/order-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFetch } from "@/hooks/useFetch";
import { orderService } from "@/services/order.service";
import { productService } from "@/services/product.service";
import { pdf } from "@react-pdf/renderer";
import Image from "next/image";

export default function Component() {
  const { data } = useFetch({
    queryKey: ["products"],
    queryFn: productService.getCompanyProducts,
    staleTime: 4 * 60 * 1000,
  });

  const handleGeneratePdf = async () => {
    try {
      const file = await pdf(<MenuPDF products={data} />).toBlob();
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = "menu.pdf";
      a.click();
    } catch (error) {}
  };

  return (
    <div className="flex justify-start gap-8 flex-wrap flex-col items-start">
      <Button onClick={handleGeneratePdf}>Baixar PDF</Button>
      <div className="flex items-stretch justify-start gap-8 flex-wrap flex-col">
        {data &&
          data
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((product) => (
              <Alert
                className="flex items-start justify-between w-auto flex gap-8"
                key={product.id}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}

                <div className="flex justify-between flex-col">
                  <div className="flex items-center justify-between gap-8">
                    <AlertTitle className="font-semibold text-lg">
                      {product.name}
                    </AlertTitle>
                    <AlertTitle className="font-semibold text-lg">
                      {product.price.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}{" "}
                    </AlertTitle>
                  </div>

                  <Separator className="my-2" />
                  <AlertDescription>{product.description}</AlertDescription>
                </div>
              </Alert>
            ))}
      </div>
    </div>
  );
}
