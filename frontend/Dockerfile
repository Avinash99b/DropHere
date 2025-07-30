# 1. Base builder image
FROM node:20-alpine AS builder

WORKDIR /app

# 2. Install only prod dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Copy all files and build
COPY . .
RUN npm run build

# 4. Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Only copy what's needed for runtime
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose production port
EXPOSE 3000

# Start Next.js app
CMD ["npx", "next", "start"]
