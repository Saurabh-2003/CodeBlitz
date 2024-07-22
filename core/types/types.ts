import { z } from "zod";
import { Constraint, Hint, Topic, User } from "@prisma/client";
import { title } from "process";

// const submissionSchema = z.object({
//     id: z.string().uuid(),
//     code: z.string(),
//     status: z.enum(['ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILE_ERROR']),
//     createdAt: z.date(),
//     userId: z.string().uuid(),
//     problemId: z.string().uuid(),
//   });

//   // Define the Zod schema for the Topic model
//   const topicSchema = z.object({
//     id: z.string().uuid(),
//     name: z.string(),
//     problemId: z.string().uuid(),
//   });

//   // Define the Zod schema for the Hint model
//   const hintSchema = z.object({
//     id: z.string().uuid(),
//     text: z.string(),
//     problemId: z.string().uuid(),
//   });

//   // Define the Zod schema for the Constraint model
//   const constraintSchema = z.object({
//     id: z.string().uuid(),
//     text: z.string(),
//     problemId: z.string().uuid(),
//   });

//   // Define the Zod schema for the Input model
//   const inputSchema = z.object({
//     id: z.string().uuid(),
//     name: z.string(),
//     problemId: z.string().uuid(),
//   });

export const problemSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  topics: z.string(),

  constraints: z.array(z.object({ constraint: z.string() })),
  //inputs: z.array(z.object({ input: z.string() })),
  hints: z.array(z.object({ hint: z.string() })),
});
