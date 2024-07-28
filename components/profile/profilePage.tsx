"use client";

import { Profile } from "@/components/index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDetail } from "@/core";
import { useProfileStore } from "@/core/providers/profile-store-provider";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { GoCheckbox } from "react-icons/go";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { LiaClipboardListSolid } from "react-icons/lia";
import { PiChatsCircleLight } from "react-icons/pi";

const Profilepage = () => {
  const { user, setUser } = useProfileStore((state) => state);
  const { status } = useSession();
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
    const fetchUser = async () => {
      const response: any = await UserDetail();
      setUser(response);
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
    <main className="flex max-md:flex-col gap-6 mt-4 min-h-screen w-full">
      <div className="min-w-72">
        <Profile />
      </div>

      <div className="flex flex-col gap-4 rounded-xl w-full bg-white">
        <Tabs defaultValue="recent-ac" className="w-full h-full p-2">
          <TabsList className="flex h-fit w-full overflow-x-auto bg-transparent">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.path}
                value={item.name.toLowerCase().replace(" ", "-")}
                className="flex items-center gap-2 bg-transparent "
              >
                {item.icon}
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="recent-ac">
            <ul className="flex text-sm flex-col gap-2 ">
              {dummyData.map((d) => (
                <li
                  className="flex p-4 odd:bg-zinc-100 rounded-xl  justify-between items-center"
                  key={d.title}
                >
                  <span className="text-slate-800">{d.title}</span>
                  <span className="text-slate-500">{d.daysAgo}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="list">
            <div>List Content</div>
          </TabsContent>

          <TabsContent value="solutions">
            <div>Solutions Content</div>
          </TabsContent>

          <TabsContent value="discuss">
            <div>Discuss Content</div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Profilepage;
