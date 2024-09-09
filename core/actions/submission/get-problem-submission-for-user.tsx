"use server";

import { authOptions } from "@/core/auth/auth";
import { db } from "@/core/db/db";
import { getServerSession } from "next-auth";

const findProblemSubmissions = async (id: string) => {
  try {
    // Await for the session
    const sessionUser = await getServerSession(authOptions);

    if (!sessionUser || !sessionUser?.user?.email) {
      throw new Error("No active user session. Please login.");
    }

    // Find the current user using their email
    const currentUser = await db.user.findUnique({
      where: {
        email: sessionUser.user.email, // Access session email correctly
      },
    });

    if (!currentUser) {
      throw new Error("User is invalid.");
    }

    // Fetch submissions by the current user and id
    const problemSubmissions = await db.submission.findMany({
      where: {
        userId: currentUser.id,
        problemId: id,
      },
      select: {
        id: true,
        code: true,
        createdAt: true,
        status: true,
      },
    });

    return {
      success: true,
      problemSubmissions,
    };
  } catch (error: any) {
    // Return error message in a structured way
    return {
      success: false,
      error: error.message || "Something went wrong.",
    };
  }
};

export default findProblemSubmissions;
