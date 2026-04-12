-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('expense', 'income');

-- CreateEnum
CREATE TYPE "TransactionSource" AS ENUM ('manual', 'email', 'recurring');

-- CreateEnum
CREATE TYPE "EmailLogStatus" AS ENUM ('received', 'processing', 'parsed', 'failed');

-- CreateEnum
CREATE TYPE "AiExtractionStatus" AS ENUM ('pending', 'confirmed', 'rejected', 'edited');

-- CreateEnum
CREATE TYPE "RecurringFrequency" AS ENUM ('weekly', 'biweekly', 'monthly', 'yearly');

-- CreateEnum
CREATE TYPE "BudgetPeriod" AS ENUM ('daily', 'weekly', 'monthly');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "userId" UUID NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "accountId" VARCHAR(255) NOT NULL,
    "providerId" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" UUID NOT NULL,
    "identifier" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "icon" VARCHAR(50) NOT NULL,
    "color" CHAR(7) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "categoryId" UUID,
    "recurringTxnId" UUID,
    "aiExtractionId" UUID,
    "bankAccountId" UUID,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'IDR',
    "transactionDate" TIMESTAMPTZ NOT NULL,
    "description" VARCHAR(255),
    "notes" TEXT,
    "source" "TransactionSource" NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_inboxes" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "emailAddress" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "email_inboxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_extractions" (
    "id" UUID NOT NULL,
    "emailLogId" BIGINT NOT NULL,
    "userId" UUID NOT NULL,
    "extractedVendor" VARCHAR(255),
    "extractedAmount" DECIMAL(15,2),
    "extractedCurrency" CHAR(3),
    "extractedDate" DATE,
    "suggestedCategoryId" UUID,
    "extractedType" "TransactionType",
    "extractedNotes" TEXT,
    "confidenceScore" REAL,
    "status" "AiExtractionStatus" NOT NULL DEFAULT 'pending',
    "confirmedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ai_extractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurring_transactions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "categoryId" UUID,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'IDR',
    "description" VARCHAR(255) NOT NULL,
    "frequency" "RecurringFrequency" NOT NULL,
    "nextDueDate" TIMESTAMPTZ NOT NULL,
    "lastGeneratedDate" TIMESTAMPTZ,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "recurring_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgets" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "period" "BudgetPeriod" NOT NULL,
    "alertThreshold" REAL NOT NULL DEFAULT 0.8,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "imageUrl" TEXT NOT NULL,
    "isSupportEmail" BOOLEAN NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "bankId" UUID NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" BIGSERIAL NOT NULL,
    "inboxId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "fromAddress" VARCHAR(255) NOT NULL,
    "subject" TEXT,
    "rawBody" TEXT,
    "status" "EmailLogStatus" NOT NULL DEFAULT 'received',
    "errorMessage" TEXT,
    "receivedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" BIGSERIAL NOT NULL,
    "transactionId" UUID,
    "emailLogId" BIGINT,
    "fileUrl" TEXT NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileType" VARCHAR(100),
    "fileSize" BIGINT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE INDEX "verifications_identifier_idx" ON "verifications"("identifier");

-- CreateIndex
CREATE INDEX "categories_userId_idx" ON "categories"("userId");

-- CreateIndex
CREATE INDEX "categories_userId_type_idx" ON "categories"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_userId_key" ON "categories"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_aiExtractionId_key" ON "transactions"("aiExtractionId");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");

-- CreateIndex
CREATE INDEX "transactions_categoryId_idx" ON "transactions"("categoryId");

-- CreateIndex
CREATE INDEX "transactions_recurringTxnId_idx" ON "transactions"("recurringTxnId");

-- CreateIndex
CREATE INDEX "transactions_userId_transactionDate_idx" ON "transactions"("userId", "transactionDate");

-- CreateIndex
CREATE INDEX "transactions_userId_type_idx" ON "transactions"("userId", "type");

-- CreateIndex
CREATE INDEX "transactions_userId_categoryId_idx" ON "transactions"("userId", "categoryId");

-- CreateIndex
CREATE INDEX "transactions_userId_source_idx" ON "transactions"("userId", "source");

-- CreateIndex
CREATE INDEX "transactions_bankAccountId_idx" ON "transactions"("bankAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "email_inboxes_emailAddress_key" ON "email_inboxes"("emailAddress");

-- CreateIndex
CREATE INDEX "email_inboxes_userId_idx" ON "email_inboxes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_extractions_emailLogId_key" ON "ai_extractions"("emailLogId");

-- CreateIndex
CREATE INDEX "ai_extractions_userId_idx" ON "ai_extractions"("userId");

-- CreateIndex
CREATE INDEX "ai_extractions_suggestedCategoryId_idx" ON "ai_extractions"("suggestedCategoryId");

-- CreateIndex
CREATE INDEX "ai_extractions_userId_status_idx" ON "ai_extractions"("userId", "status");

-- CreateIndex
CREATE INDEX "recurring_transactions_userId_idx" ON "recurring_transactions"("userId");

-- CreateIndex
CREATE INDEX "recurring_transactions_categoryId_idx" ON "recurring_transactions"("categoryId");

-- CreateIndex
CREATE INDEX "recurring_transactions_isActive_nextDueDate_idx" ON "recurring_transactions"("isActive", "nextDueDate");

-- CreateIndex
CREATE INDEX "budgets_userId_idx" ON "budgets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "budgets_userId_categoryId_period_key" ON "budgets"("userId", "categoryId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_userId_bankId_key" ON "bank_accounts"("userId", "bankId");

-- CreateIndex
CREATE INDEX "email_logs_inboxId_idx" ON "email_logs"("inboxId");

-- CreateIndex
CREATE INDEX "email_logs_userId_idx" ON "email_logs"("userId");

-- CreateIndex
CREATE INDEX "email_logs_userId_status_idx" ON "email_logs"("userId", "status");

-- CreateIndex
CREATE INDEX "email_logs_receivedAt_idx" ON "email_logs"("receivedAt");

-- CreateIndex
CREATE INDEX "attachments_transactionId_idx" ON "attachments"("transactionId");

-- CreateIndex
CREATE INDEX "attachments_emailLogId_idx" ON "attachments"("emailLogId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurringTxnId_fkey" FOREIGN KEY ("recurringTxnId") REFERENCES "recurring_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_aiExtractionId_fkey" FOREIGN KEY ("aiExtractionId") REFERENCES "ai_extractions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_inboxes" ADD CONSTRAINT "email_inboxes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_extractions" ADD CONSTRAINT "ai_extractions_emailLogId_fkey" FOREIGN KEY ("emailLogId") REFERENCES "email_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_extractions" ADD CONSTRAINT "ai_extractions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_extractions" ADD CONSTRAINT "ai_extractions_suggestedCategoryId_fkey" FOREIGN KEY ("suggestedCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "email_inboxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_emailLogId_fkey" FOREIGN KEY ("emailLogId") REFERENCES "email_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
