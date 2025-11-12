DO $$ BEGIN
    CREATE TYPE "public"."project_priorities" AS ENUM('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
ALTER TABLE "projects" ADD COLUMN "priority" "project_priorities" DEFAULT 'medium' NOT NULL;