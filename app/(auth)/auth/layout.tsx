import { authOptions } from "@/core/auth/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/profile");
  }

  return <main>{children}</main>;
}
