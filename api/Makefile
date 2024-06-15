SHELL := /bin/bash

DIST_DIR=./dist

help:
	@echo "Include a make target:"
	@echo "  - build        : builds static binaries for all architectures"
	@echo "  - clean        : removes static binaries"
	@echo "  - build-docker : creates docker images for all architectures (requires VERSION env var)"
	@echo "  - rundev       : run local dev server"
	@echo "  - lint         : lint the source code"

require-version:
	@if [[ "${VERSION}" == "v"* ]]; then echo "VERSION must not start with v" && exit 1; fi;
	@if [ -z "${VERSION}" ]; then echo "VERSION variable must be set" && exit 1; fi;

build: build-linux-amd64 build-linux-arm64 build-linux-arm
build-docker: build-docker-amd64 build-docker-arm64 build-docker-arm

build-linux-amd64:
	env GOOS=linux GOARCH=amd64 go build -o ${DIST_DIR}/mishosapi-amd64

build-linux-arm64:
	env GOOS=linux GOARCH=arm64 go build -o ${DIST_DIR}/mishosapi-arm64

build-linux-arm:
	env GOOS=linux GOARCH=arm go build -o ${DIST_DIR}/mishosapi-arm

build-docker-amd64: require-version
	docker build \
		-f ./docker/Dockerfile.amd64 \
		-t bljohnsondev/mishos-api-amd64:latest \
		-t bljohnsondev/mishos-api-amd64:${VERSION} \
		-t bljohnsondev/mishos-api:latest \
		-t bljohnsondev/mishos-api:${VERSION} .

build-docker-arm64: require-version
	docker build \
		-f ./docker/Dockerfile.arm64 \
		-t bljohnsondev/mishos-api-arm64:latest \
		-t bljohnsondev/mishos-api-arm64:${VERSION} .

build-docker-arm: require-version
	docker build \
		-f ./docker/Dockerfile.arm \
		-t bljohnsondev/mishos-api-arm:latest \
		-t bljohnsondev/mishos-api-arm:${VERSION} .

clean:
	rm ${DIST_DIR}/mishosapi-*

rundev:
	CompileDaemon -command="./mishosapi" -log-prefix="false"

lint:
	golangci-lint run
