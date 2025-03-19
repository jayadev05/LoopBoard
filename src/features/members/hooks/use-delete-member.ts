'use client';

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { error } from "console";
import { InferRequestType,InferResponseType } from "hono";
import toast from "react-hot-toast";

type ResponseType = InferResponseType<typeof client.api.members[':memberId']['$delete'],200>;

type RequestType = InferRequestType<typeof client.api.members[':memberId']['$delete']>;

export const useDeleteMember =()=>{

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        mutationFn: async ({param}) => {
            
            const response = await client.api.members[':memberId']['$delete']({ param });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error( errorData.error || "Workspace deletion failed");
              }
        
              return await response.json();
        }  ,
        onSuccess:({data})=>{
            queryClient.invalidateQueries({queryKey:['members']});
            queryClient.invalidateQueries({queryKey:['members',data.workspaceId]});
        }
       
    })

    return mutation;
}
