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
 return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-center" />
          <main>{children}</main>
        </AuthProvider>        
      </body>
    </html>
  );
}
