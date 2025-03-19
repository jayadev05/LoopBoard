'use client';

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";
import toast from "react-hot-toast";

type ResponseType = {
  data: {
    id:string;
  }
}
type RequestType = InferRequestType<typeof client.api.workspace[":workspaceId"]['$delete']>;

export const useDeleteWorkspace =()=>{

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        mutationFn: async ({param}) => {
            
            const response = await client.api.workspace[":workspaceId"]['$delete']({ param });

            if (!response.ok) {
                throw new Error( "Workspace deletion failed");
              }
        
              return await response.json();
        }  ,
        onSuccess:({data})=>{
            toast.success('workspace deleted');
            queryClient.invalidateQueries({queryKey:['workspaces']});
            queryClient.invalidateQueries({queryKey:['workspaces',data.id]});
        }
       
    })

    return mutation;
}
