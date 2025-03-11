import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ResponseType = InferResponseType<typeof client.api.customAuth.register['$post']>
type RequestType = InferRequestType<typeof client.api.customAuth.register['$post']>;

export const useRegister =()=>{

      const router = useRouter();

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType,Error,RequestType>({
        mutationFn: async ({json}) => {
            const response = await client.api.customAuth.register.$post({ json });
            return await response.json()
        }  ,
        onSuccess:()=>{
            toast.success('User registered successfully');
            router.push('/sign-in');
            queryClient.invalidateQueries({queryKey:['currentUser']});
        },
        onError:()=>{
            toast.error('Registration failed' );
        }
    })


    return mutation;
}
