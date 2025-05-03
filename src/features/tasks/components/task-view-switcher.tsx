"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import React from "react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useGetWorkspaceId } from "@/features/workspace/hooks/use-get-workspaceId";
import { useGetTasks } from "../hooks/use-get-tasks";
import { useQueryState } from "nuqs";
import DataFilters from "./data-filters";
import { useTaskFilters } from "../hooks/use-task-filters";
import { DataTable } from "./data-table";
import { columns } from "./colums";

type Props = {};

export default function TaskViewSwitcher({}: Props) {
  const [{ status, assigneeId, projectId, dueDate, search }] = useTaskFilters();

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const workspaceId = useGetWorkspaceId();
  const { data: tasks, isPending: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId,
    dueDate,
    search,
  });

  const { open } = useCreateTaskModal();

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg "
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-y-2 ">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 wi-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 wi-full lg:w-auto" value="kanban">
              kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 wi-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div>
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
             <DataTable columns={columns} data={tasks ?? []}/>
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}
