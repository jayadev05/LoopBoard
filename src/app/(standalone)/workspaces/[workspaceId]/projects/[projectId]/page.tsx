import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/actions";
import { getProjectById } from "@/features/projects/actions";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useGetProjectId } from "@/features/projects/hooks/use-get-projectId";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface ProjectIdPageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectIdPage({ params }: ProjectIdPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const projectId = params.projectId;

  const project = await getProjectById({ projectId });
  if (!project) return <div>Project not found</div>;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            image={project.imageUrl ?? ""}
            name={project.name}
            className="size-8"
          />
          <p className="text-lg font-semibold"> {project.name}</p>
        </div>
        <div>
          <Button variant='secondary' asChild size='sm'>
            <Link href={`/workspaces/${project.workspaceId}/projects/${projectId}/settings`}>
            <PencilIcon className="size-4 mr-2"/>
            Edit Project
            </Link>
            
          </Button>
        </div>
      </div>
    </div>
  );
}
