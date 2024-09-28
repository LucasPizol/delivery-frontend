export interface ProductModel {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AddProductModel
  extends Omit<ProductModel, "id" | "created_at" | "updated_at"> {
  image_file?: File;
}
