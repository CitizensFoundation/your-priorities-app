/** Stable chunking keeps retries idempotent and avoids huge API/DB payloads. */
export declare function resultChunks(output: YpWorkflowJson): string[];
