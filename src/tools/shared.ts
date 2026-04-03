import type { ShopifyMcpError } from "../errors.js";
import { ShopifyMcpError as ShopifyError } from "../errors.js";

export interface UserErrorLike {
  field?: readonly string[] | null;
  message: string;
}

export function unwrapConnection<T>(connection: {
  edges: Array<{ node: T }>;
  pageInfo?: { hasNextPage: boolean; endCursor?: string | null };
}): {
  items: T[];
  pageInfo?: { hasNextPage: boolean; endCursor?: string | null };
} {
  return {
    items: connection.edges.map((edge) => edge.node),
    pageInfo: connection.pageInfo,
  };
}

export function assertNoUserErrors(
  errors: ReadonlyArray<UserErrorLike> | undefined,
  context: string,
): void {
  if (!errors || errors.length === 0) {
    return;
  }

  const message = errors
    .map((error) => {
      const field = error.field?.length ? `${error.field.join(".")}: ` : "";
      return `${field}${error.message}`;
    })
    .join(", ");

  throw new ShopifyError(`Shopify ${context} failed: ${message}`, {
    code: "SHOPIFY_USER_ERRORS",
    details: { errors },
  });
}

export function expectPresent<T>(value: T | null | undefined, message: string): T {
  if (value === null || value === undefined) {
    throw new ShopifyError(message, {
      code: "EMPTY_RESPONSE",
    });
  }

  return value;
}

export function notFound(resource: string, identifier: string): ShopifyMcpError {
  return new ShopifyError(`${resource} not found`, {
    code: "NOT_FOUND",
    details: { identifier },
  });
}
