"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/auth";
import { db } from "../db/db";

const GetServerSession = async () => {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    return error;
  }
};

export default GetServerSession;
