import { AddProductModel, ProductModel } from "@/interfaces/Product";
import { ApiService } from "./api.service";

export class ProductService {
  async getCompanyProducts() {
    return await ApiService.get<ProductModel[]>("/products");
  }

  async addProduct(product: AddProductModel) {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price.toString());
    formData.append("description", product.description || "");
    if (product.image_file) formData.append("image", product.image_file);

    return await ApiService.post<ProductModel>("/products", formData);
  }

  async updateProduct(id: string, product: Partial<AddProductModel>) {
    const formData = new FormData();

    if (product.name) formData.append("name", product.name);

    if (product.price) formData.append("category", product.price?.toString());

    if (product.description)
      formData.append("description", product.description);

    if (product.image_file) formData.append("image", product.image_file);

    return await ApiService.put<ProductModel>(`/products/${id}`, formData);
  }
}

export const productService = new ProductService();
