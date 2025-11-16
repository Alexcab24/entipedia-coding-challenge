ALTER TABLE "projects" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "key" varchar(255);--> statement-breakpoint
UPDATE "files" SET "key" = url WHERE "key" IS NULL;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "key" SET NOT NULL;