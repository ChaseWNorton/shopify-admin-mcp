---
name: shopify-admin
description: Use when working with Shopify store data through the Shopify Admin MCP server, including products, orders, customers, inventory, collections, fulfillment, discounts, metafields, webhooks, bulk operations, shop details, or files.
---

# Shopify Admin

Use this skill when the task should go through the Shopify Admin MCP tools instead of raw API guesswork.

## Workflow

1. Start with the narrowest `shopify_` tool that matches the task.
2. Prefer read tools first to ground Shopify GIDs before write tools. Most mutations need object IDs such as `gid://shopify/Product/123`.
3. For list flows, pass `first` and continue with `after=pageInfo.endCursor` until the result is complete.
4. Use Shopify search syntax in `query` whenever a precise lookup is possible.
5. Treat mutation `userErrors` as actionable feedback. Fix the input rather than retrying the same request.
6. For cross-domain tasks, chain tools in order: customer -> orders -> fulfillment, product -> variants -> inventory, collection -> products, discount -> metafields.

## Tool Map

- Products: get, list, create, update, delete, list variants, update variant
- Orders: get, list, cancel, close, create draft, complete draft
- Customers: get, list, create, update
- Inventory: get level, list locations, adjust, set
- Collections: get, list, create, add products, remove products
- Fulfillment: list fulfillment orders, create fulfillment
- Discounts: list, create basic discount, delete
- Metafields: get, set, delete, list definitions
- Webhooks: list, create, delete
- Bulk: start query, check status, fetch result metadata
- Shop: get shop info
- Files: list files, create staged upload and file record

## Output Conventions

- When another page is needed, restate the next `after` cursor explicitly.
- When a write succeeds, summarize the changed Shopify object and the key IDs returned.
- When a write fails, surface the exact Shopify user errors and what input should change next.
