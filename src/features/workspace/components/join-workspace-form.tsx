'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Workspace } from '@/types/workspace';
import Link from 'next/link';
import React from 'react'
import { useJoinWorkspace } from '../hooks/use-join-workspace';
import { useGetInviteCode } from '../hooks/use-get-inviteCode';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type JoinWorkspaceFormProps = {
    workspace:Workspace
}

export default function JoinWorkspaceForm({workspace}: JoinWorkspaceFormProps) {

    const router = useRouter();

    const {mutate:joinWorkspace,isPending} = useJoinWorkspace();

    const inviteCode = useGetInviteCode();

    const onSubmit=async()=>{
        joinWorkspace({
         param:{workspaceId:workspace?.id},
         json:{code:inviteCode}
        },
    {
        onSuccess:({data})=>{
            router.push(`/workspaces/${data.id}`)
        },
        onError:(error)=>{
            toast.error(error.message ||'Failed to join workspace');
        }
    }
    );
    }


  return (
    <Card className='w-full h-full border-none shadow-none'>

        <CardHeader className='p-7'>
            <CardTitle className='text-xl font-bold'>
                Join Workspace
            </CardTitle>
            <CardDescription>
                You have been invited to join <strong>{workspace.name}</strong> workspace.
            </CardDescription>
        </CardHeader>
        <div className="px-7">
            <DottedSeparator/>
        </div>
        <CardContent className='p-7'>
            <div className="flex flex-col lg:flex-row items-center gap-2 justify-between">
                <Button 
                className='w-full lg:w-fit'
                variant='secondary'
                type='button'
                size='lg'
                asChild
                >
                    <Link href='/'>
                     Cancel
                    </Link>
                  
                </Button>
                <Button
                 className='w-full lg:w-fit'
                 size='lg'
                 type='button'
                 onClick={onSubmit}
                 disabled={isPending}
                 >
                    Join Workspace
                </Button>
            </div>
        </CardContent>
    </Card>
  )
}