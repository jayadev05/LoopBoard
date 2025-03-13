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
  
 
    const workspace = await getWorkspaceById(params.workspaceId);
   

    if(!workspace) redirect(`/workspaces/${params.workspaceId}`);

  return (
    <div className='w-full lg:max-w-xl'>
           <EditWorkspaceForm initialValues={workspace}/>
    </div>
  )
}
