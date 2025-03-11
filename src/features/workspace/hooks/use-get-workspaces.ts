import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

// Define workspace type explicitly
export type Workspace = {
  id: string;
  name: string;
  imageUrl: string | null;
  
};

type ResponseType = Workspace[];

export const useGetWorkspaces = () => {
  return useQuery<ResponseType, Error>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspace.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Unexpected API response format:", data);
        return [];
      }

      return data as Workspace[];
    },
    staleTime: 1000 * 60 * 5, // Cache user data for 5 minutes
  });
};