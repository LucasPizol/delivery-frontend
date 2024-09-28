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
import { useEffect, useState } from "react";
import { AddProductModel, ProductModel } from "@/interfaces/Product";
import { Textarea } from "../ui/textarea";
import { useInsert } from "@/hooks/useInsert";
import { productService } from "@/services/product.service";
import { useUpdate } from "@/hooks/useUpdate";

const schema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.string().min(1),
  description: z.string().optional(),
});

interface ProductDialogProps {
  product?: ProductModel;
  setSelectedProduct: (product?: ProductModel) => void;
}

export const ProductDialog = ({
  product,
  setSelectedProduct,
}: ProductDialogProps) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();

  const form = useForm<AddProductModel>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      name: "",
      image: "",
      price: 0,
    },
  });

  const { succeed } = useInsert(productService.addProduct, "products");
  const { update } = useUpdate(
    () => productService.updateProduct(product?.id ?? "", form.getValues()),
    "products"
  );

  const onSubmit = async (data: AddProductModel) => {
    try {
      if (product) {
        await update({
          ...product,
          ...data,
          price: parseFloat(data.price.toString()),
          image_file: file,
        });
        toast.success("Produto atualizado com sucesso!");
        setOpen(false);
        return;
      }
      await succeed({
        ...data,
        price: parseFloat(data.price.toString()),
        image_file: file,
      });
      toast.success("Produto adicionado com sucesso!");
      setOpen(false);
    } catch (error) {
      toast.error("Erro ao adicionar produto");
    }
  };

  useEffect(() => {
    if (product) {
      setOpen(true);
      form.reset(product);
    }
  }, [product]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setSelectedProduct(undefined);
        form.reset({});
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedProduct(undefined);
            setOpen(true);
            form.reset({});
          }}
        >
          {product ? "Editar produto" : "Adicionar produto"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {product ? "Editando seu produto" : "Adicionando seu produto"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Edite as informações do seu produto"
              : "Adicione aqui o seu produto"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form} onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nome do produto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Preço do produto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição (opcional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Breve descrição..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            <FormLabel>Imagem do produto</FormLabel>
            <Input
              type="file"
              placeholder="Imagem do produto"
              accept="image/*"
              onChange={(e) => {
                const file = Array.from(e.target.files!)[0];
                setFile(file);
              }}
            />
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
            {product ? "Editar" : "Adicionar"}
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
