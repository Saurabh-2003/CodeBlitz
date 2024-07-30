import BreadCrumbs from "@/components/layout/dashboard/dashboard-breadcrumb";
import DashboardSidebar from "@/components/layout/dashboard/dashboard-sidebar";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex gap-2 h-dvh p-4">
      <div className="w-fit">
        <DashboardSidebar />
      </div>
      <div className="w-full flex flex-col px-4 overflow-y-auto">
        <div className="w-full sticky top-0 z-10">
          <BreadCrumbs />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
