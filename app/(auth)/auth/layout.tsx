import GetServerSession from "@/core/hooks/getServerSession";
import { redirect } from "next/navigation";
import React from "react";
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await GetServerSession();
  if (session) {
    redirect("/profile");
  }
  return (
    <body>
      <div>{children}</div>{" "}
    </body>
  );
}
