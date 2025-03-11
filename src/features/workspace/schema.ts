import { z } from "zod";


export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(1,'Please enter a workspace name'),
    image: z.any().optional(), 
})