
'use client';

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ResponseType = InferResponseType<typeof client.api.tasks['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.tasks['$post']>

export const useCreateTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({json}) => {
      const response = await client.api.tasks.$post({json});
      
      if (!response.ok) {
        throw new Error("Task creation failed");
      }
      
      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success('Task created');
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ['Tasks',data[0].projectId] });
    }
  });
  
  return mutation;
}