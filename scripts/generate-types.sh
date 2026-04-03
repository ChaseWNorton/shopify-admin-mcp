#!/bin/bash
set -euo pipefail

PATH="/opt/homebrew/bin:$PATH" npx graphql-codegen --config codegen.ts
sed -i '' 's/\.\/admin\.types\.ts/\.\/admin.types.js/g' src/generated/admin.generated.ts

echo "Generated Shopify Admin GraphQL types"
