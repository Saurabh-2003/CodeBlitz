import Image from "next/image";
import {
  FaChevronLeft,
  FaChevronRight,
  FaListUl,
  FaPlay,
} from "react-icons/fa";
import { IoAlarmOutline, IoShuffle } from "react-icons/io5";
import { MdOutlineCloudUpload } from "react-icons/md";
import { TbFlame } from "react-icons/tb";
import { Button } from "../ui/button";

const TopBar = () => {
  return (
    <aside className="flex items-center w-full py-1 text-sm text-slate-600">
      <div className="flex items-center gap-4  w-full">
        <Image
          height={20}
          width={20}
          src={
            "https://leetcode.com/_next/static/images/logo-ff2b712834cf26bf50a5de58ee27bcef.png"
          }
          alt="icon"
          className=" size-6"
        />
        <div className="flex items-center gap-2">
          <FaListUl size={16} />
          <p> Problem List </p>
        </div>

        <div className="flex items-center">
          <FaChevronLeft />
          <FaChevronRight />
        </div>

        <IoShuffle size={24} />
      </div>

      <div className="flex items-center gap-1  w-full">
        <div className="flex gap-2 bg-zinc-200 rounded-sm py-2 px-4 items-center">
          <FaPlay size={20} />
          <span>Run </span>
        </div>
        <div className="flex gap-2 bg-zinc-200 text-green-600 rounded-sm py-2 px-4 items-center">
          <MdOutlineCloudUpload size={20} />
          <span>Submit </span>
        </div>
        <div className="flex gap-2 bg-zinc-200  rounded-sm p-2 items-center">
          <IoAlarmOutline size={20} />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-1">
          <TbFlame size={24} /> <span>0</span>
        </div>
        <Image
          height={20}
          width={20}
          src={"/placeholder.jpg"}
          alt="placeholderImage"
          className="size-6 rounded-full"
        />

        <Button className=" bg-amber-600/20 text-amber-500"> Premium</Button>
      </div>
    </aside>
  );
};
export default TopBar;
