"use client";
import BreadCrumbs from "@/components/layout/dashboard/dashboard-breadcrumb";
import DashboardSidebar from "@/components/layout/dashboard/dashboard-sidebar";
import { useAdminCheck } from "@/core/hooks/verify-admin-user";
import { redirect } from "next/navigation";
import React, { useState } from "react";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuShowMobile, setMenuShowMobile] = useState(false);
  const { isAdmin, loading, error } = useAdminCheck();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex gap-2 h-dvh p-4">
      <div className="w-fit">
        <DashboardSidebar
          menuShowMobile={menuShowMobile}
          setMenuShowMobile={setMenuShowMobile}
        />
      </div>
      <div className="w-full flex flex-col px-4 overflow-y-auto">
        <div className="w-full sticky top-0 z-10">
          <BreadCrumbs
            menuShowMobile={menuShowMobile}
            setMenuShowMobile={setMenuShowMobile}
          />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
