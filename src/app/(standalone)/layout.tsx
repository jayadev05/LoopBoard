import { DashboardHeader } from '@/components/layout/header/DashboardHeader'
import { Sidebar } from '@/components/layout/sidebar/Sidebar'
import { UserProfileButton } from '@/components/user-profile-button'
import { CreateWorkspaceModal } from '@/features/workspace/components/create-workspace-modal'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface StandaloneLayoutProps{
    children: React.ReactNode
}

export default function StandaloneLayout({children}:StandaloneLayoutProps) {
  return (
   <main className='bg-neutral-100 dark:bg-neutral-800 min-h-screen'>
        <div className='mx-auto max-w-screen-4xl '>
           <nav className='flex justify-between items-center h-[73px] dark:bg-neutral-900 p-4'>
            <Link href='/' className='flex gap-2'>
            <Image src='/logo.svg' alt='logo' height={46} width={46}/>
            <h1 className='text-lg font-bold'>LoopBoard</h1>
            </Link>
            <UserProfileButton/>
           </nav>
            <div className='flex flex-col items-center justify-center p-4'>
                {children}
            </div>

        </div>
   </main>
  )
}
