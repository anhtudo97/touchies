import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const validateInternalKey = (key: string) => {
    const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;

    if (!internalKey) {
        throw new Error("POLARIS_CONVEX_INTERNAL_KEY is not configured");
    }

    if (key !== internalKey) {
        throw new Error("Invalid internal key");
    }
};

export const getConversationById = query({
    args: {
        conversationId: v.id("conversations"),
        internalKey: v.string(),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        return await ctx.db.get(args.conversationId);
    },
});

export const createMessage = mutation({
    args: {
        internalKey: v.string(),
        conversationId: v.id("conversations"),
        projectId: v.id("projects"),
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        status: v.optional(
            v.union(
                v.literal("processing"),
                v.literal("completed"),
                v.literal("cancelled")
            )
        ),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const messageId = await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            projectId: args.projectId,
            role: args.role,
            content: args.content,
            status: args.status,
        });

        // Update conversation's updatedAt
        await ctx.db.patch(args.conversationId, {
            updatedAt: Date.now(),
        });

        return messageId;
    },
});

export const updateMessageContent = mutation({
    args: {
        internalKey: v.string(),
        messageId: v.id("messages"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        await ctx.db.patch(args.messageId, {
            content: args.content,
            status: "completed" as const,
        });
    },
});

export const getProcessingMessages = query({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        return await ctx.db
            .query("messages")
            .withIndex("by_project_status", (q) =>
                q
                    .eq("projectId", args.projectId)
                    .eq("status", "processing")
            )
            .collect();
    },
});

export const updateMessageStatus = mutation({
    args: {
        internalKey: v.string(),
        messageId: v.id("messages"),
        status: v.union(
            v.literal("processing"),
            v.literal("completed"),
            v.literal("cancelled")
        ),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        await ctx.db.patch(args.messageId, {
            status: args.status,
        });
    },
});

// Used for Agent conversation context
export const getRecentMessages = query({
    args: {
        internalKey: v.string(),
        conversationId: v.id("conversations"),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) =>
                q.eq("conversationId", args.conversationId)
            )
            .order("asc")
            .collect();

        const limit = args.limit ?? 10;
        return messages.slice(-limit);
    },
});

// Used for Agent to update conversation title
export const updateConversationTitle = mutation({
    args: {
        internalKey: v.string(),
        conversationId: v.id("conversations"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        await ctx.db.patch(args.conversationId, {
            title: args.title,
            updatedAt: Date.now(),
        });
    },
});

// Used for Agent "ListFiles" tool
export const getProjectFiles = query({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        return await ctx.db
            .query("files")
            .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
            .collect();
    },
});