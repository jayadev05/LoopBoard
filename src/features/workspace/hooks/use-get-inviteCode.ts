import { useParams, usePathname } from "next/navigation";

export const useGetInviteCode = () => {
   const params = useParams();

    return params.inviteCode as string;
  };