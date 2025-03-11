export const MemberRole = {
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
  } as const;
  
  export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole];
  