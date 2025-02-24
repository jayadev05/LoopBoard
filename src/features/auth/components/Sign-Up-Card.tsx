import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import React, { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { OAuthButtons } from "./shared/OAuthButtons";
import { Eye, EyeOff } from "lucide-react";
import SingUpForm from "./Sing-Up-Form";

export function SignUpCard() {
  

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none ">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href="/privacy">
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link href="/privacy">
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <SingUpForm/>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
        <OAuthButtons type="signup" />
      </div>
    </Card>
  );
}
