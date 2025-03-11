import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

type ResponseType = InferResponseType<typeof client.api.customAuth.login['$post']>
type RequestType = InferRequestType<typeof client.api.customAuth.login['$post']>;

export const useLogin =()=>{

    const router = useRouter();

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        mutationFn: async ({json}) => {
            const response = await client.api.customAuth.login.$post({ json });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
              }
        
              return await response.json();
        }  ,
        onSuccess:()=>{
            toast.success('Login successfull');
            router.push("/");
            queryClient.invalidateQueries({queryKey:['currentUser']});
        },
        onError: (error) => {
                  toast.error(error.message || "Login failed! Please try again.");
                }
       
    })

    return mutation;
}
