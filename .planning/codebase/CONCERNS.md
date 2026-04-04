# Codebase Concerns

**Analysis Date:** 2026-04-04

## Tech Debt

**Unused TiDB Adapters:**
- Issue: Backend still imports TiDB Cloud dependencies despite migrating to PostgreSQL
- Files: `backend/package.json` includes `@tidbcloud/prisma-adapter@^6.17.0` and `@tidbcloud/serverless@^0.3.0`
- Impact: Bloats dependencies and creates confusion about actual database provider. No code references these imports.
- Fix approach: Run `bun remove @tidbcloud/prisma-adapter @tidbcloud/serverless` to clean up. Verify no code uses these packages first.

**OTP Implementation Not Production-Ready:**
- Issue: Email OTP verification in Better Auth is stubbed with console logging
- Files: `backend/src/lib/auth.ts` line 57: `console.log('[OTP] ${email}: ${otp} (${type})')`
- Impact: OTPs are printed to console instead of being sent via email. Users cannot verify emails or change emails in production.
- Fix approach: Implement actual email transport (e.g., SendGrid, Resend, AWS SES). Create `backend/src/lib/email.ts` service and replace console.log with real email sending.

**Category Uniqueness Check Race Condition:**
- Issue: Name uniqueness is checked before create/update, but not atomically with database insert
- Files: `backend/src/modules/category/service.ts` lines 31-38 (create) and 54-64 (update)
- Impact: Two concurrent requests with same name could both pass the check and create duplicates. Prisma schema has `@@unique([name, userId])` constraint as fallback, but service doesn't handle the resulting error.
- Fix approach: Wrap create/update in try-catch to handle `P2002` (unique constraint violation) from Prisma. Either retry with backoff or return meaningful error.

**Elysia Using `latest` Version:**
- Issue: `backend/package.json` pins Elysia to `"latest"` instead of specific version
- Files: `backend/package.json` line 14
- Impact: Automatic upgrades on `bun install` can introduce breaking changes. Makes CI/CD non-deterministic.
- Fix approach: Run `bun list | grep elysia` to get current version, pin to exact version (e.g., `^1.0.0`).

## Known Bugs

**Category Update Logic Flaw:**
- Issue: When updating category name, the uniqueness check doesn't exclude the current record
- Files: `backend/src/modules/category/service.ts` lines 54-64
- Trigger: User tries to update category name to same name (idempotent operation)
- Current behavior: Throws "Category with the same name already exists" conflict error
- Fix approach: Modify uniqueness check to exclude current category ID: `where: { name_userId: { name: input.name, userId }, NOT: { id } }`

## Security Considerations

**API Timeout Risk:**
- Risk: Frontend Axios client has 10-second timeout, but backend has no request timeout or slow-query protection
- Files: `frontend/src/lib/api.ts` line 5: `timeout: 10000`
- Current mitigation: CORS configured to only allow `FRONTEND_URL`
- Recommendations: Add request timeout middleware to backend (e.g., 30-second max). Add database query timeouts to Prisma. Monitor slow queries.

**Email OTP Exposure:**
- Risk: OTPs are logged to stdout and potentially stored in application logs
- Files: `backend/src/lib/auth.ts` line 57
- Current mitigation: None
- Recommendations: Once email sending is implemented, remove console logging. Use secure logging that excludes sensitive data. Set rate limiting to max 5 attempts per email per hour.

**Missing CSRF Protection:**
- Risk: Elysia doesn't have CSRF token validation enabled
- Files: `backend/src/index.ts` CORS config, `backend/src/lib/auth.ts` cookie strategy
- Current mitigation: Cookies set with `storeStateStrategy: "cookie"` but no CSRF token exchange
- Recommendations: Enable Better Auth's built-in CSRF protection. Verify token in state change requests (POST/PUT/DELETE).

## Performance Bottlenecks

**N+1 Query Potential in Category Module:**
- Problem: CategoryService.getAll doesn't select specific fields, retrieves full category objects
- Files: `backend/src/modules/category/service.ts` line 11-17
- Cause: No field selection or pagination. Could scale poorly if users have hundreds of categories.
- Improvement path: Add optional `skip`/`take` pagination parameters. Use `select: { id: true, name: true, ... }` to avoid unnecessary column data.

**Frontend API Client No Retry Logic:**
- Problem: TanStack Query configured with `retry: 1` but Axios client has no exponential backoff
- Files: `frontend/src/lib/api.ts`, `frontend/src/providers/index.tsx` line 21
- Cause: Hard timeout after 10 seconds. Flaky networks get fast failures instead of graceful degradation.
- Improvement path: Add Axios retry interceptor with exponential backoff (jittered). Increase timeout to 30 seconds for slow networks.

