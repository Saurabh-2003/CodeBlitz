"use client";
import { ContestRating, Profile } from "@/components/index";
import { LiaClipboardListSolid } from "react-icons/lia";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { GoCheckbox } from "react-icons/go";
import { PiChatsCircleLight } from "react-icons/pi";
import { usePathname } from "next/navigation";
import { useProfileStore } from "@/core/providers/profile-store-provider";
import { useEffect } from "react";
import { UserDetail } from "@/core";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";

const Profilepage = () => {
  const { user, setUser } = useProfileStore((state) => state);
  const { data: session, status } = useSession();

  const location = usePathname();

  const navItems = [
    { name: "Recent AC", path: "/", icon: <LiaClipboardListSolid size={25} /> },
    {
      name: "List",
      path: "/list",
      icon: <HiOutlineClipboardDocumentList size={25} />,
    },
    { name: "Solutions", path: "/Solutions", icon: <GoCheckbox size={25} /> },
    {
      name: "Discuss",
      path: "/Discuss",
      icon: <PiChatsCircleLight size={25} />,
    },
  ];

  const dummyData = [
    {
      title: "Minimum Number of Moves to Seat Everyone",
      daysAgo: "2 hours ago",
    },
    { title: "Sort Colors", daysAgo: "a day ago" },
    { title: "Relative Sort Array", daysAgo: "2 days ago" },
    { title: "Height Checker", daysAgo: "3 days ago" },
    { title: "Subarray Sums Divisible by K", daysAgo: "4 days ago" },
    { title: "Continuous Subarray Sum", daysAgo: "5 days ago" },
    { title: "Replace Words", daysAgo: "6 days ago" },
    { title: "Hand of Straights", daysAgo: "7 days ago" },
    { title: "Count Days Without Meetings", daysAgo: "8 days ago" },
    {
      title: "Minimum Number of Chairs in a Waiting Room",
      daysAgo: "8 days ago",
    },
    { title: "Find Common Characters", daysAgo: "8 days ago" },
    { title: "Longest Palindrome", daysAgo: "9 days ago" },
    {
      title: "Append Characters to String to Make Subsequence",
      daysAgo: "10 days ago",
    },
    { title: "Reverse String", daysAgo: "11 days ago" },
    { title: "Score of a String", daysAgo: "12 days ago" },
  ];

  useEffect(() => {
    console.log("session  : " + session);
  }, [session]);

  useEffect(() => {
    const fetchUser = async () => {
      const response: any = await UserDetail();
      console.log("response : ", response);
      setUser(response);
    };
    fetchUser();
  }, [setUser]);

  return (
    <main className="flex gap-6 py-6 px-20 min-h-screen">
      <Profile />

      <div className="flex flex-col gap-4 rounded-xl w-full">
        <ContestRating />

        <div className="flex gap-4">
          <div className="h-52 shadow-md rounded-xl bg-white w-full"></div>
          <div className="h-52 shadow-md rounded-xl bg-white w-full"></div>
        </div>

        <div className="h-52 shadow-md rounded-xl bg-white w-full"></div>

        <div className="h-fit flex gap-4 flex-col p-4 shadow-md rounded-xl bg-white w-full">
          <nav>
            <ul className="flex gap-6">
              {navItems.map((item) => (
                <li
                  key={item.path}
                  className={location === item.path ? "active" : ""}
                >
                  <div className="flex gap-2 px-4 py-2 bg-zinc-100 rounded-xl items-center text-sm text-slate-700">
                    {item.icon}
                    {item.name}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex text-sm flex-col ">
            {dummyData.map((d) => (
              <li
                className="flex p-4 odd:bg-zinc-100 rounded-xl justify-between items-center"
                key={d.title}
              >
                <span className="text-slate-800">{d.title}</span>
                <span className="text-slate-500">{d.daysAgo}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Profilepage;
