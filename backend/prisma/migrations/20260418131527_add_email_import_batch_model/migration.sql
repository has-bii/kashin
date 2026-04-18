-- CreateEnum
CREATE TYPE "EmailImportBatchStatus" AS ENUM ('running', 'completed');

-- AlterTable
ALTER TABLE "ai_extractions" ADD COLUMN     "emailImportBatchId" UUID;

-- CreateTable
CREATE TABLE "email_import_batches" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "total" INTEGER NOT NULL,
    "status" "EmailImportBatchStatus" NOT NULL DEFAULT 'running',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMPTZ,

    CONSTRAINT "email_import_batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_import_batches_userId_createdAt_idx" ON "email_import_batches"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ai_extractions_emailImportBatchId_idx" ON "ai_extractions"("emailImportBatchId");

-- AddForeignKey
ALTER TABLE "ai_extractions" ADD CONSTRAINT "ai_extractions_emailImportBatchId_fkey" FOREIGN KEY ("emailImportBatchId") REFERENCES "email_import_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_import_batches" ADD CONSTRAINT "email_import_batches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
