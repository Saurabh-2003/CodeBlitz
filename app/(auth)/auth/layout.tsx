
import React from "react";
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <main>
      <div>{children}</div>{" "}
      </main>
  );
}
