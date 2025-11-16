DO $$ BEGIN
    CREATE TYPE "public"."invitation_statuses" AS ENUM('pending', 'accepted', 'expired', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."workspace_roles" AS ENUM('owner', 'admin', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_companies" ADD COLUMN IF NOT EXISTS "role" "workspace_roles" DEFAULT 'member' NOT NULL;--> statement-breakpoint

UPDATE "user_companies" uc1
SET "role" = 'owner'
WHERE uc1."id" IN (
    SELECT DISTINCT ON (uc2."company_id") uc2."id"
    FROM "user_companies" uc2
    WHERE uc2."role" = 'member'
    ORDER BY uc2."company_id", uc2."created_at" ASC
)
AND NOT EXISTS (
    SELECT 1
    FROM "user_companies" uc3
    WHERE uc3."company_id" = uc1."company_id"
    AND uc3."role" = 'owner'
);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspace_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"company_id" uuid NOT NULL,
	"invited_by" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"status" "invitation_statuses" DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"accepted_at" timestamp,
	CONSTRAINT "workspace_invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "workspace_invitations" ADD CONSTRAINT "workspace_invitations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_invitations" ADD CONSTRAINT "workspace_invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_invitations_company_id_idx" ON "workspace_invitations"("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_invitations_email_idx" ON "workspace_invitations"("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_invitations_status_idx" ON "workspace_invitations"("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_invitations_token_idx" ON "workspace_invitations"("token");