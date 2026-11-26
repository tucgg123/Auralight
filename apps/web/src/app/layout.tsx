import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import { AvisoDemo } from "@/components/AvisoDemo";
import { Encabezado } from "@/components/Encabezado";
import { Pie } from "@/components/Pie";
import { sitio } from "@/lib/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: {
    default: `${sitio.nombre} · Piezas únicas`,
    template: `%s · ${sitio.nombre}`,
  },
  description: sitio.descripcion,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: sitio.nombre,
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="min-h-dvh">
        <AvisoDemo />
        <Encabezado />
        <main>{children}</main>
        <Pie />
      </body>
    </html>
  );
}
