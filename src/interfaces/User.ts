import { GoogleAddressProps } from "@/components/google-address";
import { AddAddressModel } from "./Address";
import { AddCompanyModel, CompanyModel } from "./Company";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface UserModel {
  id: number;
  email: string;
  name: string;
  username: string;
  role: UserRole;
  document: string;
  phone: string;
  company_id: string;
}

export type UserResponse = UserModel & { token: string };

export interface AddUserModel extends Omit<UserModel, "id" | "company_id"> {
  password: string;
  confirm_password: string;

  company: CompanyModel;
}

export interface AuthenticateUserModel {
  email: string;
  password: string;
}

export interface RegisterUserModel {
  user: AddUserModel;
  company: AddCompanyModel;
  address: GoogleAddressProps;
  type: "user" | "customer";
}
