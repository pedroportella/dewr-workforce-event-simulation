FROM node:20.19-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable \
  && corepack prepare pnpm@8.15.5 --activate \
  && pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src

RUN pnpm build \
  && pnpm prune --prod

FROM node:20.19-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=4100
ENV WORKFORCE_TARGET_URL=http://services:4000/api/v1/workforce-intelligence/events

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 4100

CMD ["node", "dist/server.js"]
