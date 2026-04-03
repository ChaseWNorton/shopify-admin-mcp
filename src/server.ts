import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { type ShopifyClient } from "./client.js";
import { toErrorResponse } from "./errors.js";
import { loadAllTools } from "./tools/index.js";

export async function createShopifyMcpServer(client: ShopifyClient): Promise<McpServer> {
  const server = new McpServer({
    name: "shopify-admin-mcp",
    version: "0.1.0",
  });

  const tools = await loadAllTools();

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
      },
      async (input): Promise<CallToolResult> => {
        try {
          const result = await tool.handler(client, input);
          return {
            content: [
              {
                type: "text",
                text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          const response = toErrorResponse(error);
          logError(`${tool.name}: ${response.message}`);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(response, null, 2),
              },
            ],
            isError: true,
          };
        }
      },
    );
  }

  return server;
}

export function logError(message: string): void {
  process.stderr.write(`${message}\n`);
}
