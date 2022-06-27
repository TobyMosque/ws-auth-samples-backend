FROM node:lts-alpine as global-deps-stage
RUN npm i --location=global @nestjs/cli@latest

FROM global-deps-stage as develop-stage
WORKDIR /src
COPY package.json ./
COPY yarn.lock ./
COPY backend/package.json ./backend/
COPY . .

FROM develop-stage as local-deps-stage
RUN yarn

FROM local-deps-stage as build-stage
RUN yarn backend:build

FROM node:lts-alpine as production-stage
WORKDIR /app
COPY --from=build-stage /src/backend/package.json .
COPY --from=build-stage /src/backend/dist .
RUN yarn --prod
COPY --from=build-stage /src/node_modules/.prisma/ ./node_modules/.prisma/
EXPOSE 3000
CMD ["node", "src/main.js"]