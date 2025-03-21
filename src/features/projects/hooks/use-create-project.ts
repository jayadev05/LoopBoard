// Update your useCreateProject hook
'use client';

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ResponseType = InferResponseType<typeof client.api.projects['$post'], 200>;
// Define a simpler type for what we pass to the mutation
type MutationInput = {
  form: {
    name: string;
    workspaceId: string;
    image?: File | null;
  }
};

export const useCreateProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error, MutationInput>({
    mutationFn: async ({form}) => {
      const response = await client.api.projects.$post({form});
      
      if (!response.ok) {
        throw new Error("Project creation failed");
      }
      
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('project created');
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ['projects', data[0].workspaceId] });
    }
  });
  
  return mutation;
}