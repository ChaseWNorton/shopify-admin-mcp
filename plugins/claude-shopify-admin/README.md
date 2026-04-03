# shopify-admin Claude plugin

This plugin bundles the published `shopify-admin-mcp` package for Claude Code and Claude-compatible plugin hosts.

## What it includes

- A Shopify Admin MCP server wired through `npx shopify-admin-mcp`
- A plugin skill available as `/shopify-admin:workflow`
- Prompted user configuration for:
  - `shopify_store`
  - `shopify_client_id`
  - `shopify_client_secret`
  - `shopify_api_version`

## Local testing

Run Claude against the plugin directory directly:

```bash
claude --plugin-dir ./plugins/claude-shopify-admin
```

## Personal install

Add this repository as a marketplace, then install the plugin at user scope:

```bash
claude plugin marketplace add ChaseWNorton/shopify-admin-mcp
claude plugin install shopify-admin@chasewnorton-tools --scope user
```

Claude will prompt for your Shopify store domain, app client ID, app client secret, and API version when the plugin is enabled. The MCP then mints and refreshes the Admin API access token automatically.
