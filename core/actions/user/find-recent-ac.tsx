"use server";
import { db } from "@/core/db/db";
import { SubmissionStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

// Define the server action
export async function getRecentAcceptedSubmissions(userId: string) {
  const submissions = await db.submission.findMany({
    where: {
      userId: userId,
      status: SubmissionStatus.ACCEPTED,
    },
    select: {
      problem: {
        select: {
          title: true,
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
  const result = await db.problem.groupBy({
    by: ["difficulty"],
    _count: {
      id: true,
    },
  });

  const problemCounts = {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  };

  result.forEach((group) => {
    problemCounts[group.difficulty] = group._count.id;
  });

  let recentSubmissions = submissions.map((submission) => ({
    title: submission.problem.title,
    daysAgo: formatDistanceToNow(new Date(submission.createdAt), {
      addSuffix: true,
    }),
  }));

  return {
    recentSubmissions,
    problemCounts,
  };
}
