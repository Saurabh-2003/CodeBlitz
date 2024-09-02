"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeContext } from "@/core/context/theme-context";
import { useAdminCheck } from "@/core/hooks/verify-admin-user";
import { DashboardIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { BsGear, BsSun } from "react-icons/bs";
import { MdDarkMode } from "react-icons/md";
import { PiSignOut } from "react-icons/pi";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const themeContext = useContext(ThemeContext);
  const { isAdmin, loading, error } = useAdminCheck(); // Use the custom hook

  if (pathname.includes("problem/") || pathname.includes("/dashboard")) {
    return null;
  }

  const isActiveRoute = (route: string) => {
    if (route === "/") {
      return pathname === route
        ? "border-b-2 border-amber-400"
        : "text-gray-500";
    }
    return pathname.includes(route)
      ? "border-b-2 border-amber-400"
      : "text-gray-500";
  };

  return (
    <header className="flex shadow-sm py-2 justify-between min-h-10 w-full px-2 items-center bg-white dark:bg-gray-900">
      <div className="w-1/3">
        <Image
          src="/images/leetcode.png"
          width={38}
          height={38}
          alt="LeetCode logo"
          className="p-2"
        />
      </div>

      <nav className="flex gap-4 p-2 justify-center w-1/3 items-center">
        <ul
          className={`flex items-center gap-4 max-sm:hidden text-sm cursor-pointer ${
            themeContext?.theme === "light" ? "text-gray-800" : "text-gray-300"
          }`}
        >
          <li>
            <a href="/" className={isActiveRoute("/")}>
              Home
            </a>
          </li>
          <li>
            <a href="/problem" className={isActiveRoute("problem")}>
              Problems
            </a>
          </li>
          <li>
            <a href="/about" className={isActiveRoute("about")}>
              About
            </a>
          </li>
        </ul>
      </nav>

      <div className="flex gap-4 w-1/3 justify-end items-center">
        {themeContext?.theme === "light" ? (
          <BsSun
            className="text-amber-400 cursor-pointer"
            size={20}
            onClick={() => themeContext.setTheme("dark")}
          />
        ) : (
          <MdDarkMode
            className="text-gray-600 cursor-pointer"
            size={20}
            onClick={() => themeContext.setTheme("light")}
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="cursor-pointer">
              <Image
                src="/images/placeholder.jpg"
                width={25}
                height={25}
                alt="User avatar"
                className="rounded-full"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="gap-x-2 cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <Image
                src={`/images/placeholder.jpg`}
                alt="User Image"
                height={30}
                width={30}
                className="rounded-full"
              />
              <span> Saurabh Thapliyal </span>
            </DropdownMenuItem>

            {isAdmin && (
              <DropdownMenuItem
                className="gap-x-2 cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                <DashboardIcon />
                <span>Dashboard </span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="gap-x-2 cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              <BsGear />
              <span>Settings </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-x-2 cursor-pointer"
              onClick={() => router.push("/logout")}
            >
              <PiSignOut />
              <span>Signout </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
