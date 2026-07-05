import { convex } from "@/lib/convex-client";
import { createTool } from "@inngest/agent-kit";
import z from "zod";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

interface UpdateFileToolOptions {
    internalKey: string;
}

const paramsSchema = z.object({
    fileId: z.string().min(1, "File ID is required"),
    content: z.string()
});

export const createUpdateFileTool = ({ internalKey }: UpdateFileToolOptions) => {
    return createTool({
        name: "updateFile",
        description: "Update the content of a file in the project",
        parameters: z.object({
            fileId: z.string().describe("The ID of the file to update"),
            content: z.string().describe("The new content for the file")
        }),
        handler: async (params, { step: toolStep }) => {
            const parsed = paramsSchema.safeParse(params);
            if (!parsed.success) {
                throw new Error(`Invalid parameters: ${parsed.error.message}`);
            }

            const { fileId, content } = parsed.data;

            const file = await convex.query(api.system.getFileById, { internalKey, fileId: fileId as Id<"files"> });

            if (!file) {
                return `File with ID ${fileId} not found.`;
            }

            if (file.type === "folder") {
                return `Error: "Cannot update a folder. File ID ${fileId} is a folder."`;
            }

            try {
                return await toolStep?.run("update-file", async () => {
                    await convex.mutation(api.system.updateFile, {
                        internalKey,
                        fileId: fileId as Id<"files">,
                        content
                    });

                    return `File with ID ${fileId} has been successfully updated.`;
                });
            } catch (error) {
                
            }
        }
    });
};