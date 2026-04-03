-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `image` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'IDR',
    `timezone` VARCHAR(64) NOT NULL DEFAULT 'Asia/Jakarta',

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` CHAR(36) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(512) NULL,
    `userId` CHAR(36) NOT NULL,

    INDEX `sessions_userId_idx`(`userId`),
    UNIQUE INDEX `sessions_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` CHAR(36) NOT NULL,
    `accountId` VARCHAR(255) NOT NULL,
    `providerId` VARCHAR(255) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `accessToken` TEXT NULL,
    `refreshToken` TEXT NULL,
    `idToken` TEXT NULL,
    `accessTokenExpiresAt` DATETIME(3) NULL,
    `refreshTokenExpiresAt` DATETIME(3) NULL,
    `scope` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `accounts_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verifications` (
    `id` CHAR(36) NOT NULL,
    `identifier` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `verifications_identifier_idx`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` ENUM('expense', 'income') NOT NULL,
    `icon` VARCHAR(50) NOT NULL,
    `color` VARCHAR(7) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `categories_userId_idx`(`userId`),
    INDEX `categories_userId_type_idx`(`userId`, `type`),
    UNIQUE INDEX `categories_name_userId_key`(`name`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `categoryId` CHAR(36) NULL,
    `recurringTxnId` CHAR(36) NULL,
    `aiExtractionId` CHAR(36) NULL,
    `type` ENUM('expense', 'income') NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'IDR',
    `transactionDate` DATE NOT NULL,
    `description` VARCHAR(500) NULL,
    `notes` TEXT NULL,
    `source` ENUM('manual', 'email', 'recurring') NOT NULL DEFAULT 'manual',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transactions_aiExtractionId_key`(`aiExtractionId`),
    INDEX `transactions_userId_idx`(`userId`),
    INDEX `transactions_categoryId_idx`(`categoryId`),
    INDEX `transactions_recurringTxnId_idx`(`recurringTxnId`),
    INDEX `transactions_userId_transactionDate_idx`(`userId`, `transactionDate`),
    INDEX `transactions_userId_type_idx`(`userId`, `type`),
    INDEX `transactions_userId_categoryId_idx`(`userId`, `categoryId`),
    INDEX `transactions_source_idx`(`source`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_inboxes` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `emailAddress` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `email_inboxes_emailAddress_key`(`emailAddress`),
    INDEX `email_inboxes_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_extractions` (
    `id` CHAR(36) NOT NULL,
    `emailLogId` BIGINT NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `extractedVendor` VARCHAR(255) NULL,
    `extractedAmount` DECIMAL(15, 2) NULL,
    `extractedCurrency` VARCHAR(3) NULL,
    `extractedDate` DATE NULL,
    `suggestedCategoryId` CHAR(36) NULL,
    `extractedType` ENUM('expense', 'income') NULL,
    `extractedNotes` TEXT NULL,
    `confidenceScore` FLOAT NULL,
    `status` ENUM('pending', 'confirmed', 'rejected', 'edited') NOT NULL DEFAULT 'pending',
    `confirmedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ai_extractions_emailLogId_key`(`emailLogId`),
    INDEX `ai_extractions_emailLogId_idx`(`emailLogId`),
    INDEX `ai_extractions_userId_idx`(`userId`),
    INDEX `ai_extractions_suggestedCategoryId_idx`(`suggestedCategoryId`),
    INDEX `ai_extractions_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recurring_transactions` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `categoryId` CHAR(36) NULL,
    `type` ENUM('expense', 'income') NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'IDR',
    `description` VARCHAR(500) NOT NULL,
    `frequency` ENUM('weekly', 'biweekly', 'monthly', 'yearly') NOT NULL,
    `nextDueDate` DATE NOT NULL,
    `lastGeneratedDate` DATE NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `recurring_transactions_userId_idx`(`userId`),
    INDEX `recurring_transactions_categoryId_idx`(`categoryId`),
    INDEX `recurring_transactions_isActive_nextDueDate_idx`(`isActive`, `nextDueDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `inboxId` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `fromAddress` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(500) NULL,
    `rawBody` MEDIUMTEXT NULL,
    `status` ENUM('received', 'processing', 'parsed', 'failed') NOT NULL DEFAULT 'received',
    `errorMessage` TEXT NULL,
    `receivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `email_logs_inboxId_idx`(`inboxId`),
    INDEX `email_logs_userId_idx`(`userId`),
    INDEX `email_logs_status_idx`(`status`),
    INDEX `email_logs_receivedAt_idx`(`receivedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `transactionId` CHAR(36) NULL,
    `emailLogId` BIGINT NULL,
    `fileUrl` VARCHAR(1024) NOT NULL,
    `fileName` VARCHAR(255) NOT NULL,
    `fileType` VARCHAR(100) NULL,
    `fileSize` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `attachments_transactionId_idx`(`transactionId`),
    INDEX `attachments_emailLogId_idx`(`emailLogId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
