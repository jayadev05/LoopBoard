import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import React, { useState } from "react";
import { OAuthButtons } from "./shared/OAuthButtons";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import SingInForm from "./Sign-In-Form";

export function SignInCard() {
  
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none ">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle>Welcome Back!</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
       <SingInForm/>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
        <OAuthButtons />
      </div>
    </Card>
  );
}
