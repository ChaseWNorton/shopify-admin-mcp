import { describe, expect, it, vi } from "vitest";
import {
  buildAccessTokenEndpoint,
  buildAuthHeaders,
  buildGraphqlEndpoint,
  createAccessTokenProvider,
  loadAuthConfig,
  redactAuthError,
} from "../src/auth.js";
import { API_VERSION } from "../src/schema/version.js";

describe("auth", () => {
  it("loads custom app config and normalizes the store domain", () => {
    const auth = loadAuthConfig({
      SHOPIFY_STORE: "https://example-store.myshopify.com/",
      SHOPIFY_ACCESS_TOKEN: "shpat_secret",
    });

    expect(auth).toEqual({
      kind: "custom-app",
      store: "example-store.myshopify.com",
      accessToken: "shpat_secret",
      apiVersion: API_VERSION,
    });
  });

  it("loads client credentials config and normalizes the store domain", () => {
    const auth = loadAuthConfig({
      SHOPIFY_STORE: "https://example-store.myshopify.com/",
      SHOPIFY_CLIENT_ID: "client-id",
      SHOPIFY_CLIENT_SECRET: "client-secret",
    });

    expect(auth).toEqual({
      kind: "client-credentials",
      store: "example-store.myshopify.com",
      apiVersion: API_VERSION,
      clientId: "client-id",
      clientSecret: "client-secret",
    });
  });

  it("builds auth headers and the GraphQL endpoint", () => {
    const auth = loadAuthConfig({
      SHOPIFY_STORE: "example-store.myshopify.com",
      SHOPIFY_ACCESS_TOKEN: "shpat_secret",
      SHOPIFY_API_VERSION: "2025-10",
    });

    expect(buildAuthHeaders(auth)).toEqual({
      "X-Shopify-Access-Token": "shpat_secret",
    });
    expect(buildGraphqlEndpoint(auth)).toBe(
      "https://example-store.myshopify.com/admin/api/2025-10/graphql.json",
    );
    expect(buildAccessTokenEndpoint(auth.store)).toBe(
      "https://example-store.myshopify.com/admin/oauth/access_token",
    );
  });

  it("rejects incomplete client credentials configuration", () => {
    expect(() =>
      loadAuthConfig({
        SHOPIFY_STORE: "example-store.myshopify.com",
        SHOPIFY_CLIENT_ID: "client-id",
        SHOPIFY_CLIENT_SECRET: "",
      }),
    ).toThrow("Missing required Shopify client credentials variables");
  });

  it("redacts access tokens from auth errors", () => {
    const auth = loadAuthConfig({
      SHOPIFY_STORE: "example-store.myshopify.com",
      SHOPIFY_ACCESS_TOKEN: "shpat_secret",
    });

    expect(redactAuthError(new Error("failed for shpat_secret"), auth)).toBe(
      "failed for [REDACTED]",
    );
  });

  it("mints and caches client credentials access tokens", async () => {
    let now = 0;
    const fetchFn = vi.fn(async () =>
      new Response(
        JSON.stringify({
          access_token: "generated-token",
          expires_in: 120,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ));

    const provider = createAccessTokenProvider(
      loadAuthConfig({
        SHOPIFY_STORE: "example-store.myshopify.com",
        SHOPIFY_CLIENT_ID: "client-id",
        SHOPIFY_CLIENT_SECRET: "client-secret",
      }),
      {
        fetchFn,
        now: () => now,
      },
    );

    expect(await provider.getAccessToken()).toBe("generated-token");
    now = 30_000;
    expect(await provider.getAccessToken()).toBe("generated-token");
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("refreshes client credentials tokens when forced", async () => {
    let callCount = 0;
    const fetchFn = async (_input: RequestInfo | URL, init?: RequestInit) => {
      const body = init?.body instanceof URLSearchParams ? init.body.toString() : "";
      expect(body).toContain("grant_type=client_credentials");
      callCount += 1;
      return new Response(
        JSON.stringify({
          access_token: `token-${callCount}`,
          expires_in: 120,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    };

    const provider = createAccessTokenProvider(
      loadAuthConfig({
        SHOPIFY_STORE: "example-store.myshopify.com",
        SHOPIFY_CLIENT_ID: "client-id",
        SHOPIFY_CLIENT_SECRET: "client-secret",
      }),
      { fetchFn },
    );

    expect(await provider.getAccessToken()).toBe("token-1");
    expect(await provider.getAccessToken({ forceRefresh: true })).toBe("token-2");
  });
});
