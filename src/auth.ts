import { ShopifyMcpError, scrubSecrets } from "./errors.js";
import { API_VERSION, type ApiVersion } from "./schema/version.js";

export interface CustomAppAuthConfig {
  kind: "custom-app";
  store: string;
  accessToken: string;
  apiVersion: string;
}

export interface OAuthAuthConfig {
  kind: "oauth";
  clientId: string;
  clientSecret: string;
  scopes: string[];
}

export type ShopifyAuthConfig = CustomAppAuthConfig | OAuthAuthConfig;

export interface AuthEnvironment {
  SHOPIFY_STORE?: string;
  SHOPIFY_ACCESS_TOKEN?: string;
  SHOPIFY_API_VERSION?: string;
  SHOPIFY_CLIENT_ID?: string;
  SHOPIFY_CLIENT_SECRET?: string;
  SHOPIFY_SCOPES?: string;
}

export function loadAuthConfig(env: AuthEnvironment = process.env): ShopifyAuthConfig {
  if (env.SHOPIFY_STORE && env.SHOPIFY_ACCESS_TOKEN) {
    return {
      kind: "custom-app",
      store: normalizeStore(env.SHOPIFY_STORE),
      accessToken: env.SHOPIFY_ACCESS_TOKEN.trim(),
      apiVersion: normalizeApiVersion(env.SHOPIFY_API_VERSION),
    };
  }

  if (env.SHOPIFY_CLIENT_ID || env.SHOPIFY_CLIENT_SECRET || env.SHOPIFY_SCOPES) {
    const missing = [
      ["SHOPIFY_CLIENT_ID", env.SHOPIFY_CLIENT_ID],
      ["SHOPIFY_CLIENT_SECRET", env.SHOPIFY_CLIENT_SECRET],
      ["SHOPIFY_SCOPES", env.SHOPIFY_SCOPES],
    ]
      .filter(([, value]) => !value?.trim())
      .map(([key]) => key);

    if (missing.length > 0) {
      throw new ShopifyMcpError(
        `Missing required OAuth environment variables: ${missing.join(", ")}`,
        { code: "INVALID_AUTH_CONFIG" },
      );
    }

    return {
      kind: "oauth",
      clientId: env.SHOPIFY_CLIENT_ID!.trim(),
      clientSecret: env.SHOPIFY_CLIENT_SECRET!.trim(),
      scopes: env.SHOPIFY_SCOPES!.split(",").map((scope) => scope.trim()).filter(Boolean),
    };
  }

  throw new ShopifyMcpError(
    "Missing Shopify auth configuration. Set SHOPIFY_STORE and SHOPIFY_ACCESS_TOKEN for custom app authentication.",
    { code: "INVALID_AUTH_CONFIG" },
  );
}

export function buildAuthHeaders(config: CustomAppAuthConfig): Record<string, string> {
  return {
    "X-Shopify-Access-Token": config.accessToken,
  };
}

export function buildGraphqlEndpoint(config: CustomAppAuthConfig): string {
  return `https://${config.store}/admin/api/${config.apiVersion}/graphql.json`;
}

export function redactAuthError(error: unknown, config: ShopifyAuthConfig): string {
  if (!(error instanceof Error)) {
    return "Unknown authentication error";
  }

  if (config.kind === "custom-app") {
    return scrubSecrets(error.message, [config.accessToken]);
  }

  return scrubSecrets(error.message, [config.clientSecret]);
}

function normalizeStore(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new ShopifyMcpError("SHOPIFY_STORE cannot be empty", { code: "INVALID_AUTH_CONFIG" });
  }

  return trimmed.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

function normalizeApiVersion(value?: string): ApiVersion | string {
  return value?.trim() || API_VERSION;
}
