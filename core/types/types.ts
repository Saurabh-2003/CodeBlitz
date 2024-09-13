import { User } from "@prisma/client";
import { uniqBy } from "lodash";
import { z } from "zod";

export const problemSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title cannot exceed 100 characters")
    .trim()
    .refine((val) => !/^\s*$/.test(val), "Title cannot be only whitespace"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long")
    .max(5000, "Description cannot exceed 5000 characters")
    .trim()
    .refine(
      (val) => !/^\s*$/.test(val),
      "Description cannot be only whitespace",
    ),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    errorMap: () => ({ message: "Please select a valid difficulty level" }),
  }),
  topics: z
    .array(
      z.object({
        topic: z
          .string()
          .min(1, "Topic cannot be empty")
          .max(50, "Topic cannot exceed 50 characters")
          .trim()
          .refine(
            (val) => !/^\s*$/.test(val),
            "Topic cannot be only whitespace",
          ),
      }),
    )
    .nonempty("At least one topic must be provided")
    .transform((data) => uniqBy(data, "topic"))
    .refine(
      (data) => data.length > 0,
      "At least one unique topic must be provided",
    ),

  constraints: z
    .array(
      z.object({
        constraint: z
          .string()
          .min(1, "Constraint cannot be empty")
          .max(200, "Constraint cannot exceed 200 characters")
          .trim()
          .refine(
            (val) => !/^\s*$/.test(val),
            "Constraint cannot be only whitespace",
          ),
      }),
    )
    .min(1, "At least one constraint must be provided")
    .nonempty("At least one constraint must be provided"),

  hints: z
    .array(
      z.object({
        hint: z
          .string()
          .min(1, "Hint cannot be empty")
          .max(500, "Hint cannot exceed 500 characters")
          .trim()
          .refine(
            (val) => !/^\s*$/.test(val),
            "Hint cannot be only whitespace",
          ),
      }),
    )
    .min(1, "At least one hint must be provided")
    .nonempty("At least one hint must be provided"),
  driverFunction: z.object({
    cplusplus: z
      .string()
      .min(1, "C++ driver function cannot be empty")
      .refine(
        (val) => !/^\s*$/.test(val),
        "C++ driver function cannot be only whitespace",
      ),
    python: z
      .string()
      .min(1, "Python driver function cannot be empty")
      .refine(
        (val) => !/^\s*$/.test(val),
        "Python driver function cannot be only whitespace",
      ),
    javascript: z
      .string()
      .min(1, "JavaScript driver function cannot be empty")
      .refine(
        (val) => !/^\s*$/.test(val),
        "JavaScript driver function cannot be only whitespace",
      ),
  }),
  inputUrl: z.string().min(1, "Input URL is required"),
  outputUrl: z.string().min(1, "Output URL is required"),
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
