-- Drop foreign key from ai_extractions → email_import_batches
ALTER TABLE "ai_extractions" DROP CONSTRAINT IF EXISTS "ai_extractions_emailImportBatchId_fkey";

-- Drop the column from ai_extractions
ALTER TABLE "ai_extractions" DROP COLUMN IF EXISTS "emailImportBatchId";

-- Drop the email_import_batches table
DROP TABLE IF EXISTS "email_import_batches";

-- Drop the enum type
DROP TYPE IF EXISTS "EmailImportBatchStatus";
