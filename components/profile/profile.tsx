"use client";
export const dynamic = "force-dynamic";
import { useProfileStore } from "@/core/providers/profile-store-provider";
import Image from "next/image";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { HiOutlineTag } from "react-icons/hi";
import { IoIosChatbubbles } from "react-icons/io";
import { IoCheckbox, IoEyeSharp, IoLocationOutline } from "react-icons/io5";

export const Profile = () => {
  const { user, error, success, message, isAuthenticated } = useProfileStore(
    (state) => state,
  );
  console.log(Object.entries(user ?? ""));
  const [name, setName] = useState("Saurabh Thapliyal");
  const [username, setUsername] = useState("grinding_leetcode");
  const [rank, setRank] = useState(83437);
  const [skills, setSkills] = useState([
    "ReactJS",
    "TailwindCSS",
    "MongoDB",
    "Express",
  ]);
  const [languages, setLanguages] = useState([
    { name: "C++", sol: 480 },
    { name: "MySQL", sol: 50 },
    { name: "Pandas", sol: 6 },
    { name: "Bash", sol: 2 },
  ]);
  return (
    <aside className="flex flex-col p-4 items-center h-fit bg-white w-1/3">
      <div className="flex h-24 w-full gap-4">
        <Image
          loading="lazy"
          height={40}
          width={40}
          alt="User Image"
          className=" size-20 bg-red-600 rounded-xl overflow-hidden object-fill"
          src={user?.image ? user?.image : "/placeholder.jpg"}
        />
        <div className="flex flex-col gap-3 items-start">
          <div className="flex flex-col items-start">
            <span className="font-bold">{user?.name}</span>
            <span className="text-slate-400 text-sm">{username}</span>
          </div>
          <span className="text-slate-600">Rank {rank}</span>
        </div>
      </div>
      <button className="w-full text-green-500 p-2 rounded-xl text-sm bg-emerald-500/10">
        Edit Profile
      </button>
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

      {/* COmmunity Stats */}
      <div className="flex self-start border-t w-full py-6 gap-4 mt-6 flex-col">
        <h3>Community Stats</h3>
        <div className="flex gap-3">
          <IoEyeSharp className=" text-blue-500" size={20} />
          <div className="flex flex-col gap-1">
            <p className="flex gap-2 text-sm">
              <span className="text-gray-700">Views</span>
              <span>2.1k</span>
            </p>
            <p className="flex gap-1 text-gray-500 text-xs">
              <span>Last Week</span>
              <span className="text-gray-400">0</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <IoCheckbox className=" text-sky-400" size={20} />
          <div className="flex flex-col gap-1">
            <p className="flex gap-2 text-sm">
              <span className="text-gray-700">Solution</span>
              <span>29</span>
            </p>
            <p className="flex gap-1 text-gray-500 text-xs">
              <span>Last Week</span>
              <span className="text-gray-400">0</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <IoIosChatbubbles className="text-emerald-500" size={20} />
          <div className="flex flex-col gap-1">
            <p className="flex gap-2 text-sm">
              <span className="text-gray-700">Discuss</span>
              <span>18</span>
            </p>
            <p className="flex gap-1 text-gray-500 text-xs">
              <span>Last Week</span>
              <span className="text-gray-400">0</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <FaStar className="text-amber-500" size={20} />
          <div className="flex flex-col gap-1">
            <p className="flex gap-2 text-sm">
              <span className="text-gray-700">Reputation</span>
              <span>10</span>
            </p>
            <p className="flex gap-1 text-gray-500 text-xs">
              <span>Last Week</span>
              <span className="text-gray-400">0</span>
            </p>
          </div>
        </div>
      </div>

      <div className="self-start gap-4 flex flex-col border-t w-full py-6">
        <h3>Languages</h3>
        <ul className="flex flex-col text-xs  gap-4">
          {languages.map((l, index) => (
            <div key={index} className="flex justify-between">
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                {l.name}
              </span>
              <p className="flex gap-1">
                {l.sol}
                <span className="text-gray-500">problems solved</span>
              </p>
            </div>
          ))}
        </ul>
      </div>
    </aside>
  );
};
