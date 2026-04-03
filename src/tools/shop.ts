import { z } from "zod";
import type { ShopifyClient } from "../client.js";
import type { GetShopQuery } from "../generated/admin.js";
import { loadNamedOperation } from "../operations/index.js";
import { defineTool, type ToolDefinition } from "./index.js";

const GET_SHOP = loadNamedOperation("shop", "GetShop");

const EmptyInput = z.object({});

export const tools: ToolDefinition[] = [
  defineTool({
    name: "shopify_get_shop",
    description: "Get store information such as plan, currency, domain, and email.",
    inputSchema: EmptyInput,
    handler: async (client: ShopifyClient) => {
      const result = await client.query<GetShopQuery>(await GET_SHOP);
      return result.data.shop;
    },
  }),
];
