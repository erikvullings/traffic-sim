# Creates the Chemical Hazard Tool server and GUI
#
# You can access the container using:
#   docker run -it safr sh
# To start it stand-alone:
#   docker run -it -p 8080:8080 safr

# Build the app separately
FROM node:20-alpine as builder

# ARG SERVER_URL
# ARG SERVER_PATH

# ENV SERVER_URL=${SERVER_URL}
# ENV SERVER_PATH=${SERVER_PATH}

# RUN apk add --no-cache --virtual .gyp python3 make g++ git vips-dev && \
#   npm i -g yalc
RUN mkdir -p /packages/gui && mkdir -p /packages/server
COPY ./packages/gui/LICENSE /packages/gui/LICENSE
COPY ./packages/gui/package.json /packages/gui/package.json
WORKDIR /packages/gui
RUN npm install
COPY ./packages/gui/favicon.ico /packages/gui/favicon.ico
COPY ./packages/gui/src /packages/gui/src
COPY ./packages/gui/rspack.config.ts /packages/gui/rspack.config.ts
COPY ./packages/gui/tsconfig.json /packages/gui/tsconfig.json
COPY ./packages/gui/README.md /packages/gui/README.md
RUN npm run build

# Serve the built app
FROM oven/bun:alpine as app

ARG GIT_COMMIT=latest

LABEL git_commit=$GIT_COMMIT

RUN mkdir -p /app
WORKDIR /app
COPY ./packages/server/tsconfig.json /app/tsconfig.json
COPY ./packages/server/package.json /app/package.json
RUN bun install
COPY ./packages/server/src /app/src
COPY --from=builder /packages/server/public /app/public

ENV PORT=8080
ENV VALHALLA_SERVER=valhalla
EXPOSE 8080
CMD ["bun", "./src/index.ts"]
