import { convex } from "@/lib/convex-client";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

// Thin shared wrapper around the repeated `getFileById` query + `Id<"files">`
// cast used across the file tools; each caller still owns its own
// not-found/error message.
export function getFileById(internalKey: string, fileId: string) {
    return convex.query(api.system.getFileById, { internalKey, fileId: fileId as Id<"files"> });
}
