import { api } from "../lib/api";
import { LoginRequest, LoginResponse } from "../types/auth";

export async function loginRequest(data: LoginRequest) {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );
  return response.data;
}
