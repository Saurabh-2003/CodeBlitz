"use server";
import { db } from "@/core/db/db";

export async function deleteProblem(problemId: string) {
  try {
    // Delete related records
    await db.submission.deleteMany({
      where: { problemId: problemId },
    });

    await db.problemTopic.deleteMany({
      where: { problemId: problemId },
    });

    await db.hint.deleteMany({
      where: { problemId: problemId },
    });

    await db.constraint.deleteMany({
      where: { problemId: problemId },
    });

    // Delete the problem itself
    await db.problem.delete({
      where: { id: problemId },
    });

    return { success: true, message: "Problem Deleted Successfully!!" };
  } catch (error) {
    console.error("Error deleting problem:", error);
    return { success: false, error: "Failed to delete problem" };
  }
}
