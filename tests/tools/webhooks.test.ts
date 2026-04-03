import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools/webhooks.js";
import { pageInfo } from "../fixtures/responses.js";
import { createMockClient, executeTool, getTool } from "../helpers.js";

describe("webhooks tools", () => {
  it("lists webhook subscriptions", async () => {
    const tool = getTool(tools, "shopify_list_webhooks");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        webhookSubscriptions: {
          edges: [{ node: { id: "gid://shopify/WebhookSubscription/1", topic: "ORDERS_CREATE" } }],
          pageInfo,
        },
      },
    });

    await expect(executeTool(tool, client, { first: 1 })).resolves.toEqual({
      webhooks: [{ id: "gid://shopify/WebhookSubscription/1", topic: "ORDERS_CREATE" }],
      pageInfo,
    });
  });

  it("surfaces webhook creation user errors", async () => {
    const tool = getTool(tools, "shopify_create_webhook");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        webhookSubscriptionCreate: {
          webhookSubscription: null,
          userErrors: [{ field: ["topic"], message: "Topic is not allowed" }],
        },
      },
    });

    await expect(executeTool(tool, client, { topic: "ORDERS_CREATE" })).rejects.toThrow(
      "Shopify webhook creation failed",
    );
  });

  it("validates webhook creation input", () => {
    const tool = getTool(tools, "shopify_create_webhook");
    expect(() => tool.inputSchema.parse({})).toThrow();
  });
});
