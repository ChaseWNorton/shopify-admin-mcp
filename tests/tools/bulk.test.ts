import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools/bulk.js";
import { createMockClient, executeTool, getTool } from "../helpers.js";

describe("bulk tools", () => {
  it("returns bulk query status", async () => {
    const tool = getTool(tools, "shopify_bulk_query_status");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        currentBulkOperation: {
          id: "gid://shopify/BulkOperation/1",
          status: "COMPLETED",
          url: "https://example.com/results.jsonl",
        },
      },
    });

    await expect(executeTool(tool, client, {})).resolves.toEqual({
      id: "gid://shopify/BulkOperation/1",
      status: "COMPLETED",
      url: "https://example.com/results.jsonl",
    });
  });

  it("surfaces bulk query user errors", async () => {
    const tool = getTool(tools, "shopify_bulk_query");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        bulkOperationRunQuery: {
          bulkOperation: null,
          userErrors: [{ field: ["query"], message: "Query is invalid" }],
        },
      },
    });

    await expect(executeTool(tool, client, { query: "query Bulk { products { id } }" })).rejects.toThrow(
      "Shopify bulk query start failed",
    );
  });

  it("validates bulk query input", () => {
    const tool = getTool(tools, "shopify_bulk_query");
    expect(() => tool.inputSchema.parse({})).toThrow();
  });
});
