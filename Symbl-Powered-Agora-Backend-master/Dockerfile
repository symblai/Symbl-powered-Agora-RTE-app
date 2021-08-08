## Using Dockerfile from the following post: https://medium.com/@petomalina/using-go-mod-download-to-speed-up-golang-docker-builds-707591336888

FROM golang:1.15.1 as build-env

# All these steps will be cached
RUN mkdir /server
WORKDIR /server
COPY go.mod . 
COPY go.sum .

# Get dependancies - will also be cached if we won't change mod/sum
RUN go mod download
# COPY the source code as the last step
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o /go/bin/server

# Second step to build minimal image
FROM scratch
COPY --from=build-env /go/bin/server /go/bin/server
COPY --from=build-env /server/config.json config.json

ENTRYPOINT ["/go/bin/server"]
