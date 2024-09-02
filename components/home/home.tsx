"use client";

import GridPattern from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Home() {
  return (
    <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-background">
      <h1
        className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent py-8
        dark:bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-500
        bg-gradient-to-b from-neutral-700 to-neutral-800 max-md:text-center"
      >
        Welcome to CodeBlitz
      </h1>
      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-400 mb-6 px-4 text-center max-w-lg">
        CodeBlitz is your go-to platform for solving coding challenges,
        improving your skills, and preparing for technical interviews. Dive into
        a variety of problems designed to sharpen your problem-solving abilities
        and boost your confidence.
      </p>
      <div className="flex space-x-4">
        <Link href="/problem">
          <Button>Explore Challenges</Button>
        </Link>
        <Link href="/auth/signin">
          <Button variant={"secondary"}>Join Us Now</Button>
        </Link>
      </div>
      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
          [15, 10],
          [10, 15],
          [15, 10],
        ]}
        className={cn(
          "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
    </div>
  );
}
