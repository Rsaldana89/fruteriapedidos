import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./providers";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { CartDrawer } from "./components/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://abf-alimentos.example.com"),
  title: "ABF Maxi Alimentos | Abastecimiento en Querétaro",
  description: "Frutas, verduras, abarrotes, granos, semillas y chiles secos con entrega y atención personalizada en Querétaro.",
  openGraph: { title: "ABF Maxi Alimentos", description: "Cultivamos confianza. Entregamos calidad.", type: "website", locale: "es_MX" },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/brand/abf-icon.png",
    shortcut: "/brand/abf-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body className="antialiased"><CartProvider><SiteHeader />{children}<SiteFooter /><CartDrawer /></CartProvider></body>
    </html>
  );
}
