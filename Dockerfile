FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build:next

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/scripts/init-db.mjs ./scripts/init-db.mjs
COPY --from=builder /app/db/mysql-schema.sql ./db/mysql-schema.sql
EXPOSE 3000
CMD ["node", "server.js"]
