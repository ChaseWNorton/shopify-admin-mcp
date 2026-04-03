import { ShopifyMcpError, scrubSecrets } from "./errors.js";
import { API_VERSION, type ApiVersion } from "./schema/version.js";

export interface StoreAuthConfig {
  store: string;
  apiVersion: string;
}

export interface CustomAppAuthConfig extends StoreAuthConfig {
  kind: "custom-app";
  accessToken: string;
}

export interface ClientCredentialsAuthConfig extends StoreAuthConfig {
  kind: "client-credentials";
  clientId: string;
  clientSecret: string;
}

export type ShopifyAuthConfig = CustomAppAuthConfig | ClientCredentialsAuthConfig;

export interface AuthEnvironment {
  SHOPIFY_STORE?: string;
  SHOPIFY_ACCESS_TOKEN?: string;
  SHOPIFY_API_VERSION?: string;
  SHOPIFY_CLIENT_ID?: string;
  SHOPIFY_CLIENT_SECRET?: string;
}

export interface AccessTokenProvider {
  readonly kind: ShopifyAuthConfig["kind"];
  readonly store: string;
  readonly apiVersion: string;
  getAccessToken(options?: { forceRefresh?: boolean }): Promise<string>;
  redact(message: string): string;
}

interface ClientCredentialsTokenResponse {
  access_token?: string;
  expires_in?: number;
}

interface AccessTokenProviderDependencies {
  fetchFn?: typeof fetch;
  now?: () => number;
  refreshSkewMs?: number;
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

  if (env.SHOPIFY_STORE || env.SHOPIFY_CLIENT_ID || env.SHOPIFY_CLIENT_SECRET) {
    const missing = [
      ["SHOPIFY_STORE", env.SHOPIFY_STORE],
      ["SHOPIFY_CLIENT_ID", env.SHOPIFY_CLIENT_ID],
      ["SHOPIFY_CLIENT_SECRET", env.SHOPIFY_CLIENT_SECRET],
    ]
      .filter(([, value]) => !value?.trim())
      .map(([key]) => key);

    if (missing.length > 0) {
      throw new ShopifyMcpError(
        `Missing required Shopify client credentials variables: ${missing.join(", ")}`,
        { code: "INVALID_AUTH_CONFIG" },
      );
    }

    return {
      kind: "client-credentials",
      store: normalizeStore(env.SHOPIFY_STORE!),
      apiVersion: normalizeApiVersion(env.SHOPIFY_API_VERSION),
      clientId: env.SHOPIFY_CLIENT_ID!.trim(),
      clientSecret: env.SHOPIFY_CLIENT_SECRET!.trim(),
    };
  }

  throw new ShopifyMcpError(
    "Missing Shopify auth configuration. Set SHOPIFY_STORE plus either SHOPIFY_ACCESS_TOKEN or SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET.",
    { code: "INVALID_AUTH_CONFIG" },
  );
}

export function buildAuthHeaders(configOrAccessToken: CustomAppAuthConfig | string): Record<string, string> {
  const accessToken =
    typeof configOrAccessToken === "string"
      ? configOrAccessToken
      : configOrAccessToken.accessToken;

  return {
    "X-Shopify-Access-Token": accessToken,
  };
}

export function buildGraphqlEndpoint(config: StoreAuthConfig): string {
  return `https://${config.store}/admin/api/${config.apiVersion}/graphql.json`;
}

export function buildAccessTokenEndpoint(store: string): string {
  return `https://${normalizeStore(store)}/admin/oauth/access_token`;
}

export function createAccessTokenProvider(
  config: ShopifyAuthConfig,
  dependencies: AccessTokenProviderDependencies = {},
): AccessTokenProvider {
  if (config.kind === "custom-app") {
    return {
      kind: config.kind,
      store: config.store,
      apiVersion: config.apiVersion,
      async getAccessToken() {
        return config.accessToken;
      },
      redact(message: string) {
        return scrubSecrets(message, [config.accessToken]);
      },
    };
  }

  const clientCredentialsConfig = config;
  const fetchFn = dependencies.fetchFn ?? fetch;
  const now = dependencies.now ?? Date.now;
  const refreshSkewMs = dependencies.refreshSkewMs ?? 60_000;

  let cachedToken:
    | {
        accessToken: string;
        expiresAt: number;
      }
    | undefined;
  let pendingRefresh:
    | Promise<{
        accessToken: string;
        expiresAt: number;
      }>
    | undefined;

  async function refreshAccessToken(): Promise<{
    accessToken: string;
    expiresAt: number;
  }> {
    if (pendingRefresh) {
      return pendingRefresh;
    }

    pendingRefresh = (async () => {
      const response = await fetchFn(buildAccessTokenEndpoint(config.store), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientCredentialsConfig.clientId,
          client_secret: clientCredentialsConfig.clientSecret,
        }),
      });

      const payload = await readJsonBody<ClientCredentialsTokenResponse>(response);

      if (!response.ok) {
        const details = payload ? (payload as Record<string, unknown>) : undefined;
        const message = extractAuthFailureMessage(response.status, payload);
        throw new ShopifyMcpError(scrubSecrets(message, [clientCredentialsConfig.clientSecret]), {
          code: "AUTH_REQUEST_FAILED",
          details,
        });
      }

      if (!payload?.access_token) {
        throw new ShopifyMcpError("Shopify token endpoint did not return an access_token", {
          code: "AUTH_REQUEST_FAILED",
        });
      }

      const expiresInSeconds = typeof payload.expires_in === "number" ? payload.expires_in : 86_400;
      const nextToken = {
        accessToken: payload.access_token,
        expiresAt: now() + expiresInSeconds * 1_000,
      };

      cachedToken = nextToken;
      return nextToken;
    })().finally(() => {
      pendingRefresh = undefined;
    });

    return pendingRefresh;
  }

  return {
    kind: config.kind,
    store: config.store,
    apiVersion: config.apiVersion,
    async getAccessToken(options = {}) {
      if (
        !options.forceRefresh &&
        cachedToken &&
        cachedToken.expiresAt - refreshSkewMs > now()
      ) {
        return cachedToken.accessToken;
      }

      return (await refreshAccessToken()).accessToken;
    },
    redact(message: string) {
      return scrubSecrets(message, [
        clientCredentialsConfig.clientSecret,
        cachedToken?.accessToken ?? "",
      ]);
    },
  };
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

async function readJsonBody<T>(response: Response): Promise<T | undefined> {
  const body = await response.text();
  if (!body) {
    return undefined;
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new ShopifyMcpError("Shopify token endpoint returned invalid JSON", {
      code: "AUTH_REQUEST_FAILED",
      details: { status: response.status },
    });
  }
}

function extractAuthFailureMessage(
  status: number,
  payload: ClientCredentialsTokenResponse | undefined,
): string {
  const errorMessage =
    payload && typeof payload === "object" && "error" in payload
      ? String((payload as Record<string, unknown>).error ?? "")
      : "";
  const errorDescription =
    payload && typeof payload === "object" && "error_description" in payload
      ? String((payload as Record<string, unknown>).error_description ?? "")
      : "";
  const reason = [errorMessage, errorDescription].filter(Boolean).join(": ");

  return reason
    ? `Failed to mint Shopify access token (${status}): ${reason}`
    : `Failed to mint Shopify access token (${status})`;
}
