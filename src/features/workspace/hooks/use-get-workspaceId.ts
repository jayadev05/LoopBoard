import { useParams, usePathname } from "next/navigation";

export const useGetWorkspaceId = () => {
   const params = useParams();

    return params.workspaceId as string;
  };