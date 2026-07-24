import { z } from "zod"
import { NextResponse } from "next/server"

import { inngest } from "@/inngest/client"
import { requireAuth, requireInternalKey, requirePro, getGithubToken } from "@/lib/api-route-auth-helpers"

const requestSchema = z.object({
  projectId: z.string(),
  repoName: z.string().min(1).max(100),
  visibility: z.enum(["public", "private"]).default("private"),
  description: z.string().max(350).optional()
})

export async function POST(request: Request) {
  const authResult = await requireAuth()
  if (!authResult.ok) return authResult.response
  const { userId, has } = authResult

  const proResult = requirePro(has)
  if (!proResult.ok) return proResult.response

  const body = await request.json()
  const { projectId, repoName, visibility, description } = requestSchema.parse(body)

  const githubTokenResult = await getGithubToken(userId)
  if (!githubTokenResult.ok) return githubTokenResult.response
  const { githubToken } = githubTokenResult

  const internalKeyResult = requireInternalKey()
  if (!internalKeyResult.ok) return internalKeyResult.response
  const { internalKey } = internalKeyResult

  const event = await inngest.send({
    name: "github/export.repo",
    data: {
      projectId,
      repoName,
      visibility,
      description,
      githubToken,
      internalKey
    }
  })

  return NextResponse.json({
    success: true,
    projectId,
    eventId: event.ids[0]
  })
}
