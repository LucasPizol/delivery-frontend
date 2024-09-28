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

export const UserInfoSteps = ({ form }: UserTypeStepsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="user.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input {...field} type="text" placeholder="Digite seu nome" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="user.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="exemplo@exemplo.com"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="user.document"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="000.000.000-00"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="user.password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Senha</FormLabel>
            <FormControl>
              <Input {...field} type="password" placeholder="*******" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="user.confirm_password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirme sua senha</FormLabel>
            <FormControl>
              <Input {...field} type="password" placeholder="*******" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
