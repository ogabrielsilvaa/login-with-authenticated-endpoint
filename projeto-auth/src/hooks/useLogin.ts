"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { LoginRequest } from "../types/auth";

export function useLogin() {
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
  });

  return {
    submit: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
