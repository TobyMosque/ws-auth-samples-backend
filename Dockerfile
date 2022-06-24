# develop stage
FROM node:lts-alpine as global-deps-stage
RUN npm i --location=global @nestjs/cli@latest

FROM global-deps-stage as develop-stage
WORKDIR /src
COPY package.json ./
COPY yarn.lock .
COPY backend/package.json ./backend/
COPY backend/prisma ./backend/prisma/
COPY ./backend backend

# local-deps
FROM develop-stage as local-deps-stage
RUN yarn

# build stage
FROM local-deps-stage as build-stage
RUN yarn workspace backend nest build

# prod stage
FROM node:lts-alpine as production-stage
WORKDIR /app
COPY --from=build-stage /src/backend/package.json .
COPY --from=build-stage /src/backend/dist .
RUN yarn --prod
RUN rm -r -f ./node_modules/.prisma/client
COPY --from=build-stage /src/node_modules/.prisma/client ./node_modules/.prisma/client
EXPOSE 3000
CMD ["node", "src/main.js"]