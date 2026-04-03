import { z } from "zod";
import type { ShopifyClient } from "../client.js";
import type {
  CreateWebhookMutation,
  CreateWebhookMutationVariables,
  DeleteWebhookMutation,
  DeleteWebhookMutationVariables,
  ListWebhooksQuery,
  ListWebhooksQueryVariables,
} from "../generated/admin.js";
import { loadNamedOperation } from "../operations/index.js";
import { defineTool, type ToolDefinition } from "./index.js";
import { assertNoUserErrors, expectPresent, unwrapConnection } from "./shared.js";

const LIST_WEBHOOKS = loadNamedOperation("webhooks", "ListWebhooks");
const CREATE_WEBHOOK = loadNamedOperation("webhooks", "CreateWebhook");
const DELETE_WEBHOOK = loadNamedOperation("webhooks", "DeleteWebhook");

const ListWebhooksInput = z.object({
  first: z.number().int().min(1).max(250).default(50).describe("Number of webhook subscriptions to return."),
  after: z.string().optional().describe("Cursor for the next page of webhook subscriptions."),
  query: z.string().optional().describe("Optional Shopify search syntax for filtering webhook subscriptions."),
  topics: z.array(z.string()).optional().describe("Optional webhook topic enums to filter by."),
});

const CreateWebhookInput = z.object({
  topic: z.string().describe("Webhook topic enum, for example ORDERS_CREATE."),
  format: z.enum(["JSON", "XML"]).optional().describe("Webhook payload format."),
  filter: z.string().optional().describe("Optional webhook filter using Shopify search syntax."),
  includeFields: z.array(z.string()).optional().describe("Fields to include in the webhook payload."),
  metafieldNamespaces: z.array(z.string()).optional().describe("Metafield namespaces to include in the webhook payload."),
});

const DeleteWebhookInput = z.object({
  id: z.string().describe("Shopify webhook subscription GID to delete."),
});

export const tools: ToolDefinition[] = [
  defineTool({
    name: "shopify_list_webhooks",
    description: "List webhook subscriptions with cursor pagination.",
    inputSchema: ListWebhooksInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<ListWebhooksQuery, ListWebhooksQueryVariables>(
        await LIST_WEBHOOKS,
        {
          ...input,
          topics: input.topics as ListWebhooksQueryVariables["topics"],
        },
      );
      const webhooks = unwrapConnection(result.data.webhookSubscriptions);
      return {
        webhooks: webhooks.items,
        pageInfo: webhooks.pageInfo,
      };
    },
  }),
  defineTool({
    name: "shopify_create_webhook",
    description: "Create a webhook subscription for the app's configured delivery endpoint.",
    inputSchema: CreateWebhookInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<CreateWebhookMutation, CreateWebhookMutationVariables>(
        await CREATE_WEBHOOK,
        {
          topic: input.topic as CreateWebhookMutationVariables["topic"],
          webhookSubscription: {
            format: input.format,
            filter: input.filter,
            includeFields: input.includeFields,
            metafieldNamespaces: input.metafieldNamespaces,
          },
        },
      );
      const payload = expectPresent(
        result.data.webhookSubscriptionCreate,
        "Webhook create payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "webhook creation");
      return payload.webhookSubscription;
    },
  }),
  defineTool({
    name: "shopify_delete_webhook",
    description: "Delete a webhook subscription by ID.",
    inputSchema: DeleteWebhookInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<DeleteWebhookMutation, DeleteWebhookMutationVariables>(
        await DELETE_WEBHOOK,
        input,
      );
      const payload = expectPresent(
        result.data.webhookSubscriptionDelete,
        "Webhook delete payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "webhook deletion");
      return payload;
    },
  }),
];
