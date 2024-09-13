"use client";
export const dynamic = "force-dynamic";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CgLink } from "react-icons/cg";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareGithub } from "react-icons/fa6";
import { HiOutlineTag } from "react-icons/hi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
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

  const  user  = useAppSelector((state) => state.profile.user);

  // State to control whether the UpdateProfileDialogue is open
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDialog = () => {
    setIsDialogOpen((prev) => !prev); // Toggle the state
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <aside className="flex md:max-w-[300px] max-md:w-full flex-col p-4 items-center shadow-md max-sm:w-full border rounded-xl h-fit">
      <div className="flex gap-10 flex-col h-full w-full">
        <div className="flex flex-col h-full items-center gap-4 w-full">
          <div className="flex h-full gap-4 items-center">
          <Avatar className="size-24">
                <AvatarImage src={user?.image || '/placeholder.jpg'} alt="userImage" />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>

            <div className="flex flex-col">
              <Badge className="w-fit text-[8px]">{user?.role}</Badge>

              <span className="font-bold">{user?.name}</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm text-center">{user?.bio}</p>

          <button
            onClick={toggleDialog}
            className="w-full text-green-500 p-2 mt-4 rounded-sm text-sm bg-emerald-500/10"
          >
            Edit Profile
          </button>
          {/* Pass the state to control the dialog's visibility */}
          <UpdateProfileDialogue
            user={user}
            isOpen={isDialogOpen}
            onClose={toggleDialog}
          />
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
      <div className="flex flex-col mt-4 gap-1 text-xs">
        {user?.linkedinUrl && (
          <div className="flex items-center gap-2">
            <FaLinkedin className="fill-blue-600" size={20} />
            <Link
              href={user.linkedinUrl}
              target="_blank"
              className="hover:underline"
            >
              {user.linkedinUrl}
            </Link>
          </div>
        )}
        {user?.githubUrl && (
          <div className="flex items-center gap-2">
            <FaSquareGithub size={20} className="fill-slate-700" />
            <Link
              href={user.githubUrl}
              target="_blank"
              className="hover:underline"
            >
              {user.githubUrl}
            </Link>
          </div>
        )}
        {user?.portfolioUrl && (
          <div className="flex items-center gap-2">
            <CgLink size={20} />
            <Link
              href={user.portfolioUrl}
              target="_blank"
              className="hover:underline"
            >
              {user.portfolioUrl}
            </Link>
          </div>
        )}
      </div>

      {user?.skills && (
        <div className="flex self-start items-center mt-6 gap-2 text-gray-700">
          <HiOutlineTag size={15} />
          <ul className="flex flex-wrap gap-2">
            {user.skills.split(",").map((skill, index) => (
              <Badge variant={"secondary"} className="text-[9px]" key={index}>
                {skill}
              </Badge>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};

export default Profile;
