# shopify-admin-mcp

Production-grade MCP server for the Shopify Admin GraphQL API. It exposes typed, schema-driven tools for AI agents and is structured so quarterly Shopify API upgrades are mechanical: update the API version, pull the new schema, regenerate types, and let TypeScript surface any broken operations.

## Status

Client credentials authentication for Shopify Dev Dashboard apps is implemented, and legacy custom app access tokens are still supported.

On April 2, 2026, Shopify's live Admin GraphQL endpoint rejected `2025-04` as an invalid version, so this repository defaults to `2025-07` even though older examples in the original spec referenced `2025-04`.

## Features

- ESM-only TypeScript with `strict: true`
- Committed Admin GraphQL SDL in [`src/schema/admin.graphql`](./src/schema/admin.graphql)
- Generated operation types via `@shopify/api-codegen-preset`
- Cost-aware throttling with automatic retry on `THROTTLED`
- Zod-validated MCP tool inputs with field descriptions for agents
- Domain-focused tools for products, orders, customers, inventory, collections, fulfillment, discounts, metafields, webhooks, bulk operations, shop metadata, and files
- Stdio transport for Claude Desktop, Cursor, and other MCP hosts

## Install

```bash
npm install
npm run generate-types
npm run build
```

## Configuration

### Dev Dashboard App Credentials

```env
SHOPIFY_STORE=my-store.myshopify.com
SHOPIFY_API_VERSION=2025-07
SHOPIFY_CLIENT_ID=your_api_key
SHOPIFY_CLIENT_SECRET=your_api_secret
```

This is the recommended setup for Shopify's current Dev Dashboard apps. The server exchanges `SHOPIFY_CLIENT_ID` and `SHOPIFY_CLIENT_SECRET` for a 24-hour Admin API token automatically and renews it when needed.

### Legacy Custom App Token

```env
SHOPIFY_STORE=my-store.myshopify.com
SHOPIFY_API_VERSION=2025-07
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

This path still works, but it is no longer the best default for shared installs.

## Usage

Run directly:

```bash
SHOPIFY_STORE=my-store.myshopify.com \
SHOPIFY_API_VERSION=2025-07 \
SHOPIFY_CLIENT_ID=your_api_key \
SHOPIFY_CLIENT_SECRET=your_api_secret \
npx shopify-admin-mcp
```

Claude Desktop configuration:

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "shopify-admin-mcp"],
      "env": {
        "SHOPIFY_STORE": "my-store.myshopify.com",
        "SHOPIFY_API_VERSION": "2025-07",
        "SHOPIFY_CLIENT_ID": "your_api_key",
        "SHOPIFY_CLIENT_SECRET": "your_api_secret"
      }
    }
  }
}
```

## Claude Code

This repo now includes both a project-level Claude skill and a distributable Claude plugin.

### Project skill

The repo-local skill lives at [`.claude/skills/shopify-admin/SKILL.md`](./.claude/skills/shopify-admin/SKILL.md). When you open this repository in Claude Code, the skill is available for project-scoped Shopify work as `/shopify-admin`.

### Personal plugin

The Claude plugin bundle lives at [`plugins/claude-shopify-admin`](./plugins/claude-shopify-admin) with manifest metadata in [`plugins/claude-shopify-admin/.claude-plugin/plugin.json`](./plugins/claude-shopify-admin/.claude-plugin/plugin.json). It ships:

- the `shopify` MCP server via [`plugins/claude-shopify-admin/.mcp.json`](./plugins/claude-shopify-admin/.mcp.json)
- a plugin skill available as `/shopify-admin:workflow`
- prompted user configuration for `shopify_store`, `shopify_client_id`, `shopify_client_secret`, and `shopify_api_version`

The repository also includes a Claude marketplace at [`.claude-plugin/marketplace.json`](./.claude-plugin/marketplace.json) and a repo-level hint in [`.claude/settings.json`](./.claude/settings.json) so Claude can discover the marketplace from GitHub.

