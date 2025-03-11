CREATE TYPE "public"."role" AS ENUM('ADMIN', 'MEMBER');--> statement-breakpoint
ALTER TABLE "workspace_members" ADD COLUMN "role" "role" DEFAULT 'MEMBER' NOT NULL;