import { jsonrepair } from "jsonrepair";

/** Local syntax repair only: never repeats a paid provider request. */
export function modelJson(content: string): YpWorkflowJson {
  const text = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  try {
    return JSON.parse(text) as YpWorkflowJson;
  } catch {
    try {
      return JSON.parse(jsonrepair(text)) as YpWorkflowJson;
    } catch {
      throw Object.assign(
        new Error("Model returned invalid JSON after local repair"),
        { code: "record_invalid" },
      );
    }
  }
}
