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
import { CopyIcon, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Workspace } from '@/types/workspace';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteWorkspace } from '../hooks/use-delete-workspace';
import toast from 'react-hot-toast';
import { useResetInviteCode } from '../hooks/use-reset-invite-code';


interface EditWorkspaceFormProps{
    onCancel ?: ()=>void;
    initialValues:Workspace;
}


export  function EditWorkspaceForm({onCancel,initialValues}:EditWorkspaceFormProps) {

    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null)

    const {mutate:updateWorkspace,isPending} = useUpdateWorkspace();
    const {mutate:deleteWorkspace,isPending:isDeletingWorkspace} = useDeleteWorkspace();
    const {mutate:resetInviteLink,isPending:isResetingInviteLink} = useResetInviteCode();



    const [DeleteModal,confirmDelete] = useConfirm({
        title:"Delete Workspace",
        message:"Are you sure you want to delete this workspace?",
        variant:'destructive'
      });
    const [ResetLinkModal,confirmResetLink] = useConfirm({
        title:"Reset Invite Link",
        message:"This will invalidate the current invite link",
        variant:'destructive'
      });

    const form = useForm({
        resolver:zodResolver<z.infer<typeof updateWorkspaceSchema>>(updateWorkspaceSchema),
        defaultValues:{
            ...initialValues,
            image:initialValues.imageUrl ?? ''
        }
    });

    const onSubmit =(values:z.infer<typeof updateWorkspaceSchema>)=>{
        updateWorkspace({
            form:values,
            param:{workspaceId:initialValues.id}
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

        deleteWorkspace({
            param:{
                workspaceId:initialValues.id
            }
        },
        {
            onSuccess:()=>  window.location.href='/'
        }
        )
        
    
    }

    const handleCopyInviteLink=()=>{
        navigator.clipboard.writeText(fullInvitelink)
        .then(()=>toast.success('link copied to clipboard'));

        
    }

    const handleLinkReset =async()=>{

        const ok = await confirmResetLink();

        if(!ok) return ;

        resetInviteLink({
            param:{
                workspaceId:initialValues.id
            }
        },
         )
    }

    const fullInvitelink =`${window.location.origin}/workspaces/${initialValues.id}/join/${initialValues.inviteCode}`


  return (
    <div className="flex flex-col gap-y-4">

        <DeleteModal/>
        <ResetLinkModal/>

          <Card className='w-full h-full border shadow-none  dark:bg-neutral-900' >
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

         <Card className='w-full h-full border shadow-none  dark:bg-neutral-900'>
                    <CardContent className='p-7'>
                        <div className="flex flex-col">
                            <h3 className='font-bold'>Invite Members</h3>
                            <p className='text-muted-foreground text-sm'> 
                               Use the inviet link to add members to your workspace.   
                            </p>
                            <div className='mt-4'>
                                <div className='flex items-center gap-x-2'>
                                    <Input disabled value={fullInvitelink}/>
                                    <Button
                                    className='size-12'
                                    variant='secondary'
                                    onClick={handleCopyInviteLink}
                                    >
                                      <CopyIcon className='size-5'/>
                                    </Button>
                                </div>
                            </div>
                            <DottedSeparator className='py-7'/>
                            <Button 
                            className='mt-6 w-fit ml-auto'
                            type='button'
                            variant='destructive'
                            disabled={isPending || isResetingInviteLink}
                            onClick={handleLinkReset}
                            >
                               Reset Link
                            </Button>
                        </div>
                    </CardContent>
         </Card>

         <Card className='w-full h-full border shadow-none  dark:bg-neutral-900'>
                    <CardContent className='p-7'>
                        <div className="flex flex-col">
                            <h3 className='font-bold'>Danger Zone</h3>
                            <p className='text-muted-foreground text-sm'> Deleting a workspace is irreversible and will remove all asssociated data     
                            </p>
                            <DottedSeparator className='py-7'/>
                            <Button 
                            className='mt-6 w-fit ml-auto'
                            type='button'
                            variant='destructive'
                            disabled={isPending || isDeletingWorkspace}
                            onClick={handleDelete}
                            >
                                Delete Workspace
                            </Button>
                        </div>
                    </CardContent>
         </Card>

    </div>
  
  )
}
