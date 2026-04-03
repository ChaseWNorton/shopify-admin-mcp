import { z } from "zod";
import type { ShopifyClient } from "../client.js";

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodTypeAny;
  handler: (client: ShopifyClient, input: any) => Promise<unknown>;
}

export function defineTool(definition: ToolDefinition): ToolDefinition {
  return definition;
}

export async function loadAllTools(): Promise<ToolDefinition[]> {
  const modules = await Promise.all([
    import("./products.js"),
    import("./orders.js"),
    import("./customers.js"),
    import("./inventory.js"),
    import("./collections.js"),
    import("./fulfillment.js"),
    import("./discounts.js"),
    import("./metafields.js"),
    import("./webhooks.js"),
    import("./bulk.js"),
    import("./shop.js"),
    import("./files.js"),
  ]);

  return modules.flatMap((module) => module.tools);
}
