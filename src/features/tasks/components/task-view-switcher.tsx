import { DottedSeparator } from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {  PlusIcon } from 'lucide-react'
import React from 'react'

type Props = {

}

export default function TaskViewSwitcher({}: Props) {
  return (
    <Tabs className='flex-1 w-full border rounded-lg '  >
        <div className="h-full flex flex-col overflow-auto p-4">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-y-2 ">
                <TabsList className='w-full lg:w-auto' >
                    <TabsTrigger className='h-8 wi-full lg:w-auto'  value='table'>
                        Table
                    </TabsTrigger>
                    <TabsTrigger className='h-8 wi-full lg:w-auto'  value='kanban'>
                        kanban
                    </TabsTrigger>
                    <TabsTrigger className='h-8 wi-full lg:w-auto'  value='calendar'>
                       Calendar
                    </TabsTrigger>
                </TabsList>
                <Button size='sm' className='w-full lg:w-auto'>
                    <PlusIcon className='size-4 mr-2'/>
                    New 
                </Button>
            </div>
            <DottedSeparator className='my-4'/>
            {/*Add Filters*/}
            Data Filters
            <DottedSeparator className='my-4'/>
            <>
            <TabsContent value='table' className='mt-0'>
                Data Table
            </TabsContent>
            <TabsContent value='kanban' className='mt-0'>
                Data Kanban
            </TabsContent>
            <TabsContent value='calendar' className='mt-0'>
                Data Calendar
            </TabsContent>
            </>
        </div>
    </Tabs>
  )
}