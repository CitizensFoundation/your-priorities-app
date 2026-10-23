import type { Json } from "../../contracts/index.js";
export declare function jsonRecord(value: unknown): Record<string, Json>;
export declare function stringValue(value: unknown): string | null;
export declare function withoutNullish(value: Record<string, unknown>): Record<string, Json>;
