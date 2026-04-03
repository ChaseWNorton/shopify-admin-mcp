import { z } from "zod";
import type { ShopifyClient } from "../client.js";
import type {
  CreateBasicDiscountMutation,
  CreateBasicDiscountMutationVariables,
  DeleteDiscountMutation,
  DeleteDiscountMutationVariables,
  ListDiscountsQuery,
  ListDiscountsQueryVariables,
} from "../generated/admin.js";
import { loadNamedOperation } from "../operations/index.js";
import { defineTool, type ToolDefinition } from "./index.js";
import { assertNoUserErrors, expectPresent, unwrapConnection } from "./shared.js";

const LIST_DISCOUNTS = loadNamedOperation("discounts", "ListDiscounts");
const CREATE_BASIC_DISCOUNT = loadNamedOperation("discounts", "CreateBasicDiscount");
const DELETE_DISCOUNT = loadNamedOperation("discounts", "DeleteDiscount");

const ListDiscountsInput = z.object({
  first: z.number().int().min(1).max(250).default(50).describe("Number of discounts to return."),
  query: z.string().optional().describe("Optional Shopify search syntax for filtering discounts."),
  after: z.string().optional().describe("Cursor for the next page of discounts."),
});

const CreateBasicDiscountInput = z.object({
  title: z.string().describe("Merchant-visible discount title."),
  code: z.string().describe("Discount code that customers enter at checkout."),
  discountType: z
    .enum(["PERCENTAGE", "FIXED_AMOUNT"])
    .describe("Whether the discount value is a percentage or a fixed amount."),
  value: z.number().positive().describe("Discount value. Use 0-1 for percentage discounts."),
  startsAt: z.string().describe("ISO-8601 timestamp when the discount becomes active."),
  endsAt: z.string().optional().describe("Optional ISO-8601 timestamp when the discount expires."),
  appliesOncePerCustomer: z
    .boolean()
    .optional()
    .describe("Whether a customer can only use the discount once."),
  usageLimit: z.number().int().positive().optional().describe("Optional maximum total redemption count."),
  minimumSubtotal: z
    .number()
    .positive()
    .optional()
    .describe("Optional minimum order subtotal required for the discount."),
  minimumQuantity: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Optional minimum item quantity required for the discount."),
});

const DeleteDiscountInput = z.object({
  id: z.string().describe("Shopify discount node GID to delete."),
});

export const tools: ToolDefinition[] = [
  defineTool({
    name: "shopify_list_discounts",
    description: "List discount nodes with cursor pagination.",
    inputSchema: ListDiscountsInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<ListDiscountsQuery, ListDiscountsQueryVariables>(
        await LIST_DISCOUNTS,
        input,
      );
      const discounts = unwrapConnection(result.data.discountNodes);
      return {
        discounts: discounts.items,
        pageInfo: discounts.pageInfo,
      };
    },
  }),
  defineTool({
    name: "shopify_create_basic_discount",
    description: "Create a basic percentage or fixed-amount discount code.",
    inputSchema: CreateBasicDiscountInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<
        CreateBasicDiscountMutation,
        CreateBasicDiscountMutationVariables
      >(await CREATE_BASIC_DISCOUNT, {
        basicCodeDiscount: {
          title: input.title,
          code: input.code,
          appliesOncePerCustomer: input.appliesOncePerCustomer,
          usageLimit: input.usageLimit,
          startsAt: input.startsAt,
          endsAt: input.endsAt,
          customerGets: {
            items: { all: true },
            value:
              input.discountType === "PERCENTAGE"
                ? { percentage: input.value }
                : {
                    discountAmount: {
                      amount: input.value,
                      appliesOnEachItem: false,
                    },
                  },
          },
          minimumRequirement:
            input.minimumSubtotal !== undefined
              ? {
                  subtotal: {
                    greaterThanOrEqualToSubtotal: input.minimumSubtotal,
                  },
                }
              : input.minimumQuantity !== undefined
                ? {
                    quantity: {
                      greaterThanOrEqualToQuantity: input.minimumQuantity,
                    },
                  }
                : undefined,
        },
      });
      const payload = expectPresent(
        result.data.discountCodeBasicCreate,
        "Discount create payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "discount creation");
      return payload.codeDiscountNode;
    },
  }),
  defineTool({
    name: "shopify_delete_discount",
    description: "Delete a discount code discount by ID.",
    inputSchema: DeleteDiscountInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<DeleteDiscountMutation, DeleteDiscountMutationVariables>(
        await DELETE_DISCOUNT,
        input,
      );
      const payload = expectPresent(
        result.data.discountCodeDelete,
        "Discount delete payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "discount deletion");
      return payload;
    },
  }),
];
