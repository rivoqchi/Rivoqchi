-- AlterTable
ALTER TABLE "personal_info" ADD COLUMN "about_details" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "personal_info" ADD COLUMN "highlights" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "personal_info" ADD COLUMN "interests" JSONB NOT NULL DEFAULT '[]';
