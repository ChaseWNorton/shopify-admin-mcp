import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools/collections.js";
import { pageInfo } from "../fixtures/responses.js";
import { createMockClient, executeTool, getTool } from "../helpers.js";

describe("collections tools", () => {
  it("lists collections", async () => {
    const tool = getTool(tools, "shopify_list_collections");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        collections: {
          edges: [{ node: { id: "gid://shopify/Collection/1", title: "Summer" } }],
          pageInfo,
        },
      },
    });

    await expect(executeTool(tool, client, { first: 1 })).resolves.toEqual({
      collections: [{ id: "gid://shopify/Collection/1", title: "Summer" }],
      pageInfo,
    });
  });

  it("surfaces collection mutation user errors", async () => {
    const tool = getTool(tools, "shopify_create_collection");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        collectionCreate: {
          collection: null,
          userErrors: [{ field: ["title"], message: "Title must be unique" }],
        },
      },
    });

    await expect(executeTool(tool, client, { title: "Summer" })).rejects.toThrow(
      "Shopify collection creation failed",
    );
  });

  it("validates collection product modification input", () => {
    const tool = getTool(tools, "shopify_add_products_to_collection");
    expect(() => tool.inputSchema.parse({ id: "gid://shopify/Collection/1", productIds: [] })).toThrow();
  });
});
