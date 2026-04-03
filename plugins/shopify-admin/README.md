# shopify-admin Codex plugin

This plugin wraps the published `shopify-admin-mcp` npm package for Codex.

It also includes a bundled Codex skill, `$shopify-admin`, that gives Codex a concise workflow guide for Shopify Admin tasks.

## Before using it

Edit [`.mcp.json`](./.mcp.json) and set:

- `SHOPIFY_STORE`
- `SHOPIFY_API_VERSION`
- `SHOPIFY_CLIENT_ID`
- `SHOPIFY_CLIENT_SECRET`

Each user should use their own Shopify store and app credential values. The MCP mints the short-lived Admin API access token automatically at runtime.

## Runtime

The plugin launches:

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "shopify-admin-mcp"]
    }
  }
}
```

So this plugin expects the npm package `shopify-admin-mcp` to be published and available to `npx`.
