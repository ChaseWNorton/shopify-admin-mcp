import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools/files.js";
import { createMockClient, executeTool, getTool } from "../helpers.js";

describe("files tools", () => {
  it("creates a staged upload target", async () => {
    const tool = getTool(tools, "shopify_upload_file");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        stagedUploadsCreate: {
          stagedTargets: [
            {
              url: "https://upload.example.com",
              resourceUrl: "https://cdn.example.com/file.jpg",
              parameters: [{ name: "key", value: "value" }],
            },
          ],
          userErrors: [],
        },
      },
    });

    await expect(
      executeTool(tool, client, {
        upload: {
          filename: "photo.jpg",
          mimeType: "image/jpeg",
          resource: "IMAGE",
        },
      }),
    ).resolves.toEqual({
      stagedTarget: {
        url: "https://upload.example.com",
        resourceUrl: "https://cdn.example.com/file.jpg",
        parameters: [{ name: "key", value: "value" }],
      },
    });
  });

  it("surfaces staged upload user errors", async () => {
    const tool = getTool(tools, "shopify_upload_file");
    const { client, query } = createMockClient();
    query.mockResolvedValue({
      data: {
        stagedUploadsCreate: {
          stagedTargets: [],
          userErrors: [{ field: ["filename"], message: "Filename is required" }],
        },
      },
    });

    await expect(
      executeTool(tool, client, {
        upload: {
          filename: "photo.jpg",
          mimeType: "image/jpeg",
          resource: "IMAGE",
        },
      }),
    ).rejects.toThrow("Shopify staged upload creation failed");
  });

  it("validates upload input", () => {
    const tool = getTool(tools, "shopify_upload_file");
    expect(() => tool.inputSchema.parse({})).toThrow();
  });
});
