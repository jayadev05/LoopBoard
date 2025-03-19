'use client';

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";
import toast from "react-hot-toast";

type ResponseType = InferResponseType<typeof client.api.members[':memberId']['$patch'],200>;

type RequestType = InferRequestType<typeof client.api.members[':memberId']['$patch']>;

export const useUpdateMember =()=>{

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        mutationFn: async ({param,json}) => {
            
            const response = await client.api.members[':memberId']['$patch']({ param ,json});

            if (!response.ok) {
                const errorData = await response.json(); 
                throw new Error(errorData.error || "Failed to update member role"); 
              }
        
              return await response.json();
        }  ,
        onSuccess:({data})=>{
            toast.success('member updated');
            queryClient.invalidateQueries({queryKey:['members']});
            queryClient.invalidateQueries({queryKey:['members',data.workspaceId]});
        }
       
    })

    return mutation;
}
