export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export enum TaskStatusEnum {
    BACKLOG = "BACKLOG",
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    IN_REVIEW = "IN_REVIEW",
    DONE = "DONE"  
}

export type Task = {
    id: string,
    name: string,
    status: TaskStatus,
    dueDate: string,
    workspaceId:string,
    createdAt:string,
    project:{
        id:string,
        name:string 
    } | null ,
    assignee:{
        id:string,
        name:string | null
        email:string 
    } | null

}