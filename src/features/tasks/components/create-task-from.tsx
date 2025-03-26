'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef, useState } from 'react'
import {  useForm } from 'react-hook-form'
import { createTaskSchema } from '../schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useGetWorkspaceId } from '@/features/workspace/hooks/use-get-workspaceId';
import { useCreateTask } from '../hooks/use-create-task';
import DatePicker from '@/components/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { TaskStatusEnum } from '@/types/tasks';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useGetProjectId } from '@/features/projects/hooks/use-get-projectId';



interface CreateprojectFormProps{
    onCancel ?: ()=>void;
    projectOptions :{
        id: string,
        name: string ,
        imageUrl: string | null ,
    }[];
    memberOptions :{
        id: string
        name:string | null ,
    }[];
}


export function CreateTaskForm({onCancel,projectOptions,memberOptions}:CreateprojectFormProps) {

 
    const projectId = useGetProjectId();
    const workspaceId = useGetWorkspaceId();

    const inputRef = useRef<HTMLInputElement | null>(null);

    const router = useRouter();

    const {mutate:createTask, isPending} = useCreateTask();

   
    const form = useForm({
       resolver:zodResolver(createTaskSchema),
        defaultValues: {
        name: '',
        workspaceId
       
        }
    });

    const onSubmit = form.handleSubmit((values) => {
        

        if (!workspaceId) {
            console.error("No workspaceId available");
            toast.error("Workspace ID is missing!");
            return;
        }

      
                
        createTask(
                {
                    json: { ...values,workspaceId }
                },
                {
                   onSuccess:({data})=>{
                       form.reset();
                       router.push(`/workspaces/${workspaceId}/tasks/${data[0].id}`)
                   },
                   
                }
            );
          
        
    });

     

    return (
        <Card className='w-full h-full border-none shadow-none dark:bg-neutral-900'>
            <CardHeader className='flex p-7'>
                <CardTitle className='text-xl font-bold'>
                    Create a new task 
                </CardTitle>
            </CardHeader>
            <div className='px-7'>
                <DottedSeparator/>
            </div>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={onSubmit}>
                        <div className='py-4'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Task Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='enter task name' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <DatePicker {...field} placeholder='select due date' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="assigneeId"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Assignee</FormLabel>
                                        <Select
                                         defaultValue={field.value}
                                         onValueChange={field.onChange}
                                         >  
                                           <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select assignee'/>                                              
                                            </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                {memberOptions.map(m=>(
                                                    <SelectItem key={m.id} value={m.id}>
                                                        <div className='flex items-center gap-x-2'>
                                                            <MemberAvatar 
                                                            className='size-6'
                                                            name={m.name!}/>
                                                            {m.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                           
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="projectId"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Project</FormLabel>
                                        <Select
                                         defaultValue={field.value}
                                         onValueChange={field.onChange}
                                         >  
                                           <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select project'/>                                              
                                            </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                {projectOptions.map(p=>(
                                                    <SelectItem key={p.id} value={p.id}>
                                                        <div className='flex items-center gap-x-2'>
                                                            <ProjectAvatar 
                                                            className='size-6'
                                                            name={p.name!}
                                                            image={p.imageUrl ?? undefined}
                                                            />
                                                            {p.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                           
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                         defaultValue={field.value}
                                         onValueChange={field.onChange}
                                         >  
                                           <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select status'/>                                              
                                            </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                <SelectItem value={TaskStatusEnum.BACKLOG}>
                                                    Backlog
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
                                                <SelectItem value={TaskStatusEnum.DONE}>
                                                    Done
                                                </SelectItem>
                                               
                                            </SelectContent>
                                           
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                         
                        </div>
                        <DottedSeparator className='py-4'/>
                        <div className="flex items-center justify-between">
                            <Button 
                                type='button'
                                size='lg' 
                                variant='secondary'
                                className={cn(!onCancel && 'invisible')}
                                disabled={isPending} 
                                onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button 
                                type='submit'
                                disabled={isPending} 
                                size='lg'>
                                Create task
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
