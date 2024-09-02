"use server";

import { db } from "@/core/db/db";
export async function getAdminAllProblems() {
  try {
    const problems = await db.problem.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        difficulty: true,
        topics: {
          select: {
            topic: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Transform the data to flatten the topics array
    const transformedProblems = problems.map((problem) => ({
      id: problem.id,
      title: problem.title,
      createdAt: problem.createdAt,
      difficulty: problem.difficulty,
      topics: problem.topics.map((pt) => pt.topic.name),
    }));

    return { data: transformedProblems };
  } catch (error) {
    console.error("Error fetching problems:", error);
    return { error: "Internal server error" };
  }
}
