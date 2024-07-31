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

export const UpdateProblemAction = async (formdata: ProblemProp,problemId:string) => {
  try {
    const { title, description, difficulty, topics, hints, constraints,driverFunction } = formdata;
    const topicNames = topics.map((topicObj: { topic: string }) => topicObj.topic);
    const topicRecords = await db.topic.findMany({
      where: {
        name: {
          in: topicNames,
        },
      },
    });
console.log("hello",topicRecords);

const problem = await db.problem.update({
    where: { id: problemId }, // Unique identifier to locate the record
    data: {
      title,
      description,
      difficulty,
      updatedAt: new Date(), // Optionally update the `updatedAt` field
      topics: {
        // Upsert topics
        upsert: topicRecords.map(topic => ({
          where: { 
            problemId_topicId: { 
              problemId: problemId, // Include the problemId for composite key
              topicId: topic.id 
            } 
          },
          update: {}, // No updates needed; otherwise, specify what to update
          create: {
            topic: {
              connect: { id: topic.id }
            }
          }
        }))
      },
      hints: {
        // Upsert hints
        upsert: hints.map((hintObj: any) => ({
          where: { id: hintObj?.hint }, // Adjust according to your schema
          update: {}, // No updates needed; otherwise, specify what to update
          create: {
            name: hintObj?.hint,
          }
        }))
      },
      constraints: {
        // Upsert constraints
        upsert: constraints.map((constraintObj: any) => ({
          where: { id: constraintObj?.constraint }, // Adjust according to your schema
          update: {}, // No updates needed; otherwise, specify what to update
          create: {
            name: constraintObj?.constraint,
          }
        }))
      },
      cppDriver: driverFunction.cplusplus,
      jsDriver: driverFunction.javascript,
      pythonDriver: driverFunction.python
    },
  });
  

    return { message: "Problem updated Successfully" };
  } catch (error) {
    return { error: "Error Created Problem" };
  }
};
