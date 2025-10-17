# Multi-stage Dockerfile for United Dev Platform
# Supports building web, api, and desktop applications

# Base image with Node.js and pnpm
FROM node:20-alpine AS base
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
## Copy workspace packages and apps so pnpm can detect workspace packages during install
COPY turbo.json ./
COPY packages ./packages
COPY apps ./apps
## Use --frozen-lockfile to ensure reproducible builds. Make sure pnpm-lock.yaml
## is kept up-to-date locally before building images.
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps ./apps
COPY . .

# Build all packages first
RUN pnpm build

# Web application stage
FROM base AS web
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app
CMD ["pnpm", "start"]

# API service stage
FROM base AS api
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app/apps/api
CMD ["node", "server.js"]

# Desktop application stage (for Electron build)
FROM base AS desktop
COPY --from=builder /app/apps/desktop ./apps/desktop
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

WORKDIR /app/apps/desktop
CMD ["npm", "start"]
