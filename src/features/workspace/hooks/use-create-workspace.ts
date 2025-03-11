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
type RequestType = InferRequestType<typeof client.api.workspace['$post']>;

export const useCreateWorkspace =()=>{

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        mutationFn: async ({form}) => {
            
            const response = await client.api.workspace.$post({ form });

            if (!response.ok) {
                throw new Error( "Workspace creation failed");
              }
        
              return await response.json();
        }  ,
        onSuccess:()=>{
            toast.success('workspace created');
            queryClient.invalidateQueries({queryKey:['workspaces']});
        }
       
    })

    return mutation;
}
