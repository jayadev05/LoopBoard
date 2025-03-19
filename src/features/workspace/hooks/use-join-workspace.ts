'use client';

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";
import toast from "react-hot-toast";

type ResponseType =  InferResponseType<typeof client.api.workspace[':workspaceId']['join']['$post'],200>
   

type RequestType = InferRequestType<typeof client.api.workspace[':workspaceId']['join']['$post']>;

export const useJoinWorkspace =()=>{

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        mutationFn: async ({json,param}) => {
            
            const response = await client.api.workspace[':workspaceId']['join']['$post']({ json,param });

            if (!response.ok) {
                const errorData = await response.json(); 
                throw new Error(errorData.error || "Failed to join workspace"); 
              }
        
              return await response.json();
        }  ,
        onSuccess:({data})=>{
            toast.success('Joined workspace');
            queryClient.invalidateQueries({queryKey:['workspaces']});
            queryClient.invalidateQueries({queryKey:['workspaces',data.id]});
        }
       
    })

    return mutation;
}
