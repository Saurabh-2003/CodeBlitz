"use client";

import { ThemeContext } from "@/core/context/theme-context";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { BsSun } from "react-icons/bs";
import { MdDarkMode } from "react-icons/md";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const themeContext = useContext(ThemeContext);

  if (pathname.includes("problem/") || pathname.includes("/dashboard")) {
    return null;
  }

  const isActiveRoute = (route: string) => {
    return pathname.includes(route)
      ? "border-b-2 border-amber-400"
      : "text-gray-500";
  };

  return (
    <div
      className={`flex shadow-sm py-2 justify-between min-h-10 w-full px-2 items-center `}
    >
      <div className="w-1/3">
        <Image
          src="/images/leetcode.png"
          width={38}
          height={38}
          alt="LeetCode logo"
          className="p-2"
        />
      </div>

      <div className="flex gap-4 p-2 justify-center w-1/3 items-center">
        <ul
          className={`flex items-center gap-4 max-sm:hidden text-sm cursor-pointer ${
            themeContext?.theme === "light" ? "text-gray-800" : "text-gray-300"
          }`}
        >
          <li onClick={() => router.push("/")} className={isActiveRoute("/")}>
            Home
          </li>
          <li
            onClick={() => router.push("/problem")}
            className={isActiveRoute("problem")}
          >
            Problems
          </li>
          <li
            onClick={() => router.push("/about")}
            className={isActiveRoute("about")}
          >
            About
          </li>
        </ul>
      </div>

      <ul className="flex gap-4 w-1/3 justify-end items-center">
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
        <li>
          <Image
            src="/images/placeholder.jpg"
            width={25}
            height={25}
            alt="User avatar"
            className="rounded-full"
          />
        </li>
        <li
          className={`text-sm font-mono px-4 py-2 rounded-md ${
            themeContext?.theme === "light"
              ? "text-amber-500 bg-orange-200/30 hover:bg-[#ffa11633]"
              : "text-orange-400 bg-orange-800/30 hover:bg-[#b66d13]"
          } cursor-pointer`}
        >
          Premium
        </li>
      </ul>
    </div>
  );
};

export default Header;
