import { convex } from "@/lib/convex-client";
import { createTool } from "@inngest/agent-kit";
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
    return createTool({
        name: "deleteFiles",
        description: "Deletes files from the project",
        parameters: z.object({
            fileIds: z
                .array(z.string().min(1, "File ID cannot be empty"))
                .min(1, "At least one file ID must be provided"),
        }),
        handler: async (params, { step: toolStep }) => {
            const parsedParams = paramsSchema.safeParse(params);

            if (!parsedParams.success) {
                return `Error: ${parsedParams.error.message}`;
            }

            const { fileIds } = parsedParams.data;

            const filesToDelete: {
                id: string;
                name: string;
                type: string;
            }[] = [];

            for (const fileId of fileIds) {
                const file = await convex.query(api.system.getFileById, { internalKey, fileId: fileId as Id<"files"> });

                if (!file) {
                    return `Error: File with ID ${fileId} not found.`;
                }

                filesToDelete.push({
                    id: file._id,
                    name: file.name,
                    type: file.type,
                });
            }

            try {
                return await toolStep?.run("delete-files", async () => {
                    const results: string[] = [];

                    for (const file of filesToDelete) {
                        await convex.mutation(api.system.deleteFile, { internalKey, fileId: file.id as Id<"files"> });
                        results.push(`Deleted ${file.type} "${file.name}" (ID: ${file.id})`);
                    }

                    return results.join("\n");
                });
            } catch (error) {
                return `Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`;
            }
        }
    });
};