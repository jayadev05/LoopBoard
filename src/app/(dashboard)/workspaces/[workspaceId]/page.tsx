import { getCurrentUser } from '@/features/auth/actions'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function WorkspaceIdPage() {

  const user = await getCurrentUser();
  if(!user) redirect('/login');
  
  return (
    <div>workspace ID</div>
  )
}
