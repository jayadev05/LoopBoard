
import {  getServerSession } from 'next-auth';
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getSession, getSessionUser, } from '@/lib/session';
import { getWorkspacesByUserId } from '@/features/workspace/actions';
import { redirect } from 'next/navigation';




export default  async function Home() {

  const  nextAuthsession= await getServerSession(authOptions);
  const session = await getSession();

  const activeSession  = nextAuthsession || session;

  const user = await getSessionUser(activeSession!);

  const workspaces = await getWorkspacesByUserId(user!.id);

  if(workspaces.length===0){
    redirect('/workspaces/create')
  }
  else{
    redirect(`/workspaces/${workspaces[0].id}`)
  }

}