## Fragile Areas

**Better Auth Cookie Configuration:**
- Files: `backend/src/lib/auth.ts` lines 28-41
- Why fragile: Multiple cookie settings (storeStateStrategy, storeAccountCookie, cookieCache, cookiePrefix) need to be kept in sync with frontend's auth-client initialization. No validation that they match.
- Safe modification: Update CLAUDE.md with full Better Auth config pattern. Add comment linking frontend auth-client setup.
- Test coverage: No tests for auth flow. Verify login/session/logout flows manually before deploying.

**Prisma Schema with Mixed ID Strategies:**
- Files: `backend/prisma/schema.prisma` lines 66-313
- Why fragile: UUID v7 for user-facing tables (Category, Transaction) but BigInt auto-increment for internal tables (EmailLog, Attachment). Relationships between UUID and BigInt columns exist (e.g., `AiExtraction.emailLogId` is BigInt).
- Safe modification: Document which tables use which ID strategy. Keep internal tables (EmailLog, Attachment) as BigInt. Keep user-facing tables as UUID v7.
- Test coverage: No migration tests. When migrating schema, verify foreign key constraints are valid.

## Scaling Limits

**Single Prisma Instance:**
- Current capacity: One PrismaClient instance per backend process handles all DB connections
- Limit: Max ~20-30 concurrent connections before exhaustion (depends on PostgreSQL max_connections)
- Scaling path: Add connection pooling with PgBouncer or use Prisma's `datasourceExtensions` for connection limits. Monitor connection count with `SELECT count(*) FROM pg_stat_activity;`

**No Background Job Queue:**
- Current capacity: All email processing and AI extraction happens synchronously in request handlers
- Limit: Long-running email parsing blocks API responses. One slow email processing blocks user interactions.
- Scaling path: Implement job queue (e.g., Bull, RabbitMQ, or AWS SQS). Move EmailLog processing to async workers.

## Dependencies at Risk

**TypeScript v6 Mismatch in Backend:**
- Risk: Frontend uses TypeScript v5, backend uses v6. Incompatible config differences.
- Files: `backend/package.json` line 24: `typescript@^6.0.2`, `frontend/package.json` line 53: `typescript@^5`
- Impact: Type definitions may diverge. Shared types could cause errors.
- Migration plan: Standardize on TypeScript v5 across both packages until v6 is stable. Update tsconfig to match.

**Bun-specific Types Leaking:**
- Risk: Backend tsconfig includes `bun-types` globally, which makes Bun APIs available in all files
- Files: `backend/tsconfig.json` line 35-37
- Impact: Code could accidentally use Bun-only APIs and fail at runtime on Node.js
- Migration plan: Remove from global types. Use module-level comments `// @ts-types bun-types` only where needed.

## Missing Critical Features

**No Email Sender Implementation:**
- Problem: Email verification and OTP sending are stubbed with console.log
- Blocks: Users cannot verify emails, change emails, or use email-based password reset
- Workaround: None in production. Development only.
- Priority: HIGH - Blocks user onboarding flow

**No Input Rate Limiting:**
- Problem: Better Auth has global rate limit (10 requests per 15 min) but no per-user or per-IP rate limiting on custom endpoints
- Blocks: Brute force protection on password change, OTP verification, category creation
- Workaround: None
- Priority: HIGH - Security risk

**No Audit Logging:**
- Problem: No logs of sensitive actions (email changes, password resets, category deletes)
- Blocks: Compliance, debugging user issues, security investigation
- Workaround: None
- Priority: MEDIUM - Needed for compliance

## Test Coverage Gaps

**No Backend Tests:**
- What's not tested: Category CRUD, auth flows (login, logout, password reset), error handling
- Files: `backend/src/modules/`, `backend/src/lib/auth.ts`
- Risk: Regression in core features goes undetected. Race conditions in category uniqueness not caught.
- Priority: HIGH - Core business logic untested

**No Frontend Integration Tests:**
- What's not tested: Form validation, API error handling, auth state transitions
- Files: `frontend/src/features/`, `frontend/src/app/`
- Risk: UI bugs not caught until manual testing. Breaking changes in API client responses
- Priority: MEDIUM - Harder to catch before release

**No E2E Tests:**
- What's not tested: Full user flows (sign up → verify email → create category → transaction)
- Files: All
- Risk: Integration errors between frontend and backend only caught in production
- Priority: MEDIUM - Most valuable but highest cost

---

*Concerns audit: 2026-04-04*
