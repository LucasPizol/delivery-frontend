import {
  GoogleAddressProps,
  GoogleAutoAddressField,
} from "@/components/google-address";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterUserModel } from "@/interfaces/User";
import axios from "axios";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface UserTypeStepsProps {
  form: UseFormReturn<RegisterUserModel>;
}

export const AddressInfo = ({ form }: UserTypeStepsProps) => {
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState<GoogleAddressProps | null>(null);

  return (
    <>
      <GoogleAutoAddressField
        address={address}
        setAddress={(address) => {
          if (address) {
            form.setValue("address", address as GoogleAddressProps);
            setAddress(address);
          }
        }}
      />
    </>
  );
};
