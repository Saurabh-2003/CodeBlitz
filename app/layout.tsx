import Header from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/core/context/theme-context";
import AuthProvider from "@/core/providers/auth-provider";
import { ProfileStoreProvider } from "@/core/providers/profile-store-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import StoreProvider from "@/core/providers/store-provider";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div
          className={`container px-0 antialiased max-w-[1920px] bg-background  ${inter.className}`}
        >
          
            <AuthProvider>
              <ThemeProvider>
                <Header />
                <Toaster />
                <StoreProvider>
                {children}
                </StoreProvider>
                
              </ThemeProvider>
            </AuthProvider>
        </div>
      </body>
    </html>
  );
}
