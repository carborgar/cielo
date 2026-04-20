import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MunicipiosProvider } from "@/context/MunicipiosContext";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fancy AEMET",
  description: "Tu previsión meteorológica, bonita y limpia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <ThemeProvider>
          <MunicipiosProvider>
            <Header />
            <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
              {children}
            </main>
          </MunicipiosProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
