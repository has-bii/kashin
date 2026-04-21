/*
  Warnings:

  - Added the required column `emailSnippet` to the `ai_extractions` table without a default value. This is not possible if the table is not empty.
  - Made the column `emailFrom` on table `ai_extractions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailSubject` on table `ai_extractions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ai_extractions"
ADD COLUMN "emailSnippet" VARCHAR(500) NOT NULL DEFAULT '',
ALTER COLUMN "emailFrom" SET DEFAULT '',
ALTER COLUMN "emailSubject" SET DEFAULT '';

UPDATE "ai_extractions" SET "emailFrom" = '' WHERE "emailFrom" IS NULL;
UPDATE "ai_extractions" SET "emailSubject" = '' WHERE "emailSubject" IS NULL;

ALTER TABLE "ai_extractions"
ALTER COLUMN "emailFrom" SET NOT NULL,
ALTER COLUMN "emailSubject" SET NOT NULL,
ALTER COLUMN "emailSnippet" DROP DEFAULT,
ALTER COLUMN "emailFrom" DROP DEFAULT,
ALTER COLUMN "emailSubject" DROP DEFAULT;
