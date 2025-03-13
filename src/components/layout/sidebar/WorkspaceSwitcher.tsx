'use client';

import React from 'react'


import { useGetWorkspaces } from '@/features/workspace/hooks/use-get-workspaces';
import {RiAddCircleFill} from 'react-icons/ri'
import { Select, SelectItem,SelectContent, SelectTrigger, SelectValue } from '../../ui/select';
import { WorkspaceAvatar } from '@/features/workspace/components/workspace-avatar';
import { usePathname, useRouter } from 'next/navigation';
import { useGetWorkspaceId } from '@/features/workspace/hooks/use-get-workspaceId';
import { useCreateWorkspaceModal } from '@/features/workspace/hooks/use-create-workspace-modal';


export function WorkspaceSwitcher() {

  const currentWorkspaceId = useGetWorkspaceId();

  const router = useRouter();

  const { data: workspaces = [], error, isLoading } = useGetWorkspaces();
  const {open} = useCreateWorkspaceModal();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Failed to load workspaces.</p>;
  if (workspaces.length === 0) return <p className="text-gray-500">No workspaces found.</p>;

  const onSelect=(id:string)=>{
    router.push(`/workspaces/${id}`)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500 dark:text-neutral-300">Workspaces</p>
        <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>
      <Select  onValueChange={onSelect} value={currentWorkspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 dark:bg-neutral-600 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces.map((wp) => (
            <SelectItem key={wp.id} value={wp.id}>
              <div className="flex justify-start items-center gap-3 font-medium cursor-pointer">
                <WorkspaceAvatar name={wp.name} image={wp.imageUrl ?? ""} />
                <span className="truncate">{wp.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


