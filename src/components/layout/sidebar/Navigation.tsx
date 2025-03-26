'use client';

import { useGetWorkspaceId } from '@/features/workspace/hooks/use-get-workspaceId';
import { cn } from '@/lib/utils'
import { SettingsIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import {GoCheckCircle, GoCheckCircleFill, GoHome,GoHomeFill} from 'react-icons/go'
import { RiSettings2Fill, RiSettings2Line, RiUser2Fill, RiUser2Line } from 'react-icons/ri';

const routes =[

    {
        label:'Home',
        href:'/',
        icon:GoHome,
        activeIcon:GoHomeFill
    },
    {
        label:'My Tasks',
        href:'/tasks',
        icon:GoCheckCircle,
        activeIcon:GoCheckCircleFill
    },
    {
        label:'Settings',
        href:'/settings',
        icon:RiSettings2Line,
        activeIcon:RiSettings2Fill
    },
    {
        label:'Members',
        href:'/members',
        icon:RiUser2Line,
        activeIcon:RiUser2Fill
    },
  

]


export  function Navigation() {


    const workspaceId = useGetWorkspaceId();
    const pathname = usePathname();


  return (
    <ul>
        {
            routes.map((route, index) => {
                const fullHref = route.href === '/' ? `/workspaces/${workspaceId}` : `/workspaces/${workspaceId}${route.href}`;
                const isActive = pathname===fullHref;
                const Icon = isActive ? route.activeIcon : route.icon;

                return <Link href={fullHref} key={index}>
                         <div className={cn('flex items-center gap-2 p-2.5 rounded-md font-medium hover:text-primary hover:dark:text-white hover:dark:bg-neutral-800 transition text-neutral-500 dark:text-neutral-300',
                            isActive ? 'bg-white dark:bg-neutral-700 shadow-sm hover:opacity-100  text-primary' : ''
                         )}>
                            <Icon className='size-5 text-neutral-500 dark:text-neutral-300'/>
                            {route.label}
                         </div>  
                       </Link>
            })
        }
    </ul>
  )
}
