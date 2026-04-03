import { z } from "zod";
import type { ShopifyClient } from "../client.js";
import type {
  AddProductsToCollectionMutation,
  AddProductsToCollectionMutationVariables,
  CreateCollectionMutation,
  CreateCollectionMutationVariables,
  GetCollectionQuery,
  GetCollectionQueryVariables,
  ListCollectionsQuery,
  ListCollectionsQueryVariables,
  RemoveProductsFromCollectionMutation,
  RemoveProductsFromCollectionMutationVariables,
} from "../generated/admin.js";
import { loadNamedOperation } from "../operations/index.js";
import { defineTool, type ToolDefinition } from "./index.js";
import { assertNoUserErrors, expectPresent, notFound, unwrapConnection } from "./shared.js";

const GET_COLLECTION = loadNamedOperation("collections", "GetCollection");
const LIST_COLLECTIONS = loadNamedOperation("collections", "ListCollections");
const CREATE_COLLECTION = loadNamedOperation("collections", "CreateCollection");
const ADD_PRODUCTS = loadNamedOperation("collections", "AddProductsToCollection");
const REMOVE_PRODUCTS = loadNamedOperation("collections", "RemoveProductsFromCollection");

const GetCollectionInput = z.object({
  id: z.string().describe("Shopify collection GID to fetch."),
  productFirst: z
    .number()
    .int()
    .min(1)
    .max(250)
    .default(50)
    .describe("Number of products to include from the collection."),
  after: z.string().optional().describe("Cursor for the next page of collection products."),
});

const ListCollectionsInput = z.object({
  first: z.number().int().min(1).max(250).default(50).describe("Number of collections to return."),
  query: z.string().optional().describe("Optional Shopify search syntax for filtering collections."),
  after: z.string().optional().describe("Cursor for the next page of collections."),
});

const CreateCollectionInput = z.object({
  title: z.string().describe("Title for the new manual collection."),
  handle: z.string().optional().describe("Optional custom collection handle."),
  descriptionHtml: z.string().optional().describe("HTML description for the collection."),
  productIds: z.array(z.string()).optional().describe("Optional initial product IDs for the collection."),
  sortOrder: z.string().optional().describe("Optional collection sort order enum value."),
});

const ModifyCollectionProductsInput = z.object({
  id: z.string().describe("Shopify collection GID to modify."),
  productIds: z.array(z.string()).min(1).describe("Product GIDs to add or remove."),
});

export const tools: ToolDefinition[] = [
  defineTool({
    name: "shopify_get_collection",
    description: "Get a collection by ID with a page of its products.",
    inputSchema: GetCollectionInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<GetCollectionQuery, GetCollectionQueryVariables>(
        await GET_COLLECTION,
        input,
      );
      if (!result.data.collection) {
        throw notFound("Collection", input.id);
      }

      return result.data.collection;
    },
  }),
  defineTool({
    name: "shopify_list_collections",
    description: "List collections with optional search filtering and pagination.",
    inputSchema: ListCollectionsInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<ListCollectionsQuery, ListCollectionsQueryVariables>(
        await LIST_COLLECTIONS,
        input,
      );
      const collections = unwrapConnection(result.data.collections);
      return {
        collections: collections.items,
        pageInfo: collections.pageInfo,
      };
    },
  }),
  defineTool({
    name: "shopify_create_collection",
    description: "Create a manual collection.",
    inputSchema: CreateCollectionInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        CreateCollectionMutation,
        CreateCollectionMutationVariables
      >(await CREATE_COLLECTION, {
        input: {
          title: input.title,
          handle: input.handle,
          descriptionHtml: input.descriptionHtml,
          products: input.productIds,
          sortOrder: input.sortOrder as CreateCollectionMutationVariables["input"]["sortOrder"],
        },
      });
      const payload = expectPresent(
        result.data.collectionCreate,
        "Collection create payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "collection creation");

      if (!payload.collection) {
        throw new Error("Collection was not returned by Shopify.");
      }

      return payload.collection;
    },
  }),
  defineTool({
    name: "shopify_add_products_to_collection",
    description: "Add products to an existing collection.",
    inputSchema: ModifyCollectionProductsInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        AddProductsToCollectionMutation,
        AddProductsToCollectionMutationVariables
      >(await ADD_PRODUCTS, input);
      const payload = expectPresent(
        result.data.collectionAddProducts,
        "Collection add-products payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "collection add products");
      return payload.collection;
    },
  }),
  defineTool({
    name: "shopify_remove_products_from_collection",
    description: "Remove products from an existing collection.",
    inputSchema: ModifyCollectionProductsInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        RemoveProductsFromCollectionMutation,
        RemoveProductsFromCollectionMutationVariables
      >(await REMOVE_PRODUCTS, input);
      const payload = expectPresent(
        result.data.collectionRemoveProducts,
        "Collection remove-products payload was not returned by Shopify.",
      );
      assertNoUserErrors(
        payload.userErrors,
        "collection remove products",
      );
      return payload;
    },
  }),
];
