import { z } from "zod";
import { NextResponse } from "next/server";

import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import { requireAuth, requireInternalKey } from "@/lib/api-route-auth-helpers";
import { cancelProcessingMessages } from "@/lib/cancel-processing-messages";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const requestSchema = z.object({
    conversationId: z.string(),
    message: z.string(),
});

export async function POST(request: Request) {
    const authResult = await requireAuth();
    if (!authResult.ok) return authResult.response;

    const internalKeyResult = requireInternalKey("Internal key not configured");
    if (!internalKeyResult.ok) return internalKeyResult.response;
    const { internalKey } = internalKeyResult;

    const body = await request.json();
    const { conversationId, message } = requestSchema.parse(body);

    // Call convex mutation, query
    const conversation = await convex.query(api.system.getConversationById, {
        internalKey,
        conversationId: conversationId as Id<"conversations">,
    });

    if (!conversation) {
        return NextResponse.json(
            { error: "Conversation not found" },
            { status: 404 }
        );
    }

    const projectId = conversation.projectId;

    // Cancel any in-flight messages in this project before starting a new one
    await cancelProcessingMessages(internalKey, projectId);

    // Create user message
    await convex.mutation(api.system.createMessage, {
        internalKey,
        conversationId: conversationId as Id<"conversations">,
        projectId,
        role: "user",
        content: message,
    });

    // Create assistant message placeholder with processing status
    const assistantMessageId = await convex.mutation(
        api.system.createMessage,
        {
            internalKey,
            conversationId: conversationId as Id<"conversations">,
            projectId,
            role: "assistant",
            content: "",
            status: "processing",
        }
    );

    // Trigger Inngest to process the message
    const event = await inngest.send({
        name: "message/sent",
        data: {
            messageId: assistantMessageId,
            conversationId,
            projectId,
            message,
        },
    });

    return NextResponse.json({
        success: true,
        eventId: event.ids[0],
        messageId: assistantMessageId,
    });
};
