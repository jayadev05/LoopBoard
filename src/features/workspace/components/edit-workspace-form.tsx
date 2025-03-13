'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef } from 'react'
import {  useForm } from 'react-hook-form'
import {  updateWorkspaceSchema } from '../schema';
import { z } from 'zod';
import { useUpdateWorkspace } from '../hooks/use-update-workspace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Workspace } from '@/types/workspace';

interface EditWorkspaceFormProps{
    onCancel ?: ()=>void;
    initialValues:Workspace;
}


export  function EditWorkspaceForm({onCancel,initialValues}:EditWorkspaceFormProps) {

    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null)

    const {mutate,isPending} = useUpdateWorkspace();

    const form = useForm({
        resolver:zodResolver<z.infer<typeof updateWorkspaceSchema>>(updateWorkspaceSchema),
        defaultValues:{
            ...initialValues,
            image:initialValues.imageUrl ?? ''
        }
    });

    const onSubmit =(values:z.infer<typeof updateWorkspaceSchema>)=>{
        mutate({
            form:values,
            param:{workspaceId:initialValues.id}
        },
        {
            onSuccess:({data})=>{
                form.reset();
              
                router.push(`/workspaces/${data[0].id}`);
            }
        });
    }

    const handleImageChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];

        if(file){
            form.setValue('image',file);
        }
    }


  return (
    <Card className='w-full h-full border-none shadow-none dark:bg-neutral-900' >
        <CardHeader className='flex p-7'>
            <CardTitle className='text-xl font-bold'>
                {initialValues.name}
            </CardTitle>
        </CardHeader>
        <div className='px-7'>
            <DottedSeparator/>
        </div>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='py-4 '>
                    <FormField
                    control={form.control}
                    name="name"
                    render={({field})=>(
                       <FormItem>
                        <FormLabel>
                            Workspace Name
                        </FormLabel>
                        <FormControl>
                            <Input
                            {...field}
                            placeholder='enter workspace name'
                            />
                        </FormControl>
                        <FormMessage/>
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
                            <Button 
                            type='button' 
                            variant='tertiary'
                            disabled={isPending}
                            className='w-fit mt-2'
                             size='xs'
                             onClick={()=> inputRef.current?.click()}
                             >Upload Image
                             </Button>
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
                     disabled={isPending} 
                      onClick={onCancel? onCancel :()=>router.push(`/workspaces/${initialValues.id}`)}>
                      Back
                    </Button>
                    <Button 
                    type='submit'
                     disabled={isPending} 
                     size='lg'>
                        Save Changes
                    </Button>
                   </div>


                </form>
            </Form>
        </CardContent>
    </Card>
  )
}
