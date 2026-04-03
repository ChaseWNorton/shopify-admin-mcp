export const API_VERSION = "2025-07";

export const SUPPORTED_VERSIONS = [
  "2025-10",
  "2025-07",
  "2025-04",
] as const;

export type ApiVersion = (typeof SUPPORTED_VERSIONS)[number];
