import {
  createAdminApiClient,
  type AdminApiClient,
  type ClientResponse,
} from "@shopify/admin-api-client";
import { ShopifyMcpError, scrubSecrets } from "./errors.js";
import { ThrottleManager, type ThrottleStatus } from "./throttle.js";

export interface ShopifyClientConfig {
  store: string;
  accessToken: string;
  apiVersion: string;
}

export interface QueryResult<T> {
  data: T;
  cost: ThrottleStatus;
  extensions: Record<string, unknown>;
}

export interface ShopifyClient {
  readonly config: Readonly<ShopifyClientConfig>;
  readonly throttle: ThrottleManager;
  query<TData, TVariables extends Record<string, unknown> | undefined = undefined>(
    document: string,
    variables?: TVariables,
    options?: QueryOptions,
  ): Promise<QueryResult<TData>>;
}

export interface QueryOptions {
  estimatedCost?: number;
  maxRetries?: number;
}

interface ShopifyClientDependencies {
  adminClient?: Pick<AdminApiClient, "request">;
  throttle?: ThrottleManager;
}

const DEFAULT_THROTTLE_STATUS: ThrottleStatus = {
  requestedQueryCost: 0,
  actualQueryCost: 0,
  maximumAvailable: 1000,
  currentlyAvailable: 1000,
  restoreRate: 50,
};

export function createShopifyClient(
  config: ShopifyClientConfig,
  dependencies: ShopifyClientDependencies = {},
): ShopifyClient {
  const adminClient =
    dependencies.adminClient ??
    createAdminApiClient({
      storeDomain: config.store,
      accessToken: config.accessToken,
      apiVersion: config.apiVersion,
      retries: 0,
    });
  const throttle = dependencies.throttle ?? new ThrottleManager();

  return {
    config,
    throttle,
    async query<TData, TVariables extends Record<string, unknown> | undefined = undefined>(
      document: string,
      variables?: TVariables,
      options: QueryOptions = {},
    ): Promise<QueryResult<TData>> {
      const estimatedCost = options.estimatedCost ?? 50;
      const maxRetries = options.maxRetries ?? 3;
      let attempt = 0;

      while (true) {
        await throttle.waitForCapacity(estimatedCost);

        const requestOptions = variables ? { variables } : undefined;
        const response = await adminClient.request<TData>(document, requestOptions);

        const extensions = (response.extensions ?? {}) as Record<string, unknown>;
        const throttleStatus = extractThrottleStatus(extensions) ?? buildFallbackStatus(throttle);

        if (throttleStatus) {
          throttle.update(throttleStatus);
        }

        if (!response.errors) {
          if (!response.data) {
            throw new ShopifyMcpError("Shopify returned an empty data payload", {
              code: "EMPTY_RESPONSE",
            });
          }

          return {
            data: response.data,
            cost: throttleStatus,
            extensions,
          };
        }

        if (isThrottled(response)) {
          if (attempt >= maxRetries) {
            throw new ShopifyMcpError("Shopify request was throttled after retry attempts", {
              code: "THROTTLED",
              details: { retries: attempt },
            });
          }

          attempt += 1;
          const retryCost =
            throttleStatus.requestedQueryCost ||
            throttleStatus.actualQueryCost ||
            estimatedCost;
          const delayMs = throttle.calculateRetryDelayMs(retryCost);
          await wait(delayMs);
          continue;
        }

        throw responseError(response, config.accessToken);
      }
    },
  };
}

function extractThrottleStatus(extensions: Record<string, unknown>): ThrottleStatus | undefined {
  const cost = asRecord(extensions.cost);
  const status = asRecord(cost?.throttleStatus);
  if (!status) {
    return undefined;
  }

  const requestedQueryCost = asNumber(cost?.requestedQueryCost) ?? 0;
  const actualQueryCost = asNumber(cost?.actualQueryCost) ?? requestedQueryCost;
  const maximumAvailable = asNumber(status.maximumAvailable);
  const currentlyAvailable = asNumber(status.currentlyAvailable);
  const restoreRate = asNumber(status.restoreRate);

  if (
    maximumAvailable === undefined ||
    currentlyAvailable === undefined ||
    restoreRate === undefined
  ) {
    return undefined;
  }

  return {
    requestedQueryCost,
    actualQueryCost,
    maximumAvailable,
    currentlyAvailable,
    restoreRate,
  };
}

function buildFallbackStatus(throttle: ThrottleManager): ThrottleStatus {
  const snapshot = throttle.getSnapshot();
  return {
    ...DEFAULT_THROTTLE_STATUS,
    maximumAvailable: snapshot.maxAvailable,
    currentlyAvailable: Math.floor(snapshot.available),
    restoreRate: snapshot.restoreRate,
  };
}

function isThrottled(response: ClientResponse<unknown>): boolean {
  const graphQLErrors = response.errors?.graphQLErrors;
  if (!Array.isArray(graphQLErrors)) {
    return false;
  }

  return graphQLErrors.some((error) => {
    const code = asRecord(error.extensions)?.code;
    return code === "THROTTLED" || String(error.message ?? "").toUpperCase().includes("THROTTLED");
  });
}

function responseError(response: ClientResponse<unknown>, accessToken: string): ShopifyMcpError {
  const graphQLErrors = response.errors?.graphQLErrors ?? [];
  const messages = graphQLErrors
    .map((error) => scrubSecrets(String(error.message ?? "Unknown GraphQL error"), [accessToken]))
    .filter(Boolean);
  const networkMessage = scrubSecrets(response.errors?.message ?? "", [accessToken]);
  const message = messages[0] ?? networkMessage ?? "Shopify request failed";

  return new ShopifyMcpError(message, {
    code: "SHOPIFY_REQUEST_FAILED",
    details: {
      graphQLErrors: graphQLErrors.map((error) => ({
        message: scrubSecrets(String(error.message ?? ""), [accessToken]),
        path: error.path,
        code: asRecord(error.extensions)?.code,
      })),
      networkStatusCode: response.errors?.networkStatusCode,
    },
  });
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
