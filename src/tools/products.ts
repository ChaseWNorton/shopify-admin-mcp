import { z } from "zod";
import type { ShopifyClient } from "../client.js";
import type {
  CreateProductMutation,
  CreateProductMutationVariables,
  DeleteProductMutation,
  DeleteProductMutationVariables,
  GetProductQuery,
  GetProductQueryVariables,
  ListProductVariantsQuery,
  ListProductVariantsQueryVariables,
  ListProductsQuery,
  ListProductsQueryVariables,
  UpdateProductMutation,
  UpdateProductMutationVariables,
  UpdateVariantMutation,
  UpdateVariantMutationVariables,
} from "../generated/admin.js";
import { loadNamedOperation } from "../operations/index.js";
import { defineTool, type ToolDefinition } from "./index.js";
import { assertNoUserErrors, expectPresent, notFound, unwrapConnection } from "./shared.js";

const GET_PRODUCT = loadNamedOperation("products", "GetProduct");
const LIST_PRODUCTS = loadNamedOperation("products", "ListProducts");
const LIST_PRODUCT_VARIANTS = loadNamedOperation("products", "ListProductVariants");
const CREATE_PRODUCT = loadNamedOperation("products", "CreateProduct");
const UPDATE_PRODUCT = loadNamedOperation("products", "UpdateProduct");
const DELETE_PRODUCT = loadNamedOperation("products", "DeleteProduct");
const UPDATE_VARIANT = loadNamedOperation("products", "UpdateVariant");

const GetProductInput = z.object({
  id: z.string().describe("Shopify product GID, for example gid://shopify/Product/123."),
});

const ListProductsInput = z.object({
  first: z.number().int().min(1).max(250).default(50).describe("Number of products to return."),
  query: z.string().optional().describe("Optional Shopify search syntax for filtering products."),
  after: z.string().optional().describe("Cursor for the next page of products."),
});

const CreateProductInput = z.object({
  title: z.string().describe("Product title shown to customers."),
  handle: z.string().optional().describe("Optional custom product handle."),
  descriptionHtml: z.string().optional().describe("HTML description for the product."),
  vendor: z.string().optional().describe("Merchant-defined product vendor."),
  productType: z.string().optional().describe("Merchant-defined product type."),
  tags: z.array(z.string()).optional().describe("List of product tags."),
  status: z
    .enum(["ACTIVE", "DRAFT", "ARCHIVED"])
    .optional()
    .describe("Product lifecycle status."),
});

const UpdateProductInput = CreateProductInput.extend({
  id: z.string().describe("Shopify product GID to update."),
});

const DeleteProductInput = z.object({
  id: z.string().describe("Shopify product GID to delete."),
});

const ListProductVariantsInput = z.object({
  productId: z.string().describe("Shopify product GID whose variants should be listed."),
  first: z.number().int().min(1).max(250).default(50).describe("Number of variants to return."),
  after: z.string().optional().describe("Cursor for the next page of variants."),
});

const UpdateVariantInput = z.object({
  productId: z.string().describe("Shopify product GID that owns the variant."),
  variantId: z.string().describe("Shopify product variant GID to update."),
  price: z.number().optional().describe("New variant price in shop currency."),
  sku: z.string().optional().describe("Updated SKU for the variant."),
  inventoryPolicy: z
    .enum(["CONTINUE", "DENY"])
    .optional()
    .describe("Whether the variant can continue selling when out of stock."),
  taxable: z.boolean().optional().describe("Whether the variant is taxable."),
});

export const tools: ToolDefinition[] = [
  defineTool({
    name: "shopify_get_product",
    description: "Get a single product by ID with its variants, media, and metafields.",
    inputSchema: GetProductInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<GetProductQuery, GetProductQueryVariables>(
        await GET_PRODUCT,
        { id: input.id },
      );

      if (!result.data.product) {
        throw notFound("Product", input.id);
      }

      return result.data.product;
    },
  }),
  defineTool({
    name: "shopify_list_products",
    description: "List products with optional search filtering and cursor pagination.",
    inputSchema: ListProductsInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<ListProductsQuery, ListProductsQueryVariables>(
        await LIST_PRODUCTS,
        input,
      );
      const products = unwrapConnection(result.data.products);
      return {
        products: products.items,
        pageInfo: products.pageInfo,
      };
    },
  }),
  defineTool({
    name: "shopify_create_product",
    description: "Create a product with core merchandising fields.",
    inputSchema: CreateProductInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<CreateProductMutation, CreateProductMutationVariables>(
        await CREATE_PRODUCT,
        { product: input },
      );
      const payload = expectPresent(
        result.data.productCreate,
        "Product create payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "product creation");

      if (!payload.product) {
        throw notFound("Created product", input.title);
      }

      return payload.product;
    },
  }),
  defineTool({
    name: "shopify_update_product",
    description: "Update an existing product's merchandising fields.",
    inputSchema: UpdateProductInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<UpdateProductMutation, UpdateProductMutationVariables>(
        await UPDATE_PRODUCT,
        { product: input },
      );
      const payload = expectPresent(
        result.data.productUpdate,
        "Product update payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "product update");

      if (!payload.product) {
        throw notFound("Updated product", input.id);
      }

      return payload.product;
    },
  }),
  defineTool({
    name: "shopify_delete_product",
    description: "Delete a product by ID.",
    inputSchema: DeleteProductInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<DeleteProductMutation, DeleteProductMutationVariables>(
        await DELETE_PRODUCT,
        { input },
      );
      const payload = expectPresent(
        result.data.productDelete,
        "Product delete payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "product deletion");
      return payload;
    },
  }),
  defineTool({
    name: "shopify_list_product_variants",
    description: "List variants for a product with cursor pagination.",
    inputSchema: ListProductVariantsInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        ListProductVariantsQuery,
        ListProductVariantsQueryVariables
      >(await LIST_PRODUCT_VARIANTS, {
        id: input.productId,
        first: input.first,
        after: input.after,
      });

      if (!result.data.product) {
        throw notFound("Product", input.productId);
      }

      const variants = unwrapConnection(result.data.product.variants);
      return {
        productId: result.data.product.id,
        variants: variants.items,
        pageInfo: variants.pageInfo,
      };
    },
  }),
  defineTool({
    name: "shopify_update_variant",
    description: "Update a single product variant's price, SKU, or inventory policy.",
    inputSchema: UpdateVariantInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<UpdateVariantMutation, UpdateVariantMutationVariables>(
        await UPDATE_VARIANT,
        {
          productId: input.productId,
          variants: [
            {
              id: input.variantId,
              price: input.price,
              inventoryItem: input.sku ? { sku: input.sku } : undefined,
              inventoryPolicy: input.inventoryPolicy,
              taxable: input.taxable,
            },
          ],
        },
      );
      const payload = expectPresent(
        result.data.productVariantsBulkUpdate,
        "Variant update payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "variant update");
      return payload.productVariants ?? [];
    },
  }),
];
