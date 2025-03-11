"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-currentUser";
import { Loader } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { SignOutButton } from "@/features/auth/components/Sign-out-button";
import { DottedSeparator } from "./dotted-separator";

export function UserProfileButton() {
  const { data, isPending } = useCurrentUser();

  // Handle loading state
  if (isPending || !data) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Check if we have the user object (typescript fix)
  const user = "user" in data ? data.user : null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
          <AvatarImage
            src={user?.image || undefined}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side='bottom' className="w-60" sideOffset={10}>
        <div className="flex flex-col items-center justify-center gap-2 px-2 py-4">
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
          <AvatarImage
            src={user?.image || undefined}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
          <div className="text-neutral-900 text-sm font-medium flex flex-col items-center justify-center">
            <p>{user?.name}</p>
            <p>{user?.email}</p>
          </div>
          <DottedSeparator/>
          <SignOutButton/>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
