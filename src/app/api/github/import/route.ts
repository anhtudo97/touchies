import { z } from "zod"
import { NextResponse } from "next/server"

import { convex } from "@/lib/convex-client"
import { inngest } from "@/inngest/client"
import { requireAuth, requireInternalKey, requirePro, getGithubToken } from "@/lib/api-route-auth-helpers"

import { api } from "../../../../../convex/_generated/api"

const requestSchema = z.object({
  url: z.url()
})

function parseGitHubUrl(url: string) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) {
    throw new Error("Invalid GitHub URL")
  }

  return { owner: match[1], repo: match[2].replace(/\.git$/, "") }
}

export async function POST(request: Request) {
  const authResult = await requireAuth()
  if (!authResult.ok) return authResult.response
  const { userId, has } = authResult

  const proResult = requirePro(has)
  if (!proResult.ok) return proResult.response

  const body = await request.json()
  const { url } = requestSchema.parse(body)

  const { owner, repo } = parseGitHubUrl(url)
  // https://github.com/AntonioErdeljac/cursor-dev
  // { owner: "AntonioErdeljac", repo: "cursor-dev" }

  const githubTokenResult = await getGithubToken(userId)
  if (!githubTokenResult.ok) return githubTokenResult.response
  const { githubToken } = githubTokenResult

  const internalKeyResult = requireInternalKey()
  if (!internalKeyResult.ok) return internalKeyResult.response
  const { internalKey } = internalKeyResult

  const projectId = await convex.mutation(api.system.createProject, {
    internalKey,
    name: repo,
    ownerId: userId
  })

  const event = await inngest.send({
    name: "github/import.repo",
    data: {
      owner,
      repo,
      projectId,
      githubToken
    }
  })

  return NextResponse.json({
    success: true,
    projectId,
    eventId: event.ids[0]
  })
}
