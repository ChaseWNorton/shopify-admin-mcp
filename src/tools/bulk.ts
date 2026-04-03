import { z } from "zod";
import type { ShopifyClient } from "../client.js";
import type {
  BulkQueryMutation,
  BulkQueryMutationVariables,
  BulkQueryStatusQuery,
} from "../generated/admin.js";
import { loadNamedOperation } from "../operations/index.js";
import { defineTool, type ToolDefinition } from "./index.js";
import { assertNoUserErrors, expectPresent } from "./shared.js";

const BULK_QUERY = loadNamedOperation("bulk", "BulkQuery");
const BULK_QUERY_STATUS = loadNamedOperation("bulk", "BulkQueryStatus");

const BulkQueryInput = z.object({
  query: z.string().describe("Bulk operation GraphQL query document to execute."),
  groupObjects: z
    .boolean()
    .optional()
    .describe("Whether Shopify should group child objects under parent records."),
});

const EmptyInput = z.object({});

export const tools: ToolDefinition[] = [
  defineTool({
    name: "shopify_bulk_query",
    description: "Start a Shopify bulk export query.",
    inputSchema: BulkQueryInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<BulkQueryMutation, BulkQueryMutationVariables>(
        await BULK_QUERY,
        input,
      );
      const payload = expectPresent(
        result.data.bulkOperationRunQuery,
        "Bulk query payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "bulk query start");
      return payload.bulkOperation;
    },
  }),
  defineTool({
    name: "shopify_bulk_query_status",
    description: "Check the status of the current Shopify bulk query operation.",
    inputSchema: EmptyInput,
    handler: async (client: ShopifyClient) => {
      const result = await client.query<BulkQueryStatusQuery>(await BULK_QUERY_STATUS);
      return result.data.currentBulkOperation;
    },
  }),
  defineTool({
    name: "shopify_bulk_query_results",
    description: "Get the current bulk query operation details, including result URLs when available.",
    inputSchema: EmptyInput,
    handler: async (client: ShopifyClient) => {
      const result = await client.query<BulkQueryStatusQuery>(await BULK_QUERY_STATUS);
      return result.data.currentBulkOperation;
    },
  }),
];
