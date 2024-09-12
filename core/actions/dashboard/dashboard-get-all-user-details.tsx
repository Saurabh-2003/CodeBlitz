"use server";

import { authOptions } from "@/core/auth/auth";
import { db } from "@/core/db/db";
import { getServerSession } from "next-auth";

export const dashboardGetAllUserDetails = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { error: "Not logged in" };
    }

    const email = session.user.email;

    if (!email) {
      return { error: "No user found" };
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return { error: "Not a Valid Admin" };
    }

    // Query to get all users with specific fields
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    return { allUsers: allUsers || [] }; // Ensure allUsers is always defined
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    return { error: "Internal server error" };
  }
};
