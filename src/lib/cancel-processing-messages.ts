import { convex } from "@/lib/convex-client";
import { inngest } from "@/inngest/client";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Cancels every in-flight (status "processing") message for a project: sends
// a "message/cancel" event and marks it cancelled in Convex. Returns the
// cancelled message ids (empty array if none were processing).
export async function cancelProcessingMessages(internalKey: string, projectId: Id<"projects">) {
    const processingMessages = await convex.query(api.system.getProcessingMessages, {
        internalKey,
        projectId,
    });

    return Promise.all(
        processingMessages.map(async (message) => {
            await inngest.send({
                name: "message/cancel",
                data: { messageId: message._id },
            });

            await convex.mutation(api.system.updateMessageStatus, {
                internalKey,
                messageId: message._id,
                status: "cancelled",
            });

            return message._id;
        })
    );
}
