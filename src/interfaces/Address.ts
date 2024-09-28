export interface AddressModel {
  id: number;
  address: string;
  lat: string;
  lng: string;
}

export type AddAddressModel = Omit<
  AddressModel,
  "id" | "created_at" | "updated_at"
>;
