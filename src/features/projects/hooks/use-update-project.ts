// Update your useCreateProject hook
'use client';

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ResponseType = InferResponseType<typeof client.api.projects[':projectId']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.projects[':projectId']['$patch']>;

export const useUpdateProject = () => {
  const router = useRouter()
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({form,param}) => {
      const response = await client.api.projects[":projectId"].$patch({form,param});
      
      if (!response.ok) {
        throw new Error("Project updation failed");
      }
      
      return await response.json();
    },
    onSuccess: ({ data }) => {
      router.refresh();
      router.push(`/workspaces/${data[0].workspaceId}/projects/${data[0].id}`);  
      toast.success('project updated');
      queryClient.invalidateQueries({ queryKey: ['projects', data[0].workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['projects', data[0].id] });
     
    }
  });
  
  return mutation;
}