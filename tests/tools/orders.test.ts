import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools/orders.js";
import { createMockClient, executeTool, getTool } from "../helpers.js";

describe("orders tools", () => {
  it("gets an order", async () => {
    const tool = getTool(tools, "shopify_get_order");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        order: { id: "gid://shopify/Order/1", name: "#1001" },
      },
    });

    await expect(executeTool(tool, client, { id: "gid://shopify/Order/1" })).resolves.toEqual({
      id: "gid://shopify/Order/1",
      name: "#1001",
    });
  });

  it("surfaces order cancellation user errors", async () => {
    const tool = getTool(tools, "shopify_cancel_order");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        orderCancel: {
          job: null,
          orderCancelUserErrors: [{ field: ["orderId"], message: "Order is already canceled" }],
        },
      },
    });

    await expect(
      executeTool(tool, client, {
        orderId: "gid://shopify/Order/1",
        reason: "OTHER",
        restock: false,
      }),
    ).rejects.toThrow("Shopify order cancellation failed");
  });

  it("validates draft order input", () => {
    const tool = getTool(tools, "shopify_create_draft_order");
    expect(() => tool.inputSchema.parse({ lineItems: [] })).toThrow();
  });
});
