"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/hooks/use-get-members";
import { useGetProjects } from "@/features/projects/hooks/use-get-projects";
import { useGetWorkspaceId } from "@/features/workspace/hooks/use-get-workspaceId";
import { Loader } from "lucide-react";
import React from "react";
import { CreateTaskForm } from "./create-task-from";

interface createTaskFormWrapperProps {
  onCancel: () => void;
}

export  function CreateTaskFormWrapper({
  onCancel,
}: createTaskFormWrapperProps) {
  const workspaceId = useGetWorkspaceId();

  const { data: projects, isPending: isLoadingProjects } = useGetProjects({
    workspaceId,
  });

  const { data: members, isPending: isLoadingMembers } = useGetMembers({
    workspaceId,
  });


  const isLoading = isLoadingProjects || isLoadingMembers;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const projectOptions = projects!.map((p) => ({
    id: p.id,
    name: p.name,
    imageUrl: p.imageUrl,
  }));

  const memberOptions = members!.map((m) => ({
    id: m.userId,
    name: m.name,
  }));

  return (
    <CreateTaskForm onCancel={onCancel} memberOptions={memberOptions?? []} projectOptions={projectOptions?? []} />
  );
}
