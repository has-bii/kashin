-- AlterTable: drop filterEmailsByBank from user_settings
ALTER TABLE "user_settings" DROP COLUMN "filterEmailsByBank";

-- CreateTable: gmail_watch_configs
CREATE TABLE "gmail_watch_configs" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "gmailAddress" VARCHAR(255) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "historyId" VARCHAR(50),
    "expiresAt" TIMESTAMPTZ,
    "qstashMessageId" TEXT,
    "subjectKeywords" VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[],
    "gmailLabels" VARCHAR(100)[] DEFAULT ARRAY[]::VARCHAR(100)[],
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "gmail_watch_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: gmail_watch_bank_filters
CREATE TABLE "gmail_watch_bank_filters" (
    "id" UUID NOT NULL,
    "watchConfigId" UUID NOT NULL,
    "bankAccountId" UUID NOT NULL,

    CONSTRAINT "gmail_watch_bank_filters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gmail_watch_configs_userId_key" ON "gmail_watch_configs"("userId");
CREATE INDEX "gmail_watch_configs_userId_idx" ON "gmail_watch_configs"("userId");
CREATE INDEX "gmail_watch_configs_gmailAddress_idx" ON "gmail_watch_configs"("gmailAddress");

CREATE UNIQUE INDEX "gmail_watch_bank_filters_watchConfigId_bankAccountId_key" ON "gmail_watch_bank_filters"("watchConfigId", "bankAccountId");

-- AddForeignKey
ALTER TABLE "gmail_watch_configs" ADD CONSTRAINT "gmail_watch_configs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "gmail_watch_bank_filters" ADD CONSTRAINT "gmail_watch_bank_filters_watchConfigId_fkey" FOREIGN KEY ("watchConfigId") REFERENCES "gmail_watch_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "gmail_watch_bank_filters" ADD CONSTRAINT "gmail_watch_bank_filters_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
