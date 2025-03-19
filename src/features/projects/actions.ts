import { db } from "@/db/drizzle"
import { projects } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser } from "../auth/actions"
import { getMember } from "../members/utils"

interface getProjectByIdProps {
    projectId:string
}

export const getProjectById= async({projectId}:getProjectByIdProps)=>{


    const {data:user} = await getCurrentUser();

    const project = await db.select()
        .from(projects)
        .where(eq(projects.id,projectId));

        const member = await getMember({
            userId: user!.id,
            workspaceId:project[0].workspaceId
        });



    if(!project || !member) return null;

    return project[0];
}