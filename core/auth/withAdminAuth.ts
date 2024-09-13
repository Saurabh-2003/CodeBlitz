import { Session } from "next-auth";
import { UserDetail } from "../actions/user";
import GetServerSession from "../hooks/getServerSession";

export function withAdminAuth(action: Function) {
  return async (...args: any[]) => {
    const session: Session | null = await GetServerSession();
    if (!session || !session.user?.email) {
      throw new Error("Not authenticated");
    }

    const { user } = await UserDetail();

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      throw new Error("Not authorized");
    }

    return action(...args);
  };
}
