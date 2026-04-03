import { z } from "zod";
import type { ShopifyClient } from "../client.js";
import type {
  CancelOrderMutation,
  CancelOrderMutationVariables,
  CloseOrderMutation,
  CloseOrderMutationVariables,
  CompleteDraftOrderMutation,
  CompleteDraftOrderMutationVariables,
  CreateDraftOrderMutation,
  CreateDraftOrderMutationVariables,
  GetOrderQuery,
  GetOrderQueryVariables,
  ListOrdersQuery,
  ListOrdersQueryVariables,
} from "../generated/admin.js";
import { loadNamedOperation } from "../operations/index.js";
import { defineTool, type ToolDefinition } from "./index.js";
import { assertNoUserErrors, expectPresent, notFound, unwrapConnection } from "./shared.js";

const GET_ORDER = loadNamedOperation("orders", "GetOrder");
const LIST_ORDERS = loadNamedOperation("orders", "ListOrders");
const CANCEL_ORDER = loadNamedOperation("orders", "CancelOrder");
const CLOSE_ORDER = loadNamedOperation("orders", "CloseOrder");
const CREATE_DRAFT_ORDER = loadNamedOperation("orders", "CreateDraftOrder");
const COMPLETE_DRAFT_ORDER = loadNamedOperation("orders", "CompleteDraftOrder");

const GetOrderInput = z.object({
  id: z.string().describe("Shopify order GID, for example gid://shopify/Order/123."),
});

const ListOrdersInput = z.object({
  first: z.number().int().min(1).max(250).default(50).describe("Number of orders to return."),
  query: z.string().optional().describe("Optional Shopify search syntax for filtering orders."),
  after: z.string().optional().describe("Cursor for the next page of orders."),
});

const CancelOrderInput = z.object({
  orderId: z.string().describe("Shopify order GID to cancel."),
  reason: z
    .enum(["CUSTOMER", "DECLINED", "FRAUD", "INVENTORY", "OTHER", "STAFF"])
    .describe("Reason for canceling the order."),
  restock: z.boolean().default(false).describe("Whether inventory should be restocked."),
  notifyCustomer: z
    .boolean()
    .optional()
    .describe("Whether Shopify should notify the customer about the cancellation."),
  refundOriginalPayment: z
    .boolean()
    .optional()
    .describe("Whether to refund back to the original payment methods."),
  staffNote: z.string().optional().describe("Optional internal note attached to the cancellation."),
});

const CloseOrderInput = z.object({
  id: z.string().describe("Shopify order GID to close."),
});

const DraftLineItemInput = z.object({
  variantId: z.string().describe("Shopify product variant GID to add to the draft order."),
  quantity: z.number().int().min(1).describe("Quantity for the draft order line item."),
});

const CreateDraftOrderInput = z.object({
  email: z.string().email().optional().describe("Customer email address for the draft order."),
  note: z.string().optional().describe("Merchant-visible note for the draft order."),
  tags: z.array(z.string()).optional().describe("Tags to assign to the draft order."),
  lineItems: z
    .array(DraftLineItemInput)
    .min(1)
    .describe("Product variant line items to include in the draft order."),
});

const CompleteDraftOrderInput = z.object({
  id: z.string().describe("Shopify draft order GID to complete."),
  sourceName: z
    .string()
    .optional()
    .describe("Optional sales channel source name used for attribution."),
});

export const tools: ToolDefinition[] = [
  defineTool({
    name: "shopify_get_order",
    description: "Get a single order by ID with line items, transactions, and fulfillments.",
    inputSchema: GetOrderInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<GetOrderQuery, GetOrderQueryVariables>(await GET_ORDER, {
        id: input.id,
      });
      if (!result.data.order) {
        throw notFound("Order", input.id);
      }

      return result.data.order;
    },
  }),
  defineTool({
    name: "shopify_list_orders",
    description: "List orders with optional Shopify search filtering and pagination.",
    inputSchema: ListOrdersInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<ListOrdersQuery, ListOrdersQueryVariables>(
        await LIST_ORDERS,
        input,
      );
      const orders = unwrapConnection(result.data.orders);
      return {
        orders: orders.items,
        pageInfo: orders.pageInfo,
      };
    },
  }),
  defineTool({
    name: "shopify_cancel_order",
    description: "Cancel an order with an optional refund back to the original payment methods.",
    inputSchema: CancelOrderInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<CancelOrderMutation, CancelOrderMutationVariables>(
        await CANCEL_ORDER,
        {
          orderId: input.orderId,
          reason: input.reason,
          restock: input.restock,
          notifyCustomer: input.notifyCustomer,
          staffNote: input.staffNote,
          refundMethod: input.refundOriginalPayment
            ? { originalPaymentMethodsRefund: true }
            : undefined,
        },
      );
      const payload = expectPresent(
        result.data.orderCancel,
        "Order cancel payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.orderCancelUserErrors, "order cancellation");
      return payload;
    },
  }),
  defineTool({
    name: "shopify_close_order",
    description: "Close an open order by ID.",
    inputSchema: CloseOrderInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<CloseOrderMutation, CloseOrderMutationVariables>(
        await CLOSE_ORDER,
        { input },
      );
      const payload = expectPresent(
        result.data.orderClose,
        "Order close payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "order close");

      if (!payload.order) {
        throw notFound("Order", input.id);
      }

      return payload.order;
    },
  }),
  defineTool({
    name: "shopify_create_draft_order",
    description: "Create a draft order from product variant line items.",
    inputSchema: CreateDraftOrderInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        CreateDraftOrderMutation,
        CreateDraftOrderMutationVariables
      >(await CREATE_DRAFT_ORDER, {
        input: {
          email: input.email,
          note: input.note,
          tags: input.tags,
          lineItems: input.lineItems,
        },
      });
      const payload = expectPresent(
        result.data.draftOrderCreate,
        "Draft order create payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "draft order creation");

      if (!payload.draftOrder) {
        throw new Error("Draft order was not returned by Shopify.");
      }

      return payload.draftOrder;
    },
  }),
  defineTool({
    name: "shopify_complete_draft_order",
    description: "Convert a draft order into a completed order.",
    inputSchema: CompleteDraftOrderInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        CompleteDraftOrderMutation,
        CompleteDraftOrderMutationVariables
      >(await COMPLETE_DRAFT_ORDER, input);
      const payload = expectPresent(
        result.data.draftOrderComplete,
        "Draft order complete payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "draft order completion");

      if (!payload.draftOrder) {
        throw notFound("Draft order", input.id);
      }

      return payload.draftOrder;
    },
  }),
];
