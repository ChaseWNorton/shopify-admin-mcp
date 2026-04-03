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
        accessToken: "shpat_secret",
        apiVersion: "2025-07",
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
        accessToken: "shpat_secret",
        apiVersion: "2025-07",
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
        accessToken: "shpat_secret",
        apiVersion: "2025-07",
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
});
