import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verifyAuth } from "./auth";

export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, { name }) => {
        const identity = await verifyAuth(ctx);
        const projectId = await ctx.db.insert("projects", {
            name,
            ownerId: identity.subject as string,
            updatedAt: Date.now(),
        });

        return projectId;
    }
});

export const getPartial = query({
    args: {
        limit: v.number(),
    },
    handler: async (ctx, { limit }) => {
        const identity = await verifyAuth(ctx);

        if (!identity) {
            return [];
        }

        return await ctx.db
            .query("projects")
            .withIndex("by_owner", (q) =>
                q.eq("ownerId", identity.subject)
            )
            .take(limit);
    }
});

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await verifyAuth(ctx);

        if (!identity) {
            return [];
        }

        return await ctx.db
            .query("projects")
            .withIndex("by_owner", (q) =>
                q.eq("ownerId", identity.subject)
            )
            .collect();
    }
});