"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { AuthenticateUserModel } from "@/interfaces/User";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ResetPasswordDialog } from "@/components/reset-password-dialog";
import { toast, Toaster } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().min(1),
  password: z.string().min(6),
});

export default function AuthPage() {
  const { login, user, loading } = useAuth();

  const router = useRouter();

  const form = useForm<AuthenticateUserModel>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthenticateUserModel) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      toast.error("Usuário ou senha incorretos", {
        duration: 3000,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    if (user && !loading) {
      router.push("/pedidos");
    }
  }, [user, loading]);
  if (loading) return null;

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <div className="max-w-lg w-full border-2 border-slate-100 border-solid p-4">
        <Form {...form} onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seu acesso</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nome de usuario ou e-mail"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                className="peer h-4 w-4 text-primary border-primary"
                disabled
              />
              <label
                htmlFor="remember-me"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Lembrar-me
              </label>
            </div>
            <ResetPasswordDialog />
          </div>
          <Button type="submit" className="w-full">
            Acessar
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/cadastrar")}
            variant="secondary"
            className="w-full"
          >
            Cadastrar
          </Button>
        </Form>
      </div>
      <Toaster />
    </main>
  );
}
