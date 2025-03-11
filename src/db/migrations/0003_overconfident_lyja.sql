CREATE TABLE "workspace_members" (
	"workspaceId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "workspace_members_workspaceId_userId_pk" PRIMARY KEY("workspaceId","userId")
);
--> statement-breakpoint
ALTER TABLE "workspace" RENAME COLUMN "iamgeUrl" TO "imageUrl";--> statement-breakpoint
ALTER TABLE "workspace" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "workspace" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;