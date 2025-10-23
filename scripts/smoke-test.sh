#!/usr/bin/env bash
set -e
URL=${1:-http://localhost:3000}
if curl -sSf "${URL}" >/dev/null; then
  echo "Smoke test passed"
  exit 0
else
  echo "Smoke test failed"
  exit 1
fi
