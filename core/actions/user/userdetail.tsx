"use server";

import { authOptions } from "@/core/auth/auth";
import { db } from "@/core/db/db";
import { getServerSession } from "next-auth";

export const UserDetail = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session?.user) {
      return { error: "Not logged in" };
    }

    const email = session?.user?.email;

    if (!email) {
      return { error: "no user found" };
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return { user };
  } catch (error: unknown) {
    console.error(error);
    return { e: "Internal server error" };
  }
};
