'use client';

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";
import toast from "react-hot-toast";

type ResponseType = InferResponseType <typeof client.api.workspace[':workspaceId']['reset-invite-code']['$post'],200>;

type RequestType = InferRequestType<typeof client.api.workspace[':workspaceId']['reset-invite-code']['$post']>;

export const useResetInviteCode =()=>{

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        mutationFn: async ({param}) => {
            
            const response = await client.api.workspace[':workspaceId']['reset-invite-code']['$post']({ param });

            if (!response.ok) {
                throw new Error( "Failed to reset invite code");
              }
        
              return await response.json();
        }  ,
        onSuccess:({data})=>{
            toast.success('Invite code reset succesfully');
            queryClient.invalidateQueries({queryKey:['workspaces']});
            queryClient.invalidateQueries({queryKey:['workspaces',data[0].id]});
        }
       
    })

    return mutation;
}
