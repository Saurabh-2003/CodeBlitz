"use server";

import { db } from "@/core/db/db";

export const dashboardGetAllUserDetails = async () => {
  try {
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
