import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { createWorkspaceSchema } from "../schema";
import { db } from "@/db/drizzle";
import { workspaceMembers, workspaces } from "@/db/schema";
import { getSession, getSessionUser } from "@/lib/session";
import { getServerSession } from "next-auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { MemberRole } from "@/types/members";
import { eq, inArray } from "drizzle-orm";
import { generateInviteCode } from "@/lib/utils";

type Variables = {
  user:
    | {
        id: string;
        isNextAuthLoggedIn?: boolean;
        [key: string]: any;
      }
    | undefined;
};

const app = new Hono<{ Variables: Variables }>()

  .get("/", async (c: Context) => {
    const user = c.get("user");

    // Get active session and user
    let activeUser;

    if (user?.isNextAuthLoggedIn) {
      const session = await getSession();
      const nextSession = await getServerSession();
      const activeSession = session || nextSession;

      if (!activeSession) {
        return c.json({ error: "No active session found" }, 401);
      }

      activeUser = await getSessionUser(activeSession);

      if (!activeUser) {
        return c.json({ error: "User not found in session" }, 401);
      }
    } else {
      activeUser = user;
    }

    const members = await db.query.workspaceMembers.findMany({
        where: eq(workspaceMembers.userId, activeUser.id),
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

    // Get active session and user
    let activeUser;

    if (user?.isNextAuthLoggedIn) {
      const session = await getSession();
      const nextSession = await getServerSession();
      const activeSession = session || nextSession;

      if (!activeSession) {
        return c.json({ error: "No active session found" }, 401);
      }

      activeUser = await getSessionUser(activeSession);

      if (!activeUser) {
        return c.json({ error: "User not found in session" }, 401);
      }
    } else {
      activeUser = user;
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
        userId: activeUser!.id,
        imageUrl: uploadedImageUrl,
        inviteCode
      })
      .returning();

    await db.insert(workspaceMembers).values({
      workspaceId: workspace[0].id,
      userId: activeUser!.id,
      role: MemberRole.ADMIN,
    });

    return c.json({ data: workspace });
  });

export default app;
