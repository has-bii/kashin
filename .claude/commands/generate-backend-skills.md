# Generate Backend Skills

You are generating implementation pattern docs (skills) for the backend of this project. These skills tell AI coding agents exactly HOW to implement things — not what exists, but how to build new things following the project's patterns.

Skills go in `.claude/skills/backend/`.

---

## STEP 0: Read Project Context

Before anything, read these files if they exist:

- `.claude/docs/tech-stack.md` — to know the backend framework, ORM, runtime
- `.claude/docs/project-structure.md` — to know where files go
- `.claude/docs/conventions.md` — to know naming rules
- `.claude/docs/dependencies.md` — to know which libraries to use

If these don't exist, tell the user to run `/generate-project-docs` first, then stop.

Store the backend framework as `BACKEND_FRAMEWORK` (express / nestjs / elysia / nextjs-api).

---

## STEP 1: Detect or Decide Patterns

Check if the project has existing backend source code:

- Look for source files in the backend source directory (e.g., `src/`, `server/`, `app/api/`)
- Check if there are at least 2-3 existing endpoints/controllers/routes

### If existing code found:

For each skill scope below, scan 2-3 existing examples to extract the pattern. Read the MINIMUM files needed — just enough to identify the pattern.

After scanning, present findings per scope:

```
Here's what I found for [scope]:

[compact pattern description]
[one short code snippet showing the pattern]

Is this the pattern you want to follow? Or should I adjust?
```

Wait for confirmation before generating each skill.

### If new project (no existing code):

Tell the user:

```
This looks like a new project. I'll generate default patterns for [BACKEND_FRAMEWORK].
These are opinionated starter patterns — you can adjust them after generation.

Want me to proceed with defaults, or do you want to decide each pattern interactively?
```

If they want defaults → use the fallback patterns defined in this command.
If they want interactive → ask per scope what they prefer.

---

## STEP 2: Generate Skills

Generate one `.md` file per scope in `.claude/skills/backend/`. Each skill follows this format:

```markdown
# Skill: [Name]

## When to Use

[One line — when should the agent read this skill]

## File Locations

[Where relevant files go — paths with {placeholders}]

## Pattern

[Step-by-step recipe — what to do, in order]

## Template

[Code template with {placeholders} — copy-paste ready]

## Example

[One real/realistic example from this project]

## Rules

- [Hard rules — things to always/never do]
```

Keep each skill under 80 lines. The agent should be able to read it in <500 tokens.

---

## SKILL SCOPES

Generate these skills. Adapt templates and fallbacks based on `BACKEND_FRAMEWORK`.

---

### 1. endpoint.md — Creating New Endpoints

**What to scan:** Look at 2-3 existing route/controller files. Identify: file location, naming, how routes are defined, how request params/body/query are accessed, how responses are sent.

**Fallback patterns by framework:**

#### NestJS

````markdown
# Skill: Endpoint

## When to Use

When creating a new API endpoint or adding routes to an existing module.

## File Locations

- Controller: `src/modules/{module}/{module}.controller.ts`
- Service: `src/modules/{module}/{module}.service.ts`
- Module: `src/modules/{module}/{module}.module.ts`
- DTOs: `src/modules/{module}/dto/`

## Pattern

1. Create or open the module folder in `src/modules/{module}/`
2. Define DTOs in `dto/` with class-validator decorators (or zod schemas — check dependencies.md)
3. Create service with business logic
4. Create controller with route decorators
5. Register in module, import module in `app.module.ts`

## Template

```typescript
// {module}.controller.ts
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { {Module}Service } from './{module}.service';
import { Create{Module}Dto } from './dto/create-{module}.dto';

@Controller('{module}')
export class {Module}Controller {
  constructor(private readonly {module}Service: {Module}Service) {}

  @Post()
  create(@Body() dto: Create{Module}Dto) {
    return this.{module}Service.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.{module}Service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.{module}Service.findOne(id);
  }
}
```
````

## Rules

- One controller per module
- Business logic goes in service, NOT controller
- Always validate input with DTOs
- Use the response format defined in response.md

````

