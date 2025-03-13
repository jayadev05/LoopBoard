import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { Session } from "@auth/core/types"; 
import { SessionPayload } from "@/types/auth";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET is not defined");
}
const encodedKey = new TextEncoder().encode(secretKey);



// Custom JWT session creation 
export async function createCustomSession(userId:string) {

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id:true,
      email:true,
      role: true },
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await encrypt({
  user:{
    id: user.id,
    role: user.role,
    email:user.email
  },
    expiresAt: expiresAt.toISOString(),
  });

  (await cookies()).set("custom_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
    sameSite: "lax",
  });

  return { userId, role: user.role, expiresAt };
}

export async function deleteSession() {
  (await cookies()).delete("custom_session");
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
  if (!session) return null;
  
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    
    return payload as SessionPayload;
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}

// Get the current session 
export async function getSession() {
  
  const customSessionCookie = (await cookies()).get("custom_session")?.value;

  if (customSessionCookie) {
    const customSession = await decrypt(customSessionCookie);
    if (customSession) {
      // Check if session is expired
      const expiresAt = new Date(customSession.expiresAt);
      if (expiresAt > new Date()) {
        return customSession;
      }
      // Session expired, delete it
      await deleteSession();
    }
  }


  
  return null;
}

