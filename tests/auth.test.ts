import { describe, expect, it } from "vitest";
import {
  buildAuthHeaders,
  buildGraphqlEndpoint,
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
  });

  it("rejects incomplete OAuth configuration", () => {
    expect(() =>
      loadAuthConfig({
        SHOPIFY_CLIENT_ID: "client-id",
        SHOPIFY_CLIENT_SECRET: "",
      }),
    ).toThrow("Missing required OAuth environment variables");
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
});
