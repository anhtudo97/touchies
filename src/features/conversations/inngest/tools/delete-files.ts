import { convex } from "@/lib/convex-client";
import { createValidatedTool } from "./create-validated-tool";
import { getFileById } from "./get-file-by-id";
import z from "zod";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface DeleteFilesToolOptions {
    internalKey: string;
}

const paramsSchema = z.object({
    fileIds: z
        .array(z.string().min(1, "File ID cannot be empty"))
        .min(1, "At least one file ID must be provided"),
});

export const createDeleteFilesTool = ({ internalKey }: DeleteFilesToolOptions) => {
    return createValidatedTool({
        name: "deleteFiles",
        description: "Deletes files from the project",
        parameters: z.object({
            fileIds: z
                .array(z.string().min(1, "File ID cannot be empty"))
                .min(1, "At least one file ID must be provided"),
        }),
        paramsSchema,
        run: async ({ fileIds }, { step: toolStep }) => {
            const filesToDelete: {
                id: string;
                name: string;
                type: string;
            }[] = [];

            for (const fileId of fileIds) {
                const file = await getFileById(internalKey, fileId);

                if (!file) {
                    return `Error: File with ID ${fileId} not found.`;
                }

                filesToDelete.push({
                    id: file._id,
                    name: file.name,
                    type: file.type,
                });
            }

            return await toolStep?.run("delete-files", async () => {
                const results: string[] = [];

                for (const file of filesToDelete) {
                    await convex.mutation(api.system.deleteFile, { internalKey, fileId: file.id as Id<"files"> });
                    results.push(`Deleted ${file.type} "${file.name}" (ID: ${file.id})`);
                }

                return results.join("\n");
            });
        }
    });
};