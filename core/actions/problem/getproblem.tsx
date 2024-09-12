"use server";

import { db } from "@/core/db/db";

export const getProblemData = async (problemId: string) => {
  try {
    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
      include: {
        topics: {
          include: {
            topic: true, // This includes the related topic record
          },
        },
        hints: true, // Include hints
        constraints: true,
        submissions:true
      },
    });

    return { problem };
  } catch (error) {
    return { error: "Error Created Problem" };
  }
};