#### Express
```markdown
# Skill: Endpoint

## When to Use
When creating a new API endpoint.

## File Locations
- Route: `src/routes/{resource}.route.ts`
- Controller: `src/controllers/{resource}.controller.ts`
- Service: `src/services/{resource}.service.ts` (if using service layer)
- Validation: `src/validators/{resource}.validator.ts` (or `src/schemas/{resource}.schema.ts`)

## Pattern
1. Create validation schema in `src/validators/`
2. Create controller function in `src/controllers/`
3. Create route file in `src/routes/`
4. Register route in `src/routes/index.ts` (or `src/app.ts`)

## Template
```typescript
// src/routes/{resource}.route.ts
import { Router } from 'express';
import { {resource}Controller } from '../controllers/{resource}.controller';
import { validate } from '../middleware/validate';
import { create{Resource}Schema } from '../validators/{resource}.validator';

const router = Router();

router.post('/', validate(create{Resource}Schema), {resource}Controller.create);
router.get('/', {resource}Controller.findAll);
router.get('/:id', {resource}Controller.findOne);
router.put('/:id', validate(update{Resource}Schema), {resource}Controller.update);
router.delete('/:id', {resource}Controller.remove);

export default router;

// src/controllers/{resource}.controller.ts
import { Request, Response, NextFunction } from 'express';

export const {resource}Controller = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // business logic or call service
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, ...filters } = req.query;
      // business logic
      res.json({ data: results, meta: { page, limit, total } });
    } catch (error) {
      next(error);
    }
  },
};
````

## Rules

- Route files only define routes — no business logic
- Controller handles request/response — calls service for logic
- Always wrap async handlers in try/catch and call next(error)
- Use the response format defined in response.md

````

#### Elysia
```markdown
# Skill: Endpoint

## When to Use
When creating a new API endpoint.

## File Locations
- Route module: `src/routes/{resource}.ts`
- Service: `src/services/{resource}.service.ts` (if using service layer)
- Schema: `src/schemas/{resource}.schema.ts`

## Pattern
1. Create schema with `t` (TypeBox) in `src/schemas/`
2. Create route module as Elysia plugin in `src/routes/`
3. Register plugin in main Elysia app (`src/index.ts`)

## Template
```typescript
// src/routes/{resource}.ts
import { Elysia, t } from 'elysia';
import { {resource}Schema, create{Resource}Schema } from '../schemas/{resource}.schema';

export const {resource}Routes = new Elysia({ prefix: '/{resource}' })
  .post('/', async ({ body }) => {
    // business logic
    return { data: result };
  }, {
    body: create{Resource}Schema,
    response: {resource}Schema,
  })
  .get('/', async ({ query }) => {
    // business logic
    return { data: results };
  }, {
    query: t.Object({
      page: t.Optional(t.Number()),
      limit: t.Optional(t.Number()),
    }),
  })
  .get('/:id', async ({ params: { id } }) => {
    // business logic
    return { data: result };
  }, {
    params: t.Object({ id: t.String() }),
  });

// src/index.ts
import { {resource}Routes } from './routes/{resource}';
app.use({resource}Routes);
````

## Rules

- Each route module is an Elysia plugin with its own prefix
- Use TypeBox `t` for validation — it's built into Elysia
- Keep route handlers thin — extract to services for complex logic
- Use the response format defined in response.md

````

#### Next.js API Routes
```markdown
# Skill: Endpoint

## When to Use
When creating a new API route.

## File Locations
- Route handler: `app/api/{resource}/route.ts`
- Route with param: `app/api/{resource}/[id]/route.ts`
- Validation: `src/schemas/{resource}.schema.ts` (or colocated)

## Pattern
1. Create validation schema
2. Create route handler file with exported HTTP method functions
3. Follow Next.js App Router conventions (GET, POST, PUT, DELETE exports)

## Template
```typescript
// app/api/{resource}/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { create{Resource}Schema } from '@/schemas/{resource}.schema';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = create{Resource}Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // business logic
  return NextResponse.json({ data: result }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') ?? '1';

  // business logic
  return NextResponse.json({ data: results, meta: { page } });
}

// app/api/{resource}/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // business logic
  return NextResponse.json({ data: result });
}
````

## Rules

