'use client';

import { Task } from '@/types/tasks';
import {ColumnDef} from '@tanstack/react-table';

export const columns: ColumnDef<Task>[]=[

{
    accessorKey:"name",
    header:"Task Name"
}

];