FROM alpine
WORKDIR /app
RUN apk update && apk add --no-cache ca-certificates && rm -rf /var/cache/apk/*
COPY build/  build
COPY rostrum .
ENTRYPOINT ["./rostrum"]