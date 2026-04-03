import { z } from "zod";
import type { ShopifyClient } from "../client.js";
import type {
  CreateCustomerMutation,
  CreateCustomerMutationVariables,
  GetCustomerQuery,
  GetCustomerQueryVariables,
  ListCustomersQuery,
  ListCustomersQueryVariables,
  UpdateCustomerMutation,
  UpdateCustomerMutationVariables,
} from "../generated/admin.js";
import { loadNamedOperation } from "../operations/index.js";
import { defineTool, type ToolDefinition } from "./index.js";
import { assertNoUserErrors, expectPresent, notFound, unwrapConnection } from "./shared.js";

const GET_CUSTOMER = loadNamedOperation("customers", "GetCustomer");
const LIST_CUSTOMERS = loadNamedOperation("customers", "ListCustomers");
const CREATE_CUSTOMER = loadNamedOperation("customers", "CreateCustomer");
const UPDATE_CUSTOMER = loadNamedOperation("customers", "UpdateCustomer");

const GetCustomerInput = z.object({
  id: z.string().describe("Shopify customer GID, for example gid://shopify/Customer/123."),
});

const ListCustomersInput = z.object({
  first: z.number().int().min(1).max(250).default(50).describe("Number of customers to return."),
  query: z.string().optional().describe("Optional Shopify search syntax for filtering customers."),
  after: z.string().optional().describe("Cursor for the next page of customers."),
});

const CreateCustomerInput = z.object({
  firstName: z.string().optional().describe("Customer first name."),
  lastName: z.string().optional().describe("Customer last name."),
  email: z.string().email().optional().describe("Unique customer email address."),
  phone: z.string().optional().describe("Unique customer phone number."),
  tags: z.array(z.string()).optional().describe("Tags to assign to the customer."),
  taxExempt: z.boolean().optional().describe("Whether the customer is tax exempt."),
  note: z.string().optional().describe("Internal merchant note for the customer."),
});

const UpdateCustomerInput = CreateCustomerInput.extend({
  id: z.string().describe("Shopify customer GID to update."),
});

export const tools: ToolDefinition[] = [
  defineTool({
    name: "shopify_get_customer",
    description: "Get a single customer by ID with orders, addresses, and metafields.",
    inputSchema: GetCustomerInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<GetCustomerQuery, GetCustomerQueryVariables>(
        await GET_CUSTOMER,
        { id: input.id },
      );
      if (!result.data.customer) {
        throw notFound("Customer", input.id);
      }

      return result.data.customer;
    },
  }),
  defineTool({
    name: "shopify_list_customers",
    description: "List customers with optional search filtering and cursor pagination.",
    inputSchema: ListCustomersInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<ListCustomersQuery, ListCustomersQueryVariables>(
        await LIST_CUSTOMERS,
        input,
      );
      const customers = unwrapConnection(result.data.customers);
      return {
        customers: customers.items,
        pageInfo: customers.pageInfo,
      };
    },
  }),
  defineTool({
    name: "shopify_create_customer",
    description: "Create a customer with contact details, tags, and tax settings.",
    inputSchema: CreateCustomerInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<CreateCustomerMutation, CreateCustomerMutationVariables>(
        await CREATE_CUSTOMER,
        { input },
      );
      const payload = expectPresent(
        result.data.customerCreate,
        "Customer create payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "customer creation");

      if (!payload.customer) {
        throw new Error("Customer was not returned by Shopify.");
      }

      return payload.customer;
    },
  }),
  defineTool({
    name: "shopify_update_customer",
    description: "Update a customer's profile, tags, or tax settings.",
    inputSchema: UpdateCustomerInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<UpdateCustomerMutation, UpdateCustomerMutationVariables>(
        await UPDATE_CUSTOMER,
        { input },
      );
      const payload = expectPresent(
        result.data.customerUpdate,
        "Customer update payload was not returned by Shopify.",
      );
      assertNoUserErrors(payload.userErrors, "customer update");

      if (!payload.customer) {
        throw notFound("Customer", input.id);
      }

      return payload.customer;
    },
  }),
];
