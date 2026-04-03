import { z } from "zod";
import type { ShopifyClient } from "../client.js";
import type {
  CreateFulfillmentMutation,
  CreateFulfillmentMutationVariables,
  ListFulfillmentOrdersQuery,
  ListFulfillmentOrdersQueryVariables,
} from "../generated/admin.js";
import { loadNamedOperation } from "../operations/index.js";
import { defineTool, type ToolDefinition } from "./index.js";
import { assertNoUserErrors, expectPresent, notFound, unwrapConnection } from "./shared.js";

const LIST_FULFILLMENT_ORDERS = loadNamedOperation("fulfillment", "ListFulfillmentOrders");
const CREATE_FULFILLMENT = loadNamedOperation("fulfillment", "CreateFulfillment");

const ListFulfillmentOrdersInput = z.object({
  orderId: z.string().describe("Shopify order GID whose fulfillment orders should be listed."),
  first: z.number().int().min(1).max(250).default(50).describe("Number of fulfillment orders to return."),
  after: z.string().optional().describe("Cursor for the next page of fulfillment orders."),
});

const FulfillmentOrderLineItemInput = z.object({
  id: z.string().describe("Shopify fulfillment order line item GID."),
  quantity: z.number().int().min(1).describe("Quantity to fulfill for the line item."),
});

const LineItemsByFulfillmentOrderInput = z.object({
  fulfillmentOrderId: z.string().describe("Shopify fulfillment order GID."),
  fulfillmentOrderLineItems: z
    .array(FulfillmentOrderLineItemInput)
    .optional()
    .describe("Specific fulfillment order line items to fulfill. Omit to fulfill all remaining lines."),
});

const TrackingInfoInput = z.object({
  company: z.string().optional().describe("Carrier or logistics company name."),
  number: z.string().optional().describe("Tracking number to attach to the fulfillment."),
  url: z.string().url().optional().describe("Tracking URL to attach to the fulfillment."),
});

const CreateFulfillmentInput = z.object({
  lineItemsByFulfillmentOrder: z
    .array(LineItemsByFulfillmentOrderInput)
    .min(1)
    .describe("Fulfillment orders and optional line items to fulfill."),
  notifyCustomer: z.boolean().optional().describe("Whether Shopify should notify the customer."),
  message: z.string().optional().describe("Optional merchant note to associate with the fulfillment."),
  trackingInfo: TrackingInfoInput.optional().describe("Optional tracking information for the fulfillment."),
});

export const tools: ToolDefinition[] = [
  defineTool({
    name: "shopify_list_fulfillment_orders",
    description: "List fulfillment orders associated with an order.",
    inputSchema: ListFulfillmentOrdersInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        ListFulfillmentOrdersQuery,
        ListFulfillmentOrdersQueryVariables
      >(await LIST_FULFILLMENT_ORDERS, input);

      if (!result.data.order) {
        throw notFound("Order", input.orderId);
      }

      const fulfillmentOrders = unwrapConnection(result.data.order.fulfillmentOrders);
      return {
        orderId: result.data.order.id,
        fulfillmentOrders: fulfillmentOrders.items,
        pageInfo: fulfillmentOrders.pageInfo,
      };
    },
  }),
  defineTool({
    name: "shopify_create_fulfillment",
    description: "Create a fulfillment for selected fulfillment order line items.",
    inputSchema: CreateFulfillmentInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        CreateFulfillmentMutation,
        CreateFulfillmentMutationVariables
      >(await CREATE_FULFILLMENT, {
        fulfillment: {
          lineItemsByFulfillmentOrder: input.lineItemsByFulfillmentOrder,
          notifyCustomer: input.notifyCustomer,
          trackingInfo: input.trackingInfo,
        },
        message: input.message,
      });
      const payload = expectPresent(
        result.data.fulfillmentCreateV2,
        "Fulfillment create payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "fulfillment creation");

      if (!payload.fulfillment) {
        throw new Error("Fulfillment was not returned by Shopify.");
      }

      return payload.fulfillment;
    },
  }),
];
