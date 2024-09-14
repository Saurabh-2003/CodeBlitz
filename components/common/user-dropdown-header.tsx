import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminCheck } from "@/core/hooks/verify-admin-user";
import { DashboardIcon } from "@radix-ui/react-icons";
import { LogInIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoCodeSlashOutline } from "react-icons/io5";
import { PiSignOut } from "react-icons/pi";

const UserDropdownMenu = () => {
  const router = useRouter();
  const { isAdmin } = useAdminCheck();
  const { data: session, status } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="cursor-pointer">
          <Image
            src={session?.user?.image || "/images/placeholder.jpg"}
            width={25}
            height={25}
            alt="User avatar"
            className="rounded-full"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {status === "unauthenticated" ? (
          <DropdownMenuItem
            className="gap-x-2 cursor-pointer"
            onClick={() => router.push("/auth")}
          >
            <LogInIcon />
            <span>Sign In</span>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem
              className="gap-x-2 cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <Image
                src={session?.user?.image || "/images/placeholder.jpg"}
                alt="User Image"
                height={30}
                width={30}
                className="rounded-full"
              />
              <span>{session?.user?.name || "User"}</span>
            </DropdownMenuItem>

            {isAdmin && (
              <DropdownMenuItem
                className="gap-x-2 cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                <DashboardIcon />
                <span>Dashboard</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="gap-x-2 cursor-pointer"
              onClick={() => router.push("/problem")}
            >
              <IoCodeSlashOutline />
              <span>Problems</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-x-2 cursor-pointer"
              onClick={() => router.push("/auth/logout")}
            >
              <PiSignOut />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
