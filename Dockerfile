# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
## Fail fast if backend URL isn't provided at build time (avoids "Invalid URL" at runtime)
RUN if [ -z "$NEXT_PUBLIC_BACKEND_URL" ]; then echo "Error: NEXT_PUBLIC_BACKEND_URL build arg is required" >&2; exit 1; fi
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
ENV PORT=3000
EXPOSE 3000
# Bind to all interfaces to be reachable from Traefik inside the Docker network
CMD ["node", "node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]