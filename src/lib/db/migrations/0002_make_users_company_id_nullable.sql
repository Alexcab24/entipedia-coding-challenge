-- Make users.company_id nullable to allow users without a company
ALTER TABLE "users"
ALTER COLUMN "company_id" DROP NOT NULL;


