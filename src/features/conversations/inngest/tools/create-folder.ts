import { z } from "zod";

import { convex } from "@/lib/convex-client";
import { createValidatedTool } from "./create-validated-tool";
import { resolveParentFolder } from "./resolve-parent-folder";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface CreateFolderToolOptions {
    projectId: Id<"projects">;
    internalKey: string;
}

const paramsSchema = z.object({
    name: z.string().min(1, "Folder name is required"),
    parentId: z.string(),
});

export const createCreateFolderTool = ({
    projectId,
    internalKey,
}: CreateFolderToolOptions) => {
    return createValidatedTool({
        name: "createFolder",
        description: "Create a new folder in the project",
        parameters: z.object({
            name: z.string().describe("The name of the folder to create"),
            parentId: z
                .string()
                .describe(
                    "The ID (not name!) of the parent folder from listFiles, or empty string for root level"
                ),
        }),
        paramsSchema,
        run: async ({ name, parentId }, { step: toolStep }) => {
            return await toolStep?.run("create-folder", async () => {
                const parentCheck = await resolveParentFolder(internalKey, parentId);

                if (parentCheck.status === "not-found") {
                    return `Error: Parent folder with ID "${parentId}" not found. Use listFiles to get valid folder IDs.`;
                }
                if (parentCheck.status === "not-folder") {
                    return `Error: The ID "${parentId}" is a file, not a folder. Use a folder ID as parentId.`;
                }
                if (parentCheck.status === "invalid") {
                    return `Error: Invalid parentId "${parentId}". Use listFiles to get valid folder IDs, or use empty string for root level.`;
                }

                const folderId = await convex.mutation(api.system.createFolder, {
                    internalKey,
                    projectId,
                    name,
                    parentId: parentCheck.status === "ok" ? parentCheck.parentId : undefined,
                });

                return `Folder created with ID: ${folderId}`;
            });
        }
    });
};
