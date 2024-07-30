"use client";

import { useProfileStore } from "@/core/providers/profile-store-provider";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgChevronDown, CgDarkMode } from "react-icons/cg";
import { ImMenu } from "react-icons/im";
import { IoCreateOutline } from "react-icons/io5";
import { LuShoppingBag } from "react-icons/lu";
import { MdExitToApp, MdLightMode, MdOutlineDashboard } from "react-icons/md";
import { PiPackage } from "react-icons/pi";
import { TbUsers } from "react-icons/tb";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <MdOutlineDashboard size={20} />,
  },
  {
    id: "problems",
    label: "Problems List",
    path: "/dashboard/problems",
    icon: <LuShoppingBag size={20} />,
  },
  {
    id: "create-problem",
    label: "Create Product",
    path: "/dashboard/create-problem",
    icon: <IoCreateOutline size={20} />,
  },
  {
    id: "update-problem",
    label: "Update Problem",
    path: "/dashboard/update-problem",
    icon: <PiPackage size={20} />,
  },
  {
    id: "users",
    label: "Users",
    path: "/dashboard/users",
    icon: <TbUsers size={20} />,
  },
];

const DashboardSidebar = () => {
  const { user, setUser } = useProfileStore((state) => state);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useRouter();
  const location = usePathname();
  const [dark, setDark] = useState(false);
  const [menuShowMobile, setMenuShowMobile] = useState(false);
  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
  };

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (dark) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDark(true);
    }
  }, []);

  useEffect(() => {
    const matchedMenu = menuItems.find((item) => location === item.path);
    if (matchedMenu) {
      setActiveMenu(matchedMenu.id);
    }
  }, [location]);

  const toggleMenu = (menuId: string, path: string) => {
    setActiveMenu(menuId);
    navigate.push(path);
  };

  return (
    <>
      <aside
        className={`relative  h-full shadow-xl  rounded-xl p-8  w-80 transition-transform duration-500 max-sm:z-10 max-sm:bg-white max-sm:absolute  ${menuShowMobile ? "max-sm:translate-x-0" : "max-sm:-translate-x-96"} flex dark:bg-zinc-800  flex-col  bg-white text-black `}
      >
        <div className="flex items-center gap-2 border-b-2 dark:border-b-zinc-800 pb-4">
          <Image
            height={20}
            width={20}
            src={"/images/leetcode.png"}
            alt="Leetcode Icon"
            className=" size-8 dark:bg-zinc-700  text-zinc-700 dark:text-zinc-300 p-1 rounded-lg"
          />
          <span className="font-bold dark:text-zinc-200 "> Leetcode</span>
          <CgChevronDown className=" dark:text-zinc-200 " />
        </div>
        <nav className="flex flex-col gap-4 mt-6">
          {menuItems.map(({ id, label, path, icon }) => (
            <div
              key={id}
              onClick={() => toggleMenu(id, path)}
              className={`flex group font-medium relative overflow-visible  dark:text-slate-400 rounded-lg  cursor-pointer px-2 py-2 gap-2 items-center  dark:hover:text-violet-100 hover:text-amber-600 hover:bg-[#ffa11633] ${activeMenu === id ? "bg-orange-200/30 dark:bg-orange-500/30 text-amber-500   dark:text-violet-100" : "text-slate-700"}`}
            >
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </nav>
        <div className="flex flex-col mt-auto gap-2 font-medium text-slate-600 dark:text-slate-400">
          <div
            className="flex group  overflow-visible   rounded-lg  cursor-pointer px-2 py-2 gap-2 items-center hover:text-amber-600 hover:bg-[#ffa11633]   "
            onClick={toggleTheme}
          >
            {dark ? (
              <CgDarkMode className="text-amber-500 " size={20} />
            ) : (
              <MdLightMode className="text-yellow-300 " size={20} />
            )}
            <span>{dark ? "Dark Mode" : "Light Mode"}</span>
          </div>

          <div
            className="flex group overflow-visible  rounded-lg  cursor-pointer px-2 py-2 gap-2 items-center  dark:hover:text-violet-100 hover:text-amber-600 hover:bg-[#ffa11633]  "
            onClick={() => navigate.push("/products")}
          >
            <MdExitToApp size={20} />
            <span>Exit</span>
          </div>

          <span className="flex border-t-2 dark:border-t-zinc-800 pt-4 items-center gap-2">
            <img
              className="size-10 rounded-full object-fill"
              src={user?.image ? user?.image : "/placeholder.jpg"}
              alt="User-Image"
            />
            <div className="flex flex-col">
              <h3 className="text-sm text-zinc-800 dark:text-slate-200 font-bold">
                {user?.name ? user?.image : "test"}
              </h3>
              <h3 className="text-xs">
                {user?.email ? user?.email : "test@gmail.com"}
              </h3>
            </div>
          </span>
        </div>
      </aside>

      <div
        onClick={() => setMenuShowMobile((prev) => !prev)}
        className={`hidden z-20 absolute max-sm:block ${dark ? "text-white" : "text-slate-700"} top-2 left-6 `}
      >
        <ImMenu size={35} />
      </div>
    </>
  );
};

export default DashboardSidebar;
