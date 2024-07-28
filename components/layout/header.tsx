"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BsSun } from "react-icons/bs"; // Add missing import for BsSun
import { MdDarkMode } from "react-icons/md"; // Add missing import for MdModeNight

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.includes("problem/")) {
    return null;
  }
  // Helper function to check if the current route matches the given path
  const isActiveRoute = (route: string) => {
    return pathname.includes(route)
      ? " border-b-2 border-amber-400"
      : "text-gray-500";
  };

  return (
    <div className="flex shadow-sm py-2 justify-between bg-white min-h-10 w-full px-2 items-center">
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
        <ul className="flex items-center gap-4 max-sm:hidden text-sm cursor-pointer">
          <li
            onClick={() => router.push("/home")}
            className={isActiveRoute("home")}
          >
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
        <BsSun className="text-amber-400" size={20} />
        <MdDarkMode size={20} />
        <li>
          <Image
            src="/images/placeholder.jpg"
            width={25}
            height={25}
            alt="User avatar"
            className="rounded-full"
          />
        </li>
        <li className="text-sm font-mono text-amber-500 px-4 py-2 bg-orange-200/30 hover:bg-[#ffa11633] cursor-pointer rounded-md">
          Premium
        </li>
      </ul>
    </div>
  );
};

export default Header;
