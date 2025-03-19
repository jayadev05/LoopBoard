import { DashboardHeader } from '@/components/layout/header/DashboardHeader'
import { Sidebar } from '@/components/layout/sidebar/Sidebar'
import { CreateProjectModal } from '@/features/projects/components/create-project-modal'
import { CreateWorkspaceModal } from '@/features/workspace/components/create-workspace-modal'
import React from 'react'

interface DashboardLayoutProps{
    children: React.ReactNode
}

export default function DashboardLayout({children}:DashboardLayoutProps) {
  return (
    <div className='min-h-screen '>
        <CreateWorkspaceModal/>
        <CreateProjectModal/>
        <div className="flex w-full h-full ">

            <div className='fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto '>
                <Sidebar/>
            </div>        


            <div className="lg:pl-[264px] w-full ">
                <div className='mx-auto max-w-screen-4xl h-full'>
                    <DashboardHeader/>
                    <main className='h-full py-8 px-6 flex-col'>
                    {children}
                    </main>
                </div>
           
            </div>
        </div>
       </div>
  )
}
