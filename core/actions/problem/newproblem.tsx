"use server";

import { db } from "@/core/db/db";
import GetServerSession from "@/core/hooks/getServerSession";
import { Difficulty, SubmissionStatus } from "@prisma/client";
import { error } from "console";

interface ProblemProp {
  title: string;
  description: string;
  difficulty: Difficulty;
  topics: [{topic:string}];
  hints: string[];
  constraints: string[];
  driverFunction: {
    cplusplus : string,
    python : string,
    javascript : string,
  }
}

export const NewProblem = async (data: ProblemProp) => {
  try {
    const { title, description, difficulty, topics, hints, constraints,driverFunction } = data;
    const topicNames = topics.map((topicObj: { topic: string }) => topicObj.topic);
    const topicRecords = await db.topic.findMany({
      where: {
        name: {
          in: topicNames,
        },
      },
    });
console.log("hello",topicRecords);

    const problem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        createdAt: new Date(),
        topics: {
          create: topicRecords.map(topic => ({
            topic: {
              connect: { id: topic.id }
            }
          }))
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
        cppDriver:driverFunction.cplusplus,
        jsDriver: driverFunction.javascript,
        pythonDriver: driverFunction.python
      },
    });

    return { message: "Problem Created Successfully" };
  } catch (error) {
    return { error: "Error Created Problem" };
  }
};
