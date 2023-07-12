#!/bin/sh

UPSTREAM=origin/release/0.1.0
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL != $REMOTE ]; then
    git pull
    npm ci
    NODE_OPTIONS=--openssl-legacy-provider npm run build
else
    echo "No changes"
fi
