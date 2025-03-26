'use client'

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetMembers } from '@/features/members/hooks/use-get-members';
import { useGetProjects } from '@/features/projects/hooks/use-get-projects';
import { useGetWorkspaceId } from '@/features/workspace/hooks/use-get-workspaceId';
import { TaskStatusEnum } from '@/types/tasks';
import { ListChecksIcon } from 'lucide-react';
import React from 'react'


interface DataFiltersProps {
    hideProjectFilter?:boolean;
}

export default function DataFilters({hideProjectFilter}:DataFiltersProps) {

    const workspaceId = useGetWorkspaceId();

    const {data:projects,isPending:isLoadingProjects} = useGetProjects({workspaceId});
    const {data:members,isPending:isLoadingMembers} = useGetMembers({workspaceId});

    const isLoading = isLoadingMembers || isLoadingProjects;

    const projectOptions = projects?.map((project) => ({
        value:project.id,
        label:project.name
    }));

    const memberOptions = members?.map((member) => ({
        value:member.userId,
        label:member.name
    }));

    if(isLoading) return null;

  return (
    <div className='flex flex-col lg:flex-row gap-2'>
        <Select defaultValue={undefined} onValueChange={()=>{}}>
        <SelectTrigger className='w-full lg:w-auto h-8'>
            <div className='flex items-center pr-2'>
                <ListChecksIcon className='size-4 mr-2'/>
                <SelectValue placeholder='All statuses' />
            </div>
        </SelectTrigger>
        <SelectContent>
            <SelectItem value='all'>
                All statuses
            </SelectItem>
            <SelectSeparator/>
            <SelectItem value={TaskStatusEnum.BACKLOG}>
                Backlog
            </SelectItem>
            <SelectItem value={TaskStatusEnum.DONE}>
                Done
            </SelectItem>
            <SelectItem value={TaskStatusEnum.IN_PROGRESS}>
                In Progress
            </SelectItem>
            <SelectItem value={TaskStatusEnum.IN_REVIEW}>
                In Review
            </SelectItem>
            <SelectItem value={TaskStatusEnum.TODO}>
                Todo
            </SelectItem>
        </SelectContent>
        </Select>
    </div>
  )
}
