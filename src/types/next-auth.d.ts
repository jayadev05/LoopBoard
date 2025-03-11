// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name:string;
      email:string
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name:string;
    email:string
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    email:string;
  }
}