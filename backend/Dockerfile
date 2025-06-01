# --- Build Stage ---
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production --no-optional

# Copy prisma schema and generate the client
# This `prisma generate` step is CORRECT to keep here. It's needed for the built code to work.
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

# Copy the built application code
COPY --from=builder /app/dist ./dist

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
EXPOSE 3000
CMD ["node", "dist/src/main"]