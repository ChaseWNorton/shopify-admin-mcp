import { afterEach, describe, expect, it, vi } from "vitest";
import { createShopifyClient } from "../src/client.js";
import { ThrottleManager } from "../src/throttle.js";

describe("Shopify client", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("parses throttle status from response extensions", async () => {
    const adminClient = {
      request: vi.fn().mockResolvedValue({
        data: { shop: { id: "gid://shopify/Shop/1" } },
        extensions: {
          cost: {
            requestedQueryCost: 30,
            actualQueryCost: 18,
            throttleStatus: {
              maximumAvailable: 1000,
              currentlyAvailable: 982,
              restoreRate: 50,
            },
          },
        },
      }),
    };
    const throttle = new ThrottleManager({ sleep: async () => undefined });
    const client = createShopifyClient(
      {
        store: "example.myshopify.com",
        apiVersion: "2025-07",
        accessToken: "shpat_secret",
      },
      { adminClient, throttle },
    );

    const result = await client.query<{ shop: { id: string } }>("query GetShop { shop { id } }");

    expect(result.data.shop.id).toBe("gid://shopify/Shop/1");
    expect(result.cost).toEqual({
      requestedQueryCost: 30,
      actualQueryCost: 18,
      maximumAvailable: 1000,
      currentlyAvailable: 982,
      restoreRate: 50,
    });
    expect(throttle.getSnapshot().available).toBeGreaterThanOrEqual(982);
    expect(throttle.getSnapshot().available).toBeLessThan(983);
  });

  it("retries throttled requests with backoff", async () => {
    vi.useFakeTimers();

    const adminClient = {
      request: vi
        .fn()
        .mockResolvedValueOnce({
          data: undefined,
          extensions: {
            cost: {
              requestedQueryCost: 60,
              actualQueryCost: 60,
              throttleStatus: {
                maximumAvailable: 1000,
                currentlyAvailable: 0,
                restoreRate: 60,
              },
            },
          },
          errors: {
            message: "THROTTLED",
            networkStatusCode: 429,
            graphQLErrors: [
              {
                message: "THROTTLED",
                path: ["query"],
                extensions: { code: "THROTTLED" },
              },
            ],
          },
        })
        .mockResolvedValueOnce({
          data: { shop: { id: "gid://shopify/Shop/1" } },
          extensions: {
            cost: {
              requestedQueryCost: 10,
              actualQueryCost: 10,
              throttleStatus: {
                maximumAvailable: 1000,
                currentlyAvailable: 990,
                restoreRate: 60,
              },
            },
          },
        }),
    };
    const client = createShopifyClient(
      {
        store: "example.myshopify.com",
        apiVersion: "2025-07",
        accessToken: "shpat_secret",
      },
      {
        adminClient,
        throttle: new ThrottleManager({ sleep: async () => undefined }),
      },
    );

    const pending = client.query<{ shop: { id: string } }>(
      "query GetShop { shop { id } }",
      undefined,
      { estimatedCost: 60, maxRetries: 1 },
    );

    await vi.runAllTimersAsync();
    const result = await pending;

    expect(result.data.shop.id).toBe("gid://shopify/Shop/1");
    expect(adminClient.request).toHaveBeenCalledTimes(2);
  });

  it("scrubs access tokens from surfaced GraphQL errors", async () => {
    const adminClient = {
      request: vi.fn().mockResolvedValue({
        data: undefined,
        errors: {
          message: "Request failed for shpat_secret",
          networkStatusCode: 500,
          graphQLErrors: [
            {
              message: "Internal failure: shpat_secret",
              path: ["shop"],
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            },
          ],
        },
      }),
    };
    const client = createShopifyClient(
      {
        store: "example.myshopify.com",
        apiVersion: "2025-07",
        accessToken: "shpat_secret",
      },
      {
        adminClient,
        throttle: new ThrottleManager({ sleep: async () => undefined }),
      },
    );

    await expect(client.query("query GetShop { shop { id } }")).rejects.toMatchObject({
      message: "Internal failure: [REDACTED]",
      details: {
        graphQLErrors: [
          {
            message: "Internal failure: [REDACTED]",
          },
        ],
      },
    });
  });

  it("mints a token through the auth provider before querying", async () => {
    const adminClientFactory = vi.fn().mockReturnValue({
      request: vi.fn().mockResolvedValue({
        data: { shop: { id: "gid://shopify/Shop/1" } },
        extensions: {
          cost: {
            requestedQueryCost: 5,
            actualQueryCost: 5,
            throttleStatus: {
              maximumAvailable: 1000,
              currentlyAvailable: 995,
              restoreRate: 50,
            },
          },
        },
      }),
    });
    const authProvider = {
      kind: "client-credentials" as const,
      store: "example.myshopify.com",
      apiVersion: "2025-07",
      getAccessToken: vi.fn().mockResolvedValue("generated-token"),
      redact: (message: string) => message.replaceAll("generated-token", "[REDACTED]"),
    };
    const client = createShopifyClient(
      {
        store: "example.myshopify.com",
        apiVersion: "2025-07",
      },
      {
        authProvider,
        adminClientFactory,
        throttle: new ThrottleManager({ sleep: async () => undefined }),
      },
    );

    const result = await client.query<{ shop: { id: string } }>("query GetShop { shop { id } }");

    expect(result.data.shop.id).toBe("gid://shopify/Shop/1");
    expect(authProvider.getAccessToken).toHaveBeenCalledTimes(1);
    expect(adminClientFactory).toHaveBeenCalledWith("generated-token");
  });

  it("refreshes the token after a 401 when using client credentials", async () => {
    const refreshedRequest = vi.fn().mockResolvedValue({
      data: { shop: { id: "gid://shopify/Shop/2" } },
      extensions: {
        cost: {
          requestedQueryCost: 10,
          actualQueryCost: 10,
          throttleStatus: {
            maximumAvailable: 1000,
            currentlyAvailable: 990,
            restoreRate: 50,
          },
        },
      },
    });
    const adminClientFactory = vi
      .fn()
      .mockReturnValueOnce({
        request: vi.fn().mockResolvedValue({
          data: undefined,
          errors: {
            message: "Unauthorized",
            networkStatusCode: 401,
            graphQLErrors: [
              {
                message: "Invalid API key or access token",
                path: ["shop"],
                extensions: { code: "UNAUTHORIZED" },
              },
            ],
          },
        }),
      })
      .mockReturnValueOnce({
        request: refreshedRequest,
      });
    const authProvider = {
      kind: "client-credentials" as const,
      store: "example.myshopify.com",
      apiVersion: "2025-07",
      getAccessToken: vi
        .fn()
        .mockResolvedValueOnce("expired-token")
        .mockResolvedValueOnce("fresh-token")
        .mockResolvedValueOnce("fresh-token"),
      redact: (message: string) =>
        message.replaceAll("expired-token", "[REDACTED]").replaceAll("fresh-token", "[REDACTED]"),
    };
    const client = createShopifyClient(
      {
        store: "example.myshopify.com",
        apiVersion: "2025-07",
      },
      {
        authProvider,
        adminClientFactory,
        throttle: new ThrottleManager({ sleep: async () => undefined }),
      },
    );

    const result = await client.query<{ shop: { id: string } }>("query GetShop { shop { id } }");

    expect(result.data.shop.id).toBe("gid://shopify/Shop/2");
    expect(authProvider.getAccessToken).toHaveBeenNthCalledWith(1);
    expect(authProvider.getAccessToken).toHaveBeenNthCalledWith(2, { forceRefresh: true });
    expect(authProvider.getAccessToken).toHaveBeenNthCalledWith(3);
    expect(adminClientFactory).toHaveBeenNthCalledWith(1, "expired-token");
    expect(adminClientFactory).toHaveBeenNthCalledWith(2, "fresh-token");
  });
});
