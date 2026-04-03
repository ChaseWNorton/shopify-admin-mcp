#!/bin/bash
set -euo pipefail

DEFAULT_VERSION="$(sed -n 's/export const API_VERSION = "\(.*\)";/\1/p' src/schema/version.ts)"
API_VERSION="${SHOPIFY_API_VERSION:-$DEFAULT_VERSION}"
STORE="${SHOPIFY_STORE:?Set SHOPIFY_STORE}"
TOKEN="${SHOPIFY_ACCESS_TOKEN:?Set SHOPIFY_ACCESS_TOKEN}"

PATH="/opt/homebrew/bin:$PATH" npx -y get-graphql-schema \
  -h "X-Shopify-Access-Token=$TOKEN" \
  "https://$STORE/admin/api/$API_VERSION/graphql.json" \
  > src/schema/admin.graphql

echo "Schema pulled for API version $API_VERSION"
