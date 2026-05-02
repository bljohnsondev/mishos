FROM mcr.microsoft.com/devcontainers/javascript-node:latest

ARG GO_VERSION="1.25.1"
ARG NVIM_VERSION=v0.12.1

RUN apt-get update && apt-get install -y --no-install-recommends \
    ripgrep \
    lazygit \
    mariadb-client \
    postgresql-client \
    postgresql-client-common \
    sqlite3 \
    && apt-get clean && rm -rf /var/lib/apt/lists/* \
    && curl -LO "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" \
    && tar -C /usr/local -xzf "go${GO_VERSION}.linux-amd64.tar.gz" \
    && rm "go${GO_VERSION}.linux-amd64.tar.gz"

ENV PATH="/usr/local/go/bin:/go/bin:${PATH}"
ENV GOPATH="/go"

RUN mkdir -p ${GOPATH}/bin \
    && chown -R node:node ${GOPATH}

# installs the neovim binary
RUN ARCH=$(uname -m) && \
    case "$ARCH" in \
      x86_64)  NVIM_ARCH="x86_64" ;; \
      aarch64|arm64) NVIM_ARCH="arm64" ;; \
      *) echo "Unsupported arch: $ARCH" && exit 1 ;; \
    esac && \
    curl -LO "https://github.com/neovim/neovim/releases/download/${NVIM_VERSION}/nvim-linux-${NVIM_ARCH}.tar.gz" && \
    tar -xzf "nvim-linux-${NVIM_ARCH}.tar.gz" && \
    cp -r "nvim-linux-${NVIM_ARCH}/." /usr/local/ && \
    rm -rf "nvim-linux-${NVIM_ARCH}"*

RUN go install github.com/go-task/task/v3/cmd/task@latest \
    && go install golang.org/x/tools/gopls@latest \
    && go install honnef.co/go/tools/cmd/staticcheck@latest \
    && go install github.com/air-verse/air@latest

COPY bashrc-config /tmp/bashrc-config
