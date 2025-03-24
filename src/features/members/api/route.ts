import { User } from "@/types/auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMember } from "../utils";
import { users, workspaceMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
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
      const { workspaceId } = c.req.valid("query");

      const members = await db
        .select({
          id: workspaceMembers.id,
          userId: workspaceMembers.userId,
          role: workspaceMembers.role,
          name: users.name,
          email: users.email,
        })
        .from(workspaceMembers)
        .where(eq(workspaceMembers.workspaceId, workspaceId))
        .innerJoin(users, eq(users.id, workspaceMembers.userId));

      if (!members.some((m) => m.userId === user!.id)) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      return c.json(members,200);
    }
  )

  .delete("/:memberId", async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { memberId } = c.req.param();

    const memberToDelete = await db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.id, memberId))
      .then((rows) => rows[0]);

     

    if (!memberToDelete) {
      return c.json({ error: "Member not found" }, 404);
    }

    const allMembersInWorkspace = await db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, memberToDelete.workspaceId));

    

    if (allMembersInWorkspace.length === 1) {
      return c.json(
        { error: "Cannot remove the only member of a workspace" },
        400
      );
    }

    const member = await getMember({
      workspaceId: memberToDelete.workspaceId,
      userId: memberToDelete.userId,
    });

    if (
      !member ||
      (member.userId !== memberToDelete.userId &&
        member.role !== MemberRole.ADMIN)
    ) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await db
      .delete(workspaceMembers)
      .where(eq(workspaceMembers.id, memberId));

    return c.json({ message: "Member removed successfully", data: {workspaceId:memberToDelete.workspaceId} },200);
  })

  .patch(
    "/:memberId",
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {

      const {role} = c.req.valid('json')
      const user = c.get("user");
      const { memberId } = c.req.param();

      if (!user) return c.json({ error: "Unauthorized" }, 401);

      const memberToUpdate = await db
        .select()
        .from(workspaceMembers)
        .where(eq(workspaceMembers.userId, memberId))
        .then((rows) => rows[0]);

      if (!memberToUpdate) {
        return c.json({ error: "Member not found" }, 404);
      }

      const member = await getMember({
        workspaceId: memberToUpdate.workspaceId,
        userId: user!.id,
      });

      if (!member || member.role !== MemberRole.ADMIN)
        return c.json({ error: "Unauthorized" }, 401);

      const allMembersInWorkspace = await db
        .select()
        .from(workspaceMembers)
        .where(eq(workspaceMembers.workspaceId, memberToUpdate.workspaceId));

      if (allMembersInWorkspace.length === 1) {
        return c.json(
          { error: "Cannot change role of the only member of a workspace" },
          400
        );
      }

      await db.update(workspaceMembers).set({role}).where(eq(workspaceMembers.userId,memberId));

      return c.json({data:{workspaceId:memberToUpdate.workspaceId}},200);

    }
  );

export default app;
