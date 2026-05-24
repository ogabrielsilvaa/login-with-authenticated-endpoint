"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/product.service";
import { Product } from "../types/product";

export const PRODUCTS_QUERY_KEY = "products-list";

export function useProducts() {
  const query = useQuery<Product[], Error>({
    queryKey: [PRODUCTS_QUERY_KEY],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
