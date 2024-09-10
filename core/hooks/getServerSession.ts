"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth";

const GetServerSession = async () => {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    return error;
  }
};

export default GetServerSession;
