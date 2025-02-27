import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.customAuth.register['$post']>
type RequestType = InferRequestType<typeof client.api.customAuth.register['$post']>;

export const useRegister =()=>{

    const mutation = useMutation<ResponseType,Error,RequestType>({
        mutationFn: async ({json}) => {
            const response = await client.api.customAuth.register.$post({ json });
            return await response.json()
        }  
    })

    return mutation;
}
