# Use the base image with Node.js
FROM node:18-alpine AS base

# Install Docker CLI
RUN apk add --no-cache docker

# Install dependencies only when needed
FROM base AS deps

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Rebuild the source code only when needed
FROM base AS builder

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN echo "Database URL is: $DATABASE_URL"
RUN npx prisma generate

RUN \
    if [ -f yarn.lock ]; then yarn run build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Add user and group for Docker access
RUN addgroup --system docker || true
RUN adduser --system --ingroup docker nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:docker .next

COPY --from=builder --chown=nextjs:docker /app/.next/standalone ./
COPY --from=builder --chown=nextjs:docker /app/.next/static ./.next/static

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT 3000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "server.js"]
