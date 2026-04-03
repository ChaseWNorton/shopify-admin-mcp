import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools/inventory.js";
import { createMockClient, executeTool, getTool } from "../helpers.js";

describe("inventory tools", () => {
  it("gets an inventory level", async () => {
    const tool = getTool(tools, "shopify_get_inventory_level");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        inventoryItem: {
          inventoryLevel: {
            id: "gid://shopify/InventoryLevel/1",
            quantities: [{ name: "available", quantity: 12 }],
          },
        },
      },
    });

    await expect(
      executeTool(tool, client, {
        inventoryItemId: "gid://shopify/InventoryItem/1",
        locationId: "gid://shopify/Location/1",
      }),
    ).resolves.toEqual({
      id: "gid://shopify/InventoryLevel/1",
      quantities: [{ name: "available", quantity: 12 }],
    });
  });

  it("surfaces inventory adjustment user errors", async () => {
    const tool = getTool(tools, "shopify_adjust_inventory");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        inventoryAdjustQuantities: {
          inventoryAdjustmentGroup: null,
          userErrors: [{ field: ["changes"], message: "Location is inactive" }],
        },
      },
    });

    await expect(
      executeTool(tool, client, {
        name: "available",
        reason: "correction",
        changes: [
          {
            inventoryItemId: "gid://shopify/InventoryItem/1",
            locationId: "gid://shopify/Location/1",
            delta: 5,
          },
        ],
      }),
    ).rejects.toThrow("Shopify inventory adjustment failed");
  });

  it("validates set inventory input", () => {
    const tool = getTool(tools, "shopify_set_inventory");
    expect(() => tool.inputSchema.parse({ reason: "correction", setQuantities: [] })).toThrow();
  });
});
