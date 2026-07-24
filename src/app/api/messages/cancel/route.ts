import { z } from "zod";
import { NextResponse } from "next/server";

import { requireAuth, requireInternalKey } from "@/lib/api-route-auth-helpers";
import { cancelProcessingMessages } from "@/lib/cancel-processing-messages";

import { Id } from "../../../../../convex/_generated/dataModel";

const requestSchema = z.object({
    projectId: z.string(),
});

export async function POST(request: Request) {
    const authResult = await requireAuth();
    if (!authResult.ok) return authResult.response;

    const body = await request.json();
    const { projectId } = requestSchema.parse(body);

    const internalKeyResult = requireInternalKey("Internal key not configured");
    if (!internalKeyResult.ok) return internalKeyResult.response;
    const { internalKey } = internalKeyResult;

    const cancelledIds = await cancelProcessingMessages(internalKey, projectId as Id<"projects">);

    if (cancelledIds.length === 0) {
        return NextResponse.json({ success: true, cancelled: false });
    }

    return NextResponse.json({
        success: true,
        cancelled: true,
        messageIds: cancelledIds,
    });
};
