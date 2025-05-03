import { TaskStatusEnum } from "@/types/tasks"
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"


export const useTaskFilters =()=>{
    return useQueryStates({
        projectId:parseAsString,
        status:parseAsStringEnum(Object.values(TaskStatusEnum)),
        assigneeId:parseAsString,
        search:parseAsString,
        dueDate:parseAsString
    })
}