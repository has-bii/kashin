/*
  Warnings:

  - You are about to drop the `user_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_settings" DROP CONSTRAINT "user_settings_userId_fkey";

-- DropIndex
DROP INDEX "categories_userId_idx";

-- DropIndex
DROP INDEX "gmail_watch_configs_gmailAddress_idx";

-- DropIndex
DROP INDEX "gmail_watch_configs_userId_idx";

-- DropIndex
DROP INDEX "recurring_transactions_isActive_nextDueDate_idx";

-- DropIndex
DROP INDEX "transactions_userId_idx";

-- DropIndex
DROP INDEX "transactions_userId_source_idx";

-- DropTable
DROP TABLE "user_settings";
