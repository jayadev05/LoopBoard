'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef, useState } from 'react'
import {  useForm } from 'react-hook-form'
import { createProjectSchema } from '../schema';
import { TypeOf, z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCreateProject } from '../hooks/use-create-project';
import { useGetWorkspaceId } from '@/features/workspace/hooks/use-get-workspaceId';

interface CreateprojectFormProps{
    onCancel ?: ()=>void
}


export function CreateProjectForm({onCancel}:CreateprojectFormProps) {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const workspaceId = useGetWorkspaceId();
    const router = useRouter();

    const {mutate:createProject, isPending} = useCreateProject();

   
    const form = useForm({
       resolver:zodResolver(createProjectSchema),
        defaultValues: {
        name: '',
        workspaceId: workspaceId || "",
        }
    });

    const onSubmit = form.handleSubmit((values) => {
        

        if (!workspaceId) {
            console.error("No workspaceId available");
            toast.error("Workspace ID is missing!");
            return;
        }

      
                
        createProject(
                {
                    form: { ...values, workspaceId }
                },
                {
                   onSuccess:({data})=>{
                        router.push(`/workspaces/${workspaceId}/projects/${data[0].id}`)
                   },
                    onError: (error) => {
                        console.error("Mutation error:", error);
                        toast.error(`Error: ${error.message}`);
                    }
                }
            );
          
        
    });

      const handleImageChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
            const file = e.target.files?.[0];
    
            if(file){
                form.setValue('image',file);
            }
        }

    return (
        <Card className='w-full h-full border-none shadow-none dark:bg-neutral-900'>
            <CardHeader className='flex p-7'>
                <CardTitle className='text-xl font-bold'>
                    Create a new project 
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
                                        <FormLabel>Project Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='enter project name' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                                control={form.control}
                                                name="image"
                                                render={({field})=>(
                                                <div className='flex flex-col gap-y-2 mt-4'>
                                                    <div className='flex items-center gap-x-5'>
                                                        {field.value?
                                                        (
                                                          <div className='size-[72px] relative rounded-md overflow-hidden '>
                                                            <Image
                                                            src={
                                                                field.value instanceof File ?
                                                                URL.createObjectURL(field.value) :
                                                                field.value
                                                            }
                                                            fill
                                                            className='object-cover'
                                                            alt='workspace logo'
                                                            />
                                                          </div>  
                                                        )
                                                        :
                                                        (
                                                        <Avatar className='size-[72px]'>
                                                            <AvatarFallback>
                                                                <ImageIcon className='text-neutral-400 size-[36px]'/>
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        )
                                                       }
                                                       <div className='flex flex-col  '>
                                                        <p className='text-sm'>Workspace Icon</p>
                                                        <p className='text-sm text-muted-foreground'>JPG, PNG, SVG, or JPEG, max 1mb</p>
                                                       <input 
                                                       type='file' 
                                                       className='hidden'
                                                        accept='.jpg, .png, .jpeg, .svg'
                                                        ref={inputRef}
                                                        disabled={isPending}
                                                        onChange={handleImageChange}
                                                        />
                            
                                                        {field.value ?
                                                         (
                                                            <Button 
                                                            type='button' 
                                                            variant='destructive'
                                                            disabled={isPending}
                                                            className='w-fit mt-2'
                                                             size='xs'
                                                             onClick={()=> {
                                                                field.onChange(null);
                                                                if(inputRef.current){
                                                                    inputRef.current.value = '';
                                                                }
                            
                                                             }}
                                                             >Remove Image
                                                             </Button>
                                                         )
                                                          :
                                                          (
                                                            <Button 
                                                            type='button' 
                                                            variant='tertiary'
                                                            disabled={isPending}
                                                            className='w-fit mt-2'
                                                             size='xs'
                                                             onClick={()=> inputRef.current?.click()}
                                                             >Upload Image
                                                             </Button>
                                                          )
                                                          }
                                                     
                            
                                                       </div>
                                                    </div>
                                                </div>
                                                )}
                                                />
                        </div>
                        <DottedSeparator className='py-7'/>
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
                                Create project
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
