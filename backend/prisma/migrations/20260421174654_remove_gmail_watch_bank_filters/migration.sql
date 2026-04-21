/*
  Warnings:

  - You are about to drop the `gmail_watch_bank_filters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "gmail_watch_bank_filters" DROP CONSTRAINT "gmail_watch_bank_filters_bankAccountId_fkey";

-- DropForeignKey
ALTER TABLE "gmail_watch_bank_filters" DROP CONSTRAINT "gmail_watch_bank_filters_watchConfigId_fkey";

-- DropTable
DROP TABLE "gmail_watch_bank_filters";
