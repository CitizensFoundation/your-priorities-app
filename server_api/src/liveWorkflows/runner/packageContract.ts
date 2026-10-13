import { Ajv, type ValidateFunction } from "ajv";
import { z } from "zod";
import { identifier } from "../schemas.js";

const schemaPath = z.string().regex(/^schemas\/[\w-]+\.json$/);
export const manifestSchema = z
  .object({
    id: identifier,
    name: z.string().min(1).max(160),
    assistantName: z.string().trim().min(1).max(80).optional(),
    version: z.string().min(1).max(80),
    runtime: z.literal("yp-live-workflow-v1"),
    sdkVersion: z.literal(1).default(1),
    instructions: z.literal("AGENTS.md"),
    graph: z.literal("graph.json"),
    inputSchema: schemaPath.optional(),
    outputSchema: schemaPath.optional(),
    modelRoles: z
      .array(identifier)
      .min(1)
      .max(20)
      .refine(
        (roles) =>
          roles.includes("default") && new Set(roles).size === roles.length,
        "Model roles must be unique and include default",
      )
      .default(["default", "review"]),
  })
  .passthrough();

export function packageManifest(files: Record<string, string>) {
  const manifest = manifestSchema.parse(JSON.parse(files["manifest.json"]));
  for (const file of [
    manifest.instructions,
    manifest.inputSchema,
    manifest.outputSchema,
  ])
    if (file && !files[file])
      throw new Error(`Missing package contract file: ${file}`);
  return manifest;
}

/** Local draft-07 schemas only. No network resolution or custom executable keywords. */
export function packageValidators(files: Record<string, string>) {
  const manifest = packageManifest(files);
  const ajv = new Ajv({
    strict: false,
    allErrors: false,
    validateFormats: false,
  });
  const compile = (file?: string) =>
    file ? ajv.compile(JSON.parse(files[file])) : undefined;
  return {
    input: compile(manifest.inputSchema),
    output: compile(manifest.outputSchema),
  };
}
export function validateData(
  validate: ValidateFunction | undefined,
  value: unknown,
  label: string,
) {
  if (validate && !validate(value)) {
    const issue = validate.errors?.[0];
    throw new Error(
      `${label} does not match its package schema: ${issue?.instancePath || "/"} ${issue?.message ?? "invalid data"}`,
    );
  }
}
