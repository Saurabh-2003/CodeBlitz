"use server";

import { cloudinary } from "@/core/config/cloudinary";
import { db } from "@/core/db/db";
import { Difficulty } from "@prisma/client";

interface ProblemProp {
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
  examples: string;
}

export const NewProblem = async (data: ProblemProp) => {
  const {
    title,
    description,
    difficulty,
    topics,
    hints,
    constraints,
    driverFunction,
    inputUrl,
    outputUrl,
    examples,
  } = data;

  // Extract Cloudinary public IDs from the URLs
  const inputPublicId = extractPublicId(inputUrl);
  const outputPublicId = extractPublicId(outputUrl);

  try {
    const topicNames = topics.map(
      (topicObj: { topic: string }) => topicObj.topic,
    );
    const topicRecords = await db.topic.findMany({
      where: {
        name: {
          in: topicNames,
        },
      },
    });

    const problem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        createdAt: new Date(),
        topics: {
          create: topicRecords.map((topic) => ({
            topic: {
              connect: { id: topic.id },
            },
          })),
        },
        hints: {
          create: hints.map((hintObj: any) => ({
            name: hintObj?.hint,
          })),
        },
        constraints: {
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

    return { message: "Problem Created Successfully" };
  } catch (error) {
    console.error("Error creating problem:", error);

    if (inputPublicId) {
      await cloudinary.uploader.destroy(inputPublicId);
    }
    if (outputPublicId) {
      await cloudinary.uploader.destroy(outputPublicId);
    }

    return {
      error: "Error Creating Problem. Uploaded files have been deleted.",
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
