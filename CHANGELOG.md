# Changelog

## [Unreleased]

### 2026-04-04
- fix(auth): change Better Auth adapter provider from `mysql` to `postgresql`
- refactor(schema): use PostgreSQL-native types — `inet` for IP, `char` for fixed-width codes, `real` for confidence scores, `bigint` for file sizes
- refactor(schema): optimize indexes — remove redundant `emailLogId` index, add composite `(userId, status)` indexes, make `source` index composite
- refactor(schema): add missing `updatedAt` to `AiExtraction` and `Attachment`
- docs: update CLAUDE.md files to reflect PostgreSQL migration (remove TiDB/MySQL references)

### 2026-04-03
- chore: compact CLAUDE.md files and create development skills to reduce token usage
