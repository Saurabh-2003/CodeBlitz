"use server";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/auth";

const GetServerSession = async (): Promise<Session | null> => {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
};

export default GetServerSession;
