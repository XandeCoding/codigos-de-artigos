FROM oven/bun:1.3.14-alpine AS base 
WORKDIR /usr/src/app

FROM base AS install
COPY package.json bun.lock .
RUN bun install --frozen-lockfile --production

FROM base AS code 
COPY ./app /usr/src/app
COPY ./public /usr/src/public

FROM base AS runner
COPY --from=install /usr/src/app/node_modules .
COPY --from=code /usr/src/app ./app
COPY --from=code /usr/src/public ./public
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "./app/index.ts" ]
