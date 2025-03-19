import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";


interface useGetProjectsProps {
    workspaceId:string
}

type ResponseType = InferResponseType<typeof client.api.projects.$get,200>

export const useGetProjects = ({workspaceId}:useGetProjectsProps) => {

  return useQuery<ResponseType, Error>({
    queryKey: ["projects",workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query:{workspaceId}
    });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();

      return data ;
    },
    staleTime: 1000 * 60 * 5, // Cache user data for 5 minutes
  });
};