import { z } from "zod";
import type { ShopifyClient } from "../client.js";
import type {
  AdjustInventoryMutation,
  AdjustInventoryMutationVariables,
  GetInventoryLevelQuery,
  GetInventoryLevelQueryVariables,
  ListLocationsQuery,
  ListLocationsQueryVariables,
  SetInventoryMutation,
  SetInventoryMutationVariables,
} from "../generated/admin.js";
import { loadNamedOperation } from "../operations/index.js";
import { defineTool, type ToolDefinition } from "./index.js";
import { assertNoUserErrors, expectPresent, notFound, unwrapConnection } from "./shared.js";

const GET_INVENTORY_LEVEL = loadNamedOperation("inventory", "GetInventoryLevel");
const LIST_LOCATIONS = loadNamedOperation("inventory", "ListLocations");
const ADJUST_INVENTORY = loadNamedOperation("inventory", "AdjustInventory");
const SET_INVENTORY = loadNamedOperation("inventory", "SetInventory");

const GetInventoryLevelInput = z.object({
  inventoryItemId: z.string().describe("Shopify inventory item GID to inspect."),
  locationId: z.string().describe("Shopify location GID where the stock level should be read."),
});

const ListLocationsInput = z.object({
  first: z.number().int().min(1).max(250).default(50).describe("Number of locations to return."),
  query: z.string().optional().describe("Optional Shopify search syntax for filtering locations."),
  after: z.string().optional().describe("Cursor for the next page of locations."),
});

const InventoryChangeInput = z.object({
  inventoryItemId: z.string().describe("Shopify inventory item GID to adjust."),
  locationId: z.string().describe("Shopify location GID where the adjustment should happen."),
  delta: z.number().int().describe("Signed inventory delta to apply."),
  ledgerDocumentUri: z
    .string()
    .optional()
    .describe("Optional non-Shopify URI identifying the underlying inventory ledger entry."),
});

const AdjustInventoryInput = z.object({
  name: z
    .string()
    .describe("Inventory quantity state to adjust, for example available, on_hand, or reserved."),
  reason: z.string().describe("Reason code for the adjustment, for example correction or sale."),
  referenceDocumentUri: z
    .string()
    .optional()
    .describe("Optional URI describing the source system or document for the adjustment."),
  changes: z.array(InventoryChangeInput).min(1).describe("Inventory item location deltas to apply."),
});

const InventorySetQuantityInput = z.object({
  inventoryItemId: z.string().describe("Shopify inventory item GID to set."),
  locationId: z.string().describe("Shopify location GID where the quantity should be set."),
  quantity: z.number().int().describe("Absolute on-hand quantity to store."),
});

const SetInventoryInput = z.object({
  reason: z.string().describe("Reason code for setting the on-hand quantity."),
  referenceDocumentUri: z
    .string()
    .optional()
    .describe("Optional URI describing the source system or document for the adjustment."),
  setQuantities: z
    .array(InventorySetQuantityInput)
    .min(1)
    .describe("Inventory item location quantities to set."),
});

export const tools: ToolDefinition[] = [
  defineTool({
    name: "shopify_get_inventory_level",
    description: "Get inventory quantities for a specific inventory item at a location.",
    inputSchema: GetInventoryLevelInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        GetInventoryLevelQuery,
        GetInventoryLevelQueryVariables
      >(await GET_INVENTORY_LEVEL, input);

      if (!result.data.inventoryItem?.inventoryLevel) {
        throw notFound("Inventory level", `${input.inventoryItemId} @ ${input.locationId}`);
      }

      return result.data.inventoryItem.inventoryLevel;
    },
  }),
  defineTool({
    name: "shopify_list_locations",
    description: "List inventory locations with optional search filtering and pagination.",
    inputSchema: ListLocationsInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<ListLocationsQuery, ListLocationsQueryVariables>(
        await LIST_LOCATIONS,
        input,
      );
      const locations = unwrapConnection(result.data.locations);
      return {
        locations: locations.items,
        pageInfo: locations.pageInfo,
      };
    },
  }),
  defineTool({
    name: "shopify_adjust_inventory",
    description: "Adjust inventory quantities by delta using inventoryAdjustQuantities.",
    inputSchema: AdjustInventoryInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        AdjustInventoryMutation,
        AdjustInventoryMutationVariables
      >(await ADJUST_INVENTORY, {
        input: {
          name: input.name,
          reason: input.reason,
          referenceDocumentUri: input.referenceDocumentUri,
          changes: input.changes,
        },
      });
      const payload = expectPresent(
        result.data.inventoryAdjustQuantities,
        "Inventory adjust payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "inventory adjustment");
      return payload.inventoryAdjustmentGroup;
    },
  }),
  defineTool({
    name: "shopify_set_inventory",
    description: "Set absolute on-hand inventory quantities using inventorySetOnHandQuantities.",
    inputSchema: SetInventoryInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<SetInventoryMutation, SetInventoryMutationVariables>(
        await SET_INVENTORY,
        {
          input: {
            reason: input.reason,
            referenceDocumentUri: input.referenceDocumentUri,
            setQuantities: input.setQuantities,
          },
        },
      );
      const payload = expectPresent(
        result.data.inventorySetOnHandQuantities,
        "Inventory set payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "inventory set");
      return payload.inventoryAdjustmentGroup;
    },
  }),
];
