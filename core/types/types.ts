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
  title: z.string().min(5, "title should be greater than 5 charcaters"),
  description: z
    .string()
    .min(20, "Description length should be greater than 20 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  topics: z
    .array(z.object({ topic: z.string() }))
    .min(1, "atleast one topic should be there"),
  constraints: z.array(z.object({ constraint: z.string() })).min(1),
  hints: z
    .array(z.object({ hint: z.string() }))
    .min(1, "Atleast one hint should be provided."),
});
