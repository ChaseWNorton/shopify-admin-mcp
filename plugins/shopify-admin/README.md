# shopify-admin Codex plugin

This plugin wraps the published `shopify-admin-mcp` npm package for Codex.

## Before using it

Edit [`.mcp.json`](./.mcp.json) and set:

- `SHOPIFY_STORE`
- `SHOPIFY_ACCESS_TOKEN`
- `SHOPIFY_API_VERSION`

Each user should use their own Shopify store and token values.

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
