import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools/fulfillment.js";
import { pageInfo } from "../fixtures/responses.js";
import { createMockClient, executeTool, getTool } from "../helpers.js";

describe("fulfillment tools", () => {
  it("lists fulfillment orders for an order", async () => {
    const tool = getTool(tools, "shopify_list_fulfillment_orders");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        order: {
          id: "gid://shopify/Order/1",
          fulfillmentOrders: {
            edges: [{ node: { id: "gid://shopify/FulfillmentOrder/1", status: "OPEN" } }],
            pageInfo,
          },
        },
      },
    });

    await expect(
      executeTool(tool, client, { orderId: "gid://shopify/Order/1", first: 1 }),
    ).resolves.toEqual({
      orderId: "gid://shopify/Order/1",
      fulfillmentOrders: [{ id: "gid://shopify/FulfillmentOrder/1", status: "OPEN" }],
      pageInfo,
    });
  });

  it("surfaces fulfillment mutation user errors", async () => {
    const tool = getTool(tools, "shopify_create_fulfillment");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        fulfillmentCreateV2: {
          fulfillment: null,
          userErrors: [{ field: ["lineItemsByFulfillmentOrder"], message: "Nothing to fulfill" }],
        },
      },
    });

    await expect(
      executeTool(tool, client, {
        lineItemsByFulfillmentOrder: [{ fulfillmentOrderId: "gid://shopify/FulfillmentOrder/1" }],
      }),
    ).rejects.toThrow("Shopify fulfillment creation failed");
  });

  it("validates fulfillment input", () => {
    const tool = getTool(tools, "shopify_create_fulfillment");
    expect(() => tool.inputSchema.parse({ lineItemsByFulfillmentOrder: [] })).toThrow();
  });
});
