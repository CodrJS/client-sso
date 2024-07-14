
# Install dependencies only when needed
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM deps AS builder
WORKDIR /usr/src
COPY . .
# COPY --from=deps /usr/src/node_modules ./node_modules

ARG NEXT_PUBLIC_IDP_URL
ENV NEXT_PUBLIC_IDP_URL=${NEXT_PUBLIC_IDP_URL}

RUN npx next telemetry disable
RUN yarn build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /usr/src

ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /usr/src/next.config.mjs ./
COPY --from=builder /usr/src/public ./public
COPY --from=builder /usr/src/.next ./.next
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/package.json ./package.json

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /usr/src/.next
USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
RUN npx next telemetry disable

CMD ["yarn", "start"]
