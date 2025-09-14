FROM mcr.microsoft.com/devcontainers/javascript-node

ARG GO_VERSION="1.25.1"

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        tar \
        mariadb-client \
    && curl -LO "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" \
    && tar -C /usr/local -xzf "go${GO_VERSION}.linux-amd64.tar.gz" \
    && rm "go${GO_VERSION}.linux-amd64.tar.gz" \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="/usr/local/go/bin:/go/bin:${PATH}"
ENV GOPATH="/go"

RUN mkdir -p ${GOPATH}/bin \
    && chown -R node:node ${GOPATH}

USER node
WORKDIR /home/node

RUN go install github.com/go-task/task/v3/cmd/task@latest \
    && go install golang.org/x/tools/gopls@latest \
    && go install honnef.co/go/tools/cmd/staticcheck@latest \
    && go install github.com/air-verse/air@latest
