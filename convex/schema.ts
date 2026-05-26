import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
    project: defineTable({
        name: v.string(),
        ownerId: v.string(),
        updatedAt: v.number(),
        importStatus: v.optional(
            v.union(
                v.literal("importing"),
                v.literal("compoleted"),
                v.literal("failed")
            )
        ),
        exportStatus: v.optional(
            v.union(
                v.literal("exporting"),
                v.literal("compoleted"),
                v.literal("failed"),
                v.literal("cancelled")
            )
        ),
        exportRepoUrl: v.optional(v.string())
    }).index("by_owner", ["ownerId"])
});