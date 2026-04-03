import { z } from "zod";
import type { ShopifyClient } from "../client.js";
import type {
  DeleteMetafieldsMutation,
  DeleteMetafieldsMutationVariables,
  GetMetafieldsQuery,
  GetMetafieldsQueryVariables,
  ListMetafieldDefinitionsQuery,
  ListMetafieldDefinitionsQueryVariables,
  SetMetafieldsMutation,
  SetMetafieldsMutationVariables,
} from "../generated/admin.js";
import { loadNamedOperation } from "../operations/index.js";
import { defineTool, type ToolDefinition } from "./index.js";
import { assertNoUserErrors, expectPresent } from "./shared.js";

const GET_METAFIELDS = loadNamedOperation("metafields", "GetMetafields");
const LIST_METAFIELD_DEFINITIONS = loadNamedOperation("metafields", "ListMetafieldDefinitions");
const SET_METAFIELDS = loadNamedOperation("metafields", "SetMetafields");
const DELETE_METAFIELDS = loadNamedOperation("metafields", "DeleteMetafields");

const GetMetafieldsInput = z.object({
  ownerId: z.string().describe("Shopify resource GID that owns the metafields."),
  first: z.number().int().min(1).max(250).default(50).describe("Number of metafields to return."),
  after: z.string().optional().describe("Cursor for the next page of metafields."),
  namespace: z.string().optional().describe("Optional metafield namespace filter."),
  keys: z.array(z.string()).optional().describe("Optional metafield keys to fetch within the namespace."),
});

const SetMetafieldEntryInput = z.object({
  ownerId: z.string().describe("Shopify resource GID that owns the metafield."),
  namespace: z.string().optional().describe("Metafield namespace. Omit for app-reserved namespace."),
  key: z.string().describe("Metafield key."),
  type: z.string().optional().describe("Metafield type, required when no definition exists."),
  value: z.string().describe("Metafield value stored as a string."),
  compareDigest: z
    .string()
    .optional()
    .describe("Optional compare digest for safe metafield updates."),
});

const SetMetafieldsInput = z.object({
  metafields: z.array(SetMetafieldEntryInput).min(1).describe("Metafield values to upsert."),
});

const DeleteMetafieldEntryInput = z.object({
  ownerId: z.string().describe("Shopify resource GID that owns the metafield."),
  namespace: z.string().describe("Metafield namespace."),
  key: z.string().describe("Metafield key."),
});

const DeleteMetafieldsInput = z.object({
  metafields: z.array(DeleteMetafieldEntryInput).min(1).describe("Metafield identifiers to delete."),
});

const ListMetafieldDefinitionsInput = z.object({
  ownerType: z
    .string()
    .describe("Metafield owner type enum, for example PRODUCT, ORDER, CUSTOMER, or SHOP."),
  first: z
    .number()
    .int()
    .min(1)
    .max(250)
    .default(50)
    .describe("Number of metafield definitions to return."),
  after: z.string().optional().describe("Cursor for the next page of metafield definitions."),
  namespace: z.string().optional().describe("Optional namespace filter for metafield definitions."),
});

export const tools: ToolDefinition[] = [
  defineTool({
    name: "shopify_get_metafields",
    description: "Get metafields for any Shopify resource that implements HasMetafields.",
    inputSchema: GetMetafieldsInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<GetMetafieldsQuery, GetMetafieldsQueryVariables>(
        await GET_METAFIELDS,
        input,
      );
      const node = result.data.node as
        | {
            id: string;
            metafields?: {
              edges: Array<{
                node: {
                  id: string;
                  namespace: string;
                  key: string;
                  value: string;
                  type: string;
                  compareDigest?: string | null;
                  updatedAt: string;
                };
              }>;
              pageInfo: { hasNextPage: boolean; endCursor?: string | null };
            };
          }
        | null
        | undefined;
      const metafieldsConnection = node?.metafields;
      return {
        ownerId: node?.id ?? input.ownerId,
        metafields: metafieldsConnection?.edges.map((edge) => edge.node) ?? [],
        pageInfo: metafieldsConnection?.pageInfo ?? { hasNextPage: false, endCursor: null },
      };
    },
  }),
  defineTool({
    name: "shopify_set_metafields",
    description: "Upsert metafields using metafieldsSet.",
    inputSchema: SetMetafieldsInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<SetMetafieldsMutation, SetMetafieldsMutationVariables>(
        await SET_METAFIELDS,
        input,
      );
      const payload = expectPresent(
        result.data.metafieldsSet,
        "Metafields set payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "metafields set");
      return payload.metafields ?? [];
    },
  }),
  defineTool({
    name: "shopify_delete_metafield",
    description: "Delete one or more metafields by owner, namespace, and key.",
    inputSchema: DeleteMetafieldsInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        DeleteMetafieldsMutation,
        DeleteMetafieldsMutationVariables
      >(await DELETE_METAFIELDS, input);
      const payload = expectPresent(
        result.data.metafieldsDelete,
        "Metafields delete payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "metafields delete");
      return payload.deletedMetafields ?? [];
    },
  }),
  defineTool({
    name: "shopify_list_metafield_definitions",
    description: "List metafield definitions for a Shopify owner type.",
    inputSchema: ListMetafieldDefinitionsInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        ListMetafieldDefinitionsQuery,
        ListMetafieldDefinitionsQueryVariables
      >(await LIST_METAFIELD_DEFINITIONS, {
        ownerType: input.ownerType as ListMetafieldDefinitionsQueryVariables["ownerType"],
        first: input.first,
        after: input.after,
        namespace: input.namespace,
      });

      return {
        definitions: result.data.metafieldDefinitions.edges.map((edge) => edge.node),
        pageInfo: result.data.metafieldDefinitions.pageInfo,
      };
    },
  }),
];
