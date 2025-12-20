
NOTES:


ESPAĆO DEIXANDO TUDO EM UM COMANDO SÓ

Peso do cache - 161MB - Não poupou nada
2 LAYERS - 161MB

3 LAYERS - 161MB mesmo tamanho, provalvemente pq a última camada ficou do mesmo jeito


```yaml
FROM node:lts-alpine AS build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json tsconfig.json src ./
RUN npm ci -s
RUN npm run build
RUN npm ci --omit=dev
USER NODE

FROM node:lts-alpine AS runner
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules /usr/src/app/dist ./
EXPOSE 8080
ENTRYPOINT ["node", "./dist/src/index.js"]
```
