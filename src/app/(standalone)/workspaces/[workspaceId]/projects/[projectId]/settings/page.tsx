import { getCurrentUser } from '@/features/auth/actions'
import { getProjectById } from '@/features/projects/actions';
import { EditProjectForm } from '@/features/projects/components/edit-project-form';
import { redirect } from 'next/navigation';
import React from 'react'

interface ProjectSettingsPageProps{
    params:{
        projectId:string
    }
}

export default async function ProjectSettingsPage({params}:ProjectSettingsPageProps) {
 
 const user = await getCurrentUser();
 if(!user) redirect('/login');


const project = await getProjectById({projectId:params.projectId});

if(!project) return <div>Project not found</div>

    return (
    <div className='w-full'>
      <EditProjectForm initialValues={project}/>
    </div>
  )
}
