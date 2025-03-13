import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";
import { User } from "@/types/auth";


interface CurrentUserResponse {
  error: string | null;
  data: User | null;
  message?: string;
}


export const useCurrentUser = () => {
  return useQuery<CurrentUserResponse, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await client.api.customAuth["current-user"].$get();
      
      if (!response.ok) {
        // Return a properly shaped error response
        return { error: "Failed to fetch user", data: null };
      }
      
      const user = await response.json();
      
      return user as CurrentUserResponse;
    },
    staleTime: 1000 * 60 * 5, // Cache user data for 5 minutes
  });
};