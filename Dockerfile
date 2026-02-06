# Base stage
FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# Development stage
FROM base AS development
RUN pnpm install --frozen-lockfile
COPY . .
CMD ["sh", "-c", "pnpm run dev:docker | pnpm pino-pretty"]

# Build stage
FROM base AS builder
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Production stage
FROM base AS production
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/dist ./dist
RUN chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1
CMD ["node", "dist/server.js"]
