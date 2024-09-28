"use client";

import { ProductDialog } from "@/components/product-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { ProductModel } from "@/interfaces/Product";
import { productService } from "@/services/product.service";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<ProductModel>();

  const { data } = useFetch({
    queryKey: ["products"],
    queryFn: productService.getCompanyProducts,
    staleTime: 4 * 60 * 1000,
  });

  return (
    <div>
      <div className="pb-6 flex items-end justify-start gap-8">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Produtos</h1>
          <p>Olá, {user?.name}</p>
        </div>
        <ProductDialog
          setSelectedProduct={setSelectedProduct}
          product={selectedProduct}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Descrição</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((product) => (
              <TableRow key={product?.id}>
                <TableCell width={70}>
                  <img
                    src={
                      product?.image ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbjpidNNgEsw5FilrgRG31qHay4kKeS_EnyQ&s"
                    }
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    alt={product?.name}
                  />
                </TableCell>
                <TableCell>{product?.name}</TableCell>
                <TableCell>
                  {product?.price?.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>{product?.description || "Sem descrição"}</TableCell>
                <TableCell className="">
                  <div className="flex gap-2">
                    <Edit
                      className="cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    />
                    <Trash
                      className="cursor-pointer"
                      onClick={() => console.log("Deletando")}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
