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
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useState } from "react";

const schema = z.object({
  email: z.string().email(),
});

export const ResetPasswordDialog = () => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const resetPassword = async (data: { email: string }) => {
    toast.success("Email enviado com sucesso!");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="link">Esqueci minha senha</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recuperação de senha</DialogTitle>
          <DialogDescription>Redefina sua senha aqui</DialogDescription>
        </DialogHeader>

        <Form {...form} onSubmit={resetPassword}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Digite seu e-mail"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex items-center justify-end gap-4">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Enviar</Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
