"use client";
export const dynamic = "force-dynamic";
import { useProfileStore } from "@/core/providers/profile-store-provider";
import Image from "next/image";
import { useEffect } from "react";
import { HiOutlineTag } from "react-icons/hi";
import StatsCard from "./stats";
import UpdateProfileDialogue from "./updateProfileDialog";

interface ProfileProps {
  problemCounts: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
  };
}

export const Profile: React.FC<ProfileProps> = ({ problemCounts }) => {
  const { user } = useProfileStore((state) => state);

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
          <UpdateProfileDialogue user={user} />
        </div>
        <StatsCard
          totalSolved={
            (user?.easySolved || 0) +
            (user?.mediumSolved || 0) +
            (user?.hardSolved || 0)
          }
          totalProblems={
            problemCounts?.EASY + problemCounts?.MEDIUM + problemCounts?.HARD
          }
          easySolved={user?.easySolved || 0}
          easyTotal={problemCounts?.EASY}
          mediumSolved={user?.mediumSolved || 0}
          mediumTotal={problemCounts?.MEDIUM}
          hardSolved={user?.hardSolved || 0}
          hardTotal={problemCounts?.HARD}
        />
      </div>

      {user?.skills && (
        <div className="flex self-start mt-6 gap-2 text-gray-700">
          <HiOutlineTag size={30} />
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
      )}
    </aside>
  );
};
