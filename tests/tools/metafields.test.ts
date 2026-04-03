import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools/metafields.js";
import { pageInfo } from "../fixtures/responses.js";
import { createMockClient, executeTool, getTool } from "../helpers.js";

describe("metafields tools", () => {
  it("gets metafields for a resource", async () => {
    const tool = getTool(tools, "shopify_get_metafields");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        node: {
          id: "gid://shopify/Product/1",
          metafields: {
            edges: [
              {
                node: {
                  id: "gid://shopify/Metafield/1",
                  namespace: "custom",
                  key: "material",
                  value: "cotton",
                  type: "single_line_text_field",
                  compareDigest: null,
                  updatedAt: "2026-04-02T10:00:00Z",
                },
              },
            ],
            pageInfo,
          },
        },
      },
    });

    await expect(
      executeTool(tool, client, { ownerId: "gid://shopify/Product/1", first: 10 }),
    ).resolves.toEqual({
      ownerId: "gid://shopify/Product/1",
      metafields: [
        {
          id: "gid://shopify/Metafield/1",
          namespace: "custom",
          key: "material",
          value: "cotton",
          type: "single_line_text_field",
          compareDigest: null,
          updatedAt: "2026-04-02T10:00:00Z",
        },
      ],
      pageInfo,
    });
  });

  it("surfaces metafieldsSet user errors", async () => {
    const tool = getTool(tools, "shopify_set_metafields");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        metafieldsSet: {
          metafields: null,
          userErrors: [{ field: ["metafields"], message: "Definition is required" }],
        },
      },
    });

    await expect(
      executeTool(tool, client, {
        metafields: [{ ownerId: "gid://shopify/Product/1", key: "material", value: "cotton" }],
      }),
    ).rejects.toThrow("Shopify metafields set failed");
  });

  it("validates metafield mutation input", () => {
    const tool = getTool(tools, "shopify_set_metafields");
    expect(() => tool.inputSchema.parse({ metafields: [] })).toThrow();
  });
});
