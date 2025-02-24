import { DottedSeparator } from "@/components/dotted-separator";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import React from "react";
import { OAuthButtons } from "./shared/OAuthButtons";
import { SignInForm } from "./Sign-In-Form";




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
       <SignInForm/>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
        <OAuthButtons />
      </div>
    </Card>
  );
}
