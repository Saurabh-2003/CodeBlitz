import { z } from "zod";
import { Constraint, Hint, Topic, User } from "@prisma/client";
import { title } from "process";

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

export type profileSchema = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean | null;
  success: boolean | null;
  error: string | null;
};
