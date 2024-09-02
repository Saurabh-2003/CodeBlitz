"use server";

import { db } from "@/core/db/db";

export async function getAllProblems() {
  try {
    // Fetch problems with their submissions
    const problems = await db.problem.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
        submissions: {
          select: {
            status: true,
          },
        },
      },
    });

    // Transform the data to include acceptance percentage
    const transformedProblems = problems.map((problem) => {
      const totalSubmissions = problem.submissions.length;
      const acceptedSubmissions = problem.submissions.filter(
        (submission) => submission.status === "ACCEPTED",
      ).length;
      const acceptancePercentage =
        totalSubmissions > 0
          ? (acceptedSubmissions / totalSubmissions) * 100
          : 0;

      return {
        title: problem.title,
        difficulty: problem.difficulty,
        acceptancePercentage: acceptancePercentage.toFixed(2), // rounding to 2 decimal places
      };
    });

    return { data: transformedProblems };
  } catch (error) {
    console.error("Error fetching problems:", error);
    return { error: "Internal server error" };
  }
}
