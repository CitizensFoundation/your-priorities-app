import type { Json } from "../../contracts/index.js";

export function jsonRecord(value: unknown): Record<string, Json> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, Json>;
}

export function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function withoutNullish(value: Record<string, unknown>): Record<string, Json> {
  const result: Record<string, Json> = {};

  for (const [key, entry] of Object.entries(value)) {
    if (entry !== undefined && entry !== null) {
      result[key] = entry as Json;
    }
  }

  return result;
}
