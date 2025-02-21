FROM node:23 AS build

WORKDIR /app
COPY . .
RUN npm ci

RUN npm run build


FROM alpine:latest AS production

WORKDIR /pb/
ARG PB_VERSION=0.25.5

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

EXPOSE 8090

COPY --from=build /app/build  /pb/pb_public
COPY migrations /pb/pb_migrations

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
