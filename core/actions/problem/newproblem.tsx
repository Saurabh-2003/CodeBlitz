"use server";

import { db } from "@/core/db/db";
import GetServerSession from "@/core/hooks/getServerSession";
import { Difficulty, SubmissionStatus } from "@prisma/client";
import { error } from "console";
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
    const problemId = uuidv4();
    console.log(title, description, difficulty, topics, hints, constraints);

    const topicValue = await db.topic.findFirst({
      where: {
        name: topics,
      },
    });

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
        topic: {
          connect: topicValue ? [{ id: topicValue.id }] : [],
        },
      },
    });

    return;
  } catch (error) {
    return { error: "Iternal Error" };
  }
};
