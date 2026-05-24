"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useProducts } from "../../hooks/useProducts";

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const { products, isLoading, isError, error } = useProducts();
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      const status = (error as any)?.response?.status;
      if (status === 401) {
        logout();
        router.push("/login");
      }
    }
  }, [isError, error]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-sm w-full">
          <p className="text-gray-700 mb-4">Você precisa estar autenticado para acessar esta página.</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            Ir para o login
          </button>
        </div>
      </main>
    );
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function getErrorMessage() {
    const status = (error as any)?.response?.status;
    if (status === 403) return "Você não tem permissão para ver os produtos.";
    return "Não foi possível carregar os produtos.";
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Produtos</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            Sair
          </button>
        </div>

        {isLoading && (
          <p className="text-gray-500 text-sm">Carregando produtos...</p>
        )}

        {isError && (
          <p className="text-red-500 text-sm">{getErrorMessage()}</p>
        )}

        {!isLoading && !isError && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Categoria</th>
                  <th className="px-4 py-3 text-left">Tamanho</th>
                  <th className="px-4 py-3 text-right">Preço</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{product.id}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-gray-600">{product.categories.name}</td>
                    <td className="px-4 py-3 text-gray-600">{product.size ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-800 text-right font-medium">
                      {Number(product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
