"use client";

import React, { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { LoginRequest, User } from "../types/auth";
import { authReducer, initialState } from "./authReducer";
import { api } from "../lib/api";
import { productsApi } from "../lib/productsApi";
import { loginRequest } from "../services/auth.service";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) dispatch({ type: "LOGIN", token: saved, user: null as any });
  }, []);

  /*
   * Não deve ser usado localStorage para armazenar token pois é acessível por qualquer JavaScript na página.
   * Um ataque XSS pode ler e exfiltrar o token, comprometendo a sessão.
   *
   * Alternativa em produção: armazenar o token em cookie HttpOnly (inacessível
   * ao JS). O servidor define o cookie via Set-Cookie e o browser o envia
   * automaticamente em cada requisição, eliminando a exposição ao XSS.
   */
  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
    } else {
      localStorage.removeItem("token");
    }
  }, [state.token]);

  useEffect(() => {
    const inject = (config: any) => {
      if (state.token) config.headers.Authorization = `Bearer ${state.token}`;
      return config;
    };
    const id1 = api.interceptors.request.use(inject);
    const id2 = productsApi.interceptors.request.use(inject);
    return () => {
      api.interceptors.request.eject(id1);
      productsApi.interceptors.request.eject(id2);
    };
  }, [state.token]);

  const login = useCallback(async (data: LoginRequest) => {
    const { token, user } = await loginRequest(data);
    dispatch({ type: "LOGIN", token, user: user! });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: !!state.token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado com AuthProvider");
  return ctx;
}