- One route.ts per resource path
- Export named functions matching HTTP methods (GET, POST, PUT, DELETE)
- Validate with zod, return 400 on failure
- Use the response format defined in response.md

````

---

### 2. middleware.md — Adding Middleware

**What to scan:** Look for existing middleware files. How are they structured? Where are they registered?

**Fallback patterns by framework:**

#### NestJS
```markdown
# Skill: Middleware

## When to Use
When adding cross-cutting concerns: auth guards, logging, rate limiting, request transformation.

## File Locations
- Guards: `src/common/guards/{name}.guard.ts`
- Interceptors: `src/common/interceptors/{name}.interceptor.ts`
- Pipes: `src/common/pipes/{name}.pipe.ts`
- Filters: `src/common/filters/{name}.filter.ts`
- Middleware: `src/common/middleware/{name}.middleware.ts`

## Pattern
- Use Guards for auth/authorization
- Use Interceptors for response transformation, logging, caching
- Use Pipes for validation and data transformation
- Use Filters for exception handling
- Use Middleware for raw request processing (rare)

## Template
```typescript
// Guard example
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // check auth
    return true;
  }
}

// Apply: @UseGuards(AuthGuard) on controller or method
// Global: app.useGlobalGuards(new AuthGuard()) in main.ts
````

## Rules

- Prefer NestJS abstractions (Guard, Interceptor, Pipe) over raw middleware
- Global middleware goes in `main.ts`
- Scoped middleware uses decorators on controllers/methods

````

#### Express
```markdown
# Skill: Middleware

## When to Use
When adding cross-cutting concerns: auth, logging, rate limiting, validation, error handling.

## File Locations
- Middleware: `src/middleware/{name}.middleware.ts`
- Register in: `src/app.ts` (global) or route file (scoped)

## Template
```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // verify token, attach user to req
  next();
}

// Global: app.use(authMiddleware)
// Scoped: router.use(authMiddleware) or router.get('/', authMiddleware, handler)
````

## Rules

- Always call next() or send a response — never leave hanging
- Error middleware has 4 params: (err, req, res, next)
- Order matters — register middleware before routes that need it

````

#### Elysia
```markdown
# Skill: Middleware

## When to Use
When adding cross-cutting concerns: auth, logging, rate limiting.

## File Locations
- Plugins: `src/plugins/{name}.plugin.ts`
- Register in: `src/index.ts` or scoped route module

## Template
```typescript
// src/plugins/auth.plugin.ts
import { Elysia } from 'elysia';

export const authPlugin = new Elysia({ name: 'auth' })
  .derive(({ headers }) => {
    const token = headers.authorization?.split(' ')[1];
    // verify token
    return { user: decodedUser };
  })
  .onBeforeHandle(({ user }) => {
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
  });

// Usage: route.use(authPlugin)
````

## Rules

- Middleware in Elysia is done via plugins with lifecycle hooks
- Use `.derive()` to add data to context
- Use `.onBeforeHandle()` for guards/checks
- Plugins compose — scope them to specific route groups

````

#### Next.js API
```markdown
# Skill: Middleware

## When to Use
When adding auth checks, redirects, or request processing across routes.

## File Locations
- Edge middleware: `middleware.ts` (project root or `src/`)
- Utility wrappers: `src/lib/api-middleware.ts`

## Template
```typescript
// middleware.ts (edge — runs on all matched routes)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  if (!token && request.nextUrl.pathname.startsWith('/api/protected')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/protected/:path*',
};

// src/lib/api-middleware.ts (wrapper for route handlers)
type Handler = (req: NextRequest, ctx: any) => Promise<NextResponse>;

export function withAuth(handler: Handler): Handler {
  return async (req, ctx) => {
    const token = req.headers.get('authorization');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(req, ctx);
  };
}

// Usage in route.ts:
// export const GET = withAuth(async (req) => { ... });
````

## Rules

- Edge middleware runs BEFORE the request reaches the route handler
- Use `matcher` config to scope middleware to specific paths
- For per-route logic, use wrapper functions (withAuth, withValidation)
- Edge middleware cannot use Node.js APIs — it runs on the edge runtime

````

---

