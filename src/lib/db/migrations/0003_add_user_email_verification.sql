-- Add email verification fields to users table
ALTER TABLE "users"
    ADD COLUMN "email_verified_at" timestamp,
    ADD COLUMN "verification_token" varchar(255),
    ADD COLUMN "verification_token_expires_at" timestamp;


