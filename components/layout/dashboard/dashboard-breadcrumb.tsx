"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

const BreadCrumbs: React.FC = () => {
  const pathname = usePathname();

  const pathParts = pathname
    ? pathname.split("/").filter((part) => part !== "")
    : [];
  const breadcrumbs = pathParts.map((part, index) => {
    const label =
      part.replace("%20", " ").charAt(0).toUpperCase() + part.slice(1);
    const href = `/${pathParts.slice(0, index + 1).join("/")}`;

    return { label, href };
  });

  return (
    <Breadcrumb className="text-xs flex items-center w-full mb-10 p-4 rounded-xl bg-white shadow-md border dark:bg-zinc-800">
      <BreadcrumbList className="flex items-center w-auto px-0">
        <BreadcrumbItem>
          <span className="flex flex-row items-center gap-1">
            <Home className="h-4 w-4" />
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </span>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {/* Use a separator before breadcrumb items but not inside them */}
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink href={crumb.href}>
                <span className="flex items-center gap-1">
                  {decodeURIComponent(crumb.label)}
                </span>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbs;
