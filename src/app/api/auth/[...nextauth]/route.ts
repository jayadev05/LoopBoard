import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account) return false; // Ensure email and account exist

      // ✅ Use `account.provider` instead of `user.provider`
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email))
        .limit(1);

      if (existingUser.length === 0) {
        // Create a new user if they don’t exist
        await db.insert(users).values({
          email: user.email,
          name: user.name ?? null,
          avatarUrl: user.image ?? null,
          provider: account.provider, // ✅ Fix: Use `account.provider`
          providerId: account.providerAccountId, // ✅ Fix: Use `account.providerAccountId`
          createdAt: new Date(),
        });
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.provider = account.provider; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.provider = token.provider as string ?? null; // ✅ Fix: Assign provider
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
