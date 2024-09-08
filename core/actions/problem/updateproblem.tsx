"use server";

import { db } from "@/core/db/db";
import { Difficulty } from "@prisma/client";

interface ProblemProp {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  topics: [{ topic: string }];
  hints: string[];
  constraints: string[];
  driverFunction: {
    cplusplus: string;
    python: string;
    javascript: string;
  };
  inputUrl: string;
  outputUrl: string;
}

export const updateProblemData = async (data: ProblemProp) => {
  const {
    id,
    title,
    description,
    difficulty,
    topics,
    hints,
    constraints,
    driverFunction,
    inputUrl,
    outputUrl,
  } = data;

  try {
    // Check if the problem exists
    const problem = await db.problem.findUnique({ where: { id: id } });
    if (!problem) {
      throw new Error("Problem ID is invalid or problem does not exist");
    }

    // Extract Cloudinary public IDs from the URLs (optional)
    const inputPublicId = extractPublicId(inputUrl);
    const outputPublicId = extractPublicId(outputUrl);

    // Map topic names and find existing topic records
    const topicNames = topics.map((topicObj) => topicObj.topic);
    const topicRecords = await db.topic.findMany({
      where: { name: { in: topicNames } },
    });

    // Perform a single update query with all fields
    await db.problem.update({
      where: { id: id },
      data: {
        title,
        description,
        difficulty,
        topics: {
          connectOrCreate: topicRecords.map((topic) => ({
            where: {
              problemId_topicId: {
                problemId: id,
                topicId: topic.id,
              },
            },
            create: {
              topic: {
                connect: { id: topic.id },
              },
            },
          })),
        },
        hints: {
          deleteMany: {}, // Clear out old hints
          create: hints.map((hintObj: any) => ({
            name: hintObj?.hint,
          })),
        },
        constraints: {
          deleteMany: {}, // Clear out old constraints
          create: constraints.map((constraintObj: any) => ({
            name: constraintObj?.constraint,
          })),
        },
        cppDriver: driverFunction.cplusplus,
        jsDriver: driverFunction.javascript,
        pythonDriver: driverFunction.python,
        inputs: inputUrl,
        outputs: outputUrl,
      },
    });

    console.log("Problem updated successfully");
    return { message: "Problem updated successfully" };
  } catch (error) {
    console.error("Error updating problem:", error);

    // Optional cleanup (e.g., Cloudinary)
    // if (inputPublicId) {
    //   await cloudinary.uploader.destroy(inputPublicId);
    // }
    // if (outputPublicId) {
    //   await cloudinary.uploader.destroy(outputPublicId);
    // }

    return {
      error: "Error updating problem. Uploaded files may have been deleted.",
    };
  }
};

// Helper function to extract Cloudinary public ID from the URL
const extractPublicId = (url: string): string | null => {
  const parts = url.split("/");
  const fileWithExtension = parts[parts.length - 1];
  const publicId = fileWithExtension.split(".")[0];
  return publicId || null;
};
