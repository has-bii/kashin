# Tech Stack

## Backend (`/backend`)

- **Runtime**: Bun
- **Framework**: Elysia (latest)
- **Language**: TypeScript 6.x (strict, ESNext, nodenext modules)
- **ORM**: Prisma 7 → PostgreSQL
- **Auth**: Better Auth 1.5
- **Validation**: Zod 4
- **Code gen**: prismabox (auto-generates Elysia TypeBox schemas from Prisma models)
- **Rate limiting**: elysia-rate-limit
- **CORS**: @elysiajs/cors

## Frontend (`/frontend`)

- **Framework**: Next.js 16.2 (App Router), React 19
- **Language**: TypeScript 5.x (strict)
- **Styling**: Tailwind CSS 4
- **UI library**: shadcn/ui (style: radix-luma, base: olive, CSS variables)
- **Icons**: lucide-react
- **Server state**: TanStack Query 5
- **Forms**: TanStack Form 1
- **Tables**: TanStack Table 8
- **HTTP**: axios
- **Auth client**: Better Auth 1.6
- **Dates**: date-fns 4 + @date-fns/tz
- **URL state**: nuqs 2
- **DnD**: @dnd-kit (core, sortable, modifiers)
- **Charts**: recharts 3
- **Toasts**: sonner
- **Drawers**: vaul
- **Themes**: next-themes

## Key Decisions

- Backend uses Bun (not Node.js) — use `bun` commands, not `node`
- Frontend uses pnpm — never npm or yarn
- Better Auth handles auth on both sides — no custom JWT logic
- prismabox auto-generates TypeBox schemas — don't write them manually
- React Compiler active — no manual memoization needed
