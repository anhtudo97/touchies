import { z } from "zod";

import { convex } from "@/lib/convex-client";
import { createValidatedTool } from "./create-validated-tool";
import { getFileById } from "./get-file-by-id";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface RenameFileToolOptions {
    internalKey: string;
}

const paramsSchema = z.object({
    fileId: z.string().min(1, "File ID is required"),
    newName: z.string().min(1, "New name is required"),
});

export const createRenameFileTool = ({
    internalKey,
}: RenameFileToolOptions) => {
    return createValidatedTool({
        name: "renameFile",
        description: "Rename a file or folder",
        parameters: z.object({
            fileId: z.string().describe("The ID of the file or folder to rename"),
            newName: z.string().describe("The new name for the file or folder"),
        }),
        paramsSchema,
        run: async ({ fileId, newName }, { step: toolStep }) => {
            // Validate file exists before running the step
            const file = await getFileById(internalKey, fileId);

            if (!file) {
                return `Error: File with ID "${fileId}" not found. Use listFiles to get valid file IDs.`;
            }

            return await toolStep?.run("rename-file", async () => {
                await convex.mutation(api.system.renameFile, {
                    internalKey,
                    fileId: fileId as Id<"files">,
                    newName,
                });

                return `Renamed "${file.name}" to "${newName}" successfully`;
            });
        }
    });
};
