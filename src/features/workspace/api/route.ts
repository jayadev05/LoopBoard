import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schema";
import { db } from "@/db/drizzle";
import { workspaceMembers, workspaces } from "@/db/schema";
import { getSession } from "@/lib/session";
import { getServerSession } from "next-auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { MemberRole } from "@/types/members";
import { eq, inArray } from "drizzle-orm";
import { generateInviteCode } from "@/lib/utils";
import { z } from "zod";
import { getCurrentUser } from "@/features/auth/actions";
import { User } from "@/types/auth";
import { getMember } from "@/features/members/utils";

type Variables = {
  user:User | null
   
};

const app = new Hono<{ Variables: Variables }>()

  .get("/", async (c: Context) => {
    const user = c.get("user");


      if (!user) {
        return c.json({ error: "User not found in session" }, 401);
      }
    
    const members = await db.query.workspaceMembers.findMany({
        where: eq(workspaceMembers.userId,user!.id),
      });
      
      if (!members.length) {
        return c.json( [] );
      }

    const workSpaceIds = members.map((member) => member.workspaceId);

    const workSpaces = await db
      .select()
      .from(workspaces)
      .where(inArray(workspaces.id, workSpaceIds));

    return c.json(workSpaces);
  })

  .post("/", zValidator("form", createWorkspaceSchema), async (c) => {

    const user = c.get("user");

  

      if (!user) {
        return c.json({ error: "User not found in session" }, 401);
      }
    

    const { name, image } = c.req.valid("form");

    let uploadedImageUrl = null;

    

    if (image && image instanceof File) {
      uploadedImageUrl = await uploadToCloudinary(image);
    }

    const inviteCode = generateInviteCode(6);

    const workspace = await db
      .insert(workspaces)
      .values({
        name,
        userId: user?.id,
        imageUrl: uploadedImageUrl,
        inviteCode
      })
      .returning();

    await db.insert(workspaceMembers).values({
      workspaceId: workspace[0].id,
      userId: user?.id,
      role: MemberRole.ADMIN,
    });

    return c.json({ data: workspace });
  })

  .patch('/:workspaceId',zValidator('form',updateWorkspaceSchema),async(c)=>{
    const user = c.get('user');
    const {workspaceId} = c.req.param();
    const { name, image } = c.req.valid("form");

   

    const member = await getMember({workspaceId,userId:user!.id});

    if(!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "You are not an admin of this workspace" }, 403)
    }

    console.log('member:',member);

    let uploadedImageUrl = typeof image === "string" ? image : null;

    
    if (image && image instanceof File) {
      uploadedImageUrl = await uploadToCloudinary(image);
    }
    

    const updatedData={
      name,
      imageUrl:uploadedImageUrl
    }

    const updatedWorkspace = await db
    .update(workspaces)
    .set(updatedData) 
    .where(eq(workspaces.id, workspaceId)) 
    .returning();

    return c.json({data:updatedWorkspace});


  })

  .delete('/:workspaceId',async(c)=>{
      const user = c.get('user');
      const {workspaceId} = c.req.param();
      
      if (!workspaceId) {
        return c.json({ error: "Workspace ID is required" }, 400);
      }

      const member = await getMember({workspaceId,userId:user!.id});

      if(!member || member.role !== MemberRole.ADMIN) {
        return c.json({error:'Unauthorized'},401)
      };

      await db.delete(workspaces).where(eq(workspaces.id, workspaceId));

      //Todo: delete members and tasks

      return c.json({data:{id:workspaceId}});
  })

  .post('/:workspaceId/reset-invite-code',async(c)=>{
    const user = c.get('user');
    const {workspaceId} = c.req.param();

    if (!workspaceId) {
      return c.json({ error: "Workspace ID is required" }, 400);
    }

    const member = await getMember({workspaceId,userId:user!.id});

    if(!member || member.role !== MemberRole.ADMIN) {
      return c.json({error:'Unauthorized'},401)
    };

    const workspace = await db.update(workspaces)
     .set({inviteCode:generateInviteCode(6)})
     .where(eq(workspaces.id, workspaceId))
     .returning();

    return c.json({data:workspace},200);
})

  .post('/:workspaceId/join',zValidator('json',z.object({code:z.string()})), async(c)=>{

      const user = c.get('user');
      const {workspaceId} = c.req.param();
      const {code} = c.req.valid('json');

      const member = await getMember({workspaceId,userId:user!.id});

      if(member){
        return c.json({error:"Already a member"},400)
      }

      const workspace = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));

      if(!workspace || !workspace[0].inviteCode || workspace[0].inviteCode !==code ){
        return c.json({error:"Invalid invite code"},400)
      }

      await db.insert(workspaceMembers).values({
        workspaceId:workspaceId,
        userId:user!.id,
        role:MemberRole.MEMBER
      });

      return c.json({message:"Joined the workspace",data:workspace?.[0]},200);


})

export default app;
