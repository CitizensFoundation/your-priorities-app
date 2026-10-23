import { type ValidateFunction } from "ajv";
import { z } from "zod";
export declare const manifestSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    assistantName: z.ZodOptional<z.ZodString>;
    version: z.ZodString;
    runtime: z.ZodLiteral<"yp-live-workflow-v1">;
    sdkVersion: z.ZodDefault<z.ZodLiteral<1>>;
    instructions: z.ZodLiteral<"AGENTS.md">;
    graph: z.ZodLiteral<"graph.json">;
    inputSchema: z.ZodOptional<z.ZodString>;
    outputSchema: z.ZodOptional<z.ZodString>;
    modelRoles: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$loose>;
export declare function packageManifest(files: Record<string, string>): {
    [x: string]: unknown;
    id: string;
    name: string;
    version: string;
    runtime: "yp-live-workflow-v1";
    sdkVersion: 1;
    instructions: "AGENTS.md";
    graph: "graph.json";
    modelRoles: string[];
    assistantName?: string | undefined;
    inputSchema?: string | undefined;
    outputSchema?: string | undefined;
};
/** Local draft-07 schemas only. No network resolution or custom executable keywords. */
export declare function packageValidators(files: Record<string, string>): {
    input: ValidateFunction<unknown> | undefined;
    output: ValidateFunction<unknown> | undefined;
};
export declare function validateData(validate: ValidateFunction | undefined, value: unknown, label: string): void;