### 3. database.md — Database Queries & Operations

**What to scan:** Look at existing service files or data-access code. How are queries written? Transactions? Relations?

**Fallback — adapt based on ORM from tech-stack.md. Common ORMs:**

#### Prisma (all frameworks)
```markdown
# Skill: Database

## When to Use
When writing database queries, creating models, or managing data operations.

## File Locations
- Schema: `prisma/schema.prisma`
- Client instance: `src/lib/prisma.ts` (or `src/prisma/client.ts`)
- Migrations: `prisma/migrations/` (auto-generated)

## Pattern
1. Define/update model in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name {description}`
3. Use the shared Prisma client instance — never create new `PrismaClient()` in service files
4. Use Prisma's typed query API

## Template
```typescript
// src/lib/prisma.ts — singleton client
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Query patterns
// Find many with filters + pagination
const users = await prisma.user.findMany({
  where: { status: 'active' },
  include: { posts: true },
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' },
});

// Transaction
const result = await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData });
  await tx.inventory.update({ where: { id: itemId }, data: { stock: { decrement: 1 } } });
  return order;
});
````

## Rules

- Always use the shared Prisma client from `src/lib/prisma.ts`
- Never `new PrismaClient()` in route handlers or services
- Use `$transaction` for operations that must be atomic
- Always run `prisma generate` after schema changes
- Use `include` for relations, `select` when you need specific fields only

````

#### Drizzle (all frameworks)
```markdown
# Skill: Database

## When to Use
When writing database queries, creating schemas, or managing data operations.

## File Locations
- Schema: `src/db/schema.ts` (or `src/db/schema/`)
- Client instance: `src/db/index.ts`
- Migrations: `drizzle/` (auto-generated)
- Config: `drizzle.config.ts`

## Pattern
1. Define/update schema in `src/db/schema.ts`
2. Run `npx drizzle-kit generate` then `npx drizzle-kit migrate`
3. Use the shared db instance from `src/db/index.ts`

## Template
```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const db = drizzle(process.env.DATABASE_URL!, { schema });

// Query patterns
import { eq, desc } from 'drizzle-orm';

const result = await db.select().from(users).where(eq(users.status, 'active')).orderBy(desc(users.createdAt)).limit(limit).offset(offset);

// Transaction
const result = await db.transaction(async (tx) => {
  const order = await tx.insert(orders).values(orderData).returning();
  await tx.update(inventory).set({ stock: sql`stock - 1` }).where(eq(inventory.id, itemId));
  return order;
});
````

## Rules

- Always use the shared db instance from `src/db/index.ts`
- Schema is code — define tables as TypeScript, not raw SQL
- Use `drizzle-kit` for migrations, never manual SQL
- Use `.returning()` on insert/update when you need the result

````

---

### 4. validation.md — Input Validation

**What to scan:** How are request bodies validated? What library? Where do schemas live?

**Fallback — adapt based on framework + validation library:**

#### Zod (Express / Next.js / Elysia with zod plugin)
```markdown
# Skill: Validation

## When to Use
When validating request input — body, query params, path params.

## File Locations
- Schemas: `src/schemas/{resource}.schema.ts`

## Template
```typescript
// src/schemas/{resource}.schema.ts
import { z } from 'zod';

export const create{Resource}Schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.enum(['admin', 'user']).default('user'),
});

export const update{Resource}Schema = create{Resource}Schema.partial();

export const query{Resource}Schema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

// Infer types from schemas
export type Create{Resource}Input = z.infer<typeof create{Resource}Schema>;
export type Update{Resource}Input = z.infer<typeof update{Resource}Schema>;
````

## Rules

- One schema file per resource
- Always export inferred types alongside schemas
- Use `.partial()` for update schemas
- Use `z.coerce` for query params (they come as strings)
- Reuse schemas across backend and frontend when possible

````

#### class-validator (NestJS)
```markdown
# Skill: Validation

## When to Use
When validating request input in NestJS endpoints.

## File Locations
- DTOs: `src/modules/{module}/dto/create-{module}.dto.ts`

