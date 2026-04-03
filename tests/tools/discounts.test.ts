import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools/discounts.js";
import { pageInfo } from "../fixtures/responses.js";
import { createMockClient, executeTool, getTool } from "../helpers.js";

describe("discount tools", () => {
  it("lists discounts", async () => {
    const tool = getTool(tools, "shopify_list_discounts");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        discountNodes: {
          edges: [{ node: { id: "gid://shopify/DiscountNode/1" } }],
          pageInfo,
        },
      },
    });

    await expect(executeTool(tool, client, { first: 1 })).resolves.toEqual({
      discounts: [{ id: "gid://shopify/DiscountNode/1" }],
      pageInfo,
    });
  });

  it("surfaces discount mutation user errors", async () => {
    const tool = getTool(tools, "shopify_create_basic_discount");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        discountCodeBasicCreate: {
          codeDiscountNode: null,
          userErrors: [{ field: ["code"], message: "Code must be unique" }],
        },
      },
    });

    await expect(
      executeTool(tool, client, {
        title: "Summer Sale",
        code: "SUMMER",
        discountType: "PERCENTAGE",
        value: 0.2,
        startsAt: "2026-04-02T10:00:00Z",
      }),
    ).rejects.toThrow("Shopify discount creation failed");
  });

  it("validates discount creation input", () => {
    const tool = getTool(tools, "shopify_create_basic_discount");
    expect(() =>
      tool.inputSchema.parse({
        title: "Summer Sale",
        code: "SUMMER",
        discountType: "PERCENTAGE",
        value: -1,
        startsAt: "2026-04-02T10:00:00Z",
      }),
    ).toThrow();
  });
});
