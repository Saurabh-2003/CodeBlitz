"use server";

import { authOptions } from "@/core/auth/auth";
import { db } from "@/core/db/db";
import { getServerSession } from "next-auth";

export async function getAllProblems() {
  try {
    // Fetch the current user session
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    // Fetch all problems
    const problems = await db.problem.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
      },
    });

    // If user is not authenticated, return problems with "NOT ATTEMPTED" status
    if (!userEmail) {
      return {
        data: problems.map((problem) => ({
          ...problem,
          status: "NOT ATTEMPTED",
        })),
      };
    }

    // For authenticated users, fetch user and their submissions
    const user = await db.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Fetch submissions for the authenticated user
    const userSubmissions = await db.submission.findMany({
      where: { userId: user.id },
      select: {
        problemId: true,
        status: true,
      },
    });

    // Create a map of problem IDs to their submission status
    const submissionStatusMap = new Map();
    userSubmissions.forEach((submission) => {
      if (
        submission.status === "ACCEPTED" ||
        !submissionStatusMap.has(submission.problemId)
      ) {
        submissionStatusMap.set(submission.problemId, submission.status);
      }
    });

    // Transform the data to include status
    const transformedProblems = problems.map((problem) => ({
      ...problem,
      status:
        submissionStatusMap.get(problem.id) === "ACCEPTED"
          ? "ACCEPTED"
          : submissionStatusMap.has(problem.id)
            ? "ATTEMPTED"
            : "NOT ATTEMPTED",
    }));

    return { data: transformedProblems };
  } catch (error) {
    console.error("Error fetching problems:", error);
    return { error: "Internal server error" };
  }
}
