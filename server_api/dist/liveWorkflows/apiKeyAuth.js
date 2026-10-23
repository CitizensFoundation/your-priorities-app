import { z } from "zod";
// No provider requests or environment fallback: credentials must be supplied explicitly.
export const openAiApiKeySchema = z
    .string()
    .trim()
    .min(20)
    .max(512)
    .regex(/^sk-[A-Za-z0-9_-]+$/);
export const apiKeyMaterialSchema = z
    .object({ apiKey: openAiApiKeySchema })
    .strict();
