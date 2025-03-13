import { getCurrentUser } from '@/features/auth/actions';
import { CreateWorkspaceForm } from '@/features/workspace/components/create-workspace-form'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function WorkspaceCreatePage() {

  const user = await getCurrentUser();
    if(!user) redirect('/login');

  return (
    <div className='w-full lg:max-w-xl'>
        <CreateWorkspaceForm/>
    </div>
  )
}
