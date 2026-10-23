import { z } from "zod";
export declare const openAiApiKeySchema: z.ZodString;
export declare const apiKeyMaterialSchema: z.ZodObject<{
    apiKey: z.ZodString;
}, z.core.$strict>;
export type ApiKeyMaterial = z.infer<typeof apiKeyMaterialSchema>;
