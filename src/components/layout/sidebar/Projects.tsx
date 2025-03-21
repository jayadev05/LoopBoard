'use client';

import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { useGetProjects } from '@/features/projects/hooks/use-get-projects';
import { useGetWorkspaceId } from '@/features/workspace/hooks/use-get-workspaceId';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { RiAddCircleFill } from 'react-icons/ri';

export  function Projects() {

    const pathname = usePathname();

    const {open} = useCreateProjectModal();

    const workspaceId = useGetWorkspaceId();
    const {data:response} = useGetProjects({workspaceId});

  return (
    <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase text-neutral-500 dark:text-neutral-300">Projects</p>
            <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
          </div>
          {response?.data.map(project=>{
            const href =`/workspaces/${workspaceId}/projects/${project.id}`
            const isActive = pathname === href

            return (
                <Link href={href} key={project.id}>
                    <div className={cn('flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500',
                        isActive ? 'bg-neutral-200 dark:bg-neutral-800 shadow-sm hover:opacity-100 text-primary' : ''
                    )}>
                      <ProjectAvatar image={project.imageUrl || ''} name={project.name}/>
                        <span className='truncate'>{project.name}</span>
                    </div>
                </Link>
            )
          })}
    </div>  
  )
}
