'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetWorkspaceId } from '@/features/workspace/hooks/use-get-workspaceId';
import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import React, { Fragment } from 'react'
import { useGetMembers } from '../hooks/use-get-members';
import { MemberAvatar } from './member-avatar';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUpdateMember } from '../hooks/use-update-member';
import { useDeleteMember } from '../hooks/use-delete-member';
import { MemberRole } from '@/types/members';
import { useConfirm } from '@/hooks/use-confirm';
import toast from 'react-hot-toast';
import { redirect, useRouter } from 'next/navigation';


export default function MembersList() {

    const workspaceId = useGetWorkspaceId();
    const {data:response}= useGetMembers({workspaceId});
    console.log(response);
    const router = useRouter()
    
    const {mutate:updateMemberRole} = useUpdateMember();
    const {mutate:deleteMember} = useDeleteMember();

    const [DelteModal,confirmDelete] = useConfirm({
        title: 'Delete Member',
        message: 'Are you sure you want to remove this member?',
        variant:'destructive'
    });

    const handleUpdateMember =(role:MemberRole,memberId:string)=>{
        updateMemberRole({
            json:{role},
            param:{memberId}
        },
        {
            onSuccess:()=>{
                toast.success('Member role updated successfully');
                
            },
            onError:(error)=>{
                toast.error(error.message || 'Error updating member role');
            }
        }
    )
    }
    const handleDeleteMember =async(memberId:string)=>{

        const ok = await confirmDelete();

        if(!ok) return;


       deleteMember({
        param:{memberId}
    },{
        onSuccess:()=>{
           toast.success('user removed from workspace');
           router.refresh();
           redirect('/');
        },
        onError:(error)=>{
            toast.error(error.message || 'Error removing member ');
        }
    })
    }

    

  return (
    <Card className='w-full h-full border-none shadow-none'>
        <DelteModal/>
            <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-2 '>
                <Button variant='secondary' size='sm' asChild>
                    <Link href={`/workspaces/${workspaceId}`}>
                    <ArrowLeftIcon className='size-4 mr-2'/>
                    Back
                    </Link>
                
                </Button>

                <CardTitle className='font-bold text-xl'>
                    Members List
                </CardTitle>
            </CardHeader>

            <div className="px-7">
                <DottedSeparator/>
            </div>

            <CardContent className='p-7'>
               {response?.data.members?.map((m,index)=>(
                <Fragment key={m.id}>
                    <div className='flex items-center gap-2'>
                        <MemberAvatar
                        className='size-10'
                        fallbackClassName='text-lg size-10'
                        name={m.name!}/>
                        
                        <div className="flex flex-col">
                            <p className='text-sm font-medium'>{m.name}</p>
                            <p className='text-xs text-muted-foreground'>{m.email}</p>
                
                        </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button className='ml-auto' variant='secondary' size='icon'>
                            <MoreVerticalIcon className='size-4 text-muted-foreground'/>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side='bottom' align='end'>
                            <DropdownMenuItem 
                            className='font-medium'
                             disabled={false} 
                             onClick={()=>handleUpdateMember(MemberRole.ADMIN,m.userId)}
                             >
                                    Set as Administrator
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                            className='font-medium '
                             disabled={false} 
                             onClick={()=>handleUpdateMember(MemberRole.MEMBER,m.userId)}
                             >
                                    Set as Member
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                            className='font-medium text-amber-700'
                             disabled={false} 
                             onClick={()=> handleDeleteMember(m.id)}
                             >
                                    Remove {m.name}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                        
                    </div>
                    {index < response.data.members.length-1 && (<Separator className='my-2'/>)}
                </Fragment>
               ))}
            </CardContent>
    </Card>
  )
}
