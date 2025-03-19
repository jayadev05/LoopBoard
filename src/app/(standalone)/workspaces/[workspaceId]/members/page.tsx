import { getCurrentUser } from '@/features/auth/actions'
import MembersList from '@/features/members/components/members-list';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function WorkspaceMemberspage() {

    const user = await getCurrentUser();
    if(!user) redirect('/login')

  return (
    <div className='w-full '>
        <MembersList/>
    </div>
  )
}
