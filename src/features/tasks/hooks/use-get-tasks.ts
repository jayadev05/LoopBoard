import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";
import { Workspace } from "@/types/workspace";

interface UseGetTasksProps {
    workspaceId:string;
    status?:string | null;
    search?:string |null;
    projectId?:string | null;
    assigneeId?:string | null;
    dueDate?:string | null;

}

type ResponseType = InferResponseType<typeof client.api.tasks.$get,200>;

export const useGetTasks = ({workspaceId,projectId,status,dueDate,assigneeId,search}:UseGetTasksProps) => {
  return useQuery<ResponseType, Error>({
    queryKey: [
        "tasks",
        workspaceId,
        projectId,
        status,
        search,
        assigneeId,
        dueDate
    
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query:{
            workspaceId,
            projectId :projectId ?? undefined,
            status :status ?? undefined,
            assigneeId :assigneeId ?? undefined,
            search :search ?? undefined,
            dueDate :dueDate ?? undefined,
        
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const data = await response.json();

     
      return data ;
    },
    staleTime: 1000 * 60 * 5, // Cache user data for 5 minutes
  });
};