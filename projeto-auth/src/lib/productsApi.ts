import axios from "axios";

export const productsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PRODUCTS_API_URL,
});