ARG DATABASE_URL
ARG JWT_ACCESS_SECRET
ARG JWT_REFRESH_SECRET

FROM node:18.14-alpine as base

WORKDIR /server

ENV NODE_ENV development

COPY ./prisma/ ./prisma/
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npm ci

COPY ./src/main/ ./src/main/
COPY ./types ./types

RUN npm run generate

RUN npm run build

FROM node:18.14-alpine as build

WORKDIR /build

COPY ./prisma/ ./prisma/
COPY package.json ./
COPY package-lock.json ./

ARG DATABASE_URL
ARG JWT_ACCESS_SECRET
ARG JWT_REFRESH_SECRET

ENV NODE_ENV production
ENV PORT 8000
ENV DATABASE_URL ${DATABASE_URL}
ENV JWT_ACCESS_SECRET ${JWT_ACCESS_SECRET}
ENV JWT_REFRESH_SECRET ${JWT_REFRESH_SECRET}

RUN npm ci --omit=dev

COPY --from=base /server/dist ./dist

EXPOSE 8000

CMD npm run migrateProd && npm start
