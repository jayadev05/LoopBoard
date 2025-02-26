
import NextAuth, { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import {DrizzleAdapter} from '@auth/drizzle-adapter'
import { db } from "@/db/drizzle";

export const authOptions : NextAuthOptions ={
    adapter:DrizzleAdapter(db),
    providers:[
        Google({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!
        })
    ],
    session: {
        strategy: "jwt"
      },
      secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}