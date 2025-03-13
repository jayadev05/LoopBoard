'use client';

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";
import toast from "react-hot-toast";

type ResponseType = {
    data: {
        id: string;
        name: string;
        userId: string;
        imageUrl: string | null;
        inviteCode: string;
    }[];
}
type RequestType = InferRequestType<typeof client.api.workspace[':workspaceId']['$patch']>;

export const useUpdateWorkspace =()=>{

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        mutationFn: async ({form,param}) => {
            
            const response = await client.api.workspace[':workspaceId']['$patch']({ form,param });

            if (!response.ok) {
                throw new Error( "Workspace updation failed");
              }
        
              return await response.json();
        }  ,
        onSuccess:({data})=>{
            toast.success('workspace updated');
            queryClient.invalidateQueries({queryKey:['workspaces']});
            queryClient.invalidateQueries({queryKey:['workspaces',data[0].id]});
        }
       
    })

    return mutation;
}
