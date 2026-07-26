import { z, ZodType } from "zod";
import { createTool, MaybePromise, StateData, Tool } from "@inngest/agent-kit";

// Shared shape for this project's file-tool handlers: safeParse `params`
// against an internal (stricter) schema, run the tool body, and normalize any
// thrown error into the same "Error: <message>" string the agent expects back
// instead of a thrown exception or a silently swallowed result.
export function createValidatedTool<
    TName extends string,
    TParameters extends Tool.Input,
    TParamsSchema extends ZodType,
    TOutput
>({
    name,
    description,
    parameters,
    paramsSchema,
    run,
}: {
    name: TName;
    description: string;
    parameters: TParameters;
    paramsSchema: TParamsSchema;
    run: (data: z.infer<TParamsSchema>, opts: Tool.Options<StateData>) => MaybePromise<TOutput>;
}): Tool<TName, TParameters, TOutput | string> {
    return createTool({
        name,
        description,
        parameters,
        handler: async (params, opts) => {
            const parsed = paramsSchema.safeParse(params);

            if (!parsed.success) {
                return `Error: ${parsed.error.issues[0]?.message ?? parsed.error.message}`;
            }

            try {
                return await run(parsed.data, opts);
            } catch (error) {
                return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
            }
        },
    });
}
