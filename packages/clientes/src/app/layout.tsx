import { AuthProvider } from "@/context/auth";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Clientes ABE",
  description: "Clientes Agencia Boliviana Espacial",
};
const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchContadorStatus = await((await fetch("http://127.0.0.1:3010/api/trafico")).json());
  const fetchPagosStatus = await((await fetch("http://127.0.0.1:3010/api/pagos")).json());
  const fetchSSOStatus = await((await fetch("http://127.0.0.1:3010/api/sso")).json());
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-center" />
          <main>{children}</main>
        </AuthProvider>
      <p>{fetchSSOStatus?.message ? 'online' : 'offline'}</p>        
      <p>{fetchPagosStatus?.message ? 'online' : 'offline'}</p>        
      <p>{fetchContadorStatus?.message ? 'online' : 'offline'}</p>        
      </body>
    </html>
  );
}
