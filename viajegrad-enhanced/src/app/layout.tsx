import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ViajeGrad — Organizador de Viaje de Egresados",
  description: "Coordiná recaudación, eventos, finanzas y recuerdos para el viaje de egresados.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="bg-cream-100 font-sans antialiased text-navy-900">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
