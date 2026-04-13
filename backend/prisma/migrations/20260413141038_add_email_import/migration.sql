/*
  Warnings:

  - A unique constraint covering the columns `[gmailMessageId]` on the table `email_logs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EmailImportStatus" AS ENUM ('gathering', 'processing', 'completed', 'failed');

-- AlterTable
ALTER TABLE "email_logs" ADD COLUMN     "gmailMessageId" VARCHAR(255);

-- CreateTable
CREATE TABLE "email_imports" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "EmailImportStatus" NOT NULL DEFAULT 'gathering',
    "afterDate" DATE NOT NULL,
    "beforeDate" DATE NOT NULL,
    "totalEmails" INTEGER NOT NULL DEFAULT 0,
    "skippedEmails" INTEGER NOT NULL DEFAULT 0,
    "processedEmails" INTEGER NOT NULL DEFAULT 0,
    "failedEmails" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "completedAt" TIMESTAMPTZ,

    CONSTRAINT "email_imports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_imports_userId_idx" ON "email_imports"("userId");

-- CreateIndex
CREATE INDEX "email_imports_userId_status_idx" ON "email_imports"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "email_logs_gmailMessageId_key" ON "email_logs"("gmailMessageId");

-- AddForeignKey
ALTER TABLE "email_imports" ADD CONSTRAINT "email_imports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
