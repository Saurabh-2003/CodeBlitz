
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
