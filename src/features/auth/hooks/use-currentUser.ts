import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";


type ResponseType = 
   { message: string }
  | { error: string }
  | { 
      user: { 
        id: string; 
        name: string | null; 
        email: string; 
        emailVerified: string | null; 
        role: string; 
        image: string | null; 
        password: string | null; 
        createdAt: string; 
        updatedAt: string; 
      }
    };

export const useCurrentUser = () => {
  return useQuery<ResponseType, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await client.api.customAuth["current-user"].$get();
      
      if (!response.ok) {
        return { message: "Failed to fetch user" };
      } 
      const user = await response.json();

      return user;
    },
    staleTime: 1000 * 60 * 5, // Cache user data for 5 minutes
   
  });
};