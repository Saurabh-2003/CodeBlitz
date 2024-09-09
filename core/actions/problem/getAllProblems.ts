"use server";

import { authOptions } from "@/core/auth/auth";
import { db } from "@/core/db/db";
import { getServerSession } from "next-auth"; // Adjust import according to your setup

export async function getAllProblems() {
  try {
    // Fetch the current user session
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return { error: "User not authenticated" };
    }

    // Fetch user from the database
    const user = await db.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Fetch problems with their submissions
    const problems = await db.problem.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
        submissions: {
          where: {
            userId: user.id,
          },
          select: {
            status: true,
          },
        },
      },
    });

    // Transform the data to include status
    const transformedProblems = problems.map((problem) => {
      // Check for submissions
      const acceptedSubmission = problem.submissions.some(
        (submission) => submission.status === "ACCEPTED",
      );
      const hasSubmission = problem.submissions.length > 0;

      return {
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        status: acceptedSubmission
          ? "ACCEPTED"
          : hasSubmission
            ? "ATTEMPTED"
            : "NOT ATTEMPTED",
      };
    });

    return { data: transformedProblems };
  } catch (error) {
    console.error("Error fetching problems:", error);
    return { error: "Internal server error" };
  }
}
