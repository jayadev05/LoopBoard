

import { AuthPageHeader } from '@/components/layout/header/AuthPageHeader'
import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import React from 'react'

interface AuthLayoutProps {
    children :React.ReactNode
}

export default async function AuthLayout({children}:AuthLayoutProps) {


  return (
    <main className='bg-neutral-100 dark:bg-gray-800 min-h-screen'>
   
    <div className="mx-auto max-w-screen-4xl p-4">
    <AuthPageHeader/>
    <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
    {children}
    </div>
  
    </div>
   
    </main>
  )
}
