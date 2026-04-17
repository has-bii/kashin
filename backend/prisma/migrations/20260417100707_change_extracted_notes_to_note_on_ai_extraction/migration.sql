/*
  Warnings:

  - You are about to drop the column `extractedNotes` on the `ai_extractions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ai_extractions" DROP COLUMN "extractedNotes",
ADD COLUMN     "note" TEXT;
