"use client";

import { Form } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { RegisterUserModel } from "@/interfaces/User";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ArrowBigLeft } from "lucide-react";
import { UserInfoSteps } from "./steps/user-info";
import { CompanyInfoSteps } from "./steps/company-info";
import { AddressInfo } from "./steps/address-info";

const schema = z.object({
  user: z.object({
    email: z.string().min(1),
    password: z.string().min(6),
    name: z.string().min(1),
    type: z.string().min(1),
    confirm_password: z.string().min(6),
    phone: z.string().min(1),
  }),
  company: z.object({
    name: z.string().min(1),
    document: z.string().min(1),
    phone: z.string().min(1),
  }),
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    complement: z.string().optional(),
    district: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipcode: z.string().min(1),
  }),
});

export default function RegisterPage() {
  const { register, user, loading } = useAuth();

  const [current, setCurrent] = useState(0);

  const router = useRouter();

  const form = useForm<RegisterUserModel>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const onSubmit = async (data: RegisterUserModel) => {
    try {
      await register(data);
    } catch (error) {
      toast.error("Usuário ou senha incorretos", {
        duration: 3000,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    if (user && !loading) router.push("/pedidos");
  }, [user, loading]);
  if (loading) return null;

  const handleNext = () => {
    const fieldsToValidate = {
      0: ["user.type"],
      1: ["user.name", "user.email", "user.password", "user.confirm_password"],
      2: ["company.name", "company.document", "company.phone"],
      3: [
        "address.zip_code",
        "address.street",
        "address.district",
        "address.city",
        "address.state",
      ],
    } as any;

    if (current === 2) {
      console.log("submit");
      onSubmit(form.getValues());
      return;
    }

    form.trigger(fieldsToValidate[current]).then((isValid) => {
      if (isValid) {
        setCurrent((prev) => prev + 1);
      }
    });
  };

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <div className="max-w-lg w-full border-2 border-slate-100 border-solid p-4">
        <h1 className="text-2xl font-semibold">Cadastrar</h1>
        <Separator className="my-4" />

        <Form {...form} onSubmit={onSubmit}>
          {current === 0 && <CompanyInfoSteps form={form} />}
          {current === 1 && <AddressInfo form={form} />}
          {current === 2 && <UserInfoSteps form={form} />}

          <Separator className="my-4" />

          <div className="flex items-center gap-2">
            {current > 0 && (
              <Button
                type="button"
                onClick={() => {
                  setCurrent((prev) => prev - 1);
                }}
              >
                <ArrowBigLeft />
              </Button>
            )}

            <Button type="button" className="w-full grow" onClick={handleNext}>
              {current === 2 ? "Finalizar cadastro" : "Próximo"}
            </Button>
          </div>

          <Button
            type="button"
            onClick={() => router.push("/")}
            variant="secondary"
            className="w-full"
          >
            Já tenho uma conta
          </Button>
        </Form>
      </div>
      <Toaster />
    </main>
  );
}
