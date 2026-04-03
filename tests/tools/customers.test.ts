import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools/customers.js";
import { createMockClient, executeTool, getTool } from "../helpers.js";

describe("customers tools", () => {
  it("gets a customer", async () => {
    const tool = getTool(tools, "shopify_get_customer");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        customer: { id: "gid://shopify/Customer/1", email: "person@example.com" },
      },
    });

    await expect(executeTool(tool, client, { id: "gid://shopify/Customer/1" })).resolves.toEqual(
      { id: "gid://shopify/Customer/1", email: "person@example.com" },
    );
  });

  it("surfaces customer mutation user errors", async () => {
    const tool = getTool(tools, "shopify_create_customer");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        customerCreate: {
          customer: null,
          userErrors: [{ field: ["email"], message: "Email has already been taken" }],
        },
      },
    });

    await expect(
      executeTool(tool, client, { email: "person@example.com" }),
    ).rejects.toThrow("Shopify customer creation failed");
  });

  it("validates list customer input", () => {
    const tool = getTool(tools, "shopify_list_customers");
    expect(() => tool.inputSchema.parse({ first: 999 })).toThrow();
  });
});
