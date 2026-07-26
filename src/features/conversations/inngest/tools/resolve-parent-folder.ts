import { getFileById } from "./get-file-by-id";
import { Id } from "../../../../../convex/_generated/dataModel";

export type ParentFolderCheck =
    | { status: "root" }
    | { status: "ok"; parentId: Id<"files"> }
    | { status: "not-found" }
    | { status: "not-folder" }
    | { status: "invalid" };

// Shared "does this parentId point at an existing folder" check used by the
// create-file and create-folder tools. Callers format their own message per
// status so existing wording for each tool is unchanged.
export async function resolveParentFolder(internalKey: string, parentId: string | undefined): Promise<ParentFolderCheck> {
    if (!parentId) {
        return { status: "root" };
    }

    try {
        const id = parentId as Id<"files">;
        const parentFolder = await getFileById(internalKey, id);

        if (!parentFolder) {
            return { status: "not-found" };
        }

        if (parentFolder.type !== "folder") {
            return { status: "not-folder" };
        }

        return { status: "ok", parentId: id };
    } catch {
        return { status: "invalid" };
    }
}
