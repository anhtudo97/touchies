// Shared shape for Inngest `onFailure` handlers in this codebase: read
// POLARIS_CONVEX_INTERNAL_KEY (no-op if missing, matching each function's main
// handler which already throws a NonRetriableError on the same check), pull the
// original event payload out of the failure envelope, then run the
// status-update mutation inside a single step.
type FailureHandlerArgs = {
    event: { data: { event: { data: unknown } } };
    step: { run: <T>(name: string, fn: () => Promise<T>) => Promise<T> };
};

export function withInternalKeyFailureHandler<TEventData>(
    stepName: string,
    updateOnFailure: (internalKey: string, eventData: TEventData) => Promise<void>
) {
    return async ({ event, step }: FailureHandlerArgs) => {
        const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;
        if (!internalKey) return;

        const eventData = event.data.event.data as TEventData;

        await step.run(stepName, () => updateOnFailure(internalKey, eventData));
    };
}
