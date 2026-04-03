import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DOMAIN_FILES = {
  products: "products.graphql",
  orders: "orders.graphql",
  customers: "customers.graphql",
  inventory: "inventory.graphql",
  collections: "collections.graphql",
  fulfillment: "fulfillment.graphql",
  discounts: "discounts.graphql",
  metafields: "metafields.graphql",
  webhooks: "webhooks.graphql",
  bulk: "bulk.graphql",
  shop: "shop.graphql",
  files: "files.graphql",
} as const;

export type OperationDomain = keyof typeof DOMAIN_FILES;

const cache = new Map<OperationDomain, Promise<string>>();
const operationsDir = dirname(fileURLToPath(import.meta.url));

export async function loadDomainDocument(domain: OperationDomain): Promise<string> {
  const existing = cache.get(domain);
  if (existing) {
    return existing;
  }

  const promise = loadOperationFile(DOMAIN_FILES[domain]);
  cache.set(domain, promise);
  return promise;
}

export async function loadNamedOperation(
  domain: OperationDomain,
  operationName: string,
): Promise<string> {
  const document = await loadDomainDocument(domain);
  const definitions = [...document.matchAll(/^(query|mutation|fragment)\s+([_A-Za-z][_0-9A-Za-z]*)/gm)];
  const targetIndex = definitions.findIndex((match) => match[2] === operationName);

  if (targetIndex < 0) {
    throw new Error(`Operation ${operationName} was not found in ${domain}.graphql`);
  }

  const target = definitions[targetIndex]!;
  const next = definitions[targetIndex + 1];
  const fragments = definitions
    .filter((match) => match[1] === "fragment")
    .map((match, index, list) => {
      const nextFragment = list[index + 1];
      const fragmentStart = match.index ?? 0;
      const fragmentEnd = nextFragment?.index ?? document.length;
      return document.slice(fragmentStart, fragmentEnd).trim();
    })
    .filter(Boolean);

  const operationStart = target.index ?? 0;
  const operationEnd = next?.index ?? document.length;
  const operationBody = document.slice(operationStart, operationEnd).trim();

  return [operationBody, ...fragments].filter(Boolean).join("\n\n");
}

async function loadOperationFile(filename: string): Promise<string> {
  const candidates = [
    join(operationsDir, filename),
    join(operationsDir, "..", "..", "src", "operations", filename),
  ];

  let lastError: unknown;
  for (const candidate of candidates) {
    try {
      return await readFile(candidate, "utf8");
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Operation file ${filename} could not be loaded.`);
}
