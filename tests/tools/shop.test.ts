import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools/shop.js";
import { createMockClient, executeTool, getTool } from "../helpers.js";

describe("shop tools", () => {
  it("gets shop information", async () => {
    const tool = getTool(tools, "shopify_get_shop");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        shop: {
          id: "gid://shopify/Shop/1",
          name: "Example Shop",
          currencyCode: "USD",
        },
      },
    });

    await expect(executeTool(tool, client, {})).resolves.toEqual({
      id: "gid://shopify/Shop/1",
      name: "Example Shop",
      currencyCode: "USD",
    });
  });

  it("passes through client failures", async () => {
    const tool = getTool(tools, "shopify_get_shop");
    const { client, query } = createMockClient();
    query.mockRejectedValue(new Error("Network unavailable"));

    await expect(executeTool(tool, client, {})).rejects.toThrow("Network unavailable");
  });

  it("accepts an empty input object", () => {
    const tool = getTool(tools, "shopify_get_shop");
    expect(tool.inputSchema.parse({ unexpected: true })).toEqual({});
  });
});
