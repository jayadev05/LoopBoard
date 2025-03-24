import { User } from "@/types/auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schema";
import { getMember } from "@/features/members/utils";
import { db } from "@/db/drizzle";
import { projects, tasks, users } from "@/db/schema";
import { and, desc, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { TaskStatusEnum } from "@/types/tasks";

type Variables = {
  user: User | null;
};

const app = new Hono<{ Variables: Variables }>()

    .get('/',zValidator(
      'query',
      z.object({
      workspaceId:z.string(),
      projectId:z.string().nullish(),
      assigneeId:z.string().nullish(),
      status:z.nativeEnum(TaskStatusEnum).nullish(),
      search:z.string().nullish(),
      dueDate:z.date().nullish()
    })
   )
  , async(c)=>{

    const user = c.get('user');

    const {workspaceId,projectId, assigneeId, status, search, dueDate} =c.req.valid('query');

    const member = await getMember({
      workspaceId,
      userId: user!.id
    })

    if(!member) return c.json({error:"Unauthorized"},401);

    const conditions = [
      eq(tasks.workspaceId,workspaceId),
    ]

    if (projectId) conditions.push(eq(tasks.projectId, projectId));
    if (assigneeId) conditions.push(eq(tasks.assigneeId, assigneeId));
    if (status) conditions.push(eq(tasks.status, status));
    if (search) conditions.push(ilike(tasks.name, `%${search}%`)); 
    if (dueDate) conditions.push(eq(tasks.dueDate, dueDate));

    const results = await db
      .select({
        id: tasks.id,
        name: tasks.name,
        status: tasks.status,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        workspaceId: tasks.workspaceId,
        project: {
          id: projects.id,
          name: projects.name,
        },
        assignee: {
          id: users.id,
          name: users.name,
          email: users.email
        }
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id)) // Join projects
      .leftJoin(users, eq(tasks.assigneeId, users.id)) // Join assignees
      .where(and(...conditions))
      .orderBy(desc(tasks.createdAt));

      return c.json({data:results});

    


    })
    .post('/',zValidator('json',createTaskSchema),async(c)=>{
      const user = c.get('user');
      const {
        name,
        workspaceId,
        projectId,
        status,
        assigneeId,
        dueDate,
        description,
      } = c.req.valid('json');

      const member = await getMember({
        workspaceId,
        userId:user!.id
      });

      if(!member) return c.json({error:'Unauthorized'},401);


      const highestPostionTask = await db.select()
        .from(tasks)
        .where(and(eq(tasks.status,status),eq(tasks.workspaceId,workspaceId)))
        .orderBy(tasks.position)
        .limit(1);

      const newPostion = highestPostionTask.length > 0 
                        ?  highestPostionTask[0].position + 1000
                        : 1000;

      const task = await db.insert(tasks).values({
        name,
        workspaceId,
        projectId,
        status,
        assigneeId,
        dueDate,
        description,
        position:newPostion
      }).returning() ;
      
      return c.json({data:task},200);


    })


export default app;    