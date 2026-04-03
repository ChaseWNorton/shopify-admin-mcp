#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  buildGraphqlEndpoint,
  createAccessTokenProvider,
  loadAuthConfig,
  redactAuthError,
} from "./auth.js";
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
    const throttle = new ThrottleManager();
    const authProvider = createAccessTokenProvider(auth);

    return createShopifyClient(
      {
        store: auth.store,
        apiVersion: auth.apiVersion,
        accessToken: auth.kind === "custom-app" ? auth.accessToken : undefined,
      },
      { authProvider, throttle },
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
        store: client.config.store,
        apiVersion: client.config.apiVersion,
      })}`,
    );
    return;
  }

  logError("shopify-admin-mcp started without Shopify credentials; tool calls will return auth errors until the environment is configured.");
}
