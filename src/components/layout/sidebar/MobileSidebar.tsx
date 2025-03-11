'use client';

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet,SheetContent,SheetTitle,SheetTrigger } from '@/components/ui/sheet'

import { MenuIcon } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { usePathname } from 'next/navigation'



export  function MobileSidebar() {

    const [isOpen,setIsOpen]= useState(false);

    const pathname = usePathname();

    useEffect(()=>{
        setIsOpen(false);
    },[pathname])

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
            <Button size='default' variant='secondary' className='lg:hidden'>
                <MenuIcon className='size-5 text-neutral-500'/>
            </Button>
        </SheetTrigger>
        <SheetContent side='left' className='p-0'>
        <SheetTitle className="sr-only">
          Navigation Menu
        </SheetTitle>
            <Sidebar/>
        </SheetContent>
    </Sheet>
  )
}
