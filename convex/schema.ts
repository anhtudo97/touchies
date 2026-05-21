import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
    project: defineTable({
        name: v.string(),
        ownerId: v.string(),
        importStatus: v.optional(
            v.union(
                v.literal("importing"),
                v.literal("compoleted"),
                v.literal("failed")
            )
        )
    }).index("by_owner", ["ownerId"])
})