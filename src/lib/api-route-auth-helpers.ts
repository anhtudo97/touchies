import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

type HelperResult<T = object> = ({ ok: true } & T) | { ok: false; response: NextResponse };

type Has = Awaited<ReturnType<typeof auth>>["has"];

// Reads the authenticated Clerk user, or returns a ready-to-return 401 response.
// `unauthorizedStatus` lets callers preserve a route's existing non-401 status code.
export async function requireAuth(unauthorizedStatus = 401): Promise<HelperResult<{ userId: string; has: Has }>> {
    const { userId, has } = await auth();

    if (!userId) {
        return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: unauthorizedStatus }) };
    }

    return { ok: true, userId, has };
}

// Checks the Clerk "pro" plan entitlement from an already-resolved `has()`.
export function requirePro(has: Has): HelperResult {
    if (!has({ plan: "pro" })) {
        return { ok: false, response: NextResponse.json({ error: "Pro plan required" }, { status: 403 }) };
    }

    return { ok: true };
}

// Reads POLARIS_CONVEX_INTERNAL_KEY, or returns a ready-to-return 500 response.
// `message` lets callers preserve a route's existing error text.
export function requireInternalKey(message = "Server configuration error"): HelperResult<{ internalKey: string }> {
    const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;

    if (!internalKey) {
        return { ok: false, response: NextResponse.json({ error: message }, { status: 500 }) };
    }

    return { ok: true, internalKey };
}

// Fetches the user's GitHub OAuth token via Clerk, or returns a ready-to-return 400 response.
export async function getGithubToken(userId: string): Promise<HelperResult<{ githubToken: string }>> {
    const client = await clerkClient();
    const tokens = await client.users.getUserOauthAccessToken(userId, "github");
    const githubToken = tokens.data[0]?.token;

    if (!githubToken) {
        return {
            ok: false,
            response: NextResponse.json(
                { error: "GitHub not connected. Please reconnect your GitHub account." },
                { status: 400 }
            ),
        };
    }

    return { ok: true, githubToken };
}
