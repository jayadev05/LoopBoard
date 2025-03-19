import { ResponsiveModal } from '@/components/responsive-modal';
import { Button, ButtonProps } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React, { JSXElementConstructor, useState } from 'react'


interface useConfirmProps{
    title:string
    message: string
    variant:ButtonProps['variant']
}

export  const  useConfirm =({
    title,
    message,
    variant='primary'
}:useConfirmProps) : [()=>React.ReactNode,()=> Promise<unknown>]  =>  {

    const [promise,setPromise] = useState<{resolve:(value:boolean)=>void} | null >(null);

    const confirm = ()=>{
       return new Promise((resolve)=>{
            setPromise({resolve})
        })
    }

    const handleClose =()=>{
        setPromise(null)
    }

    const handleConfirm =()=>{
        promise?.resolve(true);
        handleClose();
    }

    const handleCancel =()=>{
        promise?.resolve(false);
        handleClose();
    }

    const ConfirmationModal =()=>(
        <ResponsiveModal open={promise!==null} onOpenChange={handleClose}>
            <Card className='full h-full border-none shadow-none'>
                <CardContent className='pt-8'>
                    <CardHeader className='p-0'>
                        <CardTitle>
                            {title}
                        </CardTitle>
                        <CardDescription>
                            {message}
                        </CardDescription>
                    </CardHeader>
                    <div className='pt-4 w-full flex flex-col lg:flex-row gap-y-2 gap-x-2 items-center justify-end'>
                        <Button onClick={handleCancel} variant='outline' className='w-full lg:w-auto'>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} variant={variant} className='w-full lg:w-auto'>
                            Confirm
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </ResponsiveModal>
    )

    return [ConfirmationModal,confirm];
}
