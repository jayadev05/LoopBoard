import { DashboardHeader } from '@/components/layout/header/DashboardHeader'
import { Sidebar } from '@/components/layout/sidebar/Sidebar'
import { UserProfileButton } from '@/components/user-profile-button'
import { CreateProjectModal } from '@/features/projects/components/create-project-modal'
import { CreateTaskModal } from '@/features/tasks/components/create-task-modal'
import { CreateWorkspaceModal } from '@/features/workspace/components/create-workspace-modal'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface StandaloneLayoutProps{
    children: React.ReactNode
}

export default function StandaloneLayout({children}:StandaloneLayoutProps) {
  return (
   <div className='min-h-screen '>
            <CreateWorkspaceModal/>
            <CreateProjectModal/>
            <CreateTaskModal/>
         
           <div className="flex w-full h-full ">
   
               <div className='fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto '>
                   <Sidebar/>
               </div>        
   
   
               <div className="lg:pl-[264px] w-full ">
                   <div className='mx-auto max-w-screen-4xl h-full'>
                     
                       <main className='h-full py-8 px-6 flex-col'>
                       {children}
                       </main>
                   </div>
              
               </div>
           </div>
          </div>
  )
}
