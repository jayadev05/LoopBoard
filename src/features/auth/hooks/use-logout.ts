import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { client } from "@/lib/rpc";
import {  InferResponseType } from "hono";
import toast from "react-hot-toast";

type ResponseType = InferResponseType<typeof client.api.customAuth.logout['$post']>


export const useLogout = () => {

  const router = useRouter();

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.customAuth.logout.$post();
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Logout successfull')
      router.push("/sign-in"); 
      router.refresh();
      queryClient.invalidateQueries({queryKey:['currentUser']});
      queryClient.invalidateQueries({queryKey:['workspaces']});
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  return mutation;
};
