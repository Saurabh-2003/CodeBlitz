"use client";
import { Login } from "@/components/index";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Page = () => {
  const { data: session } = useSession();
  if (session) {
    redirect("/home");
  }
  return <Login />;
};
export default Page;
