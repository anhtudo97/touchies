import { z } from "zod";

import { createValidatedTool } from "./create-validated-tool";
import { getFileById } from "./get-file-by-id";

interface ReadFilesToolOptions {
    internalKey: string;
}

const paramsSchema = z.object({
    fileIds: z
        .array(z.string().min(1, "File ID cannot be empty"))
        .min(1, "Provide at least one file ID"),
});

export const createReadFilesTool = ({ internalKey }: ReadFilesToolOptions) => {
    return createValidatedTool({
        name: "readFiles",
        description: "Read the content of files from the project. Returns file contents.",
        parameters: z.object({
            fileIds: z.array(z.string()).describe("Array of file IDs to read"),
        }),
        paramsSchema,
        run: async ({ fileIds }, { step: toolStep }) => {
            return await toolStep?.run("read-files", async () => {
                const results: { id: string; name: string; content: string; }[] = [];

                for (const fileId of fileIds) {
                    const file = await getFileById(internalKey, fileId);

                    if (file && file.content) {
                        results.push({
                            id: file._id,
                            name: file.name,
                            content: file.content,
                        });
                    };
                }

                if (results.length === 0) {
                    return "Error: No files found with provided IDs. Use listFiles to get valid fileIDs.";
                }

                return JSON.stringify(results);
            });
        }
    });
};
