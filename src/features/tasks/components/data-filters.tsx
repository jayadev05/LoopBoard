"use client";

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetMembers } from '@/features/members/hooks/use-get-members';
import { useGetProjects } from '@/features/projects/hooks/use-get-projects';
import { useGetWorkspaceId } from '@/features/workspace/hooks/use-get-workspaceId';
import { TaskStatusEnum } from '@/types/tasks';
import { FolderIcon, ListChecksIcon, UserIcon } from 'lucide-react';
import React from 'react'
import { useTaskFilters } from '../hooks/use-task-filters';
import DatePicker from '@/components/date-picker';

interface DataFiltersProps {
    hideProjectFilter?: boolean;
}

export default function DataFilters({ hideProjectFilter }: DataFiltersProps) {
    const workspaceId = useGetWorkspaceId();
    const { data: projects, isPending: isLoadingProjects } = useGetProjects({ workspaceId });
    const { data: members, isPending: isLoadingMembers } = useGetMembers({ workspaceId });

    const isLoading = isLoadingMembers || isLoadingProjects;

    const projectOptions = projects?.map((project) => ({
        value: project.id,
        label: project.name
    }));

    const memberOptions = members?.map((member) => ({
        value: member.userId,
        label: member.name
    }));

    const [{ status, assigneeId, projectId, dueDate }, setFilter] = useTaskFilters();

    const onStatusChange = (value: string) => {
        setFilter({ status: value === 'all' ? null : (value as TaskStatusEnum) });
    };

    const onProjectIdChange = (value: string) => {
        setFilter({ projectId: value === 'all' ? null : value });
    };

    const onAssigneeChange = (value: string) => {
        setFilter({ assigneeId: value === 'all' ? null : value });
    };

    if (isLoading) return null;

    return (
        <div className='flex flex-col lg:flex-row gap-2'>
            {/* Status Filter */}
            <Select defaultValue={status ?? undefined} onValueChange={onStatusChange}>
                <SelectTrigger className='w-full lg:w-auto h-8'>
                    <div className='flex items-center pr-2'>
                        <ListChecksIcon className='size-4 mr-2' />
                        <SelectValue placeholder='All statuses' />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='all'>All Statuses</SelectItem>
                    <SelectSeparator />
                    {Object.values(TaskStatusEnum).map((status) => (
                        <SelectItem key={status} value={status}>
                            {status.replace('_', ' ')}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Project Filter (conditionally hidden) */}
            {!hideProjectFilter && (
                <Select defaultValue={projectId ?? undefined} onValueChange={onProjectIdChange}>
                    <SelectTrigger className='w-full lg:w-auto h-8'>
                        <div className='flex items-center pr-2'>
                            <FolderIcon className='size-4 mr-2' />
                            <SelectValue placeholder='All projects' />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All Projects</SelectItem>
                        <SelectSeparator />
                        {projectOptions?.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                                {p.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {/* Assignee Filter */}
            <Select defaultValue={assigneeId ?? undefined} onValueChange={onAssigneeChange}>
                <SelectTrigger className='w-full lg:w-auto h-8'>
                    <div className='flex items-center pr-2'>
                        <UserIcon className='size-4 mr-2' />
                        <SelectValue placeholder='All assignees' />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='all'>All Assignees</SelectItem>
                    <SelectSeparator />
                    {memberOptions?.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                            {m.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Date Picker */}
            <DatePicker
                placeholder='Due Date'
                classname='h-8 w-full lg:w-auto'
                value={dueDate ? dueDate : undefined}
                onChange={(date) => setFilter({ dueDate: date })}
            />
        </div>
    );
}
