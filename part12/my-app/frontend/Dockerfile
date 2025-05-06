FROM node:20 AS test-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm test

FROM node:20 AS build-stage

COPY --from=test-stage . .

WORKDIR /usr/src/app

RUN npm run build

FROM nginx:1.20.1 AS mount-stage

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html