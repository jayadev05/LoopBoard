import { db } from "@/db/drizzle";
import { workspaceMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";

interface getMemberProps{
    workspaceId: string;
    userId:string
}

export const getMember = async({workspaceId,userId}:getMemberProps)=>{
    
    const member = await db.query.workspaceMembers.findFirst({
        where: and(eq(workspaceMembers.userId, userId), eq(workspaceMembers.workspaceId, workspaceId)),
      });

      return member
}