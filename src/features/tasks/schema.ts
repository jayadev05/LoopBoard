import { TaskStatusEnum } from "@/types/tasks";
import { z } from "zod";

export const createTaskSchema = z.object({
    name:z.string().trim().min(1,"Required"),
    status:z.nativeEnum(TaskStatusEnum,{required_error:'Required'}),
    workspaceId:z.string().trim().min(1,"Required"),
    projectId:z.string().trim().min(1,"Required"),
    dueDate:z.string(),
    assigneeId:z.string().trim().min(1,"Required"),
    description:z.string().optional()
})