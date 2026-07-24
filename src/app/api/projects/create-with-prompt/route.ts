import { z } from "zod"
import { NextResponse } from "next/server"
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator"

import { DEFAULT_CONVERSATION_TITLE } from "@/features/conversations/constants"

import { inngest } from "@/inngest/client"
import { convex } from "@/lib/convex-client"
import { requireAuth, requireInternalKey } from "@/lib/api-route-auth-helpers"

import { api } from "../../../../../convex/_generated/api"

const requestSchema = z.object({
  prompt: z.string().min(1)
})

export async function POST(request: Request) {
  const authResult = await requireAuth()
  if (!authResult.ok) return authResult.response
  const { userId } = authResult

  const internalKeyResult = requireInternalKey("Internal key not configured")
  if (!internalKeyResult.ok) return internalKeyResult.response
  const { internalKey } = internalKeyResult

  const body = await request.json()
  const { prompt } = requestSchema.parse(body)

  // Generate a random project name
  const projectName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    separator: "-",
    length: 3
  })

  // Create project and conversation together
  const { projectId, conversationId } = await convex.mutation(api.system.createProjectWithConversation, {
    internalKey,
    projectName,
    conversationTitle: DEFAULT_CONVERSATION_TITLE,
    ownerId: userId
  })

  // Create user message
  await convex.mutation(api.system.createMessage, {
    internalKey,
    conversationId,
    projectId,
    role: "user",
    content: prompt
  })

  // Create assistant message placeholder with processing status
  const assistantMessageId = await convex.mutation(api.system.createMessage, {
    internalKey,
    conversationId,
    projectId,
    role: "assistant",
    content: "",
    status: "processing"
  })

  // Trigger Inngest to process the message
  await inngest.send({
    name: "message/sent",
    data: {
      messageId: assistantMessageId,
      conversationId,
      projectId,
      message: prompt
    }
  })

  return NextResponse.json({ projectId })
}
