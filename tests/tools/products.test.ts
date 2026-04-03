import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools/products.js";
import { pageInfo } from "../fixtures/responses.js";
import { createMockClient, executeTool, getTool } from "../helpers.js";

describe("products tools", () => {
  it("gets a product", async () => {
    const tool = getTool(tools, "shopify_get_product");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        product: { id: "gid://shopify/Product/1", title: "Hat" },
      },
    });

    await expect(executeTool(tool, client, { id: "gid://shopify/Product/1" })).resolves.toEqual({
      id: "gid://shopify/Product/1",
      title: "Hat",
    });
  });

  it("surfaces product mutation user errors", async () => {
    const tool = getTool(tools, "shopify_create_product");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        productCreate: {
          product: null,
          userErrors: [{ field: ["title"], message: "Title is already taken" }],
        },
      },
    });

    await expect(executeTool(tool, client, { title: "Hat" })).rejects.toThrow(
      "Shopify product creation failed",
    );
  });

  it("validates list product input", () => {
    const tool = getTool(tools, "shopify_list_products");
    expect(() => tool.inputSchema.parse({ first: 0, after: pageInfo.endCursor })).toThrow();
  });
});
