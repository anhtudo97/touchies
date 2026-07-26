import { NonRetriableError } from "inngest";

// Reads POLARIS_CONVEX_INTERNAL_KEY, or throws the same NonRetriableError every
// Inngest function handler already throws on this check.
export function requireInternalKey(): string {
    const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;

    if (!internalKey) {
        throw new NonRetriableError("POLARIS_CONVEX_INTERNAL_KEY is not configured");
    }

    return internalKey;
}
