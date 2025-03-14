import { UserProfileButton } from '@/components/user-profile-button'
import React from 'react'
import { MobileSidebar } from '../sidebar/MobileSidebar'

export  function DashboardHeader() {
  return (
   <nav className='pt-2 px-6 flex items-center justify-between '>

    <div className=' flex-col hidden lg:flex'>

    <h1 className='text-2xl font-semibold'>  Home </h1>
    <p className='text-muted-foreground'> Monitor all of your projects and tasks here</p>

    </div>
    <MobileSidebar/>
    <UserProfileButton/>

   </nav>
  )
}
