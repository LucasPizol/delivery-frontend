import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterUserModel } from "@/interfaces/User";
import { UseFormReturn } from "react-hook-form";

interface UserTypeStepsProps {
  form: UseFormReturn<RegisterUserModel>;
}

export const CompanyInfoSteps = ({ form }: UserTypeStepsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="company.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Empresa</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="Digite o nome da empresa"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="company.document"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CNPJ</FormLabel>
            <FormControl>
              <Input {...field} type="text" placeholder="CNPJ" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="company.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input {...field} type="tel" placeholder="(99) 99999-9999" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
