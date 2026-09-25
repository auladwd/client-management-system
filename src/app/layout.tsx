import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aulad IT Solution - Client & Operations Management Portal",
  description: "Comprehensive management system for clients, encrypted credentials vault, billing, maintenance history, and representative network.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="dark h-full antialiased" suppressHydrationWarning>
      <body
        className={`${hindSiliguri.variable} font-sans min-h-full flex flex-col bg-slate-950 text-slate-100`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}

