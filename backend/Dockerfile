FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma
RUN bunx prisma generate

COPY src ./src
COPY tsconfig.json prisma.config.ts ./

# ─────────────────────────────────────────
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json /app/bun.lock ./
COPY --from=builder /app/tsconfig.json /app/prisma.config.ts ./

EXPOSE 3030

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run src/index.ts"]
