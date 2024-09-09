import { User } from "@prisma/client";
import { z } from "zod";

import { uniqBy } from "lodash";

export const problemSchema = z.object({
  title: z.string().min(5, "Title should be greater than 5 charcaters"),
  description: z
    .string()
    .min(20, "Description length should be greater than 20 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  topics: z
    .array(
      z.object({
        topic: z.string(),
      }),
    )
    .transform((data) => uniqBy(data, "topic")),

  constraints: z
    .array(z.object({ constraint: z.string() }))
    .min(1, "Atleast one constraint should be provided."),

  hints: z
    .array(z.object({ hint: z.string() }))
    .min(1, "Atleast one hint should be provided."),

  driverFunction: z.object({
    cplusplus: z.string(),
    python: z.string(),
    javascript: z.string(),
  }),
});

export type profileSchema = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean | null;
  success: boolean | null;
  error: string | null;
};

export const UpdateProfileSchema = z.object({
  bio: z
    .string()
    .min(10, "Description length should be greater than 10 characters")
    .optional(),
  collegename: z
    .string()
    .min(5, "College name should be at least 5 characters long")
    .optional(),
  skills: z
    .array(
      z.object({
        skill: z.string().min(1, "Skill cannot be empty"),
      }),
    )
    .transform((data) => uniqBy(data, "skill")),
});
