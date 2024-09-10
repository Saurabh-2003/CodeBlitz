"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
// import { signIn } from "next-auth/react";

export const Login = () => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const handleGoogleLogin = () => {
    setIsLoading(true);
    signIn("google", { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          alert("Error Signing in");
        }
        if (callback?.ok && !callback?.error) {
          console.log("Logged In");
          redirect("/home");
        }
      })
      .finally(() => {
        setIsLoading(false);
        alert("Logged IN");
      });
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button
              disabled={loading}
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
            >
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/platform_images/problem.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover object-left-top dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};
