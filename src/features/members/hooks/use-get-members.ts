import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";
import { Member } from "@/types/members";



type ResponseType = InferResponseType<typeof client.api.members.$get,200>;

interface UseGetMembersProps {
    workspaceId:string
}


export const useGetMembers = ({workspaceId}:UseGetMembersProps) => {
  return useQuery<ResponseType, Error>({
    queryKey: ["members",workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({query:{workspaceId}});

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const data = await response.json();

      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache user data for 5 minutes
  });
};