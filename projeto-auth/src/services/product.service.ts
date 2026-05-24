import { productsApi } from "../lib/productsApi";
import { Product } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  const response = await productsApi.get<Product[]>("/products");
  return response.data;
}