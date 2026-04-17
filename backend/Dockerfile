FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY package.json bun.lock ./
COPY prisma ./prisma
COPY tsconfig.json prisma.config.ts ./
COPY src ./src
ENV NODE_ENV=production
RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres" bunx --bun prisma generate

# copy production dependencies and source code into final image
FROM base AS release
ENV NODE_ENV=production
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=prerelease /usr/src/app/src ./src
COPY --from=prerelease /usr/src/app/prisma ./prisma
COPY package.json bun.lock tsconfig.json prisma.config.ts ./

USER bun
EXPOSE 3030
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run src/index.ts"]
