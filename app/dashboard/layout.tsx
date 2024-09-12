import BreadCrumbs from "@/components/layout/dashboard/dashboard-breadcrumb";
import DashboardSidebar from "@/components/layout/dashboard/dashboard-sidebar";
import { UserDetail } from "@/core/actions/user";
import getServerSession from "@/core/hooks/getServerSession";
import StoreProvider from "@/core/providers/store-provider";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin");
  } else {
    const { user } = await UserDetail();

    // Correct the role check logic
    if (user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
      redirect("/profile");
    }
  }

  return (
    <div className="flex gap-2 h-dvh p-4">
      <div className="w-fit">
        <DashboardSidebar />
      </div>
      <div className="w-full flex flex-col px-4 overflow-y-auto">
        <div className="w-full sticky top-0 z-10">
          <BreadCrumbs />
        </div>
        <div>
        {children}</div>
      </div>
    </div>
  );
}
