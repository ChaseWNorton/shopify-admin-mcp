---
name: workflow
description: Use when a Shopify Admin task should go through the bundled Shopify MCP tools instead of manual API reconstruction.
---

# Shopify Admin Workflow

Use this skill when the plugin's `shopify` MCP server is enabled and the task involves live Shopify Admin data.

## Workflow

1. Start with the smallest `shopify_` tool that can answer the question.
2. Resolve Shopify IDs with read tools before calling mutations.
3. Use `first` and `after` for pagination, and stop only when `pageInfo.hasNextPage` is false.
4. Prefer `query` filters over broad listings whenever Shopify search syntax can narrow the result set.
5. Treat mutation `userErrors` as the next action item. Adjust the input instead of retrying unchanged.
6. For connected tasks, chain tools in business order: customer -> order -> fulfillment, product -> variant -> inventory, collection -> products.

## Response Style

- Summarize important Shopify IDs in successful writes.
- Restate the next pagination cursor when more data is available.
- Quote Shopify error messages precisely when the next step depends on them.
