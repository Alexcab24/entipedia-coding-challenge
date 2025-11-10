
ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "reset_password_token" varchar(255),
ADD COLUMN IF NOT EXISTS "reset_password_token_expires_at" timestamp;