## Template
```typescript
// src/modules/{module}/dto/create-{module}.dto.ts
import { IsString, IsEmail, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class Create{Module}Dto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['admin', 'user'])
  @IsOptional()
  role?: string = 'user';
}

// Enable in main.ts:
// app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
````

## Rules

- One DTO class per operation (CreateXDto, UpdateXDto, QueryXDto)
- Use `PartialType(CreateXDto)` for update DTOs
- Always enable `whitelist: true` to strip unknown properties
- DTOs are classes, not interfaces — they need decorators

````

---

### 5. error-handling.md — Error Handling

**What to scan:** Look for error handling patterns — global error handler, custom exception classes, error response shape.

**Fallback by framework:**

#### NestJS
```markdown
# Skill: Error Handling

## When to Use
When throwing errors, creating custom exceptions, or handling errors globally.

## File Locations
- Exception filter: `src/common/filters/http-exception.filter.ts`
- Custom exceptions: `src/common/exceptions/`

## Pattern
- Use built-in NestJS exceptions (NotFoundException, BadRequestException, etc.)
- Create custom exceptions for domain-specific errors
- Global exception filter catches and formats all errors

## Template
```typescript
// Throwing errors in services
import { NotFoundException, BadRequestException } from '@nestjs/common';

if (!user) throw new NotFoundException('User not found');
if (exists) throw new BadRequestException('Email already registered');

// Custom exception
export class InsufficientBalanceException extends BadRequestException {
  constructor(balance: number, required: number) {
    super(`Insufficient balance: have ${balance}, need ${required}`);
  }
}
````

## Error Response Shape

```json
{ "statusCode": 400, "message": "Error description", "error": "Bad Request" }
```

## Rules

- Never try/catch in controllers — let exceptions propagate to the filter
- Use appropriate HTTP exception class (404, 400, 403, 409, etc.)
- Include meaningful error messages

````

#### Express
```markdown
# Skill: Error Handling

## When to Use
When handling errors in routes, creating custom errors, or setting up error middleware.

## File Locations
- Error middleware: `src/middleware/error.middleware.ts`
- Custom errors: `src/errors/` (or `src/utils/errors.ts`)

## Template
```typescript
// src/errors/app-error.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { message: err.message, code: err.code }
    });
  }
  console.error(err);
  res.status(500).json({ error: { message: 'Internal server error' } });
}

// Register LAST in app.ts: app.use(errorHandler)
````

## Rules

- Always call `next(error)` in route handlers — never send error responses directly
- Error middleware must be registered AFTER all routes
- Use AppError subclasses, not raw `throw new Error()`
- Log unexpected errors (non-AppError), don't expose details to client

````

#### Elysia
```markdown
# Skill: Error Handling

## When to Use
When handling errors in route handlers or globally.

## File Locations
- Error plugin: `src/plugins/error.plugin.ts`

## Template
```typescript
// src/plugins/error.plugin.ts
import { Elysia } from 'elysia';

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
  }
}

export const errorPlugin = new Elysia({ name: 'error' })
  .error({ APP_ERROR: AppError })
  .onError(({ code, error, set }) => {
    if (code === 'APP_ERROR') {
      set.status = error.statusCode;
      return { error: { message: error.message } };
    }
    if (code === 'VALIDATION') {
      set.status = 400;
      return { error: { message: 'Validation failed', details: error.all } };
    }
    set.status = 500;
    return { error: { message: 'Internal server error' } };
  });
````

## Rules

- Register custom error types with `.error()`
- Use `.onError()` lifecycle for global handling
- Elysia handles validation errors automatically when using `t` schemas
- Throw `new AppError('message', statusCode)` in handlers

````

#### Next.js API
```markdown
# Skill: Error Handling

## When to Use
When handling errors in API route handlers.

## File Locations
- Error utilities: `src/lib/api-error.ts`

## Template
```typescript
// src/lib/api-error.ts
import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: error.statusCode }
    );
  }
  console.error(error);
  return NextResponse.json(
    { error: { message: 'Internal server error' } },
    { status: 500 }
  );
}

// Usage in route.ts:
export async function GET() {
  try {
    // logic
    return NextResponse.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
````

## Rules

- Each route handler wraps in try/catch
- Use `handleApiError()` consistently — don't craft error responses manually
- Consider a `withErrorHandler` wrapper to reduce boilerplate

````

---

### 6. response.md — Response Format

**What to scan:** Look at how existing endpoints return data. Is there a consistent shape?

**Fallback (framework-agnostic — just the shape):**
```markdown
# Skill: Response Format

