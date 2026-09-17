import { BottomNav } from "@/components/bottom-nav";
import { Header } from "@/components/header";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MercadoPreso — compras 100% simuladas",
  description:
    "Paródia do Mercado Livre. Nada é cobrado, nada é enviado, os produtos não existem.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-mp-gray font-sans text-[#333]">
        <Suspense fallback={<div className="h-[92px] bg-mp-yellow" />}>
          <Header />
        </Suspense>
        <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 pb-24 md:pb-10">
          {children}
        </main>
        <footer className="hidden border-t border-black/10 bg-white px-3 py-6 text-center text-xs text-[#999] md:block">
          MercadoPreso é uma paródia. Não somos o Mercado Livre. Nenhum pagamento é processado.
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
