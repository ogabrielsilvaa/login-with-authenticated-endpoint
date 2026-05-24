export type User = {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: "USER" | "ADMIN";
  created_at: string;
  updated_at: string;
}

export type LoginRequest = {
  email: string;
  password: string;
}

export type LoginResponse = {
  token: string;
  user?: User;
}
