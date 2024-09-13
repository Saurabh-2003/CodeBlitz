import { authOptions } from "@/core/auth/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return <main>{children}</main>;
}
