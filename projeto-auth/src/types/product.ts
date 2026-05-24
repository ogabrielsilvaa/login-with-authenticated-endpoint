export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: string;
  size: string | null;
  created_at: string | null;
  updated_at: string | null;
  categories: Category;
};