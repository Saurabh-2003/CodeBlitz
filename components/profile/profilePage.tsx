"use client";

import Profile from "./profile";
import { UserDetail } from "@/core/actions/user";
import { getRecentAcceptedSubmissions } from "@/core/actions/user/find-recent-ac";
import { useProfileStore } from "@/core/providers/profile-store-provider";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import fetchUser from "@/lib/features/profile/profileReducer";
interface RecentACSubmission {
  title: string;
  daysAgo: string;
}
const Profilepage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
     if (status === "unauthenticated") {
      router.push("/");
    }
  }, [ status]);
  const dispatch = useAppDispatch();
  useEffect(()=>{
    dispatch(fetchUser())
  }, [])
  
  const  user  = useAppSelector((state) => state.profile.user);
  console.log("user from redux : ", user)
  const location = usePathname();
  const [recentAC, setRecentAC] = useState<RecentACSubmission[]>([]);
  const [problemCounts, setProblemCounts] = useState({
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  });


  useEffect(() => {
    if (user) {
      console.table("user  : " + user?.email);

      // Fetch recent accepted submissions
      const fetchRecentAC = async () => {
        const data = await getRecentAcceptedSubmissions(user.id);
        setRecentAC(data?.recentSubmissions);
        setProblemCounts(data?.problemCounts);
      };

      fetchRecentAC();
    }
  }, [user]);

  return (
    <main className="flex  max-md:flex-col  items-start  gap-6 p-10 min-h-screen w-full">
      <div className=" max-md:w-full ">
        <Profile problemCounts={problemCounts} />
      </div>

      <div className="flex flex-col gap-4 shadow-md border  rounded-xl w-full min-h-dvh  p-8">
        <Label className="text-center bg-gray-200 dark:bg-stone-900/50 py-4 rounded-md border">
          Recent AC
        </Label>
        {recentAC.length > 0 ? (
          <ul className="flex text-sm flex-col gap-2">
            {recentAC.map((d, index) => (
              <li
                className="flex p-4 odd:bg-zinc-100 dark:odd:bg-stone-900/30 rounded-xl justify-between items-center"
                key={index}
              >
                <span className="text-slate-800 dark:text-slate-500">
                  {d.title}
                </span>
                <span className="text-slate-500 dark:text-slate-600">
                  {d.daysAgo}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full w-full flex-grow grid place-items-center">
            <p> No Submissions </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Profilepage;
