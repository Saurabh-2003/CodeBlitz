"use server";

import { db } from "@/core/db/db";
import GetServerSession from "@/core/hooks/getServerSession";
import { Difficulty, SubmissionStatus } from "@prisma/client";
import { error } from "console";
import { create } from "domain";
import { v4 as uuidv4 } from "uuid";

interface ProblemProp {
  title: string;
  description: string;
  difficulty: Difficulty;
  topics: string;
  hints: string[];
  constraints: string[];
}

export const NewProblem = async (data: ProblemProp) => {
  try {
    const { title, description, difficulty, topics, hints, constraints } = data;

    let topicValue = await db.topic.findFirst({
      where: {
        name: topics,
      },
    });

    if (!topicValue) {
      topicValue = await db.topic.create({
        data: {
          name: topics,
        },
      });
    }

    if (topicValue) {
      console.log("Topic found:", topicValue);
    } else {
      console.log("No topic found with the name:", topics);
    }

    const problem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        createdAt: new Date(),
        topics: {
          create: {
            topicId: topicValue.id,
          },
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
      },
    });

    return { message: "Problem Created Successfully" };
  } catch (error) {
    return { error: "Error Created Problem" };
  }
};
