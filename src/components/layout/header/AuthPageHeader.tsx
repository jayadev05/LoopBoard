'use client';

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'


export  function AuthPageHeader() {

  
  const pathname = usePathname();
  const isSignIn = pathname === '/login';

  return (
   <nav className='flex justify-between items-center'>

    
    <div className='flex gap-2 items-center'>
        <Image 
         src='/logo.svg'
         alt='logo'
         width={50}
         height={50}
         />
        <h1 className='text-lg font-bold'>LoopBoard</h1>
    </div>

    <Link href={isSignIn ? '/register' : '/login'}>
     <Button variant='secondary'>{isSignIn ? 'Sign Up' : 'Login'}</Button>
    </Link>
    

    
   </nav>
  )
}
