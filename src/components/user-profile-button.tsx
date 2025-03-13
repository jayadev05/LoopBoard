"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-currentUser";
import { Loader, Moon, User } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { SignOutButton } from "@/features/auth/components/Sign-out-button";
import { DottedSeparator } from "./dotted-separator";
import { ThemeToggle } from "./dark-mode-switcher";
import { RiLayoutHorizontalLine } from "react-icons/ri";
import { Separator } from "./ui/separator";

export function UserProfileButton() {
  const { data, isPending } = useCurrentUser();
  console.log(data);

  // Handle loading state
  if (isPending || !data) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Check if we have the user object (typescript fix)
  const user = "data" in data ? data.data : null;

  return (
    <DropdownMenu modal={false}>
    <DropdownMenuTrigger className="outline-none relative">
      <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300 dark:border-neutral-500">
        <AvatarImage
          src={user?.image || undefined}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700 font-medium text-neutral-500 dark:text-neutral-300 flex items-center justify-center">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
  
    <DropdownMenuContent 
      align="end" 
      side="bottom" 
      className="w-60 border-none bg-white dark:bg-neutral-700 dark:border-neutral-600 shadow-lg"
      sideOffset={10}
    >
      <div className="flex flex-col items-center justify-center gap-2 px-2 py-4 dark:bg-neutral-700 dark:border-neutral-600">
        
        <div className="flex items-center gap-2">
          <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300 dark:border-neutral-500">
            <AvatarImage
              src={user?.image || undefined}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700 font-medium text-neutral-500 dark:text-neutral-300 flex items-center justify-center">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center">
            <p className="text-neutral-900 dark:text-white text-sm font-medium">{user?.name}</p>
            <p className="text-neutral-500 dark:text-neutral-300 text-xs font-normal">@{user?.email}</p>
          </div>
        </div>
  
        <Separator className="dark:bg-white"/>
  
        <div className="flex items-center justify-start gap-2 ps-4 w-full hover:cursor-pointer  dark:hover:bg-neutral-600 ">
          <User className="size-4"/>
          <p className="text-sm">Profile</p>
        </div>
  
        <div className="flex items-center justify-start gap-2 ps-4 w-full">
          <div className="flex justify-between w-full items-center pe-2">
            <div className="flex gap-2">
              <Moon className="size-4"/>
              <p className="text-sm hover:cursor-pointer">Dark Mode</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
  
        <Separator className="dark:bg-white"/>
        <SignOutButton />
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
  
  );
}
