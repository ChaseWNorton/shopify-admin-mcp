#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildGraphqlEndpoint, loadAuthConfig, redactAuthError } from "./auth.js";
import { createShopifyClient, type ShopifyClient } from "./client.js";
import { ShopifyMcpError } from "./errors.js";
import { logError, createShopifyMcpServer } from "./server.js";
import { ThrottleManager } from "./throttle.js";

async function main(): Promise<void> {
  const client = buildClientFromEnvironment();

  const server = await createShopifyMcpServer(client);
  const transport = new StdioServerTransport();

  await server.connect(transport);
  logStartup(client);
}

main().catch((error) => {
  try {
    const auth = loadAuthConfig();
    logError(redactAuthError(error, auth));
  } catch {
    logError(error instanceof Error ? error.message : "Unhandled server error");
  }
  process.exit(1);
});

function buildClientFromEnvironment(): ShopifyClient {
  try {
    const auth = loadAuthConfig();

    if (auth.kind !== "custom-app") {
      throw new ShopifyMcpError(
        "OAuth authentication is reserved for a future release. Use SHOPIFY_STORE and SHOPIFY_ACCESS_TOKEN.",
        { code: "INVALID_AUTH_CONFIG" },
      );
    }

    const throttle = new ThrottleManager();
    return createShopifyClient(
      {
        store: auth.store,
        accessToken: auth.accessToken,
        apiVersion: auth.apiVersion,
      },
      { throttle },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Shopify credentials are not configured.";
    const throttle = new ThrottleManager();

    return {
      config: {
        store: "",
        accessToken: "",
        apiVersion: "",
      },
      throttle,
      async query() {
        throw new ShopifyMcpError(message, {
          code: "INVALID_AUTH_CONFIG",
        });
      },
    };
  }
}

function logStartup(client: ShopifyClient): void {
  if (client.config.store && client.config.apiVersion) {
    logError(
      `shopify-admin-mcp connected to ${buildGraphqlEndpoint({
        kind: "custom-app",
        store: client.config.store,
        accessToken: client.config.accessToken,
        apiVersion: client.config.apiVersion,
      })}`,
    );
    return;
  }

  logError("shopify-admin-mcp started without Shopify credentials; tool calls will return auth errors until the environment is configured.");
}
