export interface ErrorDetails {
  code?: string;
  details?: Record<string, unknown>;
}

export class ShopifyMcpError extends Error {
  readonly code?: string;
  readonly details?: Record<string, unknown>;

  constructor(message: string, options: ErrorDetails = {}) {
    super(message);
    this.name = "ShopifyMcpError";
    this.code = options.code;
    this.details = options.details;
  }
}

export function toErrorResponse(error: unknown): {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
} {
  if (error instanceof ShopifyMcpError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Unknown error" };
}

export function scrubSecrets(input: string, secrets: string[]): string {
  return secrets.reduce((message, secret) => {
    if (!secret) {
      return message;
    }

    return message.split(secret).join("[REDACTED]");
  }, input);
}
