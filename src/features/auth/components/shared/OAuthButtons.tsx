import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type AuthType = "login" | "signup";

interface OAuthButtonProps {
  type?: AuthType;
}

export function OAuthButtons({ type = "login" }: OAuthButtonProps) {
  const isLogin = type === "login";

  const action = isLogin ? "Login" : "Sign Up";

  const handleLogin =(provider : "google" | 'github')=>{
    signIn(provider,{
      callbackUrl:'/'
    })
  }

  return (
    <CardContent className="p-7 flex flex-col gap-y-4 ">

      <Button disabled={false} onClick={()=> handleLogin('google')}  variant="secondary" size="lg" className="w-full">
        <FcGoogle />
        {action} with Google
      </Button>

      <Button disabled={false} onClick={()=> handleLogin('github')}  variant="secondary" size="lg" className="w-full">
        <FaGithub />
        {action} with Github
      </Button>

    </CardContent>
  );
}
