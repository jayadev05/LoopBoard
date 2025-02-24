import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

export  function AuthPageHeader() {
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

    <Button variant='secondary'>Sign Up</Button>

    
   </nav>
  )
}
