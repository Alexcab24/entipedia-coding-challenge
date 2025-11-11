ALTER TABLE "clients" ADD COLUMN "value" numeric(15, 2);--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "date_from" date;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "date_to" date;