## When to Use
When returning data from any API endpoint.

## Standard Response Shape

### Success (single item)
```json
{
  "data": { "id": "...", "name": "..." }
}
````

### Success (list with pagination)

```json
{
  "data": [{ "id": "...", "name": "..." }],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "MACHINE_READABLE_CODE"
  }
}
```

### Mutation success (optional message)

```json
{
  "data": { "id": "..." },
  "message": "Resource created successfully"
}
```

## Rules

- ALWAYS wrap response in `{ data }` — never return raw arrays or objects
- Pagination uses `meta` object alongside `data` array
- Errors use `{ error: { message, code } }` — never `{ message }` at root
- Use appropriate HTTP status codes: 200 (ok), 201 (created), 204 (deleted), 400 (bad input), 401 (unauthorized), 403 (forbidden), 404 (not found), 409 (conflict), 500 (server error)
- Include `message` field on mutations only when there's something useful to say

````

---

### 7. auth.md — Authentication & Authorization

**What to scan:** Look for auth middleware, guards, token handling, session management.

**Fallback (generic — adapt to specific auth library from dependencies.md):**
```markdown
# Skill: Auth

## When to Use
When implementing auth checks, protecting routes, or handling user sessions.

## Pattern
[This is highly project-specific. Document after scanning or interviewing:]
- How tokens are issued and verified
- Where the auth middleware/guard is
- How to protect a route
- How to access the current user in a handler
- How roles/permissions work (if applicable)

## Template for Protecting a Route
[Framework-specific — fill based on BACKEND_FRAMEWORK]

## Rules
- Always use the existing auth middleware/guard — never write custom token checks in route handlers
- Never trust client-side role claims — always verify on the server
- Token secrets come from env vars — never hardcode
````

---

### 8. testing.md — Writing Backend Tests

**What to scan:** Look at existing test files. What framework? How are tests structured? How is the app bootstrapped for testing?

**Fallback (generic — adapt based on test framework from tech-stack.md):**

```markdown
# Skill: Backend Testing

## When to Use

When writing unit tests or integration tests for backend code.

## File Locations

- Unit tests: colocated as `{name}.test.ts` or `{name}.spec.ts`
- Integration tests: `tests/` or `test/` at project root
- Test utilities: `tests/helpers/` or `src/test/`

## Pattern

1. Unit test services in isolation — mock dependencies
2. Integration test endpoints — test the full request/response cycle
3. Use factories or fixtures for test data — never hardcode

## Template

[Adapt based on test framework — Jest, Vitest, or built-in Bun test]

## Rules

- Test behavior, not implementation
- Each test file mirrors a source file
- Use descriptive test names: `should return 404 when user not found`
- Clean up test data after each test
- Never test against production database
```

---

## STEP 3: Update CLAUDE.md

After generating all skills, update the skills section in `.claude/CLAUDE.md`:

```markdown
## Skills — Backend

Before implementing backend features, read the relevant skill in `.claude/skills/backend/`:

| Skill               | When to Read                                          |
| ------------------- | ----------------------------------------------------- |
| `endpoint.md`       | Creating new API routes or controllers                |
| `middleware.md`     | Adding auth, validation, logging, or other middleware |
| `database.md`       | Writing queries, creating models, transactions        |
| `validation.md`     | Validating request input                              |
| `error-handling.md` | Throwing or handling errors                           |
| `response.md`       | Returning API responses                               |
| `auth.md`           | Protecting routes, handling auth                      |
| `testing.md`        | Writing backend tests                                 |
```

Tell the user:

```
Done! Backend skills generated in .claude/skills/backend/
CLAUDE.md updated with skill references.

Generated skills:
- endpoint.md
- middleware.md
- database.md
- validation.md
- error-handling.md
- response.md
- auth.md
- testing.md

Review each file and adjust patterns to match your exact preferences.
```
