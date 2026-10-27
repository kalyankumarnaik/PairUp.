# -----------------------------------------------------------------------------
# Base Image
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /usr/src/app

# -----------------------------------------------------------------------------
# Dependencies Stage
# -----------------------------------------------------------------------------
FROM base AS dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# -----------------------------------------------------------------------------
# Development Stage
# -----------------------------------------------------------------------------
FROM base AS development
COPY package*.json ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# -----------------------------------------------------------------------------
# Build Stage
# -----------------------------------------------------------------------------
FROM base AS build
COPY package*.json ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# -----------------------------------------------------------------------------
# Production Stage
# -----------------------------------------------------------------------------
FROM base AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
