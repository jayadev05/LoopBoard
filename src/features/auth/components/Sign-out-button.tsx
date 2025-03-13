"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useLogout } from "../hooks/use-logout";

export function SignOutButton() {
  const { mutate: logout, isPending } = useLogout();

  const handleSignOut = async () => {
    try {
     //custom session logout
       logout();

      // Then sign out of NextAuth session
      await signOut({ 
        callbackUrl: '/login', 
        redirect: true 
      });
    } catch (error) {
      console.error('Logout failed:', error);
      
    }
  };

  return (
    <Button 
      onClick={handleSignOut} 
      variant="destructive" 
      disabled={isPending}
    >
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
}