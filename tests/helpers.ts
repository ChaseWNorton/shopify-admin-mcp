import { vi } from "vitest";
import type { ShopifyClient } from "../src/client.js";
import type { ToolDefinition } from "../src/tools/index.js";

export function createMockClient() {
  const query = vi.fn();

  const client = {
    config: {
      store: "test-shop.myshopify.com",
      accessToken: "shpat_test_token",
      apiVersion: "2025-07",
    },
    throttle: {},
    query,
  } as unknown as ShopifyClient;

  return { client, query };
}

export function getTool(tools: ToolDefinition[], name: string): ToolDefinition {
  const tool = tools.find((entry) => entry.name === name);
  if (!tool) {
    throw new Error(`Tool ${name} was not found`);
  }

  return tool;
}

export async function executeTool(
  tool: ToolDefinition,
  client: ShopifyClient,
  input: unknown,
): Promise<unknown> {
  const parsed = tool.inputSchema.parse(input);
  return tool.handler(client, parsed);
}
