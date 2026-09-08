# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

ENV NODE_ENV=development

# Copy package files for layer caching
COPY package*.json ./

# Use cache mount for npm cache
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source code
COPY . .

# Build application (standalone output for minimal runtime image)
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# Create non-root user for security
RUN addgroup -g 1000 -S nodejs 2>/dev/null || true && \
    adduser -S nextjs -u 1000 2>/dev/null || adduser -S nextjs

# Copy standalone build output (includes only necessary node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]
