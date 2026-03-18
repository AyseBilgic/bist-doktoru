import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "BIST Doktoru - Türkiye'nin Kapsamlı Finans Platformu",
  description:
    "BIST hisse senetleri, kripto paralar, döviz kurları, piyasa analizleri ve portföy yönetimi. TCMB döviz verileri, Binance kripto fiyatları ve gerçek zamanlı piyasa bilgileri.",
  keywords: "BIST, borsa, kripto, döviz, TCMB, Binance, hisse senedi, portföy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Layout>{children}</Layout>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "hsl(222, 47%, 10%)",
              border: "1px solid hsl(222, 30%, 20%)",
              color: "hsl(210, 40%, 95%)",
            },
          }}
        />
      </body>
    </html>
  );
}
