"use client";

import { Profile } from "@/components/index";
import { UserDetail } from "@/core";
import { useProfileStore } from "@/core/providers/profile-store-provider";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Label } from "../ui/label";

const Profilepage = () => {
  const { user, setUser } = useProfileStore((state) => state);
  const { status } = useSession();
  const location = usePathname();

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
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const response: any = await UserDetail();
      setUser(response.user);
    };

    if (!user && status === "authenticated") {
      fetchUser();
    }
  }, [user, setUser, status]);

  useEffect(() => {
    if (user) {
      console.table("user  : " + user?.email);
    }
  }, [user]);

  return (
    <main className="flex  max-md:flex-col  items-start  gap-6 p-10 min-h-screen w-full">
      <div className=" max-md:w-full ">
        <Profile />
      </div>

      <div className="flex flex-col gap-4 shadow-md border  rounded-xl w-full  p-8">
        <Label className="text-center bg-gray-200 py-4 rounded-md border">
          {" "}
          Recent AC
        </Label>
        <ul className="flex text-sm flex-col gap-2">
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
    </main>
  );
};

export default Profilepage;
