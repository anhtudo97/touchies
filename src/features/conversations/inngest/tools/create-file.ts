import z from "zod";
import { Id } from "../../../../../convex/_generated/dataModel";
import { convex } from "@/lib/convex-client";
import { createValidatedTool } from "./create-validated-tool";
import { resolveParentFolder } from "./resolve-parent-folder";
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
    return createValidatedTool({
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
        paramsSchema,
        run: async ({ parentId, files }, { step: toolStep }) => {
            return await toolStep?.run("create-files", async () => {
                const parentCheck = await resolveParentFolder(internalKey, parentId);

                if (parentCheck.status === "not-found") {
                    return `Parent folder with ID ${parentId} not found.`;
                }
                if (parentCheck.status === "not-folder") {
                    return `Error: Parent ID ${parentId} is not a folder.`;
                }
                if (parentCheck.status === "invalid") {
                    return `Error: Invalid parent ID ${parentId}.`;
                }

                const results = await convex.mutation(api.system.createFiles, {
                    internalKey,
                    projectId,
                    parentId: parentCheck.status === "ok" ? parentCheck.parentId : undefined,
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
        }
    });
};