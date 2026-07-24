import { z } from "zod"
import { NextResponse } from "next/server"

import { convex } from "@/lib/convex-client"
import { inngest } from "@/inngest/client"
import { requireAuth, requireInternalKey } from "@/lib/api-route-auth-helpers"

import { api } from "../../../../../../convex/_generated/api"
import { Id } from "../../../../../../convex/_generated/dataModel"

const requestSchema = z.object({
  projectId: z.string()
})

export async function POST(request: Request) {
  const authResult = await requireAuth()
  if (!authResult.ok) return authResult.response

  const body = await request.json()
  const { projectId } = requestSchema.parse(body)

  const internalKeyResult = requireInternalKey()
  if (!internalKeyResult.ok) return internalKeyResult.response
  const { internalKey } = internalKeyResult

  const event = await inngest.send({
    name: "github/export.cancel",
    data: {
      projectId
    }
  })

  // Update status to cancelled
  await convex.mutation(api.system.updateExportStatus, {
    internalKey,
    projectId: projectId as Id<"projects">,
    status: "cancelled"
  })

  return NextResponse.json({
    success: true,
    projectId,
    eventId: event.ids[0]
  })
}
