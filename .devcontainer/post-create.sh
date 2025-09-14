#!/bin/bash

if [ -f "go.mod" ]; then
    go mod download
    go mod tidy
fi

if [ -f "package.json" ]; then
    pnpm install
fi
