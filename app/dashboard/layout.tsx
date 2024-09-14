import DashBoardLayout from "@/components/layout/dashboard/dashboard-layout";
import React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashBoardLayout>{children}</DashBoardLayout>;
}
