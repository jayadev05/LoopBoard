import { getCurrentUser } from '@/features/auth/actions'
import { getWorkspaceById } from '@/features/workspace/actions';
import { EditWorkspaceForm } from '@/features/workspace/components/edit-workspace-form'
import { redirect } from 'next/navigation';
import React from 'react'


interface WorkspaceSettingsPage{
    params:{
        workspaceId: string
    }
}

export default async function WorkspaceSettingsPage({params}:WorkspaceSettingsPage) {

    const user = await getCurrentUser();
    if(!user) redirect('/login');

  
    const workspaceId = params.workspaceId;

    if(!workspaceId) redirect('/');

    const workspace = await getWorkspaceById(workspaceId);
   

    if(!workspace) redirect(`/workspaces/${workspaceId}`);

  return (
    <div className='w-full '>
           <EditWorkspaceForm initialValues={workspace}/>
    </div>
  )
}
