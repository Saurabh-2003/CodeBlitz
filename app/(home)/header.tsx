import Image from "next/image";
import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoMdFlame } from "react-icons/io";
import { LuBell } from "react-icons/lu";

const Header = () => {
  return (
    <div className="flex shadow-sm py-2 justify-between bg-white min-h-10 w-full px-20 items-center">
      <div className="flex gap-8 items-center">
        <Image
          src="/images/leetcode.png"
          width={38}
          height={38}
          alt="LeetCode logo"
          className="p-2"
        />
        <ul className="flex gap-6 text-gray-500 ml-4 cursor-pointer">
          <li>Explore</li>
          <li>Problems</li>
          <li>Contest</li>
          <li>Discuss</li>
          <li className="flex gap-2 items-center">
            Interview <FaChevronDown size={12} />
          </li>
          <li className="flex gap-2 text-yellow-500 items-center">
            Store <FaChevronDown size={12} />
          </li>
        </ul>
      </div>

      <ul className="flex gap-4 items-center">
        <li className="relative">
          <LuBell className="size-[18px] text-slate-500" />
          <span className=" bg-red-500 size-[6px] rounded-full absolute top-0 right-[3px]" />
        </li>
        <li className="text-amber-600 flex items-center gap-1">
          <IoMdFlame className="size-[22px] " />
          <span className="text-sm">86</span>
        </li>
        <li>
          <Image
            src="/images/placeholder.jpg"
            width={25}
            height={25}
            alt="LeetCode logo"
            className="rounded-full"
          />
        </li>
        <li className=" text-sm font-mono text-amber-500 px-4 py-2 bg-orange-200/30 hover:bg-[#ffa11633] cursor-pointer rounded-md">
          Premium
        </li>
      </ul>
    </div>
  );
};

export default Header;
