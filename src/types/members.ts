export const MemberRole = {
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
  } as const;
  
  export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole];

  export type Member = {
    id:string,
    userId:string,
    workspaceId:string,
    role:MemberRole
    name:string,
    email:string
  }
  