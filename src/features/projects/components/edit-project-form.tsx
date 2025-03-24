'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef } from 'react'
import {  useForm } from 'react-hook-form'
import {  updateProjectSchema } from '../schema';
import { z } from 'zod';
import { useUpdateProject } from '../hooks/use-update-project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CopyIcon, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Project } from '@/types/project';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteProject } from '../hooks/use-delete-project';



interface EditProjectFormProps{
    onCancel ?: ()=>void;
    initialValues:Project;
}


export  function EditProjectForm({onCancel,initialValues}:EditProjectFormProps) {

    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null)

    const {mutate:updateProject,isPending} = useUpdateProject();
    const {mutate:deleteProject,isPending:isDeletingProject} = useDeleteProject();
   



    const [DeleteModal,confirmDelete] = useConfirm({
        title:"Delete Project",
        message:"Are you sure you want to delete this project?",
        variant:'destructive'
      });
 

    const form = useForm({
        resolver:zodResolver<z.infer<typeof updateProjectSchema>>(updateProjectSchema),
        defaultValues:{
            ...initialValues,
            image:initialValues.imageUrl ?? ''
        }
    });

    const onSubmit =(values:z.infer<typeof updateProjectSchema>)=>{
        updateProject({
            form:values,
            param:{projectId:initialValues.id}
        },
        {
            onSuccess:()=>{
                form.reset();  
               
            }
        });
    }

    const handleImageChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];

        if(file){
            form.setValue('image',file);
        }
    }

    const handleDelete= async()=>{
        const ok = await confirmDelete();

        if(!ok) return ;

        deleteProject({
            param:{
                projectId:initialValues.id
            }
        },
        {
            onSuccess:()=>  window.location.href='/'
        }
        )
        
    
    }

   

   


  return (
    <div className="flex flex-col gap-y-4">

        <DeleteModal/>
       

          <Card className='w-full h-full  border shadow-none dark:bg-neutral-900' >
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
                            Project Name
                        </FormLabel>
                        <FormControl>
                            <Input
                            {...field}
                            placeholder='enter project name'
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
                                alt='project logo'
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
                            <p className='text-sm'>Project Icon</p>
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

          <Card className='w-full h-full  border shadow-none dark:bg-neutral-900'>
                             <CardContent className='p-7'>
                                 <div className="flex flex-col">
                                     <h3 className='font-bold'>Danger Zone</h3>
                                     <p className='text-muted-foreground text-sm'> Deleting a project is irreversible and will remove all asssociated data     
                                     </p>
                                     <DottedSeparator className='py-7'/>
                                     <Button 
                                     className='mt-6 w-fit ml-auto'
                                     type='button'
                                     variant='destructive'
                                     disabled={isPending || isDeletingProject}
                                     onClick={handleDelete}
                                     >
                                         Delete Project
                                     </Button>
                                 </div>
                             </CardContent>
          </Card>


    </div>
  
  )
}
