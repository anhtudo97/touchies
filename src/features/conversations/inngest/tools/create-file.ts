import z from "zod";
import { Id } from "../../../../../convex/_generated/dataModel";
import { createTool } from "@inngest/agent-kit";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../../convex/_generated/api";

interface CreateFileToolOptions {
    projectId: Id<"projects">;
    internalKey: string;
}

const paramsSchema = z.object({
    parentId: z.string(),
    files: z.
        array(
            z.object({
                name: z.string().min(1, "File name is required"),
                content: z.string(),
            })
        )
        .min(1, "At least one file must be provided")
});

export const createCreateFilesTool = ({ projectId, internalKey }: CreateFileToolOptions) => {
    return createTool({
        name: "createFiles",
        description: "Create new files in the project",
        parameters: z.object({
            parentId: z.string().describe("The ID of the parent folder where the files will be created"),
            files: z.array(
                z.object({
                    name: z.string().describe("The name of the file to create"),
                    content: z.string().describe("The content of the file to create")
                })
            ).describe("An array of files to create")
        }),
        handler: async (params, { step: toolStep }) => {
            const parsed = paramsSchema.safeParse(params);
            if (!parsed.success) {
                throw new Error(`Invalid parameters: ${parsed.error.message}`);
            }

            const { parentId, files } = parsed.data;


            try {
                return await toolStep?.run("create-files", async () => {
                    let resolvedParentId: Id<"files"> | undefined;

                    if (parentId && parentId !== "") {
                        try {
                            resolvedParentId = parentId as Id<"files">;
                            const parentFolder = await convex.query(api.system.getFileById, { internalKey, fileId: resolvedParentId });
                            if (!parentFolder) {
                                return `Parent folder with ID ${resolvedParentId} not found.`;
                            }
                            if (parentFolder.type !== "folder") {
                                return `Error: Parent ID ${resolvedParentId} is not a folder.`;
                            }
                        } catch {
                            return `Error: Invalid parent ID ${parentId}.`;
                        }
                    }

                    const results = await convex.mutation(api.system.createFiles, {
                        internalKey,
                        projectId,
                        parentId: resolvedParentId,
                        files,
                    });

                    const created = results.filter(r => !r.error);
                    const failed = results.filter(r => r.error);

                    let responseMessage = `Created ${created.length} file(s) successfully.`;
                    if (failed.length > 0) {
                        responseMessage += ` Failed to create ${failed.length} file(s).`;
                    }
                    return responseMessage;
                });
            } catch (error) {
                return `Error creating files: ${error instanceof Error ? error.message : String(error)}`;
            }
        }
    });
};