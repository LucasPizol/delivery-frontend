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
import { AddMotorCurierModel } from "@/interfaces/MotorCurier";
import { motorCurierService } from "@/services/motor-curier.service";

const schema = z.object({
  name: z.string().min(1),
});

export const AddMotorCurier = () => {
  const [open, setOpen] = useState(false);

  const { succeed } = useInsert(motorCurierService.createMotorCurier, "motor-curiers");

  const form = useForm<AddMotorCurierModel>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: AddMotorCurierModel) => {
    try {
      await succeed(data);
      toast.success("Motoboy adicionado com sucesso!");
      setOpen(false);
    } catch (error) {
      toast.error("Erro ao adicionar motoboy");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button>Adicionar motoboy</Button>
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
          <DialogTitle>Adicionando motoboy</DialogTitle>
          <DialogDescription>Adicione aqui o motoboy</DialogDescription>
        </DialogHeader>

        <Form {...form} onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nome do motoboy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
