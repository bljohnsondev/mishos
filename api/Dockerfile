FROM golang:1.22-alpine AS build

WORKDIR /app
COPY . .

RUN go mod download
RUN go build -o /app/mishosapi

FROM alpine:latest

WORKDIR /app
COPY --from=build /app/mishosapi .

CMD ["./mishosapi"]
