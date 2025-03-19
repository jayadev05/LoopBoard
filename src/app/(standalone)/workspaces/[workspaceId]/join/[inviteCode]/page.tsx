import { getCurrentUser } from '@/features/auth/actions'
import { getWorkspaceById } from '@/features/workspace/actions';
import JoinWorkspaceForm from '@/features/workspace/components/join-workspace-form';
import { redirect } from 'next/navigation';
import React from 'react'

type WorkspaceJoinPageProps = {
    params:{
        workspaceId:string
    }
}

export default async function WorkspaceJoinPage({params}: WorkspaceJoinPageProps) {

    const user = await getCurrentUser();
    if(!user) redirect('/login');

    const workspaceId = params.workspaceId;

    const workspace = await getWorkspaceById(workspaceId)

  return (
    <div className='w-full lg:max-w-2xl'>
       
       <JoinWorkspaceForm workspace={workspace!}/>
        
    </div>
  )
}
