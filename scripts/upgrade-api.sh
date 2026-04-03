#!/bin/bash
set -euo pipefail

NEW_VERSION="${1:?Usage: upgrade-api.sh <version>}"

sed -i '' "s/export const API_VERSION = \".*\";/export const API_VERSION = \"$NEW_VERSION\";/" src/schema/version.ts

SHOPIFY_API_VERSION="$NEW_VERSION" ./scripts/pull-schema.sh
./scripts/generate-types.sh
PATH="/opt/homebrew/bin:$PATH" npx tsc --noEmit

echo "Upgraded to $NEW_VERSION. Fix any type errors above, then commit."
