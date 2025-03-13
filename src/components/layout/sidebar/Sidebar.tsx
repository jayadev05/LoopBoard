
import { DottedSeparator } from '@/components/dotted-separator'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Navigation } from './Navigation'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'

export  function Sidebar() {
  return (
    <aside className='h-full bg-neutral-100 dark:bg-[#171717] p-4 w-full'>
            <Link href='/' className='flex gap-2'>
            <Image
             src='/logo.svg'
             alt='logo'
             width={38}
             height={32}
             />
            <h1 className='font-bold text-lg '>LoopBoard</h1>
            </Link>

            <DottedSeparator className='my-4'/>
            <WorkspaceSwitcher/>
            <DottedSeparator className='my-4'/>

            <Navigation/>
    </aside>
  )
}
