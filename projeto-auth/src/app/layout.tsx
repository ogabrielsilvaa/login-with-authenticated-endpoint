import type { Metadata } from "next";
import { AuthProvider } from "../contexts/AuthContext";
import { ReactQueryProvider } from "../lib/queryClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}