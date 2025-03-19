
import { User as NextAuthUser } from "next-auth";

export type CustomSessionUser = {
    id: string;
    role: string;
    email:string;
    isNextAuthLoggedIn?: boolean
  
  };
  
  // This represents the full session payload structure from your decrypt function
  export type SessionPayload = {
    user: CustomSessionUser;
    expiresAt: string; // ISO string format
  };
  
  // This is a union type representing all possible user types in your application
  export type ApplicationUser = CustomSessionUser | (NextAuthUser & { isNextAuthLoggedIn?: boolean });


  export type User = {
    id: string; // UUID type
    name: string | null; // nullable text field
    email: string; // required varchar
    emailVerified: Date | null; // nullable timestamp
    role: string; // varchar with default "user"
    image: string | null; // nullable text field
    password: string | null; // nullable text field
    createdAt: string; // ISO string
    updatedAt: string; 
  };