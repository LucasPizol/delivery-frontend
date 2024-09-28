import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { AddProductModel, ProductModel } from "@/interfaces/Product";
import { Textarea } from "../ui/textarea";
import { useInsert } from "@/hooks/useInsert";
import { productService } from "@/services/product.service";
import { useFetch } from "@/hooks/useFetch";
import { GoogleAddressProps, GoogleAutoAddressField } from "../google-address";
import { AddOrderModel, OrderStatus } from "@/interfaces/Order";
import { AddressModel } from "@/interfaces/Address";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { orderService } from "@/services/order.service";
import { Separator } from "../ui/separator";

const schema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.string().min(1),
  description: z.string().optional(),
});

export const AddOrderDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [address, setAddress] = useState<GoogleAddressProps | null>(null);

  const { succeed } = useInsert(orderService.createOrder, "orders");

  const { data: products } = useFetch({
    queryKey: ["products"],
    queryFn: productService.getCompanyProducts,
    staleTime: 4 * 60 * 1000,
  });

  const form = useForm<AddOrderModel>({
    resolver: zodResolver(schema),
    defaultValues: {
      observation: "",
      status: OrderStatus.PENDING,
    },
  });

  const onSubmit = async (data: AddOrderModel) => {
    try {
      console.log({
        ...data,
        address,
      });

      if (!address) {
        toast.error("Endereço inválido");
        return;
      }
      await succeed({
        ...data,
        address: address?.address,
        lat: String(address?.coordinates.lat),
        lng: String(address?.coordinates.lng),
        product_ids: selectedProducts,
        status: OrderStatus.PENDING,
      });
      toast.success("Produto adicionado com sucesso!");
      setOpen(false);
    } catch (error) {
      toast.error("Erro ao adicionar produto");
    }
  };

  console.log(address);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button>Adicionar pedido</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          const hasPacContainer = e.composedPath().some((el) => {
            if ("classList" in el) {
              return Array.from((el as Element)?.classList).includes(
                "pac-container"
              );
            }
            return false;
          });

          if (hasPacContainer) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Adicionando seu pedido</DialogTitle>
          <DialogDescription>Adicione aqui o seu pedido</DialogDescription>
        </DialogHeader>

        <span className="text-sm font-medium">Endereço de entrega</span>
        <GoogleAutoAddressField address={address} setAddress={setAddress} />
        <Separator />

        <Form {...form} onSubmit={onSubmit}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Produtos</span>
          </div>
          {products
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map((product) => (
              <div className="flex items-center gap-2" key={product.id}>
                <Checkbox
                  id={product.id}
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedProducts([...selectedProducts, product.id]);
                      return;
                    }
                    setSelectedProducts(
                      selectedProducts.filter((id) => id !== product.id)
                    );
                  }}
                ></Checkbox>
                <label
                  htmlFor={product.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {product.name} -{" "}
                  {Number(product.price).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </label>
              </div>
            ))}
          <Separator></Separator>

          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meio de pagamento</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue>
                        {field.value || "Selecione um método"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cartão de crédito">
                        Cartão de crédito
                      </SelectItem>
                      <SelectItem value="Cartão de débito">
                        Cartão de débito
                      </SelectItem>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Total do pedido: </span>
            <span className="text-sm font-bold">
              {selectedProducts
                .map((id) => products?.find((product) => product.id === id))
                .reduce((acc, product) => {
                  if (!product) return acc;
                  return acc + Number(product.price);
                }, 0)
                .toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
            </span>
          </div>

          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSubmit(form.getValues());
            }}
          >
            Adicionar
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
