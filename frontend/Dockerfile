# === Stage 1: Build ===
# Use a Node.js version compatible with Next.js 15
FROM node:22-alpine AS builder
WORKDIR /app


COPY package*.json ./
RUN npm install

COPY . .


RUN npm run build

# === Stage 2: Production Runner ===
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]