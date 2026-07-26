import { z } from "zod";

import { convex } from "@/lib/convex-client";
import { createValidatedTool } from "./create-validated-tool";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface ListFilesToolOptions {
    projectId: Id<"projects">;
    internalKey: string;
}

const paramsSchema = z.object({});

export const createListFilesTool = ({
    projectId,
    internalKey,
}: ListFilesToolOptions) => {
    return createValidatedTool({
        name: "listFiles",
        description:
            "List all files and folders in the project. Returns names, IDs, types, and parentId for each item. Items with parentId: null are at root level. Use the parentId to understand the folder structure - items with the same parentId are in the same folder.",
        parameters: paramsSchema,
        paramsSchema,
        run: async (_, { step: toolStep }) => {
            return await toolStep?.run("list-files", async () => {
                const files = await convex.query(api.system.getProjectFiles, {
                    internalKey,
                    projectId,
                });

                // Sort: folders first, then files, alphabetically
                const sorted = files.sort((a, b) => {
                    if (a.type !== b.type) {
                        return a.type === "folder" ? -1 : 1;
                    }
                    return a.name.localeCompare(b.name);
                });

                const fileList = sorted.map((f) => ({
                    id: f._id,
                    name: f.name,
                    type: f.type,
                    parentId: f.parentId ?? null,
                }));

                return JSON.stringify(fileList);
            });
        }
    });
};
