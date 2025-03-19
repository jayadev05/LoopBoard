
import { getServerSession } from 'next-auth';

import { getSession } from '@/lib/session';

import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db/drizzle';

// Server action to get the current user
export async function getCurrentUser() {
  try {
    const nextAuthSession = await getServerSession(authOptions);
    const session = await getSession();
    
    const activeSession = nextAuthSession || session;
    
    if (!activeSession) {
      return { error: "Session not found", data: null };
    }
    
    const userId = activeSession.user.id;
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    
    if (!user) {
      return { error: "User not found", data: null };
    }
    
    return { error: null, data: user };
  } catch (error) {
    return { 
      error: "Failed to fetch user", 
      data: null 
    };
  }
}