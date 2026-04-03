---
name: shopify-admin
description: Use when the user wants to inspect or change Shopify store data through the Shopify Admin MCP tools, including products, orders, customers, inventory, collections, fulfillment, discounts, metafields, webhooks, bulk operations, shop metadata, and files.
---

# Shopify Admin

Use this skill when Shopify work should go through the Shopify Admin MCP server instead of direct code changes.

## Workflow

1. Start with the narrowest `shopify_` tool that matches the task.
2. Prefer read tools first to ground Shopify GIDs before write tools. Many mutations need IDs such as `gid://shopify/Product/123`.
3. For list flows, pass `first` and continue with `after=pageInfo.endCursor` until the result is complete.
4. Use Shopify search syntax in `query` for targeted lookups instead of broad list calls.
5. For mutations, treat returned user errors as actionable feedback and adjust the input instead of retrying blindly.
6. When a task spans domains, chain tools in order: customer -> orders -> fulfillment, product -> variants -> inventory, collection -> products, discount -> metafields, and so on.

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

- When you need another page, explicitly restate the next `after` cursor you are using.
- When a write succeeds, summarize the changed Shopify object and the key IDs returned.
- When a write fails, surface the exact Shopify user errors and what input should change next.
