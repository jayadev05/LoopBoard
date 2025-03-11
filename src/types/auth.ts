
import { User as NextAuthUser } from "next-auth";

export type CustomSessionUser = {
    id: string;
    role: string;
    email:string
  
  };
  
  // This represents the full session payload structure from your decrypt function
  export type SessionPayload = {
    user: CustomSessionUser;
    expiresAt: string; // ISO string format
  };
  
  // This is a union type representing all possible user types in your application
  export type ApplicationUser = CustomSessionUser | (NextAuthUser & { isNextAuthLoggedIn?: boolean });