Install it as a personal Claude plugin:

```bash
claude plugin marketplace add ChaseWNorton/shopify-admin-mcp
claude plugin install shopify-admin@chasewnorton-tools --scope user
```

For local plugin testing without installing:

```bash
claude --plugin-dir ./plugins/claude-shopify-admin
```

## Codex Plugin

A repo-local Codex plugin wrapper is included at [`plugins/shopify-admin/.codex-plugin/plugin.json`](./plugins/shopify-admin/.codex-plugin/plugin.json) with MCP wiring in [`plugins/shopify-admin/.mcp.json`](./plugins/shopify-admin/.mcp.json).

The plugin also includes a Codex skill at [`plugins/shopify-admin/skills/shopify-admin/SKILL.md`](./plugins/shopify-admin/skills/shopify-admin/SKILL.md), so Codex can explicitly use `$shopify-admin` for Shopify Admin workflows instead of relying on raw tool names alone.

To share it with your team:

1. Publish this package to npm as `shopify-admin-mcp`.
2. Share the `plugins/shopify-admin` folder and, if you want marketplace discovery, [`.agents/plugins/marketplace.json`](./.agents/plugins/marketplace.json).
3. Have each user set their own Shopify values in `plugins/shopify-admin/.mcp.json`:

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "shopify-admin-mcp"],
      "env": {
        "SHOPIFY_STORE": "my-store.myshopify.com",
        "SHOPIFY_API_VERSION": "2025-07",
        "SHOPIFY_CLIENT_ID": "your_api_key",
        "SHOPIFY_CLIENT_SECRET": "your_api_secret"
      }
    }
  }
}
```

The plugin intentionally uses bring-your-own Shopify credentials. No shared client secret or access token should be committed to the plugin.

## Publish

Publish the MCP package first, then point the Codex plugin at that npm package.

```bash
npm run build
npm test
npm pack --dry-run
npm publish
```

After publish, verify the package resolves:

```bash
npx -y shopify-admin-mcp
```

The npm package only ships runtime assets from `dist/` plus the top-level docs and example env file.

## Tool Surface

The server registers tools from these domains:

- `products`
- `orders`
- `customers`
- `inventory`
- `collections`
- `fulfillment`
- `discounts`
- `metafields`
- `webhooks`
- `bulk`
- `shop`
- `files`

All tool names are prefixed with `shopify_`.

## Scripts

- `npm run build`: compile `src/` into `dist/`
- `npm run typecheck`: run `tsc --noEmit`
- `npm test`: run the Vitest suite
- `npm run pull-schema`: download the live SDL for the configured store and API version
- `npm run generate-types`: run GraphQL code generation
- `npm run upgrade-api -- <version>`: bump `API_VERSION`, pull the new schema, regenerate types, and typecheck the repo

## Upgrade Flow

Quarterly upgrade flow:

1. `npm run upgrade-api -- 2025-10`
2. Fix any type errors caused by schema changes.
3. Re-run `npm run build` and `npm test`.
4. Commit the updated schema, generated types, and operation fixes together.

The key contract files are:

- [`src/schema/version.ts`](./src/schema/version.ts)
- [`src/schema/admin.graphql`](./src/schema/admin.graphql)
- [`src/operations/`](./src/operations)
- [`src/generated/admin.ts`](./src/generated/admin.ts)

## Verification

```bash
npm run build
npm run typecheck
npm test

echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | node dist/index.js
```

With real store credentials:

```bash
SHOPIFY_STORE=your-dev-store.myshopify.com \
SHOPIFY_API_VERSION=2025-07 \
SHOPIFY_CLIENT_ID=your_api_key \
SHOPIFY_CLIENT_SECRET=your_api_secret \
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"shopify_get_shop","arguments":{}}}' | node dist/index.js
```

## Repository Layout

```text
src/
  auth.ts
  client.ts
  index.ts
  server.ts
  throttle.ts
  generated/
  operations/
  schema/
  tools/
scripts/
tests/
```
