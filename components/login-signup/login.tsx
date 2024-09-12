'use client'
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
const AuthLayoutStyles = {
  MAIN_DIV:
    "w-full h-screen flex flex-col md:flex-row justify-center items-center",
  IMAGE_DIV: "relative w-full h-full flex-col bg-muted p-10 text-white",
  IMAGE: "object-cover h-full w-full absolute top-0 inset-0",
  LOGO_DIV: "absolute inset-0",
  ICON_DIV: "relative z-20 flex items-center gap-3 text-4xl font-medium",
  ICON: "h-6 w-6 mr-2",
  FORM_DIV: "w-full h-full lg:p-8",
  CHILDREN_DIV: "mx-auto flex w-full h-full flex-col justify-center space-y-2",
  TERM_P:
    "w-full px-8 text-center text-sm text-muted-foreground flex gap-1 flex-wrap item-center justify-center",
  TERM_LINK: "underline underline-offset-4 hover:text-primary",
  PRIVACY_LINK: "underline underline-offset-4 hover:text-primary",
};
const SignInPageStyle = {
  SIGN_DIV: "flex flex-col pb-10 space-y-4 text-center",
  H1: "text-2xl font-semibold tracking-tight",
  P: "text-sm py-2 text-muted-foreground"
}
const SignInButtonStyles = {
  LOADER: 'h-4 w-4 mr-2 animate-spin',
  BUTTON: 'transition-all duration-300 w-80 py-2',
  ICON: 'h-4 w-4 mr-2',
};


import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export  async function Login() {
  const [loading, setIsLoading] = useState<boolean>(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    signIn("google", { redirect: false })
      .then(async (callback) => {
        if (callback?.error) {
          alert("Error Signing in");
        }
        if (callback?.ok && !callback?.error) {
          toast.success("Login Successful")
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className={AuthLayoutStyles.MAIN_DIV}>
      <div className={AuthLayoutStyles.IMAGE_DIV}>
        <Image
          src={`/platform_images/loginimage.jpg`}
          alt="authentication"
          fill
          className={AuthLayoutStyles.IMAGE}
        />
        <div className={AuthLayoutStyles.LOGO_DIV} />
        <Link href={"/"}>
          <div className={AuthLayoutStyles.ICON_DIV}>
            Codeblitz
          </div>
        </Link>
      </div>
      <div className={AuthLayoutStyles.FORM_DIV}>
        <div className={AuthLayoutStyles.CHILDREN_DIV}>
        <div className={SignInPageStyle.SIGN_DIV}>
        <h1 className={SignInPageStyle.H1}>
        Sign in Your Account
        </h1>
        <p className={SignInPageStyle.P}>
        We Prefer Password less Sign In / Sign Up
        </p>
        <div className="flex items-center justify-center w-full px-10 md:px-5">
        <Button
          disabled={loading}
          variant={"outline"}
          onClick={() => handleGoogleLogin()}
          type="button"
          className={SignInButtonStyles.BUTTON}
        >
          {loading ? (
            <Loader className={SignInButtonStyles.LOADER} />
          ) : (
            <FcGoogle className={SignInButtonStyles.ICON} />
          )}
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </div>
      </div>
          
        </div>
      </div>
    </div>
  );
}
