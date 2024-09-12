"use client";

import GridPattern from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Home() {

  const dispatch = useAppDispatch();
  useEffect(()=>{
    dispatch(fetchUser())
  }, [])
  
  const  user  = useAppSelector((state) => state.profile.user);
  useEffect(() => {
    console.log("home user : ", user)
  }, [user])
  return (
    <div className="relative flex h-fit w-full flex-col items-center justify-center overflow-hidden bg-background">
      <Component />
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
          "[mask-image:radial-gradient(950px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[130%] skew-y-12",
        )}
      />
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import fetchUser from "@/lib/features/profile/profileReducer";

function Component() {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-10 h-fit">
          <div className="container h-full w-full px-4 md:px-6 flex flex-col items-center justify-center">
            <div className="flex flex-col h-[60dvh] justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Practice and Improve Your DSA Skills
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Our Codeblitz platform offers a comprehensive collection of
                  coding problems, allowing you to hone your skills in
                  JavaScript, C++, and Python.
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <Link href="/problem">
                  <Button>Explore Challenges</Button>
                </Link>
                {/* Conditionally render the "Join Us Now" button if there is no session */}
                {!session && (
                  <Link href="/auth">
                    <Button variant="secondary">Join Us Now</Button>
                  </Link>
                )}
              </div>
            </div>
            <Image
              height={1920}
              width={1080}
              alt="Problem Page image"
              src={"/platform_images/problem.png"}
              className="border-2 rounded-xl dark:border-slate-500 "
            />
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Coding Challenges
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Solve Problems. Improve Your Skills.
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our Codeblitz platform offers a vast collection of coding
                  problems across various difficulty levels, allowing you to
                  challenge yourself and enhance your problem-solving abilities.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Easy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">10+</div>
                    <p className="text-xs text-muted-foreground">Problems</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Medium</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">20+</div>
                    <p className="text-xs text-muted-foreground">Problems</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Hard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">10+</div>
                    <p className="text-xs text-muted-foreground">Problems</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">40+</div>
                    <p className="text-xs text-muted-foreground">Problems</p>
                  </CardContent>
                </Card>
              </div>
              <img
                src="/problems.png"
                width="650"
                height="310"
                alt="Features"
                className="mx-auto border-2  dark:border-slate-500  aspect-video overflow-hidden h-full rounded-xl object-cover object-left-top sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Supported Languages
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Code in Your Preferred Language
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our Codeblitz platform supports a wide range of programming
                  languages, including JavaScript, C++, and Python, allowing you
                  to practice and improve your skills in your language of
                  choice.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-[#f7df1e] h-14 w-20 p-4 text-xl font-bold text-[#323330]">
                      JS
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">JavaScript</h4>
                      <p className="text-sm text-muted-foreground">
                        Solve problems in the most popular language on the web.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-[#f34b7d] h-14 w-20 p-2 grid place-items-center text-xl font-bold text-white">
                      C++
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">C++</h4>
                      <p className="text-sm text-muted-foreground">
                        Tackle complex problems with the power of C++.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-[#306998] h-14 w-20 p-4 text-xl font-bold text-white">
                      PY
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">Python</h4>
                      <p className="text-sm text-muted-foreground">
                        Leverage the versatility of Python for your coding
                        challenges.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex py-6  justify-between px-4 md:px-6 border-t">
        <div className="text-xs text-muted-foreground">
          &copy; 2024 Codeblitz
        </div>
        <div className="text-xs text-muted-foreground">Made by : Saurabh</div>
      </footer>
    </div>
  );
}
