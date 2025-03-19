import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { getMember } from "@/features/members/utils";
import { User } from "@/types/auth";
import { zValidator } from "@hono/zod-validator";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { createProjectSchema } from "../schema";
import { uploadToCloudinary } from "@/lib/cloudinary";

type Variables = {
  user: User | null;
};

const app = new Hono<{ Variables: Variables }>()

    .get('/',zValidator('query',z.object({workspaceId:z.string()})),async(c)=>{

        const user = c.get('user');

        if(!user) return c.json({error:'Unauthorized'},401);

        const {workspaceId} = c.req.valid('query');

        if(!workspaceId) return c.json({error:'Missing workspaceId'},400);

        const member = await getMember({
            workspaceId,
            userId: user!.id,
        })

       if(!member) return c.json({error:'Unauthorized'},401);

        const projectsData = await db.select()
            .from(projects)
            .where(eq(projects.workspaceId,workspaceId))
            .orderBy(desc(projects.createdAt));

        return c.json({data:projectsData},200)    

    })
     .post("/", zValidator("form", createProjectSchema), async (c) => {
    
        const user = c.get("user");
    
      
    
          if (!user) {
            return c.json({ error: "User not found in session" }, 401);
          }
        
    
        const { name, image , workspaceId } = c.req.valid("form");

        const member = await getMember({
            workspaceId,
            userId: user!.id,
        })

        if(!member) return c.json({error:'Unauthorized'},401);
    
        let uploadedImageUrl = null;
    
        
    
        if (image && image instanceof File) {
          uploadedImageUrl = await uploadToCloudinary(image);
        }
    
        
    
        const project = await db
          .insert(projects)
          .values({
            name,
            workspaceId,
            imageUrl: uploadedImageUrl,
            
          })
          .returning();
    
        
        return c.json({ data: project });
      })

export default app; 