"use client";
export const dynamic = "force-dynamic";
import { useProfileStore } from "@/core/providers/profile-store-provider";
import Image from "next/image";
import { useEffect } from "react";
import { HiOutlineTag } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";
import StatsCard from "./stats";

export const Profile = () => {
  const { user } = useProfileStore((state) => state);
  const username = "grinding_leetcode";
  const rank = 83437;
  const skills = [
    "ReactJS",
    "TailwindCSS",
    "MongoDB",
    "Express",
    "TailwindCSS",
    "MongoDB",
    "Express",
  ];
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <aside className="flex md:max-w-[300px] max-md:w-full flex-col p-4  items-center  shadow-md  max-sm:w-full border rounded-xl h-fit  ">
      <div className="flex gap-10 flex-col h-full w-full">
        <div className="flex flex-col  h-full items-center  gap-4 w-full">
          <Image
            loading="lazy"
            height={400}
            width={400}
            alt="User Image"
            className=" size-24 bg-red-600 rounded-full overflow-hidden object-fill"
            src={user?.image ? user?.image : "/placeholder.jpg"}
          />
          <div className="flex flex-col h-full items-center ">
            <span
              className={` font-bold ${user?.role === "ADMIN" ? "text-emerald-500" : "text-yellow-400"}`}
            >
              {user?.role}
            </span>
            <span className="font-bold">{user?.name}</span>
            <span className="text-slate-400 text-sm">{user?.email}</span>
          </div>
          <button className="w-full text-green-500 p-2 mt-4 rounded-xl text-sm bg-emerald-500/10">
            Edit Profile
          </button>
        </div>
        <StatsCard
          totalSolved={120}
          totalProblems={200}
          easySolved={50}
          easyTotal={70}
          mediumSolved={40}
          mediumTotal={80}
          hardSolved={30}
          hardTotal={50}
        />
      </div>
      <div className="flex self-start mt-6 text-sm gap-2 text-gray-700">
        <IoLocationOutline size={18} /> India
      </div>
      <div className="flex self-start mt-6 gap-2 text-gray-700">
        <HiOutlineTag size={18} />
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <li
              key={index}
              className=" text-[11px] py-1 px-2 text-stone-700 bg-stone-100 rounded-full"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
