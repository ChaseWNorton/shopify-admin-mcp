import { z } from "zod";
import type { ShopifyClient } from "../client.js";
import type {
  CreateFileMutation,
  CreateFileMutationVariables,
  CreateStagedUploadMutation,
  CreateStagedUploadMutationVariables,
  ListFilesQuery,
  ListFilesQueryVariables,
} from "../generated/admin.js";
import { loadNamedOperation } from "../operations/index.js";
import { defineTool, type ToolDefinition } from "./index.js";
import { assertNoUserErrors, expectPresent, unwrapConnection } from "./shared.js";

const LIST_FILES = loadNamedOperation("files", "ListFiles");
const CREATE_STAGED_UPLOAD = loadNamedOperation("files", "CreateStagedUpload");
const CREATE_FILE = loadNamedOperation("files", "CreateFile");

const ListFilesInput = z.object({
  first: z.number().int().min(1).max(250).default(50).describe("Number of files to return."),
  after: z.string().optional().describe("Cursor for the next page of files."),
  query: z.string().optional().describe("Optional Shopify search syntax for filtering files."),
});

const UploadRequestInput = z.object({
  filename: z.string().describe("Filename to use for the staged upload."),
  mimeType: z.string().describe("MIME type of the file to upload."),
  resource: z
    .string()
    .describe("Staged upload resource enum, for example FILE, IMAGE, VIDEO, or MODEL_3D."),
  fileSize: z.number().int().positive().optional().describe("Optional file size in bytes."),
  httpMethod: z.enum(["POST", "PUT"]).optional().describe("HTTP method Shopify should expect for the upload."),
});

const CreateFileInput = z.object({
  originalSource: z
    .string()
    .describe("External URL or staged upload resource URL to register in Shopify."),
  filename: z.string().optional().describe("Optional filename override."),
  alt: z.string().optional().describe("Optional alt text for accessibility."),
  contentType: z
    .string()
    .optional()
    .describe("Optional file content type enum, for example IMAGE or GENERIC_FILE."),
  duplicateResolutionMode: z
    .enum(["APPEND_UUID", "RAISE_ERROR", "REPLACE"])
    .optional()
    .describe("How Shopify should resolve duplicate filenames."),
});

export const tools: ToolDefinition[] = [
  defineTool({
    name: "shopify_list_files",
    description: "List files and media in the store with cursor pagination.",
    inputSchema: ListFilesInput,
    handler: async (client: ShopifyClient, input) => {
      const result = await client.query<ListFilesQuery, ListFilesQueryVariables>(
        await LIST_FILES,
        input,
      );
      const files = unwrapConnection(result.data.files);
      return {
        files: files.items,
        pageInfo: files.pageInfo,
      };
    },
  }),
  defineTool({
    name: "shopify_upload_file",
    description: "Create a staged upload target and optionally register a file source in Shopify.",
    inputSchema: z.object({
      upload: UploadRequestInput.describe("Staged upload request for the file bytes."),
      file: CreateFileInput
        .optional()
        .describe("Optional file registration request once the staged upload has been completed."),
    }),
    handler: async (client: ShopifyClient, input) => {
      const staged = await client.query<
        CreateStagedUploadMutation,
        CreateStagedUploadMutationVariables
      >(await CREATE_STAGED_UPLOAD, {
        input: [
          {
            filename: input.upload.filename,
            mimeType: input.upload.mimeType,
            resource: input.upload.resource as any,
            fileSize: input.upload.fileSize,
            httpMethod: input.upload.httpMethod as any,
          },
        ],
      });
      const stagedPayload = expectPresent(
        staged.data.stagedUploadsCreate,
        "Staged upload payload was not returned by Shopify.",
      );
      assertNoUserErrors(stagedPayload.userErrors, "staged upload creation");

      const stagedTarget = stagedPayload.stagedTargets?.[0] ?? null;
      if (!input.file) {
        return { stagedTarget };
      }

      const fileResult = await client.query<CreateFileMutation, CreateFileMutationVariables>(
        await CREATE_FILE,
        {
          files: [
            {
              originalSource: input.file.originalSource,
              filename: input.file.filename,
              alt: input.file.alt,
              contentType: input.file.contentType as any,
              duplicateResolutionMode:
                input.file.duplicateResolutionMode as any,
            },
          ],
        },
      );
      const filePayload = expectPresent(
        fileResult.data.fileCreate,
        "File create payload was not returned by Shopify.",
      );
      assertNoUserErrors(filePayload.userErrors, "file creation");
      return {
        stagedTarget,
        files: filePayload.files ?? [],
      };
    },
  }),
];
