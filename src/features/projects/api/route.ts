import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { getMember } from "@/features/members/utils";
import { User } from "@/types/auth";
import { zValidator } from "@hono/zod-validator";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schema";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { MemberRole } from "@/types/members";

type Variables = {
  user: User | null;
};

const app = new Hono<{ Variables: Variables }>()

  .get(
    "/",
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");

      if (!user) return c.json({ error: "Unauthorized" }, 401);

      const { workspaceId } = c.req.valid("query");

      if (!workspaceId) return c.json({ error: "Missing workspaceId" }, 400);

      const member = await getMember({
        workspaceId,
        userId: user!.id,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const projectsData = await db
        .select()
        .from(projects)
        .where(eq(projects.workspaceId, workspaceId))
        .orderBy(desc(projects.createdAt));

      return c.json(projectsData, 200);
    }
  )
  .post("/", zValidator("form", createProjectSchema), async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "User not found in session" }, 401);
    }

    const { name, image, workspaceId } = c.req.valid("form");

    const member = await getMember({
      workspaceId,
      userId: user!.id,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 401);

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

    return c.json({ data: project },200);
  })
  .patch("/:projectId", zValidator("form", updateProjectSchema), async (c) => {
    const user = c.get("user");
    const { projectId } = c.req.param();
    const { name, image } = c.req.valid("form");

    const projectToUpdate = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId));

      if(!projectToUpdate) return c.json({ error: "Project not found" }, 404);

    const member = await getMember({
      workspaceId: projectToUpdate[0].workspaceId,
      userId: user!.id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "You are not an admin of this workspace" }, 403);
    }

    let uploadedImageUrl = typeof image === "string" ? image : null;

    if (image && image instanceof File) {
      uploadedImageUrl = await uploadToCloudinary(image);
    }

    const updatedData = {
      name,
      imageUrl: uploadedImageUrl,
    };

    const updatedProject = await db
      .update(projects)
      .set(updatedData)
      .where(eq(projects.id, projectId))
      .returning();

    return c.json({ data: updatedProject },200);
  })
  .delete('/:projectId',async(c)=>{
    const user = c.get('user');
    const {projectId} = c.req.param();
    
    if (!projectId) {
      return c.json({ error: "Workspace ID is required" }, 400);
    }

    const projectToDelete = await db.select().from(projects).where(eq(projects.id,projectId))

    const member = await getMember({workspaceId:projectToDelete[0].workspaceId,userId:user!.id});

    if(!member || member.role !== MemberRole.ADMIN) {
      return c.json({error:'Unauthorized'},401)
    };

    await db.delete(projects).where(eq(projects.id, projectId));

    //Todo: delete members and tasks

    return c.json({data:{id:projectId}},200);
})


export default app;
