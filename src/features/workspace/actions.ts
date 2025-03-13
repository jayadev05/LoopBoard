
import { db } from '@/db/drizzle';
import { workspaceMembers, workspaces } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm'; 
import { getCurrentUser } from '../auth/actions';

export async function getWorkspacesByUserId(userId:string) {
  if (!userId) {
    return [];
  }
  
  const members = await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.userId, userId),
  });
  
  if (!members.length) {
    return [];
  }
  
  const workspaceIds = members.map((member) => member.workspaceId);
  
  const userWorkspaces = await db
    .select()
    .from(workspaces)
    .where(inArray(workspaces.id, workspaceIds));
    
  return userWorkspaces;
}

export async function getWorkspaceById(workspaceId:string){

  const workSpaces = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId));

  if(workSpaces.length===0) return null;
  
  return workSpaces[0];
}