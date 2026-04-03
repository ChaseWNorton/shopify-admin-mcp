import type { CodegenConfig } from "@graphql-codegen/cli";
import { ApiType, shopifyApiProject } from "@shopify/api-codegen-preset";
import { API_VERSION } from "./src/schema/version.ts";

const config: CodegenConfig = {
  schema: "./src/schema/admin.graphql",
  documents: ["./src/operations/**/*.graphql"],
  projects: {
    default: shopifyApiProject({
      apiType: ApiType.Admin,
      apiVersion: API_VERSION,
      documents: ["./src/operations/**/*.graphql"],
      outputDir: "./src/generated",
      declarations: false,
    }),
  },
};

export default config;
