'use client';

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";
import toast from "react-hot-toast";

type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]['$delete'],200>;

type RequestType = InferRequestType<typeof client.api.projects[":projectId"]['$delete']>;

export const useDeleteProject =()=>{

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        mutationFn: async ({param}) => {
            
            const response = await client.api.projects[':projectId']['$delete']({ param });

            if (!response.ok) {
                throw new Error( "projects deletion failed");
              }
        
              return await response.json();
        }  ,
        onSuccess:({data})=>{
            toast.success('workspace deleted');
            queryClient.invalidateQueries({queryKey:['projects']});
            queryClient.invalidateQueries({queryKey:['projects',data.id]});
        }
       
    })

    return mutation;
}
