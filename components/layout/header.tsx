"use client";

import { useTheme } from "@/core/context/theme-context";
import { useAdminCheck } from "@/core/hooks/verify-admin-user";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BsSun } from "react-icons/bs";
import { MdDarkMode } from "react-icons/md";
import UserDropdownMenu from "../common/user-dropdown-header";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useAdminCheck();
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();

  // Hide Header in certain routes
  if (pathname.includes("problem/") || pathname.includes("/dashboard")) {
    return null;
  }

  // Utility function to check if the route is active
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
    <header className="flex shadow-sm py-2 justify-between min-h-10 w-full px-2 items-center bg-white dark:bg-stone-900/40">
      {/* Logo Section */}
      <div className="w-1/3">
        <Image
          src="/codeblitz.png"
          width={38}
          height={38}
          alt="CodeBlitz logo"
          className="p-2"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-4 p-2 justify-center w-1/3 items-center">
        <ul className="flex items-center gap-4 max-sm:hidden text-sm cursor-pointer text-gray-800 dark:text-gray-300">
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

      {/* User Profile and Theme Toggle */}
      <div className="flex gap-4 w-1/3 justify-end items-center">
        {/* Theme Toggle */}
        {theme === "dark" ? (
          <MdDarkMode
            className="text-gray-600 cursor-pointer"
            size={20}
            onClick={toggleTheme}
          />
        ) : (
          <BsSun
            className="text-amber-400 cursor-pointer"
            size={20}
            onClick={toggleTheme}
          />
        )}

        {/* User Dropdown Menu */}
        <UserDropdownMenu />
      </div>
    </header>
  );
};

export default Header;
