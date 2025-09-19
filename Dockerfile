# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:22-alpine

FROM ${NODE_IMAGE} AS base
WORKDIR /app
ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat && addgroup -S nextjs && adduser -S nextjs -G nextjs

FROM base AS deps
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate
COPY package.json pnpm-lock.yaml ./
# Ensure devDependencies (postcss plugins, etc.) are installed for the build
ENV NODE_ENV=development
# Use a cached pnpm store to speed up installs across builds
RUN --mount=type=cache,target=/root/.pnpm-store \
	pnpm install --frozen-lockfile --prefer-offline --prod=false

FROM base AS build
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
# Fail fast if backend URL isn't provided at build time (avoids "Invalid URL" at runtime)
RUN if [ -z "$NEXT_PUBLIC_BACKEND_URL" ]; then echo "Error: NEXT_PUBLIC_BACKEND_URL build arg is required" >&2; exit 1; fi
# Cache next build artifacts between builds
RUN --mount=type=cache,target=/app/.next/cache \
	pnpm build

# Lightweight runtime with standalone output
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1 \
	PORT=3000
# Copy only the standalone server and public assets, ensuring ownership for non-root runtime
COPY --chown=nextjs:nextjs --from=build /app/.next/standalone ./
COPY --chown=nextjs:nextjs --from=build /app/.next/static ./.next/static
COPY --chown=nextjs:nextjs --from=build /app/public ./public
# Ensure Next.js can write its runtime cache (for image optimization, etc.)
RUN mkdir -p .next/cache && chown -R nextjs:nextjs .next
USER nextjs
EXPOSE 3000
# Bind to all interfaces to be reachable from Traefik inside the Docker network
CMD ["node", "server.js"]